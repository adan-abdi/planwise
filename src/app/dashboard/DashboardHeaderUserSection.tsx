import React, { useState } from "react";
import Image from "next/image";
import { Sun, Moon, Bell, ChevronDown } from "lucide-react";

interface DashboardHeaderUserSectionProps {
  userName: string;
  userRole: string;
  avatarUrl: string;
}

const DashboardHeaderUserSection: React.FC<DashboardHeaderUserSectionProps> = ({ userName, userRole, avatarUrl }) => {
  const [darkMode, setDarkMode] = useState(false);
  return (
    <div className="flex items-stretch gap-3 rounded-xl bg-white px-3 py-1 min-h-0">
      {/* Dark mode toggle button */}
      <button
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 transition"
        aria-label="Toggle dark mode"
        onClick={() => setDarkMode((prev) => !prev)}
      >
        {darkMode ? (
          <Moon className="w-5 h-5 text-zinc-400" />
        ) : (
          <Sun className="w-5 h-5 text-zinc-400" />
        )}
      </button>
      {/* Notification icon button */}
      <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 transition">
        <Bell className="w-5 h-5 text-zinc-400" />
      </button>
      <div className="self-stretch border-l border-zinc-200 mx-2" />
      <Image src={avatarUrl} alt={userName} width={32} height={32} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow" />
      <div className="flex flex-col items-start ml-1">
        <span className="text-xs text-zinc-400 leading-none">{userRole}</span>
        <span className="text-sm font-semibold text-zinc-900 leading-none">{userName}</span>
      </div>
      <button className="ml-1 w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 transition">
        <ChevronDown className="w-4 h-4 text-zinc-400" />
      </button>
    </div>
  );
};

export default DashboardHeaderUserSection; 