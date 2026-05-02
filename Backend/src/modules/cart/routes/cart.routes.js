import express from "express";
import authMiddleware from "../../../middlewares/auth.middleware.js";
import cartController from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add", authMiddleware.userId, cartController.addToCart);

router.get("/", authMiddleware.userId, cartController.getCart);

router.delete("/remove", authMiddleware.userId, cartController.removeFromCart);

export default router;