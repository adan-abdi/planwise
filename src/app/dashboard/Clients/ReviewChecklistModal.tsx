import React from "react";

interface ReviewChecklistModalProps {
  open: boolean;
  onCancel: () => void;
  onContinue: () => void;
  checklistItems: string[];
}

export default function ReviewChecklistModal({ open, onCancel, onContinue, checklistItems }: ReviewChecklistModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 dark:bg-black/60 backdrop-blur-[8px] px-2 sm:px-0">
      <div
        className="w-full max-w-4xl flex flex-col overflow-hidden mx-auto my-4 sm:my-0 border border-[var(--border)]"
        style={{
          background: 'rgba(255,255,255,0.75)',
          borderRadius: 20,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Helvetica, Arial, sans-serif',
        }}
      >
        <div className="flex items-center px-8 py-2 border-b border-[var(--border)]" style={{ background: 'var(--muted)', minHeight: 36 }}>
          <span className="text-base font-medium text-zinc-500">Review CFR Checklist</span>
        </div>
        <div className="w-full flex-1 bg-[var(--background)] relative" style={{ minHeight: 480 }}>
          <div className="absolute inset-0 m-1 flex flex-col sm:flex-row">
            <div className="hidden sm:block w-1/2 h-full border border-[var(--border)] relative" style={{ borderRadius: 0, background: 'var(--muted)' }}>
              <div className="absolute p-4 top-4 inset-x-3 pt-8 bg-[var(--background)] border border-[var(--border)] flex flex-col h-full justify-between" style={{ borderRadius: 0, bottom: 0, height: '96.7%' }}>
                <div className="flex flex-col gap-3">
                  <div className="h-4 w-full bg-[var(--border)] rounded-full" />
                  <div className="h-4 w-1/2 bg-[var(--border)] rounded-full" />
                  <div className="h-4 w-1/3 bg-[var(--border)] rounded-full" />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="h-4 w-full bg-[var(--border)] rounded-full" />
                  <div className="h-4 w-full bg-[var(--border)] rounded-full" />
                  <div className="h-4 w-1/2 bg-[var(--border)] rounded-full" />
                  <div className="h-4 w-5/6 bg-[var(--border)] rounded-full" />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="h-4 w-2/3 bg-[var(--border)] rounded-full" />
                  <div className="h-4 w-full bg-[var(--border)] rounded-full" />
                </div>
              </div>
            </div>
            <div className="w-full sm:w-1/2 h-full bg-[var(--muted)] border border-[var(--border)] relative" style={{ borderRadius: 0 }}>
              <div className="absolute inset-0 flex flex-col pt-4 px-4" style={{ borderRadius: 0, height: '100%' }}>
                <div className="text-lg font-semibold text-[var(--foreground)] mb-4 mt-0">What we found</div>
                <div className="flex flex-col gap-4 overflow-y-auto flex-grow min-h-0">
                  {checklistItems.map((item) => (
                    <div key={item} className="flex items-center">
                      <span className="mr-3 text-zinc-300 cursor-grab select-none flex items-center">
                        <svg width='16' height='16' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'>
                          <circle cx='7' cy='7' r='1.1'/><circle cx='7' cy='12' r='1.1'/><circle cx='7' cy='17' r='1.1'/><circle cx='13' cy='7' r='1.1'/><circle cx='13' cy='12' r='1.1'/><circle cx='13' cy='17' r='1.1'/>
                        </svg>
                      </span>
                      <div className="bg-[var(--background)] border border-[var(--border)] rounded-xl px-3 py-2 w-full">
                        <span className="text-[var(--foreground)] text-sm font-normal">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-8 py-2 border-t border-zinc-100" style={{ background: 'rgba(255,255,255,0.85)' }}>
          <button
            onClick={onCancel}
            className="px-4 py-1.5 text-sm font-medium text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition border border-zinc-200 rounded-lg shadow-sm"
            style={{ fontFamily: 'inherit', height: 32, lineHeight: '20px', borderRadius: 8 }}
          >
            Cancel
          </button>
          <button
            onClick={onContinue}
            className="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition border border-blue-600 rounded-lg shadow"
            style={{ fontFamily: 'inherit', height: 32, lineHeight: '20px', borderRadius: 8, boxShadow: '0 1.5px 6px 0 rgba(60,60,60,0.10)' }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
} 