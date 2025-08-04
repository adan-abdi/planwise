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
  apiClientId?: string; // Store the API client ID for fetching cases
}

export interface ClientListProps {
  clients: ClientItem[];
  onViewDetails?: (client: ClientItem) => void;
}

export default function ClientList({ clients, onViewDetails }: ClientListProps) {
  const [selectedRows, setSelectedRows] = useState<boolean[]>(clients.map(() => false));
  const { darkMode } = useTheme();

  const [sortState, setSortState] = useState<{ column: 'advisor' | 'client' | 'date' | null; order: 'asc' | 'desc' | null }>({ column: null, order: null });
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
        } else if (sortState.column === 'date') {
          aVal = a.date || '';
          bVal = b.date || '';
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

  const handleSort = (column: 'advisor' | 'client' | 'date') => {
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
    <div 
      className="overflow-x-auto w-full px-0 sm:pt-0 scrollbar-thin rounded-lg"
      style={{
        marginBottom: 0,
        background: darkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(15px) saturate(180%)',
        WebkitBackdropFilter: 'blur(15px) saturate(180%)',
        border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)'}`,
        boxShadow: darkMode 
          ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
          : '0 1px 3px 0 rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <table className="w-full text-[10px] sm:text-xs text-left border-collapse">
        <thead 
          className="text-zinc-700 font-semibold bg-gradient-to-r from-zinc-50 to-zinc-100 border-b border-zinc-200"
          style={{
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
            position: 'relative',
            zIndex: 1
          }}
        >
          <tr className="h-10 sm:h-12">
            <th className="p-2 align-middle border-r border-zinc-200 w-8 text-center">
              <button
                type="button"
                onClick={handleSelectAll}
                className="appearance-none w-4 h-4 rounded border-2 transition-all cursor-pointer flex items-center justify-center hover:scale-105 mx-auto"
                style={{ 
                  outline: 'none',
                  border: allSelected 
                    ? darkMode ? '2px solid #3b82f6' : '2px solid #2563eb'
                    : darkMode ? '2px solid #52525b' : '2px solid #d4d4d8',
                  backgroundColor: allSelected 
                    ? darkMode ? '#3b82f6' : '#2563eb'
                    : 'transparent'
                }}
              >
                {allSelected && (
                  <Check 
                    className="w-2.5 h-2.5 text-white" 
                  />
                )}
              </button>
            </th>
            <th className="p-2 align-middle border-r border-zinc-200 text-left select-none w-1/4">
              <button
                type="button"
                onClick={() => handleSort('advisor')}
                className="flex items-center gap-2 bg-transparent border-none p-0 m-0 hover:text-blue-600 focus:outline-none transition-colors font-semibold"
                style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}
              >
                Advisor Name
                <div className="flex flex-col">
                  {sortState.column === 'advisor' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3 text-blue-600" />}
                  {sortState.column === 'advisor' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3 text-blue-600" />}
                  {sortState.column !== 'advisor' && <ArrowUpDown className="w-3 h-3 text-zinc-400" />}
                </div>
              </button>
            </th>
            <th className="p-2 align-middle border-r border-zinc-200 text-left select-none w-1/4">
              <button
                type="button"
                onClick={() => handleSort('client')}
                className="flex items-center gap-2 bg-transparent border-none p-0 m-0 hover:text-blue-600 focus:outline-none transition-colors font-semibold"
                style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}
              >
                Client Name
                <div className="flex flex-col">
                  {sortState.column === 'client' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3 text-blue-600" />}
                  {sortState.column === 'client' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3 text-blue-600" />}
                  {sortState.column !== 'client' && <ArrowUpDown className="w-3 h-3 text-zinc-400" />}
                </div>
              </button>
            </th>
            <th className="p-2 align-middle border-r border-zinc-200 text-left select-none w-1/6">
              <button
                type="button"
                onClick={() => handleSort('date')}
                className="flex items-center gap-2 bg-transparent border-none p-0 m-0 hover:text-blue-600 focus:outline-none transition-colors font-semibold"
                style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}
              >
                Date
                <div className="flex flex-col">
                  {sortState.column === 'date' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3 text-blue-600" />}
                  {sortState.column === 'date' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3 text-blue-600" />}
                  {sortState.column !== 'date' && <ArrowUpDown className="w-3 h-3 text-zinc-400" />}
                </div>
              </button>
            </th>
            <th className="p-2 align-middle text-left font-semibold" style={{ color: darkMode ? 'var(--foreground)' : '#18181b', width: '120px', minWidth: '120px', maxWidth: '120px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedClients.map((c, idx) => (
            <tr
              key={idx}
              className={`border-b border-zinc-100 h-6 sm:h-6 transition-all duration-200 cursor-pointer
                ${selectedRows[idx]
                  ? (darkMode ? 'bg-blue-50/50' : 'bg-blue-50')
                  : 'bg-white hover:bg-zinc-50'}`}
              style={{
                backgroundColor: selectedRows[idx]
                  ? (darkMode ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff')
                  : '#ffffff'
              }}
              onMouseEnter={(e) => {
                if (!selectedRows[idx]) {
                  e.currentTarget.style.backgroundColor = darkMode ? 'rgba(39, 39, 42, 0.5)' : '#fafafa';
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedRows[idx]) {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }
              }}
              onClick={() => onViewDetails?.(c)}
            >
              <td className="p-2 align-middle border-r border-zinc-200 w-8 text-center" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => handleSelectRow(idx)}
                  className="appearance-none w-4 h-4 rounded border-2 transition-all cursor-pointer flex items-center justify-center hover:scale-105 mx-auto"
                  style={{ 
                    outline: 'none',
                    border: selectedRows[idx] 
                      ? darkMode ? '2px solid #3b82f6' : '2px solid #2563eb'
                      : darkMode ? '2px solid #52525b' : '2px solid #d4d4d8',
                    backgroundColor: selectedRows[idx] 
                      ? darkMode ? '#3b82f6' : '#2563eb'
                      : 'transparent'
                  }}
                >
                  {selectedRows[idx] && (
                    <Check 
                      className="w-2.5 h-2.5 text-white" 
                    />
                  )}
                </button>
              </td>
              <td className="p-2 align-middle border-r border-zinc-200">
                <div className="font-medium text-zinc-900">{c.advisor}</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-200">
                <div className="font-semibold text-zinc-900">{c.client}</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-200">
                <div className="text-zinc-600 text-xs">{c.date || 'N/A'}</div>
              </td>
              <td className="p-2 align-middle" style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails?.(c);
                  }}
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200"
                  style={{
                    background: darkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(15px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                    border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)'}`,
                    boxShadow: darkMode 
                      ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
                      : '0 1px 3px 0 rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                    color: darkMode ? 'var(--foreground)' : '#374151',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = darkMode ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)';
                    e.currentTarget.style.border = `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.4)'}`;
                    e.currentTarget.style.boxShadow = darkMode 
                      ? '0 2px 6px 0 rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
                      : '0 2px 6px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = darkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)';
                    e.currentTarget.style.border = `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)'}`;
                    e.currentTarget.style.boxShadow = darkMode 
                      ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
                      : '0 1px 3px 0 rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>View Cases</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderDarkTable = () => (
    <div 
      className="overflow-x-auto w-full px-0 sm:pt-0 scrollbar-thin rounded-lg"
      style={{
        marginBottom: 0,
        background: darkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(15px) saturate(180%)',
        WebkitBackdropFilter: 'blur(15px) saturate(180%)',
        border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)'}`,
        boxShadow: darkMode 
          ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
          : '0 1px 3px 0 rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <table className="w-full text-[10px] sm:text-xs text-left border-collapse text-[var(--foreground)]">
        <thead 
          className="text-[var(--foreground)] font-semibold bg-gradient-to-r from-zinc-800 to-zinc-900 border-b border-zinc-700"
          style={{
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.08)',
            position: 'relative',
            zIndex: 1
          }}
        >
          <tr className="h-10 sm:h-12">
            <th className="p-2 align-middle border-r border-zinc-700 w-8 text-center">
              <button
                type="button"
                onClick={handleSelectAll}
                className="appearance-none w-4 h-4 rounded border-2 transition-all cursor-pointer flex items-center justify-center hover:scale-105 mx-auto"
                style={{ 
                  outline: 'none',
                  border: allSelected 
                    ? '2px solid #3b82f6'
                    : '2px solid #52525b',
                  backgroundColor: allSelected 
                    ? '#3b82f6'
                    : 'transparent'
                }}
              >
                {allSelected && (
                  <Check 
                    className="w-2.5 h-2.5 text-white" 
                  />
                )}
              </button>
            </th>
            <th className="p-2 align-middle border-r border-zinc-700 text-left select-none w-1/4">
              <button
                type="button"
                onClick={() => handleSort('advisor')}
                className="flex items-center gap-2 bg-transparent border-none p-0 m-0 hover:text-blue-400 focus:outline-none transition-colors font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Advisor Name
                <div className="flex flex-col">
                  {sortState.column === 'advisor' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3 text-blue-400" />}
                  {sortState.column === 'advisor' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3 text-blue-400" />}
                  {sortState.column !== 'advisor' && <ArrowUpDown className="w-3 h-3 text-zinc-500" />}
                </div>
              </button>
            </th>
            <th className="p-2 align-middle border-r border-zinc-700 text-left select-none w-1/4">
              <button
                type="button"
                onClick={() => handleSort('client')}
                className="flex items-center gap-2 bg-transparent border-none p-0 m-0 hover:text-blue-400 focus:outline-none transition-colors font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Client Name
                <div className="flex flex-col">
                  {sortState.column === 'client' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3 text-blue-400" />}
                  {sortState.column === 'client' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3 text-blue-400" />}
                  {sortState.column !== 'client' && <ArrowUpDown className="w-3 h-3 text-zinc-500" />}
                </div>
              </button>
            </th>
            <th className="p-2 align-middle border-r border-zinc-700 text-left select-none w-1/6">
              <button
                type="button"
                onClick={() => handleSort('date')}
                className="flex items-center gap-2 bg-transparent border-none p-0 m-0 hover:text-blue-400 focus:outline-none transition-colors font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Date
                <div className="flex flex-col">
                  {sortState.column === 'date' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3 text-blue-400" />}
                  {sortState.column === 'date' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3 text-blue-400" />}
                  {sortState.column !== 'date' && <ArrowUpDown className="w-3 h-3 text-zinc-500" />}
                </div>
              </button>
            </th>
            <th className="p-2 align-middle text-left font-semibold" style={{ color: 'var(--foreground)', width: '120px', minWidth: '120px', maxWidth: '120px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedClients.map((c, idx) => (
            <tr
              key={idx}
              className={`border-b border-zinc-700 h-6 sm:h-6 transition-all duration-200 cursor-pointer`}
              style={{
                backgroundColor: selectedRows[idx]
                  ? 'rgba(59, 130, 246, 0.2)'
                  : 'rgba(39, 39, 42, 0.5)'
              }}
              onMouseEnter={(e) => {
                if (!selectedRows[idx]) {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
                }
              }}
              onMouseLeave={(e) => {
                if (!selectedRows[idx]) {
                  e.currentTarget.style.backgroundColor = 'rgba(39, 39, 42, 0.5)';
                }
              }}
              onClick={() => onViewDetails?.(c)}
            >
              <td className="p-2 align-middle border-r border-zinc-700 w-8 text-center" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => handleSelectRow(idx)}
                  className="appearance-none w-4 h-4 rounded border-2 transition-all cursor-pointer flex items-center justify-center hover:scale-105 mx-auto"
                  style={{ 
                    outline: 'none',
                    border: selectedRows[idx] 
                      ? '2px solid #3b82f6'
                      : '2px solid #52525b',
                    backgroundColor: selectedRows[idx] 
                      ? '#3b82f6'
                      : 'transparent'
                  }}
                >
                  {selectedRows[idx] && (
                    <Check 
                      className="w-2.5 h-2.5 text-white" 
                    />
                  )}
                </button>
              </td>
              <td className="p-2 align-middle border-r border-zinc-700">
                <div className="font-medium text-[var(--foreground)]">{c.advisor}</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-700">
                <div className="font-semibold text-[var(--foreground)]">{c.client}</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-700">
                <div className="text-zinc-400 text-xs">{c.date || 'N/A'}</div>
              </td>
              <td className="p-2 align-middle" style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails?.(c);
                  }}
                  className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200"
                  style={{
                    background: darkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(15px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                    border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)'}`,
                    boxShadow: darkMode 
                      ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
                      : '0 1px 3px 0 rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                    color: darkMode ? 'var(--foreground)' : '#374151',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = darkMode ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 1)';
                    e.currentTarget.style.border = `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.4)'}`;
                    e.currentTarget.style.boxShadow = darkMode 
                      ? '0 2px 6px 0 rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
                      : '0 2px 6px 0 rgba(31, 38, 135, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = darkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)';
                    e.currentTarget.style.border = `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)'}`;
                    e.currentTarget.style.boxShadow = darkMode 
                      ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
                      : '0 1px 3px 0 rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <span>View Cases</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return darkMode ? renderDarkTable() : renderLightTable();
}
