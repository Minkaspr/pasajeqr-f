"use client"

import { useState, useEffect } from "react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@radix-ui/react-navigation-menu"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Bus, Menu, User, LogIn } from "lucide-react"

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/about", label: "Nosotros" },
]

export function PublicNavbar() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isScrolled
          ? "backdrop-blur-md bg-white/95 border-b border-gray-200 shadow-sm"
          : "backdrop-blur-sm bg-white/80 border-b border-gray-100",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg group-hover:from-blue-700 group-hover:to-blue-800 transition-all duration-200">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-gray-900">Santa Catalina</div>
              <div className="text-xs text-gray-500 -mt-1">Transporte S.A.</div>
            </div>
            <div className="sm:hidden text-lg font-bold text-gray-900">SC</div>
          </Link>
          <div className="flex flex-raw items-center gap-3">
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList className="flex gap-1 items-center">
                  {navLinks.map(({ href, label }) => (
                    <NavigationMenuItem key={href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={href}
                          className={cn(
                            "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-gray-50",
                            pathname === href ? "text-blue-700 bg-blue-50" : "text-gray-700 hover:text-gray-900",
                          )}
                        >
                          {label}
                          {pathname === href && (
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                          )}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="text-gray-700 hover:text-gray-900">
                <Link href="/auth/login" className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Ingresar
                </Link>
              </Button>
              <Button size="sm" asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/auth/register" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Registrar
                </Link>
              </Button>
            </div>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center gap-3">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-lg">
                      <Bus className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">Santa Catalina</div>
                      <div className="text-xs text-gray-500 -mt-1">Transporte S.A.</div>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="px-4 mt-8 space-y-1">
                  {navLinks.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={closeMobileMenu}
                      className={cn(
                        "flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-200",
                        pathname === href
                          ? "text-blue-700 bg-blue-50 border-l-4 border-blue-600"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
                      )}
                    >
                      {label}
                    </Link>
                  ))}
                </div>

                <div className="mt-8 pt-6 px-4 border-t border-gray-200 space-y-3">
                  <Button variant="outline" asChild className="w-full justify-start" onClick={closeMobileMenu}>
                    <Link href="/auth/login" className="flex items-center gap-3">
                      <LogIn className="w-4 h-4" />
                      Ingresar a mi cuenta
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                    onClick={closeMobileMenu}
                  >
                    <Link href="/auth/register" className="flex items-center gap-3">
                      <User className="w-4 h-4" />
                      Crear cuenta nueva
                    </Link>
                  </Button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="text-center text-sm text-gray-500">
                    <p>Conectando Lima desde 2003</p>
                    <p className="mt-1">🚌 Transporte confiable y seguro</p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
