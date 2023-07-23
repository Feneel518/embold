import { db } from "@/lib/db";
import { CategoryDeleteValidator } from "@/lib/validators/Category";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id } = CategoryDeleteValidator.parse(body);

    const categoryExists = await db.category.findFirst({
      where: {
        id,
      },
      include: {
        subCategory: true,
      },
    });

    if (!categoryExists) {
      return new Response("No category found with this id.", {
        status: 400,
      });
    }
    await db.category.delete({
      where: {
        id: id,
      },
    });
    return new Response(id);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Could not delete, please try again later", {
      status: 500,
    });
  }
}
