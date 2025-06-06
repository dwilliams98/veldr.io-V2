import type React from "react"
import type { Metadata } from "next"
import { AppProvider } from "@/contexts/app-context"
import "./globals.css"

export const metadata: Metadata = {
  title: "Veldr.io - Elder Fraud Protection",
  description: "AI-powered protection for your loved ones",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}
