'use client'

import { useRef, useState } from 'react'
import AuthShell from '../authShell'
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
  const [otpError, setOtpError] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const otpRefs = useRef<HTMLInputElement[]>([])
  const router = useRouter()

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValidEmail(email)) setStep('otp')
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp]
      newOtp[index - 1] = ''
      setOtp(newOtp)
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fullCode = otp.join('')
    if (fullCode !== '123456') {
      setOtpError('Incorrect validation code!')
    } else {
      setOtpError('')
      setStep('password')
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    let valid = true

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.')
      valid = false
    } else {
      setPasswordError('')
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords don't match.")
      valid = false
    } else {
      setConfirmPasswordError('')
    }

    if (valid) {
      console.log('Signup complete:', { email, password })
      router.push('/auth/profile')
    }
  }

  const sharedInputClass =
    'w-full px-4 py-2 rounded-[10px] bg-zinc-100 text-sm shadow-inner border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition duration-150 ease-in-out placeholder:text-gray-400'

  const renderEmailStep = () => (
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
  )

  const renderOtpStep = () => (
    <form onSubmit={handleOtpSubmit} className="space-y-6 w-full">
      <div className="flex justify-between items-center">
        {otp.map((digit, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(i, e.target.value)}
            onKeyDown={(e) => handleOtpKeyDown(e, i)}
            ref={(el) => {
              otpRefs.current[i] = el!
            }}
            className="w-10 h-12 text-center text-xl rounded-md bg-zinc-100 shadow-inner focus:border-blue-500 focus:bg-white border border-transparent focus:outline-none transition"
          />
        ))}
      </div>
      {otpError && (
        <p className="text-sm text-red-500 text-center">{otpError}</p>
      )}
      {otp.join('').length === 6 ? (
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-[10px] shadow hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Continue
        </button>
      ) : (
        <p className="text-xs text-center text-black">
          Didn’t receive any code? <span className="font-bold">Resend it</span>
        </p>
      )}
    </form>
  )

  const renderPasswordField = ({
    value,
    setValue,
    placeholder,
    show,
    toggleShow,
    error,
  }: {
    value: string
    setValue: (val: string) => void
    placeholder: string
    show: boolean
    toggleShow: () => void
    error?: string
  }) => (
    <div className="space-y-2">
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={sharedInputClass + ' pr-10'}
          required
        />
        <button
          type="button"
          onClick={toggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  )

  const renderPasswordStep = () => (
    <form onSubmit={handlePasswordSubmit} className="space-y-6 w-full">
      {renderPasswordField({
        value: password,
        setValue: (val) => {
          setPassword(val)
          if (val.length < 6) {
            setPasswordError('Password must be at least 6 characters.')
          } else {
            setPasswordError('')
          }
        },
        placeholder: 'Password',
        show: showPassword,
        toggleShow: () => setShowPassword(!showPassword),
        error: passwordError,
      })}
      {renderPasswordField({
        value: confirmPassword,
        setValue: (val) => {
          setConfirmPassword(val)
          if (val !== password) {
            setConfirmPasswordError("Passwords don't match.")
          } else {
            setConfirmPasswordError('')
          }
        },
        placeholder: 'Confirm password',
        show: showConfirmPassword,
        toggleShow: () => setShowConfirmPassword(!showConfirmPassword),
        error: confirmPasswordError,
      })}
      <button
        type="submit"
        className="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-[10px] shadow hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Continue
      </button>
    </form>
  )

  const getHeaderIcon = () => {
    if (step === 'otp') {
      return (
        <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center">
          <KeyRound className="w-5 h-5" />
        </div>
      )
    }
    if (step === 'password') {
      return (
        <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center">
          <Lock className="w-5 h-5" />
        </div>
      )
    }
    return undefined
  }

  return (
    <AuthShell
      showBackButton={step !== 'email'}
      onBack={() => {
        if (step === 'otp') {
          setStep('email')
          setOtp(Array(6).fill(''))
          setOtpError('')
        } else if (step === 'password') {
          setStep('otp')
          setPassword('')
          setConfirmPassword('')
          setPasswordError('')
          setConfirmPasswordError('')
        }
      }}
      headerNode={getHeaderIcon()}
      title={
        step === 'otp'
          ? 'Enter Code'
          : step === 'password'
            ? 'Set a Password'
            : 'Welcome to PlanWise'
      }
      subtitle={
        step === 'otp'
          ? `We've sent a 6-digit code to ${email}`
          : step === 'password'
            ? 'Create a custom password for your account.'
            : 'Enter your details to get started'
      }
    >
      {step === 'email'
        ? renderEmailStep()
        : step === 'otp'
          ? renderOtpStep()
          : renderPasswordStep()}
    </AuthShell>
  )
}
