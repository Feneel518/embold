import CategoryEditor from "@/components/dashboard/category/CategoryEditor";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {
  params: {
    slug: string;
  };
}

const page: FC<pageProps> = async ({ params }) => {
  const { slug } = params;

  const category = await db.category.findFirst({
    where: {
      id: slug,
    },
    include: {
      parent: true,
      subCategory: true,
    },
  });

  if (!category) return notFound();

  const categories = await db.category.findMany();

  return (
    <div>
      <CategoryEditor
        categories={categories}
        category={category}
      ></CategoryEditor>
    </div>
  );
};

export default page;
