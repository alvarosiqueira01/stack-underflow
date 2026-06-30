import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(3, "Enter your email or username"),
  password: z.string().min(6),
  remember: z.boolean(),
});

export type LoginData = z.infer<typeof loginSchema>;
