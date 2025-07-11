import React from "react";
import Image from "next/image";
import { Sun, Moon, Bell, ChevronDown, Grid2x2Check } from "lucide-react";
import { useTheme } from "../../theme-context";

interface DashboardHeaderUserSectionProps {
  userName: string;
  userRole: string;
  avatarUrl: string;
  onGenerateRandomClients?: () => void;
}

const DashboardHeaderUserSection: React.FC<DashboardHeaderUserSectionProps> = ({ userName, userRole, avatarUrl, onGenerateRandomClients }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  return (
    <div className="flex items-stretch gap-3 rounded-xl bg-white dark:bg-[var(--background)] px-3 py-1 min-h-0">
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full transition"
        aria-label="Toggle dark mode"
        onClick={toggleDarkMode}
        style={{
          backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f4f4f5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {darkMode ? (
          <Moon className="w-5 h-5 text-zinc-400" />
        ) : (
          <Sun className="w-5 h-5 text-zinc-400" />
        )}
      </button>
      <button 
        className="w-8 h-8 flex items-center justify-center rounded-full transition relative"
        style={{
          backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f4f4f5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <Bell className="w-5 h-5 text-zinc-400" />
        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400 border-2 border-white dark:border-[var(--background)]"></span>
      </button>
      {onGenerateRandomClients && (
        <button 
          className="w-8 h-8 flex items-center justify-center rounded-full transition"
          aria-label="Generate random clients"
          onClick={onGenerateRandomClients}
          style={{
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f4f4f5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Grid2x2Check className="w-5 h-5" style={{ color: darkMode ? '#a1a1aa' : '#71717a' }} />
        </button>
      )}
      <div className="self-stretch border-l border-zinc-200 mx-2" />
      <Image src={avatarUrl} alt={userName} width={32} height={32} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow" />
      <div className="flex flex-col items-start ml-1">
        <span className="text-xs text-zinc-400 dark:text-[var(--foreground)] leading-none">{userRole}</span>
        <span className="text-sm font-semibold text-zinc-900 dark:text-[var(--foreground)] leading-none">{userName}</span>
      </div>
      <button 
        className="ml-1 w-8 h-8 flex items-center justify-center rounded-full transition"
        style={{
          backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f4f4f5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <ChevronDown className="w-4 h-4 text-zinc-400" />
      </button>
    </div>
  );
};

export default DashboardHeaderUserSection; 