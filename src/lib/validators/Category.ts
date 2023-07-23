import { z } from "zod";

export const CategoryValidator = z.object({
  id: z.string().optional(),
  name: z
    .string()
    .min(3, { message: "Name must be longer than 3 characters" })
    .max(150, { message: "Name must be atmost 150 Characters" }),
  image: z.string().optional(),
  slug: z.string(),
  parentId: z.string(),
  showOnHome: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type CategoryCreationRequest = z.infer<typeof CategoryValidator>;

export const CategoryDeleteValidator = z.object({
  id: z.string(),
});

export type CategoryDeleteRequest = z.infer<typeof CategoryDeleteValidator>;
