'use client'

import { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import Image from "next/image";
import { useTheme } from "../../theme-context";

interface AuthShellProps {
  children: ReactNode
  showBackButton?: boolean
  onBack?: () => void
  title?: string
  subtitle?: string
  headerNode?: ReactNode
}

export default function AuthShell({
  children,
  showBackButton = false,
  onBack,
  title = 'Welcome to PlanWise',
  subtitle = 'Enter your details to get started',
  headerNode,
}: AuthShellProps) {
  const { darkMode } = useTheme();
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[var(--background)] dark:text-[var(--foreground)]">
      <header className="pt-12 px-4 lg:px-12">
        <button
          onClick={() => {
            if (showBackButton && onBack) onBack()
          }}
          className={`flex items-center text-sm text-gray-600 dark:text-[var(--foreground)] border border-gray-300 dark:border-[var(--border)] rounded-md px-3 py-1 transition-opacity duration-150 ${
            showBackButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{
            background: darkMode ? 'var(--muted)' : 'white',
            borderColor: darkMode ? 'var(--border)' : '#e4e4e7',
          }}
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Go back
        </button>
      </header>

      <main className="flex-1 flex justify-center items-center px-4">
        <div className="w-[380px] space-y-6">
          {headerNode ? (
            <div className="flex justify-center">{headerNode}</div>
          ) : (
            <div className="flex justify-center">
              <Image
                src={darkMode ? "/logo_darkmode.png" : "/logo.svg"}
                alt="PlanWise Logo"
                width={120}
                height={48}
                className="h-12 w-auto"
              />
            </div>
          )}

          {(title || subtitle) && (
            <div className="text-center space-y-1">
              {title && <h2 className="text-xl font-medium dark:text-[var(--foreground)]">{title}</h2>}
              {subtitle && <p className="text-sm text-gray-400 dark:text-[var(--foreground)]">{subtitle}</p>}
            </div>
          )}

          {children}
        </div>
      </main>

      <footer className="w-full max-w-md mx-auto px-4 py-6 text-center">
        <div className="flex justify-center gap-12 text-xs text-gray-400 dark:text-[var(--foreground)]">
          <a href="#" className="hover:underline">Developer</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
        </div>
      </footer>
    </div>
  )
}
