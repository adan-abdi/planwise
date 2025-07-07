'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import AuthShell from '../authShell'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [step, setStep] = useState<'login' | 'password'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidEmail(email)) {
      setStep('password')
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.')
      return
    }

    console.log('Submitted login:', { email, password })
    router.push('/dashboard')
  }

  useEffect(() => {
    if (password.length === 0) {
      setPasswordError('')
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.')
    } else {
      setPasswordError('')
    }
  }, [password])

  const sharedInputClass =
    'w-full px-4 py-2 rounded-[10px] bg-zinc-100 text-sm shadow-inner border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition duration-150 ease-in-out placeholder:text-gray-400'

  const renderPasswordField = () => (
    <div className="space-y-2">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${sharedInputClass} pr-10`}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {passwordError && (
        <p className="text-sm text-red-500 text-center">{passwordError}</p>
      )}
    </div>
  )

  return (
    <AuthShell
      showBackButton={step === 'password'}
      onBack={() => {
        setStep('login')
        setPassword('')
        setPasswordError('')
      }}
      headerNode={
        step === 'password' ? (
          <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
        ) : undefined
      }
      title={step === 'password' ? 'Enter Password' : 'Welcome to PlanWise'}
      subtitle={
        step === 'password'
          ? 'Please enter your custom account password.'
          : 'Enter your details to get started'
      }
    >
      {step === 'login' ? (
        <form onSubmit={handleEmailSubmit} className="space-y-6 w-full">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={sharedInputClass}
            required
          />
          {isValidEmail(email) ? (
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-[10px] shadow hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Continue
            </button>
          ) : (
            <p className="text-xs text-center text-gray-500 pt-3">
              We’ll create an account if you don’t have one yet.
            </p>
          )}
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="space-y-4 w-full">
          {renderPasswordField()}
          <button
            type="submit"
            className="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-[10px] shadow hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={passwordError !== ''}
          >
            Continue
          </button>
        </form>
      )}
    </AuthShell>
  )
}
