import React from 'react';
import { useTheme } from '../../theme-context';

interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isValidEmail?: (email: string) => boolean;
  buttonText?: string;
  placeholder?: string;
  className?: string;
}

export default function EmailInput({
  value,
  onChange,
  onSubmit,
  isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()),
  buttonText = 'Continue',
  placeholder = 'Email address',
  className = '',
}: EmailInputProps) {
  const { darkMode } = useTheme();

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

  return (
    <form onSubmit={onSubmit} className={`space-y-6 w-full ${className}`}>
      <input
        type="email"
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className={sharedInputClass}
        style={inputStyle}
        required
      />
      {isValidEmail(value) ? (
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium rounded-[10px] shadow transition duration-150 ease-in-out focus:outline-none focus:ring-2"
          style={buttonStyle}
        >
          {buttonText}
        </button>
      ) : (
        <p className="text-xs text-center pt-3" style={infoTextStyle}>
          We’ll create an account if you don’t have one yet.
        </p>
      )}
    </form>
  );
} 