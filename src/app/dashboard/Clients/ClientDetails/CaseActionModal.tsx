import React from "react";

interface CaseActionModalProps {
  open: boolean;
  position: { top: number; left: number } | null;
  onView: () => void;
  onDelete: () => void;
  darkMode: boolean;
}

export default function CaseActionModal({ open, position, onView, onDelete, darkMode }: CaseActionModalProps) {
  if (!open || !position) return null;
  return (
    <div
      id="case-action-modal"
      className="fixed z-[100]"
      style={{ top: position.top, left: position.left, minWidth: 220 }}
    >
      <div className="bg-[var(--background)] rounded-2xl shadow-2xl w-full max-w-xs border border-[var(--border)] flex flex-col">
        <div className="flex flex-col gap-2 px-4 sm:px-6 py-4">
          <button
            className="w-full text-left px-4 py-2 rounded-lg bg-transparent font-medium transition border-0"
            style={{
              border: 'none',
              color: darkMode ? 'var(--foreground)' : '#18181b',
              background: 'transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = darkMode ? '#27272a' : '#f4f4f5';
              e.currentTarget.style.color = darkMode ? 'var(--foreground)' : '#18181b';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = darkMode ? 'var(--foreground)' : '#18181b';
            }}
            onClick={onView}
          >
            View Case Details
          </button>
          <button
            className="w-full text-left px-4 py-2 rounded-lg bg-transparent text-red-600 font-medium transition hover:bg-red-50 dark:hover:bg-red-900/30 border-0"
            style={{ border: 'none' }}
            onClick={onDelete}
          >
            Delete Case
          </button>
        </div>
      </div>
    </div>
  );
} 