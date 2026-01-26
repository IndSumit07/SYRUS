import supabase from "../configs/supabase.config.js";
export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Verify token with Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      return res
        .status(401)
        .json({ message: "Invalid or expired token", error: error?.message });
    }

    const metadata =
      data.user.user_metadata || data.user.raw_user_meta_data || {};

    // Attach user to request
    req.user = {
      id: data.user.id,
      email: data.user.email,
      role: data.user.role,
      user_metadata: {
        ...metadata,
        full_name:
          metadata.full_name || metadata.name || data.user.email?.split("@")[0],
        avatar_url: metadata.avatar_url || metadata.picture,
      },
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};
