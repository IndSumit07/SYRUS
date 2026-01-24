import express from "express";
import {
  signUp,
  login,
  logout,
  googleLogin,
  googleCallback,
} from "./auth.controller.js";
import { authLimiter } from "../../middlewares/rateLimiter.js";

const authRouter = express.Router();

authRouter.post("/signup", authLimiter, signUp);
authRouter.post("/login", authLimiter, login);
authRouter.post("/logout", logout);

authRouter.get("/google", googleLogin);
authRouter.get("/google/callback", googleCallback);

export default authRouter;
