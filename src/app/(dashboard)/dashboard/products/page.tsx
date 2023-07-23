import ProductList from "@/components/dashboard/product/ProductList";
import { buttonVariants } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const products = await db.product.findMany({
    include: {
      categoriesOnProducts: {
        include: {
          category: true,
        },
      },
      Image: {
        take: 1,
      },
      Inventory: {
        include: {
          AttributesOnInventory: {
            include: {
              attributeValue: true,
            },
          },
        },
      },
    },
  });

  return (
    <div>
      <Link
        href="/dashboard/products/new"
        className={cn(buttonVariants(), "w-full")}
      >
        Add a new product
      </Link>
      {/* @ts-ignore */}
      {products && <ProductList products={products}></ProductList>}
    </div>
  );
};

export default page;
