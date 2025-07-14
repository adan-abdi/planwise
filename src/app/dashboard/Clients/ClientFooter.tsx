import React from "react";
import type { ClientItem } from "./ClientListItem";
import { useTheme } from "../../../theme-context";

interface ClientFooterProps {
  selectedClient: ClientItem | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  isEmpty?: boolean;
  showFooterActions?: boolean;
  invisible?: boolean;
  forceWhiteBg?: boolean;
  greyBg?: boolean;
  showTransferDocumentActions?: boolean;
  onSaveDraft?: () => void;
  onSaveAndContinue?: () => void;
}

const ClientFooter: React.FC<ClientFooterProps> = ({ selectedClient, currentPage, totalPages, setCurrentPage, isEmpty, showFooterActions, invisible, forceWhiteBg, greyBg, showTransferDocumentActions, onSaveDraft, onSaveAndContinue }) => {
  const { darkMode } = useTheme();
  if (isEmpty) {
    return null;
  }
  const footerBgClass =
    greyBg
      ? 'bg-white dark:bg-[var(--muted)]'
      : selectedClient || (!showFooterActions && !isEmpty && totalPages > 1)
        ? 'bg-white dark:bg-transparent'
        : forceWhiteBg
          ? 'bg-white dark:bg-[var(--muted)]'
          : 'bg-white dark:bg-[var(--muted)]';
  return (
    <footer className={`w-full ${footerBgClass} py-3 px-4 flex items-center justify-center min-h-[56px] relative text-[var(--foreground)] border-t border-zinc-200 dark:border-[var(--border)]${invisible ? ' invisible' : ''}`}>
      <div className={`block sm:hidden absolute left-1/2 -translate-x-1/2 w-screen top-0 h-px bg-zinc-200 dark:bg-[var(--border)]${invisible ? ' invisible' : ''}`} />
      {showFooterActions ? (
        <div className="w-full flex justify-end items-center gap-2">
          <button
            className="flex items-center gap-1 border border-zinc-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-normal transition"
            style={{ minWidth: 0, backgroundColor: darkMode ? 'var(--muted)' : '#fff', color: darkMode ? '#fff' : '#18181b' }}
            onClick={onSaveDraft}
          >
            Save as draft
          </button>
          <button
            className="flex items-center gap-1 border border-zinc-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-normal bg-white/60 text-zinc-400 dark:bg-[var(--muted)] dark:text-[var(--foreground)] transition cursor-not-allowed"
            style={{ minWidth: 0 }}
            disabled
          >
            Download file
          </button>
          <button
            className="flex items-center gap-1 border border-zinc-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-normal bg-white text-zinc-700 dark:bg-[var(--muted)] dark:text-[var(--foreground)] transition"
            style={{ minWidth: 0 }}
          >
            Send an email
          </button>
          <button
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-normal bg-blue-600 text-white transition border border-blue-600 hover:bg-blue-700 hover:border-blue-700"
            style={{ minWidth: 0 }}
            onClick={onSaveAndContinue}
          >
            Save and Continue
          </button>
        </div>
      ) : showTransferDocumentActions ? (
        <div className="w-full flex justify-end items-center gap-2">
          <button
            className="flex items-center gap-1 border border-zinc-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-normal transition"
            style={{ minWidth: 0, backgroundColor: darkMode ? 'var(--muted)' : '#fff', color: darkMode ? '#fff' : '#18181b' }}
          >
            Send in email
          </button>
          <button
            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-normal bg-blue-600 text-white transition border border-blue-600 hover:bg-blue-700 hover:border-blue-700"
            style={{ minWidth: 0 }}
          >
            Download
          </button>
        </div>
      ) : selectedClient ? (
        <div className="w-full flex justify-between items-center">
          <span className="text-zinc-500 text-sm"></span>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center">
          <div className="flex items-center">
            <button
              className="h-8 w-10 flex items-center justify-center border border-zinc-200 dark:border-[var(--border)] border-r-0 bg-white dark:bg-[var(--background)] rounded-l-full disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            >
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <span
              className="h-8 flex items-center justify-center border-t border-b border-l border-r border-zinc-200 dark:border-[var(--border)] bg-white dark:bg-[var(--background)] text-zinc-900 dark:text-[var(--foreground)] text-base font-medium select-none px-3"
              style={{ borderRadius: 0 }}
            >
              <span className="text-zinc-900 dark:text-[var(--foreground)] font-medium">{currentPage}</span>
              <span className="text-zinc-400 dark:text-[var(--foreground)] font-normal ml-1">/{totalPages}</span>
            </span>
            <button
              className="h-8 w-10 flex items-center justify-center border border-zinc-200 dark:border-[var(--border)] border-l-0 bg-white dark:bg-[var(--background)] rounded-r-full disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18" /></svg>
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default ClientFooter; 