import adminService from "../services/admin.service.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();

    res.status(200).json({
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllPartners = async (req, res) => {
  try {
    const partners = await adminService.getAllPartners();

    res.status(200).json({
      message: "Food partners fetched successfully",
      data: partners,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getPendingPartners = async (req, res) => {
  try {
    const partners = await adminService.getPendingPartners();

    res.status(200).json({
      message: "Pending partners fetched successfully",
      data: partners,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const approvePartner = async (req, res) => {
  try {
    const partner = await adminService.approvePartner(req.params.id);

    res.status(200).json({
      message: "Partner approved successfully",
      data: partner,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const rejectPartner = async (req, res) => {
  try {
    const partner = await adminService.rejectPartner(req.params.id);

    res.status(200).json({
      message: "Partner rejected successfully",
      data: partner,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const banUser = async (req, res) => {
  try {
    const user = await adminService.banUser(req.params.id);

    res.status(200).json({
      message: "User banned successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const banPartner = async (req, res) => {
  try {
    const partner = await adminService.banPartner(req.params.id);

    res.status(200).json({
      message: "Food partner banned successfully",
      data: partner,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();

    res.status(200).json({
      message: "Dashboard stats fetched successfully",
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
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
}