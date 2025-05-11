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
import { useTheme } from "@/components/theme-provider"

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
  const { theme, colorTheme, setTheme, setColorTheme } = useTheme()
  const [calendarStartDay, setCalendarStartDay] = useState<string>("sunday")
  const [mounted, setMounted] = useState(false)

  // Only access localStorage after component is mounted
  useEffect(() => {
    setMounted(true)
    const savedStartDay = localStorage.getItem("calendar-start-day") || "sunday"
    setCalendarStartDay(savedStartDay)
  }, [])

  // Handle calendar start day change
  const handleCalendarStartChange = (day: string) => {
    localStorage.setItem("calendar-start-day", day)
    setCalendarStartDay(day)
  }

  // Get appropriate button styles based on current theme
  const getButtonStyleClass = () => {
    switch(colorTheme) {
      case 'theme-green':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'theme-orange':
        return 'bg-orange-600 hover:bg-orange-700 text-white';
      case 'theme-purple':
        return 'bg-purple-600 hover:bg-purple-700 text-white';
      case 'theme-pink':
        return 'bg-pink-600 hover:bg-pink-700 text-white';
      case 'theme-red':
        return 'bg-red-600 hover:bg-red-700 text-white';
      default:
        return theme === 'dark' ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-black hover:bg-gray-700 text-white';
    }
  }

  // If not mounted, show a loading state
  if (!mounted) {
    return (
      <div className="flex justify-center py-8">
        <p>Loading settings...</p>
      </div>
    )
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
                <Select value={theme} onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}>
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
                <Select value={colorTheme} onValueChange={setColorTheme}>
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

              <Button 
                type="submit" 
                className="w-full bg-[var(--accentcolor)] text-white hover:bg-[var(--accentcolor2)]"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}