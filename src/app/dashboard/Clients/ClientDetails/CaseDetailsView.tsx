import React, { useRef, useState } from "react";
import FileExplorer from "../FileExplorer";
import type { TransferFolderItem } from "../FileExplorer";
import type { Transfer } from "../ClientDetails";
import type { FolderOrFile } from "./pensionNewMoneyStructure";
import Stepper from "../Stepper";
import UploadModal from "../UploadModal";
import ChecklistReview from "../ChecklistReview";
import { CloudUpload } from "lucide-react";
import Image from "next/image";

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

  // Updated ESS Documents logic
  let essFiles: TransferFolderItem[] = [];
  if (caseData.ess && !caseData.essPartial) {
    essFiles = [
      { type: 'file', name: 'ESS' },
    ];
  } else if (caseData.ess && caseData.essPartial) {
    essFiles = [
      { type: 'file', name: 'ESS Partial' },
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
    <div className="min-h-0 flex flex-col h-full w-full overflow-hidden">
      {/* Progress Stepper */}
      <div className="w-full sm:px-8 sm:ml-16 pt-2">
        <div className="px-0 sm:pl-2 sm:pr-6 max-w-[98%]">
            <Stepper
              steps={stages}
              current={activeStageIdx}
              darkMode={darkMode}
              onStepClick={idx => idx !== activeStageIdx && setActiveStageIdx(idx)}
            />
          </div>
      </div>
      {/* Stage Content */}
      <div className="flex-1 min-h-0 flex flex-row w-full sm:px-8 sm:ml-16 overflow-hidden">
        {activeStage === 'CFR' && (
          <div className="w-full">
            <CfrUploadDropzones darkMode={darkMode} />
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
                <div style={{ flex: 1, padding: 16, paddingTop: 8 }}>
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
          <div className="flex flex-col w-full p-8 gap-10">
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
          <div className="flex flex-col w-full p-8 gap-10">
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
          <div className="flex flex-col w-full p-8 text-center text-lg text-zinc-400">
            <div>Suitability stage coming soon.</div>
          </div>
        )}
      </div>
      {/* Progress Navigation */}
    </div>)}

