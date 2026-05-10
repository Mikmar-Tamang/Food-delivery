import express from 'express';
const router = express.Router();
import orderController from '../controllers/order.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

// User routes (protected by userId middleware)
router.post('/checkout', authMiddleware.userId, orderController.createOrder);

// Partner routes (protected by foodPartnerId middleware)
router.get('/partner/orders', authMiddleware.foodPartnerId, orderController.getPartnerOrders);
router.get('/partner/orders/:orderId', authMiddleware.foodPartnerId, orderController.getOrderDetails);
router.patch('/partner/orders/:orderId/accept', authMiddleware.foodPartnerId, orderController.acceptOrder);
router.patch('/partner/orders/:orderId/reject', authMiddleware.foodPartnerId, orderController.rejectOrder);
router.patch('/partner/orders/:orderId/ready', authMiddleware.foodPartnerId, orderController.markOrderReady);
router.patch('/partner/orders/:orderId/delivered', authMiddleware.foodPartnerId, orderController.markOrderDelivered);
router.get('/partner/stats', authMiddleware.foodPartnerId, orderController.getOrderStats);

console.log('Order routes loaded');
console.log('authMiddleware.userId type:', typeof authMiddleware.userId);
console.log('orderController.createOrder type:', typeof orderController.createOrder);

export default router;