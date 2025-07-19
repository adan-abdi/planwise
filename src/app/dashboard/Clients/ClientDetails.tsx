import React, { useState, useEffect } from "react";
import type { TransferFolderItem } from "./FileExplorer";
import type { ClientItem as OriginalClientItem } from "./ClientListItem";
import {
  Users,
  UserCircle,
  FileText,
  FolderTree,
  X,
  Check,
  PlusCircle,
  Grid2x2Check,
  ArrowUpDown,
  Filter as FilterIcon,
  Search as SearchIcon,
  ChevronDown,
} from "lucide-react";
import UploadModal from "./UploadModal";
import { useTheme } from "../../../theme-context";
import CreateNewCase from './CreateNewCase';
import ClientFooter from "./ClientFooter";
import type { Dispatch, SetStateAction } from 'react';
import CasesTable from './ClientDetails/CasesTable';
import CaseDetailsView from './ClientDetails/CaseDetailsView';
import EmptyCasesState from './ClientDetails/EmptyCasesState';
import EditableRow from './ClientDetails/EditableRow';
import CaseActionModal from './ClientDetails/CaseActionModal';
import DeleteCaseModal from './ClientDetails/DeleteCaseModal';
import { generatePensionNewMoneyStructure, generateIsaNewMoneyStructure } from './ClientDetails/pensionNewMoneyStructure';

interface ClientDetailsProps {
  client: OriginalClientItem;
  onClientUpdate: (updated: OriginalClientItem) => void;
  checklist?: boolean[];
  onChecklistChange?: (newChecklist: boolean[]) => void;
  onTabChange?: (tab: string) => void;
  onShowChecklistReviewTest?: () => void;
  onDocumentOpen?: (open: boolean) => void;
  onBackToClientList?: () => void;
  transferPath?: string[];
  casesCurrentPage: number;
  setCasesCurrentPage: Dispatch<SetStateAction<number>>;
  onCaseView?: (caseType: string) => void;
  viewingCaseIdx: number | null;
  setViewingCaseIdx: (idx: number | null) => void;
}

type TransferType = "pension" | "isa" | null;

// 1. Define a new Case type: unique by createdAt, one caseType, multiple transfers/providers
type Transfer = {
  transferType: 'pensionTransfer' | 'isaTransfer' | 'pensionNewMoney' | 'isaNewMoney';
  amount?: number;
  provider: string;
  isaType?: 'stocksAndShares' | 'cashIsa'; // <-- add this
};
export type { Transfer };

interface Case {
  id: string;
  createdAt: string;
  caseType: string; // e.g. 'Pension', 'ISA', etc.
  transfers: Transfer[];
  single?: { checked: boolean; type: 'personal' | 'employer' | null };
  regular?: { checked: boolean; type: 'personal' | 'employer' | null };
  ess?: boolean;
  essPartial?: boolean;
}
export type { Case };

// Extend ClientItem to allow 'cases' property
type ClientItem = OriginalClientItem & { cases?: Case[] };

