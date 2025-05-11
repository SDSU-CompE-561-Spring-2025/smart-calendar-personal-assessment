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
                const theme = 'light';
                const colorTheme = 'default';
                
                // Apply theme immediately
                const root = document.documentElement;
                
                // Handle system preference
                root.classList.add(theme);
                
                // Apply color theme
                root.classList.add(colorTheme);
              })();
            `,
          }}
        />
      </head>
      <body className={`${raleway.className} bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
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