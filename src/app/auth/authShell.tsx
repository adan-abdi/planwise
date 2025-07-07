'use client'

import { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'

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
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="pt-12 px-4 lg:px-12">
        <button
          onClick={() => {
            if (showBackButton && onBack) onBack()
          }}
          className={`flex items-center text-sm text-gray-600 border border-gray-300 rounded-md px-3 py-1 transition-opacity duration-150 ${
            showBackButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
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
            <h1 className="text-center text-3xl font-semibold tracking-tight">PlanWise</h1>
          )}

          {(title || subtitle) && (
            <div className="text-center space-y-1">
              {title && <h2 className="text-xl font-medium">{title}</h2>}
              {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
            </div>
          )}

          {children}
        </div>
      </main>

      <footer className="w-full max-w-md mx-auto px-4 py-6 text-center">
        <div className="flex justify-center gap-12 text-xs text-gray-400">
          <a href="#" className="hover:underline">Developer</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
        </div>
      </footer>
    </div>
  )
}
