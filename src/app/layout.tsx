import Navbar from "@/components/frontend/Navbar/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/Toaster";
import Providers from "@/components/Providers";
import Footer from "@/components/frontend/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Embold - The Bold",
  description: "A clothing Apparal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className}, bg-emboldLight/50`}>
        <Providers>
          <Navbar></Navbar>
          {children}
          <Footer></Footer>
          <Toaster></Toaster>
        </Providers>
      </body>
    </html>
  );
}
