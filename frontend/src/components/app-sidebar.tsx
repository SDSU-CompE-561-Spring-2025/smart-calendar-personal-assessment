'use client'

import * as React from "react"
import { NavUser } from "./nav-user"
import { useRouter } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "User",
    email: "email@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    { title: "Account", url: "/account" },
    { title: "Setting", url: "/settings" },
    { title: "Logout", action: "logout" },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/signin");
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-15 border-b border-sidebar-border">
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>Habits</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    {item.action === "logout" ? (
                      <button onClick={handleLogout} className="font-medium">
                        {item.title}
                      </button>
                    ) : (
                      <a href={item.url} className="font-medium">
                        {item.title}
                      </a>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}