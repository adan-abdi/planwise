import React, { useState } from "react";
import { deleteCase } from "../../../../api/services/cases";

interface DeleteCaseModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  clientId?: string;
  caseId?: string;
}

export default function DeleteCaseModal({ open, onCancel, onConfirm, clientId, caseId }: DeleteCaseModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!clientId || !caseId) {
      console.error('Missing clientId or caseId for deletion');
      return;
    }

    setIsDeleting(true);
    try {
      const response = await deleteCase(clientId, caseId);
      if (response.status) {
        onConfirm();
      }
    } catch (error) {
      console.error('Error deleting case:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsDeleting(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-2 sm:px-0 overflow-y-auto" style={{ background: 'rgba(255, 0, 32, 0.07)', backdropFilter: 'blur(12px)' }}>
      <div className="bg-[var(--background)] rounded-2xl shadow-2xl w-full max-w-md relative border border-[var(--border)] flex flex-col mx-auto my-2 sm:my-0">
        <div className="px-4 sm:px-6 py-2 border-b border-[var(--border)] rounded-t-2xl bg-[var(--muted)] dark:bg-[var(--muted)]">
          <span className="text-zinc-700 dark:text-[var(--foreground)] font-medium text-base">Delete Case</span>
        </div>
        <div className="flex flex-col gap-4 px-4 sm:px-6 py-6" style={{ background: 'rgba(255,0,0,0.03)' }}>
          <div className="text-base text-black dark:text-[var(--foreground)]">Are you sure you want to delete this case? This action cannot be undone.</div>
          <div className="flex gap-2 justify-end mt-2">
            <button
              className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-zinc-500 font-medium transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg border border-red-600 bg-red-600 text-white font-medium transition hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 