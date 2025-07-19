import React from "react";
import { X, LayoutDashboard, SquareUserRound, SquareKanban, ShieldCheck, FileText, Settings } from "lucide-react";
import Image from "next/image";
import { useTheme } from "../../theme-context";

const iconClass = "w-5 h-5";
const sections = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className={iconClass} /> },
  { key: "clients", label: "Clients", icon: <SquareUserRound className={iconClass} /> },
  { key: "plans", label: "Advisors", icon: <SquareKanban className={iconClass} /> },
  { key: "compliance", label: "Team members", icon: <ShieldCheck className={iconClass} /> },
  { key: "templates", label: "Templates", icon: <FileText className={iconClass} /> },
  { key: "help", label: "Help/FAQs", icon: <FileText className={iconClass} /> },
  { key: "settings", label: "Settings", icon: <Settings className={iconClass} /> },
];

export default function MobileSidebarDrawer({ open, onClose, onSectionSelect, activeSectionKey }: {
  open: boolean;
  onClose: () => void;
  onSectionSelect: (key: string) => void;
  activeSectionKey: string;
}) {
  const { darkMode } = useTheme();
  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 left-0 h-full w-72 max-w-full bg-white dark:bg-[var(--background)] z-50 shadow-2xl transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          backgroundColor: darkMode ? 'var(--background)' : 'white',
          borderRight: `1px solid ${darkMode ? 'var(--border)' : '#e4e4e7'}`
        }}
      >
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center">
            <Image src={darkMode ? "/logo_darkmode.png" : "/logo.svg"} alt="PlanWise Logo" width={100} height={40} className="h-10 w-auto" />
          </div>
          <button 
            onClick={onClose} 
            aria-label="Close sidebar"
            className="w-10 h-10 flex items-center justify-center rounded-lg transition-all duration-200"
            style={{ 
              backgroundColor: 'transparent',
              border: `1px solid ${darkMode ? 'var(--border)' : '#e4e4e7'}`
            }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6';
              e.currentTarget.style.borderColor = darkMode ? '#52525b' : '#d1d5db';
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = darkMode ? 'var(--border)' : '#e4e4e7';
            }}
          >
            <X className="w-5 h-5 transition-colors duration-200" style={{ color: darkMode ? '#9ca3af' : '#6b7280' }} />
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto p-4">
          <div className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => { onSectionSelect(section.key); onClose(); }}
                  className="w-full flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-200 font-medium"
                  style={{
                    backgroundColor: activeSectionKey === section.key 
                      ? (darkMode ? '#1e3a8a' : '#eff6ff') // blue-900 for dark, blue-50 for light
                      : 'transparent',
                    color: activeSectionKey === section.key
                      ? (darkMode ? '#93c5fd' : '#2563eb') // blue-300 for dark, blue-600 for light
                      : (darkMode ? '#9ca3af' : '#6b7280'), // gray-400 for dark, gray-500 for light
                    border: activeSectionKey === section.key
                      ? `1px solid ${darkMode ? '#1e40af' : '#bfdbfe'}` // blue-800 for dark, blue-200 for light
                      : '1px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (activeSectionKey !== section.key) {
                      e.currentTarget.style.backgroundColor = darkMode ? '#374151' : '#f3f4f6'; // gray-700 for dark, gray-100 for light
                      e.currentTarget.style.color = darkMode ? '#e5e7eb' : '#18181b'; // gray-200 for dark, gray-900 for light
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeSectionKey !== section.key) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = darkMode ? '#9ca3af' : '#6b7280'; // gray-400 for dark, gray-500 for light
                    }
                  }}
                >
                  {React.cloneElement(section.icon, {
                    className: "w-5 h-5 transition-colors duration-200"
                  })}
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              ))}
          </div>
        </nav>
      </aside>
    </>
  );
}