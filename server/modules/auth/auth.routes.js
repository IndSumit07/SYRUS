import express from "express";
import {
  signUp,
  login,
  logout,
  googleLogin,
  googleCallback,
  forgotPassword,
  resetPassword,
  changePasswordController,
  getMe,
} from "./auth.controller.js";
import { authLimiter } from "../../middlewares/rateLimiter.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", authLimiter, signUp);
authRouter.post("/login", authLimiter, login);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, getMe);

authRouter.get("/google", googleLogin);
authRouter.get("/google/callback", googleCallback);

authRouter.post("/forgot-password", authLimiter, forgotPassword);
authRouter.post("/reset-password", resetPassword);
authRouter.post("/change-password", requireAuth, changePasswordController);

export default authRouter;
