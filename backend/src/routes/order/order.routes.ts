import { Router, Request, Response } from "express";
import { db } from "../../lib/db";
import { authMiddleware } from "../../middleware/auth-middleware";

const router = Router();

router.get("/get-orders", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    // Fetch orders for the user
    const orders = await db.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          include: { product: true }, // Include product details if needed
        },
      },
    });

    if (orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Endpoint to place an order
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    // Fetch the user's cart with all items
    const cart = await db.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: { product: true }, // Include product details for price calculation
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, error: "Cart is empty" });
    }

    // Calculate the total price
    let total = 0;
    const orderItemsData = cart.items.map((item) => {
      total += item.quantity * item.product.price; // Calculate total based on product price and quantity
      return {
        productId: item.productId,
        quantity: item.quantity,
      };
    });

    // Create a new order
    const order = await db.order.create({
      data: {
        userId: user.id,
        total,
        items: {
          create: orderItemsData.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: { items: true }, // Include order items in the response
    });

    // Clear the user's cart after placing the order
    await db.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, error: "Failed to place order" });
  }
});

export default router;
