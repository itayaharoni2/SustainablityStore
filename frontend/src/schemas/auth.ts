// These are the schemas used for validation in the frontend. We use zod for schema validation. This file contains the schemas for the auth module.

import { CategoryEnum } from "@/types";
import * as z from "zod";

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
