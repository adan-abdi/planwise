import React, { useRef, useState } from "react";
import { CloudUpload } from "lucide-react";

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  fileName?: string;
}

export default function UploadModal({ open, onClose, fileName }: UploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  const handleClickUpload = () => {
    inputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg border border-zinc-200 flex flex-col overflow-hidden">
        <div className="px-6 py-3 border-b border-zinc-200 bg-zinc-50 flex items-center text-zinc-500 font-medium text-base" style={{height: 48}}>
          {fileName || "Upload file"}
        </div>
        <div className="flex items-center px-6 pt-4 pb-2 border-b border-zinc-100 bg-white">
          <button className="flex items-center gap-2 text-sm font-medium text-blue-600 focus:outline-none">
            <span className="w-2 h-2 rounded-full bg-blue-600 mr-2" />
            Source file
          </button>
          <div className="w-8 h-px bg-zinc-200 mx-2" />
          <button className="flex items-center gap-2 text-sm font-medium text-zinc-400 focus:outline-none">
            Personalised checklist
          </button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-8 bg-white">
          <label
            htmlFor="file-upload"
            className={`w-full max-w-md mx-auto rounded-2xl border border-zinc-200 bg-white flex flex-col items-center justify-center py-10 px-4 relative transition-colors cursor-pointer ${dragActive ? 'border-blue-400 bg-blue-50/40' : ''}`}
            style={{minHeight: 260}}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            tabIndex={0}
            onClick={handleClickUpload}
          >
            <div className="relative mb-6 flex items-center justify-center" style={{height: 96}}>
              <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="16" y="24" width="64" height="56" rx="8" fill="#F4F4F5" stroke="#E4E4E7" strokeWidth="2" />
                <path d="M32 24V16C32 12.6863 34.6863 10 38 10H58C61.3137 10 64 12.6863 64 16V24" stroke="#E4E4E7" strokeWidth="2" />
              </svg>
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 border-4 border-white shadow" style={{boxShadow: '0 2px 8px 0 rgba(24, 80, 255, 0.10)'}}>
                  <CloudUpload className="w-5 h-5 text-white" />
                </span>
              </span>
            </div>
            <input
              id="file-upload"
              ref={inputRef}
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={handleFileChange}
              tabIndex={-1}
            />
            <div className="text-xl font-semibold text-zinc-900 mb-2 text-center">Upload documents</div>
            <div className="text-base text-zinc-500 mb-2 text-center">
              <span className="underline cursor-pointer text-zinc-900">Click to upload</span> or drag and drop policy documents here.
            </div>
            <div className="text-sm text-zinc-400 text-center mb-2">
              Maximum file size: 200 MB <span className="mx-1">•</span> Supported file: .PDF
            </div>
            {selectedFile && (
              <div className="text-sm text-blue-600 font-medium text-center mt-2 truncate max-w-full">
                Selected: {selectedFile.name}
              </div>
            )}
          </label>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-white border-t border-zinc-100">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-[6px] text-base font-medium text-zinc-500 bg-zinc-100 hover:bg-zinc-200 transition border border-zinc-200"
            style={{fontFamily: 'system-ui, sans-serif', height: 36, lineHeight: '20px'}}
          >
            Cancel
          </button>
          <button
            disabled={!selectedFile}
            className={`px-5 py-2 rounded-[6px] text-base font-medium text-white transition border border-zinc-200 ${selectedFile ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-200 opacity-60 cursor-not-allowed'}`}
            style={{fontFamily: 'system-ui, sans-serif', height: 36, lineHeight: '20px'}}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
} 