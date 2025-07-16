import React, { useState, useEffect, useRef } from "react";
import type { TransferFolderItem } from "./FileExplorer";
import type { ClientItem as OriginalClientItem } from "./ClientListItem";
import {
  Users,
  UserCircle,
  FileText,
  FolderTree,
  Edit2,
  X,
  Check,
  ArrowLeft,
  PlusCircle,
  MoreHorizontal,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Grid2x2Check
} from "lucide-react";
import UploadModal from "./UploadModal";
import { useTheme } from "../../../theme-context";
import CreateNewCase from './CreateNewCase';
import ClientFooter from "./ClientFooter";
import type { Dispatch, SetStateAction } from 'react';
import FileExplorer from './FileExplorer';
import DocumentViewer from './documentviewer/DocumentViewer';

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
}

type TransferType = "pension" | "isa" | null;

// 1. Define a new Case type: unique by createdAt, one caseType, multiple transfers/providers
type Transfer = {
  transferType: 'pensionTransfer' | 'isaTransfer' | 'pensionNewMoney' | 'isaNewMoney';
  amount?: number;
  provider: string;
};

interface Case {
  id: string;
  createdAt: string;
  caseType: string; // e.g. 'Pension', 'ISA', etc.
  transfers: Transfer[];
}

// Extend ClientItem to allow 'cases' property
type ClientItem = OriginalClientItem & { cases?: Case[] };

