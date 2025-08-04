'use client'

import { useRef, useState, useEffect } from 'react'
import { Pencil, User, Loader2, Trash } from 'lucide-react'
import AuthShell from '../authShell'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useTheme } from '../../../theme-context'
import { ChevronDown } from 'lucide-react'
import { updateUserProfile, UpdateProfileResponse, getProfile } from '../../../api/services/auth';
import { ProtectedRoute } from '../../../components/ProtectedRoute';

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
  
  // Track original values to detect changes
  const [originalName, setOriginalName] = useState('')
  const [originalProfileUrl, setOriginalProfileUrl] = useState<string | null>(null)

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
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Load user profile on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found');
          setError('Authentication required. Please log in again.');
          setIsLoadingProfile(false);
          return;
        }

        console.log('Loading profile...');
        const response = await getProfile() as UpdateProfileResponse;
        console.log('Profile response:', response);
        
        if (response.status && response.data) {
          const userData = response.data;
          setName(userData.fullName || '');
          setOriginalName(userData.fullName || '');
          setProfilePreview(userData.profilePictureUrl);
          setOriginalProfileUrl(userData.profilePictureUrl);
          console.log('Profile loaded successfully:', userData);
        } else {
          console.error('Profile response indicates failure:', response);
          setError(response.message || 'Failed to load profile data');
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setError('Failed to load profile data. Please check your authentication.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    loadProfile();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      setProfileFile(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await updateUserProfile(name, profileFile || undefined);
      if (response.status && response.data) {
        setSuccess('Profile updated successfully!');
        setOriginalName(name);
        if (profileFile) {
          setOriginalProfileUrl(response.data.profilePictureUrl);
        }
        setProfileFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && err !== null && 'message' in err && typeof (err as { message?: string }).message === 'string') {
        setError((err as { message: string }).message);
      } else {
        setError('Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const hasChanges = () => {
    return name !== originalName || profileFile !== null;
  };

  const canSubmit = () => {
    return name.trim().length > 0 && hasChanges() && !loading;
  };

  return (
    <ProtectedRoute>
      <AuthShell>
        <div className="w-full max-w-md mx-auto">
          {isLoadingProfile ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" style={{ color: darkMode ? '#60a5fa' : '#2563eb' }} />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Picture */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div 
                    className="w-24 h-24 rounded-full overflow-hidden border-4 flex items-center justify-center"
                    style={{ 
                      borderColor: darkMode ? '#374151' : '#e5e7eb',
                      backgroundColor: darkMode ? '#374151' : '#f3f4f6'
                    }}
                  >
                    {profilePreview ? (
                      <Image
                        src={profilePreview}
                        alt="Profile"
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12" style={{ color: darkMode ? '#9ca3af' : '#6b7280' }} />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                    style={{
                      backgroundColor: darkMode ? '#2563eb' : '#2563eb',
                      color: '#ffffff',
                      boxShadow: darkMode 
                        ? '0 4px 12px rgba(37, 99, 235, 0.3)' 
                        : '0 4px 12px rgba(37, 99, 235, 0.2)'
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-xs mt-2" style={{ color: darkMode ? 'var(--muted-foreground)' : '#71717a' }}>
                  Click to upload a new photo
                </p>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border transition-colors duration-200"
                  style={{
                    backgroundColor: darkMode ? 'var(--muted)' : '#ffffff',
                    color: darkMode ? 'var(--foreground)' : '#18181b',
                    borderColor: darkMode ? 'var(--border)' : '#e5e7eb',
                  }}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              {/* Error and Success Messages */}
              {error && (
                <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: darkMode ? '#dc2626' : '#fef2f2', color: darkMode ? '#fca5a5' : '#dc2626' }}>
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: darkMode ? '#059669' : '#f0fdf4', color: darkMode ? '#6ee7b7' : '#059669' }}>
                  {success}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!canSubmit()}
                className="w-full py-2 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: canSubmit() ? (darkMode ? '#2563eb' : '#2563eb') : (darkMode ? '#374151' : '#e5e7eb'),
                  color: canSubmit() ? '#ffffff' : (darkMode ? '#9ca3af' : '#6b7280'),
                  boxShadow: canSubmit() ? (darkMode ? '0 4px 12px rgba(37, 99, 235, 0.3)' : '0 4px 12px rgba(37, 99, 235, 0.2)') : 'none'
                }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Updating...
                  </div>
                ) : (
                  'Update Profile'
                )}
              </button>

              {/* Skip for now button */}
              <p className="text-center text-sm pt-2" style={{ color: darkMode ? '#bbb' : '#666' }}>
                Don't want to customize your account yet?{' '}
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
          )}
        </div>
      </AuthShell>
    </ProtectedRoute>
  );
}
