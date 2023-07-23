import { z } from "zod";

export const BannerValidator = z.object({
  heading: z.string(),
  image: z.string(),
});

export type BannerCreationRequest = z.infer<typeof BannerValidator>;