export default function ClientDetails({ client, onClientUpdate, checklist, onChecklistChange, onTabChange, onShowChecklistReviewTest, onDocumentOpen, onBackToClientList, transferPath: controlledTransferPath, casesCurrentPage, setCasesCurrentPage }: ClientDetailsProps) {
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

  // 4. Dummy case generator: generate 30 cases, each with random transfer counts
  const handleGenerateDummyCases = () => {
    const caseTypes = ['Pension Transfer', 'ISA Transfer', 'Pension New Money', 'ISA New Money'];
    const providers = ['Provider A', 'Provider B', 'Provider C', 'Provider D'];
    const transferTypes: Transfer['transferType'][] = ['pensionTransfer', 'isaTransfer', 'pensionNewMoney', 'isaNewMoney'];
    const newCases: Case[] = Array.from({ length: 30 }, (_, i) => {
      const caseType = caseTypes[Math.floor(Math.random() * caseTypes.length)];
      // 1-4 transfers per case, each with possibly different provider
      const numTransfers = Math.floor(Math.random() * 4) + 1;
      const usedProviders: string[] = [];
      const transfers: Transfer[] = Array.from({ length: numTransfers }, () => {
        let provider;
        do {
          provider = providers[Math.floor(Math.random() * providers.length)];
        } while (usedProviders.includes(provider) && usedProviders.length < providers.length);
        usedProviders.push(provider);
        const transferType = transferTypes[Math.floor(Math.random() * transferTypes.length)];
        return {
          transferType,
          amount: Math.floor(Math.random() * 10000) + 1000,
          provider,
        };
      });
      // Each case is a day earlier than the previous
      const createdAt = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString();
      return {
        id: `dummy-${createdAt}`,
        createdAt,
        caseType,
        transfers,
      };
    });
    setCases(newCases);
    // Save to client
    onClientUpdate({ ...((editValues as object)), cases: newCases } as ClientItem);
  };

  // 5. Pagination and sorting for cases
  const pageSize = 12;
  const [sortState, setSortState] = useState<{ column: string | null; order: 'asc' | 'desc' | null }>({ column: null, order: null });
  const [sortedCases, setSortedCases] = useState<Case[]>(cases);
  const [caseSearch] = useState("");

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

  const filteredCases = cases.filter((c) => {
    // If 'All' is selected, show all cases
    if (activeCaseTypeFilters.includes('All')) {
      // continue to search filter
    } else if (activeCaseTypeFilters.length > 0 && !activeCaseTypeFilters.includes(c.caseType)) {
      return false;
    }
    const search = caseSearch.toLowerCase();
    if (!search) return true;
    // Search in caseType, all providers, and all transferTypes
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
  const actionBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);
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
  const [viewingCaseIdx, setViewingCaseIdx] = useState<number | null>(null);
  const [caseExplorerPath, setCaseExplorerPath] = useState<string[]>([]);
  const [caseSelectedDocument, setCaseSelectedDocument] = useState<TransferFolderItem | null>(null);

  // Mock folder/file structure for demo
  function getMockFolderContents(path: string[]): TransferFolderItem[] {
    // For demo, always return the same structure
    if (path.length === 0) {
      return [
        { type: 'folder', name: 'Documents', children: [
          { type: 'file', name: 'Policy.pdf' },
          { type: 'file', name: 'Statement.pdf' },
        ] },
        { type: 'file', name: 'Welcome Letter.pdf' },
      ];
    }
    if (path[0] === 'Documents') {
      return [
        { type: 'file', name: 'Policy.pdf' },
        { type: 'file', name: 'Statement.pdf' },
      ];
    }
    return [];
  }

  return (
    <div className="flex flex-col h-full min-h-0 bg-white dark:bg-[var(--background)]">
      <div className="flex items-center justify-between px-2 sm:pl-8 sm:pr-8 py-3 border-b-1 border-zinc-200 dark:border-zinc-700 min-h-[56px] bg-white dark:bg-[var(--background)] w-full mb-4 flex-nowrap gap-x-2 gap-y-2 flex-wrap sm:flex-nowrap"
        style={{ borderBottomColor: darkMode ? '#3f3f46' : '#e4e4e7' }}
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {onBackToClientList && (
            <button
              onClick={onBackToClientList}
              className="mr-2 p-2 rounded-full transition flex items-center justify-center"
              aria-label="Back to client list"
              style={{
                backgroundColor: darkMode ? 'transparent' : 'transparent',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = darkMode ? '#232329' : '#f4f4f5';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ArrowLeft className="w-5 h-5 text-[var(--foreground)]" />
            </button>
          )}
          <div className="min-w-0">
            <div
              className="text-lg sm:text-2xl font-semibold truncate"
              style={{ color: darkMode ? 'white' : 'black' }}
            >
              {editValues.client}
            </div>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2 ml-auto flex-shrink-0">
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
      <div className="flex items-center border-b pb-4 border-zinc-200 dark:border-zinc-700 gap-2 px-2 sm:px-8 flex-nowrap overflow-x-auto"
        style={{ borderBottomColor: darkMode ? '#3f3f46' : '#e4e4e7' }}
      >
        <div className="flex gap-2 flex-nowrap">
          <button
            className={`px-3 py-2 text-sm rounded-[10px] border transition-colors flex items-center gap-1 whitespace-nowrap font-medium`}
            onClick={() => setActiveTab('transfers')}
            style={{
              backgroundColor: darkMode
                ? (activeTab === 'transfers' ? 'var(--muted)' : 'var(--background)')
                : 'white',
              border: darkMode
                ? (activeTab === 'transfers' ? '1px solid #3f3f46' : '1px solid transparent')
                : (activeTab === 'transfers' ? '1px solid #d4d4d8' : '1px solid transparent'),
              color: darkMode ? 'var(--foreground)' : '#18181b',
              cursor: activeTab !== 'transfers' ? 'pointer' : 'default',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f4f4f5';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = darkMode
                ? (activeTab === 'transfers' ? 'var(--muted)' : 'var(--background)')
                : 'white';
            }}
          >
            <FolderTree className="w-4 h-4 mr-1" />
            Cases
          </button>
          <button
            className={`px-3 py-2 text-sm rounded-[10px] border transition-colors flex items-center gap-1 whitespace-nowrap font-medium`}
            onClick={() => setActiveTab('details')}
            style={{
              backgroundColor: darkMode
                ? (activeTab === 'details' ? 'var(--muted)' : 'var(--background)')
                : 'white',
              border: darkMode
                ? (activeTab === 'details' ? '1px solid #3f3f46' : '1px solid transparent')
                : (activeTab === 'details' ? '1px solid #d4d4d8' : '1px solid transparent'),
              color: darkMode ? 'var(--foreground)' : '#18181b',
              cursor: activeTab !== 'details' ? 'pointer' : 'default',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f4f4f5';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = darkMode
                ? (activeTab === 'details' ? 'var(--muted)' : 'var(--background)')
                : 'white';
            }}
          >
            <FileText className="w-4 h-4 mr-1" />
            Client details
          </button>
        </div>
        <div className="flex-1" />
        {activeTab === 'transfers' && openedTransfer === null && transferPath.length === 0 && (
          <div className="flex gap-2 ml-auto">
            {/* Dummy case generator button */}
            <button
              type="button"
              onClick={handleGenerateDummyCases}
              className="icon-btn border border-zinc-200 dark:border-[var(--border)] rounded-full p-2 bg-white dark:bg-[var(--muted)] hover:bg-zinc-100 dark:hover:bg-[var(--border)] transition flex items-center justify-center"
              title="Generate dummy cases"
              aria-label="Generate dummy cases"
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
              <Grid2x2Check className="w-5 h-5" />
            </button>
            {/* Add new case button */}
            <button
              type="button"
              onClick={() => setCreateCaseModalOpen(true)}
              className={`px-3 py-2 text-sm rounded-[10px] border transition-colors flex items-center gap-1 whitespace-nowrap font-medium bg-white dark:bg-[var(--muted)] border-zinc-200 dark:border-[var(--border)] text-zinc-700 dark:text-[var(--foreground)]`}
              style={{
                backgroundColor: darkMode ? 'var(--muted)' : 'white',
                borderColor: darkMode ? 'var(--border)' : '#e5e7eb',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
              }}
            >
              <PlusCircle className="w-4 h-4" />
              Add new case
            </button>
          </div>
        )}
      </div>
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
          <div className="flex-1 min-h-0 flex flex-row" style={{ height: '100%' }}>
            <div style={{ width: 320, minWidth: 220, maxWidth: 400, borderRight: '1.5px solid #e4e4e7', background: darkMode ? '#18181b' : '#f4f4f5', display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%' }}>
              <div className="p-4 border-b" style={{ borderColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>
                <button
                  className="text-blue-600 hover:underline font-medium text-sm"
                  onClick={() => { setViewingCaseIdx(null); setCaseExplorerPath([]); setCaseSelectedDocument(null); }}
                >
                  ← Back to Cases
                </button>
                <div className="mt-2 text-lg font-semibold" style={{ color: darkMode ? 'white' : '#18181b' }}>
                  {cases[viewingCaseIdx]?.caseType || 'Case Details'}
                </div>
              </div>
              <div className="flex-1 overflow-auto p-4 pt-2">
                <FileExplorer
                  transferPath={caseExplorerPath}
                  getFolderContents={getMockFolderContents}
                  handleEnterFolder={name => setCaseExplorerPath([...caseExplorerPath, name])}
                  handleUploadModal={() => {}}
                  setSelectedDocument={item => {
                    setCaseSelectedDocument(item);
                  }}
                  clickableLineClass="text-blue-600 hover:underline cursor-pointer"
                />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0, background: darkMode ? 'var(--background)' : 'white', minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div className="p-6">
                <DocumentViewer document={caseSelectedDocument || { name: 'Select a document' }} />
              </div>
            </div>
          </div>
        ) : (
          <div
            className="overflow-x-auto w-full px-0 mt-4 sm:mt-0 sm:pt-0 scrollbar-thin border rounded-lg bg-white dark:bg-[var(--background)]"
            style={{
              marginBottom: 0,
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
                      onClick={() => handleSort('date')}
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
                      onClick={() => handleSort('provider')}
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
                      style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>Seeding</th>
                  <th className="p-2 align-middle border-r"
                      style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>CYC</th>
                  <th className="p-2 align-middle border-r"
                      style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>Illustration</th>
                  <th className="p-2 align-middle border-r"
                      style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7' }}>SL</th>
                  <th className="p-2 align-middle select-none border-r" style={{ borderRightColor: darkMode ? '#3f3f46' : '#e4e4e7', cursor: 'pointer' }}>
                    <button
                      type="button"
                      onClick={() => handleSort('status')}
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
                  {filteredCases.slice((casesCurrentPage - 1) * pageSize, casesCurrentPage * pageSize).map((caseObj, rowIdx) => (
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
                          onClick={() => setSelectedRows(selectedRows.map((v, i) => i === rowIdx ? !v : v))}
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
                          const uniqueProviders = Array.from(new Set(caseObj.transfers.map(t => t.provider)));
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
                          ref={el => { actionBtnRefs.current[rowIdx] = el; }}
                          onClick={e => {
                            setActionRowIdx(rowIdx);
                            setActionModalOpen(true);
                            const rect = (e.target as HTMLElement).getBoundingClientRect();
                            setActionModalPos({
                              top: rect.bottom + window.scrollY + 4,
                              left: rect.right + window.scrollX - 220, // align right edge, modal width ~220px
                            });
                          }}
                        >
                          <MoreHorizontal className="w-5 h-5 text-zinc-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Render the modal OUTSIDE the table, not inside .map or any <tr> */}
              {actionModalOpen && actionRowIdx !== null && actionModalPos && (
                <div
                  id="case-action-modal"
                  className="fixed z-[100]"
                  style={{ top: actionModalPos.top, left: actionModalPos.left, minWidth: 220 }}
                >
                  <div className="bg-[var(--background)] rounded-2xl shadow-2xl w-full max-w-xs border border-[var(--border)] flex flex-col">
                    <div className="flex flex-col gap-2 px-4 sm:px-6 py-4">
                      <button
                        className="w-full text-left px-4 py-2 rounded-lg bg-transparent font-medium transition border-0"
                        style={{
                          border: 'none',
                          color: darkMode ? 'var(--foreground)' : '#18181b',
                          background: 'transparent',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = darkMode ? '#27272a' : '#f4f4f5';
                          e.currentTarget.style.color = darkMode ? 'var(--foreground)' : '#18181b';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = darkMode ? 'var(--foreground)' : '#18181b';
                        }}
                        onClick={() => { setActionModalOpen(false); setViewingCaseIdx(actionRowIdx); setCaseExplorerPath([]); setCaseSelectedDocument(null); }}
                      >
                        View Case Details
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 rounded-lg bg-transparent text-red-600 font-medium transition hover:bg-red-50 dark:hover:bg-red-900/30 border-0"
                        style={{ border: 'none' }}
                        onClick={() => {
                          setActionModalOpen(false);
                          setPendingDeleteIdx(actionRowIdx);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        Delete Case
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      )
      {activeTab === 'transfers' && (
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-2 sm:px-0 overflow-y-auto" style={{ background: 'rgba(255, 0, 32, 0.07)', backdropFilter: 'blur(12px)' }}>
          <div className="bg-[var(--background)] rounded-2xl shadow-2xl w-full max-w-md relative border border-[var(--border)] flex flex-col mx-auto my-2 sm:my-0">
            <div className="px-4 sm:px-6 py-2 border-b border-[var(--border)] rounded-t-2xl bg-[var(--muted)] dark:bg-[var(--muted)]">
              <span className="text-zinc-700 dark:text-[var(--foreground)] font-medium text-base">Delete Case</span>
            </div>
            <div className="flex flex-col gap-4 px-4 sm:px-6 py-6" style={{ background: 'rgba(255,0,0,0.03)' }}>
              <div className="text-base text-black dark:text-[var(--foreground)]">Are you sure you want to delete this case? This action cannot be undone.</div>
              <div className="flex gap-2 justify-end mt-2">
                <button
                  className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-zinc-500 font-medium transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  onClick={() => { setShowDeleteConfirm(false); setPendingDeleteIdx(null); }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg border border-red-600 bg-red-600 text-white font-medium transition hover:bg-red-700"
                  onClick={() => {
                    // Actually delete the case
                    if (pendingDeleteIdx !== null) {
                      const filtered = cases.filter((_, idx) => idx !== pendingDeleteIdx);
                      setCases(filtered);
                      onClientUpdate({ ...((editValues as object)), cases: filtered } as ClientItem);
                    }
                    setShowDeleteConfirm(false);
                    setPendingDeleteIdx(null);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EditableRow({ icon, label, value, editing, onEdit, onChange, onBlur, onKeyDown, type }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editing: boolean;
  onEdit: () => void;
  onChange: (v: string) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  type?: string;
}) {
  const { darkMode } = useTheme();
  return (
    <div className="flex items-center gap-4 py-2 group cursor-pointer" onClick={editing ? undefined : onEdit}>
      <div className="text-zinc-400 text-sm flex items-center gap-2 min-w-[220px] max-w-[260px] pr-8">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex-1 flex items-start gap-2 text-left justify-start w-full max-w-2xl">
        {editing ? (
          <input
            type={type || 'text'}
            className="border rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 w-full text-left max-w-2xl"
            value={value}
            autoFocus
            onChange={e => onChange(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            style={{
              border: darkMode ? '1px solid #3f3f46' : '1px solid #e4e4e7',
              background: darkMode ? 'var(--background)' : 'white',
              color: darkMode ? 'var(--foreground)' : '#18181b',
              boxShadow: 'none',
              minWidth: 0,
              maxWidth: '100%',
              textAlign: 'left',
            }}
          />
        ) : (
          <span
            className="text-base font-normal w-full text-left"
            style={{ color: darkMode ? 'var(--foreground)' : '#18181b', textAlign: 'left', width: '100%' }}
          >
            {value || <span className="text-zinc-300">-</span>}
          </span>
        )}
        <Edit2 className="w-4 h-4 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
      </div>
    </div>
  );
} 