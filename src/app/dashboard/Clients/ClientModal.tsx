import React from "react";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar } from 'lucide-react';

export interface ClientFormData {
  clientName: string;
  partnerName: string;
  pensionTransfer: number;
  isaTransfer: number;
  dob: string;
  retirementAge: string;
  atr: string;
}

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: ClientFormData) => void;
}

const retirementAges = ["55", "60", "65", "67", "70"];
const atrOptions = [
  "Low", "Medium Low", "Medium", "Medium High", "High"
];

export default function ClientModal({ open, onClose, onSubmit }: ClientModalProps) {
  const [clientName, setClientName] = React.useState("");
  const [partnerName, setPartnerName] = React.useState("");
  const [pensionTransfer, setPensionTransfer] = React.useState(0);
  const [isaTransfer, setIsaTransfer] = React.useState(0);
  const [dob, setDob] = React.useState<Date | null>(null);
  const [retirementAge, setRetirementAge] = React.useState("");
  const [atr, setAtr] = React.useState("");

  const resetForm = () => {
    setClientName("");
    setPartnerName("");
    setPensionTransfer(0);
    setIsaTransfer(0);
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
        partnerName,
        pensionTransfer,
        isaTransfer,
        dob: dob ? dob.toISOString().split('T')[0] : '',
        retirementAge,
        atr,
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
    partnerName.trim() !== '' &&
    dob !== null &&
    retirementAge.trim() !== '' &&
    atr.trim() !== '';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl relative border border-zinc-200 flex flex-col">
        <div className="px-6 py-3 border-b border-zinc-200 rounded-t-2xl bg-zinc-50">
          <span className="text-zinc-400 font-medium text-base">Create new client</span>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-0 px-6 pt-6 pb-2">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-zinc-900 mb-1">Client</label>
              <input
                type="text"
                placeholder="Enter client name"
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="w-full border border-zinc-200 rounded-[16px] px-4 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder-zinc-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-zinc-900 mb-1">Partner name</label>
              <input
                type="text"
                placeholder="Enter partner name"
                value={partnerName}
                onChange={e => setPartnerName(e.target.value)}
                className="w-full border border-zinc-200 rounded-[16px] px-4 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder-zinc-400"
              />
            </div>
          </div>
          <div className="flex gap-8 mb-4">
            <div className="flex flex-col flex-1">
              <span className="text-xs text-zinc-400 mb-1">Pension Transfer</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setPensionTransfer(Math.max(0, pensionTransfer - 1))} className="w-8 h-8 rounded-l-full border border-zinc-200 flex items-center justify-center text-lg text-zinc-400 bg-white hover:bg-zinc-100 transition-all"><span className="-mt-0.5">−</span></button>
                <span className="w-6 text-center text-base text-zinc-900">{pensionTransfer}</span>
                <button type="button" onClick={() => setPensionTransfer(pensionTransfer + 1)} className="w-8 h-8 rounded-r-full border border-zinc-200 flex items-center justify-center text-lg text-zinc-400 bg-white hover:bg-zinc-100 transition-all"><span className="-mt-0.5">＋</span></button>
              </div>
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-xs text-zinc-400 mb-1">ISA transfer</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setIsaTransfer(Math.max(0, isaTransfer - 1))} className="w-8 h-8 rounded-l-full border border-zinc-200 flex items-center justify-center text-lg text-zinc-400 bg-white hover:bg-zinc-100 transition-all"><span className="-mt-0.5">−</span></button>
                <span className="w-6 text-center text-base text-zinc-900">{isaTransfer}</span>
                <button type="button" onClick={() => setIsaTransfer(isaTransfer + 1)} className="w-8 h-8 rounded-r-full border border-zinc-200 flex items-center justify-center text-lg text-zinc-400 bg-white hover:bg-zinc-100 transition-all"><span className="-mt-0.5">＋</span></button>
              </div>
            </div>
          </div>

          <div className="mb-4 w-full">
            <label className="block text-sm font-medium text-zinc-900 mb-1">Date of Birth</label>
            <DatePicker
              selected={dob}
              onChange={date => setDob(date)}
              dateFormat="dd/MM/yyyy"
              maxDate={new Date()}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="DD / MM / YYYY"
              calendarClassName="rounded-xl shadow-lg border border-zinc-200 bg-white"
              popperPlacement="bottom"
              wrapperClassName="w-full"
              customInput={
                <div className="relative w-full min-w-0">
                  <input
                    type="text"
                    value={dob ? dob.toLocaleDateString('en-GB') : ''}
                    readOnly
                    placeholder="DD / MM / YYYY"
                    className="w-full min-w-0 border border-zinc-200 rounded-[16px] px-4 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 placeholder-zinc-400 pr-10"
                    style={{ fontFamily: 'inherit' }}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
                    <Calendar className="w-5 h-5" />
                  </span>
                </div>
              }
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-900 mb-1">Retirement age</label>
            <select
              value={retirementAge}
              onChange={e => setRetirementAge(e.target.value)}
              className="w-full border border-zinc-200 rounded-[16px] px-4 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-zinc-900 placeholder-zinc-400"
            >
              <option value="" disabled>Select an option</option>
              {retirementAges.map(age => (
                <option key={age} value={age}>{age}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-zinc-900 mb-1">ATR (Attitude to risk) / Recommended portfolio</label>
            <select
              value={atr}
              onChange={e => setAtr(e.target.value)}
              className="w-full border border-zinc-200 rounded-[16px] px-4 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-zinc-900 placeholder-zinc-400"
            >
              <option value="" disabled>Select an option</option>
              {atrOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-zinc-900 mb-1 flex items-center gap-1">
              Number of Plans
              <span className="text-zinc-400 cursor-pointer" title="This will be pre-filled">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              </span>
            </label>
            <input
              type="text"
              value="This will be pre-filled"
              disabled
              className="w-full border border-zinc-200 rounded-[16px] px-4 py-2.5 text-base bg-zinc-50 text-zinc-400 cursor-not-allowed"
            />
          </div>
          <div className="flex justify-end gap-3 px-6 py-4 rounded-b-2xl bg-white">
            <button type="button" onClick={handleCancel} className="px-5 py-2 rounded-lg text-base font-medium text-zinc-500 bg-zinc-100 hover:bg-zinc-200 transition">Cancel</button>
            <button
              type="submit"
              className={`px-5 py-2 rounded-lg text-base font-medium text-white transition ${isFormValid ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-blue-100 cursor-not-allowed'}`}
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