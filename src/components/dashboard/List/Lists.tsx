import { db } from "@/lib/db";
import { category } from "@/types/Category";

import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface ListsProps {
  categories: category[];
}

const Lists: FC<ListsProps> = ({ categories }) => {
  return (
    <div className="mt-10">
      <hr className="mb-10 border-emboldDark" />
      <div className="grid grid-cols-3 gap-8">
        {categories.map((cate) => {
          return (
            <Link href={`/dashboard/categories/${cate.id}`}>
              <div className="bg-emboldLight w-full rounded-md p-5 flex cursor-pointer">
                <div className="">
                  <Image
                    className="rounded-md h-64 w-48 object-cover"
                    alt=""
                    src={cate.image as string}
                    width={200}
                    height={200}
                    objectFit="contain"
                  ></Image>
                </div>
                <div className=" p-5">
                  <h1 className="text-2xl hover:underline underline-offset-4">
                    {cate.name}
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

export default Lists;
