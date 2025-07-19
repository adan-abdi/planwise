import React, { useState } from "react";
import FileExplorer from "../FileExplorer";
import ChecklistReview from "../ChecklistReview";
import type { TransferFolderItem } from "../FileExplorer";
import CFRUploadModal from "./CFRUploadModal";

interface CedingInformationStageProps {
  caseExplorerPath: string[];
  setCaseExplorerPath: (path: string[]) => void;
  setCaseSelectedDocument: (doc: TransferFolderItem | null) => void;
  darkMode: boolean;
  getFolderContents: (path: string[]) => TransferFolderItem[];
  getDisplayName: (name: string) => string;
  getProviderName: (name: string) => string | undefined;
  showChecklistReview: string | null;
  setShowChecklistReview: (name: string | null) => void;
  handlePlanFolderWithProvider: (providerName: string) => void;
  addTransferModalOpen: boolean;
  setAddTransferModalOpen: (open: boolean) => void;
  handleAddTransfer: () => void;
}

const CedingInformationStage: React.FC<CedingInformationStageProps> = ({
  caseExplorerPath,
  setCaseExplorerPath,
  setCaseSelectedDocument,
  darkMode,
  getFolderContents,
  getDisplayName,
  getProviderName,
  showChecklistReview,
  setShowChecklistReview,
  handlePlanFolderWithProvider,
  addTransferModalOpen,
  setAddTransferModalOpen,
  handleAddTransfer,
}) => {
  const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
  const [pendingChecklistTitle, setPendingChecklistTitle] = React.useState<string | null>(null);

  return (
    <div className="flex flex-row h-full w-full min-h-0">
      <div
        className="w-full min-w-0 flex flex-col min-h-0 h-full ml-2 mr-2"
        style={{
          background: darkMode ? '#222222' : '#ffffff',
          minWidth: 340,
          transition: 'background 0.2s, border 0.2s',
          borderRadius: 10,
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
          <>
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
                handleUploadModal={() => {
                  const currentName = caseExplorerPath.length > 0 ? caseExplorerPath[caseExplorerPath.length - 1] : 'Plan';
                  const cedingTitle = getProviderName(currentName) || currentName;
                  setPendingChecklistTitle(cedingTitle);
                  setUploadModalOpen(true);
                }}
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
              {/* Upload Modal for plan checklist */}
              <CFRUploadModal
                open={uploadModalOpen}
                onClose={() => { setUploadModalOpen(false); setPendingChecklistTitle(null); }}
                fileName={pendingChecklistTitle || undefined}
                onShowReviewChecklist={() => {
                  setUploadModalOpen(false);
                  if (pendingChecklistTitle) setShowChecklistReview(pendingChecklistTitle);
                  setPendingChecklistTitle(null);
                }}
              />
            </div>
            {addTransferModalOpen && (
              <AddTransferModal
                darkMode={darkMode}
                onClose={() => setAddTransferModalOpen(false)}
                onAdd={handleAddTransfer}
              />
            )}
          </>
        )}
      </div>
      {/* DocumentViewer and its container removed for Ceeding stage */}
    </div>
  );
};

// --- Add Transfer Modal ---
function AddTransferModal({ darkMode, onClose, onAdd }: { darkMode: boolean; onClose: () => void; onAdd: () => void }) {
  const [numTransfers, setNumTransfers] = useState(1);
  const [ess, setEss] = useState<boolean | null>(null);
  const [essPartial, setEssPartial] = useState<boolean | null>(null);

  // Handlers to enforce ESS/ESS Partial logic
  const handleEssChange = (value: boolean) => {
    setEss(value);
    if (value === false && essPartial === true) {
      setEssPartial(false);
    }
  };
  const handleEssPartialChange = (value: boolean) => {
    setEssPartial(value);
    if (value === true && ess === false) {
      setEss(true);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.25)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: darkMode ? '#232329' : '#fff',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        padding: '32px 32px 24px 32px',
        minWidth: 320,
        maxWidth: '90vw',
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>Number of Transfers</label>
          <input
            type="number"
            min={1}
            value={numTransfers}
            onChange={e => setNumTransfers(Number(e.target.value))}
            style={{ width: '100%', borderRadius: 8, border: '1px solid #e4e4e7', padding: '8px 12px', fontSize: 16, background: darkMode ? '#18181b' : '#fff', color: darkMode ? '#f4f4f5' : '#18181b' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 24, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>ESS</label>
            <div style={{ display: 'flex', gap: 12 }}>
              <TickCheckbox checked={ess === true} onChange={() => handleEssChange(true)} label="Yes" />
              <TickCheckbox checked={ess === false} onChange={() => handleEssChange(false)} label="No" />
            </div>
          </div>
          {ess !== false && (
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontWeight: 500, marginBottom: 6 }}>ESS Partial?</label>
              <div style={{ display: 'flex', gap: 12 }}>
                <TickCheckbox checked={essPartial === true} onChange={() => handleEssPartialChange(true)} label="Yes" />
                <TickCheckbox checked={essPartial === false} onChange={() => handleEssPartialChange(false)} label="No" />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 rounded-lg border border-blue-600 bg-blue-600 text-white font-medium transition hover:bg-blue-700"
            onClick={onAdd}
            type="button"
          >
            Add Transfer
          </button>
          <button
            className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-zinc-500 font-medium transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// --- TickCheckbox helper ---
function TickCheckbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', userSelect: 'none' }}>
      <span style={{ position: 'relative', width: 18, height: 18, display: 'inline-block' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={{ width: 18, height: 18, borderRadius: 4, border: '2px solid #2563eb', background: '#fff', appearance: 'none', outline: 'none', cursor: 'pointer' }}
        />
        {checked && (
          <svg viewBox="0 0 16 16" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: 2, top: 2, width: 14, height: 14, pointerEvents: 'none' }}>
            <polyline points="3.5 8.5 7 12 12.5 5.5" />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}

export default CedingInformationStage; 