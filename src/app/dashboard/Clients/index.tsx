import { ArrowUpDown, Filter as FilterIcon, UserPlus, Download, ChevronDown } from "lucide-react";
import React, { useState, useEffect } from "react";
import ClientModal from "./ClientModal";
import ClientList, { ClientItem } from "./ClientListItem";
import type { ClientFormData } from "./ClientModal";
import ClientDetails from "./ClientDetails";
import ReviewChecklistModal from "./ReviewChecklistModal";
import UploadModal from "./UploadModal";
import ClientFooter from "./ClientFooter";
import ClientEmptyState from "./ClientEmptyState";

export default function Clients({ detailsViewOpen, onDetailsViewChange }: { detailsViewOpen?: boolean; onDetailsViewChange?: (open: boolean, name?: string, tab?: string) => void; }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [selectedClientName, setSelectedClientName] = useState<string | null>(null);
  const [checklistStates, setChecklistStates] = useState<boolean[][]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('details');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [showReviewChecklist, setShowReviewChecklist] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Adjust as needed
  const totalPages = Math.max(1, Math.ceil(clients.length / pageSize));

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
  const handleCloseUploadModal = () => setUploadModalOpen(false);

  const selectedIdx = selectedClientName ? clients.findIndex(c => c.client === selectedClientName) : -1;
  const selectedClient = selectedIdx !== -1 ? clients[selectedIdx] : null;

  let clientContent: React.ReactNode;
  if (clients.length === 0) {
    clientContent = <ClientEmptyState onCreate={handleOpenModal} />;
  } else {
    clientContent = (
      <div className="p-0 px-0 sm:p-8">
        <ClientList
          clients={clients}
          onViewDetails={handleViewDetails}
          checklistStates={checklistStates}
          onChecklistChange={handleChecklistChange}
        />
      </div>
    );
  }

  // Sample checklist items for demo
  const checklistItems = [
    "Partner",
    "Client name",
    "Client DOB",
    "SJP SRA",
    "Recommended Fund Choice",
    "Checklist completed by",
    "Provider"
  ];

  return (
    <div className="flex flex-col h-full"> 
      <ClientModal open={modalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} />
      <div className="flex-1 min-h-0 flex flex-col">
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
            <div className="w-full bg-white flex-wrap gap-2 min-h-[64px] relative">
              {/* Edge-to-edge border for mobile only */}
              <div className="block sm:hidden absolute left-1/2 -translate-x-1/2 w-screen bottom-0 h-px bg-zinc-200" />
              <div className="flex sm:hidden mb-1 pt-4 pb-4 justify-between w-full">
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 p-1 px-2 rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 text-[11px] font-medium" aria-label="Sort">
                    <ArrowUpDown className="w-4 h-4 text-zinc-500" />
                    <span>Sort</span>
                  </button>
                  <button className="flex items-center gap-1 p-1 px-2 rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 text-[11px] font-medium" aria-label="Filter">
                    <FilterIcon className="w-4 h-4 text-zinc-500" />
                    <span>Filter</span>
                  </button>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleOpenModal} className="flex items-center gap-1 p-1 px-2 rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 text-[11px] font-medium" aria-label="Add new client">
                    <UserPlus className="w-4 h-4 text-zinc-500" />
                    <span>Add Client</span>
                  </button>
                  <button className="flex items-center gap-1 p-1 px-2 rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 text-[11px] font-medium" aria-label="Import/Export">
                    <Download className="w-4 h-4 text-zinc-500" />
                    <span>Import/Export</span>
                  </button>
                </div>
              </div>
              <div className="hidden sm:flex w-full items-center justify-between border-b border-zinc-200 px-8 py-4">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1 border border-zinc-200 rounded-lg px-3 py-1.5 text-sm text-zinc-700 font-normal bg-white hover:bg-zinc-100">
                    <ArrowUpDown className="w-4 h-4" />
                    Sort
                  </button>
                  <button className="flex items-center gap-1 border border-zinc-200 rounded-lg px-3 py-1.5 text-sm text-zinc-700 font-normal bg-white hover:bg-zinc-100">
                    <FilterIcon className="w-4 h-4" />
                    Filter
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleOpenModal} className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-1.5 text-sm text-zinc-700 font-normal bg-white hover:bg-zinc-100">
                    <UserPlus className="w-4 h-4" />
                    Add client
                  </button>
                  <button className="flex items-center gap-2 border border-zinc-200 rounded-lg px-3 py-1.5 text-sm text-zinc-700 font-normal bg-white hover:bg-zinc-100">
                    <Download className="w-4 h-4" />
                    Import/Export
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full px-0 sm:px-8 pt-0 pb-0 flex-1 flex flex-col min-h-0">{clientContent}</div>
          </>
        )}
        {/* UploadModal and ReviewChecklistModal coordination */}
        <UploadModal
          open={uploadModalOpen && !showReviewChecklist}
          onClose={handleCloseUploadModal}
          fileName={undefined}
          onShowReviewChecklist={() => setShowReviewChecklist(true)}
          onNoPersonalisedChecklist={() => {
            setUploadModalOpen(false);
            setShowReviewChecklist(true);
          }}
        />
        <ReviewChecklistModal
          open={showReviewChecklist}
          onCancel={() => setShowReviewChecklist(false)}
          onContinue={() => setShowReviewChecklist(false)}
          checklistItems={checklistItems}
        />
      </div>
      <ClientFooter selectedClient={selectedClient} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
    </div>
  );
}