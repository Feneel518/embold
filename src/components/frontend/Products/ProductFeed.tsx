import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface ProductFeedProps {}

const ProductFeed: FC<ProductFeedProps> = async ({}) => {
  const products = await db.product.findMany({
    take: 8,
    include: {
      Inventory: true,
      Image: {
        take: 1,
      },
      categoriesOnProducts: {
        include: {
          category: true,
        },
      },
    },
  });

  console.log(products);

  return (
    <div className=" mt-10 mb-72 ">
      <div className="flex flex-col items-center ">
        <h1 className="text-center mt-10 mb-2 text-3xl">Shop By Products</h1>
        <div className="mb-10 h-1 w-20 bg-embold rounded-full"></div>
      </div>
      <div className=" grid grid-cols-1 grid-flow-row-dense sm:grid-cols-2 lg:grid-cols-4 gap-2 max-sm:gap-4  items-center justify-center content-center">
        {products.map((product) => {
          return (
            <Link
              href={`/product/${product.slug}`}
              key={product.id}
              className="w-full z-30 flex flex-col items-center justify-center h-[500px] relative max-w-xs mx-auto overflow-hidden transition duration-300 ease-in-out bg-cover bg-no-repeat group cursor-pointer hover:shadow-lg p-4 hover:shadow-embold/70"
            >
              <div className="relative overflow-hidden">
                <Image
                  className="md:w-64 md:h-96 rounded-md cursor-pointer object-cover h-72 w-48 transition duration-300 ease-in-out hover:scale-110"
                  src={product.Image[0].url}
                  alt={product.name}
                  width={200}
                  height={200}
                ></Image>
              </div>
              <div className="absolute top-5 right-5 text-gray-500/50 hover:bg-embold/50 p-2 rounded-full">
                <Heart className="fill-embold" />
              </div>
              <div className="mt-2 flex flex-col items-center gap-2 w-full">
                <h1 className="text-lg text-center line-clamp-1">
                  {product.name}
                </h1>
                <div className="flex gap-2">
                  <p>₹ {product.Inventory[0].discountedPrice}</p>
                  <p className="line-through text-gray-400">
                    ₹ {product.Inventory[0].price}
                  </p>
                </div>
                <div className="w-full">
                  <Button className="w-full">Add to Basket</Button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProductFeed;
