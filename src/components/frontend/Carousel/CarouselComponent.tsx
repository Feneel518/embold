"use client";

import { FC } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

interface CarouselComponentProps {
  bannerData: {
    heading: string;
    image: string;
  }[];
}

const CarouselComponent: FC<CarouselComponentProps> = ({ bannerData }) => {
  return (
    <Carousel
      className="w-full h-full"
      autoPlay
      infiniteLoop
      showIndicators={false}
      showStatus={false}
      showThumbs={false}
      interval={5000}
    >
      {bannerData &&
        bannerData.map((data, index) => {
          return (
            <div
              key={index}
              className="w-full h-[220px] sm:h-[400px] lg:h-[700px] object-cover"
            >
              <Image
                src={data.image}
                objectFit="contain"
                alt="banner"
                width={1920}
                height={1080}
                loading="lazy"
              ></Image>
            </div>
          );
        })}
      {/* <div className="">
        <img src={bannerData[0].image} alt="" />
      </div>
      <div className="">
        <Image src={bannerData[0].image} alt="" width={1920} height={1920} />
      </div> */}
    </Carousel>
  );
};

export default CarouselComponent;
