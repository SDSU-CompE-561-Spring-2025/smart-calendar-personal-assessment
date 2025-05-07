'use client'

import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export function Headerinstance() {
    const [mounted, setMounted] = useState(false);
    const { isLoggedIn, logout, checkAuth } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
        setMounted(true);
        // Verify auth status on mount
        checkAuth();
    }, [checkAuth]);
    
    const handleLogout = () => {
        logout();
        router.push('/signin');
    };
    
    // Only show the logout button if mounted and logged in
    const showLogoutButton = mounted && isLoggedIn;
    
    return (
        <header className="w-full border-b border-border py-2 px-4 flex justify-between items-center h-15 bg-background">
            <div className="items-center">
                <Link href="/" className="text-primary text-2xl font-bold">
                Calendar<span className="text-accent text-2xl font-bold">+</span>
                </Link>
            </div>
            
            {showLogoutButton && (
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    aria-label="Logout"
                >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </button>
            )}
        </header>
    );
}