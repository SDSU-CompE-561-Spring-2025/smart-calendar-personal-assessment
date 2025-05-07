'use client'

import { AccountForm } from "@/components/account-profile"
import { Headerinstance } from "@/components/header"
import { useTheme } from "@/components/theme-provider"
import { useEffect, useState } from "react"
import { Toaster } from "@/components/ui/sonner"

export default function AccountPage() {
  const { theme, colorTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle mounting to avoid hydration issues and ensure proper theme
  useEffect(() => {
    setMounted(true);
    
    // Ensure correct theme classes
    const root = document.documentElement;
    
    // This will reapply classes if needed
    if (theme && theme !== 'system') {
      root.classList.remove('light', 'dark');
      root.classList.add(theme);
    }
    
    if (colorTheme && colorTheme !== 'default') {
      // Remove any existing theme classes
      root.classList.forEach(className => {
        if (className.startsWith('theme-')) {
          root.classList.remove(className);
        }
      });
      
      // Add the current color theme
      root.classList.add(colorTheme);
    }
  }, [theme, colorTheme]);

  return (
    <div className="min-h-screen bg-background">
      <Headerinstance />
      <div className="flex flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
        <div className="w-full max-w-sm">
          <AccountForm />
        </div>
      </div>
      <Toaster />
    </div>
  )
}