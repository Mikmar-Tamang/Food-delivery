import FoodPartner from "../modules/food-partner/food-partner.model.js";
import User from "../modules/user/user.model.js";
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
  if (req.method === 'OPTIONS') {
    return next();
  }
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
  if (req.method === 'OPTIONS') {
    return next();
  }
  
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

const authMiddleware = (req, res, next) => {
  const decoded = getTokenData(req);

  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.userId = decoded.id;
  next();
};

export default {foodPartnerId, userId, getTokenData, authMiddleware};