import { Router, Request, Response } from "express";
import { db } from "../../lib/db";
import { authMiddleware } from "../../middleware/auth-middleware";
import { reviewSchema } from "../../schemas";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const reviews = await db.review.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            category: true,
            isAdmin: true
          }
        },
      },
    });

    res.json({ success: true, data: reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ success: false, error: "Failed to fetch reviews" });
  }
});

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  const user = res.locals.user;

  if (!user) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const values = req.body;

  const validatedFields = reviewSchema.safeParse(values);

  if (!validatedFields.success) {
    return res.status(400).json({ success: false, error: "Invalid Fields" });
  }

  const { orderId, productId, rating, comment } = validatedFields.data;

  try {
    // Check if the user has already reviewed this product
    const existingReview = await db.review.findUnique({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });

    if (existingReview) {
      return res.json({
        success: false,
        error: "You have already reviewed this product",
      });
    }

    // Create a new review
    const review = await db.review.create({
      data: {
        userId: user.id,
        orderId,
        productId,
        rating,
        comment,
      },
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ success: false, error: "Failed to create review" });
  }
});

export default router;
