'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Lock } from 'lucide-react'
import AuthShell from '../authShell'
import { useRouter } from 'next/navigation'
import { useTheme } from '../../../theme-context'

export default function LoginPage() {
  const { darkMode } = useTheme();
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
    'w-full px-4 py-2 rounded-[10px] text-sm shadow-inner border focus:outline-none transition duration-150 ease-in-out';

  const inputStyle = darkMode
    ? {
        background: 'var(--muted)',
        color: 'var(--foreground)',
        borderColor: 'var(--border)',
        boxShadow: '0 1px 2px 0 #1112',
      }
    : {
        background: '#f4f4f5',
        color: '#18181b',
        borderColor: 'transparent',
        boxShadow: '0 1px 2px 0 #e0e7ef',
      };

  const buttonStyle = darkMode
    ? {
        backgroundColor: '#2563eb',
        color: '#fff',
        boxShadow: '0 2px 8px 0 #1112',
      }
    : {
        backgroundColor: '#2563eb',
        color: '#fff',
        boxShadow: '0 2px 8px 0 #e0e7ef',
      };

  const infoTextStyle = darkMode
    ? { color: '#bbb' }
    : { color: '#666' };

  const errorTextStyle = darkMode
    ? { color: '#ff6b6b' }
    : { color: '#e53e3e' };

  const renderPasswordField = () => (
    <div className="space-y-2">
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={`${sharedInputClass} pr-10`}
          style={inputStyle}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2"
          style={{ color: darkMode ? '#bbb' : '#666' }}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {passwordError && (
        <p className="text-sm text-center" style={errorTextStyle}>{passwordError}</p>
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
            style={inputStyle}
            required
          />
          {isValidEmail(email) ? (
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium rounded-[10px] shadow transition duration-150 ease-in-out focus:outline-none focus:ring-2"
              style={buttonStyle}
            >
              Continue
            </button>
          ) : (
            <p className="text-xs text-center pt-3" style={infoTextStyle}>
              We’ll create an account if you don’t have one yet.
            </p>
          )}
        </form>
      ) : (
        <form onSubmit={handlePasswordSubmit} className="space-y-4 w-full">
          {renderPasswordField()}
          <button
            type="submit"
            className="w-full mt-2 px-4 py-2 text-sm font-medium rounded-[10px] shadow transition duration-150 ease-in-out focus:outline-none focus:ring-2"
            style={buttonStyle}
            disabled={passwordError !== ''}
          >
            Continue
          </button>
        </form>
      )}
    </AuthShell>
  )
}
