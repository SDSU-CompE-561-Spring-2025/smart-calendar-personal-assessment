'use client'

import * as React from "react"
import { NavUser } from "./nav-user"
import { useRouter } from "next/navigation"
import { useState }  from "react" 
import { API_HOST_BASE_URL } from "@/lib/constants" 

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
  user: { // get user stuff from backend
    name: "User",
    email: "email@example.com",
    avatar: "/potthing.jpg", // figure this out later
  },
  navMain: [
    { title: "Account", url: "/account" },
    { title: "Setting", url: "/settings" },
    { title: "Logout", action: "logout" },
  ],
}

export function AppSidebar({ ...props }: 
  React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  

  
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