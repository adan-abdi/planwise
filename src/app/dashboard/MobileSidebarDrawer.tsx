import React from "react";
import { X, Home, Users, Layers, ShieldCheck, FileText, List, Users2, Settings } from "lucide-react";
import Image from "next/image";

const iconClass = "w-5 h-5";
const sections = [
  { key: "dashboard", label: "Dashboard", icon: <Home className={iconClass} /> },
  { key: "clients", label: "Clients", icon: <Users className={iconClass} /> },
  { key: "plans", label: "Plans", icon: <Layers className={iconClass} /> },
  { key: "compliance", label: "Compliance", icon: <ShieldCheck className={iconClass} /> },
];
const supportSections = [
  { key: "templates", label: "Templates", icon: <FileText className={iconClass} /> },
  { key: "auditlog", label: "Audit log", icon: <List className={iconClass} /> },
  { key: "teammembers", label: "Team members", icon: <Users2 className={iconClass} /> },
  { key: "settings", label: "Settings", icon: <Settings className={iconClass} /> },
];

export default function MobileSidebarDrawer({ open, onClose, onSectionSelect, activeSectionKey }: {
  open: boolean;
  onClose: () => void;
  onSectionSelect: (key: string) => void;
  activeSectionKey: string;
}) {
  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-black/30 transition-opacity duration-200 sm:hidden ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <aside
        className={`fixed top-0 left-0 h-full w-72 max-w-full bg-white z-50 shadow-2xl transform transition-transform duration-300 sm:hidden
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-zinc-100">
          <Image src="/logo.svg" alt="PlanWise Logo" width={80} height={32} className="h-8 w-auto" />
          <button onClick={onClose} aria-label="Close sidebar">
            <X className="w-7 h-7 text-zinc-400" />
          </button>
        </div>
        <nav className="flex-1 flex flex-col gap-8 overflow-y-auto p-4">
          <div>
            <div className="text-xs font-semibold text-zinc-400 mb-2 tracking-widest pt-4">GENERAL</div>
            <ul className="space-y-1">
              {sections.map((section) => (
                <li
                  key={section.key}
                  className={`w-full relative rounded-lg ${activeSectionKey === section.key ? 'bg-blue-50' : ''}`}
                  onClick={() => { onSectionSelect(section.key); onClose(); }}
                >
                  <div className={`flex items-center gap-3 py-2 px-3 w-full cursor-pointer font-medium ${activeSectionKey === section.key ? 'text-blue-600' : 'text-zinc-700'}`}>
                    {React.cloneElement(section.icon, {
                      className: `${iconClass} ${activeSectionKey === section.key ? 'text-blue-600' : 'text-zinc-400'}`
                    })}
                    <span>{section.label}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-400 mb-2 tracking-widest pt-4">SUPPORT</div>
            <ul className="space-y-1">
              {supportSections.map((section) => (
                <li
                  key={section.key}
                  className={`w-full relative rounded-lg ${activeSectionKey === section.key ? 'bg-blue-50' : ''}`}
                  onClick={() => { onSectionSelect(section.key); onClose(); }}
                >
                  <div className={`flex items-center gap-3 py-2 px-3 w-full cursor-pointer font-medium ${activeSectionKey === section.key ? 'text-blue-600' : 'text-zinc-700'}`}>
                    {React.cloneElement(section.icon, {
                      className: `${iconClass} ${activeSectionKey === section.key ? 'text-blue-600' : 'text-zinc-400'}`
                    })}
                    <span>{section.label}</span>
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