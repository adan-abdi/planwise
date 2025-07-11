import React, { useRef, useState } from "react";
import { CloudUpload, Trash } from "lucide-react";
import Image from "next/image";
import PersonalisedChecklistConfirmModal from "./PersonalisedChecklistConfirmModal";
import { useTheme } from "../../../theme-context";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  fileName?: string;
  onShowReviewChecklist?: () => void;
  onNoPersonalisedChecklist?: () => void;
}

export default function UploadModal({ open, onClose, fileName, onShowReviewChecklist, onNoPersonalisedChecklist }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [checklistFiles, setChecklistFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<'source' | 'checklist'>('source');
  const [showChecklistContent, setShowChecklistContent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const checklistInputRef = useRef<HTMLInputElement>(null);

  const [showChecklistConfirm, setShowChecklistConfirm] = useState(false);

  const { darkMode } = useTheme();

  const modalBg = darkMode ? '#18181b' : '#fff';
  const modalText = darkMode ? '#f4f4f5' : '#18181b';
  const modalBorder = darkMode ? '#27272a' : '#e4e4e7';
  const headerBg = darkMode ? '#232329' : '#f4f4f5';
  const headerText = darkMode ? '#f4f4f5' : '#52525b';
  const tabActiveBg = darkMode ? '#232329' : '#fff';
  const tabInactiveBg = darkMode ? '#18181b' : '#f4f4f5';
  const tabActiveText = darkMode ? '#f4f4f5' : '#18181b';
  const tabInactiveText = darkMode ? '#71717a' : '#a1a1aa';
  const dragActiveBg = darkMode ? '#1e293b' : '#f0f6ff';
  const dragActiveBorder = darkMode ? '#2563eb' : '#3b82f6';
  const fileBoxBg = darkMode ? '#232329' : '#fff';
  const fileBoxBorder = darkMode ? '#27272a' : '#e4e4e7';
  const fileBoxText = darkMode ? '#f4f4f5' : '#18181b';
  const fileBoxSubText = darkMode ? '#a1a1aa' : '#71717a';
  const buttonCancelBg = darkMode ? '#232329' : '#f4f4f5';
  const buttonCancelText = darkMode ? '#a1a1aa' : '#52525b';
  const buttonContinueBg = darkMode ? (activeTab === 'source' && selectedFiles.length === 0 ? '#334155' : '#2563eb') : (activeTab === 'source' && selectedFiles.length === 0 ? '#c7d2fe' : '#2563eb');
  const buttonContinueText = '#fff';

  const handleCancel = () => {
    setSelectedFiles([]);
    setDragActive(false);
    setActiveTab('source');
    setShowChecklistConfirm(false);
    onClose();
  };

  const handleContinue = () => {
    if (activeTab === 'source') {
      setShowChecklistConfirm(true);
    } else if (activeTab === 'checklist') {
      onClose();
      if (onShowReviewChecklist) onShowReviewChecklist();
    }
  };

  const handleChecklistConfirm = () => {
    setShowChecklistConfirm(false);
    setShowChecklistContent(true);
    setActiveTab('checklist');
  };

  const handleChecklistCancel = () => {
    setShowChecklistConfirm(false);
    if (onNoPersonalisedChecklist) {
      onNoPersonalisedChecklist();
    } else {
      onClose();
      if (onShowReviewChecklist) onShowReviewChecklist();
    }
  };

  if (!open) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      if (activeTab === 'checklist' && showChecklistContent) {
        setChecklistFiles((prev) => {
          const all = [...prev, ...newFiles];
          const unique = all.filter((file, idx, arr) =>
            arr.findIndex(f => f.name === file.name && f.size === file.size) === idx
          );
          return unique;
        });
      } else {
        setSelectedFiles((prev) => {
          const all = [...prev, ...newFiles];
          const unique = all.filter((file, idx, arr) =>
            arr.findIndex(f => f.name === file.name && f.size === file.size) === idx
          );
          return unique;
        });
      }
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => {
        const all = [...prev, ...newFiles];
        const unique = all.filter((file, idx, arr) =>
          arr.findIndex(f => f.name === file.name && f.size === file.size) === idx
        );
        return unique;
      });
      e.target.value = "";
    }
  };
  const handleChecklistFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setChecklistFiles((prev) => {
        const all = [...prev, ...newFiles];
        const unique = all.filter((file, idx, arr) =>
          arr.findIndex(f => f.name === file.name && f.size === file.size) === idx
        );
        return unique;
      });
      e.target.value = "";
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-0 overflow-y-auto"
      style={{ backgroundColor: darkMode ? 'rgba(24,24,27,0.85)' : 'rgba(0,0,0,0.1)' }}
    >
      <div
        className="rounded-2xl shadow-2xl w-full max-w-lg border flex flex-col overflow-hidden mx-auto my-4 sm:my-0 max-h-[90vh]"
        style={{ background: modalBg, color: modalText, borderColor: modalBorder }}
      >
        <div
          className="px-4 sm:px-6 py-3 border-b flex items-center font-medium text-base min-h-[48px]"
          style={{ background: headerBg, color: headerText, borderColor: modalBorder }}
        >
          {fileName || "Upload file"}
        </div>
        <div className="flex justify-center w-full border-b py-2 gap-4 mb-4" style={{ borderColor: modalBorder }}>
          <button
            className="px-3 py-2 text-sm font-medium rounded-[10px] border transition-colors flex items-center gap-1 whitespace-nowrap"
            style={{
              background: activeTab === 'source' ? tabActiveBg : tabInactiveBg,
              color: activeTab === 'source' ? tabActiveText : tabInactiveText,
              borderColor: modalBorder,
              opacity: activeTab === 'source' ? 1 : 0.7,
            }}
            onClick={activeTab === 'checklist' ? undefined : () => setActiveTab('source')}
            tabIndex={0}
            type="button"
          >
            Source file
          </button>
          <button
            style={{
              background: showChecklistContent && activeTab === 'checklist' ? tabActiveBg : tabInactiveBg,
              color: showChecklistContent && activeTab === 'checklist' ? tabActiveText : tabInactiveText,
              borderColor: modalBorder,
              opacity: showChecklistContent ? 1 : 0.5,
              cursor: showChecklistContent ? 'pointer' : 'not-allowed',
            }}
            className="px-3 py-2 text-sm font-medium rounded-[10px] border flex items-center gap-1 whitespace-nowrap"
            aria-disabled={!showChecklistContent}
            tabIndex={showChecklistContent ? 0 : -1}
            type="button"
            disabled={!showChecklistContent}
            onClick={showChecklistContent && activeTab !== 'source' ? () => setActiveTab('checklist') : undefined}
          >
            Personalised checklist
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-2 sm:px-8 py-6 sm:py-8 w-full overflow-y-auto" style={{ background: modalBg }}>
          {activeTab === 'checklist' && showChecklistContent ? (
            <>
              <label
                htmlFor="checklist-upload"
                className="w-full max-w-md mx-auto rounded-2xl border flex flex-col items-center justify-center py-8 sm:py-10 px-2 sm:px-4 relative transition-colors cursor-pointer"
                style={{
                  minHeight: 200,
                  background: dragActive ? dragActiveBg : modalBg,
                  borderColor: dragActive ? dragActiveBorder : modalBorder,
                  color: modalText,
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                tabIndex={0}
              >
                <input
                  id="checklist-upload"
                  ref={checklistInputRef}
                  type="file"
                  accept="application/pdf"
                  multiple
                  className="hidden"
                  onChange={handleChecklistFileChange}
                  tabIndex={-1}
                />
                <div className="relative mb-6 flex items-center justify-center" style={{ height: 96 }}>
                  <Image src="/upload.svg" alt="Upload" width={96} height={96} className="mx-auto" />
                  <span className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 border-4 border-white shadow" style={{ boxShadow: '0 2px 8px 0 rgba(24, 80, 255, 0.10)' }}>
                      <CloudUpload className="w-5 h-5 text-white" />
                    </span>
                  </span>
                </div>
                <div className="text-xl mb-2 text-center" style={{ color: modalText }}>Upload checklist documents</div>
                <div className="text-base mb-2 text-center" style={{ color: modalText }}>
                  <span className="underline cursor-pointer" style={{ color: modalText }}>Click to upload</span> or drag and drop checklist documents here.
                </div>
                <div className="text-sm text-center mb-2" style={{ color: fileBoxSubText }}>
                  Maximum file size: 200 MB <span className="mx-1">•</span> Supported file: .PDF
                </div>
              </label>
              {checklistFiles.length > 0 && (
                <div className="w-full max-w-md mx-auto mt-6" style={{ maxHeight: 220, overflowY: 'auto' }}>
                  <div className="space-y-3">
                    {checklistFiles.map((file, idx) => (
                      <div key={file.name + file.size} className="flex items-center rounded-xl px-4 py-3 shadow-sm" style={{ background: fileBoxBg, border: `1px solid ${fileBoxBorder}` }}>
                        <span className="mr-3" style={{ color: fileBoxSubText }}>
                          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-medium truncate" style={{ color: fileBoxText }}>{file.name}</div>
                          <div className="text-xs" style={{ color: fileBoxSubText }}>{(file.size / (1024 * 1024)).toFixed(1)}MB</div>
                        </div>
                        <button
                          className="ml-3 p-2 rounded-full hover:bg-red-50 transition"
                          aria-label="Remove file"
                          onClick={() => setChecklistFiles(files => files.filter((_, i) => i !== idx))}
                          type="button"
                        >
                          <Trash className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <label
                htmlFor="file-upload"
                className="w-full max-w-md mx-auto rounded-2xl border flex flex-col items-center justify-center py-8 sm:py-10 px-2 sm:px-4 relative transition-colors cursor-pointer"
                style={{
                  minHeight: 200,
                  background: dragActive ? dragActiveBg : modalBg,
                  borderColor: dragActive ? dragActiveBorder : modalBorder,
                  color: modalText,
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                tabIndex={0}
              >
                <div className="relative mb-6 flex items-center justify-center" style={{ height: 96 }}>
                  <Image src="/upload.svg" alt="Upload" width={96} height={96} className="mx-auto" />
                  <span className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 border-4 border-white shadow" style={{ boxShadow: '0 2px 8px 0 rgba(24, 80, 255, 0.10)' }}>
                      <CloudUpload className="w-5 h-5 text-white" />
                    </span>
                  </span>
                </div>
                <input
                  id="file-upload"
                  ref={inputRef}
                  type="file"
                  accept="application/pdf"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                  tabIndex={-1}
                />
                <div className="text-xl mb-2 text-center" style={{ color: modalText }}>Upload documents</div>
                <div className="text-base mb-2 text-center" style={{ color: modalText }}>
                  <span className="underline cursor-pointer" style={{ color: modalText }}>Click to upload</span> or drag and drop policy documents here.
                </div>
                <div className="text-sm text-center mb-2" style={{ color: fileBoxSubText }}>
                  Maximum file size: 200 MB <span className="mx-1">•</span> Supported file: .PDF
                </div>
              </label>
              {selectedFiles.length > 0 && (
                <div className="w-full max-w-md mx-auto mt-6" style={{ maxHeight: 220, overflowY: 'auto' }}>
                  <div className="space-y-3">
                    {selectedFiles.map((file, idx) => (
                      <div key={file.name + file.size} className="flex items-center rounded-xl px-4 py-3 shadow-sm" style={{ background: fileBoxBg, border: `1px solid ${fileBoxBorder}` }}>
                        <span className="mr-3" style={{ color: fileBoxSubText }}>
                          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-medium truncate" style={{ color: fileBoxText }}>{file.name}</div>
                          <div className="text-xs" style={{ color: fileBoxSubText }}>{(file.size / (1024 * 1024)).toFixed(1)}MB</div>
                        </div>
                        <button
                          className="ml-3 p-2 rounded-full hover:bg-red-50 transition"
                          aria-label="Remove file"
                          onClick={() => setSelectedFiles(files => files.filter((_, i) => i !== idx))}
                          type="button"
                        >
                          <Trash className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 sm:gap-3 px-2 sm:px-6 py-3 sm:py-4 border-t" style={{ background: modalBg, borderColor: modalBorder }}>
          <button
            onClick={handleCancel}
            className="px-4 sm:px-5 py-2 text-base font-medium transition border flex items-center justify-center"
            style={{
              color: buttonCancelText,
              background: buttonCancelBg,
              borderColor: modalBorder,
              fontFamily: 'system-ui, sans-serif',
              height: 40,
              lineHeight: '24px',
              borderRadius: '14px',
            }}
          >
            Cancel
          </button>
          <button
            disabled={activeTab === 'source' ? selectedFiles.length === 0 : false}
            className="px-4 sm:px-5 py-2 text-base font-medium transition border flex items-center justify-center"
            style={{
              color: buttonContinueText,
              background: buttonContinueBg,
              borderColor: modalBorder,
              fontFamily: 'system-ui, sans-serif',
              height: 40,
              lineHeight: '24px',
              borderRadius: '14px',
              opacity: activeTab === 'source' && selectedFiles.length === 0 ? 0.6 : 1,
              cursor: activeTab === 'source' && selectedFiles.length === 0 ? 'not-allowed' : 'pointer',
            }}
            onClick={handleContinue}
          >
            Continue
          </button>
        </div>
      </div>
      <PersonalisedChecklistConfirmModal
        open={showChecklistConfirm}
        onConfirm={handleChecklistConfirm}
        onCancel={() => setShowChecklistConfirm(false)}
        onNo={handleChecklistCancel}
      />
    </div>
  );
} 