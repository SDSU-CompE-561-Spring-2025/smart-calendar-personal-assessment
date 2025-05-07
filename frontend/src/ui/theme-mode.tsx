'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

// Available color themes
const COLOR_THEMES = [
  { name: "Default", value: "default" },
  { name: "Green", value: "theme-green" },
  { name: "Orange", value: "theme-orange" },
  { name: "Purple", value: "theme-purple" },
  { name: "Pink", value: "theme-pink" },
  { name: "Red", value: "theme-red" }
] as const;

type ColorTheme = (typeof COLOR_THEMES)[number]['value'];

const ThemeToggle = () => {
  const { theme, colorTheme, setTheme, setColorTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Only render the toggle after mounting on the client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Dark mode toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            {theme === "dark" ? (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            ) : theme === "light" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Monitor className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Monitor className="mr-2 h-4 w-4" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Color theme selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            <span>
              {COLOR_THEMES.find(t => t.value === colorTheme)?.name || "Default"}
            </span>
            <div 
              className={`h-4 w-4 rounded-full ${colorTheme !== "default" ? colorTheme : ""}`} 
              style={{ 
                backgroundColor: colorTheme !== "default" ? "var(--color-primary)" : "currentColor"
              }} 
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {COLOR_THEMES.map((theme) => (
            <DropdownMenuItem 
              key={theme.value} 
              onClick={() => setColorTheme(theme.value as ColorTheme)}
              className="flex justify-between"
            >
              <span>{theme.name}</span>
              <div 
                className={`h-4 w-4 rounded-full ${theme.value !== "default" ? theme.value : ""}`} 
                style={{ 
                  backgroundColor: theme.value !== "default" ? "var(--color-primary)" : "currentColor"
                }} 
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ThemeToggle
