import { Check, MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react';
import { useRef } from 'react';

export interface ClientItem {
  advisor: string;
  client: string;
  avatar: string;
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
}

const ChecklistIcons = ({ checked, onToggle }: { checked: boolean[]; onToggle: (idx: number) => void }) => {
  return (
    <div className="flex items-center gap-[2px]">
      {checked.map((isChecked, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onToggle(i)}
          className={`w-5 h-5 flex items-center justify-center rounded-[6px] border transition-all align-middle cursor-pointer focus:ring-2 focus:ring-blue-200 appearance-none shadow-none ${isChecked ? 'border-green-500 bg-green-50' : 'border-zinc-200 bg-white'}`}
          style={{ outline: 'none' }}
        >
          {isChecked && <Check className="w-4 h-4 text-green-500 mx-auto my-auto" />}
        </button>
      ))}
    </div>
  );
};

function ClientActionsMenu({ onClose, onViewDetails, onDelete, anchorRef }: {
  onClose: () => void;
  onViewDetails: () => void;
  onDelete: () => void;
  anchorRef: React.RefObject<HTMLButtonElement>;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
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

  const [style, setStyle] = useState<React.CSSProperties>({});
  useEffect(() => {
    if (anchorRef.current && menuRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      if (typeof window !== 'undefined' && window.innerWidth < 640) {
        setStyle({
          position: 'fixed',
          top: rect.bottom + 8,
          left: 8,
          right: 8,
          minWidth: undefined,
          width: 'calc(100vw - 16px)',
          zIndex: 1000,
        });
      } else {
        setStyle({
          position: 'fixed',
          top: rect.bottom + 8,
          left: rect.left - 24,
          zIndex: 1000,
          minWidth: 260,
        });
      }
    }
  }, [anchorRef]);

  return (
    <div
      ref={menuRef}
      style={style}
      className="bg-white rounded-[10px] shadow-md border border-zinc-100 py-4 px-6 flex flex-col animate-fade-in"
    >
      <button
        className="text-[15px] text-zinc-900 w-full py-2 px-2 text-left hover:bg-zinc-100 rounded-[14px] transition-colors focus:outline-none mb-1"
        onClick={() => { onViewDetails(); onClose(); }}
        type="button"
      >
        <div className='px-2'>View details</div>
      </button>
      <button
        className="text-[15px] text-red-500 w-full py-2 px-2 text-left hover:bg-red-50 rounded-[14px] transition-colors focus:outline-none mt-1"
        onClick={() => { onDelete(); onClose(); }}
        type="button"
      >
        <div className='px-2'>Delete client’s profile</div>
      </button>
    </div>
  );
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
  return (
    <div className="overflow-x-auto w-full px-0 pt-4 sm:pt-0 scrollbar-thin" style={{marginTop: 0, marginBottom: 0}}>
      <table className="w-full text-[10px] sm:text-xs text-left border-collapse">
        <thead className="text-zinc-700 font-semibold bg-zinc-50 border-b border-zinc-200 shadow-xs rounded-t-md">
          <tr className="h-8 sm:h-10">
            <th className="p-0.5 sm:p-2 align-middle border-r border-zinc-100">{/* select all */}
              <button
                type="button"
                onClick={handleSelectAll}
                className={`appearance-none w-4 h-4 rounded-[6px] border transition-all align-middle cursor-pointer focus:ring-2 focus:ring-blue-200 flex items-center justify-center shadow-none ${allSelected ? 'border-green-500 bg-green-50' : 'border-zinc-200 bg-white'}`}
                style={{ outline: 'none' }}
              >
                {allSelected && <Check className="w-3 h-3 text-green-500" />}
              </button>
            </th>
            <th className="p-0.5 sm:p-2 align-middle border-r border-zinc-100 hidden sm:table-cell text-left">Advisor Name</th>
            <th className="p-0.5 sm:p-2 align-middle border-r border-zinc-100 text-left">Client Name</th>
            <th className="p-0.5 sm:p-2 align-middle border-r border-zinc-100 whitespace-nowrap text-left">Date Received</th>
            <th className="p-0.5 sm:p-2 align-middle border-r border-zinc-100 hidden md:table-cell text-left">Type of Case</th>
            <th className="p-0.5 sm:p-2 align-middle border-r border-zinc-100 hidden md:table-cell text-left">CFR Uploaded?</th>
            <th className="p-0.5 sm:p-2 align-middle border-r border-zinc-100 hidden lg:table-cell text-left">Number of Plans</th>
            <th className="p-0.5 sm:p-2 align-middle border-r border-zinc-100 text-left">Checklists Status</th>
            <th className="p-0.5 sm:p-2 align-middle text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c, idx) => (
            <tr key={idx} className="border-b border-zinc-100 bg-white h-7 sm:h-9">
              <td className="p-0.5 sm:p-2 align-middle border-r border-zinc-100">
                <button
                  type="button"
                  onClick={() => handleSelectRow(idx)}
                  className={`appearance-none w-4 h-4 rounded-[6px] border transition-all align-middle cursor-pointer focus:ring-2 focus:ring-blue-200 flex items-center justify-center shadow-none ${selectedRows[idx] ? 'border-green-500 bg-green-50' : 'border-zinc-200 bg-white'}`}
                  style={{ outline: 'none' }}
                >
                  {selectedRows[idx] && <Check className="w-3 h-3 text-green-500" />}
                </button>
              </td>
              <td className="p-0.5 sm:p-2 align-middle border-r border-zinc-100 hidden sm:table-cell truncate max-w-[60px]">{c.advisor}</td>
              <td className="p-0.5 sm:p-2 align-middle border-r border-zinc-100 truncate max-w-[80px]">
                <span style={{ display: 'inline-block', verticalAlign: 'middle' }}>
                  <span className="relative w-5 h-5 inline-block align-middle" style={{ verticalAlign: 'middle' }}>
                    <Image
                      src={c.avatar}
                      alt={c.client}
                      fill
                      className="rounded-full object-cover"
                    />
                  </span>
                  <span className="font-medium truncate max-w-[60px] ml-1 align-middle inline-block" style={{ verticalAlign: 'middle' }}>{c.client}</span>
                </span>
              </td>
              <td className="p-0.5 sm:p-2 align-middle border-r border-zinc-100 whitespace-nowrap">{c.date}</td>
              <td className="p-0.5 sm:p-2 align-middle border-r border-zinc-100 hidden md:table-cell truncate max-w-[50px]">{c.type}</td>
              <td className="p-0.5 sm:p-2 align-middle border-r border-zinc-100 hidden md:table-cell truncate max-w-[40px]">{c.cfr}</td>
              <td className="p-0.5 sm:p-2 align-middle border-r border-zinc-100 hidden lg:table-cell truncate max-w-[30px]">{c.plans}</td>
              <td className="p-0.5 sm:p-2 align-middle border-r border-zinc-100">
                <span style={{ display: 'inline-flex', alignItems: 'center', textAlign: 'center', width: '100%' }} className="whitespace-nowrap">
                  <ChecklistIcons
                    checked={checklistStates[idx] || [false, false, false, false]}
                    onToggle={(checkIdx) => handleChecklistToggle(idx, checkIdx)}
                  />
                  <span className="text-gray-400 text-[9px] sm:text-xs whitespace-nowrap ml-1">
                    {(checklistStates[idx] || []).filter(Boolean).length}/4 Completed
                  </span>
                </span>
              </td>
              <td className="p-0.5 sm:p-2 align-middle">
                <span style={{ display: 'inline-block', textAlign: 'center', width: '100%' }}>
                  <button
                    type="button"
                    ref={el => { if (el) menuButtonRefs.current[idx] = el; }}
                    onClick={() => setOpenMenuIdx(openMenuIdx === idx ? null : idx)}
                    className="appearance-none w-7 h-7 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    aria-label="Open actions menu"
                  >
                    <MoreHorizontal className="w-3 h-3 text-gray-500" />
                  </button>
                  {openMenuIdx === idx && menuButtonRefs.current[idx] && (
                    <ClientActionsMenu
                      onClose={() => setOpenMenuIdx(null)}
                      onViewDetails={() => onViewDetails && onViewDetails(c)}
                      onDelete={() => {/* TODO: handle delete */}}
                      anchorRef={{ current: menuButtonRefs.current[idx]! }}
                    />
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
