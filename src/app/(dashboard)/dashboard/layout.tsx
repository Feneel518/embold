// import Providers from "@/components/Providers";
// import DashNavbar from "@/components/dashboard/Navbar/DashNavbar";
// import DashSideBar from "@/components/dashboard/Sidebar/DashSideBar";
// import { Toaster } from "@/components/ui/Toaster";
// import { getAuthSession } from "@/lib/authentication/auth";

import { cn } from "@/lib/utils";
import "@/app/globals.css";
// import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";
import DashSideBar from "@/components/dashboard/Sidebar/DashSideBar";
// import { redirect } from "next/navigation";

export const metadata = {
  title: "Embold - Dashboard",
  description: "A clothing apparel.",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <DashSideBar></DashSideBar>

      <div className="flex flex-col w-full">
        {/* <Providers> */}

        {/* <DashNavbar></DashNavbar> */}
        <div className="w-full px-40 max-lg:px-20 h-full pt-12 bg-embold ">
          {children}
        </div>
        {/* </Providers> */}
      </div>
    </div>
  );
}
