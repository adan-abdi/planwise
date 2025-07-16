"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  FileText,
  Users2,
  Settings,
  PanelRightClose,
  PanelRightOpen,
  LayoutDashboard,
  SquareUserRound,
  SquareKanban,
  Logs,
  ChevronRight,
} from "lucide-react";
import Clients from "./Clients";
import MobileSidebarDrawer from "./MobileSidebarDrawer";
import Image from "next/image";
import MobileDashboardHeader from "./MobileDashboardHeader";
import DashboardHeaderUserSection from "./DashboardHeaderUserSection";
import Dashboard from './Dashboard';
import Plans from './Plans';
import Compliance from './Compliance';
import Templates from './Templates';
import Auditlog from './Auditlog';
import Teammembers from './Teammembers';
import SettingsSection from './Settings';
import { useTheme } from "../../theme-context";
import { getProfile } from '../../api/services/auth';

const iconClass = "w-5 h-5";

const sections = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className={iconClass} /> },
  { key: "clients", label: "Clients", icon: <SquareUserRound className={iconClass} /> },
  { key: "plans", label: "Plans", icon: <SquareKanban className={iconClass} /> },
  { key: "compliance", label: "Compliance", icon: <ShieldCheck className={iconClass} /> },
];

const supportSections = [
  { key: "templates", label: "Templates", icon: <FileText className={iconClass} /> },
  { key: "auditlog", label: "Audit log", icon: <Logs className={iconClass} /> },
  { key: "teammembers", label: "Team members", icon: <Users2 className={iconClass} /> },
  { key: "settings", label: "Settings", icon: <Settings className={iconClass} /> },
];

type BreadcrumbItem = { label: string; icon?: React.ReactNode; onClick?: () => void; isActive?: boolean };

