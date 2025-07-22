import React from "react";
import { X, LayoutDashboard, SquareUserRound, BookUser, PersonStanding, SquareDashedKanban, BadgeQuestionMark, Settings, LogOut, UserPen } from "lucide-react";
import Image from "next/image";
import { useTheme } from "../../theme-context";
import { logout } from '../../api/services/auth';

const iconClass = "w-5 h-5";
const sections = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className={iconClass} /> },
  { key: "clients", label: "Clients", icon: <SquareUserRound className={iconClass} /> },
  { key: "advisors", label: "Advisors", icon: <BookUser className={iconClass} /> },
  { key: "compliance", label: "Team members", icon: <PersonStanding className={iconClass} /> },
  { key: "templates", label: "Templates", icon: <SquareDashedKanban className={iconClass} /> },
  { key: "help", label: "Help/FAQs", icon: <BadgeQuestionMark className={iconClass} /> },
  { key: "settings", label: "Settings", icon: <Settings className={iconClass} /> },
];

export default function MobileSidebarDrawer({ open, onClose, onSectionSelect, activeSectionKey }: {
  open: boolean;
  onClose: () => void;
  onSectionSelect: (key: string) => void;
  activeSectionKey: string;
}) {
  const { darkMode } = useTheme();
  
  // Logout handler
  const handleLogout = () => {
    logout();
  };
  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-[92px] left-2 sm:left-4 h-[calc(100vh-145px)] w-72 max-w-full z-50 transform transition-all duration-500 ease-out flex flex-col
          ${open ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
        style={{
          backgroundColor: darkMode 
            ? 'rgba(30, 30, 30, 0.8)' 
            : 'rgba(255, 255, 255, 0.9)',
          borderColor: darkMode 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.2)',
          border: `1px solid ${darkMode 
            ? 'rgba(255, 255, 255, 0.1)' 
            : 'rgba(255, 255, 255, 0.2)'}`,
          boxShadow: darkMode
            ? '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '5px'
        }}
      >
        <div className="flex items-center justify-between p-6 flex-shrink-0">
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
        <div className="flex flex-col h-full">
          <nav className="flex-1 flex flex-col gap-1 overflow-y-auto p-4 min-h-0">
            <div className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.key}
                    onClick={() => { onSectionSelect(section.key); onClose(); }}
                    className="w-full flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-200 font-medium"
                    style={{
                      backgroundColor: activeSectionKey === section.key 
                        ? (darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)')
                        : 'transparent',
                      color: activeSectionKey === section.key
                        ? (darkMode ? '#60a5fa' : '#2563eb')
                        : (darkMode ? '#9ca3af' : '#6b7280'),
                      border: activeSectionKey === section.key
                        ? `1px solid ${darkMode ? 'rgba(96, 165, 250, 0.2)' : 'rgba(37, 99, 235, 0.2)'}`
                        : '1px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (activeSectionKey !== section.key) {
                        e.currentTarget.style.backgroundColor = darkMode 
                          ? 'rgba(55, 65, 81, 0.2)' 
                          : 'rgba(255, 255, 255, 0.3)';
                        e.currentTarget.style.color = darkMode ? '#e5e7eb' : '#18181b';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeSectionKey !== section.key) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = darkMode ? '#9ca3af' : '#6b7280';
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
          
          {/* Bottom Links - Logout and Edit Profile */}
          <div className="border-t p-4 flex-shrink-0" style={{ 
            borderColor: darkMode ? 'rgba(161, 161, 170, 0.3)' : 'rgba(161, 161, 170, 0.4)'
          }}>
            <div className="space-y-1">
              <button
                onClick={() => { window.location.href = '/auth/profile'; onClose(); }}
                className="w-full flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-200 font-medium"
                style={{
                  backgroundColor: 'transparent',
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  border: '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode 
                    ? 'rgba(55, 65, 81, 0.2)' 
                    : 'rgba(255, 255, 255, 0.3)';
                  e.currentTarget.style.color = darkMode ? '#e5e7eb' : '#18181b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = darkMode ? '#9ca3af' : '#6b7280';
                }}
              >
                <UserPen className="w-5 h-5 transition-colors duration-200" />
                <span className="text-sm font-medium">Edit Profile Preferences</span>
              </button>
              <button
                onClick={() => { handleLogout(); onClose(); }}
                className="w-full flex items-center gap-3 py-3 px-3 rounded-lg transition-all duration-200 font-medium"
                style={{
                  backgroundColor: 'transparent',
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  border: '1px solid transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode 
                    ? 'rgba(220, 38, 38, 0.15)' 
                    : 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.color = darkMode ? '#fca5a5' : '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = darkMode ? '#9ca3af' : '#6b7280';
                }}
              >
                <LogOut className="w-5 h-5 transition-colors duration-200" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}