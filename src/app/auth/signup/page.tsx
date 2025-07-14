'use client'

import { useRef, useState, useEffect } from 'react'
import AuthShell from '../authShell'
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTheme } from '../../../theme-context'
import EmailInput from '../EmailInput';
import { useSearchParams } from 'next/navigation';
import { validateSignupOtp } from '../../../api/services/auth';
import { registerUser, RegisterResponse, requestSignupOtp } from '../../../api/services/auth';

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
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const otpRefs = useRef<HTMLInputElement[]>([])
  const router = useRouter()
  const { darkMode } = useTheme();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailFromQuery = searchParams.get('email');
    if (emailFromQuery && isValidEmail(emailFromQuery)) {
      setEmail(emailFromQuery);
      setStep('otp');
    }
  }, []);

  useEffect(() => {
    if (resendMessage && resendMessage.toLowerCase().includes('sent')) {
      const timeout = setTimeout(() => setResendMessage(''), 3000);
      return () => clearTimeout(timeout);
    }
  }, [resendMessage]);

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

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otp.join('').trim();
    const trimmedEmail = email.trim();
    if (fullCode.length !== 6) {
      setOtpError('Please enter the 6-digit code.');
      return;
    }
    try {
      const result = await validateSignupOtp(trimmedEmail, fullCode) as { status: boolean; message?: string };
      if (result.status) {
        setOtpError('');
        setStep('password');
      } else {
        setOtpError(result.message || 'Invalid or expired OTP.');
      }
    } catch (err: any) {
      console.error('OTP validation error', err);
      if (err && err.message) {
        setOtpError(err.message);
      } else {
        setOtpError('Something went wrong. Please try again.');
      }
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
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

    if (!valid) return;

    try {
      const result: RegisterResponse = await registerUser(email.trim(), password);
      if (result.status && result.data) {
        localStorage.setItem('token', result.data.token);
        localStorage.setItem('refresh_token', result.data.refresh_token);
        localStorage.setItem('user', JSON.stringify(result.data.user));
        localStorage.setItem('organization', JSON.stringify(result.data.organization));
        router.push('/auth/profile');
      } else {
        if (result.message && result.message.toLowerCase().includes('already exists')) {
          setPasswordError('An account already exists with this email. Please log in or use a different email.');
        } else {
          setPasswordError(result.message || 'Registration failed.');
        }
      }
    } catch (err: any) {
      setPasswordError(err.message || 'Something went wrong. Please try again.');
    }
  }

  const handleResendOtp = async () => {
    setResendLoading(true);
    setResendMessage('');
    try {
      const result = await requestSignupOtp(email.trim()) as { status: boolean; message?: string };
      if (result.status) {
        setResendMessage('A new code has been sent to your email.');
      } else {
        setResendMessage(result.message || 'Failed to resend code.');
      }
    } catch (err: any) {
      setResendMessage(err.message || 'Failed to resend code.');
    } finally {
      setResendLoading(false);
    }
  };

  const sharedInputClass =
    'w-full px-4 py-2 rounded-[10px] bg-zinc-100 text-sm shadow-inner border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition duration-150 ease-in-out placeholder:text-gray-400'

  const inputStyle = darkMode
    ? {
        background: 'var(--muted)',
        color: 'var(--foreground)',
        borderColor: 'var(--border)',
      }
    : {}
  const otpInputStyle = darkMode
    ? {
        background: 'var(--muted)',
        color: 'var(--foreground)',
        borderColor: 'var(--border)',
      }
    : {}
  const buttonStyle = darkMode
    ? {
        backgroundColor: '#2563eb',
        color: '#fff',
      }
    : {}
  const resendTextStyle = darkMode
    ? { color: '#bbb' }
    : {}
  const infoTextStyle = darkMode
    ? { color: '#bbb' }
    : {}

  const renderEmailStep = () => (
    <EmailInput
      value={email}
      onChange={setEmail}
      onSubmit={handleEmailSubmit}
    />
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
            style={otpInputStyle}
          />
        ))}
      </div>
      {otpError && (
        <p className="text-sm text-red-500 text-center">{otpError}</p>
      )}
      {resendMessage && (
        <p className="text-sm text-center" style={{ color: resendMessage.toLowerCase().includes('sent') ? '#22c55e' : '#e53e3e' }}>{resendMessage}</p>
      )}
      <button
        type="button"
        className="w-full text-xs text-blue-600 hover:underline mb-2 disabled:opacity-50"
        onClick={handleResendOtp}
        disabled={resendLoading}
        style={{ marginTop: '-8px' }}
      >
        {resendLoading ? 'Resending...' : 'Resend code'}
      </button>
      {otp.join('').length === 6 ? (
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-[10px] shadow hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={buttonStyle}
        >
          Continue
        </button>
      ) : (
        <p className="text-xs text-center text-black" style={resendTextStyle}>
          Didn’t receive any code? <span className="font-bold">Check your spam folder or resend.</span>
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
          style={inputStyle}
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
        error: passwordError && passwordError.toLowerCase().includes('password') ? passwordError : undefined,
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
      {passwordError && !passwordError.toLowerCase().includes('password') && (
        <p className="text-sm text-red-500 text-center">{passwordError}</p>
      )}
      <button
        type="submit"
        className="w-full mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-[10px] shadow hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
        style={buttonStyle}
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
        if (step === 'otp' || step === 'password') {
          router.push('/');
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
