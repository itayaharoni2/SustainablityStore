import * as z from "zod";
import { CategoryEnum } from "../types";

export const SignUpSchema = z.object({
  name: z.string().min(3, {
    message: "Name must be at least 3 characters long",
  }),
  email: z.string(),
  password: z.string().min(5, {
    message: "Password must be at least 5 characters long",
  }),
  category: z.nativeEnum(CategoryEnum, {
    message: "Invalid category selected",
  }),
});

export const SignInSchema = z.object({
  email: z.string(),
  password: z.string(),
  remember: z.boolean(),
});