// --- CFR Upload Dropzones Component ---
function CfrUploadDropzones({ darkMode }: { darkMode: boolean }) {
  // State for each dropzone
  const [finalFiles, setFinalFiles] = useState<File[]>([]);
  const [v1Files, setV1Files] = useState<File[]>([]);
  const finalInputRef = useRef<HTMLInputElement>(null);
  const v1InputRef = useRef<HTMLInputElement>(null);
  const [finalDragActive, setFinalDragActive] = useState(false);
  const [v1DragActive, setV1DragActive] = useState(false);

  function handleDrop(e: React.DragEvent, setFiles: React.Dispatch<React.SetStateAction<File[]>>, setDrag: (v: boolean) => void) {
    e.preventDefault();
    e.stopPropagation();
    setDrag(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => {
        const all = [...prev, ...newFiles];
        const unique = all.filter((file, idx, arr) =>
          arr.findIndex(f => f.name === file.name && f.size === file.size) === idx
        );
        return unique;
      });
    }
  }
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, setFiles: React.Dispatch<React.SetStateAction<File[]>>) {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => {
        const all = [...prev, ...newFiles];
        const unique = all.filter((file, idx, arr) =>
          arr.findIndex(f => f.name === file.name && f.size === file.size) === idx
        );
        return unique;
      });
      e.target.value = "";
    }
  }
  function handleRemoveFile(idx: number, setFiles: React.Dispatch<React.SetStateAction<File[]>>) {
    setFiles(files => files.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex flex-col gap-8 w-full sm:flex-row sm:gap-8 sm:items-stretch h-full justify-center">
      {/* Final CFR Column */}
      <div className="flex flex-col flex-1 justify-center max-w-md mx-auto">
                  <div className="text-xl font-semibold text-center mb-1" style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}>
            Are you happy with the CFR already?
          </div>
          <div className="text-zinc-500 text-base max-w-xs text-center mb-6 mx-auto" style={{ color: darkMode ? '#a1a1aa' : '#64748b' }}>
            Upload a final CFR for this case.
          </div>
        <label
          className={`w-full rounded-2xl border flex flex-col items-center justify-center py-8 sm:py-10 px-2 sm:px-4 relative transition-colors cursor-pointer bg-white dark:bg-[var(--background)] ${finalDragActive ? 'ring-2 ring-blue-400 border-blue-400' : ''}`}
          style={{ minHeight: 260, borderColor: darkMode ? '#27272a' : '#e4e4e7', color: darkMode ? '#f4f4f5' : '#18181b' }}
          tabIndex={0}
          onDragOver={e => { e.preventDefault(); setFinalDragActive(true); }}
          onDragLeave={e => { e.preventDefault(); setFinalDragActive(false); }}
          onDrop={e => handleDrop(e, setFinalFiles, setFinalDragActive)}
          onClick={e => { if (e.target === e.currentTarget && finalInputRef.current) finalInputRef.current.click(); }}
        >
          <input
            ref={finalInputRef}
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={e => handleFileChange(e, setFinalFiles)}
          />
          <div className="relative mb-6 flex items-center justify-center" style={{ height: 96 }}>
            <Image src="/upload.svg" alt="Upload" width={96} height={96} className="mx-auto" />
            <span className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 border-4 border-white" style={{ boxShadow: '0 2px 8px 0 rgba(24, 80, 255, 0.10)' }}>
                <CloudUpload className="w-5 h-5 text-white" />
              </span>
            </span>
          </div>
          <div className="text-base mb-2 text-center">
            <span className="underline cursor-pointer">Click to upload</span> or drag and drop the final CFR here.
          </div>
          <div className="text-sm text-center mb-2 text-zinc-400 dark:text-zinc-500">
            Maximum file size: 200 MB <span className="mx-1">•</span> Supported file: PDF, Word, Excel
          </div>
          {finalFiles.length > 0 && (
            <div className="w-full max-w-md mx-auto mt-6" style={{ maxHeight: 220, overflowY: 'auto' }}>
              <div className="space-y-3">
                {finalFiles.map((file, idx) => (
                  <div key={file.name + file.size} className="flex items-center rounded-xl px-4 py-3 border" style={{ background: darkMode ? '#232329' : '#fff', borderColor: darkMode ? '#27272a' : '#e4e4e7' }}>
                    <span className="mr-3 text-zinc-400 dark:text-zinc-500">
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-medium truncate" style={{ color: darkMode ? '#f4f4f5' : '#18181b' }}>{file.name}</div>
                      <div className="text-xs text-zinc-400 dark:text-zinc-500">{(file.size / (1024 * 1024)).toFixed(1)}MB</div>
                    </div>
                    <button
                      className="ml-3 p-2 rounded-full hover:bg-red-50 transition"
                      aria-label="Remove file"
                      onClick={e => { e.preventDefault(); e.stopPropagation(); handleRemoveFile(idx, setFinalFiles); }}
                      type="button"
                    >
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 6v6m4-6v6"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </label>
      </div>
      {/* V1 CFR Column */}
      <div className="flex flex-col flex-1 justify-center max-w-md mx-auto">
                  <div className="text-xl font-semibold text-center mb-1" style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}>
            Do you want to check a CFR?
          </div>
          <div className="text-zinc-500 text-base max-w-xs text-center mb-6 mx-auto" style={{ color: darkMode ? '#a1a1aa' : '#64748b' }}>
            Upload a first version
          </div>
        <label
          className={`w-full rounded-2xl border flex flex-col items-center justify-center py-8 sm:py-10 px-2 sm:px-4 relative transition-colors cursor-pointer bg-white dark:bg-[var(--background)] ${v1DragActive ? 'ring-2 ring-blue-400 border-blue-400' : ''}`}
          style={{ minHeight: 260, borderColor: darkMode ? '#27272a' : '#e4e4e7', color: darkMode ? '#f4f4f5' : '#18181b' }}
          tabIndex={0}
          onDragOver={e => { e.preventDefault(); setV1DragActive(true); }}
          onDragLeave={e => { e.preventDefault(); setV1DragActive(false); }}
          onDrop={e => handleDrop(e, setV1Files, setV1DragActive)}
          onClick={e => { if (e.target === e.currentTarget && v1InputRef.current) v1InputRef.current.click(); }}
        >
          <input
            ref={v1InputRef}
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={e => handleFileChange(e, setV1Files)}
          />
          <div className="relative mb-6 flex items-center justify-center" style={{ height: 96 }}>
            <Image src="/upload.svg" alt="Upload" width={96} height={96} className="mx-auto" />
            <span className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 border-4 border-white" style={{ boxShadow: '0 2px 8px 0 rgba(24, 80, 255, 0.10)' }}>
                <CloudUpload className="w-5 h-5 text-white" />
              </span>
            </span>
          </div>
          <div className="text-base mb-2 text-center">
            <span className="underline cursor-pointer">Click to upload</span> or drag and drop the first version here.
          </div>
          <div className="text-sm text-center mb-2 text-zinc-400 dark:text-zinc-500">
            Maximum file size: 200 MB <span className="mx-1">•</span> Supported file: PDF, Word, Excel
          </div>
          {v1Files.length > 0 && (
            <div className="w-full max-w-md mx-auto mt-6" style={{ maxHeight: 220, overflowY: 'auto' }}>
              <div className="space-y-3">
                {v1Files.map((file, idx) => (
                  <div key={file.name + file.size} className="flex items-center rounded-xl px-4 py-3 border" style={{ background: darkMode ? '#232329' : '#fff', borderColor: darkMode ? '#27272a' : '#e4e4e7' }}>
                    <span className="mr-3 text-zinc-400 dark:text-zinc-500">
                      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-medium truncate" style={{ color: darkMode ? '#f4f4f5' : '#18181b' }}>{file.name}</div>
                      <div className="text-xs text-zinc-400 dark:text-zinc-500">{(file.size / (1024 * 1024)).toFixed(1)}MB</div>
                    </div>
                    <button
                      className="ml-3 p-2 rounded-full hover:bg-red-50 transition"
                      aria-label="Remove file"
                      onClick={e => { e.preventDefault(); e.stopPropagation(); handleRemoveFile(idx, setV1Files); }}
                      type="button"
                    >
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 6v6m4-6v6"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}
