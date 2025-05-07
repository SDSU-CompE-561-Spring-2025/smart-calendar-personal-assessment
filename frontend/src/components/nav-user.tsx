'use client'

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {jwtDecode} from "jwt-decode"
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

interface UserResponse {
  id: number
  first_name: string
  last_name: string
  email: string
  verif_code: string
  acc_created: string
}

interface DisplayUser {
  name: string
  email: string
}

interface JWTPayload {
  sub: string // email stored in the token
}

export function NavUser() {
  const [user, setUser] = useState<DisplayUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isMobile } = useSidebar()
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/signin")
      return
    }
    let emailParam: string
    try {
      const { sub } = jwtDecode<JWTPayload>(token)
      emailParam = sub
    } catch (e) {
      setError("Invalid token")
      setLoading(false)
      return
    }
    const url = `${API_HOST_BASE_URL}/user/get_self?email=${encodeURIComponent(
      emailParam
    )}`
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Error ${res.status}`)
        return res.json()
      })
      .then((data: UserResponse) => {
        setUser({ name: `${data.first_name} ${data.last_name}`, email: data.email })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return <div className="p-4">Loading user...</div>
  if (error || !user)
    return <div className="p-4 text-red-600">Error: {error || "Failed to load user"}</div>

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    router.push("/signin")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage alt={user.name} />
                <AvatarFallback className="rounded-lg">U</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage alt={user.name} />
                  <AvatarFallback className="rounded-lg">U</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <a href="/account">
                <DropdownMenuItem>
                  <BadgeCheck />
                  Account
                </DropdownMenuItem>
              </a>
              <a href="/settings">
                <DropdownMenuItem>
                  <Settings />
                  Settings
                </DropdownMenuItem>
              </a>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <a href="/signin">
              <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer">
                <LogOut />
                Log out
              </DropdownMenuItem>
            </a>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}