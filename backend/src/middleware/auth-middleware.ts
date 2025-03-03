import { NextFunction, Request, Response } from "express";
import { Session, User } from "lucia";
import { getLucia } from "../routes/auth/lucia";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.cookies) {
      return res.json({
        error: "No cookies",
        success: false,
      }).status(401);
    }

    const lucia = getLucia({ count: 10, attribute: "d" });

    const sessionId = req.cookies[lucia.sessionCookieName];

    if (!sessionId) {
      return res.json({
        error: "No session",
        success: false,
      }).status(401);
    }

    const { session, user } = await lucia.validateSession(sessionId);

    if (session && session.fresh) {
      const sessionCookie = await lucia.createSessionCookie(session.id);
      res.cookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
    }

    if (!session) {
      const sessionCookie = lucia.createBlankSessionCookie();

      res.cookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );

      res.locals.user = null;

      return res.json({
        error: "Invalid session",
        success: false,
      });
    }

    res.locals.user = user;
    res.locals.session = session;

    next();
  } catch (error) {
    return res.json({
      error: "Something went wrong",
      success: false,
    }).status(500);
  }
};

declare global {
  namespace Express {
    interface Locals {
      user: User | null;
      session: Session | null;
    }
  }
}
