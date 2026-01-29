import {
  changePassword,
  exchangeGoogleCode,
  getGoogleAuthUrl,
  loginUser,
  resetPasswordWithToken,
  sendResetPasswordEmail,
  signUpUser,
} from "./auth.services.js";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
} from "./auth.validation.js";
import supabase from "../../configs/supabase.config.js";

export const signUp = async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten().fieldErrors);
  }

  try {
    const { email, password, full_name } = parsed.data;
    await signUpUser({ email, password, full_name });
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json(parsed.error.flatten().fieldErrors);
  }

  try {
    const session = await loginUser(parsed.data.email, parsed.data.password);

    const cookieOptions = {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 1000, // 1 hour
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    res.cookie("access_token", session.access_token, cookieOptions);

    if (session.refresh_token) {
      res.cookie("refresh_token", session.refresh_token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ error: "Invalid credentials" });
  }
};

export const googleLogin = async (req, res) => {
  const url = await getGoogleAuthUrl();
  res.redirect(url);
};

/* GOOGLE CALLBACK */
export const googleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) {
    console.error("No code provided in Google callback");
    return res.redirect(`${process.env.CLIENT_URL}/signin?error=NoCode`);
  }

  try {
    const session = await exchangeGoogleCode(code);

    if (!session || !session.access_token) {
      throw new Error("No session or access token received from Google");
    }

    const cookieOptions = {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 1000, // 1 hour
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    // Set access token cookie
    res.cookie("access_token", session.access_token, cookieOptions);

    // Set refresh token cookie if available
    if (session.refresh_token) {
      res.cookie("refresh_token", session.refresh_token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }

    console.log(
      "Google OAuth successful, redirecting to:",
      process.env.CLIENT_URL,
    );
    res.redirect(process.env.CLIENT_URL);
  } catch (error) {
    console.error("Google login error:", error.message || error);
    res.redirect(`${process.env.CLIENT_URL}/signin?error=LoginFailed`);
  }
};

/* LOGOUT */
export const logout = async (req, res) => {
  const cookieOptions = {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res.clearCookie("access_token", cookieOptions);
  res.clearCookie("refresh_token", cookieOptions);
  res.json({ message: "Logged out" });
};

export const forgotPassword = async (req, res) => {
  const parsed = forgotPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  try {
    await sendResetPasswordEmail(parsed.data.email);
    res.json({ message: "Password reset email sent" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const parsed = resetPasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  try {
    await resetPasswordWithToken(
      parsed.data.access_token,
      parsed.data.new_password,
    );
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const changePasswordController = async (req, res) => {
  const parsed = changePasswordSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());

  try {
    const user = await changePassword(req.user.id, parsed.data.new_password);

    // Generate new session after password change
    const { data: sessionData, error: sessionError } =
      await supabase.auth.signInWithPassword({
        email: user.email,
        password: parsed.data.new_password,
      });

    if (sessionError) throw sessionError;

    const cookieOptions = {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    // Set new cookie with fresh session
    res.cookie("access_token", sessionData.session.access_token, cookieOptions);

    if (sessionData.session.refresh_token) {
      res.cookie("refresh_token", sessionData.session.refresh_token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMe = (req, res) => {
  res.json({ user: req.user });
};
