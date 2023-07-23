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
  const product = await db.product.findFirst({
    where: {
      slug: slug,
    },
  });
  if (!product) return notFound();

  return <div className="max-w-screen-2xl mx-auto">{product?.name}</div>;
};

export default page;
