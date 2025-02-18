import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Velocitype",
  description: "Check Your Typing speed with VelociType",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        <div className="bg-slate-800 text-slate-50 md:py-10	py-2 px-6 md:px-20 min-h-screen max-h-screen tracking-wider font-mono overflow-hidden">
          <Providers>
            {children}
          </Providers>
        </div>
      </body>
    </html>
  );
}
