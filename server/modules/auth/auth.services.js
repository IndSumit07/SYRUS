import supabase from "../../configs/supabase.config.js";

export const signUpUser = async ({ full_name, email, password }) => {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });

  if (error) throw error;
  return data;
};

export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data.session;
};

export const getGoogleAuthUrl = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:4000/api/auth/google/callback",
    },
  });

  if (error) throw error;
  return data.url;
};
