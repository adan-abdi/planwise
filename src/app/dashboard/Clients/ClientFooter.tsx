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
    <footer className="w-full bg-zinc-50 border-t border-zinc-200 py-3 px-4 flex items-center justify-center min-h-[56px]">
      {selectedClient ? (
        <div className="w-full flex justify-between items-center">
          <span className="text-zinc-500 text-sm"></span>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center">
          <div className="flex items-center">
            <button
              className="h-10 w-12 flex items-center justify-center border border-zinc-200 border-r-0 bg-white rounded-l-full disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            >
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
            </button>
            <span
              className="h-10 flex items-center justify-center border-t border-b border-l border-r border-zinc-200 bg-white text-zinc-900 text-base font-medium select-none px-4"
              style={{ borderRadius: 0 }}
            >
              <span className="text-zinc-900 font-medium">{currentPage}</span>
              <span className="text-zinc-400 font-normal ml-1">/{totalPages}</span>
            </span>
            <button
              className="h-10 w-12 flex items-center justify-center border border-zinc-200 border-l-0 bg-white rounded-r-full disabled:opacity-40 disabled:cursor-not-allowed"
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