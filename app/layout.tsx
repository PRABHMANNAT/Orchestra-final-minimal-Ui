import type React from "react"
import type { Metadata } from "next"
import { Comfortaa, Inter, Outfit, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { AristotleProvider } from "@/app/pm/aristotle-context"
import GlobalWorkspaceShell from "@/components/global-workspace-shell"
import "./globals.css"

const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
  weight: ["300", "400", "500", "600", "700"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Orchestra — Proof-first hiring",
  description: "Rank candidates with auditable evidence in under 60 seconds.",
  generator: 'v0.app',
  icons: {
    icon: '/orchestra-logo.svg',
    apple: '/orchestra-logo.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('forge:theme');if(t!=='dark'&&t!=='light')t='light';document.documentElement.dataset.theme=t;document.documentElement.classList.toggle('dark',t==='dark')}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${comfortaa.variable} ${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AristotleProvider>
            <GlobalWorkspaceShell>
              {children}
            </GlobalWorkspaceShell>
            <Analytics />
          </AristotleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
