import { db } from "@/lib/db";
import { CategoryValidator } from "@/lib/validators/Category";
import { z } from "zod";

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const { id, image, name, parentId, slug, showOnHome, isActive } =
      CategoryValidator.parse(body);

    if (id === parentId) {
      return new Response("Category cannot be a parent category of it self", {
        status: 407,
      });
    }

    if (parentId === "") {
      await db.category.update({
        where: {
          id: id,
        },
        data: {
          name,
          image,
          slug,
          showOnHome,
          isActive,
        },
      });
      return new Response("OK");
    }

    const parentCategoryCheck = await db.category.findFirst({
      where: {
        id: id,
      },
      include: {
        parent: true,
        subCategory: true,
      },
    });

    const check = parentCategoryCheck?.subCategory
      .map((sub) => (sub.id === parentId ? true : false))
      .includes(true);

    if (check) {
      return new Response(
        "Cannot update as subcategory already has this category as parent",
        { status: 422 }
      );
    }

    await db.category.update({
      where: {
        id,
      },

      data: {
        name,
        slug,
        parentId,
        image,
        isActive,
        showOnHome,
      },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }

    return new Response("Could not update category, please try again later", {
      status: 500,
    });
  }
}
