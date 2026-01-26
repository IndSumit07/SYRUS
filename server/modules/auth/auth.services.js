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
      redirectTo: `${process.env.SERVER_URL}/api/auth/google/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) throw error;
  return data.url;
};

export const sendResetPasswordEmail = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(
    email.toLowerCase().trim(),
    {
      redirectTo: `${process.env.CLIENT_URL}/reset-password`,
    },
  );

  if (error) throw error;
  return data;
};

export const resetPasswordWithToken = async (access_token, new_password) => {
  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token: "",
  });

  if (error) throw error;

  const { error: updateError } = await supabase.auth.updateUser({
    password: new_password,
  });

  if (updateError) throw updateError;

  return true;
};

export const changePassword = async (userId, new_password) => {
  const { data, error } = await supabase.auth.admin.updateUserById(userId, {
    password: new_password,
  });

  if (error) throw error;
  return data.user;
};

export const exchangeGoogleCode = async (code) => {
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) throw error;
  return data.session;
};
