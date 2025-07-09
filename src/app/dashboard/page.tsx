"use client";

import React, { useState } from "react";
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
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import Clients from "./Clients";
import MobileSidebarDrawer from "./MobileSidebarDrawer";
import Image from "next/image";
import MobileDashboardHeader from "./MobileDashboardHeader";
import DashboardHeaderUserSection from "./DashboardHeaderUserSection";

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

function Placeholder({ label }: { label: string }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center text-zinc-400 py-24">
      <div className="w-24 h-24 bg-blue-50 rounded-[14px] flex items-center justify-center mb-8 shadow-sm">
        <svg width="64" height="64" fill="none" stroke="#b0b0b0" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="13" rx="2"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
      </div>
      <div className="text-xl font-semibold text-zinc-900 mb-2">{label} Section</div>
      <div className="text-zinc-400 text-base mb-8">This is a placeholder for the {label} section.</div>
    </div>
  );
}

export default function DashboardPage() {
  const [active, setActive] = useState("clients");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [clientDetailsOpen, setClientDetailsOpen] = useState(false);
  const activeSection = sections.find((s) => s.key === active);
  const activeSupportSection = supportSections.find((s) => s.key === active);
  const [selectedClientTab, setSelectedClientTab] = useState<string>('details');

  const handleBackToClients = () => setClientDetailsOpen(false);

  const [selectedClientName, setSelectedClientName] = useState<string | null>(null);
  const handleClientDetailsChange = (open: boolean, name?: string, tab?: string) => {
    setClientDetailsOpen(open);
    setSelectedClientName(open && name ? name : null);
    setSelectedClientTab(tab || 'details');
  };

  return (
    <div className="h-screen bg-zinc-50 flex flex-col relative w-full max-w-full">
      <MobileDashboardHeader
        onOpenSidebar={() => setMobileSidebarOpen(true)}
        sectionTitle={(() => {
          if (active === "clients" && clientDetailsOpen) return '';
          return activeSection?.label || activeSupportSection?.label || '';
        })()}
        breadcrumb={(() => {
          if (active === "clients" && clientDetailsOpen) {
            const items = [];
            items.push({
              label: "Clients",
              icon: <SquareUserRound className="w-4 h-4 text-zinc-400" />,
              onClick: handleBackToClients,
              isActive: false,
            });
            if (selectedClientName) {
              items.push({
                label: selectedClientName,
                isActive: !selectedClientTab.startsWith('transfers/'),
              });
            } else if (!selectedClientName) {
              items.push({
                label: "Client",
                isActive: !selectedClientTab.startsWith('transfers/'),
              });
            }
            if (selectedClientTab.startsWith('transfers/')) {
              items.push({
                label: "Transfers",
                isActive: false,
              });
              items.push({
                label: selectedClientTab.replace('transfers/', ''),
                isActive: true,
              });
            } else {
              items.push({
                label: selectedClientTab === 'details' ? 'Client details' : selectedClientTab.charAt(0).toUpperCase() + selectedClientTab.slice(1),
                isActive: true,
              });
            }
            return items;
          }
          return [];
        })()}
        avatarUrl={"https://randomuser.me/api/portraits/men/32.jpg"}
        userName={"Robert Fox"}
        userRole={"Super admin"}
      />
      <div className="w-full bg-white border-b-2 border-zinc-200 relative hidden sm:block">
        <div className="flex items-center h-20 pl-0 pr-8 justify-between bg-white">
          <div className="w-64 flex-shrink-0 flex items-center h-full bg-white">
            <button
              className="ml-4 mr-2 p-2 rounded-[12px] hover:bg-zinc-100 transition flex items-center justify-center w-10 h-10 sm:hidden"
              aria-label="Open sidebar"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c8592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="7" x2="19" y2="7" />
                <line x1="5" y1="12" x2="19" y2="12" />
                <line x1="5" y1="17" x2="19" y2="17" />
              </svg>
            </button>
            <button
              className="ml-4 mr-2 p-2 rounded-xl hover:bg-zinc-100 transition flex items-center justify-center w-10 h-10 border border-zinc-200 bg-white"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setSidebarCollapsed((c) => !c)}
            >
              {sidebarCollapsed ? (
                <PanelRightOpen className="w-7 h-7 text-zinc-500" />
              ) : (
                <PanelRightClose className="w-7 h-7 text-zinc-500" />
              )}
            </button>
            <Image src="/logo.svg" alt="PlanWise Logo" width={120} height={40} className="h-10 w-auto px-8" />
          </div>
          <div className={`flex-1 flex items-center h-full bg-white ${sidebarCollapsed ? 'pl-0' : 'pl-8'}`}>
            {active === "clients" && clientDetailsOpen ? (
              <div className="flex items-center gap-2 py-2">
                <button
                  onClick={handleBackToClients}
                  className="p-1 rounded-full hover:bg-zinc-100 transition flex items-center justify-center"
                  aria-label="Back to client list"
                >
                  <ArrowLeft className="w-5 h-5 text-black" />
                </button>
                <span className="h-6 w-px bg-zinc-200" />
                <SquareUserRound className="w-4 h-4 text-zinc-400" />
                <span className="text-zinc-400 text-base font-medium">Clients</span>
                {/* Render chevron-based breadcrumb for client/transfer path */}
                {(() => {
                  // Parse the selectedClientTab for transfer path
                  let path: string[] = [];
                  if (selectedClientTab && selectedClientTab.startsWith('transfers/')) {
                    path = selectedClientTab.replace('transfers/', '').split('/');
                  }
                  return (
                    <>
                      <ChevronRight className="w-3 h-3 text-zinc-300" />
                      <span className="text-zinc-400 text-base font-medium">Client: {selectedClientName || ""}</span>
                      {selectedClientTab && selectedClientTab.startsWith('transfers/') && path.length > 0 && path.map((folder, idx) => (
                        <React.Fragment key={folder + idx}>
                          <ChevronRight className="w-3 h-3 text-zinc-300" />
                          <span className={`text-base font-medium ${idx === path.length - 1 ? 'text-zinc-900 font-semibold' : 'text-zinc-400'}`}>{folder}</span>
                        </React.Fragment>
                      ))}
                      {selectedClientTab && !selectedClientTab.startsWith('transfers/') && (
                        <>
                          <ChevronRight className="w-3 h-3 text-zinc-300" />
                          <span className="text-zinc-900 text-base font-semibold">{selectedClientTab === 'details' ? 'Client details' : selectedClientTab.charAt(0).toUpperCase() + selectedClientTab.slice(1)}</span>
                        </>
                      )}
                    </>
                  );
                })()}
              </div>
            ) :
              <div className={`text-3xl text-zinc-900 transition-all duration-200 pt-1 ${sidebarCollapsed ? '-ml-5' : ''}`} style={{ fontFamily: "'Gloock', serif" }}>{activeSection?.label || activeSupportSection?.label}</div>
            }
          </div>
          <DashboardHeaderUserSection
            userName="Robert Fox"
            userRole="Super admin"
            avatarUrl="https://randomuser.me/api/portraits/men/32.jpg"
          />
        </div>
      </div>
      <MobileSidebarDrawer
        open={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
        onSectionSelect={setActive}
        activeSectionKey={active}
      />
      <div className={`absolute top-0 bottom-0 w-0 border-l-2 border-zinc-200 z-50 pointer-events-none transition-all duration-200 hidden sm:block`} style={{ left: sidebarCollapsed ? 80 : 256 }} />
      <div className="flex flex-1 min-h-0">
        <aside className={`${sidebarCollapsed ? 'w-20 pl-0' : 'w-64 pl-4 sm:pl-8'} bg-white flex-col select-none z-10 transition-all duration-200 hidden sm:flex`}>
          <nav className="flex-1 flex flex-col gap-8">
            <div>
              <div className={`text-xs font-semibold text-zinc-400 mb-2 tracking-widest pt-8 transition-all duration-200 ${sidebarCollapsed ? 'opacity-0 pointer-events-none select-none' : ''}`}>GENERAL</div>
              <ul className="space-y-1">
                {sections.map((section) => (
                  <li
                    key={section.key}
                    className="w-full relative"
                    onClick={() => setActive(section.key)}
                  >
                    {active === section.key && (
                      <span className="absolute left-[-12px] right-2 top-0 bottom-0 bg-blue-50 rounded-xl -z-10" aria-hidden="true" />
                    )}
                    <div className={`flex items-center gap-3 h-10 w-full cursor-pointer font-medium${sidebarCollapsed ? ' justify-center' : ''}`}>
                      {React.cloneElement(section.icon, {
                        className: `${iconClass} ${active === section.key ? 'text-blue-600' : 'text-zinc-400'}`
                      })}
                      <span className={`transition-all duration-200 ${sidebarCollapsed ? 'opacity-0 pointer-events-none select-none w-0' : ''}`}>{section.label}</span>
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
                    className="w-full relative"
                    onClick={() => setActive(section.key)}
                  >
                    {active === section.key && (
                      <span className="absolute left-[-12px] right-2 top-0 bottom-0 bg-blue-50 rounded-xl -z-10" aria-hidden="true" />
                    )}
                    <div className={`flex items-center gap-3 h-10 w-full cursor-pointer font-medium${sidebarCollapsed ? ' justify-center' : ''}`}>
                      {React.cloneElement(section.icon, {
                        className: `${iconClass} ${active === section.key ? 'text-blue-600' : 'text-zinc-400'}`
                      })}
                      <span className={`transition-all duration-200 ${sidebarCollapsed ? 'opacity-0 pointer-events-none select-none w-0' : ''}`}>{section.label}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </aside>
        <div className="flex-1 flex flex-col bg-white w-full px-4 sm:px-0">
          {active === "clients" ? (
            <Clients detailsViewOpen={clientDetailsOpen} onDetailsViewChange={handleClientDetailsChange} />
          ) : active === "dashboard" ? (
            <Placeholder label="Dashboard" />
          ) : active === "plans" ? (
            <Placeholder label="Plans" />
          ) : active === "compliance" ? (
            <Placeholder label="Compliance" />
          ) : null}
        </div>
      </div>
    </div>
  );
} 