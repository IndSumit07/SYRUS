import { getGoogleAuthUrl, loginUser, signUpUser } from "./auth.services.js";
import { loginSchema, signupSchema } from "./auth.validation.js";

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
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
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
  res.redirect("http://localhost:5173");
};

/* LOGOUT */
export const logout = async (req, res) => {
  res.clearCookie("access_token");
  res.json({ message: "Logged out" });
};
