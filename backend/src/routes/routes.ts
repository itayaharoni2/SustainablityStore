import { Express } from "express";

import express from "express";
import adminRoutes from "../routes/admin/admin.routes";
import authRoutes from "../routes/auth/auth.routes";
import cartRoutes from "../routes/cart/cart.routes";
import contactRoutes from "../routes/contact/contact.routes";
import orderRoutes from "../routes/order/order.routes";
import productRoutes from "../routes/products/products.routes";
import reviewRoutes from "../routes/review/review.routes";
import userRoutes from "../routes/user/user.routes";

export default function routes(app: Express) {
  app.set("trust proxy", true); // returns real ip address of the client

  app.use("/uploads", express.static("uploads"));

  app.use("/auth", authRoutes);

  app.use("/products", productRoutes);

  app.use("/contact", contactRoutes);

  app.use("/user", userRoutes);

  app.use("/cart", cartRoutes);

  app.use("/order", orderRoutes);

  app.use("/review", reviewRoutes);

  app.use("/admin", adminRoutes);
}
