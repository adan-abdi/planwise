import React from "react";
import FileExplorer from "../FileExplorer";
import type { TransferFolderItem } from "../FileExplorer";
import type { Transfer } from "../ClientDetails";
import { useState } from "react";
import type { FolderOrFile } from "./pensionNewMoneyStructure";
import Stepper from "../Stepper";
import UploadModal from "../UploadModal";
import ChecklistReview from "../ChecklistReview";

interface CaseDetailsViewProps {
  caseExplorerPath: string[];
  setCaseExplorerPath: (path: string[]) => void;
  caseSelectedDocument: TransferFolderItem | null;
  setCaseSelectedDocument: (doc: TransferFolderItem | null) => void;
  darkMode: boolean;
  onUploadModal: () => void;
  caseData: {
    id: string;
    createdAt: string;
    caseType: string;
    transfers: Transfer[];
    ess?: boolean;
    essPartial?: boolean;
    documents?: FolderOrFile[];
    single?: { checked: boolean; type: 'personal' | 'employer' | null };
    regular?: { checked: boolean; type: 'personal' | 'employer' | null };
    carryForward?: boolean;
    // ...other fields as needed
  };
  onAddTransfer: (transfer: Transfer) => void;
}

function generatePensionTransferFolderContents(caseData: CaseDetailsViewProps["caseData"]): TransferFolderItem[] {
  const providerFolders = (caseData.transfers || []).map((t, idx) => ({
    type: 'folder' as const,
    name: `Ceding ${idx + 1}`,
    // No children, not openable
  }));

  // ESS Documents logic: move files to root
  let essFiles: TransferFolderItem[] = [];
  if (caseData.ess && caseData.essPartial) {
    essFiles = [
      { type: 'file', name: 'ESS Illustration (full + partial)' },
      { type: 'file', name: 'ESS' },
      { type: 'file', name: 'Partial ESS Breakdown' },
    ];
  } else if (!caseData.ess && caseData.essPartial) {
    essFiles = [
      { type: 'file', name: 'Partial ESS Breakdown' },
    ];
  } else if (caseData.ess && !caseData.essPartial) {
    essFiles = [
      { type: 'file', name: 'ESS' },
    ];
  }

  return [
    ...providerFolders,
    ...essFiles,
  ];
}

function generateISATransferFolderContents(caseData: CaseDetailsViewProps["caseData"]): TransferFolderItem[] {
  // Use explicit isaType field for grouping
  const sAndSProviders = (caseData.transfers || []).filter(t => t.isaType === 'stocksAndShares');
  const cashISAProviders = (caseData.transfers || []).filter(t => t.isaType === 'cashIsa');

  const sAndSProviderFolders = sAndSProviders.map((t, idx) => ({
    type: 'folder' as const,
    name: `Stocks & Shares Ceding ${idx + 1}`,
    // No children, not openable
  }));

  const cashISAProviderFolders = cashISAProviders.map((t, idx) => ({
    type: 'folder' as const,
    name: `Cash ISA Ceding ${idx + 1}`,
    // No children, not openable
  }));

  return [
    ...sAndSProviderFolders,
    ...cashISAProviderFolders,
  ];
}

/**
 * Map folder display names for FileExplorer.
 * If the folder name matches 'Ceding X', display as 'Plan X'.
 * If the folder name matches 'Stocks & Shares Ceding X' or 'Cash ISA Ceding X', display as 'Plan X'.
 * Otherwise, return the original name.
 */
function getDisplayName(name: string): string {
  // Pension Transfer: 'Ceding 1', 'Ceding 2', ...
  const cedingMatch = name.match(/^Ceding (\d+)$/);
  if (cedingMatch) return `Plan ${cedingMatch[1]}`;
  // ISA Transfer: 'Stocks & Shares Ceding 1', 'Cash ISA Ceding 2', ...
  const isaMatch = name.match(/^(Stocks & Shares Ceding|Cash ISA Ceding) (\d+)$/);
  if (isaMatch) return `Plan ${isaMatch[2]}`;
  return name;
}

