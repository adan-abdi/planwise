'use client'

import { useRef, useState, useEffect } from 'react'
import { Pencil, User, Loader2, Trash } from 'lucide-react'
import AuthShell from '../authShell'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTheme } from '../../../theme-context'
import { ChevronDown } from 'lucide-react'
import { updateUserProfile, UpdateProfileResponse, getProfile } from '../../../api/services/auth';

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()
  const { darkMode, themePreference, setThemePreference } = useTheme()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handlePopState = () => {
        if (window.location.pathname === '/dashboard') {
          router.replace('/');
        }
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfile() as UpdateProfileResponse;
        if (response.status && response.data) {
          setName(response.data.fullName || '');
          if (response.data.profilePictureUrl) {
            setProfilePreview(response.data.profilePictureUrl);
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
        // If profile loading fails, try to get data from localStorage as fallback
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.full_name) {
          setName(user.full_name);
        }
        if (user.profilePictureUrl) {
          setProfilePreview(user.profilePictureUrl);
        }
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileFile(file)
      const reader = new FileReader()
      reader.onload = () => setProfilePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveProfile = () => {
    setProfilePreview(null)
    setProfileFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const result: UpdateProfileResponse = await updateUserProfile(name, profileFile || undefined)
      if (result.status && result.data) {
        setSuccess('Profile updated successfully!')
        
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        user.full_name = result.data.fullName
        user.profilePictureUrl = result.data.profilePictureUrl
        localStorage.setItem('user', JSON.stringify(user))
        setTimeout(() => router.push('/dashboard'), 1000)
      } else {
        setError(result.message || 'Failed to update profile.')
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        setError((err as { message: string }).message);
      } else {
        setError('Failed to update profile.');
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      showBackButton={true}
      onBack={() => router.back()}
      title="Customize your account"
      subtitle="Add your profile picture and name"
      headerNode={
        <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center">
          <User className="w-5 h-5" />
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div
          className="w-full border rounded-xl px-6 py-5"
          style={{
            background: darkMode ? 'var(--muted)' : 'white',
            borderColor: darkMode ? 'var(--border)' : '#e4e4e7',
            transition: 'background 0.2s, border 0.2s',
          }}
        >
          <div className="flex justify-center relative">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center cursor-pointer relative overflow-hidden ${
                profilePreview
                  ? 'shadow-inner'
                  : 'hover:ring-2 hover:ring-blue-200'
              }`}
              style={{
                background: profilePreview
                  ? (darkMode ? 'var(--background)' : '#f4f4f5')
                  : (darkMode ? 'var(--muted)' : '#e0e7ef'),
                border: profilePreview
                  ? 'none'
                  : `2px dashed ${darkMode ? 'var(--border)' : '#60a5fa'}`,
                boxShadow: profilePreview ? (darkMode ? '0 2px 8px 0 #1112' : '0 2px 8px 0 #e0e7ef') : undefined,
                transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
              }}
              onClick={() => !isLoadingProfile && fileInputRef.current?.click()}
            >
              {isLoadingProfile ? (
                <Loader2 className="text-blue-400 w-9 h-9 animate-spin" />
              ) : profilePreview ? (
                <Image
                  src={profilePreview}
                  alt="Profile Preview"
                  fill
                  className="object-cover rounded-full"
                />
              ) : (
                <User className="text-blue-400 w-9 h-9" />
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageSelect}
              />
            </div>

            <div
              onClick={() => !isLoadingProfile && fileInputRef.current?.click()}
              className={`absolute bottom-0 right-[calc(50%-48px)] border rounded-full p-1 shadow ${
                isLoadingProfile ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
              }`}
              style={{
                background: darkMode ? 'var(--background)' : '#fff',
                borderColor: darkMode ? 'var(--border)' : '#e4e4e7',
                boxShadow: darkMode ? '0 1px 4px 0 #1112' : '0 1px 4px 0 #e0e7ef',
                transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
              }}
            >
              <Pencil className="w-3.5 h-3.5" style={{ color: darkMode ? '#bbb' : '#666' }} />
            </div>

            {/* Remove Profile Button - only show when there's a profile image and not loading */}
            {!isLoadingProfile && profilePreview && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveProfile();
                }}
                className="absolute top-0 right-[calc(50%-48px)] border rounded-full p-1 shadow cursor-pointer"
                style={{
                  background: darkMode ? 'var(--background)' : '#fff',
                  borderColor: darkMode ? 'var(--border)' : '#e4e4e7',
                  boxShadow: darkMode ? '0 1px 4px 0 #1112' : '0 1px 4px 0 #e0e7ef',
                  transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
                }}
                title="Remove profile picture"
              >
                <Trash className="w-3.5 h-3.5" style={{ color: darkMode ? '#dc2626' : '#dc2626' }} />
              </button>
            )}
          </div>
        </div>

        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-[10px] text-sm shadow-inner border focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out placeholder:text-gray-400"
          style={{
            background: darkMode ? 'var(--muted)' : 'white',
            color: darkMode ? 'var(--foreground)' : '#18181b',
            borderColor: darkMode ? 'var(--border)' : '#e5e7eb',
          }}
          required
        />

        {/* Theme Preferences Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? 'var(--foreground)' : '#374151' }}>
            Theme Preferences
          </label>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full px-4 py-2 rounded-[10px] text-sm shadow-inner border focus:border-blue-500 focus:outline-none transition duration-150 ease-in-out flex items-center justify-between"
            style={{
              background: darkMode ? 'var(--muted)' : 'white',
              color: darkMode ? 'var(--foreground)' : '#18181b',
              borderColor: darkMode ? 'var(--border)' : '#e5e7eb',
            }}
          >
            <span className="capitalize">{themePreference}</span>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {dropdownOpen && (
            <div
              className="absolute top-full left-0 right-0 mt-1 rounded-[10px] border shadow-lg z-10"
              style={{
                background: darkMode ? 'var(--muted)' : 'white',
                borderColor: darkMode ? 'var(--border)' : '#e5e7eb',
                boxShadow: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            >
              {(['system', 'light', 'dark'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setThemePreference(option);
                    setDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 first:rounded-t-[10px] last:rounded-b-[10px]"
                  style={{
                    color: darkMode ? 'var(--foreground)' : '#18181b',
                    backgroundColor: themePreference === option ? (darkMode ? '#374151' : '#f3f4f6') : 'transparent',
                  }}
                >
                  <span className="capitalize">{option}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        {success && <p className="text-sm text-green-500 text-center">{success}</p>}
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium rounded-[10px] shadow transition duration-150 ease-in-out focus:outline-none focus:ring-2"
          style={{
            background: darkMode ? '#2563eb' : '#2563eb',
            color: '#fff',
            boxShadow: darkMode ? '0 2px 8px 0 #1112' : '0 2px 8px 0 #e0e7ef',
          }}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>

        <p className="text-center text-sm pt-2" style={{ color: darkMode ? '#bbb' : '#666' }}>
          Don’t want to customize your account yet?{' '}
          <button
            type="button"
            className="font-semibold"
            style={{ color: darkMode ? '#fff' : '#000' }}
            onClick={() => {
              console.log('Skip for now clicked')
              router.push('/dashboard')
            }}
          >
            Skip for now
          </button>
        </p>
      </form>
    </AuthShell>
  )
}
