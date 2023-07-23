import Banner from "@/components/frontend/Banner/Banner";
import HomeCategories from "@/components/frontend/Category/HomeCategories";
import ProductFeed from "@/components/frontend/Products/ProductFeed";

export default function Home() {
  return (
    <div className=" max-w-screen-2xl mx-auto">
      {/* Banner */}
      <Banner></Banner>

      {/* categories */}
      <HomeCategories></HomeCategories>

      {/* product feed */}
      <ProductFeed></ProductFeed>
    </div>
  );
}
