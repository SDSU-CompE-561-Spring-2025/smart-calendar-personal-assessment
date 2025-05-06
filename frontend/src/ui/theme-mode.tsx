'use client'

import { useDarkMode } from "@rbnd/react-dark-mode"
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Moon, Sun, Monitor } from "lucide-react"
import { useEffect, useState } from "react"

// Available color themes
const COLOR_THEMES = [
  { name: "Default", value: "" },
  { name: "Green", value: "theme-green" },
  { name: "Orange", value: "theme-orange" },
  { name: "Purple", value: "theme-purple" },
  { name: "Pink", value: "theme-pink" },
  { name: "Red", value: "theme-red" }
]

const ThemeToggle = () => {
  const { mode, setMode } = useDarkMode()
  const [colorTheme, setColorTheme] = useState<string>("")

  // Load saved color theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("color-theme") || ""
    setColorTheme(savedTheme)
    
    // Apply the theme class to the document
    if (savedTheme) {
      document.documentElement.classList.forEach(className => {
        if (className.startsWith('theme-')) {
          document.documentElement.classList.remove(className)
        }
      })
      if (savedTheme !== "default") {
        document.documentElement.classList.add(savedTheme)
      }
    }
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
    if (theme !== "") {
      document.documentElement.classList.add(theme)
    }
    
    // Save to localStorage
    localStorage.setItem("color-theme", theme)
    setColorTheme(theme)
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Dark mode toggle */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            {mode === "dark" ? (
              <Moon className="h-[1.2rem] w-[1.2rem]" />
            ) : mode === "light" ? (
              <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
              <Monitor className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setMode("light")}>
            <Sun className="mr-2 h-4 w-4" />
            <span>Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMode("dark")}>
            <Moon className="mr-2 h-4 w-4" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setMode("system")}>
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
              {colorTheme ? COLOR_THEMES.find(t => t.value === colorTheme)?.name : "Default"}
            </span>
            <div 
              className="h-4 w-4 rounded-full" 
              style={{ 
                backgroundColor: colorTheme ? "var(--color-primary)" : "currentColor"
              }} 
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {COLOR_THEMES.map((theme) => (
            <DropdownMenuItem 
              key={theme.value} 
              onClick={() => handleColorThemeChange(theme.value)}
              className="flex justify-between"
            >
              <span>{theme.name}</span>
              <div 
                className={`h-4 w-4 rounded-full ${theme.value}`} 
                style={{ 
                  backgroundColor: theme.value ? "var(--color-primary)" : "currentColor"
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