export default function ClientDetails({ client, onClientUpdate, checklist, onChecklistChange, onTabChange, onShowChecklistReviewTest, onDocumentOpen, transferPath: controlledTransferPath, casesCurrentPage, setCasesCurrentPage, onCaseView, viewingCaseIdx, setViewingCaseIdx }: ClientDetailsProps) {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'details' | 'activity' | 'transfers'>('transfers');
  const [openedTransfer] = useState<TransferType>(null);
  const [internalTransferPath] = useState<string[]>([]);
  const transferPath = typeof controlledTransferPath !== 'undefined' ? controlledTransferPath : internalTransferPath;
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<ClientItem>(client);
  const [localChecklist, setLocalChecklist] = useState<boolean[]>(checklist || Array(4).fill(false));
  useEffect(() => {
    setEditValues(client);
    setLocalChecklist(checklist || Array(4).fill(false));
  }, [client, checklist]);

  useEffect(() => {
    if (openedTransfer === null && onTabChange) {
      onTabChange(activeTab);
    }
  }, [activeTab, onTabChange, openedTransfer]);

  const handleEdit = (field: string) => setEditingField(field);
  const handleChange = (field: keyof ClientItem, value: string) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };
  const handleBlur = () => setEditingField(null);
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') setEditingField(null); };
  const handleSave = () => {
    onClientUpdate(editValues);
    if (onChecklistChange) onChecklistChange(localChecklist);
  };
  const handleCancel = () => {
    setEditValues(client);
    setLocalChecklist(checklist || Array(4).fill(false));
  };
  const hasUnsavedChanges =
    JSON.stringify(editValues) !== JSON.stringify(client) ||
    JSON.stringify(localChecklist) !== JSON.stringify(checklist || Array(4).fill(false));

  const [selectedDocument, setSelectedDocument] = useState<TransferFolderItem | null>(null);
  useEffect(() => {
    setSelectedDocument(null);
  }, [transferPath]);
  useEffect(() => {
    if (onDocumentOpen) onDocumentOpen(!!selectedDocument);
  }, [selectedDocument, onDocumentOpen]);

  const [createCaseModalOpen, setCreateCaseModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const handleCloseUploadModal = () => setUploadModalOpen(false);

  // 2. Add state for cases (replace allCases logic)
  const [cases, setCases] = useState<Case[]>(() => {
    // If client.cases exists, use it, else empty array
    // @ts-expect-error: client.cases may be undefined or not typed correctly from backend
    return client.cases || [];
  });

  // 3. Update cases when client changes
  useEffect(() => {
    // @ts-expect-error: client.cases may be undefined or not typed correctly from backend
    setCases(client.cases || []);
  }, [client]);

  // Add a loading state for case hydration
  const [, setIsCasesLoading] = useState(false);
  // Simulate loading when cases change (for demo)
  useEffect(() => {
    setIsCasesLoading(true);
    const timeout = setTimeout(() => setIsCasesLoading(false), 800);
    return () => clearTimeout(timeout);
  }, [cases]);

  // 4. Pagination and sorting for cases
  const pageSize = 12;
  const [sortState, setSortState] = useState<{ column: string | null; order: 'asc' | 'desc' | null }>({ column: null, order: null });
  const [sortedCases, setSortedCases] = useState<Case[]>(cases);
  // Add state for search value
  const [caseSearch, setCaseSearch] = useState("");

  useEffect(() => {
    const sorted = [...cases];
    if (sortState.column && sortState.order) {
      sorted.sort((a, b) => {
        if (sortState.column === 'date') {
          return sortState.order === 'asc'
            ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
    }
    setSortedCases(sorted);
  }, [cases, sortState]);

  const totalPages = Math.max(1, Math.ceil(sortedCases.length / pageSize));
  useEffect(() => {
    if (casesCurrentPage > totalPages) {
      setCasesCurrentPage(1);
    }
  }, [sortedCases, totalPages, casesCurrentPage, setCasesCurrentPage]);

  // Filtered cases for search
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [activeCaseTypeFilters, setActiveCaseTypeFilters] = useState<string[]>(['All']);

  // Close filter modal on outside click
  React.useEffect(() => {
    if (!filterModalOpen) return;
    function handleClick(e: MouseEvent) {
      // Check if click is outside the filter dropdown
      const filterDropdown = document.querySelector('[data-filter-dropdown]');
      if (filterDropdown && !filterDropdown.contains(e.target as Node)) {
        setFilterModalOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [filterModalOpen]);

  // Reset filter to 'All' whenever pagination changes
  useEffect(() => {
    setActiveCaseTypeFilters(['All']);
  }, [casesCurrentPage]);

  // Update filteredCases to filter by both filter and search
  const filteredCases = cases.filter((c) => {
    // Filter by case type
    if (activeCaseTypeFilters[0] && activeCaseTypeFilters[0] !== 'All' && c.caseType !== activeCaseTypeFilters[0]) {
      return false;
    }
    // Search
    const search = caseSearch.toLowerCase();
    if (!search) return true;
    if (c.caseType.toLowerCase().includes(search)) return true;
    if (c.transfers.some(t => t.provider.toLowerCase().includes(search))) return true;
    if (c.transfers.some(t => t.transferType.toLowerCase().includes(search))) return true;
    return false;
  });

  const handleSort = (column: string) => {
    setSortState((prev) => {
      if (prev.column === column) {
        return { column, order: prev.order === 'asc' ? 'desc' : 'asc' };
      } else {
        return { column, order: 'asc' };
      }
    });
  };

  // Remove all references to allCases and use cases.length for selectedRows
  const [selectedRows, setSelectedRows] = useState<boolean[]>(cases.map(() => false));
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [actionRowIdx, setActionRowIdx] = useState<number | null>(null);
  const [actionModalPos, setActionModalPos] = useState<{ top: number; left: number } | null>(null);
  useEffect(() => {
    setSelectedRows(cases.map(() => false));
  }, [cases]);

  // Close action modal on outside click
  useEffect(() => {
    if (!actionModalOpen) return;
    function handleClick(e: MouseEvent) {
      const modal = document.getElementById('case-action-modal');
      if (modal && !modal.contains(e.target as Node)) {
        setActionModalOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [actionModalOpen]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingDeleteIdx, setPendingDeleteIdx] = useState<number | null>(null);

  // Add state for viewing case details
  const [caseExplorerPath, setCaseExplorerPath] = useState<string[]>([]);
  const [caseSelectedDocument, setCaseSelectedDocument] = useState<TransferFolderItem | null>(null);

  // Handler to generate 30 random cases
  function handleHydrateCases() {
    const caseTypes = ['Pension', 'ISA', 'Pension New Money', 'ISA New Money'];
    const providers = ['Aviva', 'Legal & General', 'Royal London', 'Aegon', 'Scottish Widows', 'Standard Life'];
    const transferTypes = ['pensionTransfer', 'isaTransfer', 'pensionNewMoney', 'isaNewMoney'] as const;
    const randomCases = Array.from({ length: 30 }, (_, i) => ({
      id: `case-${Date.now()}-${i}`,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
      caseType: caseTypes[Math.floor(Math.random() * caseTypes.length)],
      transfers: [
        {
          transferType: transferTypes[Math.floor(Math.random() * transferTypes.length)],
          provider: providers[Math.floor(Math.random() * providers.length)],
        },
      ],
    }));
    setCases(randomCases);
    if (onClientUpdate) {
      onClientUpdate({ ...client, cases: randomCases } as ClientItem);
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-[var(--background)]">
      {!(activeTab === 'transfers' && viewingCaseIdx !== null) && (
        <>
          {/* Client details subheader - matching clients list subheader */}
          <div className="w-full flex-wrap gap-2 min-h-[64px] relative transition-opacity duration-200 mt-1">
            <div className="block sm:hidden absolute left-1/2 -translate-x-1/2 w-screen bottom-0 h-px bg-zinc-200 dark:bg-[var(--border)]" />
            <div className="flex sm:hidden mb-1 pt-2 pb-4 justify-between w-full">
              <div className="flex gap-2">
                <button
                  className="flex items-center gap-1 p-1 px-2 rounded-md border border-zinc-200 dark:border-[var(--border)] text-[11px] font-medium transition" 
                  onClick={() => setActiveTab('transfers')}
                  style={{
                    backgroundColor: activeTab === 'transfers' 
                      ? (darkMode ? 'var(--muted)' : 'white')
                      : (darkMode ? 'var(--background)' : 'white'),
                    borderColor: darkMode ? 'var(--border)' : '#e5e7eb',
                    color: darkMode ? 'var(--foreground)' : '#18181b',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = activeTab === 'transfers' 
                      ? (darkMode ? 'var(--muted)' : 'white')
                      : (darkMode ? 'var(--background)' : 'white');
                  }}
                >
                  <FolderTree className="w-4 h-4" />
                  <span>Cases</span>
                </button>
                <button
                  className="flex items-center gap-1 p-1 px-2 rounded-md border border-zinc-200 dark:border-[var(--border)] text-[11px] font-medium transition" 
                  onClick={() => setActiveTab('details')}
                  style={{
                    backgroundColor: activeTab === 'details' 
                      ? (darkMode ? 'var(--muted)' : 'white')
                      : (darkMode ? 'var(--background)' : 'white'),
                    borderColor: darkMode ? 'var(--border)' : '#e5e7eb',
                    color: darkMode ? 'var(--foreground)' : '#18181b',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = activeTab === 'details' 
                      ? (darkMode ? 'var(--muted)' : 'white')
                      : (darkMode ? 'var(--background)' : 'white');
                  }}
                >
                  <FileText className="w-4 h-4" />
                  <span>Details</span>
                </button>
                <button 
                  className="flex items-center gap-1 p-1 px-2 rounded-md border border-zinc-200 dark:border-[var(--border)] bg-white dark:bg-[var(--muted)] text-[11px] font-medium text-zinc-700 dark:text-[var(--foreground)] transition" 
                  aria-label="Sort"
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
                  <ArrowUpDown className="w-4 h-4 text-zinc-500 dark:text-[var(--foreground)]" />
                  <span className="dark:text-[var(--foreground)]">Sort</span>
                </button>
                {/* Custom filter dropdown for mobile */}
                <div className="relative" data-filter-dropdown>
                  <button
                    type="button"
                    className="flex items-center p-1 px-2 rounded-md border border-zinc-200 dark:border-[var(--border)] text-[11px] font-medium transition justify-between"
                    style={{
                      minWidth: 120,
                      maxWidth: 160,
                      width: '100%',
                      borderColor: darkMode ? 'var(--border)' : '#e5e7eb',
                      background: darkMode ? 'var(--muted)' : 'white',
                      color: darkMode ? 'var(--foreground)' : '#18181b',
                    }}
                    onClick={() => setFilterModalOpen(v => !v)}
                    aria-haspopup="listbox"
                    aria-expanded={filterModalOpen}
                    tabIndex={0}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
                    }}
                  >
                    <span className="truncate text-left w-full text-[11px]" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>{activeCaseTypeFilters[0]}</span>
                    <ChevronDown className="w-3 h-3 ml-1 flex-shrink-0" style={{ color: darkMode ? '#a1a1aa' : '#71717a' }} />
                  </button>
                  {filterModalOpen && (
                    <div
                      className="absolute z-10 mt-1 border rounded-md shadow-lg"
                      style={{
                        minWidth: 120,
                        maxWidth: 160,
                        width: '100%',
                        borderColor: darkMode ? 'var(--border)' : '#e5e7eb',
                        background: darkMode ? 'var(--muted)' : 'white',
                      }}
                    >
                      {["All", "Pension Transfer", "ISA Transfer", "Pension New Money", "ISA New Money"].map(option => (
                        <button
                          key={option}
                          type="button"
                          className={`w-full text-left px-2 py-1 text-[11px] hover:bg-blue-50 dark:hover:bg-zinc-800 ${option === activeCaseTypeFilters[0] ? 'font-semibold' : ''}`}
                          style={{
                            color: option === activeCaseTypeFilters[0]
                              ? (darkMode ? '#60a5fa' : '#2563eb')
                              : (darkMode ? 'var(--foreground)' : '#18181b'),
                            background: darkMode ? 'var(--muted)' : 'white',
                          }}
                          onClick={() => { setActiveCaseTypeFilters([option]); setFilterModalOpen(false); }}
                          tabIndex={0}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Search input for mobile */}
                <div className="relative ml-2" style={{ minWidth: 160, maxWidth: 240 }}>
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
                    <SearchIcon className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={caseSearch}
                    onChange={e => setCaseSearch(e.target.value)}
                    placeholder="Search cases..."
                    className="pl-8 pr-2 py-1 rounded-md border border-zinc-200 dark:border-[var(--border)] text-xs bg-white dark:bg-[var(--muted)] text-zinc-700 dark:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white dark:focus:bg-[var(--muted)] w-full"
                    style={{ backgroundColor: darkMode ? 'var(--muted)' : 'white' }}
                  />
                </div>
                {/* Pagination for mobile */}
                {totalPages > 1 && (
                  <div className="flex items-center ml-2">
                    <button
                      className="h-6 w-6 flex items-center justify-center border border-zinc-200 dark:border-[var(--border)] border-r-0 rounded-l-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      onClick={() => setCasesCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={casesCurrentPage === 1}
                      aria-label="Previous page"
                      style={{ 
                        borderTopRightRadius: 0, 
                        borderBottomRightRadius: 0, 
                        borderColor: darkMode ? '#52525b' : '#e4e4e7',
                        backgroundColor: darkMode ? '#27272a' : 'white'
                      }}
                    >
                      <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <span
                      className="h-6 flex items-center justify-center border-t border-b border-l border-r border-zinc-200 dark:border-[var(--border)] text-xs font-medium select-none px-2"
                      style={{ 
                        borderRadius: 0, 
                        borderColor: darkMode ? '#52525b' : '#e4e4e7',
                        backgroundColor: darkMode ? '#27272a' : 'white',
                        color: darkMode ? '#e4e4e7' : '#18181b'
                      }}
                    >
                      <span className="font-medium" style={{ color: darkMode ? '#e4e4e7' : '#18181b' }}>{casesCurrentPage}</span>
                      <span className="font-normal ml-0.5" style={{ color: darkMode ? '#71717a' : '#a1a1aa' }}>/{totalPages}</span>
                    </span>
                    <button
                      className="h-6 w-6 flex items-center justify-center border border-zinc-200 dark:border-[var(--border)] border-l-0 rounded-r-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      onClick={() => setCasesCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={casesCurrentPage === totalPages}
                      aria-label="Next page"
                      style={{ 
                        borderTopLeftRadius: 0, 
                        borderBottomLeftRadius: 0, 
                        borderColor: darkMode ? '#52525b' : '#e4e4e7',
                        backgroundColor: darkMode ? '#27272a' : 'white'
                      }}
                    >
                      <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18" /></svg>
                    </button>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {activeTab === 'transfers' && (
                  <>
                    {cases.length < 30 && (
                      <button 
                        onClick={handleHydrateCases}
                        className="flex items-center gap-1 p-1 px-2 rounded-md border border-zinc-200 dark:border-[var(--border)] bg-white dark:bg-[var(--muted)] text-[11px] font-medium text-zinc-700 dark:text-[var(--foreground)] transition" 
                        aria-label="Generate cases"
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
                        <Grid2x2Check className="w-4 h-4 text-zinc-500 dark:text-[var(--foreground)]" />
                        <span className="dark:text-[var(--foreground)]">Generate</span>
                      </button>
                    )}
                    <button 
                      onClick={() => setCreateCaseModalOpen(true)} 
                      className="flex items-center gap-1 p-1 px-2 rounded-md border border-zinc-200 dark:border-[var(--border)] bg-white dark:bg-[var(--muted)] text-[11px] font-medium text-zinc-700 dark:text-[var(--foreground)] transition" 
                      aria-label="Add new case"
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
                      <PlusCircle className="w-4 h-4 text-zinc-500 dark:text-[var(--foreground)]" />
                      <span className="dark:text-[var(--foreground)]">Add Case</span>
                    </button>
                  </>
                )}
                {hasUnsavedChanges && (
                  <>
                    <button 
                      onClick={handleCancel} 
                      className="flex items-center gap-1 p-1 px-2 rounded-md border border-zinc-200 dark:border-[var(--border)] bg-white dark:bg-[var(--muted)] text-[11px] font-medium text-zinc-700 dark:text-[var(--foreground)] transition" 
                      aria-label="Cancel"
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
                      <X className="w-4 h-4 text-zinc-500 dark:text-[var(--foreground)]" />
                      <span className="dark:text-[var(--foreground)]">Cancel</span>
                    </button>
                    <button 
                      onClick={handleSave} 
                      className="flex items-center gap-1 p-1 px-2 rounded-md border border-zinc-200 dark:border-[var(--border)] bg-white dark:bg-[var(--muted)] text-[11px] font-medium text-zinc-700 dark:text-[var(--foreground)] transition" 
                      aria-label="Save changes"
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
                      <Check className="w-4 h-4 text-zinc-500 dark:text-[var(--foreground)]" />
                      <span className="dark:text-[var(--foreground)]">Save</span>
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="hidden sm:flex w-full items-center justify-between pl-24 pr-8 pt-2 pb-0">
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-1 border border-zinc-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-normal transition"
                  onClick={() => setActiveTab('transfers')}
                  style={{
                    backgroundColor: activeTab === 'transfers' 
                      ? (darkMode ? 'var(--muted)' : 'white')
                      : (darkMode ? 'var(--background)' : 'white'),
                    borderColor: darkMode ? 'var(--border)' : '#e5e7eb',
                    color: darkMode ? 'var(--foreground)' : '#18181b',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = activeTab === 'transfers' 
                      ? (darkMode ? 'var(--muted)' : 'white')
                      : (darkMode ? 'var(--background)' : 'white');
                  }}
                >
                  <FolderTree className="w-4 h-4" />
                  Cases
                </button>
                <button
                  className="flex items-center gap-1 border border-zinc-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-normal transition"
                  onClick={() => setActiveTab('details')}
                  style={{
                    backgroundColor: activeTab === 'details' 
                      ? (darkMode ? 'var(--muted)' : 'white')
                      : (darkMode ? 'var(--background)' : 'white'),
                    borderColor: darkMode ? 'var(--border)' : '#e5e7eb',
                    color: darkMode ? 'var(--foreground)' : '#18181b',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = activeTab === 'details' 
                      ? (darkMode ? 'var(--muted)' : 'white')
                      : (darkMode ? 'var(--background)' : 'white');
                  }}
                >
                  <FileText className="w-4 h-4" />
                  Client details
                </button>
                <button 
                  className="flex items-center gap-1 border border-zinc-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-normal bg-white dark:bg-[var(--muted)] text-zinc-700 dark:text-[var(--foreground)] transition"
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
                  <ArrowUpDown className="w-4 h-4" />
                  Sort
                </button>
                {/* Custom filter dropdown */}
                <div className="relative" data-filter-dropdown>
                  <button
                    type="button"
                    className="flex items-center border border-zinc-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-normal transition justify-between"
                    style={{
                      minWidth: 180,
                      maxWidth: 240,
                      width: '100%',
                      borderColor: darkMode ? 'var(--border)' : '#e5e7eb',
                      background: darkMode ? 'var(--muted)' : 'white',
                      color: darkMode ? 'var(--foreground)' : '#18181b',
                    }}
                    onClick={() => setFilterModalOpen(v => !v)}
                    aria-haspopup="listbox"
                    aria-expanded={filterModalOpen}
                    tabIndex={0}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
                    }}
                  >
                    <span className="truncate text-left w-full" style={{ color: darkMode ? 'var(--foreground)' : '#18181b' }}>{activeCaseTypeFilters[0]}</span>
                    <ChevronDown className="w-4 h-4 ml-2 flex-shrink-0" style={{ color: darkMode ? '#a1a1aa' : '#71717a' }} />
                  </button>
                  {filterModalOpen && (
                    <div
                      className="absolute z-10 mt-1 border rounded-lg shadow-lg"
                      style={{
                        minWidth: 180,
                        maxWidth: 240,
                        width: '100%',
                        borderColor: darkMode ? 'var(--border)' : '#e5e7eb',
                        background: darkMode ? 'var(--muted)' : 'white',
                      }}
                    >
                      {["All", "Pension Transfer", "ISA Transfer", "Pension New Money", "ISA New Money"].map(option => (
                        <button
                          key={option}
                          type="button"
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 dark:hover:bg-zinc-800 ${option === activeCaseTypeFilters[0] ? 'font-semibold' : ''}`}
                          style={{
                            color: option === activeCaseTypeFilters[0]
                              ? (darkMode ? '#60a5fa' : '#2563eb')
                              : (darkMode ? 'var(--foreground)' : '#18181b'),
                            background: darkMode ? 'var(--muted)' : 'white',
                          }}
                          onClick={() => { setActiveCaseTypeFilters([option]); setFilterModalOpen(false); }}
                          tabIndex={0}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {/* Search input for desktop */}
                <div className="relative ml-2" style={{ minWidth: 220, maxWidth: 320 }}>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
                    <SearchIcon className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    value={caseSearch}
                    onChange={e => setCaseSearch(e.target.value)}
                    placeholder="Search cases..."
                    className="pl-10 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-[var(--border)] text-sm bg-white dark:bg-[var(--muted)] text-zinc-700 dark:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white dark:focus:bg-[var(--muted)] w-full"
                    style={{ backgroundColor: darkMode ? 'var(--muted)' : 'white' }}
                  />
                </div>
                {/* Pagination for desktop */}
                {totalPages > 1 && (
                  <div className="flex items-center ml-4">
                    <button
                      className="h-8 w-8 flex items-center justify-center border border-zinc-200 dark:border-[var(--border)] border-r-0 rounded-l-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      onClick={() => setCasesCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={casesCurrentPage === 1}
                      aria-label="Previous page"
                      style={{ 
                        borderTopRightRadius: 0, 
                        borderBottomRightRadius: 0, 
                        borderColor: darkMode ? '#52525b' : '#e4e4e7',
                        backgroundColor: darkMode ? '#27272a' : 'white'
                      }}
                    >
                      <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <span
                      className="h-8 flex items-center justify-center border-t border-b border-l border-r border-zinc-200 dark:border-[var(--border)] text-sm font-medium select-none px-3"
                      style={{ 
                        borderRadius: 0, 
                        borderColor: darkMode ? '#52525b' : '#e4e4e7',
                        backgroundColor: darkMode ? '#27272a' : 'white',
                        color: darkMode ? '#e4e4e7' : '#18181b'
                      }}
                    >
                      <span className="font-medium" style={{ color: darkMode ? '#e4e4e7' : '#18181b' }}>{casesCurrentPage}</span>
                      <span className="font-normal ml-1" style={{ color: darkMode ? '#71717a' : '#a1a1aa' }}>/{totalPages}</span>
                    </span>
                    <button
                      className="h-8 w-8 flex items-center justify-center border border-zinc-200 dark:border-[var(--border)] border-l-0 rounded-r-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      onClick={() => setCasesCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={casesCurrentPage === totalPages}
                      aria-label="Next page"
                      style={{ 
                        borderTopLeftRadius: 0, 
                        borderBottomLeftRadius: 0, 
                        borderColor: darkMode ? '#52525b' : '#e4e4e7',
                        backgroundColor: darkMode ? '#27272a' : 'white'
                      }}
                    >
                      <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18" /></svg>
                    </button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {activeTab === 'transfers' && (
                  <>
                    {cases.length < 30 && (
                      <button 
                        onClick={handleHydrateCases}
                        className="flex items-center gap-2 border border-zinc-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-normal bg-white dark:bg-[var(--muted)] text-zinc-700 dark:text-[var(--foreground)] transition"
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
                        <Grid2x2Check className="w-4 h-4" />
                        Generate
                      </button>
                    )}
                    <button 
                      onClick={() => setCreateCaseModalOpen(true)} 
                      className="flex items-center gap-2 border border-zinc-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-normal bg-white dark:bg-[var(--muted)] text-zinc-700 dark:text-[var(--foreground)] transition"
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
                      <PlusCircle className="w-4 h-4" />
                      Add case
                    </button>
                  </>
                )}
                {hasUnsavedChanges && (
                  <>
                    <button 
                      onClick={handleCancel} 
                      className="flex items-center gap-2 border border-zinc-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-normal bg-white dark:bg-[var(--muted)] text-zinc-700 dark:text-[var(--foreground)] transition"
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
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button 
                      onClick={handleSave} 
                      className="flex items-center gap-2 border border-zinc-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-normal bg-white dark:bg-[var(--muted)] text-zinc-700 dark:text-[var(--foreground)] transition"
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
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

        </>
      )}
      {activeTab === 'details' && (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ minWidth: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <div style={{ width: '100%', maxWidth: 700, minWidth: 320, paddingLeft: 32, paddingTop: 24 }}>
              <EditableRow icon={<Users className="w-5 h-5 text-zinc-400" />} label="Client name" value={editValues.client || ''} editing={editingField==='client'} onEdit={() => handleEdit('client')} onChange={v => handleChange('client', v)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
              <EditableRow icon={<UserCircle className="w-5 h-5 text-zinc-400" />} label="Advisor name" value={editValues.advisor || ''} editing={editingField==='advisor'} onEdit={() => handleEdit('advisor')} onChange={v => handleChange('advisor', v)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
            </div>
          </div>
          <div style={{ width: 1, background: 'transparent', height: '100%', alignSelf: 'stretch' }} />
          <div style={{ minWidth: 0 }}>
          </div>
        </div>
      )}
      {activeTab === 'transfers' && (
        viewingCaseIdx !== null ? (
          <CaseDetailsView
            caseExplorerPath={caseExplorerPath}
            setCaseExplorerPath={setCaseExplorerPath}
            caseSelectedDocument={caseSelectedDocument}
            setCaseSelectedDocument={setCaseSelectedDocument}
            darkMode={darkMode}
            onUploadModal={() => setUploadModalOpen(true)}
            caseData={filteredCases[viewingCaseIdx]}
            onAddTransfer={transfer => {
              // Find the case in the main cases array (not filteredCases)
              const caseId = filteredCases[viewingCaseIdx].id;
              setCases(prevCases => {
                const updated = prevCases.map(c => {
                  if (c.id !== caseId) return c;
                  // Handle Pension New Money and ISA New Money
                  if (c.caseType === 'Pension New Money') {
                    const newTransfers = [...c.transfers, transfer];
                    return {
                      ...c,
                      transfers: newTransfers,
                      documents: generatePensionNewMoneyStructure({ ...c, transfers: newTransfers })
                    };
                  } else if (c.caseType === 'ISA New Money') {
                    const newTransfers = [...c.transfers, transfer];
                    return {
                      ...c,
                      transfers: newTransfers,
                      documents: generateIsaNewMoneyStructure({ ...c, transfers: newTransfers })
                    };
                  } else {
                    // Default: just add transfer
                    return { ...c, transfers: [...c.transfers, transfer] };
                  }
                });
                // Persist to client
                onClientUpdate({ ...((editValues as object)), cases: updated } as ClientItem);
                return updated;
              });
            }}
          />
        ) : (
          filteredCases.length === 0 ? (
            <EmptyCasesState onAddNewCase={() => setCreateCaseModalOpen(true)} />
          ) : (
            <div className="flex flex-col h-full min-h-0">
              <div className="flex-1 sm:px-8 sm:ml-16 sm:mt-0 min-h-0 flex flex-col">
                <CasesTable
                  cases={filteredCases}
                  selectedRows={selectedRows}
                  onSelectRow={idx => setSelectedRows(selectedRows.map((v, i) => i === idx ? !v : v))}
                  onSort={handleSort}
                  sortState={sortState}
                  onAction={(rowIdx, e) => {
                    setActionModalOpen(true);
                    setActionRowIdx(rowIdx);
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    setActionModalPos({
                      top: rect.bottom + window.scrollY + 4,
                      left: rect.right + window.scrollX - 220,
                    });
                  }}
                  pageSize={pageSize}
                  currentPage={casesCurrentPage}
                  darkMode={darkMode}
                />
                {/* Render the modal OUTSIDE the table, not inside .map or any <tr> */}
                {actionModalOpen && actionRowIdx !== null && actionModalPos && (
                  <CaseActionModal
                    open={actionModalOpen}
                    position={actionModalPos}
                    onView={() => {
                      setActionModalOpen(false);
                      setViewingCaseIdx(actionRowIdx);
                      setCaseExplorerPath([]);
                      setCaseSelectedDocument(null);
                      if (onCaseView && typeof actionRowIdx === 'number' && cases[actionRowIdx]) {
                        onCaseView(cases[actionRowIdx].caseType);
                      }
                    }}
                    onDelete={() => {
                      setActionModalOpen(false);
                      setPendingDeleteIdx(actionRowIdx);
                      setShowDeleteConfirm(true);
                    }}
                    darkMode={darkMode}
                  />
                )}
              </div>

            </div>
            // End refactor
          )
        )
      )}
      <UploadModal
        open={uploadModalOpen}
        onClose={handleCloseUploadModal}
        onNoPersonalisedChecklist={onShowChecklistReviewTest}
        onShowReviewChecklist={onShowChecklistReviewTest}
      />
      {/* TODO: Update CreateNewCase to add a new Case object to cases array and call onClientUpdate with updated cases */}
      <CreateNewCase
        open={createCaseModalOpen}
        onClose={() => setCreateCaseModalOpen(false)}
        onSubmit={(newCase) => {
          const updatedCases = [newCase, ...cases];
          setCases(updatedCases);
          onClientUpdate({ ...((editValues as object)), cases: updatedCases } as ClientItem);
          setCreateCaseModalOpen(false);
        }}
      />
      {/* Delete confirmation modal */}
      {showDeleteConfirm && pendingDeleteIdx !== null && (
        <DeleteCaseModal
          open={showDeleteConfirm}
          onCancel={() => { setShowDeleteConfirm(false); setPendingDeleteIdx(null); }}
          onConfirm={() => {
            // Actually delete the case
            if (pendingDeleteIdx !== null) {
              const filtered = cases.filter((_, idx) => idx !== pendingDeleteIdx);
              setCases(filtered);
              onClientUpdate({ ...((editValues as object)), cases: filtered } as ClientItem);
            }
            setShowDeleteConfirm(false);
            setPendingDeleteIdx(null);
          }}
        />
      )}
    </div>
  );
} 