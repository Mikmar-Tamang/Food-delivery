import orderService from "../services/order.service.js";

// User creates order from basket
const createOrder = async (req, res) => {
      console.log("✅ createOrder function STARTED"); // Debug
  console.log("req.user:", req.user); // Debug

  try {
     console.log("📦 Getting deliveryDetails from body");
    const { deliveryDetails } = req.body;
    console.log("deliveryDetails:", deliveryDetails);
    const userId = req.user._id;
     console.log("userId:", userId);
    
     console.log("🏗️ Calling orderService.createOrder...");
    const order = await orderService.createOrder(userId, deliveryDetails);
     console.log("✅ Order created successfully:", order.orderNumber);
    
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: order
    });
  } catch (error) {
     console.log("❌ Error in createOrder:", error.message);
    console.log("Full error:", error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get partner's orders
const getPartnerOrders = async (req, res) => {
  try {
    const partnerId = req.foodPartner._id;
    const { status } = req.query;
    
    const orders = await orderService.getPartnerOrders(partnerId, status);
    
    res.status(200).json({
      success: true,
      orders: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single order details
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const partnerId = req.foodPartner._id;
    
    const order = await orderService.getOrderById(orderId, partnerId);
    
    res.status(200).json({
      success: true,
      order: order
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// Accept order
const acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const partnerId = req.foodPartner._id;
    
    const order = await orderService.acceptOrder(orderId, partnerId);
    
    res.status(200).json({
      success: true,
      message: "Order accepted successfully",
      order: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Reject order
const rejectOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const partnerId = req.foodPartner._id;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required"
      });
    }
    
    const order = await orderService.rejectOrder(orderId, partnerId, reason);
    
    res.status(200).json({
      success: true,
      message: "Order rejected",
      order: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Mark order as ready
const markOrderReady = async (req, res) => {
  try {
    const { orderId } = req.params;
    const partnerId = req.foodPartner._id;
    
    const order = await orderService.markOrderReady(orderId, partnerId);
    
    res.status(200).json({
      success: true,
      message: "Order marked as ready",
      order: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Mark order as delivered
const markOrderDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    const partnerId = req.foodPartner._id;
    
    const order = await orderService.markOrderDelivered(orderId, partnerId);
    
    res.status(200).json({
      success: true,
      message: "Order marked as delivered",
      order: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Get order stats for dashboard
const getOrderStats = async (req, res) => {
  try {
    const partnerId = req.foodPartner._id;
    const stats = await orderService.getOrderStats(partnerId);
    
    res.status(200).json({
      success: true,
      stats: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  createOrder,
  getPartnerOrders,
  getOrderDetails,
  acceptOrder,
  rejectOrder,
  markOrderReady,
  markOrderDelivered,
  getOrderStats
};