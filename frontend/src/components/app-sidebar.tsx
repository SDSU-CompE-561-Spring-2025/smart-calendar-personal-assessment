'use client'

import * as React from "react"
import { NavUser } from "./nav-user"
import { useRouter } from "next/navigation"
import DragAndDropList from "@/components/habits"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "User",
    email: "email@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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
            <SidebarMenu>
              <DragAndDropList />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}