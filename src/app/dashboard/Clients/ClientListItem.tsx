import { Check } from 'lucide-react'
import { useState, useEffect } from 'react';
import { useTheme } from '../../../theme-context';
import { ArrowUpDown, ArrowDown, ArrowUp } from 'lucide-react';

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

export interface ClientListProps {
  clients: ClientItem[];
  onViewDetails?: (client: ClientItem) => void;
}

export default function ClientList({ clients, onViewDetails }: ClientListProps) {
  const [selectedRows, setSelectedRows] = useState<boolean[]>(clients.map(() => false));
  const { darkMode } = useTheme();

  const [sortState, setSortState] = useState<{ column: 'advisor' | 'client' | null; order: 'asc' | 'desc' | null }>({ column: null, order: null });
  const [sortedClients, setSortedClients] = useState<ClientItem[]>(clients);

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

  useEffect(() => {
    const sorted = [...clients];
    if (sortState.column && sortState.order) {
      sorted.sort((a, b) => {
        let aVal = '';
        let bVal = '';
        if (sortState.column === 'advisor') {
          aVal = a.advisor?.toLowerCase() || '';
          bVal = b.advisor?.toLowerCase() || '';
        } else if (sortState.column === 'client') {
          aVal = a.client?.toLowerCase() || '';
          bVal = b.client?.toLowerCase() || '';
        }
        if (aVal < bVal) return sortState.order === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortState.order === 'asc' ? 1 : -1;
        return 0;
      });
    }
    setSortedClients(sorted);
  }, [clients, sortState]);

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

  const handleSort = (column: 'advisor' | 'client') => {
    setSortState((prev) => {
      if (prev.column === column) {
        // Toggle order
        return { column, order: prev.order === 'asc' ? 'desc' : 'asc' };
      } else {
        // Start with ascending for new column
        return { column, order: 'asc' };
      }
    });
  };

  const renderLightTable = () => (
    <div className="overflow-x-auto w-full px-0 mt-4 sm:mt-0 sm:pt-0 scrollbar-thin border border-zinc-200 rounded-lg bg-white" style={{marginBottom: 0}}>
      <table className="w-full text-[10px] sm:text-xs text-left border-collapse">
        <thead className="text-zinc-700 font-semibold bg-zinc-50 border-b border-zinc-200 shadow-xs rounded-t-md">
          <tr className="h-8 sm:h-10">
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-100">
              <button
                type="button"
                onClick={handleSelectAll}
                className="appearance-none w-3 h-3 rounded-[4px] border transition-all align-middle cursor-pointer flex items-center justify-center shadow-none"
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
                    className="w-2 h-2" 
                    style={{ color: darkMode ? '#3b82f6' : '#2563eb' }}
                  />
                )}
              </button>
            </th>
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-100 text-left select-none" style={{ color: darkMode ? 'var(--foreground)' : '#18181b', cursor: 'pointer' }}>
              <button
                type="button"
                onClick={() => handleSort('advisor')}
                className="flex items-center gap-1 bg-transparent border-none p-0 m-0 hover:underline focus:outline-none"
                style={{ color: darkMode ? 'var(--foreground)' : '#18181b', fontWeight: 600 }}
              >
                Advisor Name
                {sortState.column === 'advisor' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3" />}
                {sortState.column === 'advisor' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3" />}
                {sortState.column !== 'advisor' && <ArrowUpDown className="w-3 h-3" />}
              </button>
            </th>
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-100 text-left select-none" style={{ color: darkMode ? 'var(--foreground)' : '#18181b', cursor: 'pointer' }}>
              <button
                type="button"
                onClick={() => handleSort('client')}
                className="flex items-center gap-1 bg-transparent border-none p-0 m-0 hover:underline focus:outline-none"
                style={{ color: darkMode ? 'var(--foreground)' : '#18181b', fontWeight: 600 }}
              >
                Client Name
                {sortState.column === 'client' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3" />}
                {sortState.column === 'client' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3" />}
                {sortState.column !== 'client' && <ArrowUpDown className="w-3 h-3" />}
              </button>
            </th>
            <th className="p-2 sm:p-2 align-middle text-left" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedClients.map((c, idx) => (
            <tr
              key={idx}
              className={`border-b border-zinc-100 h-7 sm:h-9
                ${selectedRows[idx]
                  ? (darkMode ? 'bg-[rgba(59,130,246,0.12)]' : 'bg-blue-50')
                  : 'bg-white'}
                hover:bg-blue-50${darkMode ? ' dark:hover:bg-[rgba(59,130,246,0.12)]' : ''}`}
            >
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-100">
                <button
                  type="button"
                  onClick={() => handleSelectRow(idx)}
                  className="appearance-none w-3 h-3 rounded-[4px] border transition-all align-middle cursor-pointer flex items-center justify-center shadow-none"
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
                      className="w-2 h-2" 
                      style={{ color: darkMode ? '#3b82f6' : '#2563eb' }}
                    />
                  )}
                </button>
              </td>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-100 truncate max-w-[60px]">{c.advisor}</td>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-100">
                <span className="font-medium ml-1 align-middle inline-block" style={{ verticalAlign: 'middle' }}>{c.client}</span>
              </td>
              <td className="p-2 sm:p-2 align-middle">
                <span style={{ display: 'inline-block', textAlign: 'center', width: '100%' }}>
                  <button
                    type="button"
                    onClick={() => onViewDetails && onViewDetails(c)}
                    className="flex items-center gap-1 border border-zinc-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-normal bg-white dark:bg-[var(--muted)] text-zinc-700 dark:text-[var(--foreground)] transition"
                    style={{
                      backgroundColor: darkMode ? 'var(--muted)' : 'white',
                      borderColor: darkMode ? 'var(--border)' : '#e5e7eb'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
                    }}
                  >
                    View Cases
                  </button>
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
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-600">
              <button
                type="button"
                onClick={handleSelectAll}
                className="appearance-none w-3 h-3 rounded-[4px] border transition-all align-middle cursor-pointer flex items-center justify-center shadow-none"
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
                    className="w-2 h-2" 
                    style={{ color: darkMode ? '#3b82f6' : '#2563eb' }}
                  />
                )}
              </button>
            </th>
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-600 text-left select-none" style={{ color: darkMode ? 'var(--foreground)' : '#18181b', cursor: 'pointer' }}>
              <button
                type="button"
                onClick={() => handleSort('advisor')}
                className="flex items-center gap-1 bg-transparent border-none p-0 m-0 hover:underline focus:outline-none"
                style={{ color: darkMode ? 'var(--foreground)' : '#18181b', fontWeight: 600 }}
              >
                Advisor Name
                {sortState.column === 'advisor' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3" />}
                {sortState.column === 'advisor' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3" />}
                {sortState.column !== 'advisor' && <ArrowUpDown className="w-3 h-3" />}
              </button>
            </th>
            <th className="p-2 sm:p-2 align-middle border-r border-zinc-600 text-left select-none" style={{ color: darkMode ? 'var(--foreground)' : '#18181b', cursor: 'pointer' }}>
              <button
                type="button"
                onClick={() => handleSort('client')}
                className="flex items-center gap-1 bg-transparent border-none p-0 m-0 hover:underline focus:outline-none"
                style={{ color: darkMode ? 'var(--foreground)' : '#18181b', fontWeight: 600 }}
              >
                Client Name
                {sortState.column === 'client' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3" />}
                {sortState.column === 'client' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3" />}
                {sortState.column !== 'client' && <ArrowUpDown className="w-3 h-3" />}
              </button>
            </th>
            <th className="p-2 sm:p-2 align-middle text-left" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedClients.map((c, idx) => (
            <tr
              key={idx}
              className={`border-b border-zinc-700 h-7 sm:h-9
                ${selectedRows[idx]
                  ? (darkMode ? 'bg-[rgba(59,130,246,0.12)]' : 'bg-[rgba(59,130,246,0.07)]')
                  : 'bg-[var(--background)]'}
                hover:bg-[rgba(59,130,246,0.07)]${darkMode ? ' dark:hover:bg-[rgba(59,130,246,0.12)]' : ''}`}
            >
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-600">
                <button
                  type="button"
                  onClick={() => handleSelectRow(idx)}
                  className="appearance-none w-3 h-3 rounded-[4px] border transition-all align-middle cursor-pointer flex items-center justify-center shadow-none"
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
                      className="w-2 h-2" 
                      style={{ color: darkMode ? '#3b82f6' : '#2563eb' }}
                    />
                  )}
                </button>
              </td>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-600 truncate max-w-[60px] text-[var(--foreground)]">{c.advisor}</td>
              <td className="p-2 sm:p-2 align-middle border-r border-zinc-600 text-[var(--foreground)]">
                <span className="font-medium ml-1 align-middle inline-block text-[var(--foreground)]" style={{ verticalAlign: 'middle' }}>{c.client}</span>
              </td>
              <td className="p-2 sm:p-2 align-middle">
                <span style={{ display: 'inline-block', textAlign: 'center', width: '100%' }}>
                  <button
                    type="button"
                    onClick={() => onViewDetails && onViewDetails(c)}
                    className="flex items-center gap-1 border border-zinc-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-normal bg-white dark:bg-[var(--muted)] text-zinc-700 dark:text-[var(--foreground)] transition"
                    style={{
                      backgroundColor: darkMode ? 'var(--muted)' : 'white',
                      borderColor: darkMode ? 'var(--border)' : '#e5e7eb'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
                    }}
                  >
                    View Cases
                  </button>
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
