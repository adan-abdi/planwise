'use client'

import { useRef, useState, useEffect } from 'react'
import { Pencil, User } from 'lucide-react'
import AuthShell from '../authShell'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTheme } from '../../../theme-context'
import { updateUserProfile, UpdateProfileResponse } from '../../../api/services/auth';

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()
  const { darkMode } = useTheme()

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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfileFile(file)
      const reader = new FileReader()
      reader.onload = () => setProfilePreview(reader.result as string)
      reader.readAsDataURL(file)
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
            background: darkMode ? 'var(--muted)' : '#f4f4f5',
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
              onClick={() => fileInputRef.current?.click()}
            >
              {profilePreview ? (
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
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-[calc(50%-48px)] border rounded-full p-1 shadow cursor-pointer"
              style={{
                background: darkMode ? 'var(--background)' : '#fff',
                borderColor: darkMode ? 'var(--border)' : '#e4e4e7',
                boxShadow: darkMode ? '0 1px 4px 0 #1112' : '0 1px 4px 0 #e0e7ef',
                transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
              }}
            >
              <Pencil className="w-3.5 h-3.5" style={{ color: darkMode ? '#bbb' : '#666' }} />
            </div>
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
