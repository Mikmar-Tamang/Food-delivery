import express from 'express';
const router = express.Router();
import foodDiscountController from '../controllers/foodDiscount.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js'; 
import multer from 'multer';

// post /api/food-discount/discount
router.post('/discount',authMiddleware.foodPartnerId , foodDiscountController.createFoodDiscount)

// get /api/food-discount/discount
router.get('/discount', authMiddleware.userId, foodDiscountController.foodDiscountView)

export default router;