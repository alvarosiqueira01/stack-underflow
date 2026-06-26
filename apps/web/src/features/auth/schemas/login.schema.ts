import { z } from "zod";

export const loginSchema = z.object({
 email:z.email(),

 password:
 z.string()
 .min(8),

 remember:
 z.boolean()
});

export type LoginData=
z.infer<
typeof loginSchema
>;