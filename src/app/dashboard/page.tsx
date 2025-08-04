"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  PersonStanding,
  SquareDashedKanban,
  BadgeQuestionMark,
  Settings,
  LayoutDashboard,
  SquareUserRound,
  BookUser,
  ChevronRight,
  LogOut,
  UserPen,
  Moon,
  Sun,
  CalendarClock,
} from "lucide-react";
import Clients from "./Clients";
import MobileSidebarDrawer from "./MobileSidebarDrawer";
import Image from "next/image";

import Dashboard from './Dashboard';
import Advisors from './Advisors';
import Compliance from './Compliance';
import Templates from './Templates';

import SettingsSection from './Settings';
import { useTheme } from "../../theme-context";
import { useAuth } from "../../contexts/AuthContext";
import { ProtectedRoute } from "../../components/ProtectedRoute";

const iconClass = "w-5 h-5";

const sections = [
  { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard className={iconClass} /> },
  { key: "clients", label: "Clients", icon: <SquareUserRound className={iconClass} /> },
  { key: "advisors", label: "Advisors", icon: <BookUser className={iconClass} /> },
  { key: "compliance", label: "Team members", icon: <PersonStanding className={iconClass} /> },
  { key: "templates", label: "Templates", icon: <SquareDashedKanban className={iconClass} /> },
  { key: "help", label: "Help/FAQs", icon: <BadgeQuestionMark className={iconClass} /> },
];