export default function DashboardPage() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        window.location.href = '/';
      }
    }
  }, []);

  const [active, setActive] = useState("clients");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [clientDetailsOpen, setClientDetailsOpen] = useState(false);
  const activeSection = sections.find((s) => s.key === active);
  const activeSupportSection = supportSections.find((s) => s.key === active);
  const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbItem[]>([]);

  const [userName, setUserName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const userRole = "Paraplanner";

  useEffect(() => {
    async function fetchProfile() {
      try {
        const profile: unknown = await getProfile();
        if (
          profile &&
          typeof profile === 'object' &&
          profile !== null &&
          'data' in profile &&
          typeof (profile as { data?: unknown }).data === 'object' &&
          (profile as { data?: unknown }).data !== null
        ) {
          const data = (profile as { data: unknown }).data;
          setUserName((typeof data === 'object' && data !== null && 'fullName' in data && typeof (data as { fullName?: string }).fullName === 'string'
            ? (data as { fullName: string }).fullName
            : typeof data === 'object' && data !== null && 'full_name' in data && typeof (data as { full_name?: string }).full_name === 'string'
            ? (data as { full_name: string }).full_name
            : typeof data === 'object' && data !== null && 'email' in data && typeof (data as { email?: string }).email === 'string'
            ? (data as { email: string }).email
            : ""));
          setAvatarUrl((typeof data === 'object' && data !== null && 'profilePictureUrl' in data && typeof (data as { profilePictureUrl?: string }).profilePictureUrl === 'string'
            ? (data as { profilePictureUrl: string }).profilePictureUrl
            : typeof data === 'object' && data !== null && 'profile_picture_url' in data && typeof (data as { profile_picture_url?: string }).profile_picture_url === 'string'
            ? (data as { profile_picture_url: string }).profile_picture_url
            : ""));
          const user = {
            ...(typeof data === 'object' && data !== null ? data : {}),
            full_name:
              (typeof data === 'object' && data !== null && 'fullName' in data && typeof (data as { fullName?: string }).fullName === 'string'
                ? (data as { fullName: string }).fullName
                : typeof data === 'object' && data !== null && 'full_name' in data && typeof (data as { full_name?: string }).full_name === 'string'
                ? (data as { full_name: string }).full_name
                : undefined),
            profilePictureUrl:
              (typeof data === 'object' && data !== null && 'profilePictureUrl' in data && typeof (data as { profilePictureUrl?: string }).profilePictureUrl === 'string'
                ? (data as { profilePictureUrl: string }).profilePictureUrl
                : typeof data === 'object' && data !== null && 'profile_picture_url' in data && typeof (data as { profile_picture_url?: string }).profile_picture_url === 'string'
                ? (data as { profile_picture_url: string }).profile_picture_url
                : undefined),
          };
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          setUserName(user.full_name || user.fullName || user.email);
          setAvatarUrl(user.profilePictureUrl || user.profile_picture_url || "");
        }
      }
    }
    fetchProfile();
    function handleFocus() {
      fetchProfile();
    }
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const resolvedAvatarUrl = avatarUrl || "/logo.svg";

  const handleBackToClientList = () => setClientDetailsOpen(false);

  const [triggerRandomClients, setTriggerRandomClients] = useState(false);
  const handleClientDetailsChange = (open: boolean) => {
    setClientDetailsOpen(open);
  };

  useEffect(() => {
    if (active !== "clients") {
      setClientDetailsOpen(false);
    }
  }, [active]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handlePopState = () => {
        if (window.location.pathname === '/dashboard') {
          window.location.href = '/';
        }
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, []);

  const { darkMode } = useTheme();

  const generateRandomClients = () => {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Lisa', 'Robert', 'Mary', 'William', 'Anna', 'Richard', 'Jennifer', 'Thomas'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
    const advisors = ['Robert Fox', 'Sarah Johnson', 'Michael Brown', 'Emma Davis', 'David Wilson'];
    
    const randomClients = Array.from({ length: 30 }, () => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const advisor = advisors[Math.floor(Math.random() * advisors.length)];
      return {
        client: `${firstName} ${lastName}`,
        advisor,
        date: '',
        type: 'N/A',
        cfr: 'N/A',
        plans: 0,
        checklist: 0,
      };
    });
    
    return randomClients;
  };

  return (
    <div className="h-screen bg-[var(--background)] flex flex-col relative w-full max-w-full">
      <MobileDashboardHeader
        onOpenSidebar={() => setMobileSidebarOpen(true)}
        sectionTitle={breadcrumbPath.length > 0 ? breadcrumbPath[breadcrumbPath.length-1].label : (activeSection?.label || activeSupportSection?.label || '')}
        breadcrumb={breadcrumbPath}
        avatarUrl={resolvedAvatarUrl}
        userName={userName}
        userRole={userRole}
      />
      <div className="w-full bg-[var(--background)] border-b-2 relative hidden sm:block" style={{ borderColor: darkMode ? '#52525b' : '#e4e4e7' }}>
        <div className="flex items-center h-20 pl-0 pr-8 justify-between bg-[var(--background)]">
          <div className="w-64 flex-shrink-0 flex items-center h-full bg-[var(--background)]">
            <button
              className="ml-4 mr-2 p-2 rounded-[12px] border border-zinc-200 dark:border-[var(--border)] bg-white dark:bg-[var(--muted)] transition flex items-center justify-center w-10 h-10 sm:hidden"
              aria-label="Open sidebar"
              onClick={() => setMobileSidebarOpen(true)}
              style={{
                backgroundColor: darkMode ? 'var(--muted)' : 'white',
                borderColor: darkMode ? 'var(--border)' : '#e5e7eb'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c8592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="7" x2="19" y2="7" />
                <line x1="5" y1="12" x2="19" y2="12" />
                <line x1="5" y1="17" x2="19" y2="17" />
              </svg>
            </button>
            <button
              className="ml-4 mr-2 p-2 rounded-xl border border-zinc-200 dark:border-[var(--border)] transition flex items-center justify-center w-10 h-10"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setSidebarCollapsed((c) => !c)}
              style={{
                backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)',
                borderColor: darkMode ? 'var(--border)' : '#e5e7eb'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? 'rgba(59, 130, 246, 0.25)' : 'rgba(59, 130, 246, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)';
              }}
            >
              {sidebarCollapsed ? (
                <PanelRightOpen className="w-7 h-7 text-zinc-500" />
              ) : (
                <PanelRightClose className="w-7 h-7 text-zinc-500" />
              )}
            </button>
            <Image src={darkMode ? "/logo_darkmode.png" : "/logo.svg"} alt="PlanWise Logo" width={120} height={40} className="h-10 w-auto px-8" />
          </div>
          <div className={`flex-1 flex items-center h-full bg-[var(--background)] ${sidebarCollapsed ? 'pl-0' : 'pl-8'}`}>
            {active === "clients" && breadcrumbPath.length > 0 ? (
              <div className="flex items-center gap-2 py-2">
                {breadcrumbPath.map((item, idx) => (
                  <React.Fragment key={item.label}>
                    {idx > 0 && <ChevronRight className="w-3 h-3 text-zinc-300" />}
                    {idx < breadcrumbPath.length - 1 && item.onClick ? (
                      <button
                        type="button"
                        onClick={item.onClick}
                        className="flex items-center gap-1 text-base font-medium text-zinc-400 bg-transparent border-none p-0 m-0 hover:underline focus:outline-none"
                        style={{ cursor: 'pointer' }}
                      >
                        {item.icon && <span>{item.icon}</span>}
                        <span>{item.label}</span>
                      </button>
                    ) : (
                      <span
                        className={`flex items-center gap-1 text-base font-medium ${item.isActive ? 'font-semibold' : 'text-zinc-400'}`}
                        style={item.isActive ? { color: darkMode ? 'white' : 'black' } : undefined}
                      >
                        {item.icon && <span>{item.icon}</span>}
                        <span>{item.label}</span>
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) :
                <div className={`text-3xl text-[var(--foreground)] transition-all duration-200 pt-1 ${sidebarCollapsed ? '-ml-5' : ''}`} style={{ fontFamily: "'Gloock', serif" }}>{activeSection?.label || activeSupportSection?.label}</div>
            }
          </div>
          <DashboardHeaderUserSection
            userName={userName}
            userRole={userRole}
            avatarUrl={resolvedAvatarUrl}
            onGenerateRandomClients={() => {
              if (active === "clients") {
                setTriggerRandomClients(true);
              }
            }}
            showGenerateButton={active === "clients" && !clientDetailsOpen}
          />
        </div>
      </div>
      <MobileSidebarDrawer
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onSectionSelect={setActive}
        activeSectionKey={active}
      />
      <div className={`absolute top-0 bottom-0 w-0 border-l-2 z-40 pointer-events-none transition-all duration-200 hidden sm:block`} style={{ left: sidebarCollapsed ? 80 : 256, borderColor: darkMode ? '#52525b' : '#e4e4e7' }} />
      <div className="flex flex-1 min-h-0">
        <aside className={`${sidebarCollapsed ? 'w-20 pl-0' : 'w-64 pl-4 sm:pl-8'} bg-[var(--background)] flex-col select-none z-10 transition-all duration-200 hidden sm:flex`}>
          <nav className="flex-1 flex flex-col gap-8">
            <div>
              <div className={`text-xs font-semibold text-zinc-400 mb-2 tracking-widest pt-8 transition-all duration-200 ${sidebarCollapsed ? 'opacity-0 pointer-events-none select-none' : ''}`}>GENERAL</div>
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li
                    key={section.key}
                    className="w-full relative group"
                    onClick={() => setActive(section.key)}
                  >
                    {active === section.key && (
                      <span 
                        className="absolute left-[-12px] right-2 top-0 bottom-0 rounded-xl -z-10" 
                        aria-hidden="true"
                        style={{ 
                          backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)' 
                        }}
                      />
                    )}
                    <div className={`flex items-center gap-3 h-10 w-full cursor-pointer font-medium${sidebarCollapsed ? ' justify-center' : ''} rounded-xl`}>
                      {React.cloneElement(section.icon, {
                        className: `${iconClass} ${active === section.key ? 'text-blue-600' : 'text-zinc-400'}`,
                        style: active === section.key ? {
                          color: darkMode ? '#3b82f6' : '#2563eb'
                        } : undefined
                      })}
                      <span 
                        className={`transition-all duration-200 ${sidebarCollapsed ? 'opacity-0 pointer-events-none select-none w-0' : ''}`}
                        style={active === section.key ? { color: darkMode ? '#60a5fa' : '#2563eb' } : undefined}
                      >
                        {section.label}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <div className={`text-xs font-semibold text-zinc-400 mb-2 tracking-widest transition-all duration-200 ${sidebarCollapsed ? 'opacity-0 pointer-events-none select-none' : ''}`}>SUPPORT</div>
              <ul className="space-y-1">
                {supportSections.map((section) => (
                  <li
                    key={section.key}
                    className={`w-full relative group`}
                    onClick={() => setActive(section.key)}
                  >
                    {active === section.key && (
                      <span 
                        className="absolute left-[-12px] right-2 top-0 bottom-0 rounded-xl -z-10" 
                        aria-hidden="true"
                        style={{ 
                          backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.1)' 
                        }}
                      />
                    )}
                    <div className={`flex items-center gap-3 h-10 w-full cursor-pointer font-medium${sidebarCollapsed ? ' justify-center' : ''} rounded-xl`}>
                      {React.cloneElement(section.icon, {
                        className: `${iconClass} ${active === section.key ? 'text-blue-600' : 'text-zinc-400'}`,
                        style: active === section.key ? {
                          color: darkMode ? '#3b82f6' : '#2563eb'
                        } : undefined
                      })}
                      <span 
                        className={`transition-all duration-200 ${sidebarCollapsed ? 'opacity-0 pointer-events-none select-none w-0' : ''}`}
                        style={active === section.key ? { color: darkMode ? '#60a5fa' : '#2563eb' } : undefined}
                      >
                        {section.label}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </aside>
        <div className="flex-1 flex flex-col bg-[var(--background)] w-full px-4 sm:px-0">
          {active === "clients" ? (
            <Clients 
              detailsViewOpen={clientDetailsOpen} 
              onDetailsViewChange={handleClientDetailsChange} 
              onGenerateRandomClients={generateRandomClients}
              triggerRandomClients={triggerRandomClients}
              onRandomClientsGenerated={() => setTriggerRandomClients(false)}
              onBreadcrumbChange={setBreadcrumbPath}
              onBackToClientList={handleBackToClientList}
            />
          ) : active === "dashboard" ? (
            <Dashboard />
          ) : active === "plans" ? (
            <Plans />
          ) : active === "compliance" ? (
            <Compliance />
          ) : active === "templates" ? (
            <Templates />
          ) : active === "auditlog" ? (
            <Auditlog />
          ) : active === "teammembers" ? (
            <Teammembers />
          ) : active === "settings" ? (
            <SettingsSection />
          ) : null}
        </div>
      </div>
    </div>
  );
} 