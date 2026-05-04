import express from 'express';
const router = express.Router();
import authController from '../controllers/auth.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';
import multer from 'multer';

// user registration and login routes
router.post('/user/register', authController.RegisterUser);
router.get("/user/verify-email", authController.userVerifyEmail);
router.post("/user/resend-verification", authController.userResendVerification);
router.post('/user/login', authController.userLogin);
router.post('/user/logout', authController.userLogout);

// food-partner registeration and login routes

const uploadPp= multer({
    storage: multer.memoryStorage(),
})

router.post('/food-partner/register', uploadPp.single('restaurantPp'), authController.foodPartnerRegister);
router.post('/food-partner/login', authController.foodPartnerLogin);
router.get('/food-partner/logout', authController.foodPartnerLogout);

router.get('/user/me', authMiddleware.userId , authController.getMe);

export default router;