import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

// ➕ add item
router.post("/add", addToCart);

// 📦 get cart
router.get("/", getCart);

// ❌ remove item
router.delete("/remove", removeFromCart);

export default router;