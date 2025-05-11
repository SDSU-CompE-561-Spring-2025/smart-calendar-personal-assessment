'use client'

import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from './ui/button';

export function Headerinstance() {
    const [mounted, setMounted] = useState(false);
    const { isLoggedIn, logout } = useAuth();
    const router = useRouter();
    const { theme } = useTheme();
    
    useEffect(() => {
        setMounted(true);
    }, []);
    
    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('theme');
        localStorage.removeItem('color-theme');
        localStorage.removeItem('calendar-start-day');
        
        logout();
        
        // Force a full page reload to reset theme settings
        window.location.href = '/signin';
    };
    
    return (
        <header className="w-full border-b border-border py-2 px-4 flex justify-between items-center h-15 bg-background">
            <div className="items-center">
                <Link href="/" className="text-[var(--accentcolor)] text-2xl font-bold">
                Calendar<span className="text-[var(--accentcolor2)] text-2xl font-bold">+</span>
                </Link>
            </div>
            
            {mounted && isLoggedIn && (
                <Button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded border border-border bg-[var(--accentcolor)] text-white hover:bg-[var(--accentcolor2)] transition-colors rounded-lg"

                    aria-label="Logout"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </Button>
            )}
        </header>
    );
}