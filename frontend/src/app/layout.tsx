import type { Metadata } from "next";
import { Raleway } from 'next/font/google'
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import Script from "next/script";

// Import Raleway instead of Geist
const raleway = Raleway({
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: "Calendar+",
  description: "A new way to improve your life",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Script to prevent flash of incorrect theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Get stored theme
                const theme = localStorage.getItem('theme') || 'system';
                const colorTheme = localStorage.getItem('color-theme') || 'default';
                
                // Apply theme immediately
                const root = document.documentElement;
                
                // Handle system preference
                if (theme === 'system') {
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  root.classList.add(systemTheme);
                } else {
                  root.classList.add(theme);
                }
                
                // Apply color theme
                if (colorTheme !== 'default') {
                  root.classList.add(colorTheme);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={`${raleway.className} bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* <Link 
            href="/login" 
            className="bg-teal-500 text-white px-4 py-1 text-sm rounded"
          >
            Log In
          </Link> */}
          <main>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}