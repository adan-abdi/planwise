import { Check, MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../../theme-context';
import { createPortal } from 'react-dom';

export interface ClientItem {
  advisor: string;
  client: string;
  date: string;
  type: string;
  cfr: string;
  plans: number;
  checklist: number;
  atr?: string;
  dob?: string;
  email?: string;
  phone?: string;
  website?: string;
  retirementAge?: string;
  avatar?: string;
  pensionTransfer?: number;
  isaTransfer?: number;
  pensionNewMoney?: number;
  isaNewMoney?: number;
}

const ChecklistIcons = ({ checked, onToggle, darkMode, readOnly = false }: { checked: boolean[]; onToggle?: (idx: number) => void; darkMode: boolean; readOnly?: boolean }) => {
  return (
    <div className="flex items-center gap-2">
      {checked.map((isChecked, i) => (
        <button
          key={i}
          type="button"
          onClick={readOnly ? undefined : () => onToggle && onToggle(i)}
          className="w-[18px] h-[18px] flex items-center justify-center rounded-[4px] border transition-all align-middle cursor-pointer appearance-none shadow-none"
          style={{ 
            outline: 'none',
            border: isChecked 
              ? darkMode ? '1px solid #4ade80' : '1px solid #22c55e'
              : darkMode ? '1px solid #52525b' : '1px solid #e4e4e7',
            backgroundColor: isChecked 
              ? darkMode ? 'rgba(34, 197, 94, 0.1)' : '#f0fdf4'
              : darkMode ? 'var(--background)' : '#ffffff',
            cursor: readOnly ? 'default' : 'pointer',
          }}
          disabled={readOnly}
        >
          {isChecked && (
            <Check 
              className="w-[14px] h-[14px] mx-auto my-auto" 
              style={{ color: darkMode ? '#4ade80' : '#22c55e' }}
            />
          )}
        </button>
      ))}
    </div>
  );
};

function ClientActionsMenu({ onClose, onViewDetails, onDelete, anchorRef, darkMode }: {
  onClose: () => void;
  onViewDetails: () => void;
  onDelete: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
  darkMode: boolean;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  useEffect(() => {
    if (anchorRef.current && menuRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      let top = rect.bottom + 8;
      let left = rect.left - 24;
      const minWidth = 260;
      const width = undefined;
      const menuHeight = menuRef.current.offsetHeight || 200;
      const menuWidth = menuRef.current.offsetWidth || minWidth;
      if (top + menuHeight > window.innerHeight) {
        top = Math.max(8, window.innerHeight - menuHeight - 8);
      }
      if (left + menuWidth > window.innerWidth) {
        left = Math.max(8, window.innerWidth - menuWidth - 8);
      }
      setStyle({
        position: 'fixed',
        top,
        left,
        zIndex: 1000,
        minWidth,
        width,
      });
    }
  }, [anchorRef, menuRef]);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, anchorRef]);
  const menu = (
    <div
      ref={menuRef}
      style={{
        ...style,
        backgroundColor: darkMode ? 'var(--muted)' : 'white',
        borderColor: darkMode ? '#52525b' : '#f4f4f5',
        boxShadow: darkMode ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}
      className="rounded-[10px] border py-4 px-6 flex flex-col animate-fade-in"
    >
      <button
        className="text-[15px] w-full py-2 px-2 text-left rounded-[14px] transition-colors focus:outline-none mb-1"
        onClick={() => { onViewDetails(); onClose(); }}
        type="button"
        style={{
          color: darkMode ? 'var(--foreground)' : '#18181b',
          backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f4f4f5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <div className='px-2'>View details</div>
      </button>
      <button
        className="text-[15px] w-full py-2 px-2 text-left rounded-[14px] transition-colors focus:outline-none mt-1"
        onClick={() => { onDelete(); onClose(); }}
        type="button"
        style={{
          color: darkMode ? '#f87171' : '#ef4444',
          backgroundColor: 'transparent'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = darkMode ? '#7f1d1d' : '#fef2f2';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <div className='px-2'>Delete client’s profile</div>
      </button>
    </div>
  );
  return typeof window !== 'undefined' ? createPortal(menu, document.body) : null;
}

function formatTypeWithLineBreak(type: string) {
  const types = type.split(', ');
  if (types.length <= 2) return type;
  return types.slice(0, 2).join(', ') + ',\n' + types.slice(2).join(', ');
}

export interface ClientListProps {
  clients: ClientItem[];
  onViewDetails?: (client: ClientItem) => void;
  checklistStates: boolean[][];
  onChecklistChange: (clientIdx: number, newChecklist: boolean[]) => void;
}

export default function ClientList({ clients, onViewDetails, checklistStates, onChecklistChange }: ClientListProps) {
  const [selectedRows, setSelectedRows] = useState<boolean[]>(clients.map(() => false));
  const [openMenuIdx, setOpenMenuIdx] = useState<number | null>(null);
  const menuButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { darkMode } = useTheme();

  useEffect(() => {
    setSelectedRows((prev) => {
      if (clients.length === prev.length) return prev;
      if (clients.length > prev.length) {
        return [...prev, ...Array(clients.length - prev.length).fill(false)];
      } else {
        return prev.slice(0, clients.length);
      }
    });
  }, [clients.length]);

  const allSelected = selectedRows.length > 0 && selectedRows.every(Boolean);
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows(selectedRows.map(() => false));
    } else {
      setSelectedRows(selectedRows.map(() => true));
    }
  };
  const handleSelectRow = (idx: number) => {
    setSelectedRows(selectedRows.map((v, i) => (i === idx ? !v : v)));
  };
  const handleChecklistToggle = (clientIdx: number, checklistIdx: number) => {
    const current = checklistStates[clientIdx] || [false, false, false, false];
    const newChecklist = current.map((v, j) => (j === checklistIdx ? !v : v));
    onChecklistChange(clientIdx, newChecklist);
  };

  const renderLightTable = () => (
    <div className="overflow-x-auto w-full px-0 mt-4 sm:mt-0 sm:pt-0 scrollbar-thin border border-zinc-200 rounded-lg bg-white" style={{marginBottom: 0}}>
      <table className="w-full text-[10px] sm:text-xs text-left border-collapse">
        <thead className="text-zinc-700 font-semibold bg-zinc-50 border-b border-zinc-200 shadow-xs rounded-t-md">
          <tr className="h-8 sm:h-10">
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-100">{/* select all */}
              <button
                type="button"
                onClick={handleSelectAll}
                className="appearance-none w-4 h-4 rounded-[6px] border transition-all align-middle cursor-pointer flex items-center justify-center shadow-none"
                style={{ 
                  outline: 'none',
                  border: allSelected 
                    ? darkMode ? '1px solid #3b82f6' : '1px solid #2563eb'
                    : darkMode ? '1px solid #52525b' : '1px solid #e4e4e7',
                  backgroundColor: allSelected 
                    ? darkMode ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.07)'
                    : darkMode ? 'var(--background)' : '#ffffff'
                }}
              >
                {allSelected && (
                  <Check 
                    className="w-3 h-3" 
                    style={{ color: darkMode ? '#3b82f6' : '#2563eb' }}
                  />
                )}
              </button>
            </th>
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-100 text-left" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>Advisor Name</th>
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-100 text-left" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>Client Name</th>
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-100 whitespace-nowrap text-left" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>Date Received</th>
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-100 hidden md:table-cell text-left max-w-[180px]" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>Type of Case</th>
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-100 hidden md:table-cell text-left" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>CFR Uploaded?</th>
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-100 hidden lg:table-cell text-left max-w-[40px]" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>No. of plans</th>
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-100 hidden sm:table-cell text-left" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>Checklists Status</th>
            <th className="p-2 sm:p-2 align-middle text-left" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c, idx) => (
            <tr key={idx} className={`border-b border-zinc-100 bg-white h-7 sm:h-9 hover:bg-blue-50${darkMode ? ' dark:hover:bg-[rgba(59,130,246,0.12)]' : ''}`}>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-100">
                <button
                  type="button"
                  onClick={() => handleSelectRow(idx)}
                  className="appearance-none w-4 h-4 rounded-[6px] border transition-all align-middle cursor-pointer flex items-center justify-center shadow-none"
                  style={{ 
                    outline: 'none',
                    border: selectedRows[idx] 
                      ? darkMode ? '1px solid #3b82f6' : '1px solid #2563eb'
                      : darkMode ? '1px solid #52525b' : '1px solid #e4e4e7',
                    backgroundColor: selectedRows[idx] 
                      ? darkMode ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.07)'
                      : darkMode ? 'var(--background)' : '#ffffff'
                  }}
                >
                  {selectedRows[idx] && (
                    <Check 
                      className="w-3 h-3" 
                      style={{ color: darkMode ? '#3b82f6' : '#2563eb' }}
                    />
                  )}
                </button>
              </td>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-100 truncate max-w-[60px]">{c.advisor}</td>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-100">
                <span className="font-medium ml-1 align-middle inline-block" style={{ verticalAlign: 'middle' }}>{c.client}</span>
              </td>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-100 whitespace-nowrap">{c.date}</td>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-100 hidden md:table-cell max-w-[180px] whitespace-pre-line">{formatTypeWithLineBreak(c.type)}</td>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-100 hidden md:table-cell truncate max-w-[30px]">{c.cfr}</td>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-100 hidden lg:table-cell truncate max-w-[40px]">{c.plans}</td>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-100 hidden sm:table-cell">
                <span style={{ display: 'inline-flex', alignItems: 'center', textAlign: 'center', width: '100%' }} className="whitespace-nowrap">
                  <ChecklistIcons
                    checked={checklistStates[idx] || [false, false, false, false]}
                    darkMode={darkMode}
                    readOnly={true}
                  />
                  <span className="text-gray-400 text-[9px] sm:text-xs whitespace-nowrap ml-3">
                    {(checklistStates[idx] || []).filter(Boolean).length}/4 Completed
                  </span>
                </span>
              </td>
              <td className="p-2 sm:p-2 align-middle">
                <span style={{ display: 'inline-block', textAlign: 'center', width: '100%' }}>
                  <button
                    type="button"
                    ref={el => { if (el) menuButtonRefs.current[idx] = el; }}
                    onClick={() => setOpenMenuIdx(openMenuIdx === idx ? null : idx)}
                    className="appearance-none w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    aria-label="Open actions menu"
                  >
                    <MoreHorizontal className="w-3 h-3 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </button>
                  {openMenuIdx === idx && menuButtonRefs.current[idx] && (
                    <ClientActionsMenu
                      onClose={() => setOpenMenuIdx(null)}
                      onViewDetails={() => onViewDetails && onViewDetails(c)}
                      onDelete={() => {/* TODO: handle delete */}}
                      anchorRef={{ current: menuButtonRefs.current[idx]! }}
                      darkMode={darkMode}
                    />
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderDarkTable = () => (
    <div className="overflow-x-auto w-full px-0 mt-4 sm:mt-0 sm:pt-0 scrollbar-thin border border-zinc-700 rounded-lg bg-[var(--background)]" style={{marginBottom: 0}}>
      <table className="w-full text-[10px] sm:text-xs text-left border-collapse text-[var(--foreground)]">
        <thead className="text-[var(--foreground)] font-semibold bg-[var(--muted)] border-b border-zinc-700 shadow-xs rounded-t-md">
          <tr className="h-8 sm:h-10">
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-600">{/* select all */}
              <button
                type="button"
                onClick={handleSelectAll}
                className="appearance-none w-4 h-4 rounded-[6px] border transition-all align-middle cursor-pointer flex items-center justify-center shadow-none"
                style={{ 
                  outline: 'none',
                  border: allSelected 
                    ? darkMode ? '1px solid #3b82f6' : '1px solid #2563eb'
                    : darkMode ? '1px solid #52525b' : '1px solid #e4e4e7',
                  backgroundColor: allSelected 
                    ? darkMode ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.07)'
                    : darkMode ? 'var(--background)' : '#ffffff'
                }}
              >
                {allSelected && (
                  <Check 
                    className="w-3 h-3" 
                    style={{ color: darkMode ? '#3b82f6' : '#2563eb' }}
                  />
                )}
              </button>
            </th>
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-600 text-left" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>Advisor Name</th>
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-600 text-left" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>Client Name</th>
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-600 whitespace-nowrap text-left" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>Date Received</th>
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-600 hidden md:table-cell max-w-[180px] text-[var(--foreground)] whitespace-pre-line">Type of Case</th>
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-600 hidden md:table-cell text-left" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>CFR Uploaded?</th>
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-600 hidden lg:table-cell text-left max-w-[40px] text-[var(--foreground)]">No. of plans</th>
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-600 hidden sm:table-cell text-left" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>Checklists Status</th>
            <th className="p-2 sm:p-2 align-middle text-left" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c, idx) => (
            <tr key={idx} className={`border-b border-zinc-700 bg-[var(--background)] h-7 sm:h-9 hover:bg-[rgba(59,130,246,0.07)]${darkMode ? ' dark:hover:bg-[rgba(59,130,246,0.12)]' : ''}`}>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-600">
                <button
                  type="button"
                  onClick={() => handleSelectRow(idx)}
                  className="appearance-none w-4 h-4 rounded-[6px] border transition-all align-middle cursor-pointer flex items-center justify-center shadow-none"
                  style={{ 
                    outline: 'none',
                    border: selectedRows[idx] 
                      ? darkMode ? '1px solid #3b82f6' : '1px solid #2563eb'
                      : darkMode ? '1px solid #52525b' : '1px solid #e4e4e7',
                    backgroundColor: selectedRows[idx] 
                      ? darkMode ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.07)'
                      : darkMode ? 'var(--background)' : '#ffffff'
                  }}
                >
                  {selectedRows[idx] && (
                    <Check 
                      className="w-3 h-3" 
                      style={{ color: darkMode ? '#3b82f6' : '#2563eb' }}
                    />
                  )}
                </button>
              </td>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-600 truncate max-w-[60px] text-[var(--foreground)]">{c.advisor}</td>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-600 text-[var(--foreground)]">
                <span className="font-medium ml-1 align-middle inline-block text-[var(--foreground)]" style={{ verticalAlign: 'middle' }}>{c.client}</span>
              </td>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-600 whitespace-nowrap text-[var(--foreground)]">{c.date}</td>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-600 hidden md:table-cell max-w-[180px] text-[var(--foreground)] whitespace-pre-line">{formatTypeWithLineBreak(c.type)}</td>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-600 hidden md:table-cell truncate max-w-[30px] text-[var(--foreground)]">{c.cfr}</td>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-600 hidden lg:table-cell truncate max-w-[40px] text-[var(--foreground)]">{c.plans}</td>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-600 hidden sm:table-cell">
                <span style={{ display: 'inline-flex', alignItems: 'center', textAlign: 'center', width: '100%' }} className="whitespace-nowrap">
                  <ChecklistIcons
                    checked={checklistStates[idx] || [false, false, false, false]}
                    darkMode={darkMode}
                    readOnly={true}
                  />
                  <span className="text-gray-500 text-[9px] sm:text-xs whitespace-nowrap ml-3">
                    {(checklistStates[idx] || []).filter(Boolean).length}/4 Completed
                  </span>
                </span>
              </td>
              <td className="p-2 sm:p-2 align-middle">
                <span style={{ display: 'inline-block', textAlign: 'center', width: '100%' }}>
                  <button
                    type="button"
                    ref={el => { if (el) menuButtonRefs.current[idx] = el; }}
                    onClick={() => setOpenMenuIdx(openMenuIdx === idx ? null : idx)}
                    className="appearance-none w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--muted)] transition-colors focus:ring-2 focus:ring-blue-800 focus:outline-none"
                    aria-label="Open actions menu"
                  >
                    <MoreHorizontal className="w-3 h-3 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </button>
                  {openMenuIdx === idx && menuButtonRefs.current[idx] && (
                    <ClientActionsMenu
                      onClose={() => setOpenMenuIdx(null)}
                      onViewDetails={() => onViewDetails && onViewDetails(c)}
                      onDelete={() => {/* TODO: handle delete */}}
                      anchorRef={{ current: menuButtonRefs.current[idx]! }}
                      darkMode={darkMode}
                    />
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return darkMode ? renderDarkTable() : renderLightTable();
}
