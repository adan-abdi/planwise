import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PlanWise',
  description: 'AI-Driven Paraplanning',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className="h-full">{children}</body>
    </html>
  )
}
