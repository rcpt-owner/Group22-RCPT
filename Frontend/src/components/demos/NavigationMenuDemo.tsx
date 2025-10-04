import * as React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const pages = [
  { name: "Research Tool Demo Components", to: "/" },
  { name: "Login", to: "/login" },
  { name: "Dashboard", to: "/dashboard" },
  { name: "Project Workspace", to: "/project" },
  { name: "Project Form", to: "/project-form" },
  { name: "Staff Costs", to: "/staff-costs" },
];

export function NavigationMenuDemo() {
  return (
    <NavigationMenu className="mb-4 mx-auto">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Main Pages</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 w-[200px]">
              {pages.map((page) => (
                <li key={page.to}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={page.to}
                      className="block px-4 py-2 rounded hover:bg-gray-100"
                    >
                      {page.name}
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
