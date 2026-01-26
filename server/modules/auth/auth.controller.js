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

    res.cookie("access_token", session.access_token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({ message: "Login successful" });
  } catch {
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

  if (code) {
    try {
      const session = await exchangeGoogleCode(code);

      res.cookie("access_token", session.access_token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
      res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      console.error("Google login error:", error);
      res.redirect(`${process.env.CLIENT_URL}/signin?error=LoginFailed`);
    }
  } else {
    res.redirect(`${process.env.CLIENT_URL}/signin?error=NoCode`);
  }
};

/* LOGOUT */
export const logout = async (req, res) => {
  res.clearCookie("access_token", { path: "/" });
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

    // Set new cookie with fresh session
    res.cookie("access_token", sessionData.session.access_token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMe = (req, res) => {
  res.json({ user: req.user });
};
