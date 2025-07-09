import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}

interface MobileDashboardHeaderProps {
  onOpenSidebar: () => void;
  sectionTitle: string;
  breadcrumb: BreadcrumbItem[];
  avatarUrl: string;
  userName: string;
  userRole: string;
}

const MobileDashboardHeader: React.FC<MobileDashboardHeaderProps> = ({
  onOpenSidebar,
  sectionTitle,
  breadcrumb,
  avatarUrl,
  userName,
  userRole,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="sm:hidden w-full sticky top-0 z-40 bg-white dark:bg-[var(--background)] shadow-[0_2px_8px_0_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-100">
        <button
          className="p-2 rounded-xl border border-zinc-200 dark:border-[var(--border)] bg-white dark:bg-[var(--muted)] hover:!bg-zinc-50 dark:hover:!bg-[#444] transition flex items-center justify-center"
          aria-label="Open sidebar"
          onClick={onOpenSidebar}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c8592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="7" x2="19" y2="7" />
            <line x1="5" y1="12" x2="19" y2="12" />
            <line x1="5" y1="17" x2="19" y2="17" />
          </svg>
        </button>
        <Image src="/logo.svg" alt="PlanWise Logo" width={90} height={32} className="h-8 w-auto" />
        <div className="flex items-center gap-2 relative" ref={dropdownRef}>
          <Image src={avatarUrl} alt={userName} width={36} height={36} className="w-9 h-9 rounded-full object-cover border border-zinc-200 dark:border-[var(--border)] shadow-sm" />
          <button
            className="ml-1 p-2 rounded-full hover:bg-zinc-100 transition flex items-center justify-center"
            aria-label="Open user menu"
            onClick={() => setDropdownOpen((v) => !v)}
            type="button"
          >
            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          {dropdownOpen && (
            <div className="fixed left-1/2 -translate-x-1/2 top-16 w-[90vw] max-w-xs bg-white dark:bg-[var(--muted)] rounded-xl shadow-lg border border-zinc-100 dark:border-[var(--border)] py-4 px-4 z-50 animate-fade-in flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Image src={avatarUrl} alt={userName} width={40} height={40} className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-[var(--border)]" />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-zinc-900 dark:text-[var(--foreground)] leading-none">{userName}</span>
                  <span className="text-xs text-zinc-400 dark:text-[var(--foreground)] leading-none">{userRole}</span>
                </div>
              </div>
              <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition text-zinc-700 dark:text-[var(--foreground)] text-sm font-medium">
                <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                Notifications
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-col px-4 py-2 bg-white dark:bg-[var(--background)] border-b border-zinc-200 dark:border-[var(--border)]">
        <div className="text-lg font-semibold text-zinc-900 mb-1" style={{ fontFamily: "'Gloock', serif" }}>{sectionTitle}</div>
        <div className="flex flex-wrap items-center gap-x-1 gap-y-2 text-zinc-400 dark:text-[var(--foreground)] text-sm">
          {breadcrumb[0]?.onClick && (
            <button
              onClick={breadcrumb[0].onClick}
              className="mr-1 p-1 rounded-full hover:bg-zinc-100 transition flex items-center justify-center"
              aria-label="Back"
              type="button"
            >
              <ArrowLeft className="w-5 h-5 text-black dark:text-[var(--foreground)]" />
            </button>
          )}
          {breadcrumb.map((item, idx) => {
            // If label contains slashes, render as chevron-separated segments
            if (item.label.includes('/')) {
              const segments = item.label.split('/');
              return segments.map((seg, segIdx) => (
                <React.Fragment key={seg + segIdx}>
                  {(idx > 0 || segIdx > 0) && <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-[var(--foreground)]" />}
                  <button
                    className={`flex items-center gap-1 ${idx === breadcrumb.length - 1 && segIdx === segments.length - 1 ? 'text-zinc-900 dark:text-[var(--foreground)] font-semibold' : 'text-zinc-400 dark:text-[var(--foreground)] font-medium'} bg-transparent border-none p-0 m-0`}
                    onClick={item.onClick}
                    disabled={!item.onClick}
                    style={{ cursor: item.onClick ? 'pointer' : 'default' }}
                  >
                    {item.icon && segIdx === 0 && <span>{item.icon}</span>}
                    <span>{seg}</span>
                  </button>
                </React.Fragment>
              ));
            }
            // Otherwise, render as before
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-zinc-300 dark:text-[var(--foreground)]" />}
                <button
                  className={`flex items-center gap-1 ${item.isActive ? 'text-zinc-900 dark:text-[var(--foreground)] font-semibold' : 'text-zinc-400 dark:text-[var(--foreground)] font-medium'} bg-transparent border-none p-0 m-0`}
                  onClick={item.onClick}
                  disabled={!item.onClick}
                  style={{ cursor: item.onClick ? 'pointer' : 'default' }}
                >
                  {item.icon && <span>{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileDashboardHeader; 