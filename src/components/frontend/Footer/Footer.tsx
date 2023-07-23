"use client";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface FooterProps {}

const Footer: FC<FooterProps> = ({}) => {
  const pathname = usePathname();
  if (pathname.includes("dashboard")) return null;
  return <div>Footer</div>;
};

export default Footer;
