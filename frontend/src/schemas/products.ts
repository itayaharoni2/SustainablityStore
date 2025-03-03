import { CategoryEnum } from "@/types";
import { z } from "zod";

export const AVAILABLE_SORT = ["none", "price-asc", "price-desc"] as const;

export const ProductFilterValidator = z.object({
  category: z.object({
    name: z.union([z.nativeEnum(CategoryEnum), z.literal("All")]),
    selected: z.preprocess((val) => val === "true", z.boolean()),
  }),
  sort: z.enum(AVAILABLE_SORT),
  price: z.tuple([
    z.preprocess((val) => Number(val), z.number()),
    z.preprocess((val) => Number(val), z.number()),
  ]),
  page: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().default(1)
  ),
  pageSize: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().default(9)
  ),
});

export type ProductState = Omit<
  z.infer<typeof ProductFilterValidator>,
  "price"
> & {
  price: {
    isCustom: boolean;
    range: [number, number];
  };
};

export const addOrEditProduct = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.preprocess((val) => Number(val), z.number()),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  image: z.optional(z.array(z.instanceof(File))),
});

export const SearchQueryValidator = z.object({
  q: z.string().min(1).max(100),
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  pageSize: z.string().regex(/^\d+$/).transform(Number).default('10'),
});