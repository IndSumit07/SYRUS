import User from "../../models/User.model.js";
import Activity from "../../models/Activity.model.js";
import sendEmail from "../../utils/sendEmail.js";
import crypto from "crypto";
import {
  generateToken,
  generateRefreshToken,
} from "../../utils/generateToken.js";

// Helper to generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      if (!userExists.isVerified) {
        // Resend OTP logic could go here, or tell them to check email
        // For now, let's treat existing unverified user as a valid re-registration attempt or just block
        // To be clean: If exists and verified -> error. If exists and unverified -> update OTP and resend.
      } else {
        return res.status(400).json({ message: "User already exists" });
      }
    }

    let user = userExists;

    if (!user) {
      user = await User.create({
        name,
        email,
        password,
      });

      // Log activity
      await Activity.create({
        user: user._id,
        type: "account_created",
        details: {},
      });
    } else {
      // Update password if they re-register with new password? Or keep old?
      // Let's assume re-registration updates password for unverified users.
      user.name = name;
      user.password = password; // Will be hashed by pre-save
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    const message = `Your verification code is: ${otp}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Verify your account",
        message,
        html: `<h1>Verifiy your account</h1><p>Your verification code is: <b>${otp}</b></p>`,
      });

      res.status(201).json({
        message:
          "User registered. Please check your email for verification OTP.",
        email: user.email,
      });
    } catch (error) {
      // If email fails, user is created but can't verify. Maybe allow resend.
      console.error(error);
      res
        .status(500)
        .json({ message: "Email could not be sent. Please try again." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (user.isVerified) {
      return res
        .status(200)
        .json({ message: "User already verified. Please login." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res
      .status(200)
      .json({ message: "Account verified successfully. Please login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res
          .status(401)
          .json({ message: "Please verify your email first." });
      }

      const accessToken = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: accessToken,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    const message = `Your password reset code is: ${otp}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message,
        html: `<h1>Password Reset Request</h1><p>Your password reset code is: <b>${otp}</b></p>`,
      });
      res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpires = undefined;
      await user.save();
      res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetPasswordOtp: otp,
      resetPasswordOtpExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP or expired" });
    }

    user.password = newPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = (req, res) => {
  res.cookie("access_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie("refresh_token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
