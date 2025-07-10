import React from "react";
import { useTheme } from "../../../theme-context";
import DocumentViewer from "./documentviewer/DocumentViewer";

interface ReviewChecklistModalProps {
  open: boolean;
  onCancel: () => void;
  onContinue: () => void;
  checklistItems: string[];
}

export default function ReviewChecklistModal({ open, onCancel, onContinue, checklistItems }: ReviewChecklistModalProps) {
  const { darkMode } = useTheme();
  if (!open) return null;

  // Define conditional styles
  const modalBg = darkMode ? 'rgba(24,24,27,0.95)' : 'rgba(255,255,255,0.75)';
  const borderColor = darkMode ? '#27272a' : 'var(--border)';
  const footerBg = darkMode ? 'rgba(51,51,51,0.98)' : 'rgba(255,255,255,0.85)';
  const headerBg = footerBg;
  const headerText = darkMode ? '#e4e4e7' : '#71717a';
  const sectionBg = darkMode ? '#18181b' : 'var(--muted)';
  const sectionInnerBg = darkMode ? '#232329' : 'var(--background)';
  const sectionBorder = darkMode ? '#27272a' : 'var(--border)';
  const itemBg = darkMode ? '#232329' : 'var(--background)';
  const itemText = darkMode ? '#e4e4e7' : 'var(--foreground)';
  const cancelBtnBg = darkMode ? '#232329' : '#f4f4f5';
  const cancelBtnText = darkMode ? '#d4d4d8' : '#52525b';
  const cancelBtnBorder = darkMode ? '#27272a' : '#e4e4e7';
  const continueBtnBg = darkMode ? '#2563eb' : '#2563eb';
  const continueBtnHover = darkMode ? '#1d4ed8' : '#1d4ed8';
  const continueBtnText = '#fff';
  // Add a muted background for the right side (checklist area)
  const rightSideBg = 'transparent';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 dark:bg-black/60 backdrop-blur-[8px] px-2 sm:px-0">
      <div
        className="w-full max-w-4xl flex flex-col overflow-hidden mx-auto my-4 sm:my-0 border"
        style={{
          background: modalBg,
          borderRadius: 20,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif',
          border: `1px solid ${borderColor}`,
        }}
      >
        <div className="flex items-center px-8 py-2 border-b" style={{ background: headerBg, minHeight: 36, borderColor: borderColor }}>
          <span className="text-base font-medium" style={{ color: headerText }}>Review CFR Checklist</span>
        </div>
        <div className="w-full flex-1 relative" style={{ background: sectionBg, minHeight: 480 }}>
          <div className="absolute inset-0 m-1 flex flex-col sm:flex-row">
            <div className="hidden sm:block w-1/2 h-full border relative" style={{ borderRadius: 0, background: sectionBg, borderColor: borderColor }}>
              <div className="absolute p-4 top-4 inset-x-3 pt-8 border flex flex-col h-full justify-between" style={{ borderRadius: 0, bottom: 0, height: '96.7%', background: sectionInnerBg, borderColor: sectionBorder }}>
                <DocumentViewer document={{ name: 'Sample Document.pdf' }} />
              </div>
            </div>
            <div className="w-full sm:w-1/2 h-full border relative" style={{ borderRadius: 0, background: rightSideBg, borderColor: borderColor }}>
              <div className="absolute inset-0 flex flex-col pt-4 px-4" style={{ borderRadius: 0, height: '100%', background: sectionInnerBg }}>
                <div className="text-lg font-semibold mb-4 mt-0" style={{ color: itemText }}>What we found</div>
                <div className="flex flex-col gap-4 overflow-y-auto flex-grow min-h-0">
                  {checklistItems.map((item) => (
                    <div key={item} className="flex items-center">
                      <span className="mr-3 cursor-grab select-none flex items-center" style={{ color: darkMode ? '#71717a' : '#d4d4d8' }}>
                        <svg width='16' height='16' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'>
                          <circle cx='7' cy='7' r='1.1'/><circle cx='7' cy='12' r='1.1'/><circle cx='7' cy='17' r='1.1'/><circle cx='13' cy='7' r='1.1'/><circle cx='13' cy='12' r='1.1'/><circle cx='13' cy='17' r='1.1'/>
                        </svg>
                      </span>
                      <div className="border rounded-xl px-3 py-2 w-full" style={{ background: itemBg, borderColor: sectionBorder }}>
                        <span className="text-sm font-normal" style={{ color: itemText }}>{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-8 py-2 border-t" style={{ background: footerBg, borderColor: borderColor }}>
          <button
            onClick={onCancel}
            className="px-4 py-1.5 text-sm font-medium transition border rounded-lg shadow-sm"
            style={{ fontFamily: 'inherit', height: 32, lineHeight: '20px', borderRadius: 8, background: cancelBtnBg, color: cancelBtnText, borderColor: cancelBtnBorder }}
          >
            Cancel
          </button>
          <button
            onClick={onContinue}
            className="px-4 py-1.5 text-sm font-medium transition border rounded-lg shadow"
            style={{ fontFamily: 'inherit', height: 32, lineHeight: '20px', borderRadius: 8, background: continueBtnBg, color: continueBtnText, borderColor: continueBtnBg, boxShadow: '0 1.5px 6px 0 rgba(60,60,60,0.10)' }}
            onMouseOver={e => (e.currentTarget.style.background = continueBtnHover)}
            onMouseOut={e => (e.currentTarget.style.background = continueBtnBg)}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
} 