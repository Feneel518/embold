import ProductEditor from "@/components/dashboard/product/ProductEditor";
import { db } from "@/lib/db";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const categories = await db.category.findMany({});

  return (
    <div>
      <ProductEditor categories={categories} product={null}></ProductEditor>
    </div>
  );
};

export default page;
