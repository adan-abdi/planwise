import React from "react";

interface CreateNewCaseProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    pensionTransfer: number;
    isaTransfer: number;
    pensionNewMoney: number;
    isaNewMoney: number;
  }) => void;
}

export default function CreateNewCase({ open, onClose, onSubmit }: CreateNewCaseProps) {
  const [pensionTransfer, setPensionTransfer] = React.useState(0);
  const [isaTransfer, setIsaTransfer] = React.useState(0);
  const [pensionNewMoney, setPensionNewMoney] = React.useState(0);
  const [isaNewMoney, setIsaNewMoney] = React.useState(0);

  const resetForm = () => {
    setPensionTransfer(0);
    setIsaTransfer(0);
    setPensionNewMoney(0);
    setIsaNewMoney(0);
  };

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        pensionTransfer,
        isaTransfer,
        pensionNewMoney,
        isaNewMoney,
      });
    }
    resetForm();
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const isFormValid =
    pensionTransfer > 0 ||
    isaTransfer > 0 ||
    pensionNewMoney > 0 ||
    isaNewMoney > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/60 dark:bg-black/60 backdrop-blur-sm transition-all px-2 sm:px-0 overflow-y-auto">
      <div className="bg-[var(--background)] rounded-2xl shadow-2xl w-full max-w-md relative border border-[var(--border)] flex flex-col mx-auto my-2 sm:my-0 max-h-[80vh] overflow-visible">
        <div className="px-4 sm:px-6 py-2 border-b border-[var(--border)] rounded-t-2xl bg-[var(--muted)] dark:bg-[var(--muted)]">
          <span className="text-zinc-400 font-medium text-base">Create new case</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-0 px-4 sm:px-6 pt-3 pb-1 space-y-2">
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1 text-left">Pension Transfer</label>
              <div className="flex items-center h-11 gap-2">
                <button type="button" onClick={() => setPensionTransfer(Math.max(0, pensionTransfer - 1))} className="w-11 h-11 flex items-center justify-center text-lg text-zinc-400 hover:text-blue-600 focus:outline-none border border-[var(--border)] rounded-l-full bg-[var(--background)] dark:bg-[var(--muted)]">
                  <span className="-mt-0.5">−</span>
                </button>
                <span className="flex-1 h-11 flex items-center justify-center border border-[var(--border)] rounded-lg bg-[var(--background)] dark:bg-[var(--muted)] text-base text-[var(--foreground)] select-none">{pensionTransfer}</span>
                <button type="button" onClick={() => setPensionTransfer(pensionTransfer + 1)} className="w-11 h-11 flex items-center justify-center text-lg text-zinc-400 hover:text-blue-600 focus:outline-none border border-[var(--border)] rounded-r-full bg-[var(--background)] dark:bg-[var(--muted)]">
                  <span className="-mt-0.5">＋</span>
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1 text-left">ISA Transfer</label>
              <div className="flex items-center h-11 gap-2">
                <button type="button" onClick={() => setIsaTransfer(Math.max(0, isaTransfer - 1))} className="w-11 h-11 flex items-center justify-center text-lg text-zinc-400 hover:text-blue-600 focus:outline-none border border-[var(--border)] rounded-l-full bg-[var(--background)] dark:bg-[var(--muted)]">
                  <span className="-mt-0.5">−</span>
                </button>
                <span className="flex-1 h-11 flex items-center justify-center border border-[var(--border)] rounded-lg bg-[var(--background)] dark:bg-[var(--muted)] text-base text-[var(--foreground)] select-none">{isaTransfer}</span>
                <button type="button" onClick={() => setIsaTransfer(isaTransfer + 1)} className="w-11 h-11 flex items-center justify-center text-lg text-zinc-400 hover:text-blue-600 focus:outline-none border border-[var(--border)] rounded-r-full bg-[var(--background)] dark:bg-[var(--muted)]">
                  <span className="-mt-0.5">＋</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1 text-left">Pension New Money</label>
              <div className="flex items-center h-11 gap-2">
                <button type="button" onClick={() => setPensionNewMoney(Math.max(0, pensionNewMoney - 1))} className="w-11 h-11 flex items-center justify-center text-lg text-zinc-400 hover:text-blue-600 focus:outline-none border border-[var(--border)] rounded-l-full bg-[var(--background)] dark:bg-[var(--muted)]">
                  <span className="-mt-0.5">−</span>
                </button>
                <span className="flex-1 h-11 flex items-center justify-center border border-[var(--border)] rounded-lg bg-[var(--background)] dark:bg-[var(--muted)] text-base text-[var(--foreground)] select-none">{pensionNewMoney}</span>
                <button type="button" onClick={() => setPensionNewMoney(pensionNewMoney + 1)} className="w-11 h-11 flex items-center justify-center text-lg text-zinc-400 hover:text-blue-600 focus:outline-none border border-[var(--border)] rounded-r-full bg-[var(--background)] dark:bg-[var(--muted)]">
                  <span className="-mt-0.5">＋</span>
                </button>
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1 text-left">ISA New Money</label>
              <div className="flex items-center h-11 gap-2">
                <button type="button" onClick={() => setIsaNewMoney(Math.max(0, isaNewMoney - 1))} className="w-11 h-11 flex items-center justify-center text-lg text-zinc-400 hover:text-blue-600 focus:outline-none border border-[var(--border)] rounded-l-full bg-[var(--background)] dark:bg-[var(--muted)]">
                  <span className="-mt-0.5">−</span>
                </button>
                <span className="flex-1 h-11 flex items-center justify-center border border-[var(--border)] rounded-lg bg-[var(--background)] dark:bg-[var(--muted)] text-base text-[var(--foreground)] select-none">{isaNewMoney}</span>
                <button type="button" onClick={() => setIsaNewMoney(isaNewMoney + 1)} className="w-11 h-11 flex items-center justify-center text-lg text-zinc-400 hover:text-blue-600 focus:outline-none border border-[var(--border)] rounded-r-full bg-[var(--background)] dark:bg-[var(--muted)]">
                  <span className="-mt-0.5">＋</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4 pb-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--muted)] text-zinc-500 font-medium transition hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-4 py-2 rounded-lg border border-blue-600 bg-blue-600 text-white font-medium transition hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 