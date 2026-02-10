import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  verifyOtp,
  forgotPassword,
  resetPassword,
} from "./auth.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { authLimiter } from "../../middlewares/rateLimiter.js";

const router = express.Router();

router.use(authLimiter);

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logoutUser);
router.get("/profile", protect, getUserProfile);
router.get("/me", protect, getUserProfile); // Alias for consistency

export default router;
