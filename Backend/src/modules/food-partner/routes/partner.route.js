// backend/routes/foodPartner.routes.js
import express from 'express';
import authMiddleware from '../../../middlewares/auth.middleware.js';
import FoodPartner from '../food-partner.model.js';
import orderController from '../../order/controllers/order.controller.js';

const router = express.Router();

// Apply foodPartnerId middleware to ALL routes in this file
router.use(authMiddleware.foodPartnerId);

// Get food partner profile
router.get('/profile', async (req, res) => {
  try {
    const foodPartner = req.foodPartner;
    
    // Remove password from response
    const { password, ...partnerData } = foodPartner.toObject();
    
    res.json({
      success: true,
      foodPartner: partnerData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const foodPartner = req.foodPartner;
    
    // TODO: Add your actual stats logic here
    // For now, return placeholder stats
    const stats = {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalRevenue: 0,
      todayOrders: 0,
      restaurantName: foodPartner.restaurantName,
      status: foodPartner.status,
      isBanned: foodPartner.isBanned
    };
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update food partner profile
router.put('/profile', async (req, res) => {
  try {
    const { name, restaurantName, restaurantAddress } = req.body;
    const foodPartnerId = req.foodPartner._id;
    
    const updatedPartner = await FoodPartner.findByIdAndUpdate(
      foodPartnerId,
      { name, restaurantName, restaurantAddress },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedPartner) {
      return res.status(404).json({ message: "Food partner not found" });
    }
    
    res.json({
      success: true,
      message: "Profile updated successfully",
      foodPartner: updatedPartner
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get partner orders (you'll implement this with your order model)
router.get('/orders', async (req, res) => {
  try {
    const foodPartner = req.foodPartner;
    
    // TODO: Fetch orders for this restaurant
    // const orders = await Order.find({ restaurantId: foodPartner._id });
    
    res.json({
      success: true,
      orders: [] // Placeholder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (example endpoint)
router.put('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    // TODO: Update order status
    // const order = await Order.findOneAndUpdate(
    //   { _id: orderId, restaurantId: req.foodPartner._id },
    //   { status },
    //   { new: true }
    // );
    
    res.json({
      success: true,
      message: "Order status updated"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get menu items (example endpoint)
router.get('/menu', async (req, res) => {
  try {
    // TODO: Fetch menu items for this restaurant
    res.json({
      success: true,
      menu: [] // Placeholder
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add menu item (example endpoint)
router.post('/menu', async (req, res) => {
  try {
    // TODO: Add menu item
    res.json({
      success: true,
      message: "Menu item added"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Replace the placeholder /stats endpoint with:
router.get('/stats', orderController.getOrderStats);

export default router;