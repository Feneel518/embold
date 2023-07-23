import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import Image from "next/image";
import { FC, useState } from "react";

interface HomeCategoriesProps {}

const HomeCategories: FC<HomeCategoriesProps> = async ({}) => {
  const categories = await db.category.findMany({
    take: 4,
    where: {
      isActive: true,
      AND: {
        showOnHome: true,
      },
    },
  });

  return (
    <div className="mx-2 relative pt-10 pb-10">
      <div className="absolute h-full w-full bg-embold/30  blur-lg"></div>
      <div className="flex flex-col items-center">
        <h1 className="text-center mt-10 mb-2 text-3xl z-10 text-emboldDark">
          Shop By Categories
        </h1>
        <div className="mb-10 h-1 w-20 bg-embold z-10 rounded-full"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4  items-center justify-center content-center gap-8 relative">
        {categories.map((cate) => {
          return (
            <div
              key={cate.id}
              className="z-30 flex items-center justify-center relative max-w-xs mx-auto overflow-hidden bg-cover bg-no-repeat group "
            >
              <div className="relative overflow-hidden cursor-pointer transition duration-300 ease-in-out hover:scale-110">
                <Image
                  className="md:w-64 md:h-96 rounded-md cursor-pointer h-72 w-48"
                  src={cate.image as string}
                  alt={cate.name}
                  width={200}
                  height={200}
                ></Image>
                <div className="absolute h-full w-full bg-embold/20 flex items-center justify-center -bottom-10 z-40 group-hover:bottom-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button variant="outline">{cate.name}</Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HomeCategories;
