'use client'

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import {
  BadgeCheck,
  ChevronsUpDown,
  Settings,
  LogOut,
} from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { API_HOST_BASE_URL } from "@/lib/constants"
import { useTheme } from "@/components/theme-provider"

interface DisplayUser {
  name: string
  email: string
  avatar?: string
}

interface JWTPayload {
  sub: string // email stored in the token
}

export function NavUser({ user }: { user: DisplayUser }) {
  const { isMobile } = useSidebar()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground bg-background text-foreground"
            >

              <Avatar className="h-8 w-8 rounded-lg bg-background">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                  {user.name ? user.name[0] : 'U'}
                </AvatarFallback>

              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg bg-card text-card-foreground"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                    {user.name ? user.name[0] : 'U'}
                  </AvatarFallback>

                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuGroup>
              <a href="/account">

                <DropdownMenuItem className="text-foreground hover:bg-accent hover:text-accent-foreground">
                  <BadgeCheck className="mr-2 h-4 w-4"/>

                  Account
                </DropdownMenuItem>
              </a>
              <a href="/settings">
                <DropdownMenuItem className="text-foreground hover:bg-accent hover:text-accent-foreground">
                  <Settings className="mr-2 h-4 w-4"/>

                  Settings
                </DropdownMenuItem>
              </a>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-border" />
            <a href="/signin">
              <DropdownMenuItem className="text-foreground hover:bg-accent hover:text-accent-foreground">
                <LogOut className="mr-2 h-4 w-4"/>

                Log out
              </DropdownMenuItem>
            </a>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
