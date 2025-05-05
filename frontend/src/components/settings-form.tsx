'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { XIcon } from "lucide-react"
import ThemeToggle from "@/ui/theme-mode"
import { useDarkMode } from "@rbnd/react-dark-mode"
import { useEffect, useState } from "react"

// Available color themes from the ThemeToggle component
const COLOR_THEMES = [
  { name: "Default", value: "default" },
  { name: "Green", value: "theme-green" },
  { name: "Orange", value: "theme-orange" },
  { name: "Purple", value: "theme-purple" },
  { name: "Pink", value: "theme-pink" },
  { name: "Red", value: "theme-red" }
]

export function SettingsForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { mode, setMode } = useDarkMode()
  const [colorTheme, setColorTheme] = useState<string>("default")
  const [calendarStartDay, setCalendarStartDay] = useState<string>("sunday")

  // Load saved color theme and calendar start day on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("color-theme") || "default"
    const savedStartDay = localStorage.getItem("calendar-start-day") || "sunday"
    
    setColorTheme(savedTheme)
    setCalendarStartDay(savedStartDay)
  }, [])

  // Handle color theme change
  const handleColorThemeChange = (theme: string) => {
    // Remove any existing theme classes
    document.documentElement.classList.forEach(className => {
      if (className.startsWith('theme-')) {
        document.documentElement.classList.remove(className)
      }
    })
    
    // Add the new theme class if it's not the default
    if (theme !== "default") {
      document.documentElement.classList.add(theme)
    }
    
    // Save to localStorage
    localStorage.setItem("color-theme", theme)
    setColorTheme(theme)
  }

  // Handle calendar start day change
  const handleCalendarStartChange = (day: string) => {
    localStorage.setItem("calendar-start-day", day)
    setCalendarStartDay(day)
  }

  return (
    <div>
      <a href="/planner">
        <Button className="absolute left-5 top-17 rounded-md opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" variant="ghost">
          <XIcon className="h-50 w-50"/>
        </Button>
      </a>
      
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <form>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-xl font-bold">Settings</h1>
              <div className="text-center text-sm">Manage your settings and themes preferences.</div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="theme">Theme Mode</Label>
                <Select value={mode} onValueChange={(value) => setMode(value as "light" | "dark" | "system")}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Theme Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="color-theme">Color Theme</Label>
                <Select value={colorTheme} onValueChange={handleColorThemeChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Color Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    {COLOR_THEMES.map((theme) => (
                      <SelectItem key={theme.value} value={theme.value}>
                        <div className="flex items-center gap-2">
                          <div 
                            className={`h-4 w-4 rounded-full ${theme.value !== "default" ? theme.value : ""}`} 
                            style={{ 
                              backgroundColor: theme.value !== "default" ? "var(--color-primary)" : "currentColor"
                            }} 
                          />
                          <span>{theme.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="calendar-start">Calendar Start</Label>
                <Select value={calendarStartDay} onValueChange={handleCalendarStartChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Calendar Start" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunday">Sunday</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="timezone">Time Zone</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Time Zone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="pst">PST</SelectItem>
                    <SelectItem value="est">EST</SelectItem>
                    <SelectItem value="cst">CST</SelectItem>
                    <SelectItem value="mst">MST</SelectItem>
                  </SelectContent>
                </Select>
              </div>  
              <Button type="submit" className="w-full bg-(--accentcolor) text-white hover:bg-(--txtcolor)">
                Save Settings
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
