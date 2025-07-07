"use client";

import React, { useState } from "react";
import {
  Home,
  Users,
  Layers,
  ShieldCheck,
  FileText,
  List,
  Users2,
  Settings
} from "lucide-react";
import Clients from "./Clients";

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
  const activeSection = sections.find((s) => s.key === active);

  return (
    <div className="h-screen bg-zinc-50 flex flex-col relative">
      <div className={`absolute top-0 bottom-0 w-0 border-l-2 border-zinc-200 z-50 pointer-events-none transition-all duration-200`} style={{ left: sidebarCollapsed ? 80 : 256 }} />
      <div className="w-full bg-white border-b-2 border-zinc-200 relative">
        <div className="flex items-center h-20 pl-0 pr-8 justify-between bg-white">
          <div className="w-64 flex-shrink-0 flex items-center h-full bg-white">
            <button
              className="ml-4 mr-2 p-2 rounded-[12px] hover:bg-zinc-100 transition flex items-center justify-center w-10 h-10"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={() => setSidebarCollapsed((c) => !c)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c8592" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="7" x2="19" y2="7" />
                <line x1="5" y1="12" x2="19" y2="12" />
                <line x1="5" y1="17" x2="19" y2="17" />
              </svg>
            </button>
            <span className="font-bold text-2xl px-8 tracking-tight text-zinc-900">PlanWise</span>
          </div>
          <div className={`flex-1 flex items-center h-full bg-white ${sidebarCollapsed ? 'pl-0' : 'pl-8'}`}>
            <div className={`text-2xl font-bold text-zinc-900 transition-all duration-200 ${sidebarCollapsed ? '-ml-12' : ''}`}>{activeSection?.label}</div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 rounded-full hover:bg-zinc-100 transition">
              <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            </button>
            <div className="h-8 border-l-2 border-zinc-200" />
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Robert Fox" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow" />
            <div className="flex flex-col items-start ml-2">
              <span className="text-xs text-zinc-400 leading-none">Super admin</span>
              <span className="text-sm font-semibold text-zinc-900 leading-none">Robert Fox</span>
            </div>
            <button className="ml-2 p-2 rounded-full hover:bg-zinc-100 transition flex items-center justify-center">
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-1 min-h-0">
        <aside className={`${sidebarCollapsed ? 'w-20 pl-0' : 'w-64 pl-8'} bg-white flex flex-col select-none z-10 transition-all duration-200`}>
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
                    <div className={`flex items-center gap-3 py-2 w-full cursor-pointer font-medium${sidebarCollapsed ? ' justify-center' : ''}`}>
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
                    className={`flex items-center gap-3 py-2 rounded-[14px] text-zinc-700 hover:bg-zinc-100 cursor-pointer font-medium items-center${sidebarCollapsed ? ' justify-center' : ''}`}
                  >
                    {React.cloneElement(section.icon, {
                      className: `${iconClass} text-zinc-400`,
                    })}
                    <span className={`transition-all duration-200 ${sidebarCollapsed ? 'opacity-0 pointer-events-none select-none w-0' : ''}`}>{section.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </aside>
        <div className="flex-1 flex flex-col bg-white">
          {active === "clients" ? (
            <Clients />
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