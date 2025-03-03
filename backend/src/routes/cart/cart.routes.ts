import { Router, Request, Response } from "express";
import { db } from "../../lib/db";
import { authMiddleware } from "../../middleware/auth-middleware";

const router = Router();

// Get current cart for the user
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const cart = await db.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return res.json({ success: true, items: [] }); // Return an empty cart if not found
    }

    res.json({
      success: true,
      items: cart.items,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch cart" });
  }
});

// Add item to the cart
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const { productId, quantity } = req.body;

    // Find or create a cart for the user
    let cart = await db.cart.upsert({
      where: { userId: user.id },
      create: { userId: user.id },
      update: {},
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Check if the item already exists in the cart
    const existingItem = await db.cartItem.findFirst({
      where: { cartId: cart.id, productId },
    });

    if (existingItem) {
      // Update the quantity if product already exists
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      // Add new item to the cart
      await db.cartItem.create({
        data: { cartId: cart.id, productId, quantity },
      });
    }

    // Fetch the updated cart
    cart = (await db.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    }))!;

    await db.activity.create({
      data: {
        userId: user.id,
        type: "Add to Cart",
      },
    });

    res.json({ success: true, items: cart?.items });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Failed to add item to cart" });
  }
});

// Remove item from the cart
router.delete(
  "/:productId",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const user = res.locals.user;

      if (!user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const { productId } = req.params;

      // Find the user's cart
      const cart = await db.cart.findUnique({
        where: { userId: user.id },
      });

      if (!cart) {
        return res
          .status(404)
          .json({ success: false, error: "Cart not found" });
      }

      // Remove the item from the cart
      await db.cartItem.deleteMany({
        where: { cartId: cart.id, productId },
      });

      // Fetch the updated cart
      const updatedCart = await db.cart.findUnique({
        where: { userId: user.id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      await db.activity.create({
        data: {
          userId: user.id,
          type: "Remove from Cart",
        },
      });

      res.json({ success: true, items: updatedCart?.items });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, error: "Failed to remove item from cart" });
    }
  }
);

// Clear the cart
router.delete("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    // Find the user's cart
    const cart = await db.cart.findUnique({
      where: { userId: user.id },
    });

    if (!cart) {
      return res.status(404).json({ success: false, error: "Cart not found" });
    }

    // Clear all items from the cart
    await db.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    await db.activity.create({
      data: {
        userId: user.id,
        type: "Clear Cart",
      },
    });

    res.json({ success: true, items: [] });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to clear cart" });
  }
});

export default router;