type BreadcrumbItem = { label: string; icon?: React.ReactNode; onClick?: () => void; isActive?: boolean };

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState("clients");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [clientDetailsOpen, setClientDetailsOpen] = useState(false);
  const [selectedClientSlug, setSelectedClientSlug] = useState<string | null>(null);
  const [selectedCaseType, setSelectedCaseType] = useState<string | null>(null);
  const activeSection = sections.find((s) => s.key === active);
  const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbItem[]>([]);
  const isUpdatingUrlRef = useRef(false);
  const lastProcessedUrlRef = useRef<string>('');
  
  // Create stable references for URL parameters
  const urlParams = useMemo(() => ({
    client: searchParams.get('client'),
    case: searchParams.get('case')
  }), [searchParams]);


  const handleBreadcrumbChange = useCallback((path: BreadcrumbItem[]) => {
    setBreadcrumbPath(path);
  }, []);

  const handleBackToClientList = () => {
    setClientDetailsOpen(false);
    setSelectedClientSlug(null);
    // Update URL to remove client slug
    router.push('/dashboard');
  };

  const handleClientDetailsChange = useCallback((open: boolean, clientName?: string, tab?: string) => {
    setClientDetailsOpen(open);
    
    if (open && clientName) {
      // Create a URL-friendly slug from the client name
      const clientSlug = clientName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setSelectedClientSlug(clientSlug);
      
      // Update URL with client slug
      isUpdatingUrlRef.current = true;
      const newUrl = `/dashboard?client=${clientSlug}`;
      router.push(newUrl);
    } else if (!open) {
      setSelectedClientSlug(null);
      // Update URL to remove client slug
      isUpdatingUrlRef.current = true;
      router.push('/dashboard');
    }
  }, [router]);

  const [triggerRandomClients, setTriggerRandomClients] = useState(false);

  // Restore URL state management with proper safeguards
  useEffect(() => {
    // Skip if we're programmatically updating the URL
    if (isUpdatingUrlRef.current) {
      isUpdatingUrlRef.current = false;
      return;
    }
    
    const { client: clientParam, case: caseParam } = urlParams;
    const currentUrl = `${clientParam || ''}-${caseParam || ''}`;
    
    // Only process if the URL has actually changed
    if (lastProcessedUrlRef.current === currentUrl) {
      return;
    }
    
    lastProcessedUrlRef.current = currentUrl;
    
    if (clientParam && active === "clients") {
      setSelectedClientSlug(clientParam);
      setSelectedCaseType(caseParam);
      setClientDetailsOpen(true);
    } else if (!clientParam) {
      setSelectedClientSlug(null);
      setSelectedCaseType(null);
      setClientDetailsOpen(false);
    }
  }, [urlParams, active]);

  // Restore client details opening functionality
  useEffect(() => {
    if (selectedClientSlug && active === "clients") {
      setClientDetailsOpen(true);
    }
  }, [selectedClientSlug, active]);

  // Restore active section change handling
  useEffect(() => {
    if (active !== "clients") {
      setClientDetailsOpen(false);
      setSelectedClientSlug(null);
    }
  }, [active]);

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     const handlePopState = () => {
  //       if (window.location.pathname === '/dashboard') {
  //         window.location.href = '/';
  //       }
  //     };
  //     window.addEventListener('popstate', handlePopState);
  //     return () => window.removeEventListener('popstate', handlePopState);
  //   }
  // }, []);

  const { darkMode, toggleDarkMode } = useTheme();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const generateRandomClients = () => {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Lisa', 'Robert', 'Mary', 'William', 'Anna', 'Richard', 'Jennifer', 'Thomas', 'Christopher', 'Amanda', 'Daniel', 'Ashley', 'Matthew', 'Jessica', 'Joshua', 'Nicole', 'Andrew', 'Stephanie', 'Ryan', 'Rebecca', 'Brandon', 'Laura', 'Justin', 'Heather', 'Kevin', 'Michelle', 'Brian', 'Emily'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright'];
    const advisors = ['Robert Fox', 'Sarah Johnson', 'Michael Brown', 'Emma Davis', 'David Wilson', 'Jennifer Lee', 'Christopher Chen', 'Amanda Rodriguez'];
    
    const formatDate = (date: Date) => {
      const day = date.getDate();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const year = date.getFullYear();
      return `${day} ${month}, ${year}`;
    };
    
    const randomClients = Array.from({ length: 35 }, () => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const advisor = advisors[Math.floor(Math.random() * advisors.length)];
      
      const now = new Date();
      const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
      const randomTime = twoYearsAgo.getTime() + Math.random() * (now.getTime() - twoYearsAgo.getTime());
      const randomDate = new Date(randomTime);
      
      return {
        client: `${firstName} ${lastName}`,
        advisor,
        date: formatDate(randomDate),
        type: 'N/A',
        cfr: 'N/A',
        plans: 0,
        checklist: 0,
      };
    });
    
    return randomClients;
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 dark:bg-[var(--background)] w-full max-w-full">
        <MobileSidebarDrawer
          open={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
          onSectionSelect={setActive}
          activeSectionKey={active}
        />
        {/* Main content area: header + content */}
        <main className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="w-full px-2 sm:px-4 pt-2">
                    <div 
            className="backdrop-blur-sm p-2 sm:p-4 border"
            style={{ 
              backgroundColor: darkMode 
                ? 'rgba(30, 30, 30, 0.9)' 
                : 'rgba(255, 255, 255, 0.95)',
              borderColor: darkMode 
                ? 'rgba(255, 255, 255, 0.15)' 
                : 'rgba(255, 255, 255, 0.3)',
              border: `1px solid ${darkMode 
                ? 'rgba(255, 255, 255, 0.15)' 
                : 'rgba(255, 255, 255, 0.3)'}`,
              boxShadow: darkMode
                ? '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                : '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              backdropFilter: 'blur(4px) saturate(150%)',
              WebkitBackdropFilter: 'blur(4px) saturate(150%)',
              borderRadius: '5px'
            }}
          >
              <div className="flex items-center h-10 px-2 sm:px-0 justify-between">
                <div className="flex items-center">
                  {/* Mobile sidebar open button */}
                  <button
                    className="p-2 rounded-xl border transition-all duration-300 ease-out flex items-center justify-center w-10 h-10 backdrop-blur-lg"
                    aria-label="Open sidebar"
                    onClick={() => setMobileSidebarOpen(true)}
                    style={{
                      backgroundColor: darkMode 
                        ? 'rgba(55, 65, 81, 0.2)' 
                        : 'rgba(255, 255, 255, 0.3)',
                      borderColor: darkMode 
                        ? 'rgba(255, 255, 255, 0.15)' 
                        : 'rgba(255, 255, 255, 0.4)',
                      backdropFilter: 'blur(12px) saturate(150%)',
                      WebkitBackdropFilter: 'blur(12px) saturate(150%)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = darkMode 
                        ? 'rgba(75, 85, 99, 0.3)' 
                        : 'rgba(255, 255, 255, 0.5)';
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = darkMode 
                        ? '0 4px 12px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                        : '0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = darkMode 
                        ? 'rgba(55, 65, 81, 0.2)' 
                        : 'rgba(255, 255, 255, 0.3)';
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c8592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="7" x2="19" y2="7" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <line x1="5" y1="17" x2="19" y2="17" />
                    </svg>
                  </button>
                  {active === "clients" && breadcrumbPath.length > 0 ? (
                    <div className="flex items-center gap-2 py-2 pl-4">
                      {breadcrumbPath.map((item, idx) => (
                        <React.Fragment key={item.label}>
                          {idx > 0 && <ChevronRight className="w-3 h-3" style={{ color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.4)' }} />}
                          {idx < breadcrumbPath.length - 1 && item.onClick ? (
                            <button
                              type="button"
                              onClick={item.onClick}
                              className="flex items-center gap-1 text-base font-medium bg-transparent border-none p-0 m-0 hover:underline focus:outline-none transition-all duration-200"
                              style={{ 
                                cursor: 'pointer', 
                                color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
                                textShadow: darkMode ? '0 1px 2px rgba(0, 0, 0, 0.3)' : '0 1px 2px rgba(255, 255, 255, 0.5)'
                              }}
                            >
                              {item.icon && <span>{item.icon}</span>}
                              <span>{item.label}</span>
                            </button>
                          ) : (
                            <span
                              className={`flex items-center gap-1 text-base font-medium ${item.isActive ? 'font-semibold' : ''}`}
                              style={{ 
                                color: item.isActive 
                                  ? (darkMode ? 'rgba(255, 255, 255, 1)' : 'rgba(0, 0, 0, 0.9)')
                                  : (darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'),
                                textShadow: darkMode ? '0 1px 2px rgba(0, 0, 0, 0.3)' : '0 1px 2px rgba(255, 255, 255, 0.5)'
                              }}
                            >
                              {item.icon && <span>{item.icon}</span>}
                              <span>{item.label}</span>
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  ) :
                      <div className="text-3xl transition-all duration-200 pt-1 pl-3" style={{ 
                        fontFamily: "'Gloock', serif", 
                        color: darkMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(0, 0, 0, 0.9)',
                        textShadow: darkMode ? '0 2px 4px rgba(0, 0, 0, 0.3)' : '0 2px 4px rgba(255, 255, 255, 0.5)'
                      }}>{activeSection?.label}</div>
                  }
                </div>
                <div className="flex items-center">
                  <Image src={darkMode ? "/logo_darkmode.png" : "/logo.svg"} alt="PlanWise Logo" width={120} height={40} className="h-10 w-auto" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 flex flex-col w-full px-4 sm:px-0 min-h-0">
            {active === "clients" ? (
              <Clients 
                detailsViewOpen={clientDetailsOpen} 
                onDetailsViewChange={handleClientDetailsChange} 
                onGenerateRandomClients={generateRandomClients}
                triggerRandomClients={triggerRandomClients}
                onRandomClientsGenerated={() => setTriggerRandomClients(false)}
                onBreadcrumbChange={handleBreadcrumbChange}
                onBackToClientList={handleBackToClientList}
                selectedClientSlug={selectedClientSlug}
                selectedCaseType={selectedCaseType}
              />
            ) : active === "dashboard" ? (
              <Dashboard />
            ) : active === "advisors" ? (
              <Advisors />
            ) : active === "compliance" ? (
              <Compliance />
            ) : active === "templates" ? (
              <Templates />
            ) : active === "help" ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center bg-white dark:bg-[var(--background)] py-24">
                <div 
                  className="w-24 h-24 rounded-[14px] flex items-center justify-center mb-8 shadow-sm"
                  style={{
                    backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
                    border: `1px solid ${darkMode ? '#3f3f46' : '#e4e4e7'}`
                  }}
                >
                  <CalendarClock size={64} stroke="#b0b0b0" strokeWidth={1.5} />
                </div>
                <div className="text-xl font-semibold mb-2 text-zinc-900 dark:text-[var(--foreground)]">Help/FAQs Section</div>
                <div className="text-zinc-400 dark:text-[var(--foreground)] text-base mb-8">This is a placeholder for the <span className="text-zinc-400 dark:text-[var(--foreground)]">Help/FAQs</span> section.</div>
              </div>
            ) : active === "settings" ? (
              <SettingsSection />
            ) : null}
          </div>
        </main>
        <div className="absolute left-2 sm:left-4 top-[92px] z-40 w-12" style={{ height: 'calc(100vh - 145px)' }}>
          <div 
            className="h-full overflow-hidden flex flex-col" 
            style={{ 
              backgroundColor: darkMode 
                ? 'rgba(20, 20, 20, 0.6)' 
                : 'rgba(255, 255, 255, 0.7)',
              borderColor: darkMode 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'rgba(255, 255, 255, 0.4)',
              border: `1px solid ${darkMode 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'rgba(255, 255, 255, 0.4)'}`,
              boxShadow: darkMode
                ? '0 12px 40px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
                : '0 12px 40px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(32px) saturate(200%)',
              WebkitBackdropFilter: 'blur(32px) saturate(200%)',
              borderRadius: '5px'
            }}
          >
            <nav className="flex-1 flex flex-col items-center justify-start space-y-2 py-4">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActive(section.key)}
                  className="w-8 h-8 rounded-lg transition-all duration-300 ease-out flex items-center justify-center group relative hover:scale-110"
                  style={{
                    backgroundColor: active === section.key 
                      ? (darkMode 
                          ? 'rgba(59, 130, 246, 0.2)' 
                          : 'rgba(59, 130, 246, 0.15)')
                      : 'transparent',
                    color: active === section.key
                      ? (darkMode ? '#60a5fa' : '#2563eb')
                      : (darkMode ? '#9ca3af' : '#6b7280'),
                    border: active === section.key
                      ? `1px solid ${darkMode 
                          ? 'rgba(96, 165, 250, 0.3)' 
                          : 'rgba(37, 99, 235, 0.3)'}`
                      : '1px solid transparent',
                    transform: 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    backdropFilter: 'blur(16px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(16px) saturate(180%)'
                  }}
                  onMouseEnter={(e) => {
                    if (active !== section.key) {
                      e.currentTarget.style.backgroundColor = darkMode 
                        ? 'rgba(55, 65, 81, 0.3)' 
                        : 'rgba(243, 244, 246, 0.4)';
                      e.currentTarget.style.color = darkMode ? '#e5e7eb' : '#18181b';
                    }
                    e.currentTarget.style.transform = 'scale(1.1)';
                    e.currentTarget.style.boxShadow = darkMode 
                      ? '0 12px 32px rgba(0, 0, 0, 0.3), 0 6px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)' 
                      : '0 12px 32px rgba(0, 0, 0, 0.1), 0 6px 16px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)';
                    
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon) {
                      icon.style.transform = 'scale(1.05)';
                      icon.style.filter = darkMode 
                        ? 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))' 
                        : 'drop-shadow(0 0 8px rgba(0, 0, 0, 0.3))';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (active !== section.key) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = darkMode ? '#9ca3af' : '#6b7280';
                    }
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                    
                    const icon = e.currentTarget.querySelector('svg');
                    if (icon) {
                      icon.style.transform = 'scale(1)';
                      icon.style.filter = active === section.key 
                        ? (darkMode ? 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.4))' : 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.3))')
                        : 'none';
                    }
                  }}
                  title={section.label}
                >
                  {React.cloneElement(section.icon, {
                    className: "w-5 h-5 transition-all duration-300 ease-out",
                    style: {
                      filter: active === section.key 
                        ? (darkMode ? 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.4))' : 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.3))')
                        : 'none',
                      transform: 'scale(1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }
                  })}
                </button>
              ))}
            </nav>
            
            <div className="border-t py-4 flex flex-col items-center space-y-2" style={{ 
              borderColor: darkMode 
                ? 'rgba(161, 161, 170, 0.3)' 
                : 'rgba(161, 161, 170, 0.4)',
              backdropFilter: 'blur(16px) saturate(180%)',
              WebkitBackdropFilter: 'blur(16px) saturate(180%)'
            }}>
              <button
                onClick={() => setActive("settings")}
                className="w-8 h-8 rounded-lg transition-all duration-300 ease-out flex items-center justify-center group relative hover:scale-110"
                style={{
                  backgroundColor: active === "settings" 
                    ? (darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.15)')
                    : 'transparent',
                  color: active === "settings"
                    ? (darkMode ? '#60a5fa' : '#2563eb')
                    : (darkMode ? '#9ca3af' : '#6b7280'),
                  border: active === "settings"
                    ? `1px solid ${darkMode ? 'rgba(96, 165, 250, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`
                    : '1px solid transparent',
                  transform: 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(16px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(180%)'
                }}
                onMouseEnter={(e) => {
                  if (active !== "settings") {
                    e.currentTarget.style.backgroundColor = darkMode 
                      ? 'rgba(55, 65, 81, 0.2)' 
                      : 'rgba(243, 244, 246, 0.3)';
                    e.currentTarget.style.color = darkMode ? '#e5e7eb' : '#18181b';
                  }
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = darkMode 
                    ? '0 8px 25px rgba(0, 0, 0, 0.2), 0 4px 10px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                    : '0 8px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
                  
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) {
                    icon.style.transform = 'scale(1.05)';
                    icon.style.filter = active === "settings"
                      ? (darkMode ? 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.4))' : 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.3))')
                      : (darkMode ? 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.3))' : 'drop-shadow(0 0 6px rgba(0, 0, 0, 0.2))');
                  }
                }}
                onMouseLeave={(e) => {
                  if (active !== "settings") {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = darkMode ? '#9ca3af' : '#6b7280';
                  }
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) {
                    icon.style.transform = 'scale(1)';
                    icon.style.filter = active === "settings" 
                      ? (darkMode ? 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.4))' : 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.3))')
                      : 'none';
                  }
                }}
                title="Settings"
              >
                <Settings className="w-5 h-5 transition-all duration-300 ease-out" style={{
                  filter: active === "settings" 
                    ? (darkMode ? 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.4))' : 'drop-shadow(0 0 8px rgba(37, 99, 235, 0.3))')
                    : 'none',
                  transform: 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </button>
              
              <button
                onClick={toggleDarkMode}
                className="w-8 h-8 rounded-lg transition-all duration-300 ease-out flex items-center justify-center group relative hover:scale-110"
                style={{
                  backgroundColor: 'transparent',
                  color: darkMode ? '#fbbf24' : '#1e40af',
                  border: '1px solid transparent',
                  transform: 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(16px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(180%)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode 
                    ? 'rgba(251, 191, 36, 0.08)' 
                    : 'rgba(30, 64, 175, 0.08)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.backdropFilter = 'blur(20px) saturate(180%)';
                  (e.currentTarget.style as CSSStyleDeclaration & { WebkitBackdropFilter?: string }).WebkitBackdropFilter = 'blur(20px) saturate(180%)';
                  e.currentTarget.style.border = darkMode 
                    ? '1px solid rgba(251, 191, 36, 0.2)' 
                    : '1px solid rgba(30, 64, 175, 0.2)';
                  e.currentTarget.style.boxShadow = darkMode 
                    ? '0 8px 32px rgba(251, 191, 36, 0.15), 0 2px 8px rgba(251, 191, 36, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                    : '0 8px 32px rgba(30, 64, 175, 0.15), 0 2px 8px rgba(30, 64, 175, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                  
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) {
                    icon.style.filter = darkMode 
                      ? 'drop-shadow(0 0 12px rgba(251, 191, 36, 0.6)) brightness(1.1)' 
                      : 'drop-shadow(0 0 12px rgba(30, 64, 175, 0.6)) brightness(1.1)';
                    icon.style.transform = 'scale(1.05)';
                    icon.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backdropFilter = 'blur(16px) saturate(180%)';
                  (e.currentTarget.style as CSSStyleDeclaration & { WebkitBackdropFilter?: string }).WebkitBackdropFilter = 'blur(16px) saturate(180%)';
                  e.currentTarget.style.border = '1px solid transparent';
                  e.currentTarget.style.boxShadow = 'none';
                  
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) {
                    icon.style.filter = 'none';
                    icon.style.transform = 'scale(1)';
                    icon.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                  }
                }}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 transition-all duration-300 ease-out" style={{
                    filter: 'none',
                    transform: 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                ) : (
                  <Moon className="w-5 h-5 transition-all duration-300 ease-out" style={{
                    filter: 'none',
                    transform: 'scale(1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                )}
              </button>
              
              <button
                onClick={() => window.location.href = '/auth/profile'}
                className="w-8 h-8 rounded-lg transition-all duration-300 ease-out flex items-center justify-center group relative hover:scale-110"
                style={{
                  backgroundColor: 'transparent',
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  border: '1px solid transparent',
                  transform: 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(16px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(180%)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode 
                    ? 'rgba(55, 65, 81, 0.2)' 
                    : 'rgba(243, 244, 246, 0.3)';
                  e.currentTarget.style.color = darkMode ? '#e5e7eb' : '#18181b';
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = darkMode 
                    ? '0 8px 25px rgba(0, 0, 0, 0.2), 0 4px 10px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                    : '0 8px 25px rgba(0, 0, 0, 0.08), 0 4px 10px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
                  
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) {
                    icon.style.transform = 'scale(1.05)';
                    icon.style.filter = darkMode 
                      ? 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.3))' 
                      : 'drop-shadow(0 0 6px rgba(0, 0, 0, 0.2))';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = darkMode ? '#9ca3af' : '#6b7280';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) {
                    icon.style.transform = 'scale(1)';
                    icon.style.filter = 'none';
                  }
                }}
                title="Edit Profile"
              >
                <UserPen className="w-5 h-5 transition-all duration-300 ease-out" style={{
                  filter: 'none',
                  transform: 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </button>
              <button
                onClick={handleLogout}
                className="w-8 h-8 rounded-lg transition-all duration-300 ease-out flex items-center justify-center group relative hover:scale-110"
                style={{
                  backgroundColor: 'transparent',
                  color: darkMode ? '#9ca3af' : '#6b7280',
                  border: '1px solid transparent',
                  transform: 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  backdropFilter: 'blur(16px) saturate(180%)',
                  WebkitBackdropFilter: 'blur(16px) saturate(180%)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = darkMode ? '#dc2626' : '#fef2f2';
                  e.currentTarget.style.color = darkMode ? '#fca5a5' : '#dc2626';
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = darkMode 
                    ? '0 8px 25px rgba(220, 38, 38, 0.3), 0 4px 10px rgba(220, 38, 38, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                    : '0 8px 25px rgba(220, 38, 38, 0.2), 0 4px 10px rgba(220, 38, 38, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)';
                  
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) {
                    icon.style.transform = 'scale(1.05)';
                    icon.style.filter = darkMode 
                      ? 'drop-shadow(0 0 6px rgba(252, 165, 165, 0.4))' 
                      : 'drop-shadow(0 0 6px rgba(220, 38, 38, 0.3))';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = darkMode ? '#9ca3af' : '#6b7280';
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                  
                  // Reset icon effects
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) {
                    icon.style.transform = 'scale(1)';
                    icon.style.filter = 'none';
                  }
                }}
                title="Logout"
              >
                <LogOut className="w-5 h-5 transition-all duration-300 ease-out" style={{
                  filter: 'none',
                  transform: 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 