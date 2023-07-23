import { db } from "@/lib/db";
import { ProductDeleteValidator } from "@/lib/validators/Product";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = ProductDeleteValidator.parse(body);

    const productExist = await db.product.findFirst({
      where: {
        id: id,
      },
    });

    if (!productExist) {
      return new Response("No product found with this id.", {
        status: 400,
      });
    }
    await db.attributesOnInventory.deleteMany({
      where: {
        inventory: {
          productId: id,
        },
      },
    });

    await db.categoriesOnProducts.deleteMany({
      where: {
        productId: id,
      },
    });
    await db.inventory.deleteMany({
      where: {
        productId: id,
      },
    });

    await db.product.delete({
      where: {
        id: id,
      },
    });

    return new Response("ok");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }
    console.log(error);

    return new Response("Could not delete, please try again later", {
      status: 500,
    });
  }
}
