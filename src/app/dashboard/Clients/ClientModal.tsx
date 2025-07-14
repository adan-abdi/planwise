import React from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, ChevronDown } from 'lucide-react';
import { useTheme } from '../../../theme-context';

export interface ClientFormData {
  clientName: string;
  advisorName: string;
  pensionTransfer: number;
  isaTransfer: number;
  dob: string;
  retirementAge: string;
  atr: string;
  pensionNewMoney: number;
  isaNewMoney: number;
}

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: ClientFormData) => void;
}

const atrOptions = [
  "Low", "Medium Low", "Medium", "Medium High", "High"
];

export default function ClientModal({ open, onClose, onSubmit }: ClientModalProps) {
  const [clientName, setClientName] = React.useState("");
  const [advisorName, setAdvisorName] = React.useState("");
  const [pensionTransfer, setPensionTransfer] = React.useState(0);
  const [isaTransfer, setIsaTransfer] = React.useState(0);
  const [pensionNewMoney, setPensionNewMoney] = React.useState(0);
  const [isaNewMoney, setIsaNewMoney] = React.useState(0);
  const [dob, setDob] = React.useState<Date | null>(null);
  const [retirementAge, setRetirementAge] = React.useState("");
  const [atr, setAtr] = React.useState("");
  const { darkMode } = useTheme();
  const [showRetirementDropdown, setShowRetirementDropdown] = React.useState<boolean>(false);

  const resetForm = () => {
    setClientName("");
    setAdvisorName("");
    setPensionTransfer(0);
    setIsaTransfer(0);
    setPensionNewMoney(0);
    setIsaNewMoney(0);
    setDob(null);
    setRetirementAge("");
    setAtr("");
  };

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({
        clientName,
        advisorName,
        pensionTransfer,
        isaTransfer,
        dob: dob ? dob.toISOString().split('T')[0] : '',
        retirementAge,
        atr,
        pensionNewMoney, // add to form data
        isaNewMoney,     // add to form data
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
    clientName.trim() !== '' &&
    advisorName.trim() !== '' &&
    dob !== null &&
    retirementAge.trim() !== '' &&
    atr.trim() !== '';

  const numberOfPlans = pensionTransfer + isaTransfer + pensionNewMoney + isaNewMoney;

  const commonRetirementAges = ["50", "60", "70", "80", "90", "100"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--background)]/60 dark:bg-black/60 backdrop-blur-sm transition-all px-2 sm:px-0 overflow-y-auto">
      <div className="bg-[var(--background)] rounded-2xl shadow-2xl w-full max-w-xl relative border border-[var(--border)] flex flex-col mx-auto my-2 sm:my-0 max-h-[80vh] overflow-visible">
        <div className="px-4 sm:px-6 py-2 border-b border-[var(--border)] rounded-t-2xl bg-[var(--muted)] dark:bg-[var(--muted)]">
          <span className="text-zinc-400 font-medium text-base">Create new client</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-0 px-4 sm:px-6 pt-3 pb-1 space-y-2">
          <div className="flex flex-col sm:flex-row justify-between gap-2 mb-3 items-center">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1 text-left">Client</label>
              <input
                type="text"
                placeholder="Enter client name"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="w-full border border-[var(--border)] rounded-lg px-4 py-2 text-base bg-[var(--background)] dark:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-zinc-400 text-left text-[var(--foreground)]"
              />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-[var(--foreground)] mb-1 text-left">Advisor name</label>
              <input
                type="text"
                placeholder="Enter advisor name"
                value={advisorName}
                onChange={e => setAdvisorName(e.target.value)}
                className="w-full border border-[var(--border)] rounded-lg px-4 py-2 text-base bg-[var(--background)] dark:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-zinc-400 text-left text-[var(--foreground)]"
              />
            </div>
          </div>
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
          <div className="mb-3 w-full">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1 text-left">Date of Birth</label>
            <DatePicker
              selected={dob}
              onChange={date => setDob(date)}
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="DD / MM / YYYY"
              calendarClassName={`rounded-xl shadow-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]${darkMode ? ' datepicker-dark' : ''}`}
              popperClassName={darkMode ? 'datepicker-dark-popper' : ''}
              popperPlacement="bottom"
              wrapperClassName="w-full"
              customInput={
                <div className="relative w-full min-w-0">
                  <input
                    type="text"
                    value={dob ? dob.toLocaleDateString('en-GB') : ''}
                    readOnly
                    placeholder="DD / MM / YYYY"
                    className="w-full min-w-0 border border-[var(--border)] rounded-lg px-4 py-2 text-base bg-[var(--background)] dark:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder-zinc-400 pr-10 text-left text-[var(--foreground)]"
                    style={{ fontFamily: 'inherit' }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                    <Calendar className="w-5 h-5" />
                  </span>
                </div>
              }
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1 text-left">Retirement age</label>
            <div className="flex flex-row gap-2 items-center relative">
              <input
                type="number"
                min={50}
                max={99}
                value={retirementAge}
                onChange={e => {
                  const val = e.target.value;
                  if (val === '' || (/^\d+$/.test(val) && +val >= 50 && +val <= 99)) {
                    setRetirementAge(val);
                  }
                }}
                placeholder="Enter age (50-99)"
                className="flex-1 border border-[var(--border)] rounded-lg px-4 py-2 text-base bg-[var(--background)] dark:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-[var(--foreground)] placeholder-zinc-400 text-left"
              />
              <button
                type="button"
                className="w-10 h-10 flex items-center justify-center border border-[var(--border)] rounded-lg bg-[var(--background)] dark:bg-[var(--muted)] focus:outline-none"
                onClick={() => setShowRetirementDropdown(v => !v)}
                tabIndex={-1}
                aria-label="Show common ages"
              >
                <ChevronDown className="w-5 h-5 text-zinc-400" />
              </button>
              {showRetirementDropdown && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-[var(--background)] dark:bg-[var(--muted)] border border-[var(--border)] rounded-lg shadow-lg z-50">
                  {commonRetirementAges.map(age => (
                    <div
                      key={age}
                      className={`px-4 py-2 cursor-pointer ${retirementAge === age ? 'font-semibold' : ''}`}
                      style={retirementAge === age
                        ? (darkMode
                            ? { background: '#1e293b', color: '#f4f4f5' }
                            : { background: '#e0e7ef', color: '#18181b' })
                        : undefined}
                      onMouseDown={e => { e.preventDefault(); setRetirementAge(age); setShowRetirementDropdown(false); }}
                      onMouseEnter={e => {
                        if (retirementAge !== age) {
                          e.currentTarget.style.background = darkMode ? '#1e293b' : '#f4f4f5';
                          e.currentTarget.style.color = darkMode ? '#f4f4f5' : '#18181b';
                        }
                      }}
                      onMouseLeave={e => {
                        if (retirementAge !== age) {
                          e.currentTarget.style.background = '';
                          e.currentTarget.style.color = '';
                        }
                      }}
                    >
                      {age}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1 text-left">ATR (Attitude to risk) / Recommended portfolio</label>
            <div className="relative">
              <select
                value={atr}
                onChange={e => setAtr(e.target.value)}
                className="appearance-none w-full border border-[var(--border)] rounded-lg px-4 py-2 pr-10 text-base bg-[var(--background)] dark:bg-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 text-[var(--foreground)] placeholder-zinc-400 text-left"
              >
                <option value="" disabled>Select an option</option>
                {atrOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="w-5 h-5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-[var(--foreground)] mb-1 flex items-center gap-1 text-left">
              Number of Plans
              <span className="text-zinc-400 cursor-pointer" title="This will be pre-filled">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              </span>
            </label>
            <input
              type="text"
              value={numberOfPlans === 0 ? 'This will be pre-filled' : numberOfPlans}
              disabled
              className="w-full border border-[var(--border)] rounded-lg px-4 py-2 text-base bg-[var(--muted)] text-zinc-400 cursor-not-allowed text-left"
            />
          </div>
          <div className="flex flex-row justify-end gap-2 py-3 rounded-b-2xl bg-[var(--background)]">
            <button type="button" onClick={handleCancel} 
              className="px-4 py-2 rounded-lg text-base font-medium transition w-full sm:w-auto mb-2 sm:mb-0 border"
              style={{
                backgroundColor: 'var(--muted)',
                color: '#18181b',
                borderColor: 'var(--border)',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#f4f4f5'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--muted)'; }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-base font-medium transition w-full sm:w-auto ${isFormValid ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer' : 'bg-zinc-300 text-zinc-500 cursor-not-allowed'}`}
              disabled={!isFormValid}
            >
              Create new client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 