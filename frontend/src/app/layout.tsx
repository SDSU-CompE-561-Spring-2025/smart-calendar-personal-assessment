import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

// Import Raleway instead of Geist
const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
});

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
    <html lang="en" className={raleway.variable}>
      <body className="font-sans">
        <header className="border border-gray-300 py-2 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-teal-500 text-xl font-medium">
              Calendar
            </Link>
            <button className="text-teal-500 ml-1 text-xl">+</button>
          </div>
          <Link 
            href="/login" 
            className="bg-teal-500 text-white px-4 py-1 text-sm rounded"
          >
            Log In
          </Link>
        </header>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}