import React from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, Check, MoreHorizontal } from "lucide-react";
import type { Case } from "../ClientDetails";

interface CasesTableProps {
  cases: Case[];
  selectedRows: boolean[];
  onSelectRow: (idx: number) => void;
  onSelectAll: (selected: boolean) => void;
  onSort: (column: string) => void;
  sortState: { column: string | null; order: 'asc' | 'desc' | null };
  onAction: (rowIdx: number, event: React.MouseEvent) => void;
  pageSize: number;
  currentPage: number;
  darkMode: boolean;
}

// Helper to format date as '7th June 2025'
function formatFancyDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  // Ordinal suffix
  const j = day % 10, k = day % 100;
  let suffix = 'th';
  if (j === 1 && k !== 11) suffix = 'st';
  else if (j === 2 && k !== 12) suffix = 'nd';
  else if (j === 3 && k !== 13) suffix = 'rd';
  return `${day}${suffix} ${month} ${year}`;
}

export default function CasesTable({ cases, selectedRows, onSelectRow, onSelectAll, onSort, sortState, onAction, pageSize, currentPage, darkMode }: CasesTableProps) {

  // Calculate if all visible rows are selected
  const visibleRows = cases.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const allSelected = visibleRows.length > 0 && visibleRows.every((_, idx) => selectedRows[(currentPage - 1) * pageSize + idx]);
  const someSelected = visibleRows.some((_, idx) => selectedRows[(currentPage - 1) * pageSize + idx]);

  const handleSelectAll = () => {
    onSelectAll(!allSelected);
  };

  const renderLightTable = () => (
    <div className="overflow-x-auto w-full px-0 sm:pt-0 scrollbar-thin border border-zinc-200 rounded-lg bg-white" style={{marginBottom: 0}}>
      <table className="w-full text-[10px] sm:text-xs text-left border-collapse">
        <thead className="text-zinc-700 font-semibold bg-gradient-to-r from-zinc-50 to-zinc-100 border-b border-zinc-200">
          <tr className="h-10 sm:h-12">
            <th className="p-2 align-middle border-r border-zinc-200 w-10 text-center">
              <button
                type="button"
                onClick={handleSelectAll}
                className="appearance-none w-4 h-4 rounded border-2 transition-all cursor-pointer flex items-center justify-center hover:scale-105 mx-auto"
                style={{ 
                  outline: 'none',
                  border: allSelected 
                    ? '2px solid #2563eb'
                    : '2px solid #d4d4d8',
                  backgroundColor: allSelected 
                    ? '#2563eb'
                    : 'transparent'
                }}
              >
                {allSelected && (
                  <Check 
                    className="w-2.5 h-2.5 text-white" 
                  />
                )}
                {!allSelected && someSelected && (
                  <div className="w-2.5 h-0.5 bg-gray-400 rounded"></div>
                )}
              </button>
            </th>
            <th className="p-2 align-middle border-r border-zinc-200 text-left select-none">
              <button
                type="button"
                onClick={() => onSort('date')}
                className="flex items-center gap-2 bg-transparent border-none p-0 m-0 hover:text-blue-600 focus:outline-none transition-colors font-semibold"
                style={{ color: '#18181b' }}
              >
                Date Added
                <div className="flex flex-col">
                  {sortState.column === 'date' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3 text-blue-600" />}
                  {sortState.column === 'date' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3 text-blue-600" />}
                  {sortState.column !== 'date' && <ArrowUpDown className="w-3 h-3 text-zinc-400" />}
                </div>
              </button>
            </th>
            <th className="p-2 align-middle border-r border-zinc-200 text-left font-semibold">Type of Case</th>
            <th className="p-2 align-middle border-r border-zinc-200 text-left font-semibold" style={{ width: 80, minWidth: 60, maxWidth: 100 }}>No. of Transfers</th>
            <th className="p-2 align-middle border-r border-zinc-200 text-left select-none">
              <button
                type="button"
                onClick={() => onSort('provider')}
                className="flex items-center gap-2 bg-transparent border-none p-0 m-0 hover:text-blue-600 focus:outline-none transition-colors font-semibold"
                style={{ color: '#18181b' }}
              >
                Provider
                <div className="flex flex-col">
                  {sortState.column === 'provider' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3 text-blue-600" />}
                  {sortState.column === 'provider' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3 text-blue-600" />}
                  {sortState.column !== 'provider' && <ArrowUpDown className="w-3 h-3 text-zinc-400" />}
                </div>
              </button>
            </th>
            <th className="p-2 align-middle border-r border-zinc-200 text-left font-semibold">CFR</th>
            <th className="p-2 align-middle border-r border-zinc-200 text-left font-semibold">Ceding</th>
            <th className="p-2 align-middle border-r border-zinc-200 text-left font-semibold">CYC</th>
            <th className="p-2 align-middle border-r border-zinc-200 text-left font-semibold">Illustration</th>
            <th className="p-2 align-middle border-r border-zinc-200 text-left font-semibold">SL</th>
            <th className="p-2 align-middle border-r border-zinc-200 text-left select-none">
              <button
                type="button"
                onClick={() => onSort('status')}
                className="flex items-center gap-2 bg-transparent border-none p-0 m-0 hover:text-blue-600 focus:outline-none transition-colors font-semibold"
                style={{ color: '#18181b' }}
              >
                Status
                <div className="flex flex-col">
                  {sortState.column === 'status' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3 text-blue-600" />}
                  {sortState.column === 'status' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3 text-blue-600" />}
                  {sortState.column !== 'status' && <ArrowUpDown className="w-3 h-3 text-zinc-400" />}
                </div>
              </button>
            </th>
            <th className="p-2 align-middle text-left font-semibold w-8">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cases.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((caseObj, rowIdx) => (
            <tr
              key={caseObj.id}
              className={`border-b border-zinc-100 h-7 sm:h-7 transition-all duration-200 cursor-pointer
                ${selectedRows[rowIdx]
                  ? 'bg-blue-50'
                  : 'bg-white hover:bg-zinc-50'}`}
            >
              <td className="p-2 align-middle border-r border-zinc-200 w-10 text-center" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => onSelectRow(rowIdx)}
                  className="appearance-none w-4 h-4 rounded border-2 transition-all cursor-pointer flex items-center justify-center hover:scale-105 mx-auto"
                  style={{ 
                    outline: 'none',
                    border: selectedRows[rowIdx] 
                      ? '2px solid #2563eb'
                      : '2px solid #d4d4d8',
                    backgroundColor: selectedRows[rowIdx] 
                      ? '#2563eb'
                      : 'transparent'
                  }}
                >
                  {selectedRows[rowIdx] && (
                    <Check 
                      className="w-2.5 h-2.5 text-white" 
                    />
                  )}
                </button>
              </td>
              <td className="p-2 align-middle border-r border-zinc-200">
                <div className="text-zinc-600 text-xs">{formatFancyDate(caseObj.createdAt)}</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-200">
                <div className="font-semibold text-zinc-900">{caseObj.caseType}</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-200" style={{ width: 80, minWidth: 60, maxWidth: 100 }}>
                <div className="text-zinc-600 text-xs">{caseObj.transfers.length}</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-200" style={{ maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <div className="text-zinc-600 text-xs">
                  {(() => {
                    const uniqueProviders = Array.from(new Set(caseObj.transfers.map((t: Case['transfers'][0]) => t.provider)));
                    if (uniqueProviders.length <= 2) {
                      return uniqueProviders.join(', ');
                    } else {
                      return `${uniqueProviders.slice(0, 2).join(', ')} +${uniqueProviders.length - 2} more`;
                    }
                  })()}
                </div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-200">
                <div className="text-zinc-600 text-xs">-</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-200">
                <div className="text-zinc-600 text-xs">-</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-200">
                <div className="text-zinc-600 text-xs">-</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-200">
                <div className="text-zinc-600 text-xs">-</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-200">
                <div className="text-zinc-600 text-xs">-</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-200">
                <div className="text-zinc-600 text-xs">Pending</div>
              </td>
              <td className="p-2 align-middle">
                <button
                  type="button"
                  className="p-1 rounded hover:bg-zinc-100"
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
  );

  const renderDarkTable = () => (
    <div className="overflow-x-auto w-full px-0 sm:pt-0 scrollbar-thin border border-zinc-700 rounded-lg bg-[var(--background)]" style={{marginBottom: 0}}>
      <table className="w-full text-[10px] sm:text-xs text-left border-collapse text-[var(--foreground)]">
        <thead className="text-[var(--foreground)] font-semibold bg-gradient-to-r from-zinc-800 to-zinc-900 border-b border-zinc-700">
          <tr className="h-10 sm:h-12">
            <th className="p-2 align-middle border-r border-zinc-700 w-10 text-center">
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
                {!allSelected && someSelected && (
                  <div className="w-2.5 h-0.5 bg-gray-400 rounded"></div>
                )}
              </button>
            </th>
            <th className="p-2 align-middle border-r border-zinc-700 text-left select-none">
              <button
                type="button"
                onClick={() => onSort('date')}
                className="flex items-center gap-2 bg-transparent border-none p-0 m-0 hover:text-blue-400 focus:outline-none transition-colors font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Date Added
                <div className="flex flex-col">
                  {sortState.column === 'date' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3 text-blue-400" />}
                  {sortState.column === 'date' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3 text-blue-400" />}
                  {sortState.column !== 'date' && <ArrowUpDown className="w-3 h-3 text-zinc-500" />}
                </div>
              </button>
            </th>
            <th className="p-2 align-middle border-r border-zinc-700 text-left font-semibold">Type of Case</th>
            <th className="p-2 align-middle border-r border-zinc-700 text-left font-semibold" style={{ width: 80, minWidth: 60, maxWidth: 100 }}>No. of Transfers</th>
            <th className="p-2 align-middle border-r border-zinc-700 text-left select-none">
              <button
                type="button"
                onClick={() => onSort('provider')}
                className="flex items-center gap-2 bg-transparent border-none p-0 m-0 hover:text-blue-400 focus:outline-none transition-colors font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Provider
                <div className="flex flex-col">
                  {sortState.column === 'provider' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3 text-blue-400" />}
                  {sortState.column === 'provider' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3 text-blue-400" />}
                  {sortState.column !== 'provider' && <ArrowUpDown className="w-3 h-3 text-zinc-500" />}
                </div>
              </button>
            </th>
            <th className="p-2 align-middle border-r border-zinc-700 text-left font-semibold">CFR</th>
            <th className="p-2 align-middle border-r border-zinc-700 text-left font-semibold">Ceding</th>
            <th className="p-2 align-middle border-r border-zinc-700 text-left font-semibold">CYC</th>
            <th className="p-2 align-middle border-r border-zinc-700 text-left font-semibold">Illustration</th>
            <th className="p-2 align-middle border-r border-zinc-700 text-left font-semibold">SL</th>
            <th className="p-2 align-middle border-r border-zinc-700 text-left select-none">
              <button
                type="button"
                onClick={() => onSort('status')}
                className="flex items-center gap-2 bg-transparent border-none p-0 m-0 hover:text-blue-400 focus:outline-none transition-colors font-semibold"
                style={{ color: 'var(--foreground)' }}
              >
                Status
                <div className="flex flex-col">
                  {sortState.column === 'status' && sortState.order === 'asc' && <ArrowUp className="w-3 h-3 text-blue-400" />}
                  {sortState.column === 'status' && sortState.order === 'desc' && <ArrowDown className="w-3 h-3 text-blue-400" />}
                  {sortState.column !== 'status' && <ArrowUpDown className="w-3 h-3 text-zinc-500" />}
                </div>
              </button>
            </th>
            <th className="p-2 align-middle text-left font-semibold w-8">Actions</th>
          </tr>
        </thead>
        <tbody>
          {cases.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((caseObj, rowIdx) => (
            <tr
              key={caseObj.id}
              className={`border-b border-zinc-700 h-7 sm:h-7 transition-all duration-200 cursor-pointer
                ${selectedRows[rowIdx]
                  ? 'bg-blue-900/20'
                  : 'bg-[var(--background)] hover:bg-zinc-800/50'}`}
            >
              <td className="p-2 align-middle border-r border-zinc-700 w-10 text-center" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  onClick={() => onSelectRow(rowIdx)}
                  className="appearance-none w-4 h-4 rounded border-2 transition-all cursor-pointer flex items-center justify-center hover:scale-105 mx-auto"
                  style={{ 
                    outline: 'none',
                    border: selectedRows[rowIdx] 
                      ? '2px solid #3b82f6'
                      : '2px solid #52525b',
                    backgroundColor: selectedRows[rowIdx] 
                      ? '#3b82f6'
                      : 'transparent'
                  }}
                >
                  {selectedRows[rowIdx] && (
                    <Check 
                      className="w-2.5 h-2.5 text-white" 
                    />
                  )}
                </button>
              </td>
              <td className="p-2 align-middle border-r border-zinc-700">
                <div className="text-zinc-400 text-xs">{formatFancyDate(caseObj.createdAt)}</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-700">
                <div className="font-semibold text-[var(--foreground)]">{caseObj.caseType}</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-700" style={{ width: 80, minWidth: 60, maxWidth: 100 }}>
                <div className="text-zinc-400 text-xs">{caseObj.transfers.length}</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-700" style={{ maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <div className="text-zinc-400 text-xs">
                  {(() => {
                    const uniqueProviders = Array.from(new Set(caseObj.transfers.map((t: Case['transfers'][0]) => t.provider)));
                    if (uniqueProviders.length <= 2) {
                      return uniqueProviders.join(', ');
                    } else {
                      return `${uniqueProviders.slice(0, 2).join(', ')} +${uniqueProviders.length - 2} more`;
                    }
                  })()}
                </div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-700">
                <div className="text-zinc-400 text-xs">-</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-700">
                <div className="text-zinc-400 text-xs">-</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-700">
                <div className="text-zinc-400 text-xs">-</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-700">
                <div className="text-zinc-400 text-xs">-</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-700">
                <div className="text-zinc-400 text-xs">-</div>
              </td>
              <td className="p-2 align-middle border-r border-zinc-700">
                <div className="text-zinc-400 text-xs">Pending</div>
              </td>
              <td className="p-2 align-middle">
                <button
                  type="button"
                  className="p-1 rounded hover:bg-zinc-800/50"
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
  );

  return darkMode ? renderDarkTable() : renderLightTable();
} 