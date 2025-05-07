'use client'

import React from "react"
import { useRouter } from "next/navigation"
import DragAndDropList from "@/components/habits"
import { NavUser } from "@/components/nav-user"
import { HabitForm } from "@/components/habit-form"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusIcon, ListIcon } from "lucide-react"
import { Toaster } from "@/components/ui/sonner"
import { API_HOST_BASE_URL } from "@/lib/constants"
import { useTheme } from "@/components/theme-provider"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const { theme, colorTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [view, setView] = useState<'list' | 'create'>('list')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [userData, setUserData] = useState({
    name: "Loading...",
    email: "",
    avatar: ""
  })
  const [loading, setLoading] = useState(true)

  // Handle mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) {
          setUserData({
            name: "Guest User",
            email: "Please sign in",
            avatar: ""
          })
          setLoading(false)
          return
        }

        const response = await fetch(`${API_HOST_BASE_URL}/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (response.status === 404) {
          console.warn("User not found")
          localStorage.removeItem('access_token')
          router.push('/signin')
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const data = await response.json()
        setUserData({
          name: `${data.first_name} ${data.last_name}`,
          email: data.email,
          avatar: data.avatar || ""
        })
      } catch (error) {
        console.error("Error fetching user data:", error)
        setUserData({
          name: "User",
          email: "Error loading data",
          avatar: ""
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [mounted, router])


  const handleLogout = () => {
    localStorage.removeItem("access_token");
    router.push("/signin");
  }

  const handleHabitCreated = () => {
    setView('list');
    setRefreshTrigger(prev => prev + 1);
  }

  // If not mounted yet, don't render
  if (!mounted) {
    return null;
  }

  return (
    <Sidebar {...props} className="bg-background text-foreground border-border">
      <SidebarHeader className="h-15 border-b border-border bg-background">
        <NavUser user={userData} />

      </SidebarHeader>
      <SidebarContent className="bg-background">
        <SidebarGroup>
          <div className="flex justify-between items-center px-4 py-2 bg-background text-foreground">
            <h2 className="text-lg font-medium">
              {view === 'list' ? 'Your Habits' : 'Create Habit'}
            </h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('list')}
                className={view === 'list' ? 'bg-accent/20' : ''}
              >
                <ListIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('create')}
                className={view === 'create' ? 'bg-accent/20' : ''}
                data-create-habit
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <SidebarGroupContent className="bg-background">
            <SidebarMenu>
              {view === 'list' ? (
                <DragAndDropList key={refreshTrigger} />
              ) : (
                <HabitForm onSuccess={handleHabitCreated} />
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail className="bg-background border-border" />
      <Toaster />
    </Sidebar>
  )
}