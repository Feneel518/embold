"use client";

import * as React from "react";
import Link from "next/link";
import { FC } from "react";
import { cn } from "@/lib/utils";
import EmboldLogo from "../../../../public/EmboldLogo.png";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/NavigationMenu";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface NavMenuProps {
  categories: [
    {
      id: string;
      name: string;
      slug: string;
      image: string | null;
      isActive: boolean;
      showOnHome: boolean;
      parentId: string | null;
    }
  ];
}

export const NavMenu: FC<NavMenuProps> = ({ categories }) => {
  const pathname = usePathname();

  if (pathname.includes("dashboard")) {
    return <div className="">Embold - The Bold</div>;
  }

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-embold hover:text-white data-[state=open]:bg-embold data-[active]:bg-embold focus:bg-embold">
            Best Seller
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <Image
                      className="w-40 aspect-square cursor-pointer"
                      src={EmboldLogo}
                      alt="Embold-Logo"
                      objectFit="contain"
                    ></Image>
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Embold - The Bold
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Beautifully designed components built with Radix UI and
                      Tailwind CSS.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem href="/docs" title="Western">
                Western clothes Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Quos, cumque.
              </ListItem>
              <ListItem href="/docs/installation" title="Ethinic">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod
                sapiente a eum fugiat doloribus ut?
              </ListItem>
              <ListItem href="/docs/primitives/typography" title="Jweller">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse,
                excepturi.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-embold hover:text-white data-[state=open]:bg-embold data-[active]:bg-embold focus:bg-embold">
            Categories
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {categories.map((category) => (
                <ListItem
                  key={category.id}
                  title={category.name}
                  href={`/category/${category.slug}`}
                ></ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        {/* <NavigationMenuItem>
          <Link href="/women">
            <NavigationMenuTrigger className="bg-transparent hover:bg-embold hover:text-white data-[state=open]:bg-embold data-[active]:bg-embold focus:bg-embold">
              Women
            </NavigationMenuTrigger>
          </Link>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> */}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
