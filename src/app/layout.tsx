import './globals.css'
import type { Metadata } from 'next'
import { ThemeProvider } from "../theme-context";

export const metadata: Metadata = {
  title: 'PlanWise',
  description: 'AI-Driven Paraplanning',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
