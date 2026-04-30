import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

// ➕ add item
router.post("/add", authMiddleware.userId, addToCart);

// 📦 get cart
router.get("/", authMiddleware.userId, getCart);

// ❌ remove item
router.delete("/remove", authMiddleware.userId, removeFromCart);

export default router;