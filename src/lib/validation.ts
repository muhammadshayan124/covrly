import { z } from "zod";

export const signupSchema = z.object({
  orgName: z.string().trim().min(2, "Business name is too short").max(100),
  name: z.string().trim().min(1, "Your name is required").max(100),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const staffSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().min(7, "Enter a valid phone number").max(20),
  priority: z.coerce.number().int().min(0).max(1000).default(0),
});

export const shiftSchema = z.object({
  role: z.string().trim().min(1, "Role is required").max(100),
  startsAt: z.string().min(1, "Start time is required"),
  endsAt: z.string().min(1, "End time is required"),
  assignedStaffId: z.string().min(1).optional(),
});
