import Order from '../models/order.model.js';
import Basket from '../../cart/models/baseket.js';
import FoodModel from '../../food/models/food.model.js';
import User from '../../user/user.model.js';
import FoodPartner from '../../food-partner/food-partner.model.js';

// Create order from basket
const createOrder = async (userId, deliveryDetails) => {
     console.log("1️⃣ createOrder started");

     console.log("2️⃣ About to find basket");
  // Get user's basket
  const basket = await Basket.findOne({ userId }).populate('items.foodId');
   console.log("3️⃣ Basket found:", basket ? "Yes" : "No");
  
  if (!basket || basket.items.length === 0) {
    throw new Error("Basket is empty");
  }

   console.log("4️⃣ Basket has items:", basket.items.length);

   console.log("5️⃣ About to find user");

  // Get user details
  const user = await User.findById(userId);

  console.log("6️⃣ User found:", user ? user.username : "No");
  if (!user) {
    throw new Error("User not found");
  }

    console.log("7️⃣ Starting to process items");


  // Process items and calculate totals
  const items = [];
  let subtotal = 0;
  let partnerId = null;
  let restaurantName = "";

  for (const item of basket.items) {
    const food = item.foodId;
    
    // Get partner info from first item
    if (!partnerId) {
      const partner = await FoodPartner.findById(food.foodPartner);
      partnerId = food.foodPartner;
      restaurantName = partner.restaurantName;
    }
    
    // Verify all items are from same restaurant
    if (food.foodPartner.toString() !== partnerId.toString()) {
      throw new Error("All items must be from the same restaurant");
    }

    items.push({
      foodId: food._id,
      name: food.name,
      price: food.price,
      quantity: item.quantity
    });
    
    subtotal += food.price * item.quantity;
  }

  const deliveryFee = 50;
  const totalAmount = subtotal + deliveryFee;

    console.log("8️⃣ About to call Order.create");
    const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

  // Create order
  const order = await Order.create({
    orderNumber,
    user: {
      id: userId,
      name: user.username,  
      email: user.email,
      phone: deliveryDetails.phone
    },
    partner: {
      id: partnerId,
      restaurantName: restaurantName
    },
    items: items,
    subtotal: subtotal,
    deliveryFee: deliveryFee,
    totalAmount: totalAmount,
    paymentMethod: "cod",
    deliveryAddress: {
      street: deliveryDetails.street,
      city: deliveryDetails.city,
      area: deliveryDetails.area,
      landmark: deliveryDetails.landmark || "",
      phone: deliveryDetails.phone
    },
    status: "pending"
  });
  console.log("9️⃣ Order.create completed");

  // Clear the basket
  await Basket.findOneAndDelete({ userId });

  return order;
};

// Get all orders for a partner
const getPartnerOrders = async (partnerId, status = null) => {
  const query = { 'partner.id': partnerId };
  if (status && status !== 'all') {
    query.status = status;
  }
  
  const orders = await Order.find(query).sort({ createdAt: -1 });
  return orders;
};

// Get single order details
const getOrderById = async (orderId, partnerId) => {
  const order = await Order.findOne({ 
    _id: orderId, 
    'partner.id': partnerId 
  });
  
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};

// Accept order
const acceptOrder = async (orderId, partnerId) => {
  const order = await Order.findOne({ 
    _id: orderId, 
    'partner.id': partnerId,
    status: 'pending'
  });
  
  if (!order) {
    throw new Error("Order not found or already processed");
  }
  
  order.status = 'accepted';
  order.acceptedAt = new Date();
  
  await order.save();
  return order;
};

// Reject order
const rejectOrder = async (orderId, partnerId, reason) => {
  const order = await Order.findOne({ 
    _id: orderId, 
    'partner.id': partnerId,
    status: 'pending'
  });
  
  if (!order) {
    throw new Error("Order not found or already processed");
  }
  
  order.status = 'rejected';
  order.rejectionReason = reason;
  order.rejectedAt = new Date();
  
  await order.save();
  return order;
};

// Mark order as ready
const markOrderReady = async (orderId, partnerId) => {
  const order = await Order.findOne({ 
    _id: orderId, 
    'partner.id': partnerId,
    status: 'accepted'
  });
  
  if (!order) {
    throw new Error("Order not found or not in accepted status");
  }
  
  order.status = 'ready';
  order.readyAt = new Date();
  
  await order.save();
  return order;
};

// Mark order as delivered
const markOrderDelivered = async (orderId, partnerId) => {
  const order = await Order.findOne({ 
    _id: orderId, 
    'partner.id': partnerId,
    status: 'ready'
  });
  
  if (!order) {
    throw new Error("Order not found or not in ready status");
  }
  
  order.status = 'delivered';
  order.deliveredAt = new Date();
  
  await order.save();
  return order;
};

// Get order statistics for partner dashboard
const getOrderStats = async (partnerId) => {
  const stats = await Order.aggregate([
    { $match: { 'partner.id': partnerId } },
    { $group: {
      _id: null,
      totalOrders: { $sum: 1 },
      pendingOrders: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
      acceptedOrders: { $sum: { $cond: [{ $eq: ['$status', 'accepted'] }, 1, 0] } },
      readyOrders: { $sum: { $cond: [{ $eq: ['$status', 'ready'] }, 1, 0] } },
      deliveredOrders: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
      rejectedOrders: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
      totalRevenue: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, '$totalAmount', 0] } }
    }}
  ]);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = await Order.countDocuments({
    'partner.id': partnerId,
    createdAt: { $gte: today }
  });
  
  return {
    totalOrders: stats[0]?.totalOrders || 0,
    pendingOrders: stats[0]?.pendingOrders || 0,
    acceptedOrders: stats[0]?.acceptedOrders || 0,
    readyOrders: stats[0]?.readyOrders || 0,
    deliveredOrders: stats[0]?.deliveredOrders || 0,
    rejectedOrders: stats[0]?.rejectedOrders || 0,
    totalRevenue: stats[0]?.totalRevenue || 0,
    todayOrders: todayOrders
  };
};

export default {
  createOrder,
  getPartnerOrders,
  getOrderById,
  acceptOrder,
  rejectOrder,
  markOrderReady,
  markOrderDelivered,
  getOrderStats
};