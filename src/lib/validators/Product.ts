import { z } from "zod";

export const ProductValidator = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, { message: "Name must be longer than 3 characters" })
    .max(150, { message: "Name must be atmost 150 Characters" }),
  description: z.any(),
  slug: z.string(),
  isActive: z.boolean().optional(),
  categoryIds: z.string().array(),
  sizeValues: z.string().array().optional(),
  colourValues: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .array()
    .optional(),
  inventory: z
    .object({
      price: z.number(),
      discountedPrice: z.number().optional().nullable(),
      quantity: z.number(),
      subProductName: z.string(),
      image: z.string().array().optional(),
    })
    .array(),
  images: z.string().array(),
});

export type ProductCreationRequest = z.infer<typeof ProductValidator>;

export const ProductDeleteValidator = z.object({
  id: z.string(),
});
export type ProductDeleteRequest = z.infer<typeof ProductDeleteValidator>;
