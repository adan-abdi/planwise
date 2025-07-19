import React, { useRef, useState } from "react";
import type { TransferFolderItem } from "../FileExplorer";
import type { Transfer } from "../ClientDetails";
import type { FolderOrFile } from "./pensionNewMoneyStructure";
import Stepper from "../Stepper";
import ChecklistReview from "../ChecklistReview";
import { CloudUpload } from "lucide-react";
import Image from "next/image";
import CYCForm from './CYCForm';
import IllustrationForm from './IllustrationForm';
import CedingInformationStage from "./CedingInformationStage";

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

export default function CaseDetailsView({ caseExplorerPath, setCaseExplorerPath, setCaseSelectedDocument, darkMode, caseData, onAddTransfer }: CaseDetailsViewProps) {
  const [addTransferModalOpen, setAddTransferModalOpen] = useState(false);
  const [, setAddTransferType] = useState<'stocksAndShares' | 'cashIsa' | null>(null);
  const [, setAddTransferProvider] = useState('');
  const stages = ['CFR', 'Ceding Information', 'CYC', 'Illustration', 'Suitability'];
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const activeStage = stages[activeStageIdx];
  const [showChecklistReview, setShowChecklistReview] = useState<null | string>(null); // provider name or null
  const [showCycGoSection, setShowCycGoSection] = useState(false);
  const [showIllustrationSection, setShowIllustrationSection] = useState(false);
  // New state for CFR checklist review
  const [showCfrChecklistReview, setShowCfrChecklistReview] = useState(false);

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
    <div className="min-h-0 flex flex-col w-full box-border overflow-y-hidden sm:ml-16 sm:mr-8 max-w-[calc(1536px+20px)]">
      {/* Progress Stepper */}
      <div className="w-full box-border">
        <div className="px-0 sm:pl-2 sm:pr-6 max-w-full">
            <Stepper
              steps={stages}
              current={activeStageIdx}
              darkMode={darkMode}
              onStepClick={idx => idx !== activeStageIdx && setActiveStageIdx(idx)}
            />
          </div>
      </div>
      {/* Stage Content */}
      <div className="flex-1 min-h-0 min-h-[80vh] flex flex-col w-full box-border">
        {/* Header Section (add your sub-header or title here if needed) */}
        <div></div>
        {/* Content Section (centered) */}
        <div className="flex-1 flex items-center justify-center">
          {activeStage === 'CFR' && (
            <div className="w-full h-full flex items-center justify-center">
              {showCfrChecklistReview ? (
                <div className="min-h-0 flex w-full h-full border border-zinc-200 ml-2 rounded-md">
                  <ChecklistReview
                    checklistItems={[]}
                    reviewerName={"CFR"}
                    onBack={() => setShowCfrChecklistReview(false)}
                    title="CFR V1 checklist"
                    // @ts-expect-error: ChecklistReview expects style prop for layout but TS does not recognize it
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
              ) : (
                <div className="min-h-0 flex w-full h-full items-center justify-center">
                  <CfrUploadDropzones darkMode={darkMode} setActiveStageIdx={setActiveStageIdx} setShowCfrChecklistReview={setShowCfrChecklistReview} />
                </div>
              )}
            </div>
          )}
          {activeStage === 'Ceding Information' && (
            <div
              style={{
                minHeight: 700,
                flex: 1,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: '2px solid #e4e4e7', // zinc-200
                borderRadius: 6,
                background: '#fff',
                position: 'relative',
                ...(showChecklistReview ? {} : { marginTop: -48 }),
              }}
            >
              {showChecklistReview ? (
                <div style={{ flex: 1, minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <ChecklistReview
                    checklistItems={[]}
                    reviewerName={showChecklistReview}
                    onBack={() => setShowChecklistReview(null)}
                    title={showChecklistReview + ' checklist'}
                  />
                </div>
              ) : (
                <CedingInformationStage
                  caseExplorerPath={caseExplorerPath}
                  setCaseExplorerPath={setCaseExplorerPath}
                  setCaseSelectedDocument={setCaseSelectedDocument}
                  darkMode={darkMode}
                  getFolderContents={getFolderContents}
                  getDisplayName={getDisplayName}
                  getProviderName={getProviderName}
                  showChecklistReview={showChecklistReview}
                  setShowChecklistReview={setShowChecklistReview}
                  handlePlanFolderWithProvider={handlePlanFolderWithProvider}
                  addTransferModalOpen={addTransferModalOpen}
                  setAddTransferModalOpen={setAddTransferModalOpen}
                  handleAddTransfer={handleAddTransfer}
                />
              )}
            </div>
          )}
          {activeStage === 'CYC' && (
            <div className="h-full w-full flex">{showCycGoSection ? (
              <CYCForm darkMode={darkMode} />
            ) : (
              <CycUploadDropzones darkMode={darkMode} onGoClick={() => setShowCycGoSection(true)} />
            )}</div>
          )}
          {activeStage === 'Illustration' && (
            <div className="h-full w-full flex">{showIllustrationSection ? (
              <IllustrationForm darkMode={darkMode} onBack={() => setShowIllustrationSection(false)} />
            ) : (
              <IllustrationUploadDropzones darkMode={darkMode} onGoClick={() => setShowIllustrationSection(true)} />
            )}</div>
          )}
          {activeStage === 'Suitability' && (
            <div className="flex flex-col w-full h-full p-8 text-center text-lg text-zinc-400 items-center justify-center">
              <div>Suitability stage coming soon.</div>
            </div>
          )}
        </div>
      </div>
      {/* Progress Navigation */}
    </div>)}

// --- CFR Upload Dropzones Component ---
function CfrUploadDropzones({ darkMode, setActiveStageIdx, setShowCfrChecklistReview }: { darkMode: boolean; setActiveStageIdx: (idx: number) => void; setShowCfrChecklistReview?: (show: boolean) => void }) {
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
    <div className="flex flex-col gap-12 w-full sm:flex-row sm:gap-12 sm:items-stretch h-full justify-between h-full">
      {/* Final CFR Column */}
      <div className="flex flex-col flex-1 justify-center max-w-md mx-auto">
                  <div className="text-xl font-semibold text-center mb-1" style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}>
            Are you happy with the CFR already?
          </div>
          <div className="text-zinc-500 text-base max-w-xs text-center mb-6 mx-auto" style={{ color: darkMode ? '#a1a1aa' : '#64748b' }}>
            Upload a final CFR for this case.
          </div>
        <label
          className={`w-full rounded-2xl border flex flex-col items-center justify-center py-8 sm:py-10 px-2 sm:px-4 relative transition-colors cursor-pointer bg-white ${finalDragActive ? 'ring-2 ring-blue-400 border-blue-400' : ''} ${(v1Files.length > 0) ? 'opacity-50 pointer-events-none' : ''}`}
          style={{ minHeight: 260, borderColor: darkMode ? '#27272a' : '#e4e4e7', color: darkMode ? '#f4f4f5' : '#18181b', background: '#fff', position: 'relative' }}
          tabIndex={0}
          onDragOver={e => { if (!v1Files.length) { e.preventDefault(); setFinalDragActive(true); } }}
          onDragLeave={e => { if (!v1Files.length) { e.preventDefault(); setFinalDragActive(false); } }}
          onDrop={e => { if (!v1Files.length) handleDrop(e, setFinalFiles, setFinalDragActive); }}
          onClick={e => { if (!v1Files.length && e.target === e.currentTarget && finalInputRef.current) finalInputRef.current.click(); }}
        >
          <input
            ref={finalInputRef}
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={e => handleFileChange(e, setFinalFiles)}
            disabled={v1Files.length > 0}
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
            <>
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
              <button
                type="button"
                className="w-full mt-4 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition"
                onClick={() => { setActiveStageIdx(1); }}
                aria-label="Continue with Final CFR"
              >
                Continue
              </button>
            </>
          )}
          {v1Files.length > 0 && (
            <div style={{ position: 'absolute', inset: 0, background: darkMode ? 'rgba(24,24,27,0.7)' : 'rgba(243,244,246,0.7)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16 }}>
              <span style={{ color: darkMode ? '#f4f4f5' : '#18181b', fontWeight: 600, fontSize: 18, textAlign: 'center', padding: 16 }}>
                Please clear the other upload area to continue
              </span>
            </div>
          )}
        </label>
      </div>
      {/* V1 CFR Column */}
      <div className="flex flex-col flex-1 justify-center max-w-md mx-auto">
                  <div className="text-xl font-semibold text-center mb-1" style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}>
            Or do you want to check a CFR?
          </div>
          <div className="text-zinc-500 text-base max-w-xs text-center mb-6 mx-auto" style={{ color: darkMode ? '#a1a1aa' : '#64748b' }}>
            Upload a first version
          </div>
        <label
          className={`w-full rounded-2xl border flex flex-col items-center justify-center py-8 sm:py-10 px-2 sm:px-4 relative transition-colors cursor-pointer bg-white ${v1DragActive ? 'ring-2 ring-blue-400 border-blue-400' : ''} ${(finalFiles.length > 0) ? 'opacity-50 pointer-events-none' : ''}`}
          style={{ minHeight: 260, borderColor: darkMode ? '#27272a' : '#e4e4e7', color: darkMode ? '#f4f4f5' : '#18181b', background: '#fff', position: 'relative' }}
          tabIndex={0}
          onDragOver={e => { if (!finalFiles.length) { e.preventDefault(); setV1DragActive(true); } }}
          onDragLeave={e => { if (!finalFiles.length) { e.preventDefault(); setV1DragActive(false); } }}
          onDrop={e => { if (!finalFiles.length) handleDrop(e, setV1Files, setV1DragActive); }}
          onClick={e => { if (!finalFiles.length && e.target === e.currentTarget && v1InputRef.current) v1InputRef.current.click(); }}
        >
          <input
            ref={v1InputRef}
            type="file"
            accept="application/pdf"
            multiple
            className="hidden"
            onChange={e => handleFileChange(e, setV1Files)}
            disabled={finalFiles.length > 0}
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
            <>
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
              <button
                type="button"
                className="w-full mt-4 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition"
                onClick={() => { if (setShowCfrChecklistReview) setShowCfrChecklistReview(true); }}
                aria-label="Continue with V1 CFR"
              >
                Continue
              </button>
            </>
          )}
          {finalFiles.length > 0 && (
            <div style={{ position: 'absolute', inset: 0, background: darkMode ? 'rgba(24,24,27,0.7)' : 'rgba(243,244,246,0.7)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 16 }}>
              <span style={{ color: darkMode ? '#f4f4f5' : '#18181b', fontWeight: 600, fontSize: 18, textAlign: 'center', padding: 16 }}>
                Please clear the other upload area to continue
              </span>
            </div>
          )}
        </label>
      </div>
    </div>
  );
}

