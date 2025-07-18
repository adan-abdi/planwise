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
  const [isCasesLoading, setIsCasesLoading] = useState(false);
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
      const modal = document.getElementById('case-filter-modal');
      if (modal && !modal.contains(e.target as Node)) {
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
        <div className="flex items-center justify-between px-2 sm:pl-8 sm:pr-8 py-3 border-b-1 border-zinc-200 dark:border-zinc-700 min-h-[56px] bg-white dark:bg-[var(--background)] w-full mb-4 flex-nowrap gap-x-2 gap-y-2 flex-wrap sm:flex-nowrap"
          style={{ borderBottomColor: darkMode ? '#3f3f46' : '#e4e4e7' }}
        >
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            {/* Back button removed from here */}
            {/* Tabs here */}
            <div className="flex gap-2 flex-nowrap">
              <button
                className={`px-3 py-2 text-sm rounded-[10px] border transition-colors flex items-center gap-1 whitespace-nowrap font-medium${activeTab === 'transfers' ? ' bg-zinc-100 dark:bg-[var(--muted)] border-zinc-200 dark:border-[var(--border)]' : ''}`}
                onClick={() => setActiveTab('transfers')}
                style={{
                  backgroundColor: darkMode
                    ? (activeTab === 'transfers' ? 'var(--muted)' : 'var(--background)')
                    : (activeTab === 'transfers' ? '#f4f4f5' : 'white'),
                  border: darkMode
                    ? (activeTab === 'transfers' ? '1px solid #3f3f46' : '1px solid transparent')
                    : (activeTab === 'transfers' ? '1px solid #d4d4d8' : '1px solid transparent'),
                  color: darkMode ? 'var(--foreground)' : '#18181b',
                  cursor: activeTab !== 'transfers' ? 'pointer' : 'default',
                  fontWeight: activeTab === 'transfers' ? 600 : 500,
                  fontSize: '1.1rem',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f4f4f5';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = darkMode
                    ? (activeTab === 'transfers' ? 'var(--muted)' : 'var(--background)')
                    : (activeTab === 'transfers' ? '#f4f4f5' : 'white');
                }}
              >
                <FolderTree className="w-4 h-4 mr-1" />
                Cases
              </button>
              <button
                className={`px-3 py-2 text-sm rounded-[10px] border transition-colors flex items-center gap-1 whitespace-nowrap font-medium${activeTab === 'details' ? ' bg-zinc-100 dark:bg-[var(--muted)] border-zinc-200 dark:border-[var(--border)]' : ''}`}
                onClick={() => setActiveTab('details')}
                style={{
                  backgroundColor: darkMode
                    ? (activeTab === 'details' ? 'var(--muted)' : 'var(--background)')
                    : (activeTab === 'details' ? '#f4f4f5' : 'white'),
                  border: darkMode
                    ? (activeTab === 'details' ? '1px solid #3f3f46' : '1px solid transparent')
                    : (activeTab === 'details' ? '1px solid #d4d4d8' : '1px solid transparent'),
                  color: darkMode ? 'var(--foreground)' : '#18181b',
                  cursor: activeTab !== 'details' ? 'pointer' : 'default',
                  fontWeight: activeTab === 'details' ? 600 : 500,
                  fontSize: '1.1rem',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f4f4f5';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = darkMode
                    ? (activeTab === 'details' ? 'var(--muted)' : 'var(--background)')
                    : (activeTab === 'details' ? '#f4f4f5' : 'white');
                }}
              >
                <FileText className="w-4 h-4 mr-1" />
                Client details
              </button>
            </div>
          </div>
          {/* Add new case button on far right, only for Cases tab */}
          {activeTab === 'transfers' && (
            <div className="ml-auto flex items-center gap-2">
              {cases.length < 30 && (
                <button
                  type="button"
                  onClick={handleHydrateCases}
                  className="icon-btn border border-zinc-200 dark:border-[var(--border)] rounded-full p-2 bg-white dark:bg-[var(--muted)] hover:bg-zinc-100 dark:hover:bg-[var(--border)] transition flex items-center justify-center"
                  title="Hydrate cases"
                  aria-label="Hydrate cases"
                  style={{
                    borderColor: darkMode ? 'var(--border)' : '#e5e7eb',
                    backgroundColor: darkMode ? 'var(--muted)' : 'white',
                    color: darkMode ? 'var(--foreground)' : '#18181b',
                    boxShadow: 'none',
                    width: 36,
                    height: 36,
                    minWidth: 36,
                    minHeight: 36,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Grid2x2Check className="w-5 h-5" style={{ color: darkMode ? '#a1a1aa' : '#71717a' }} />
                </button>
              )}
              <button
                type="button"
                onClick={() => setCreateCaseModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-zinc-200 bg-white dark:bg-[var(--muted)] text-zinc-700 dark:text-[var(--foreground)] font-medium text-sm shadow-sm hover:bg-zinc-100 dark:hover:bg-zinc-700 transition"
                style={{ minHeight: 32 }}
              >
                <PlusCircle className="w-4 h-4" />
                Add new case
              </button>
            </div>
          )}
          <div className="flex gap-1 sm:gap-2 ml-2 flex-shrink-0">
            {hasUnsavedChanges && (
              <button
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-normal transition"
                onClick={handleCancel}
                type="button"
                aria-label="Cancel"
                style={{
                  cursor: 'pointer',
                  backgroundColor: darkMode ? '#18181b' : 'white',
                  border: `1px solid ${darkMode ? '#3f3f46' : '#e4e4e7'}`,
                  color: darkMode ? '#f87171' : '#dc2626',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = darkMode ? '#3a2323' : '#f4f4f5';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = darkMode ? '#18181b' : 'white';
                }}
              >
                <X className="w-4 h-4" style={{ color: darkMode ? '#f87171' : '#dc2626' }} />
                <span>Cancel</span>
              </button>
            )}
            {hasUnsavedChanges && (
              <button
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-normal transition"
                onClick={handleSave}
                type="button"
                aria-label="Save Changes"
                style={{
                  cursor: 'pointer',
                  backgroundColor: darkMode ? '#18181b' : '#e6fbe8',
                  border: `1px solid ${darkMode ? '#166534' : '#a7f3d0'}`,
                  color: darkMode ? '#4ade80' : '#166534',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = darkMode ? '#1a3a23' : '#bbf7d0';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = darkMode ? '#18181b' : '#e6fbe8';
                }}
              >
                <Check className="w-4 h-4" style={{ color: darkMode ? '#4ade80' : '#166534' }} />
                <span>Save</span>
              </button>
            )}
          </div>
        </div>
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
              <div className="flex-1 px-4 min-h-0 flex flex-col">
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
                  onSearch={setCaseSearch}
                  searchValue={caseSearch}
                  onFilterChange={val => setActiveCaseTypeFilters([val])}
                  filterValue={activeCaseTypeFilters[0]}
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
              <ClientFooter
                selectedClient={null}
                currentPage={casesCurrentPage}
                totalPages={totalPages}
                setCurrentPage={setCasesCurrentPage}
                isEmpty={false}
                showFooterActions={false}
                invisible={false}
                forceWhiteBg={false}
                greyBg={false}
                showTransferDocumentActions={false}
              />
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