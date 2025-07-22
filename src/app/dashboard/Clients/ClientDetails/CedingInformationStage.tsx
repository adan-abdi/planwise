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

  // Dark mode color variables
  const colors = {
    // Background colors
    mainBg: darkMode ? '#1e1e1e' : '#ffffff',
    containerBg: darkMode ? '#2a2a2a' : '#f8fafc',
    addPlanBg: darkMode ? '#1e293b' : '#e0e7ef',
    
    // Border colors
    border: darkMode ? '#404040' : '#e4e4e7',
    addPlanBorder: darkMode ? '#3b82f6' : '#2563eb',
    
    // Text colors
    textPrimary: darkMode ? '#f1f5f9' : '#18181b',
    textSecondary: darkMode ? '#a1a1aa' : '#64748b',
    textMuted: darkMode ? '#71717a' : '#9ca3af',
    textLink: darkMode ? '#60a5fa' : '#2563eb',
    textLinkActive: darkMode ? '#f1f5f9' : '#18181b',
    
    // Interactive colors
    linkHover: darkMode ? '#93c5fd' : '#1d4ed8',
    addPlanHover: darkMode ? '#1e40af' : '#dbeafe',
  };

  return (
    <div className="flex flex-row h-full w-full min-h-0">
      <div
        className="w-full min-w-0 flex flex-col min-h-0 h-full"
        style={{
          background: colors.mainBg,
          minWidth: 340,
          transition: 'all 0.2s ease-in-out',
        }}
      >
        {showChecklistReview ? (
          <div style={{ flex: 1, minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: darkMode ? 'var(--muted)' : 'white' }}>
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
                style={{ 
                  fontSize: 13, 
                  color: colors.textSecondary, 
                  fontWeight: 500 
                }}
              >
                <span
                  style={{
                    color: caseExplorerPath.length === 0 ? colors.textLinkActive : colors.textLink,
                    fontWeight: caseExplorerPath.length === 0 ? 700 : 500,
                    cursor: caseExplorerPath.length === 0 ? 'default' : 'pointer',
                    textDecoration: caseExplorerPath.length === 0 ? 'none' : 'underline',
                    letterSpacing: 0.1,
                    transition: 'color 0.2s ease-in-out',
                  }}
                  onClick={() => setCaseExplorerPath([])}
                  onMouseEnter={(e) => {
                    if (caseExplorerPath.length > 0) {
                      e.currentTarget.style.color = colors.linkHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (caseExplorerPath.length > 0) {
                      e.currentTarget.style.color = colors.textLink;
                    }
                  }}
                >
                  Transfers
                </span>
                {caseExplorerPath.map((segment, idx) => (
                  <React.Fragment key={idx}>
                    <span style={{ 
                      margin: '0 6px', 
                      color: colors.textMuted 
                    }}>/</span>
                    <span
                      style={{
                        color: idx === caseExplorerPath.length - 1 ? colors.textLinkActive : colors.textLink,
                        fontWeight: idx === caseExplorerPath.length - 1 ? 700 : 500,
                        cursor: idx === caseExplorerPath.length - 1 ? 'default' : 'pointer',
                        textDecoration: idx === caseExplorerPath.length - 1 ? 'none' : 'underline',
                        letterSpacing: 0.1,
                        transition: 'color 0.2s ease-in-out',
                      }}
                      onClick={() => setCaseExplorerPath(caseExplorerPath.slice(0, idx + 1))}
                      onMouseEnter={(e) => {
                        if (idx !== caseExplorerPath.length - 1) {
                          e.currentTarget.style.color = colors.linkHover;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (idx !== caseExplorerPath.length - 1) {
                          e.currentTarget.style.color = colors.textLink;
                        }
                      }}
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
                    padding: '12px 16px',
                    borderRadius: 8,
                    border: `2px dashed ${colors.addPlanBorder}`,
                    background: colors.addPlanBg,
                    color: colors.addPlanBorder,
                    fontWeight: 500,
                    fontSize: 14,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    width: 160,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.addPlanHover;
                    e.currentTarget.style.borderColor = colors.linkHover;
                    e.currentTarget.style.color = colors.linkHover;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colors.addPlanBg;
                    e.currentTarget.style.borderColor = colors.addPlanBorder;
                    e.currentTarget.style.color = colors.addPlanBorder;
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

  // Dark mode color variables
  const colors = {
    // Background colors
    overlayBg: darkMode ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.25)',
    modalBg: darkMode ? '#1e1e1e' : '#ffffff',
    inputBg: darkMode ? '#2a2a2a' : '#ffffff',
    
    // Border colors
    border: darkMode ? '#404040' : '#e4e4e7',
    inputBorder: darkMode ? '#525252' : '#d1d5db',
    inputBorderFocus: darkMode ? '#3b82f6' : '#2563eb',
    
    // Text colors
    textPrimary: darkMode ? '#f1f5f9' : '#18181b',
    textSecondary: darkMode ? '#a1a1aa' : '#64748b',
    textMuted: darkMode ? '#71717a' : '#9ca3af',
    
    // Button colors
    buttonPrimaryBg: darkMode ? '#3b82f6' : '#3b82f6',
    buttonPrimaryBgHover: darkMode ? '#2563eb' : '#2563eb',
    buttonPrimaryText: '#ffffff',
    buttonSecondaryBg: darkMode ? '#2a2a2a' : '#f4f4f5',
    buttonSecondaryBgHover: darkMode ? '#404040' : '#e4e4e7',
    buttonSecondaryText: darkMode ? '#a1a1aa' : '#52525b',
    buttonSecondaryBorder: darkMode ? '#404040' : '#d1d5db',
    
    // Checkbox colors
    checkboxBorder: darkMode ? '#3b82f6' : '#2563eb',
    checkboxBg: darkMode ? '#2a2a2a' : '#ffffff',
    checkboxCheckedBg: darkMode ? '#3b82f6' : '#2563eb',
  };

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
      background: colors.overlayBg,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: colors.modalBg,
        borderRadius: 16,
        boxShadow: darkMode 
          ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(0, 0, 0, 0.2)' 
          : '0 8px 32px rgba(0, 0, 0, 0.18), 0 4px 16px rgba(0, 0, 0, 0.1)',
        padding: '32px 32px 24px 32px',
        minWidth: 320,
        maxWidth: '90vw',
        minHeight: 120,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        border: `1px solid ${colors.border}`,
      }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ 
            display: 'block', 
            fontWeight: 500, 
            marginBottom: 6,
            color: colors.textPrimary,
          }}>
            Number of Transfers
          </label>
          <input
            type="number"
            min={1}
            value={numTransfers}
            onChange={e => setNumTransfers(Number(e.target.value))}
            style={{ 
              width: '100%', 
              borderRadius: 8, 
              border: `1px solid ${colors.inputBorder}`, 
              padding: '8px 12px', 
              fontSize: 16, 
              background: colors.inputBg, 
              color: colors.textPrimary,
              transition: 'all 0.2s ease-in-out',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = colors.inputBorderFocus;
              e.target.style.boxShadow = `0 0 0 2px ${colors.inputBorderFocus}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.inputBorder;
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 24, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 500, 
              marginBottom: 6,
              color: colors.textPrimary,
            }}>
              ESS
            </label>
            <div style={{ display: 'flex', gap: 12 }}>
              <TickCheckbox 
                checked={ess === true} 
                onChange={() => handleEssChange(true)} 
                label="Yes" 
                colors={colors}
              />
              <TickCheckbox 
                checked={ess === false} 
                onChange={() => handleEssChange(false)} 
                label="No" 
                colors={colors}
              />
            </div>
          </div>
          {ess !== false && (
            <div style={{ flex: 1 }}>
              <label style={{ 
                display: 'block', 
                fontWeight: 500, 
                marginBottom: 6,
                color: colors.textPrimary,
              }}>
                ESS Partial?
              </label>
              <div style={{ display: 'flex', gap: 12 }}>
                <TickCheckbox 
                  checked={essPartial === true} 
                  onChange={() => handleEssPartialChange(true)} 
                  label="Yes" 
                  colors={colors}
                />
                <TickCheckbox 
                  checked={essPartial === false} 
                  onChange={() => handleEssPartialChange(false)} 
                  label="No" 
                  colors={colors}
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 rounded-lg border font-medium transition-colors duration-200"
            style={{
              borderColor: colors.buttonPrimaryBg,
              backgroundColor: colors.buttonPrimaryBg,
              color: colors.buttonPrimaryText,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.buttonPrimaryBgHover;
              e.currentTarget.style.borderColor = colors.buttonPrimaryBgHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.buttonPrimaryBg;
              e.currentTarget.style.borderColor = colors.buttonPrimaryBg;
            }}
            onClick={onAdd}
            type="button"
          >
            Add Transfer
          </button>
          <button
            className="px-4 py-2 rounded-lg border font-medium transition-colors duration-200"
            style={{
              borderColor: colors.buttonSecondaryBorder,
              backgroundColor: colors.buttonSecondaryBg,
              color: colors.buttonSecondaryText,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.buttonSecondaryBgHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = colors.buttonSecondaryBg;
            }}
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
function TickCheckbox({ 
  checked, 
  onChange, 
  label, 
  colors 
}: { 
  checked: boolean; 
  onChange: () => void; 
  label: string; 
  colors: Record<string, string>; 
}) {
  return (
    <label style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 6, 
      cursor: 'pointer', 
      userSelect: 'none',
      color: colors.textPrimary,
    }}>
      <span style={{ position: 'relative', width: 18, height: 18, display: 'inline-block' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={{ 
            width: 18, 
            height: 18, 
            borderRadius: 4, 
            border: `2px solid ${colors.checkboxBorder}`, 
            background: checked ? colors.checkboxCheckedBg : colors.checkboxBg, 
            appearance: 'none', 
            outline: 'none', 
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
          }}
        />
        {checked && (
          <svg 
            viewBox="0 0 16 16" 
            fill="none" 
            stroke="#ffffff" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            style={{ 
              position: 'absolute', 
              left: 2, 
              top: 2, 
              width: 14, 
              height: 14, 
              pointerEvents: 'none' 
            }}
          >
            <polyline points="3.5 8.5 7 12 12.5 5.5" />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}

export default CedingInformationStage; 