// --- CYC Upload Dropzones Component ---
function CycUploadDropzones({ darkMode, onGoClick }: { darkMode: boolean; onGoClick: () => void }) {
  // State for each dropzone
  const [finalFiles, setFinalFiles] = useState<File[]>([]);
  const finalInputRef = useRef<HTMLInputElement>(null);
  const [finalDragActive, setFinalDragActive] = useState(false);

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
      {/* Final CYC Column */}
      <div className="flex flex-col flex-1 justify-center max-w-md mx-auto">
        <div className="text-xl font-semibold text-center mb-1" style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}>
          Are you happy with the CYC already?
        </div>
        <div className="text-zinc-500 text-base max-w-xs text-center mb-6 mx-auto" style={{ color: darkMode ? '#a1a1aa' : '#64748b' }}>
          Upload a final CYC for this case.
        </div>
        <label
          className={`w-full rounded-2xl border flex flex-col items-center justify-center py-8 sm:py-10 px-2 sm:px-4 relative transition-colors cursor-pointer bg-white ${finalDragActive ? 'ring-2 ring-blue-400 border-blue-400' : ''}`}
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
            <span className="underline cursor-pointer">Click to upload</span> or drag and drop the final CYC here.
          </div>
          <div className="text-sm text-center mb-2 text-zinc-400 dark:text-zinc-500">
            Maximum file size: 200 MB <span className="mx-1">•</span> Supported file: PDF, Word, Excel
          </div>
          {finalFiles.length > 0 && (
            <>
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
              <button
                type="button"
                className="w-full mt-4 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition"
                onClick={() => { console.log('Continue Final CFR clicked'); }}
                aria-label="Continue with Final CFR"
              >
                Continue
              </button>
            </>
          )}
        </label>
      </div>
      {/* Help me complete the CYC Column */}
      <div className="flex flex-col flex-1 justify-center max-w-md mx-auto items-center">
        <div className="text-xl font-semibold text-center mb-1" style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}>
          Help me complete the CYC.
        </div>
        <button
          type="button"
          className="px-4 py-2 rounded-lg border border-blue-600 bg-blue-600 text-white font-medium transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed mt-4"
          onClick={onGoClick}
        >
          Go
        </button>
      </div>
    </div>
  );
}

