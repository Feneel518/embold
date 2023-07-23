import { db } from "@/lib/db";
import { FC } from "react";
import CarouselComponent from "../Carousel/CarouselComponent";
interface BannerProps {}

const Banner: FC<BannerProps> = async ({}) => {
  const bannerData = await db.banner.findMany();

  console.log(bannerData);

  return (
    <div className="relative h-full">
      <div className="absolute w-full h-10 sm:h-32 bg-gradient-to-t from-emboldLight/30 to-transparent bottom-0 z-20"></div>
      <CarouselComponent bannerData={bannerData}></CarouselComponent>
    </div>
  );
};

export default Banner;
