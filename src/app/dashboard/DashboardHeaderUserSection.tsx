import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Sun, Moon, Bell, ChevronDown, Grid2x2Check } from "lucide-react";
import { useTheme } from "../../theme-context";
import { logout } from '../../api/services/auth';

interface DashboardHeaderUserSectionProps {
  userName: string;
  userRole: string;
  avatarUrl: string;
  onGenerateRandomClients?: () => void;
  showGenerateButton?: boolean;
}

const DashboardHeaderUserSection: React.FC<DashboardHeaderUserSectionProps> = ({ userName, userRole, avatarUrl, onGenerateRandomClients, showGenerateButton }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [dropdownHover, setDropdownHover] = useState<string | null>(null);
  const dropdownButtonStyle = (key: string) => ({
    backgroundColor:
      dropdownHover === key
        ? darkMode
          ? '#27272a'
          : '#f4f4f5'
        : 'transparent',
    color: darkMode ? 'var(--foreground)' : '#18181b',
    cursor: 'pointer',
    transition: 'background 0.2s',
  });

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

  const handleLogout = () => {
    logout();
  };

  let avatarSrc = avatarUrl || "/logo.svg";
  if (avatarSrc && avatarSrc.startsWith("https://localhost")) {
    avatarSrc = avatarSrc.replace("https://localhost", "http://localhost");
  }

  return (
    <div className="flex items-stretch gap-3 rounded-xl bg-white dark:bg-[var(--background)] px-3 py-1 min-h-0">
      {showGenerateButton && onGenerateRandomClients && (
        <button 
          className="w-8 h-8 flex items-center justify-center rounded-full transition"
          aria-label="Generate random clients"
          onClick={onGenerateRandomClients}
          style={{ backgroundColor: 'transparent' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f4f4f5'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <Grid2x2Check className="w-5 h-5" style={{ color: darkMode ? '#a1a1aa' : '#71717a' }} />
        </button>
      )}
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full transition"
        aria-label="Toggle dark mode"
        onClick={toggleDarkMode}
        style={{ backgroundColor: 'transparent' }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f4f4f5'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        {darkMode ? (
          <Moon className="w-5 h-5 text-zinc-400" />
        ) : (
          <Sun className="w-5 h-5 text-zinc-400" />
        )}
      </button>
      <button 
        className="w-8 h-8 flex items-center justify-center rounded-full transition relative"
        style={{ backgroundColor: 'transparent' }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f4f4f5'; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
      >
        <Bell className="w-5 h-5 text-zinc-400" />
        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400 border-2 border-white dark:border-[var(--background)]"></span>
      </button>
      <div className="self-stretch border-l border-zinc-200 mx-2" />
      <Image src={avatarSrc} alt={userName} width={32} height={32} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow" />
      <div className="flex flex-col items-start ml-1">
        <span className="text-xs text-zinc-400 dark:text-[var(--foreground)] leading-none">{userRole}</span>
        <span className="text-sm font-semibold text-zinc-900 dark:text-[var(--foreground)] leading-none">{userName}</span>
      </div>
      <div className="ml-1 relative" ref={dropdownRef}>
        <button
          className="w-8 h-8 flex items-center justify-center rounded-full transition"
          style={{ backgroundColor: 'transparent' }}
          onClick={() => setDropdownOpen((v) => !v)}
          aria-label="Open user menu"
          type="button"
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f4f4f5'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        </button>
        {dropdownOpen && (
          <div
            className="absolute right-0 top-12 bg-white dark:bg-[var(--muted)] rounded-2xl shadow-2xl w-56 py-3 border border-zinc-100 dark:border-[var(--border)] z-50 animate-fade-in flex flex-col gap-1"
            ref={dropdownRef}
          >
            <button
              className="w-full text-left px-5 py-3 text-sm font-medium rounded-lg transition"
              style={dropdownButtonStyle('edit')}
              onMouseEnter={() => setDropdownHover('edit')}
              onMouseLeave={() => setDropdownHover(null)}
              onClick={() => {
                setDropdownOpen(false);
                window.location.href = '/auth/profile';
              }}
            >
              Edit Profile
            </button>
            <button
              className="w-full text-left px-5 py-3 text-sm font-medium rounded-lg transition"
              style={dropdownButtonStyle('logout')}
              onMouseEnter={() => setDropdownHover('logout')}
              onMouseLeave={() => setDropdownHover(null)}
              onClick={() => { setDropdownOpen(false); setShowLogoutModal(true); }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
      {showLogoutModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-0 overflow-y-auto backdrop-blur-lg transition-all ${darkMode ? 'bg-zinc-900/30' : 'bg-white/20'}`}
        >
          <div
            className="rounded-2xl shadow-2xl max-w-sm w-full flex flex-col items-center"
            style={{
              padding: '2.5rem 2rem',
              boxSizing: 'border-box',
              minWidth: 320,
              background: darkMode ? 'var(--background)' : '#fff',
              border: darkMode ? '1px solid var(--border)' : '1.5px solid #e4e4e7',
              color: darkMode ? 'var(--foreground)' : '#18181b',
              transition: 'background 0.2s, border 0.2s, color 0.2s',
            }}
          >
            <div className="w-full flex flex-col items-center justify-center">
              <div
                className="mb-3 text-lg font-semibold text-center"
                style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}
              >
                Log out?
              </div>
              <div
                className="mb-7 text-sm text-center"
                style={{ color: darkMode ? '#bdbdbd' : '#52525b' }}
              >
                Are you sure you want to log out?
              </div>
            </div>
            <div className="flex gap-4 w-full mt-2">
              <button
                className="flex-1 px-4 py-2 rounded-lg font-medium transition"
                style={{
                  minWidth: 0,
                  background: darkMode ? '#27272a' : '#f4f4f5',
                  color: darkMode ? '#e0e0e0' : '#18181b',
                  border: darkMode ? '1px solid var(--border)' : '1px solid #e4e4e7',
                  boxShadow: darkMode ? 'none' : '0 1px 2px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = darkMode ? '#3f3f46' : '#e4e4e7';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = darkMode ? '#27272a' : '#f4f4f5';
                }}
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-lg font-medium transition"
                style={{
                  minWidth: 0,
                  background: '#ef4444',
                  color: '#fff',
                  border: 'none',
                  boxShadow: darkMode ? 'none' : '0 1px 2px rgba(0,0,0,0.03)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#dc2626';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#ef4444';
                }}
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeaderUserSection; 