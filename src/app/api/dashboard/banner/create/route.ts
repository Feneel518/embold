import { db } from "@/lib/db";
import { BannerValidator } from "@/lib/validators/Banner";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { heading, image } = BannerValidator.parse(body);

    await db.banner.create({
      data: {
        heading,
        image,
      },
    });
    return new Response("Banner Added.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Could not add a banner, please try again later", {
      status: 500,
    });
  }
}
