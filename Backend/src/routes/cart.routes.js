import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/add", authMiddleware.userId, addToCart);

router.get("/", authMiddleware.userId, getCart);

router.delete("/remove", authMiddleware.userId, removeFromCart);

export default router;