// --- Illustration Upload Dropzones Component ---
function IllustrationUploadDropzones({ darkMode, onGoClick }: { darkMode: boolean; onGoClick: () => void }) {
  // State for each dropzone
  const [finalFiles, setFinalFiles] = useState<File[]>([]);
  const finalInputRef = useRef<HTMLInputElement>(null);
  const [finalDragActive, setFinalDragActive] = useState(false);

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
      {/* Final Illustration Column */}
      <div className="flex flex-col flex-1 justify-center max-w-md mx-auto">
        <div className="text-xl font-semibold text-center mb-1" style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}>
          Are you happy with the Illustration?
        </div>
        <div className="text-zinc-500 text-base max-w-xs text-center mb-6 mx-auto" style={{ color: darkMode ? '#a1a1aa' : '#64748b' }}>
          Upload a final Illustration for this case.
        </div>
        <label
          className={`w-full rounded-2xl border flex flex-col items-center justify-center py-8 sm:py-10 px-2 sm:px-4 relative transition-colors cursor-pointer bg-white ${finalDragActive ? 'ring-2 ring-blue-400 border-blue-400' : ''}`}
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
            <span className="underline cursor-pointer">Click to upload</span> or drag and drop the final Illustration here.
          </div>
          <div className="text-sm text-center mb-2 text-zinc-400 dark:text-zinc-500">
            Maximum file size: 200 MB <span className="mx-1">•</span> Supported file: PDF, Word, Excel
          </div>
          {finalFiles.length > 0 && (
            <>
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
              <button
                type="button"
                className="w-full mt-4 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition"
                onClick={() => { console.log('Continue Final CFR clicked'); }}
                aria-label="Continue with Final CFR"
              >
                Continue
              </button>
            </>
          )}
        </label>
      </div>
      {/* Help me complete the Illustration Column */}
      <div className="flex flex-col flex-1 justify-center max-w-md mx-auto items-center">
        <div className="text-xl font-semibold text-center mb-1" style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}>
          Help me complete the Illustration.
        </div>
        <button
          type="button"
          className="px-4 py-2 rounded-lg border border-blue-600 bg-blue-600 text-white font-medium transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed mt-4"
          onClick={onGoClick}
        >
          Go
        </button>
      </div>
    </div>
  );
}
