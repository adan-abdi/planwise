import React from "react";
import { useTheme } from "../../../theme-context";

interface PersonalisedChecklistConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onNo?: () => void;
}

export default function PersonalisedChecklistConfirmModal({ open, onConfirm, onCancel, onNo }: PersonalisedChecklistConfirmModalProps) {
  const { darkMode } = useTheme();
  if (!open) return null;
  // Define conditional styles
  const modalBg = darkMode ? 'rgba(34,34,34,0.92)' : 'rgba(255,255,255,0.80)';
  const modalInnerBg = darkMode ? 'rgba(34,34,34,0.85)' : 'rgba(255,255,255,0.70)';
  const borderColor = darkMode ? '#27272a' : '#e4e4e7';
  const shadow = darkMode
    ? '0 8px 32px 0 rgba(0,0,0,0.30), 0 1.5px 4px 0 rgba(0,0,0,0.18)'
    : '0 8px 32px 0 rgba(60,60,60,0.10), 0 1.5px 4px 0 rgba(60,60,60,0.08)';
  const titleColor = darkMode ? 'var(--foreground)' : '#18181b';
  const descColor = darkMode ? '#b0b0b0' : '#52525b';
  const noBtnBg = 'transparent';
  const noBtnBorder = darkMode ? 'var(--border)' : '#e4e4e7';
  const noBtnText = darkMode ? '#fff' : '#18181b';
  const noBtnHover = darkMode ? '#232329' : '#f4f4f5';
  const yesBtnBg = darkMode ? '#2563eb' : '#3b82f6';
  const yesBtnHover = darkMode ? '#1e40af' : '#2563eb';
  const yesBtnText = darkMode ? '#fff' : '#fff';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[8px] px-2 sm:px-0">
      <div
        className="rounded-2xl shadow-2xl w-full max-w-md border flex flex-col overflow-hidden mx-auto my-4 sm:my-0"
        style={{
          background: modalBg,
          backdropFilter: 'blur(12px)',
          border: `1px solid ${borderColor}`,
          boxShadow: shadow,
        }}
      >
        <div
          className="flex-1 flex flex-col items-center justify-center px-8 py-12 w-full"
          style={{ background: modalInnerBg }}
        >
          <div
            className="text-[1.6rem] font-bold mb-3 text-center"
            style={{ color: titleColor, fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
          >
            Do you have a personalised checklist?
          </div>
          <div
            className="text-base mb-10 text-center max-w-xs font-normal"
            style={{ color: descColor, fontWeight: 400 }}
          >
            We’ve prepared a standard checklist for your source file. If you prefer, you can upload your own checklist instead.
          </div>
          <div className="flex items-center justify-center gap-4 w-full mt-2">
            <button
              onClick={onNo ? onNo : onCancel}
              className="px-7 py-2 text-base font-medium transition flex-1"
              style={{
                color: noBtnText,
                background: noBtnBg,
                border: `1px solid ${noBtnBorder}`,
                boxShadow: '0 1px 4px 0 rgba(60,60,60,0.06)',
                borderRadius: '14px',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                height: 44,
                lineHeight: '24px',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = noBtnHover)}
              onMouseLeave={e => (e.currentTarget.style.background = noBtnBg)}
            >
              No, I don’t
            </button>
            <button
              onClick={onConfirm}
              className="px-7 py-2 text-base font-medium shadow-sm transition flex-1"
              style={{
                color: yesBtnText,
                background: yesBtnBg,
                border: 'none',
                boxShadow: '0 1px 4px 0 rgba(24,80,255,0.10)',
                borderRadius: '14px',
                fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                height: 44,
                lineHeight: '24px',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = yesBtnHover)}
              onMouseLeave={e => (e.currentTarget.style.background = yesBtnBg)}
            >
              Yes, I do
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 