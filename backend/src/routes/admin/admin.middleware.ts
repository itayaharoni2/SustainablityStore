import { NextFunction, Request, Response } from "express";
import { db } from "../../lib/db";

export const checkAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    if (!user || !user.id) {
      return res.json({
        error: "Unauthorized",
        success: false,
      }).status(401);
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
      return res.json({
        error: "User not found",
        success: false,
      }).status(401);
    }

    if (!dbUser.isAdmin) {
      return res.json({
        error: "Admin only",
        success: false,
      }).status(401);
    }

    next();
  } catch (error) {
    return res
      .json({
        error: "Something went wrong",
        success: false,
      })
      .status(500);
  }
};
