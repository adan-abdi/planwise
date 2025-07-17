import React, { useState, useRef, useEffect } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, Check, MoreHorizontal, ChevronDown } from "lucide-react";
import type { Case } from "../ClientDetails";

interface CasesTableProps {
  cases: Case[];
  selectedRows: boolean[];
  onSelectRow: (idx: number) => void;
  onSort: (column: string) => void;
  sortState: { column: string | null; order: 'asc' | 'desc' | null };
  onAction: (rowIdx: number, event: React.MouseEvent) => void;
  pageSize: number;
  currentPage: number;
  darkMode: boolean;
  onSearch: (value: string) => void;
  searchValue: string;
  onFilterChange: (value: string) => void;
  filterValue: string;
}

export default function CasesTable({ cases, selectedRows, onSelectRow, onSort, sortState, onAction, pageSize, currentPage, darkMode, onSearch, searchValue, onFilterChange, filterValue }: CasesTableProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const filterOptions = [
    "All",
    "Pension Transfer",
    "ISA Transfer",
    "Pension New Money",
    "ISA New Money",
  ];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    }
    if (filterOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [filterOpen]);

  return (
    <div className="p-3 sm:p-4">
      <div className="mb-2 flex items-center justify-between gap-2 flex-wrap">
        <span className="text-base font-semibold" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>Cases</span>
        <div className="flex items-center gap-2 ml-auto">
          {/* Custom filter dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              type="button"
              className={`flex items-center border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition justify-between ${filterOpen ? 'ring-2 ring-blue-500' : ''}`}
              style={{
                minWidth: 180,
                maxWidth: 240,
                width: '100%',
                borderColor: darkMode ? '#3f3f46' : '#e4e4e7',
                background: darkMode ? 'var(--background)' : '#fff',
                color: darkMode ? 'var(--foreground)' : '#18181b',
              }}
              onClick={() => setFilterOpen(v => !v)}
              aria-haspopup="listbox"
              aria-expanded={filterOpen}
              tabIndex={0}
            >
              <span className="truncate text-left w-full" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>{filterValue}</span>
              <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" style={{ color: darkMode ? '#a1a1aa' : '#71717a' }} />
            </button>
            {filterOpen && (
              <div
                className="absolute z-10 mt-1 border rounded shadow-lg"
                style={{
                  minWidth: 180,
                  maxWidth: 240,
                  width: '100%',
                  borderColor: darkMode ? '#3f3f46' : '#e4e4e7',
                  background: darkMode ? 'var(--background)' : '#fff',
                }}
              >
                {filterOptions.map(option => (
                  <button
                    key={option}
                    type="button"
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-zinc-800 ${option === filterValue ? 'font-semibold' : ''}`}
                    style={{
                      color: option === filterValue
                        ? (darkMode ? '#60a5fa' : '#2563eb')
                        : (darkMode ? 'var(--foreground)' : '#18181b'),
                      background: darkMode ? 'var(--background)' : '#fff',
                    }}
                    onClick={() => { onFilterChange(option); setFilterOpen(false); }}
                    tabIndex={0}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={e => onSearch(e.target.value)}
            placeholder="Search cases..."
            className="border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              minWidth: 260,
              maxWidth: 400,
              borderColor: darkMode ? '#3f3f46' : '#e4e4e7',
              background: darkMode ? 'var(--background)' : '#fff',
              color: darkMode ? 'var(--foreground)' : '#18181b',
            }}
          />
        </div>
      </div>
      <div
        className="border rounded-[4px] bg-white dark:bg-[var(--background)]"
        style={{
          boxSizing: 'border-box',
          borderColor: darkMode ? '#3f3f46' : '#e4e4e7',
        }}
      >
        <table className="w-full text-xs text-left border-collapse">
          <thead
            className="text-zinc-700 dark:text-[var(--foreground)] font-semibold bg-zinc-50 dark:bg-[var(--muted)] border-b shadow-xs rounded-t-md"
            style={{ borderBottomColor: darkMode ? '#3f3f46' : '#e4e4e7' }}
          >
            <tr className="h-10">
              <th className="p-2 align-middle border-r w-10 text-center"
                  style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>Select</th>
              <th className="p-2 align-middle border-r select-none" style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7', cursor: 'pointer' }}>
                <button
                  type="button"
                  onClick={() => onSort('date')}
                  className="flex items-center gap-1 bg-transparent border-none p-0 m-0 hover:underline focus:outline-none"
                  style={{ color: darkMode ? 'var(--foreground)' : '#18181b', fontWeight: 600 }}
                >
                  Date Added
                  {sortState.column === 'date' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3" />}
                  {sortState.column === 'date' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3" />}
                  {sortState.column !== 'date' && <ArrowUpDown className="w-3 h-3" />}
                </button>
              </th>
              <th className="p-2 align-middle border-r"
                  style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>Type of Case</th>
              <th className="p-2 align-middle border-r"
                  style={{ width: 80, minWidth: 60, maxWidth: 100, borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>No. of Transfers</th>
              <th className="p-2 align-middle border-r select-none" style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7', cursor: 'pointer' }}>
                <button
                  type="button"
                  onClick={() => onSort('provider')}
                  className="flex items-center gap-1 bg-transparent border-none p-0 m-0 hover:underline focus:outline-none"
                  style={{ color: darkMode ? 'var(--foreground)' : '#18181b', fontWeight: 600 }}
                >
                  Provider
                  {sortState.column === 'provider' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3" />}
                  {sortState.column === 'provider' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3" />}
                  {sortState.column !== 'provider' && <ArrowUpDown className="w-3 h-3" />}
                </button>
              </th>
              <th className="p-2 align-middle border-r"
                  style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>CFR</th>
              <th className="p-2 align-middle border-r"
                  style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>Ceding</th>
              <th className="p-2 align-middle border-r"
                  style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>CYC</th>
              <th className="p-2 align-middle border-r"
                  style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>Illustration</th>
              <th className="p-2 align-middle border-r"
                  style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>SL</th>
              <th className="p-2 align-middle select-none border-r" style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7', cursor: 'pointer' }}>
                <button
                  type="button"
                  onClick={() => onSort('status')}
                  className="flex items-center gap-1 bg-transparent border-none p-0 m-0 hover:underline focus:outline-none"
                  style={{ color: darkMode ? 'var(--foreground)' : '#18181b', fontWeight: 600 }}
                >
                  Status
                  {sortState.column === 'status' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3" />}
                  {sortState.column === 'status' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3" />}
                  {sortState.column !== 'status' && <ArrowUpDown className="w-3 h-3" />}
                </button>
              </th>
              <th className="p-2 align-middle"
                  style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cases.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((caseObj, rowIdx) => (
              <tr
                key={caseObj.id}
                className={`border-b h-9
                  ${selectedRows[rowIdx]
                    ? (darkMode ? 'bg-[rgba(59,130,246,0.12)]' : 'bg-blue-50')
                    : (darkMode ? 'bg-[var(--background)]' : 'bg-white')}
                  hover:bg-blue-50${darkMode ? ' dark:hover:bg-[rgba(59,130,246,0.12)]' : ''}`}
                style={{ borderBottomColor: darkMode ? '#3f3f46' : '#e4e4e7' }}
              >
                <td className="p-2 align-middle border-r w-10 text-center"
                    style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>
                  <button
                    type="button"
                    onClick={() => onSelectRow(rowIdx)}
                    className="appearance-none w-4 h-4 rounded-[4px] border transition-all align-middle cursor-pointer flex items-center justify-center shadow-none"
                    style={{
                      outline: 'none',
                      border: selectedRows[rowIdx]
                        ? darkMode ? '1px solid #3b82f6' : '1px solid #2563eb'
                        : darkMode ? '1px solid #3f3f46' : '1px solid #e4e4e7',
                      backgroundColor: selectedRows[rowIdx]
                        ? darkMode ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.07)'
                        : darkMode ? 'var(--background)' : '#ffffff',
                    }}
                  >
                    {selectedRows[rowIdx] && (
                      <Check className="w-3 h-3" style={{ color: darkMode ? '#3b82f6' : '#2563eb' }} />
                    )}
                  </button>
                </td>
                <td className="p-2 align-middle border-r"
                    style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>{new Date(caseObj.createdAt).toLocaleDateString()}</td>
                <td className="p-2 align-middle border-r"
                    style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>{caseObj.caseType}</td>
                <td className="p-2 align-middle border-r"
                    style={{ width: 80, minWidth: 60, maxWidth: 100, borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>
                  {caseObj.transfers.length}
                </td>
                <td className="p-2 align-middle border-r"
                    style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7', maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {(() => {
                    const uniqueProviders = Array.from(new Set(caseObj.transfers.map((t: Case['transfers'][0]) => t.provider)));
                    if (uniqueProviders.length <= 2) {
                      return uniqueProviders.join(', ');
                    } else {
                      return `${uniqueProviders.slice(0, 2).join(', ')} +${uniqueProviders.length - 2} more`;
                    }
                  })()}
                </td>
                <td className="p-2 align-middle border-r"
                    style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>-</td>
                <td className="p-2 align-middle border-r"
                    style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>-</td>
                <td className="p-2 align-middle border-r"
                    style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>-</td>
                <td className="p-2 align-middle border-r"
                    style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>-</td>
                <td className="p-2 align-middle border-r"
                    style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>-</td>
                <td className="p-2 align-middle border-r"
                    style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>Pending</td>
                <td className="p-2 align-middle"
                    style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    onClick={e => onAction(rowIdx, e)}
                  >
                    <MoreHorizontal className="w-5 h-5 text-zinc-400" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 