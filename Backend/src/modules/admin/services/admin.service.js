import User from '../../user/user.model.js';
import FoodPartner from '../../food-partner/food-partner.model.js';

export const getAllUsers = async () => {
  const users = await User.find().select("-password");
  return users;
};

export const getAllPartners = async () => {
  const partners = await FoodPartner.find();
  return partners;
};

export const getPendingPartners = async () => {
  const partners = await FoodPartner.find({ status: "PENDING" });
  return partners;
};

export const approvePartner = async (partnerId) => {
  const partner = await FoodPartner.findById(partnerId);

  if (!partner) {
    throw new Error("Food partner not found");
  }

  partner.status = "APPROVED";
  await partner.save();

  return partner;
};

export const rejectPartner = async (partnerId) => {
  const partner = await FoodPartner.findById(partnerId);

  if (!partner) {
    throw new Error("Food partner not found");
  }

  partner.status = "REJECTED";
  await partner.save();

  return partner;
};

export const banUser = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.isBanned = true;
  await user.save();

  return user;
};

export const banPartner = async (partnerId) => {
  const partner = await FoodPartner.findById(partnerId);

  if (!partner) {
    throw new Error("Food partner not found");
  }

  partner.isBanned = true;
  await partner.save();

  return partner;
};

export const getDashboardStats = async () => {
  const totalUsers = await User.countDocuments();
  const totalPartners = await FoodPartner.countDocuments();
  const pendingPartners = await FoodPartner.countDocuments({ status: "PENDING" });
  const bannedUsers = await User.countDocuments({ isBanned: true });

  return {
    totalUsers,
    totalPartners,
    pendingPartners,
    bannedUsers,
  };
};

export default {
  getAllUsers,
  getAllPartners,
  getPendingPartners,
  approvePartner,
  rejectPartner,
  banUser,
  banPartner,
  getDashboardStats
};