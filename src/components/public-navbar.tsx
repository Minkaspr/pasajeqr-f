"use client"

import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/about", label: "Nosotros" },
]

export function PublicNavbar() {
  const pathname = usePathname()
  return (
    <nav className="sticky top-0 z-50 backdrop-blur border-b drop-shadow-sm bg-white/70">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <div className="text-xl font-bold">Santa Catalina SA</div>
        <NavigationMenu>
          <NavigationMenuList className="flex gap-4 items-center">
            {navLinks.map(({ href, label }) => (
              <NavigationMenuItem key={href}>
                <NavigationMenuLink asChild>
                  <Link
                    href={href}
                    className={cn(
                      "transition-all px-2 py-1 text-sm font-medium",
                      pathname === href
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <Button variant="outline" asChild>
                <Link href="/auth/login">Ingresar</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button asChild>
                <Link href="/auth/register">Registrar</Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  )
}