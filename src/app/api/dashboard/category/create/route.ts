import { db } from "@/lib/db";
import { CategoryValidator } from "@/lib/validators/Category";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { image, name, parentId, slug, showOnHome } =
      CategoryValidator.parse(body);

    if (parentId) {
      await db.category.create({
        data: {
          name,
          slug,
          parentId,
          image,
          showOnHome,
        },
      });
    } else {
      await db.category.create({
        data: {
          name,
          slug,
          image,
          showOnHome,
        },
      });
    }
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Could not create a category, please try again later", {
      status: 500,
    });
  }
}
