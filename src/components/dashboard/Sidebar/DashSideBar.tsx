"use client";

import {
  ArrowLeft,
  BookMarked,
  Home,
  LayoutDashboard,
  List,
  LogOut,
  MapPin,
  Package2,
  PersonStanding,
  Settings,
  ShirtIcon,
  Users2,
} from "lucide-react";
import Link from "next/link";
import { FC, useState } from "react";

interface DashSideBarProps {}

const DashSideBar: FC<DashSideBarProps> = ({}) => {
  const [openSidebar, setOpenSidebar] = useState<boolean>(true);
  return (
    <div
      className={`${
        openSidebar ? "w-60" : "w-20"
      } transition-all duration-300 ease-in-out bg-emboldLight min-h-screen flex flex-col`}
    >
      {/* top */}
      <div className="h-20 flex items-center justify-center relative ">
        <div className="flex items-center  text-xl ">
          <ShirtIcon />
          {openSidebar && <h2 className="font-bold">Embold</h2>}
        </div>
        <div
          onClick={() => setOpenSidebar(!openSidebar)}
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center border border-embold absolute -bottom-10 -right-3 cursor-pointer"
        >
          <ArrowLeft
            className={`${
              openSidebar ? "" : "rotate-180"
            } transition-all duration-200 ease-in-out`}
          ></ArrowLeft>
        </div>
      </div>
      <hr className="h-0 border border-embold/20" />

      {/* center */}
      <div
        className={` px-4 list-none flex flex-col ${
          !openSidebar && "gap-4 mt-10"
        }`}
      >
        {openSidebar && (
          <p className="text-xs font-medium text-gray-400 mt-8 mb-2 px-2">
            MAIN
          </p>
        )}
        <Link
          href="/dashboard"
          className=" flex items-center gap-2 py-2 px-2 cursor-pointer rounded-md hover:bg-embold hover:text-emboldLight"
        >
          <LayoutDashboard />
          {openSidebar && <span>Dashboard</span>}
        </Link>
        <Link
          href="/dashboard/home"
          className=" flex items-center gap-2 py-2 px-2 cursor-pointer rounded-md hover:bg-embold hover:text-emboldLight"
        >
          <Home />
          {openSidebar && <span>Home</span>}
        </Link>
        {openSidebar && (
          <p className="text-xs font-medium text-gray-400 mt-8 mb-2 px-2">
            LISTS
          </p>
        )}
        <Link
          href="/dashboard/products"
          className="flex items-center gap-2 py-2 px-2 cursor-pointer rounded-md hover:bg-embold hover:text-emboldLight"
        >
          <Package2 />
          {openSidebar && <span>Products</span>}
        </Link>
        <Link
          href="/dashboard/categories"
          className="flex items-center gap-2 py-2 px-2 cursor-pointer rounded-md hover:bg-embold hover:text-emboldLight"
        >
          <List />
          {openSidebar && <span>Categories</span>}
        </Link>
        <Link
          href="/dashboard/attributes"
          className="flex items-center gap-2 py-2 px-2 cursor-pointer rounded-md hover:bg-embold hover:text-emboldLight"
        >
          <List />
          {openSidebar && <span>Attributes</span>}
        </Link>
        <li className="flex items-center gap-2 py-2 px-2 cursor-pointer rounded-md hover:bg-embold hover:text-emboldLight">
          <Users2 />
          {openSidebar && <span>Customers</span>}
        </li>
        <li className="flex items-center gap-2 py-2 px-2 cursor-pointer rounded-md hover:bg-embold hover:text-emboldLight">
          <BookMarked />
          {openSidebar && <span>Orders</span>}
        </li>
        {openSidebar && (
          <p className="text-xs font-medium text-gray-400 mt-8 mb-2 px-2">
            USEFUL
          </p>
        )}
        <li className="flex items-center gap-2 py-2 px-2 cursor-pointer rounded-md hover:bg-embold hover:text-emboldLight">
          <MapPin />
          {openSidebar && <span>Geography</span>}
        </li>
        {openSidebar && (
          <p className="text-xs font-medium text-gray-400 mt-8 mb-2 px-2">
            SERVICE
          </p>
        )}
        <li className="flex items-center gap-2 py-2 px-2 cursor-pointer rounded-md hover:bg-embold hover:text-emboldLight">
          <Settings />
          {openSidebar && <span>Settings</span>}
        </li>
      </div>

      {/* bottom */}
      <div
        className={` px-4 list-none flex flex-col ${
          !openSidebar && "gap-4  mt-4"
        }`}
      >
        {openSidebar && (
          <p className="text-xs font-medium text-gray-400 mt-8 mb-2 px-2">
            USER
          </p>
        )}
        <li className="flex items-center gap-2 py-2 px-2 cursor-pointer rounded-md hover:bg-embold hover:text-emboldLight">
          <PersonStanding />
          {openSidebar && <span>Profile</span>}
        </li>
        <li className="flex items-center gap-2 py-2 px-2 cursor-pointer rounded-md hover:bg-embold hover:text-emboldLight">
          <LogOut />
          {openSidebar && <span>Logout</span>}
        </li>
      </div>
    </div>
  );
};

export default DashSideBar;
