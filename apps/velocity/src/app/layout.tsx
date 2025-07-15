import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PostHogProvider } from "@/components/PosthogProviders";
import { baseUrl } from '@/utils/constants'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VelociType – Speed Typing Challenge & Progress Tracker",
  description: "Unleash your typing potential with VelociType. Track your progress with quick 15-second tests, detailed performance graphs, and comprehensive stats including total typing hours, tests, characters, and words typed. Compete on the leaderboard and elevate your skills today.",
  keywords: ["Speed typing", "Typing test", "Online typing challenge", "Typing progress tracker", "Typing leaderboard", "Typing statistics", "15-second typing test", "Typing speed competition", "keyboard skills", "Typing performance", "Typing history graphs", "Typing metrics", "Typing accuracy", "Practice typing online", "Typing speed improvement"],
  openGraph: {
    title: "VelociType – Speed Typing Challenge & Progress Tracker",
    description: "Unleash your typing potential with VelociType. Track your progress with quick 15-second tests, detailed performance graphs, and comprehensive stats including total typing hours, tests, characters, and words typed. Compete on the leaderboard and elevate your skills today.",
    images: [`${baseUrl}/images/logo_blue.png`],
    url: baseUrl,
    type: 'website',
    siteName: "VelociType",
    locale: 'en_US',
  },
  twitter: {
    title: "VelociType – Speed Typing Challenge & Progress Tracker",
    description: "Unleash your typing potential with VelociType. Track your progress with quick 15-second tests, detailed performance graphs, and comprehensive stats including total typing hours, tests, characters, and words typed. Compete on the leaderboard and elevate your skills today.",
    images: [`${baseUrl}/images/logo_blue.png`],
    card: "summary_large_image",
    site: "@VelociType",
  },
  metadataBase: new URL(baseUrl),
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
        <PostHogProvider>
          <Providers>
            <div className="bg-slate-800 text-slate-50 md:py-10	py-2 px-6 md:px-20 min-h-screen max-h-screen tracking-wider font-mono overflow-hidden">
              <Header />
              <section className="w-full px-6 h-[80vh] flex flex-col justify-center items-center">
                {children}
              </section>
              <Footer />
            </div>
            <Toaster />
          </Providers>
        </PostHogProvider>
      </body>
    </html >
  );
}
