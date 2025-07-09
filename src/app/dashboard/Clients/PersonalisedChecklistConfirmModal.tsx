import React from "react";

interface PersonalisedChecklistConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  onNo?: () => void;
}

export default function PersonalisedChecklistConfirmModal({ open, onConfirm, onCancel, onNo }: PersonalisedChecklistConfirmModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[8px] px-2 sm:px-0">
      <div className="bg-white/80 backdrop-blur-[12px] rounded-2xl shadow-2xl w-full max-w-md border border-zinc-100 flex flex-col overflow-hidden mx-auto my-4 sm:my-0" style={{ boxShadow: '0 8px 32px 0 rgba(60,60,60,0.10), 0 1.5px 4px 0 rgba(60,60,60,0.08)' }}>
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 bg-white/70 w-full">
          <div className="text-[1.6rem] font-bold text-zinc-900 mb-3 text-center" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>Do you have a personalised checklist?</div>
          <div className="text-base text-zinc-500 mb-10 text-center max-w-xs font-normal" style={{ fontWeight: 400 }}>
            We’ve prepared a standard checklist for your source file. If you prefer, you can upload your own checklist instead.
          </div>
          <div className="flex items-center justify-center gap-4 w-full mt-2">
            <button
              onClick={onNo ? onNo : onCancel}
              className="px-7 py-2 text-base font-medium text-zinc-700 bg-white/80 border border-zinc-200 shadow-sm hover:bg-zinc-100 transition flex-1"
              style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', height: 44, lineHeight: '24px', boxShadow: '0 1px 4px 0 rgba(60,60,60,0.06)', borderRadius: '14px' }}
            >
              No, I don’t
            </button>
            <button
              onClick={onConfirm}
              className="px-7 py-2 text-base font-medium text-white bg-blue-500 hover:bg-blue-600 shadow-sm transition flex-1"
              style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', height: 44, lineHeight: '24px', boxShadow: '0 1px 4px 0 rgba(24,80,255,0.10)', borderRadius: '14px' }}
            >
              Yes, I do
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 