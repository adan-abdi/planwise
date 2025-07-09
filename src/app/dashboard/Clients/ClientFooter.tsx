import React from "react";
import type { ClientItem } from "./ClientListItem";

interface ClientFooterProps {
  selectedClient: ClientItem | null;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

const ClientFooter: React.FC<ClientFooterProps> = ({ selectedClient, currentPage, totalPages, setCurrentPage }) => {
  return (
    <footer className="w-full bg-zinc-50 dark:bg-[var(--muted)] py-1.5 px-4 flex items-center justify-center min-h-[40px] relative text-[var(--foreground)]">
      {/* Edge-to-edge border for mobile only */}
      <div className="block sm:hidden absolute left-1/2 -translate-x-1/2 w-screen top-0 h-px bg-zinc-200 dark:bg-[var(--border)]" />
      {selectedClient ? (
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