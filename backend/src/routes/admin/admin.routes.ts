import { Router } from "express";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { db } from "../../lib/db";
import { upload } from "../../lib/multer";
import { absoluteServerUrl } from "../../lib/utils";
import { authMiddleware } from "../../middleware/auth-middleware";
import { addOrEditProduct } from "../../schemas/products";
import { checkAdmin } from "./admin.middleware";

const router = Router();

router.get("/user/activities", authMiddleware, checkAdmin, async (req, res) => {
  try {
    const activities = await db.activity.findMany({
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
      return res
        .json({
          error: "No activities found",
          success: false,
        })
        .status(404);
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

router.get("/products", authMiddleware, checkAdmin, async (req, res) => {
  try {
    const products = await db.product.findMany();

    if (!products) {
      return res
        .json({
          error: "No products found",
          success: false,
        })
        .status(404);
    }

    return res.json({
      products,
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
});

router.post(
  "/product/add",
  authMiddleware,
  checkAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const values = req.body;

      const validatedFields = addOrEditProduct
        .omit({ image: true })
        .safeParse(values);

      if (!validatedFields.success) {
        return res.json({
          error: "Invalid fields",
          success: false,
        });
      }

      const data = validatedFields.data;

      if (!req.file) {
        return res.json({
          error: "Please upload an image",
          success: false,
        });
      }

      const product = await db.product.create({
        data: {
          name: data.name,
          description: data.description,
          price: data.price,
          category: values.category,
          imageUrl: absoluteServerUrl("/uploads/" + req.file.filename),
        },
      });

      return res.json({
        product,
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

router.post(
  "/product/edit",
  authMiddleware,
  checkAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const values = req.body;

      const validatedFields = addOrEditProduct
        .extend({ id: z.string() })
        .omit({ image: true })
        .safeParse(values);

      if (!validatedFields.success) {
        return res.json({
          error: "Invalid fields",
          success: false,
        });
      }

      const { id, name, description, category, price } = validatedFields.data;

      const product = await db.product.findUnique({
        where: {
          id,
        },
      });

      if (!product) {
        return res.json({
          error: "Product not found",
          success: false,
        }).status(404);
      }

      if (req.file) {
        const filename = product.imageUrl.split("/").pop();

        if (filename) {
          const filepath = path.join(process.cwd(), "uploads", filename);

          fs.unlink(filepath, (err) => {
            if (err) {
              console.error(err);
            }
          });
        }
      }

      const updatedProduct = await db.product.update({
        where: {
          id,
        },
        data: {
          name,
          description,
          category,
          price,
          imageUrl: req?.file?.filename,
        },
      });

      return res.json({
        product: updatedProduct,
        success: true,
      });
    } catch (error) {
      console.log(error);
      return res
        .json({
          error: "Something went wrong",
          success: false,
        })
        .status(500);
    }
  }
);

router.delete(
  "/product/delete",
  authMiddleware,
  checkAdmin,
  async (req, res) => {
    try {
      const { id } = req.body;

      const product = await db.product.findUnique({
        where: {
          id,
        },
      });

      if (!product) {
        return res.json({
          error: "Product not found",
          success: false,
        }).status(404);
      }

      const filename = product.imageUrl.split("/").pop();

      if (filename) {
        const filepath = path.join(process.cwd(), "uploads", filename);

        fs.unlink(filepath, (err) => {
          if (err) {
            console.error(err);
          }
        });
      }

      await db.product.delete({
        where: {
          id,
        },
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