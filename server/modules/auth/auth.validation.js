import { z } from "zod";

export const signupSchema = z.object({
  full_name: z
    .string({ required_error: "Full name is required" })
    .min(2, "Full name too short")
    .max(50, "Full name too long"),

  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password too long")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});

export const resetPasswordSchema = z.object({
  access_token: z.string(),
  new_password: z
    .string()
    .min(8)
    .max(64)
    .regex(/[A-Z]/, "Must contain uppercase")
    .regex(/[0-9]/, "Must contain number"),
});

export const changePasswordSchema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8).max(64).regex(/[A-Z]/).regex(/[0-9]/),
});

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});
