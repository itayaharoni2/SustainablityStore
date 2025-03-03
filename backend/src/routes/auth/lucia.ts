import { Lucia, TimeSpan } from "lucia";

import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { db } from "../../lib/db";

const adapter = new PrismaAdapter(db.session, db.user);

export const getLucia = ({
  count,
  attribute,
}: {
  count: number;
  attribute: "d" | "h" | "m" | "ms" | "s" | "w";
}) => {
  return new Lucia(adapter, {
    sessionExpiresIn: new TimeSpan(count, attribute),
    sessionCookie: {
      name: "lucia-auth-cookie",
      expires: true,
      attributes: {
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
      },
    },
  });
};
