import { ArrowUpDown, Filter as FilterIcon, UserPlus, Download, ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import ClientModal from "./ClientModal";
import ClientList, { ClientItem } from "./ClientListItem";
import type { ClientFormData } from "./ClientModal";
import ClientDetails from "./ClientDetails";

export default function Clients({ detailsViewOpen, onDetailsViewChange }: { detailsViewOpen?: boolean; onDetailsViewChange?: (open: boolean, name?: string, tab?: string) => void; }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [selectedClientName, setSelectedClientName] = useState<string | null>(null);
  const [checklistStates, setChecklistStates] = useState<boolean[][]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('details');

  React.useEffect(() => {
    if (detailsViewOpen === false) {
      setSelectedClientName(null);
    }
  }, [detailsViewOpen]);

  useEffect(() => {
    setChecklistStates((prev) => {
      if (clients.length === prev.length) return prev;
      if (clients.length > prev.length) {
        return [...prev, ...clients.slice(prev.length).map((c) => Array(4).fill(false).map((_, i) => i < c.checklist))];
      } else {
        return prev.slice(0, clients.length);
      }
    });
  }, [clients]);

  const handleChecklistChange = (idx: number, newChecklist: boolean[]) => {
    setChecklistStates((prev) => prev.map((arr, i) => (i === idx ? newChecklist : arr)));
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleSubmit = (data: ClientFormData) => {
    setClients((prev) => [
      ...prev,
      {
        advisor: data.partnerName,
        client: data.clientName,
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        date: data.dob ? new Date(data.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
        type: data.pensionTransfer > 0 ? "Pension New Money" : data.isaTransfer > 0 ? "ISA New Money" : "N/A",
        pensionTransfer: data.pensionTransfer,
        isaTransfer: data.isaTransfer,
        retirementAge: data.retirementAge,
        atr: data.atr,
        cfr: "No",
        plans: 1,
        checklist: 0,
      },
    ]);
    setModalOpen(false);
  };
  const handleViewDetails = (client: ClientItem) => {
    setSelectedClientName(client.client);
    if (onDetailsViewChange) onDetailsViewChange(true, client.client, selectedTab);
  };
  const handleClientUpdate = (updated: ClientItem) => {
    setClients((prev) => prev.map((c) => c.client === selectedClientName ? updated : c));
    if (updated.client !== selectedClientName) {
      setSelectedClientName(updated.client);
      if (onDetailsViewChange) onDetailsViewChange(true, updated.client, selectedTab);
    }
  };
  const handleTabChange = (tab: string) => {
    setSelectedTab(tab);
    if (selectedClientName) {
      if (onDetailsViewChange) onDetailsViewChange(true, selectedClientName, tab);
    }
  };

  const selectedIdx = selectedClientName ? clients.findIndex(c => c.client === selectedClientName) : -1;
  const selectedClient = selectedIdx !== -1 ? clients[selectedIdx] : null;

  let clientContent: React.ReactNode;
  if (clients.length === 0) {
    clientContent = (
      <div className="flex-1 flex flex-col items-center justify-center text-center bg-white py-32">
        <div className="w-28 h-28 flex items-center justify-center mb-8">
          <svg width="88" height="88" fill="none" stroke="#e5e7eb" strokeWidth="1.5" viewBox="0 0 24 24">
            <rect x="4" y="7" width="16" height="13" rx="2" />
            <path d="M8 7V5a4 4 0 018 0v2" />
          </svg>
        </div>
        <div className="text-lg font-semibold text-zinc-900 mb-1">No clients on record</div>
        <div className="text-zinc-400 text-sm mb-6">Once you add a client a list of them will appear here in real time.</div>
        <button onClick={handleOpenModal} className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-5 py-2 text-sm font-medium shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Create new client
        </button>
      </div>
    );
  } else {
    clientContent = (
      <div className="p-8">
        <ClientList
          clients={clients}
          onViewDetails={handleViewDetails}
          checklistStates={checklistStates}
          onChecklistChange={handleChecklistChange}
        />
      </div>
    );
  }

  return (
    <>
      <ClientModal open={modalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} />
      {selectedClient ? (
        <ClientDetails
          client={selectedClient}
          onClientUpdate={handleClientUpdate}
          checklist={checklistStates[selectedIdx]}
          onChecklistChange={(newChecklist) => {
            if (selectedIdx !== -1) handleChecklistChange(selectedIdx, newChecklist);
          }}
          onTabChange={handleTabChange}
        />
      ) : (
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
              <button onClick={handleOpenModal} className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-1.5 text-sm text-zinc-700 font-normal bg-white hover:bg-zinc-100">
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
          {clientContent}
        </>
      )}
    </>
  );
}