import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Veldr.io - Elder Fraud Protection',
  description: 'Protect your loved ones from fraud with AI-powered monitoring',
  generator: 'v0.dev',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes',
  themeColor: '#00BFFF',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">{children}</body>
    </html>
  )
}