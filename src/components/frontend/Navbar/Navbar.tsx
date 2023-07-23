import Image from "next/image";
import { FC } from "react";
import EmboldLogo from "../../../../public/EmboldLogo.png";
import Link from "next/link";
import { Heart, Search, ShoppingCart } from "lucide-react";
import { NavMenu } from "./NavMenu";
import { db } from "@/lib/db";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = async ({}) => {
  const categories = await db.category.findMany({});

  return (
    <header className="bg-emboldLight px-8 py-4 shadow-lg z-50">
      {/* top */}
      <div className="flex items-center justify-between flex-grow gap-4">
        {/* logo */}
        <div className=" flex items-center flex-grow sm:flex-grow-0 gap-16">
          <Link href="/" className="flex ">
            <Image
              className="w-12 max-sm:w-28 aspect-square cursor-pointer"
              src={EmboldLogo}
              alt="Embold-Logo"
              objectFit="contain"
            ></Image>
          </Link>

          <div className="hidden lg:flex">
            {/* @ts-ignore */}
            <NavMenu categories={categories}></NavMenu>
          </div>
        </div>
        {/* right */}
        <div className="flex gap-8 justify-end w-[800px]">
          {/* search bar */}
          <div className=" hidden flex-grow  placeholder:text-xs sm:flex item-center  rounded-md bg-embold hover:bg-embold/90">
            <input
              className="p-2 h-full  flex-grow  flex-shrink rounded-l-md focus:outline-embold pl-2"
              type="text"
              placeholder="Search Product"
            />
            <Search className="w-8 h-8 p-2 cursor-pointer text-white"></Search>
          </div>

          {/* Right */}
          <div className="flex items-center gap-4 md:gap-8 whitespace-nowrap">
            {/* Account */}
            <div className="text-xs">
              <p>Hello, </p>
              <p>Embold </p>
            </div>
            {/* Whislist */}
            <div className="relative">
              <span className="absolute -top-2 -right-2  text-xs bg-red-300 rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
              <Heart className="w-6 cursor-pointer" />
            </div>
            {/* basket */}
            <div className="relative">
              <span className="absolute -top-2 -right-2 text-xs text-white bg-embold rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
              <ShoppingCart className="w-6 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
      {/* bottom */}
      <div className=""></div>
    </header>
  );
};

export default Navbar;
