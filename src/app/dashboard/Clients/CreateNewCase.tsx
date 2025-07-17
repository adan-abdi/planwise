import React, { useState } from "react";
import { ChevronDown } from 'lucide-react';
import { generatePensionNewMoneyStructure, FolderOrFile, generateIsaNewMoneyStructure } from './ClientDetails/pensionNewMoneyStructure';

// Types should match those in ClientDetails
type Transfer = {
  transferType: 'pensionTransfer' | 'isaTransfer' | 'pensionNewMoney' | 'isaNewMoney';
  amount?: number;
  provider: string;
  // For ISA Transfer: stocksOrShares, cashIsa, etc.
  stocksOrShares?: { stocks: boolean; shares: boolean };
  numStocksAndShares?: number;
  cashIsa?: number;
  isaType?: 'stocksAndShares' | 'cashIsa';
};

interface Case {
  id: string;
  createdAt: string;
  caseType: string;
  transfers: Transfer[];
  // Special fields for each case type
  ess?: boolean;
  essPartial?: boolean;
  single?: { checked: boolean; type: 'personal' | 'employer' | null };
  regular?: { checked: boolean; type: 'personal' | 'employer' | null };
  carryForward?: boolean;
  documents?: FolderOrFile[];
}

interface CreateNewCaseProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (newCase: Case) => void;
}

const caseTypes = [
  'Pension Transfer',
  'ISA Transfer',
  'Pension New Money',
  'ISA New Money',
];
const providers = ['Provider A', 'Provider B', 'Provider C', 'Provider D'];

