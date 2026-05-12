import express from 'express';
const router = express.Router();
import foodDiscountController from '../controllers/foodDiscount.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js'; 
import multer from 'multer';

// post /api/food-discount/discount
router.post('/discount',authMiddleware.foodPartnerId , foodDiscountController.createFoodDiscount)

// get /api/food-discount/discount
router.get('/discount', foodDiscountController.foodDiscountView)

router.get('/my-discounts', authMiddleware.foodPartnerId, foodDiscountController.getPartnerDiscounts);

router.delete('/discount/:discountId', authMiddleware.foodPartnerId, foodDiscountController.deleteFoodDiscount);

export default router;