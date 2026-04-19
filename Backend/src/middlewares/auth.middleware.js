import FoodPartner from "../models/food-partner.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const getTokenData = (req) => {
  const token = req.cookies.token;

  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

const foodPartnerId = async (req, res, next) => {
  const decoded = getTokenData(req);

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const foodPartner = await FoodPartner.findById(decoded.id);

  if (!foodPartner) {
    return res.status(401).json({ message: "Food partner not found" });
  }

  req.foodPartner = foodPartner;
  next();
};

const userId = async (req, res, next) => {
  const decoded = getTokenData(req);

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user = user;
  next();
};

export default {foodPartnerId, userId};