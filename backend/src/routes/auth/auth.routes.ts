import { db } from "../../lib/db";
import { SignInSchema, SignUpSchema } from "../../schemas/auth";
import { Router } from "express";
import { getLucia } from "./lucia";

import { Argon2id } from "oslo/password";
import { authMiddleware } from "../../middleware/auth-middleware";
import { SettingsSchema } from "../../schemas";
import rateLimiter from "../../middleware/rate-limiter";

const router = Router();

router.post(
  "/sign-up",
  rateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 5 }),
  async (req, res) => {
    try {
      const values = req.body;

      const validatedFields = SignUpSchema.safeParse(values);

      if (!validatedFields.success) {
        return res.json({
          error: "Invalid fields",
          success: false,
        });
      }

      const { name, email, password, category } = validatedFields.data;

      const existingUser = await db.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        return res.json({
          error: "User already exists",
          success: false,
        });
      }

      const hashedPassword = await new Argon2id().hash(password);

      const user = await db.user.create({
        data: {
          email,
          name,
          category,
          hashedPassword,
        },
      });

      const lucia = getLucia({ count: 10, attribute: "d" });

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      res.cookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      await db.activity.create({
        data: {
          userId: user.id,
          type: "Sign Up",
        },
      });

      return res.json({
        success: true,
      });
    } catch (error) {
      return res.json({
        error: "Something went wrong",
        success: false,
      });
    }
  }
);

router.post(
  "/sign-in",
  rateLimiter({ windowMs: 60 * 1000, maxRequests: 15 }),
  async (req, res) => {
    try {
      const values = req.body;

      const validatedFields = SignInSchema.safeParse(values);

      if (!validatedFields.success) {
        return res.json({
          error: "Invalid fields",
          success: false,
        });
      }

      const { email, password, remember } = validatedFields.data;

      const lucia = getLucia({
        count: remember ? 10 : 30,
        attribute: remember ? "d" : "m",
      });

      const user = await db.user.findUnique({
        where: {
          email,
        },
      });

      if (!user || !user.hashedPassword) {
        return res.json({
          error: "User not found",
          success: false,
        });
      }

      const isValidPassword = await new Argon2id().verify(
        user.hashedPassword,
        password
      );

      if (!isValidPassword) {
        return res.json({
          error: "Invalid password",
          success: false,
        });
      }

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);

      res.cookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      await db.activity.create({
        data: {
          userId: user.id,
          type: "Sign In",
        },
      });

      return res.json({
        success: true,
      });
    } catch (error) {
      return res.json({
        error: "Something went wrong",
        success: false,
      });
    }
  }
);

router.post(
  "/sign-out",
  authMiddleware,
  rateLimiter({ windowMs: 60 * 1000, maxRequests: 15 }),
  async (req, res) => {
    try {
      const user = res.locals.user;

      const lucia = getLucia({ count: 0, attribute: "ms" });
      const sessionCookie = await lucia.createBlankSessionCookie();

      res.cookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      if (user) {
        await db.activity.create({
          data: {
            userId: user.id,
            type: "Sign Out",
          },
        });
      }

      return res.json({
        success: true,
      });
    } catch (error) {
      return res.json({
        error: "Something went wrong",
        success: false,
      });
    }
  }
);

router.post(
  "/get-user",
  authMiddleware,
  rateLimiter({ windowMs: 60 * 1000, maxRequests: 200 }),
  async (req, res) => {
    try {
      const user = res.locals.user;

      if (!user || !user.id) {
        return res
          .json({
            error: "User not found",
            success: false,
          })
          .status(401);
      }

      const dbUser = await db.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          category: true,
          isAdmin: true,
        },
      });

      if (!dbUser) {
        return res
          .json({
            error: "User not found",
            success: false,
          })
          .status(401);
      }

      return res.json({
        success: true,
        user: dbUser,
      });
    } catch (error) {
      return res
        .json({
          error: "Something went wrong",
          success: false,
        })
        .status(500);
    }
  }
);

router.post(
  "/update-user",
  authMiddleware,
  rateLimiter({ windowMs: 3 * 60 * 1000, maxRequests: 5 }),
  async (req, res) => {
    try {
      const user = res.locals.user;

      if (!user || !user.id) {
        return res
          .json({
            error: "User not found",
            success: false,
          })
          .status(401);
      }

      const dbUser = await db.user.findUnique({
        where: {
          id: user.id,
        },
      });

      if (!dbUser) {
        return res
          .json({
            error: "User not found",
            success: false,
          })
          .status(401);
      }

      const values = req.body;

      const validatedFields = SettingsSchema.safeParse(values);

      if (!validatedFields.success) {
        return res.json({
          error: "Invalid fields",
          success: false,
        });
      }

      const {
        data,
      }: {
        data: typeof validatedFields.data & {
          hashedPassword?: string;
        };
      } = validatedFields;

      if (data.password && data.newPassword) {
        if (data.password === data.newPassword) {
          return res
            .json({
              error: "New Password can't be same as previous Password",
              success: false,
            })
            .status(400);
        }

        const passwordMatch = await new Argon2id().verify(
          dbUser.hashedPassword,
          data.password
        );

        if (!passwordMatch) {
          return res.json({
            error: "Incorrect Password!",
            success: false,
          });
        }

        const hashedPassword = await new Argon2id().hash(data.newPassword);

        data.hashedPassword = hashedPassword;
      }

      data.password = undefined;
      data.newPassword = undefined;

      const updatedUser = await db.user.update({
        where: {
          id: user.id,
        },
        data,
      });

      return res.json({
        success: true,
      });
    } catch (error) {
      return res
        .json({
          error: "Something went wrong",
          success: false,
        })
        .status(500);
    }
  }
);

export default router;
