'use client'

import { useRef, useState } from 'react'
import { Pencil, User } from 'lucide-react'
import AuthShell from '../authShell'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const [name, setName] = useState('')
  const [profilePreview, setProfilePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setProfilePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Profile saved:', { name, profilePreview })
    router.push('/dashboard')
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
        {/* Profile Pic Box */}
        <div className="w-full bg-gray-100 border border-gray-200 rounded-xl px-6 py-5">
          <div className="flex justify-center relative">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center cursor-pointer relative overflow-hidden ${
                profilePreview
                  ? 'bg-zinc-100 shadow-inner'
                  : 'bg-blue-50 border-2 border-dashed border-blue-300 hover:ring-2 hover:ring-blue-200'
              }`}
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
              className="absolute bottom-0 right-[calc(50%-48px)] bg-white border border-gray-300 rounded-full p-1 shadow cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5 text-gray-600" />
            </div>
          </div>
        </div>

        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 rounded-[10px] bg-zinc-100 text-sm shadow-inner border border-transparent focus:border-blue-500 focus:bg-white focus:outline-none transition duration-150 ease-in-out placeholder:text-gray-400"
          required
        />

        {/* Continue Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-[10px] shadow hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Continue
        </button>

        <p className="text-center text-sm text-gray-500 pt-2">
          Don’t want to customize your account yet?{' '}
          <button
            type="button"
            className="font-semibold text-black"
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
