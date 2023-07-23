import { db } from "@/lib/db";
import { ProductValidator } from "@/lib/validators/Product";
import { z } from "zod";

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const {
      id,
      name,
      description,
      slug,
      categoryIds,
      isActive,
      colourValues,
      sizeValues,
      inventory,
      images,
    } = ProductValidator.parse(body);

    await db.attributesOnInventory.deleteMany({
      where: {
        inventory: { productId: id },
      },
    });

    await db.inventory.deleteMany({
      where: {
        productId: id,
      },
    });

    await db.image.deleteMany({
      where: {
        productId: id,
      },
    });

    // const imagesssss = await db.image.findMany({
    //   where: {
    //     productId: id,
    //   },
    // });

    // console.log({ imagesssss });
    // to separate size and colour values
    const sizeColour = inventory.map((item) => {
      return item.subProductName.split(" | ");
    });

    // model to store inventory data from products model
    const invent = inventory.map((items, index) => {
      return {
        price: items.price,
        discountedPrice: items.discountedPrice,
        isActive: isActive,
        AttributesOnInventory: {
          create: sizeColour[index].map((attr) => {
            return {
              attributeValue: {
                connect: {
                  value: attr.replace(/ /g, ""),
                },
              },
            };
          }),
        },
      };
    });

    console.log(categoryIds.length);
    console.log(categoryIds);

    // create colours for database is not already created
    if (colourValues) {
      if (colourValues.length !== 0) {
        for (let i = 0; i < colourValues.length; i++) {
          const exist = await db.attributeValue.findUnique({
            where: {
              value: colourValues[i].value,
            },
          });
          if (!exist) {
            await db.attributeValue.create({
              data: {
                value: colourValues[i].value,
                name: colourValues[i].label,
                attribute: {
                  connect: {
                    id: "64b02dc2bec8c50398ef5f9c",
                  },
                },
              },
            });
          }
        }
      }
    }

    // create size for database is not already created
    if (sizeValues) {
      if (sizeValues?.length !== 0) {
        for (let i = 0; i < sizeValues.length; i++) {
          const exist = await db.attributeValue.findUnique({
            where: {
              value: sizeValues[i].replace(/ /g, ""),
            },
          });

          if (!exist) {
            await db.attributeValue.create({
              data: {
                value: sizeValues[i].replace(/ /g, ""),
                attribute: {
                  connect: {
                    id: "64b02db7bec8c50398ef5f9b",
                  },
                },
              },
            });
          }
        }
      }
    }

    if (categoryIds.length === 0) {
      console.log("no cate");

      await db.product.update({
        where: {
          id: id,
        },
        data: {
          name,
          description,
          slug,
          isActive: isActive ? true : false,
          size: sizeValues,
          colour: colourValues,
          Inventory: {
            create: invent,
          },
          Image: {
            create: images.map((image) => {
              return {
                url: image,
                altText: name,
                isFeatured: true,
              };
            }),
          },
        },
      });
      return new Response("OK");
    }

    console.log("new cate");

    await db.categoriesOnProducts.deleteMany({
      where: {
        productId: id,
      },
    });

    // // model to store categories from products model
    const cateIds = categoryIds.map((cateIds) => {
      return {
        category: {
          connect: {
            id: cateIds,
          },
        },
      };
    });

    await db.product.update({
      where: {
        id: id,
      },
      data: {
        name,
        description,
        slug,
        isActive: isActive ? true : false,
        size: sizeValues,
        colour: colourValues,
        Inventory: {
          create: invent,
        },
        categoriesOnProducts: {
          create: cateIds,
        },
        Image: {
          create: images.map((image) => {
            return {
              url: image,
              altText: name,
              isFeatured: true,
            };
          }),
        },
      },
    });
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 });
    }
    console.log(error);

    return new Response("Could not update category, please try again later", {
      status: 500,
    });
  }
}
