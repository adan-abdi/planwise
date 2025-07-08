import { Check, MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react';

export interface ClientItem {
  advisor: string;
  client: string;
  avatar: string;
  date: string;
  type: string;
  cfr: string;
  plans: number;
  checklist: number;
}

const ChecklistIcons = ({ count }: { count: number }) => {
  const [checked, setChecked] = useState([false, false, false, false].map((_, i) => i < count));
  const handleToggle = (idx: number) => {
    setChecked((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };
  return (
    <div className="flex items-center gap-[2px]">
      {checked.map((isChecked, i) => (
        <button
          key={i}
          type="button"
          onClick={() => handleToggle(i)}
          className={`w-5 h-5 flex items-center justify-center rounded-[6px] border transition-all align-middle cursor-pointer focus:ring-2 focus:ring-blue-200 appearance-none shadow-none ${isChecked ? 'border-green-500 bg-green-50' : 'border-zinc-200 bg-white'}`}
          style={{ outline: 'none' }}
        >
          {isChecked && <Check className="w-4 h-4 text-green-500 mx-auto my-auto" />}
        </button>
      ))}
    </div>
  );
};

export default function ClientList({ clients }: { clients: ClientItem[] }) {
  const [selectedRows, setSelectedRows] = useState<boolean[]>(clients.map(() => false));
  useEffect(() => {
    setSelectedRows((prev) => {
      if (clients.length === prev.length) return prev;
      // If clients added, add false; if removed, trim
      if (clients.length > prev.length) {
        return [...prev, ...Array(clients.length - prev.length).fill(false)];
      } else {
        return prev.slice(0, clients.length);
      }
    });
  }, [clients.length]);
  const allSelected = selectedRows.length > 0 && selectedRows.every(Boolean);
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows(selectedRows.map(() => false));
    } else {
      setSelectedRows(selectedRows.map(() => true));
    }
  };
  const handleSelectRow = (idx: number) => {
    setSelectedRows(selectedRows.map((v, i) => (i === idx ? !v : v)));
  };
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-sm text-left">
        <thead className="text-gray-500 bg-white">
          <tr>
            <th className="p-2">
              <button
                type="button"
                onClick={handleSelectAll}
                className={`appearance-none w-5 h-5 rounded-[6px] border transition-all align-middle cursor-pointer focus:ring-2 focus:ring-blue-200 flex items-center justify-center shadow-none ${allSelected ? 'border-green-500 bg-green-50' : 'border-zinc-200 bg-white'}`}
                style={{ outline: 'none' }}
              >
                {allSelected && <Check className="w-4 h-4 text-green-500" />}
              </button>
            </th>
            <th className="p-2 font-normal">Advisor Name</th>
            <th className="p-2 font-normal">Client Name</th>
            <th className="p-2 font-normal">Date Received</th>
            <th className="p-2 font-normal">Type of Case</th>
            <th className="p-2 font-normal">CFR Uploaded?</th>
            <th className="p-2 font-normal">Number of Plans</th>
            <th className="p-2 font-normal">Checklists Status</th>
            <th className="p-2 font-normal">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c, idx) => (
            <tr key={idx} className={`border-t ${selectedRows[idx] ? 'border-gray-200 bg-gray-50' : 'border-gray-100'} hover:bg-gray-50`}>
              <td className="p-2">
                <button
                  type="button"
                  onClick={() => handleSelectRow(idx)}
                  className={`appearance-none w-5 h-5 rounded-[6px] border transition-all align-middle cursor-pointer focus:ring-2 focus:ring-blue-200 flex items-center justify-center shadow-none ${selectedRows[idx] ? 'border-green-500 bg-green-50' : 'border-zinc-200 bg-white'}`}
                  style={{ outline: 'none' }}
                >
                  {selectedRows[idx] && <Check className="w-4 h-4 text-green-500" />}
                </button>
              </td>
              <td className="p-2">{c.advisor}</td>
              <td className="p-2 flex items-center gap-2">
                <div className="relative w-6 h-6">
                  <Image
                    src={c.avatar}
                    alt={c.client}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                {c.client}
              </td>
              <td className="p-2">on {c.date}</td>
              <td className="p-2">{c.type}</td>
              <td className="p-2">{c.cfr}</td>
              <td className="p-2">{c.plans}</td>
              <td className="p-2 flex items-center gap-2">
                <ChecklistIcons count={c.checklist} />
                <span className="text-gray-500 text-xs whitespace-nowrap">{c.checklist}/4 completed</span>
              </td>
              <td className="p-2"><MoreHorizontal className="w-4 h-4 text-gray-500" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
