import { Product } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface ProductListProps {
  products: Product[] &
    [
      {
        name: string;
        id: string;
      }
    ];
}

const ProductList: FC<ProductListProps> = ({ products }) => {
  return (
    <div className="mt-10">
      <hr className="mb-10 border-emboldDark" />
      <div className="grid grid-cols-3 gap-8">
        {products.map((prod) => {
          return (
            <Link href={`/dashboard/products/${prod.id}`}>
              <div className="bg-emboldLight w-full rounded-md p-5 flex cursor-pointer">
                <div className="">
                  {/* @ts-ignore */}
                  {prod.Image && (
                    <Image
                      className="rounded-md h-64 w-64 object-cover"
                      alt=""
                      // @ts-ignore
                      src={prod.Image[0].url as string}
                      width={200}
                      height={200}
                      objectFit="contain"
                    ></Image>
                  )}
                </div>
                <div className=" p-5">
                  <h1 className="text-2xl hover:underline underline-offset-4">
                    {prod.name}
                  </h1>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
