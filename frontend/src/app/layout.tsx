import type { Metadata } from "next";
import { Raleway } from 'next/font/google'
import "./globals.css";

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
    <html lang="en">
      <body className={raleway.className}>
          {/* <Link 
            href="/login" 
            className="bg-teal-500 text-white px-4 py-1 text-sm rounded"
          >
            Log In
          </Link> */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}