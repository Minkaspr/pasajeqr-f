"use client"

import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { navMainData } from "@/constants/sidebar"

function getPageMetadata(pathname: string): { title: string; description?: string } {
  for (const item of navMainData) {
    if (item.url === pathname) {
      return { title: item.title, description: item.description }
    }
    if (item.items) {
      for (const subItem of item.items) {
        if (subItem.url === pathname || pathname.startsWith(subItem.url)) {
          return { title: subItem.title, description: subItem.description }
        }
      }
    }
  }
  return { title: "Dashboard" }
}

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname()
  const { title: pageTitle, description: pageDescription } = getPageMetadata(pathname)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex flex-col">
              <h1 className="text-xl font-semibold leading-tight">
                {pageTitle}
              </h1>
              {pageDescription && (
                <p className="text-sm text-muted-foreground">{pageDescription}</p>
              )}
            </div>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  )
}