export default function CaseDetailsView({ caseExplorerPath, setCaseExplorerPath, setCaseSelectedDocument, darkMode, onUploadModal, caseData, onAddTransfer }: CaseDetailsViewProps) {
  const [addTransferModalOpen, setAddTransferModalOpen] = useState(false);
  const [, setAddTransferType] = useState<'stocksAndShares' | 'cashIsa' | null>(null);
  const [, setAddTransferProvider] = useState('');
  const [cfrModalOpen, setCfrModalOpen] = useState(false);
  const stages = ['CFR', 'Ceding Information', 'CYC', 'Illustration', 'Suitability'];
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const activeStage = stages[activeStageIdx];
  const [showChecklistReview, setShowChecklistReview] = useState<null | string>(null); // provider name or null

  function handlePlanFolderWithProvider(providerName: string) {
    setShowChecklistReview(providerName);
  }

  // Use the generator for Pension Transfer cases
  const folderContents =
    caseData.caseType === 'Pension Transfer'
      ? generatePensionTransferFolderContents(caseData)
      : caseData.caseType === 'ISA Transfer'
        ? generateISATransferFolderContents(caseData)
        : (["Pension New Money", "ISA New Money"].includes(caseData.caseType) && Array.isArray(caseData.documents))
          ? caseData.documents as TransferFolderItem[]
          : [];

  // Helper to traverse the folder structure by path
  function getFolderContents(path: string[]): TransferFolderItem[] {
    let current: TransferFolderItem[] = folderContents;
    for (const segment of path) {
      const found = current.find(item => item.type === 'folder' && item.name === segment);
      if (found && found.type === 'folder' && found.children) {
        current = found.children;
      } else {
        return [];
      }
    }
    return current;
  }

  // Add Transfer handler
  function handleAddTransfer() {
    if (caseData.caseType === 'Pension Transfer') {
      onAddTransfer({
        transferType: 'pensionTransfer',
        provider: '',
      });
    } else if (caseData.caseType === 'ISA Transfer') {
      onAddTransfer({
        transferType: 'isaTransfer',
        provider: '',
        isaType: 'stocksAndShares', // or default to one type
      });
    } else if (caseData.caseType === 'Pension New Money') {
      onAddTransfer({
        transferType: 'pensionNewMoney',
        provider: '',
      });
    } else if (caseData.caseType === 'ISA New Money') {
      onAddTransfer({
        transferType: 'isaNewMoney',
        provider: '',
      });
    }
    setAddTransferProvider('');
    setAddTransferType(null);
    setAddTransferModalOpen(false);
  }

  function getProviderName(name: string): string | undefined {
    // Pension Transfer: 'Ceding 1', 'Ceding 2', ...
    let match = name.match(/^Ceding (\d+)$/);
    if (match) {
      const idx = parseInt(match[1], 10) - 1;
      return caseData.transfers[idx]?.provider || undefined;
    }
    // ISA Transfer: 'Stocks & Shares Ceding 1', 'Cash ISA Ceding 2', ...
    match = name.match(/^(Stocks & Shares Ceding|Cash ISA Ceding) (\d+)$/);
    if (match) {
      const idx = parseInt(match[2], 10) - 1;
      // Find the correct transfer by type and index
      if (match[1] === 'Stocks & Shares Ceding') {
        const sAndS = caseData.transfers.filter((t: Transfer) => t.isaType === 'stocksAndShares');
        return sAndS[idx]?.provider || undefined;
      } else if (match[1] === 'Cash ISA Ceding') {
        const cash = caseData.transfers.filter((t: Transfer) => t.isaType === 'cashIsa');
        return cash[idx]?.provider || undefined;
      }
    }
    return undefined;
  }

  return (
    <div className="min-h-0 flex flex-col h-full w-full pl-4">
      {/* Progress Stepper */}
      <div className="pt-6 pb-4 w-full">
        <Stepper
          steps={stages}
          current={activeStageIdx}
          darkMode={darkMode}
          onStepClick={idx => idx !== activeStageIdx && setActiveStageIdx(idx)}
        />
      </div>
      {/* Stage Content */}
      <div className="flex-1 min-h-0 flex flex-row w-full items-center justify-center">
        {activeStage === 'CFR' && (
          <div className="flex flex-col w-full items-center justify-center p-8 gap-10">
            {/* Section: Upload Final CFR */}
            <div className="flex flex-col items-center gap-3 w-full max-w-md">
              <div className="font-semibold text-2xl mb-0 text-center" style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}>
                Are you happy with the CFR already?
              </div>
              <div className="text-zinc-500 text-base max-w-xs text-center mb-2" style={{ color: darkMode ? '#a1a1aa' : '#64748b' }}>
                Upload a final CFR for this case.
              </div>
              <button
                type="button"
                onClick={() => setCfrModalOpen(true)}
                className="px-4 py-2 rounded-lg border border-blue-600 bg-blue-600 text-white font-medium transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                Upload Final CFR
              </button>
            </div>
            <UploadModal open={cfrModalOpen} onClose={() => setCfrModalOpen(false)} />
            {/* Divider between sections */}
            <div className="flex items-center w-full max-w-md my-14">
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
              <span className="mx-4 text-zinc-400 text-sm select-none">or</span>
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>
            {/* Section: Upload V1 CFR */}
            <div className="flex flex-col items-center gap-3 w-full max-w-md mt-2">
              <div className="font-semibold text-2xl mb-0 text-center" style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}>
                Do you want to check a CFR?
              </div>
              <div className="text-zinc-500 text-base max-w-xs text-center mb-2" style={{ color: darkMode ? '#a1a1aa' : '#64748b' }}>
                Upload a first version
              </div>
              <button
                type="button"
                onClick={() => setCfrModalOpen(true)}
                className="px-4 py-2 rounded-lg border border-blue-600 bg-blue-600 text-white font-medium transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                Upload V1 CFR
              </button>
            </div>
          </div>
        )}
        {activeStage === 'Ceding Information' && (
          showChecklistReview ? (
            <ChecklistReview checklistItems={[]} reviewerName={showChecklistReview} onBack={() => setShowChecklistReview(null)} />
          ) : (
            <div className="flex flex-row h-full w-full min-h-0">
              {/* --- All previous explorer/transfer UI goes here --- */}
              <div
                className="w-full min-w-0 flex flex-col min-h-0 h-full"
                style={{
                  background: darkMode ? '#222222' : '#ffffff',
                  // Remove borderRight since there is no document viewer
                  minWidth: 340,
                  transition: 'background 0.2s, border 0.2s',
                }}
              >
                <div style={{ padding: 16 }}>
                  {/* Breadcrumb for folder traversal */}
                  <nav
                    className="flex items-center gap-1 mb-2 select-none"
                    aria-label="Breadcrumb"
                    style={{ fontSize: 13, color: darkMode ? '#a1a1aa' : '#64748b', fontWeight: 500 }}
                  >
                    <span
                      style={{
                        color: caseExplorerPath.length === 0 ? (darkMode ? '#f1f5f9' : '#18181b') : (darkMode ? '#60a5fa' : '#2563eb'),
                        fontWeight: caseExplorerPath.length === 0 ? 700 : 500,
                        cursor: caseExplorerPath.length === 0 ? 'default' : 'pointer',
                        textDecoration: caseExplorerPath.length === 0 ? 'none' : 'underline',
                        letterSpacing: 0.1,
                        transition: 'color 0.2s',
                      }}
                      onClick={() => setCaseExplorerPath([])}
                    >
                      Transfers
                    </span>
                    {caseExplorerPath.map((segment, idx) => (
                      <React.Fragment key={idx}>
                        <span style={{ margin: '0 6px', color: darkMode ? '#63636f' : '#a1a1aa' }}>/</span>
                        <span
                          style={{
                            color: idx === caseExplorerPath.length - 1 ? (darkMode ? '#f1f5f9' : '#18181b') : (darkMode ? '#60a5fa' : '#2563eb'),
                            fontWeight: idx === caseExplorerPath.length - 1 ? 700 : 500,
                            cursor: idx === caseExplorerPath.length - 1 ? 'default' : 'pointer',
                            textDecoration: idx === caseExplorerPath.length - 1 ? 'none' : 'underline',
                            letterSpacing: 0.1,
                            transition: 'color 0.2s',
                          }}
                          onClick={() => setCaseExplorerPath(caseExplorerPath.slice(0, idx + 1))}
                        >
                          {segment}
                        </span>
                      </React.Fragment>
                    ))}
                  </nav>
                </div>
                <div style={{ flex: 1, overflow: 'auto', padding: 16, paddingTop: 8 }}>
                  <FileExplorer
                    transferPath={caseExplorerPath}
                    getFolderContents={getFolderContents}
                    handleEnterFolder={name => setCaseExplorerPath([...caseExplorerPath, name])}
                    handleUploadModal={onUploadModal}
                    setSelectedDocument={item => {
                      setCaseSelectedDocument(item);
                    }}
                    clickableLineClass="text-blue-600 hover:underline cursor-pointer"
                    getDisplayName={getDisplayName}
                    getProviderName={getProviderName}
                    onPlanFolderWithProvider={handlePlanFolderWithProvider}
                  />
                  {/* Add Transfer special box at root only, now below folders */}
                  {caseExplorerPath.length === 0 && (
                    <div
                      onClick={() => setAddTransferModalOpen(true)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        marginTop: 16,
                        padding: '6px 0',
                        borderRadius: 8,
                        border: `2px dashed ${darkMode ? '#60a5fa' : '#2563eb'}`,
                        background: darkMode ? '#232329' : '#e0e7ef',
                        color: darkMode ? '#60a5fa' : '#2563eb',
                        fontWeight: 500,
                        fontSize: 14,
                        cursor: 'pointer',
                        transition: 'background 0.2s, border 0.2s',
                        width: 160,
                      }}
                    >
                      Add Plan
                    </div>
                  )}
                </div>
                {/* Modal for adding transfer */}
                {addTransferModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/60 dark:bg-black/60 backdrop-blur-sm transition-all px-2 sm:px-0 overflow-y-auto">
                    <div className="bg-[var(--background)] rounded-2xl shadow-2xl w-full max-w-md relative border border-[var(--border)] flex flex-col mx-auto my-2 sm:my-0 max-h-[80vh] overflow-visible">
                      <div className="px-4 sm:px-6 py-2 border-b border-[var(--border)] rounded-t-2xl bg-[var(--muted)] dark:bg-[var(--muted)] flex items-center justify-between">
                        <span className="text-zinc-400 font-medium text-base">Add new {caseData.caseType}</span>
                        <button
                          className="text-zinc-400 hover:text-zinc-600 text-xl font-bold"
                          onClick={() => setAddTransferModalOpen(false)}
                          aria-label="Close"
                          style={{ lineHeight: 1 }}
                        >
                          ×
                        </button>
                      </div>
                      <div className="flex flex-col gap-0 px-4 sm:px-6 pt-3 pb-1 space-y-2">
                        <div className="flex justify-end gap-2 mt-4 pb-4">
                          <button
                            className="px-4 py-2 rounded-lg border border-blue-600 bg-blue-600 text-white font-medium transition hover:bg-blue-700"
                            onClick={handleAddTransfer}
                            type="button"
                          >
                            Add Transfer
                          </button>
                          <button
                            className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-zinc-500 font-medium transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            onClick={() => setAddTransferModalOpen(false)}
                            type="button"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {/* DocumentViewer and its container removed for Ceeding stage */}
            </div>
          )
        )}
        {activeStage === 'CYC' && (
          <div className="flex flex-col w-full items-center justify-center p-8 gap-10">
            {/* Section: Upload Final CYC */}
            <div className="flex flex-col items-center gap-3 w-full max-w-md">
              <div className="font-semibold text-2xl mb-0 text-center" style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}>
                Are you happy with the CYC already?
              </div>
              <div className="text-zinc-500 text-base max-w-xs text-center mb-2" style={{ color: darkMode ? '#a1a1aa' : '#64748b' }}>
                Upload a final CYC for this case.
              </div>
              <button
                type="button"
                onClick={() => setCfrModalOpen(true)}
                className="px-4 py-2 rounded-lg border border-blue-600 bg-blue-600 text-white font-medium transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                Upload Final CYC
              </button>
            </div>
            <UploadModal open={cfrModalOpen} onClose={() => setCfrModalOpen(false)} />
            {/* Divider between sections */}
            <div className="flex items-center w-full max-w-md my-14">
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
              <span className="mx-4 text-zinc-400 text-sm select-none">or</span>
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>
            {/* Section: Upload V1 CYC */}
            <div className="flex flex-col items-center gap-3 w-full max-w-md mt-2">
              <div className="font-semibold text-2xl mb-0 text-center" style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}>
                Help me complete the CYC.
              </div>
              <button
                type="button"
                onClick={() => setCfrModalOpen(true)}
                className="px-4 py-2 rounded-lg border border-blue-600 bg-blue-600 text-white font-medium transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                Go
              </button>
            </div>
          </div>
        )}
        {activeStage === 'Illustration' && (
          <div className="flex flex-col w-full items-center justify-center p-8 gap-10">
            {/* Section: Upload Final Illustration */}
            <div className="flex flex-col items-center gap-3 w-full max-w-md">
              <div className="font-semibold text-2xl mb-0 text-center" style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}>
                Are you happy with the Illustration?
              </div>
              <div className="text-zinc-500 text-base max-w-xs text-center mb-2" style={{ color: darkMode ? '#a1a1aa' : '#64748b' }}>
                Upload a final Illustration for this case.
              </div>
              <button
                type="button"
                onClick={() => setCfrModalOpen(true)}
                className="px-4 py-2 rounded-lg border border-blue-600 bg-blue-600 text-white font-medium transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                Upload Final Illustration
              </button>
            </div>
            <UploadModal open={cfrModalOpen} onClose={() => setCfrModalOpen(false)} />
            {/* Divider between sections */}
            <div className="flex items-center w-full max-w-md my-14">
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
              <span className="mx-4 text-zinc-400 text-sm select-none">or</span>
              <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>
            {/* Section: Help with Illustration */}
            <div className="flex flex-col items-center gap-3 w-full max-w-md mt-2">
              <div className="font-semibold text-2xl mb-0 text-center" style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}>
                Help me complete the Illustration.
              </div>
              <button
                type="button"
                onClick={() => setCfrModalOpen(true)}
                className="px-4 py-2 rounded-lg border border-blue-600 bg-blue-600 text-white font-medium transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                Go
              </button>
            </div>
          </div>
        )}
        {activeStage === 'Suitability' && (
          <div className="flex flex-col w-full items-center justify-center p-8 text-center text-lg text-zinc-400">
            <div>Suitability stage coming soon.</div>
          </div>
        )}
      </div>
      {/* Progress Navigation */}
    </div>)}
