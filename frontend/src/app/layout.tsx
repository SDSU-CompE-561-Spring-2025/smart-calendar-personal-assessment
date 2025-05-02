import type { Metadata } from "next";
import { Raleway } from 'next/font/google'
import "./globals.css";
import Link from 'next/link';


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
        <header className="border-b border-(--txtcolor) py-2 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-(--accentcolor) text-2xl font-bold">
              Calendar<span className="text-(--accentcolor2) text-2xl font-bold">+</span>
            </Link>

          </div>
          {/* <Link 
            href="/login" 
            className="bg-teal-500 text-white px-4 py-1 text-sm rounded"
          >
            Log In
          </Link> */}
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}