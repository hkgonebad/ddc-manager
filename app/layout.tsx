import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import "./globals.css"
import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/font"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/toaster"
import { ReactQueryClientProvider } from "@/components/react-query-client-provider"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { TailwindIndicator } from "@/components/tailwind-indicator"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  manifest: "/manifest.json",
  // metadataBase: new URL("https://onyx-rho-pink.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  referrer: "origin-when-cross-origin",
  keywords: [
    "DDC",
    "Project Management",
    "DDC Manager",
    "DDC Project Management",
    "DDC Tool",
    "DDC Project Management Tool",
    "Reports",
  ],
  authors: [{ name: "Harikrishna Nair" }],
  creator: "Harikrishna Nair",
  publisher: "Harikrishna Nair",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  generator: "NextJS",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
}
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}
interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ReactQueryClientProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              {/* <SiteHeader /> */}
              <div className="flex-1">
                {children}
                <Toaster />
                {/* <Analytics />
                <SpeedInsights /> */}
              </div>

              <SiteFooter />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  )
}