// Add a helper component for a custom checkbox with tick
function TickCheckbox({ checked, onChange, label, ...props }: { checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; label: string } & Record<string, unknown>) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <span className="relative inline-block" style={{ width: '1.1rem', height: '1.1rem' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="appearance-none w-full h-full border-2 border-[var(--border)] rounded-[4px] bg-white dark:bg-[var(--muted)] focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition cursor-pointer"
          style={{ minWidth: '1.1rem', minHeight: '1.1rem' }}
          {...props}
        />
        {checked && (
          <svg
            viewBox="0 0 16 16"
            fill="none"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ width: '0.8rem', height: '0.8rem', color: '#2563eb', background: 'transparent' }}
          >
            <polyline points="3.5 8.5 7 12 12.5 5.5" stroke={props['data-tick-color'] as string || '#2563eb'} />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}

export default function CreateNewCase({ open, onClose, onSubmit }: CreateNewCaseProps) {
  const [caseType, setCaseType] = useState('');

  // Common transfer state
  const [transfers, setTransfers] = useState<Transfer[]>([
    { transferType: 'pensionTransfer', amount: 0, provider: providers[0] },
  ]);

  // Pension Transfer specific
  const [numTransfers, setNumTransfers] = useState(1);
  const [ess, setEss] = useState<boolean | null>(null);
  const [essPartial, setEssPartial] = useState<boolean | null>(null);

  // Handlers to enforce ESS/ESS Partial logic
  const handleEssChange = (value: boolean) => {
    setEss(value);
    if (value === false && essPartial === true) {
      setEssPartial(false);
    }
  };
  const handleEssPartialChange = (value: boolean) => {
    setEssPartial(value);
    if (value === true && ess === false) {
      setEss(true);
    }
  };

  // ISA Transfer specific
  const [stocks, setStocks] = useState(false);
  const [shares, setShares] = useState(false);
  const [numStocksAndShares, setNumStocksAndShares] = useState<number>(0);
  const [cashIsa, setCashIsa] = useState<number>(0);

  // Add separate state for cash ISA providers
  const [cashIsaProviders, setCashIsaProviders] = useState<string[]>([]);

  // Pension New Money specific
  const [essNewMoney, setEssNewMoney] = useState<boolean | null>(null);
  const [single, setSingle] = useState<{ checked: boolean; type: 'personal' | 'employer' | null }>({ checked: false, type: null });
  const [regular, setRegular] = useState<{ checked: boolean; type: 'personal' | 'employer' | null }>({ checked: false, type: null });
  const [carryForward, setCarryForward] = useState<boolean | null>(null);

  // Reset all fields
  const resetForm = () => {
    setCaseType(caseTypes[0]);
    setTransfers([{ transferType: 'pensionTransfer', amount: 0, provider: providers[0] }]);
    setNumTransfers(1);
    setEss(null);
    setEssPartial(null);
    setStocks(false);
    setShares(false);
    setNumStocksAndShares(0);
    setCashIsa(0);
    setCashIsaProviders([]);
    setEssNewMoney(null);
    setSingle({ checked: false, type: null });
    setRegular({ checked: false, type: null });
    setCarryForward(null);
  };

  if (!open) return null;

  // Dynamic transfer rows for Pension Transfer
  const handleNumTransfersChange = (n: number) => {
    setNumTransfers(n);
    setTransfers(prev => {
      const arr = [...prev];
      while (arr.length < n) {
        arr.push({ transferType: 'pensionTransfer', amount: 0, provider: providers[0] });
      }
      return arr.slice(0, n);
    });
  };

  // Dynamic transfer rows for ISA Transfer
  const handleNumStocksAndSharesChange = (n: number) => {
    setNumStocksAndShares(n);
    setTransfers(prev => {
      const arr = [...prev];
      while (arr.length < n) {
        arr.push({ transferType: 'isaTransfer', amount: 0, provider: providers[0], stocksOrShares: { stocks, shares } });
      }
      return arr.slice(0, n);
    });
  };

  // Dynamic transfer rows for Pension New Money
  const handleNumTransfersNewMoney = (n: number) => {
    setNumTransfers(n);
    setTransfers(prev => {
      const arr = [...prev];
      while (arr.length < n) {
        arr.push({ transferType: 'pensionNewMoney', amount: 0, provider: providers[0] });
      }
      return arr.slice(0, n);
    });
  };

  // Handle transfer field changes
  const handleTransferChange = (idx: number, field: keyof Transfer, value: unknown) => {
    setTransfers(prev => prev.map((t, i) => i === idx ? { ...t, [field]: value } : t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      const newCase: Case = {
        id: `case-${Date.now()}`,
        createdAt: new Date().toISOString(),
        caseType,
        transfers: [],
      };
      if (caseType === 'Pension Transfer') {
        newCase.transfers = transfers.map(t => ({ ...t, transferType: 'pensionTransfer' }));
        newCase.ess = ess ?? undefined;
        newCase.essPartial = essPartial ?? undefined;
      } else if (caseType === 'ISA Transfer') {
        // Build transfers: one per stocks & shares provider, one per cash ISA provider
        const stocksTransfers = transfers.slice(0, numStocksAndShares).map((t) => ({
          ...t,
          transferType: 'isaTransfer' as const,
          stocksOrShares: { stocks, shares },
          numStocksAndShares,
          cashIsa,
          provider: t.provider,
          isaType: 'stocksAndShares' as const,
        }));
        const cashTransfers = (cashIsaProviders || []).slice(0, cashIsa).map((provider) => ({
          transferType: 'isaTransfer' as const,
          provider: provider,
          isaType: 'cashIsa' as const,
        }));
        newCase.transfers = [...stocksTransfers, ...cashTransfers];
      } else if (caseType === 'Pension New Money') {
        newCase.transfers = transfers.map(t => ({ ...t, transferType: 'pensionNewMoney' }));
        newCase.ess = essNewMoney ?? undefined;
        newCase.single = single;
        newCase.regular = regular;
        newCase.carryForward = carryForward ?? undefined;
        // Attach folder structure
        newCase.documents = generatePensionNewMoneyStructure(newCase);
      } else if (caseType === 'ISA New Money') {
        newCase.transfers = transfers.map(t => ({ ...t, transferType: 'isaNewMoney' }));
        newCase.documents = generateIsaNewMoneyStructure(newCase);
      }
      onSubmit(newCase);
    }
    resetForm();
    onClose();
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  // // Form validation
  // let isFormValid = false;
  // if (caseType === 'Pension Transfer') {
  //   isFormValid = ess !== null && essPartial !== null;
  // } else if (caseType === 'ISA Transfer') {
  //   isFormValid = (stocks || shares || cashIsa > 0) && (numStocksAndShares > 0 || cashIsa > 0);
  // } else if (caseType === 'Pension New Money') {
  //   isFormValid = essNewMoney !== null && (single.checked || regular.checked);
  // } else if (caseType === 'ISA New Money') {
  //   isFormValid = transfers.some(t => t.provider && t.provider.trim() !== '');
  // }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/60 dark:bg-black/60 backdrop-blur-sm transition-all px-2 sm:px-0 overflow-y-auto">
      <div className="bg-[var(--background)] rounded-2xl shadow-2xl w-full max-w-md relative border border-[var(--border)] flex flex-col mx-auto my-2 sm:my-0 max-h-[80vh] overflow-visible">
        <div className="px-4 sm:px-6 py-2 border-b border-[var(--border)] rounded-t-2xl bg-[var(--muted)] dark:bg-[var(--muted)]">
          <span className="text-zinc-400 font-medium text-base">Create new case</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-0 px-4 sm:px-6 pt-3 pb-1 space-y-2">
          <div className="mb-3 relative">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1 text-left">Case Type</label>
            <div className="relative">
              <select
                value={caseType}
                onChange={e => {
                  setCaseType(e.target.value);
                  resetForm();
                  setCaseType(e.target.value);
                }}
                className="w-full border border-[var(--border)] rounded-lg px-4 py-2 pr-12 text-base bg-[var(--background)] dark:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-[var(--foreground)] placeholder-zinc-400 text-left cursor-pointer transition hover:border-blue-400 appearance-none"
              >
                <option value="" disabled hidden>Select case type...</option>
                {caseTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center h-full">
                <ChevronDown className="w-5 h-5 text-zinc-400" />
              </span>
            </div>
          </div>
          {/* Dynamic fields based on case type */}
          {caseType === 'Pension Transfer' && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/60 p-4 mb-2 flex flex-col gap-4">
              <div className="text-base mb-2 text-black dark:text-[var(--foreground)] font-normal">Pension Transfer Details</div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Number of Transfers</label>
                <input
                  type="number"
                  min={1}
                  value={numTransfers}
                  onChange={e => handleNumTransfersChange(Number(e.target.value))}
                  className="w-full border border-[var(--border)] rounded-lg px-4 py-2 text-base bg-white dark:bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">ESS</label>
                  <div className="flex gap-4">
                    <TickCheckbox checked={ess === true} onChange={() => handleEssChange(true)} label="Yes" />
                    <TickCheckbox checked={ess === false} onChange={() => handleEssChange(false)} label="No" />
                  </div>
                </div>
                {ess !== false && (
                  <div className="flex-1 flex flex-col gap-2">
                    <label className="block text-sm font-medium text-[var(--foreground)] mb-1">ESS Partial?</label>
                    <div className="flex gap-4">
                      <TickCheckbox checked={essPartial === true} onChange={() => handleEssPartialChange(true)} label="Yes" />
                      <TickCheckbox checked={essPartial === false} onChange={() => handleEssPartialChange(false)} label="No" />
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-2">
                {/* Transfers section removed for Pension Transfer as requested */}
              </div>
            </div>
          )}
          {caseType === 'ISA Transfer' && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/60 p-4 mb-2 flex flex-col gap-4">
              <div className="text-base mb-2 text-black dark:text-[var(--foreground)] font-normal">ISA Transfer Details</div>
              <div className="flex flex-wrap gap-4 mb-2">
                <TickCheckbox checked={stocks} onChange={e => setStocks(e.target.checked)} label="Stocks" />
                <TickCheckbox checked={shares} onChange={e => setShares(e.target.checked)} label="Shares" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Number of Stocks & Shares</label>
                  <input
                    type="number"
                    min={0}
                    value={numStocksAndShares}
                    onChange={e => handleNumStocksAndSharesChange(Number(e.target.value))}
                    className="w-full border border-[var(--border)] rounded-lg px-4 py-2 text-base bg-white dark:bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Number of Cash ISA</label>
                  <input
                    type="number"
                    min={0}
                    value={cashIsa}
                    onChange={e => {
                      const n = Math.max(0, Number(e.target.value));
                      setCashIsa(n);
                      setCashIsaProviders(prev => {
                        const arr = [...prev];
                        while (arr.length < n) arr.push("");
                        return arr.slice(0, n);
                      });
                    }}
                    className="w-full border border-[var(--border)] rounded-lg px-4 py-2 text-base bg-white dark:bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                  />
                </div>
              </div>
              <div className="mt-2">
                <div className="font-medium text-sm mb-2 text-zinc-500">Stocks & Shares Providers</div>
                <div className="flex flex-col gap-2">
                  {transfers.slice(0, numStocksAndShares).map((t) => (
                    <div key={t.provider} className="flex gap-2 items-center bg-white dark:bg-[var(--background)] rounded-lg p-2 border border-[var(--border)]">
                      <input
                        type="text"
                        value={t.provider}
                        onChange={e => handleTransferChange(transfers.indexOf(t), 'provider', e.target.value)}
                        placeholder="Provider name"
                        className="border border-[var(--border)] rounded-lg px-2 py-1 text-base bg-[var(--background)] dark:bg-[var(--muted)] text-[var(--foreground)] focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition w-full"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
              {cashIsa > 0 && (
                <div className="mt-2">
                  <div className="font-medium text-sm mb-2 text-zinc-500">Cash ISA Providers</div>
                  <div className="flex flex-col gap-2">
                    {Array.from({ length: cashIsa }).map((_, idx) => (
                      <div key={idx} className="flex gap-2 items-center bg-white dark:bg-[var(--background)] rounded-lg p-2 border border-[var(--border)]">
                        <input
                          type="text"
                          value={cashIsaProviders[idx] || ""}
                          onChange={e => setCashIsaProviders(prev => {
                            const arr = [...prev];
                            arr[idx] = e.target.value;
                            return arr;
                          })}
                          placeholder="Provider name"
                          className="border border-[var(--border)] rounded-lg px-2 py-1 text-base bg-[var(--background)] dark:bg-[var(--muted)] text-[var(--foreground)] focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition w-full"
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {caseType === 'Pension New Money' && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/60 p-4 mb-2 flex flex-col gap-4">
              <div className="text-base mb-2 text-black dark:text-[var(--foreground)] font-normal">Pension New Money Details</div>
              <div>
                <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Number of Transfers</label>
                <input
                  type="number"
                  min={1}
                  value={numTransfers}
                  onChange={e => handleNumTransfersNewMoney(Number(e.target.value))}
                  className="w-full border border-[var(--border)] rounded-lg px-4 py-2 text-base bg-white dark:bg-[var(--background)] text-[var(--foreground)] focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex flex-col gap-2">
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">ESS</label>
                  <div className="flex gap-4">
                    <TickCheckbox checked={essNewMoney === true} onChange={() => setEssNewMoney(true)} label="Yes" />
                    <TickCheckbox checked={essNewMoney === false} onChange={() => setEssNewMoney(false)} label="No" />
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <label className="block text-sm font-medium text-[var(--foreground)] mb-1">Carry Forward</label>
                  <div className="flex gap-4">
                    <TickCheckbox checked={carryForward === true} onChange={() => setCarryForward(true)} label="Yes" />
                    <TickCheckbox checked={carryForward === false} onChange={() => setCarryForward(false)} label="No" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="relative flex items-center gap-2">
                  <TickCheckbox checked={single.checked} onChange={e => setSingle({ ...single, checked: e.target.checked })} label="Single" />
                  <div className="relative w-[150px]">
                    <select
                      value={single.type || ''}
                      onChange={e => {
                        const val = e.target.value as 'personal' | 'employer' | '';
                        if (val === '') {
                          setSingle({ checked: false, type: null });
                        } else {
                          setSingle({ checked: true, type: val });
                        }
                      }}
                      className="w-full border border-[var(--border)] rounded-lg px-2 py-1 pr-8 text-base bg-[var(--background)] dark:bg-[var(--muted)] text-[var(--foreground)] focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition min-w-[120px] appearance-none"
                    >
                      <option value="">Select type</option>
                      <option value="personal">Personal</option>
                      <option value="employer">Employer</option>
                    </select>
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 flex items-center h-full">
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </span>
                  </div>
                </div>
                <div className="relative flex items-center gap-2">
                  <TickCheckbox checked={regular.checked} onChange={e => setRegular({ ...regular, checked: e.target.checked })} label="Regular" />
                  <div className="relative w-[150px]">
                    <select
                      value={regular.type || ''}
                      onChange={e => {
                        const val = e.target.value as 'personal' | 'employer' | '';
                        if (val === '') {
                          setRegular({ checked: false, type: null });
                        } else {
                          setRegular({ checked: true, type: val });
                        }
                      }}
                      className="w-full border border-[var(--border)] rounded-lg px-2 py-1 pr-8 text-base bg-[var(--background)] dark:bg-[var(--muted)] text-[var(--foreground)] focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition min-w-[120px] appearance-none"
                    >
                      <option value="">Select type</option>
                      <option value="personal">Personal</option>
                      <option value="employer">Employer</option>
                    </select>
                    <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 flex items-center h-full">
                      <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className="font-medium text-sm mb-2 text-zinc-500">Transfers</div>
                <div className="flex flex-col gap-2">
                  {transfers.slice(0, numTransfers).map((t) => (
                    <div key={t.provider} className="flex gap-2 items-center bg-white dark:bg-[var(--background)] rounded-lg p-2 border border-[var(--border)]">
                      <input
                        type="text"
                        value={t.provider}
                        onChange={e => handleTransferChange(transfers.indexOf(t), 'provider', e.target.value)}
                        placeholder="Provider name"
                        className="border border-[var(--border)] rounded-lg px-2 py-1 text-base bg-[var(--background)] dark:bg-[var(--muted)] text-[var(--foreground)] focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition w-full"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {caseType === 'ISA New Money' && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/60 p-4 mb-2 flex flex-col gap-4">
              <div className="text-base mb-2 text-black dark:text-[var(--foreground)] font-normal">ISA New Money Transfers</div>
              <div className="flex flex-col gap-2">
                {transfers.map((t, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-white dark:bg-[var(--background)] rounded-lg p-2 border border-[var(--border)]">
                    <input
                      type="text"
                      value={t.provider}
                      onChange={e => handleTransferChange(idx, 'provider', e.target.value)}
                      placeholder="Provider name"
                      className="border border-[var(--border)] rounded-lg px-2 py-1 text-base bg-[var(--background)] dark:bg-[var(--muted)] text-[var(--foreground)] focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition w-full"
                      required
                    />
                  </div>
                ))}
                <button type="button" onClick={() => setTransfers(prev => ([...prev, { transferType: 'isaNewMoney', amount: 0, provider: providers[0] }]))} className="mt-2 px-3 py-1 rounded bg-blue-100 text-blue-700 font-medium hover:bg-blue-200 transition">+ Add Transfer</button>
              </div>
            </div>
          )}
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
              disabled={false}
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