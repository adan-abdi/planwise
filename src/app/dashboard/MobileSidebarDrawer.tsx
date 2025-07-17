import React from "react";
import { X, Home, Users, Layers, ShieldCheck, FileText, Settings } from "lucide-react";
import Image from "next/image";
import { useTheme } from "../../theme-context";

const iconClass = "w-5 h-5";
const sections = [
  { key: "dashboard", label: "Dashboard", icon: <Home className={iconClass} /> },
  { key: "clients", label: "Clients", icon: <Users className={iconClass} /> },
  { key: "plans", label: "Advisors", icon: <Layers className={iconClass} /> },
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
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-100 dark:border-[var(--border)]">
          <Image src={darkMode ? "/logo_darkmode.png" : "/logo.svg"} alt="PlanWise Logo" width={80} height={32} className="h-8 w-auto" />
          <button onClick={onClose} aria-label="Close sidebar">
            <X className="w-7 h-7 text-zinc-400 dark:text-[var(--foreground)]" />
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-8 overflow-y-auto p-4">
          <div>
            <div className="text-xs font-semibold text-zinc-400 dark:text-[var(--foreground)] mb-2 tracking-widest pt-4">GENERAL</div>
            <ul className="space-y-1">
              {sections.map((section) => (
                <li
                  key={section.key}
                  className={`w-full relative rounded-lg ${activeSectionKey === section.key ? '' : ''}`}
                  onClick={() => { onSectionSelect(section.key); onClose(); }}
                  style={activeSectionKey === section.key ? { 
                    backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)' 
                  } : undefined}
                >
                  <div className={`flex items-center gap-3 py-2 px-3 w-full cursor-pointer font-medium`}>
                    {React.cloneElement(section.icon, {
                      className: `${iconClass}`,
                      style: activeSectionKey === section.key ? { color: darkMode ? '#60a5fa' : '#2563eb' } : { color: darkMode ? '#a1a1aa' : '#71717a' }
                    })}
                    <span style={activeSectionKey === section.key ? { color: darkMode ? '#60a5fa' : '#2563eb' } : { color: darkMode ? '#e4e4e7' : '#3f3f46' }}>
                      {section.label}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </aside>
    </>
  );
}