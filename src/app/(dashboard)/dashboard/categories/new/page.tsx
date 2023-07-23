import { FC } from "react";
import CategoryEditor from "@/components/dashboard/category/CategoryEditor";
import { db } from "@/lib/db";

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
      <CategoryEditor categories={categories} category={null}></CategoryEditor>
    </div>
  );
};

export default page;
