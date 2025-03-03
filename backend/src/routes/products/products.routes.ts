import { db } from "../../lib/db";
import { Router } from "express";
import rateLimiter from "../../middleware/rate-limiter";
import {
  ProductFilterValidator,
  SearchQueryValidator,
} from "../../schemas/products";
import { z } from "zod";

const router = Router();

router.get(
  "/filters",
  rateLimiter({
    maxRequests: 50,
    windowMs: 2 * 60 * 1000,
  }),
  async (req, res) => {
    try {
      console.log(req.query);
      const validatedFields = ProductFilterValidator.safeParse(req.query);

      validatedFields.error?.errors.forEach((error) => {
        console.error("Error fetching products:", error);
      });

      if (!validatedFields.success) {
        return res.status(400).json({
          error: "Invalid filter parameters",
          details: validatedFields.error.errors,
        });
      }

      const filters = validatedFields.data;

      const where: any = {};

      // Apply category filter
      if (filters.category.selected && filters.category.name !== "All") {
        where.category = filters.category.name;
      }

      // Apply price filter
      where.price = {
        gte: filters.price[0],
        lte: filters.price[1],
      };

      // Apply sorting
      let orderBy: any = {};
      if (filters.sort === "price-asc") {
        orderBy.price = "asc";
      } else if (filters.sort === "price-desc") {
        orderBy.price = "desc";
      }

      // Apply pagination
      const skip = (filters.page - 1) * filters.pageSize;
      const take = filters.pageSize;

      // Fetch products
      const products = await db.product.findMany({
        where,
        orderBy,
        skip,
        take,
      });

      // Get total count for pagination
      const totalCount = await db.product.count({ where });

      res.json({
        products,
        pagination: {
          currentPage: filters.page,
          pageSize: filters.pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / filters.pageSize),
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res
          .status(400)
          .json({ error: "Invalid filter parameters", details: error.errors });
      } else {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  }
);

router.get(
  "/",
  rateLimiter({ windowMs: 60 * 1000, maxRequests: 35 }),
  async (req, res) => {
    const category = req.query?.category as string;
    const MAX_PRODUCTS = 8;
    const CATEGORY_PERCENTAGE = 0.7; // 70% of MAX_PRODUCTS

    try {
      let products;

      if (category) {
        // Calculate the number of products to fetch from the specified category
        const categoryProductsCount = Math.ceil(
          MAX_PRODUCTS * CATEGORY_PERCENTAGE
        );

        // Fetch products from the specified category
        const categoryProducts = await db.product.findMany({
          where: { category },
          take: categoryProductsCount,
        });

        // Calculate how many products we need from other categories
        const otherProductsCount = MAX_PRODUCTS - categoryProducts.length;

        if (otherProductsCount > 0) {
          // Fetch products from other categories
          const otherProducts = await db.product.findMany({
            where: { NOT: { category } },
            take: otherProductsCount,
          });

          // Combine and shuffle the products
          products = [
            ...shuffleArray(categoryProducts),
            ...shuffleArray(otherProducts),
          ];
        } else {
          products = shuffleArray(categoryProducts);
        }
      } else {
        // If no category is specified, fetch random products
        products = await db.product.findMany({
          take: MAX_PRODUCTS,
        });
        products = shuffleArray(products);
      }

      return res.json({
        success: true,
        products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching products",
      });
    }
  }
);

router.get("/search", async (req, res) => {
  console.log("Search query:", req.query);
  try {
    const { q, page, pageSize } = SearchQueryValidator.parse(req.query);

    const skip = (page - 1) * pageSize;

    const products = await db.product.findMany({
      where: {
        OR: [{ name: { contains: q } }, { description: { contains: q } }],
      },
      skip,
      take: pageSize,
      orderBy: { name: "asc" },
    });

    const totalCount = await db.product.count({
      where: {
        OR: [{ name: { contains: q } }, { description: { contains: q } }],
      },
    });

    res.json({
      products,
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res
        .status(400)
        .json({ error: "Invalid search parameters", details: error.errors });
    } else {
      console.error("Error searching products:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

router.get(
  "/:id",
  rateLimiter({ windowMs: 60 * 1000, maxRequests: 15 }),
  async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .json({
            success: false,
            error: "Product Id is required!",
          })
          .status(400);
      }

      const product = await db.product.findUnique({
        where: {
          id,
        },
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          error: "Product not found!",
        });
      }

      return res.json({
        success: true,
        product,
      });
    } catch (error) {
      return res
        .json({
          success: false,
          error: "Something went wrong!",
        })
        .status(500);
    }
  }
);

export default router;

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
