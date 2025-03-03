// These are the schemas used for validation in the frontend. We use zod for schema validation.

import { z } from "zod";
import { CategoryEnum } from "@/types";

export const ContactSchema = z.object({
  name: z.string().min(3, {
    message: "name must be at least 3 characters.",
  }),
  email: z.string().email(),
  message: z.string().min(10, {
    message: "message must be at least 10 characters.",
  }),
});

export const SettingsSchema = z
  .object({
    name: z.optional(
      z.string().min(1, {
        message: "Name is required.",
      })
    ),
    email: z.optional(z.string().email({ message: "Invalid Email." })),
    password: z.optional(
      z.string().min(1, {
        message: "Password is required.",
      })
    ),
    newPassword: z.optional(
      z.string().min(6, {
        message: "Minimum 6 characters required.",
      })
    ),
    category: z.optional(
      z.nativeEnum(CategoryEnum, {
        message: "Invalid category selected",
      })
    ),
  })
  .refine(
    (data) => {
      if (data?.password && !data?.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New Password is required.",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data?.newPassword && !data?.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required.",
      path: ["password"],
    }
  );

export const reviewSchema = z.object({
  productId: z.string().cuid(),
  orderId: z.string().cuid(),
  rating: z.preprocess((val) => Number(val), z.number().int().min(1).max(5)),
  comment: z.string().min(10),
});
