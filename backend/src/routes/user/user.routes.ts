import { Router } from "express";
import { db } from "../../lib/db";
import { authMiddleware } from "../../middleware/auth-middleware";

const router = Router();

router.get("/activities", authMiddleware, async (req, res) => {
  const user = res.locals.user;

  if (!user) {
    return res.json({
      error: "No user found",
      success: false,
    }).status(401);
  }

  try {
    const activities = await db.activity.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            category: true,
            isAdmin: true,
          },
        },
      },
    });

    if (!activities) {
      return res.json({
        error: "No activities found",
        success: false,
      }).status(404);
    }

    return res.json({
      activities,
      success: true,
    });
  } catch {
    return res
      .json({
        error: "Something went wrong",
        success: false,
      })
      .status(500);
  }
});

export default router;
