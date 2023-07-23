import { FC } from "react";

import { buttonVariants } from "@/components/ui/Button";
import Link from "next/link";
import Lists from "@/components/dashboard/List/Lists";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const categories = await db.category.findMany({
    include: {
      parent: true,
      subCategory: true,
    },
  });
  return (
    <div className="">
      <Link
        href="/dashboard/categories/new"
        className={cn(buttonVariants(), "w-full")}
      >
        Add a new category
      </Link>

      <Lists categories={categories}></Lists>
    </div>
  );
};

export default page;
