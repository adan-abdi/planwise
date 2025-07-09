import React, { useRef, useState } from "react";
import { CloudUpload, Trash } from "lucide-react";
import Image from "next/image";
import PersonalisedChecklistConfirmModal from "./PersonalisedChecklistConfirmModal";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm px-2 sm:px-0 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-zinc-200 flex flex-col overflow-hidden mx-auto my-4 sm:my-0 max-h-[90vh]">
        <div className="px-4 sm:px-6 py-3 border-b border-zinc-200 bg-zinc-50 flex items-center text-zinc-500 font-medium text-base min-h-[48px]">
          {fileName || "Upload file"}
        </div>
        <div className="flex justify-center w-full border-b py-2 border-zinc-200 gap-4 mb-4">
          <button
            className={`px-3 py-2 text-sm font-medium rounded-[10px] border transition-colors flex items-center gap-1 whitespace-nowrap ${activeTab === 'source' ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-50 border-zinc-100 text-zinc-400 hover:bg-zinc-100'}`}
            onClick={activeTab === 'checklist' ? undefined : () => setActiveTab('source')}
            tabIndex={0}
            type="button"
          >
            Source file
          </button>
          <button
            className={
              showChecklistContent
                ? `px-3 py-2 text-sm font-medium rounded-[10px] border transition-colors flex items-center gap-1 whitespace-nowrap ${activeTab === 'checklist' ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-50 border-zinc-100 text-zinc-400 hover:bg-zinc-100'}`
                : `px-3 py-2 text-sm font-medium rounded-[10px] border flex items-center gap-1 whitespace-nowrap bg-zinc-50 border-zinc-100 text-zinc-300 cursor-not-allowed opacity-60`
            }
            aria-disabled={!showChecklistContent}
            tabIndex={showChecklistContent ? 0 : -1}
            type="button"
            disabled={!showChecklistContent}
            onClick={showChecklistContent && activeTab !== 'source' ? () => setActiveTab('checklist') : undefined}
          >
            Personalised checklist
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-2 sm:px-8 py-6 sm:py-8 bg-white w-full overflow-y-auto">
          {activeTab === 'checklist' && showChecklistContent ? (
            <>
              <label
                htmlFor="checklist-upload"
                className={`w-full max-w-md mx-auto rounded-2xl border bg-white flex flex-col items-center justify-center py-8 sm:py-10 px-2 sm:px-4 relative transition-colors cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-50/40' : 'border-zinc-200'}`}
                style={{ minHeight: 200 }}
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
                <div className="text-xl text-zinc-900 mb-2 text-center">Upload checklist documents</div>
                <div className="text-base text-zinc-500 mb-2 text-center">
                  <span className="underline cursor-pointer text-zinc-900">Click to upload</span> or drag and drop checklist documents here.
                </div>
                <div className="text-sm text-zinc-400 text-center mb-2">
                  Maximum file size: 200 MB <span className="mx-1">•</span> Supported file: .PDF
                </div>
              </label>
              {checklistFiles.length > 0 && (
                <div className="w-full max-w-md mx-auto mt-6" style={{ maxHeight: 220, overflowY: 'auto' }}>
                  <div className="space-y-3">
                    {checklistFiles.map((file, idx) => (
                      <div key={file.name + file.size} className="flex items-center bg-white border border-zinc-200 rounded-xl px-4 py-3 shadow-sm">
                        <span className="mr-3 text-zinc-400">
                          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-medium text-zinc-900 truncate">{file.name}</div>
                          <div className="text-xs text-zinc-400">{(file.size / (1024 * 1024)).toFixed(1)}MB</div>
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
                className={`w-full max-w-md mx-auto rounded-2xl border bg-white flex flex-col items-center justify-center py-8 sm:py-10 px-2 sm:px-4 relative transition-colors cursor-pointer ${dragActive ? 'border-blue-500 bg-blue-50/40' : 'border-zinc-200'}`}
                style={{ minHeight: 200 }}
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
                <div className="text-xl text-zinc-900 mb-2 text-center">Upload documents</div>
                <div className="text-base text-zinc-500 mb-2 text-center">
                  <span className="underline cursor-pointer text-zinc-900">Click to upload</span> or drag and drop policy documents here.
                </div>
                <div className="text-sm text-zinc-400 text-center mb-2">
                  Maximum file size: 200 MB <span className="mx-1">•</span> Supported file: .PDF
                </div>
              </label>
              {selectedFiles.length > 0 && (
                <div className="w-full max-w-md mx-auto mt-6" style={{ maxHeight: 220, overflowY: 'auto' }}>
                  <div className="space-y-3">
                    {selectedFiles.map((file, idx) => (
                      <div key={file.name + file.size} className="flex items-center bg-white border border-zinc-200 rounded-xl px-4 py-3 shadow-sm">
                        <span className="mr-3 text-zinc-400">
                          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-medium text-zinc-900 truncate">{file.name}</div>
                          <div className="text-xs text-zinc-400">{(file.size / (1024 * 1024)).toFixed(1)}MB</div>
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
        <div className="flex items-center justify-end gap-2 sm:gap-3 px-2 sm:px-6 py-3 sm:py-4 bg-white border-t border-zinc-100">
          <button
            onClick={handleCancel}
            className="px-4 sm:px-5 py-2 text-base font-medium text-zinc-500 bg-zinc-100 hover:bg-zinc-200 transition border border-zinc-200 flex items-center justify-center"
            style={{ fontFamily: 'system-ui, sans-serif', height: 40, lineHeight: '24px', borderRadius: '14px' }}
          >
            Cancel
          </button>
          <button
            disabled={activeTab === 'source' ? selectedFiles.length === 0 : false}
            className={`px-4 sm:px-5 py-2 text-base font-medium text-white transition border border-zinc-200 flex items-center justify-center ${activeTab === 'source' ? (selectedFiles.length > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-200 opacity-60 cursor-not-allowed') : 'bg-blue-600 hover:bg-blue-700'}`}
            style={{ fontFamily: 'system-ui, sans-serif', height: 40, lineHeight: '24px', borderRadius: '14px' }}
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