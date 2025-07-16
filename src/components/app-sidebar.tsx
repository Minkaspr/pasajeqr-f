"use client"

import * as React from "react"
import { titleNavMain ,navMainData } from "@/constants/sidebar"

import {
  BusFront
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { AuthenticatedUser, getCurrentUser } from "@/types/auth"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [user, setUser] = React.useState<AuthenticatedUser | null>(null)

  React.useEffect(() => {
    const loadUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    };

    loadUser(); // carga inicial

    // Escucha cambios en el localStorage (evento personalizado que se dispara)
    const handleStorageChange = () => loadUser();

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


  const data = {
    user: {
      id: user?.id ?? 0,
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher team={{
          name: "Santa Catalina S.A.",
          logo: BusFront, 
          plan: "Transportes Urbanos"
        }} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain labelGroup={titleNavMain} items={navMainData} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
