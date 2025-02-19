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
  title: "Velocitype – Speed Typing Challenge & Progress Tracker",
  description: "Unleash your typing potential with Velocitype. Track your progress with quick 15-second tests, detailed performance graphs, and comprehensive stats including total typing hours, tests, characters, and words typed. Compete on the leaderboard and elevate your skills today.",
  keywords: ["Speed typing", "Typing test", "Online typing challenge", "Typing progress tracker", "Typing leaderboard", "Typing statistics", "15-second typing test", "Typing speed competition", "keyboard skills", "Typing performance", "Typing history graphs", "Typing metrics", "Typing accuracy", "Practice typing online", "Typing speed improvement"],
  openGraph: {
    title: "Velocitype – Speed Typing Challenge & Progress Tracker",
    description: "Unleash your typing potential with Velocitype. Track your progress with quick 15-second tests, detailed performance graphs, and comprehensive stats including total typing hours, tests, characters, and words typed. Compete on the leaderboard and elevate your skills today.",
    images: ["https://velocitype.syedfaizan.in/images/logo_blue.png"],
    url: "https://velocitype.syedfaizan.in",
    type: 'website',
    siteName: "Velocitype",
    locale: 'en_US',
  },
  twitter: {
    title: "Velocitype – Speed Typing Challenge & Progress Tracker",
    description: "Unleash your typing potential with Velocitype. Track your progress with quick 15-second tests, detailed performance graphs, and comprehensive stats including total typing hours, tests, characters, and words typed. Compete on the leaderboard and elevate your skills today.",
    images: ["https://velocitype.syedfaizan.in/images/logo_blue.png"],
    card: "summary_large_image",
    site: "@Velocitype",
  },
  metadataBase: new URL('https://velocitype.syedfaizan.in'),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" }
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "android-chrome", url: "/android-chrome-192x192.png" },
      { rel: "android-chrome", url: "/android-chrome-512x512.png" }
    ]
  }
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
