import type { Metadata } from "next";
// import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter } from "next/font/google"
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({subsets : ["latin"]})

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

export const metadata: Metadata = {
  title: "Quizzle",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "antialiased min-h-screen pt-16" )}>
        <Providers>
        <Navbar />
        {children}
        <Toaster />
        </Providers>
      </body>
    </html>
  );
}
