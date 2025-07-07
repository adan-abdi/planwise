import { ArrowUpDown, Filter as FilterIcon, UserPlus, Download, ChevronDown } from "lucide-react";

export default function Clients() {
  return (
    <>
      <div className="flex items-center justify-between pl-8 pr-8 py-4 border-b-1 border-zinc-200 min-h-[64px] bg-white">
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 border border-zinc-200 rounded-lg px-3 py-1.5 text-sm text-zinc-700 font-normal bg-white hover:bg-zinc-100">
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </button>
          <button className="flex items-center gap-1 border border-zinc-200 rounded-lg px-3 py-1.5 text-sm text-zinc-700 font-normal bg-white hover:bg-zinc-100">
            <FilterIcon className="w-4 h-4" />
            Filter
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-1.5 text-sm text-zinc-700 font-normal bg-white hover:bg-zinc-100">
            <UserPlus className="w-4 h-4" />
            Add new client
          </button>
          <button className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-1.5 text-sm text-zinc-700 font-normal bg-white hover:bg-zinc-100">
            <Download className="w-4 h-4" />
            Import/Export
            <ChevronDown className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-center bg-white py-32">
        <div className="w-28 h-28 flex items-center justify-center mb-8">
          <svg width="88" height="88" fill="none" stroke="#e5e7eb" strokeWidth="1.5" viewBox="0 0 24 24">
            <rect x="4" y="7" width="16" height="13" rx="2" />
            <path d="M8 7V5a4 4 0 018 0v2" />
          </svg>
        </div>
        <div className="text-lg font-semibold text-zinc-900 mb-1">No bets placed yet</div>
        <div className="text-zinc-400 text-sm mb-6">Once users start placing bets, they&apos;ll appear here in real time.</div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-5 py-2 text-sm font-medium shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Create new client
        </button>
      </div>
    </>
  );
} 