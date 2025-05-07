"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"
type ColorTheme = "default" | "theme-green" | "theme-orange" | "theme-purple" | "theme-pink" | "theme-red"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  attribute?: string
  enableSystem?: boolean
}

type ThemeProviderState = {
  theme: Theme
  colorTheme: ColorTheme
  setTheme: (theme: Theme) => void
  setColorTheme: (theme: ColorTheme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  colorTheme: "default",
  setTheme: () => null,
  setColorTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  attribute = "class",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme)
  const [colorTheme, setColorTheme] = useState<ColorTheme>("default")
  const [mounted, setMounted] = useState(false)

  // Only access localStorage after component is mounted (client-side)
  useEffect(() => {
    setMounted(true)
    const storedTheme = window.localStorage.getItem("theme") as Theme
    const storedColorTheme = window.localStorage.getItem("color-theme") as ColorTheme
    
    if (storedTheme) {
      setThemeState(storedTheme)
    }
    
    if (storedColorTheme) {
      setColorTheme(storedColorTheme)
    }
  }, [])

  // Handle theme class on document
  useEffect(() => {
    if (!mounted) return

    const root = window.document.documentElement
    
    // Remove old theme class
    root.classList.remove("light", "dark")
    
    // Get system preference
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      return
    }
    
    // Add theme class
    root.classList.add(theme)
  }, [theme, mounted])

  // Handle color theme class
  useEffect(() => {
    if (!mounted) return
    
    // Apply color theme
    const root = window.document.documentElement
    
    // Remove any existing theme classes
    root.classList.forEach(className => {
      if (className.startsWith('theme-')) {
        root.classList.remove(className)
      }
    })
    
    // Add the new theme class if it's not the default
    if (colorTheme !== "default") {
      root.classList.add(colorTheme)
    }
  }, [colorTheme, mounted])

  const setTheme = (theme: Theme) => {
    if (mounted) {
      window.localStorage.setItem("theme", theme)
    }
    setThemeState(theme)
  }

  const handleSetColorTheme = (theme: ColorTheme) => {
    if (mounted) {
      window.localStorage.setItem("color-theme", theme)
    }
    setColorTheme(theme)
  }

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    
    const handleChange = () => {
      if (theme === "system") {
        const root = window.document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(mediaQuery.matches ? "dark" : "light")
      }
    }
    
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [theme, mounted])

  // Prevent flash of incorrect theme
  const value = {
    theme,
    colorTheme,
    setTheme,
    setColorTheme: handleSetColorTheme,
  }

  // If not mounted yet (server-side), render without any visual changes
  if (!mounted) {
    return (
      <ThemeProviderContext.Provider value={value}>
        {children}
      </ThemeProviderContext.Provider>
    )
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
} 