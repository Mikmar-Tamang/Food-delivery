import express from 'express';
const router = express.Router();
import foodController from '../controllers/food.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js'; 
import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
}); 


// post /api/food [protected] - create a new food item
router.post('/', authMiddleware.foodPartnerId, upload.single('image'), foodController.createFood);

// get /api/food [protected]  food view for customers
router.get('/', authMiddleware.userId, foodController.getAllFood)


export default router;