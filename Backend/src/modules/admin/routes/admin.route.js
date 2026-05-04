import express from "express";
import authMiddleware from "../../../middlewares/auth.middleware.js";
import adminController from "../controllers/admin.controller.js";
import isAdmin from "../../../middlewares/admin.middleware.js";

const router = express.Router();

router.use(authMiddleware.authMiddleware);
router.use(isAdmin);

// partner routes
router.get("/partners", adminController.getAllPartners);
router.get("/partners/pending", adminController.getPendingPartners);
router.patch("/partners/:id/approve", adminController.approvePartner);
router.patch("/partners/:id/reject", adminController.rejectPartner);
router.patch("/partners/:id/ban", adminController.banPartner);

// user routes
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/ban", adminController.banUser);

// dashboard
router.get("/dashboard", adminController.getDashboardStats);

export default router;
