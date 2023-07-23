import ProductEditor from "@/components/dashboard/product/ProductEditor";
import { db } from "@/lib/db";
import { FC } from "react";

interface pageProps {
  params: {
    slug: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const { slug } = params;
  const categories = await db.category.findMany({});

  const product = await db.product.findFirst({
    where: {
      id: slug,
    },
    include: {
      categoriesOnProducts: {
        include: {
          category: true,
        },
      },
      Image: true,
      Inventory: {
        include: {
          AttributesOnInventory: {
            include: {
              attributeValue: {
                include: {
                  attribute: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return (
    <div>
      {/* @ts-ignore */}
      <ProductEditor categories={categories} product={product}></ProductEditor>
    </div>
  );
};

export default page;
