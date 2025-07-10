import { ArrowUpDown, Filter as FilterIcon, UserPlus, Download, ChevronDown, SquareUserRound } from "lucide-react";
import React, { useState, useEffect } from "react";
import ClientModal from "./ClientModal";
import ClientList, { ClientItem } from "./ClientListItem";
import type { ClientFormData } from "./ClientModal";
import ClientDetails from "./ClientDetails";
import ChecklistReview from "./ChecklistReview";
import ReviewChecklistModal from "./ReviewChecklistModal";
import UploadModal from "./UploadModal";
import ClientFooter from "./ClientFooter";
import ClientEmptyState from "./ClientEmptyState";
import { useTheme } from "../../../theme-context";

export default function Clients({ detailsViewOpen, onDetailsViewChange, onGenerateRandomClients, triggerRandomClients, onRandomClientsGenerated, onBreadcrumbChange }: { 
  detailsViewOpen?: boolean; 
  onDetailsViewChange?: (open: boolean, name?: string, tab?: string) => void;
  onGenerateRandomClients?: () => ClientItem[];
  triggerRandomClients?: boolean;
  onRandomClientsGenerated?: () => void;
  onBreadcrumbChange?: (path: Array<{label: string, icon?: React.ReactNode, onClick?: () => void, isActive?: boolean}>) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [selectedClientName, setSelectedClientName] = useState<string | null>(null);
  const [checklistStates, setChecklistStates] = useState<boolean[][]>([]);
  const [selectedTab, setSelectedTab] = useState<string>('details');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [showReviewChecklist, setShowReviewChecklist] = useState(false);
  const [showChecklistReview, setShowChecklistReview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Adjust as needed
  const totalPages = Math.max(1, Math.ceil(clients.length / pageSize));
  const { darkMode } = useTheme();
  const [reviewChecklistData, setReviewChecklistData] = useState<{
    checklistItems: string[];
    reviewerName: string;
    reviewerAvatar: string;
  } | null>(null);

  React.useEffect(() => {
    if (detailsViewOpen === false) {
      setSelectedClientName(null);
    }
  }, [detailsViewOpen]);

  // Handle random clients generation trigger
  React.useEffect(() => {
    if (triggerRandomClients && onGenerateRandomClients && onRandomClientsGenerated) {
      const randomClients = onGenerateRandomClients();
      setClients(randomClients);
      onRandomClientsGenerated();
    }
  }, [triggerRandomClients, onGenerateRandomClients, onRandomClientsGenerated]);

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

  const handleGenerateRandomClients = () => {
    if (onGenerateRandomClients) {
      const randomClients = onGenerateRandomClients();
      setClients(randomClients);
    }
  };

  const handleStartChecklistReview = () => {
    if (selectedClient) {
      setReviewChecklistData({
        checklistItems,
        reviewerName: selectedClient.client,
        reviewerAvatar: selectedClient.avatar,
      });
      setShowChecklistReview(true);
    }
  };

  const selectedIdx = selectedClientName ? clients.findIndex(c => c.client === selectedClientName) : -1;
  const selectedClient = selectedIdx !== -1 ? clients[selectedIdx] : null;

  // Reset ChecklistReview when changing client
  useEffect(() => {
    setShowChecklistReview(false);
  }, [selectedClientName]);

  useEffect(() => {
    if (onBreadcrumbChange) onBreadcrumbChange(buildBreadcrumb());
  }, [selectedClient, selectedTab, showChecklistReview, reviewChecklistData]);

  // For back from CFR Checklist, just hide ChecklistReview
  const handleChecklistReviewBack = () => {
    setShowChecklistReview(false);
  };

  let clientContent: React.ReactNode;
  if (clients.length === 0) {
    clientContent = <ClientEmptyState onCreate={handleOpenModal} />;
  } else {
    clientContent = (
      <div className="sm:px-8 sm:pt-4">
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

  // Helper to build the full breadcrumb path
  const buildBreadcrumb = () => {
    const path = [];
    // Only allow going back to client section if not in CFR Checklist
    const canGoBackToClientSection = !(showChecklistReview && reviewChecklistData);
    path.push({ label: 'Clients', icon: <SquareUserRound className="w-4 h-4 text-zinc-400" />, onClick: canGoBackToClientSection ? () => { if (onDetailsViewChange) onDetailsViewChange(false); } : undefined, isActive: false });
    if (selectedClient) {
      path.push({ label: `Client: ${selectedClient.client}`, isActive: false });
      if (selectedTab.startsWith('transfers/')) {
        path.push({ label: 'Transfers', isActive: false });
        const folders = selectedTab.replace('transfers/', '').split('/');
        folders.forEach((folder, idx) => {
          path.push({ label: folder, isActive: false });
        });
      } else {
        path.push({ label: selectedTab === 'details' ? 'Client details' : selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1), isActive: false });
      }
    }
    if (showChecklistReview && reviewChecklistData) {
      path.push({ label: 'CFR Checklist', isActive: true });
    } else if (path.length > 0) {
      path[path.length-1].isActive = true;
    }
    return path;
  };

  return (
    <div className="flex flex-col h-full" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}> 
      {/* TEMP: Row for test button, styled like save/cancel and in same row */}
      {selectedClient && (
        null
      )}
      <ClientModal open={modalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} />
      <div className="flex-1 min-h-0 flex flex-col" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {showChecklistReview && reviewChecklistData ? (
          <ChecklistReview
            checklistItems={reviewChecklistData.checklistItems}
            reviewerName={reviewChecklistData.reviewerName}
            reviewerAvatar={reviewChecklistData.reviewerAvatar}
            onChecklistChange={() => {}}
            onBack={handleChecklistReviewBack}
          />
        ) : selectedClient ? (
          <ClientDetails
            client={selectedClient}
            onClientUpdate={handleClientUpdate}
            checklist={checklistStates[selectedIdx]}
            onChecklistChange={(newChecklist) => {
              if (selectedIdx !== -1) handleChecklistChange(selectedIdx, newChecklist);
            }}
            onShowChecklistReviewTest={() => {
              setReviewChecklistData({
                checklistItems,
                reviewerName: selectedClient.client,
                reviewerAvatar: selectedClient.avatar,
              });
              setShowChecklistReview(true);
            }}
            onTabChange={handleTabChange}
          />
        ) : (
          <>
            <div className="w-full bg-white dark:bg-[var(--background)] flex-wrap gap-2 min-h-[64px] relative border-b" style={{ borderColor: darkMode ? '#52525b' : '#e4e4e7' }}>
              {/* Edge-to-edge border for mobile only */}
              <div className="block sm:hidden absolute left-1/2 -translate-x-1/2 w-screen bottom-0 h-px bg-zinc-200 dark:bg-[var(--border)]" />
              <div className="flex sm:hidden mb-1 pt-4 pb-4 justify-between w-full">
                <div className="flex gap-2">
                  <button 
                    className="flex items-center gap-1 p-1 px-2 rounded-md border border-zinc-200 dark:border-[var(--border)] bg-white dark:bg-[var(--muted)] text-[11px] font-medium text-zinc-700 dark:text-[var(--foreground)] transition" 
                    aria-label="Sort"
                    style={{
                      backgroundColor: darkMode ? 'var(--muted)' : 'white',
                      borderColor: darkMode ? 'var(--border)' : '#e5e7eb'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
                    }}
                  >
                    <ArrowUpDown className="w-4 h-4 text-zinc-500 dark:text-[var(--foreground)]" />
                    <span className="dark:text-[var(--foreground)]">Sort</span>
                  </button>
                  <button 
                    className="flex items-center gap-1 p-1 px-2 rounded-md border border-zinc-200 dark:border-[var(--border)] bg-white dark:bg-[var(--muted)] text-[11px] font-medium text-zinc-700 dark:text-[var(--foreground)] transition" 
                    aria-label="Filter"
                    style={{
                      backgroundColor: darkMode ? 'var(--muted)' : 'white',
                      borderColor: darkMode ? 'var(--border)' : '#e5e7eb'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
                    }}
                  >
                    <FilterIcon className="w-4 h-4 text-zinc-500 dark:text-[var(--foreground)]" />
                    <span className="dark:text-[var(--foreground)]">Filter</span>
                  </button>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleOpenModal} 
                    className="flex items-center gap-1 p-1 px-2 rounded-md border border-zinc-200 dark:border-[var(--border)] bg-white dark:bg-[var(--muted)] text-[11px] font-medium text-zinc-700 dark:text-[var(--foreground)] transition" 
                    aria-label="Add new client"
                    style={{
                      backgroundColor: darkMode ? 'var(--muted)' : 'white',
                      borderColor: darkMode ? 'var(--border)' : '#e5e7eb'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
                    }}
                  >
                    <UserPlus className="w-4 h-4 text-zinc-500 dark:text-[var(--foreground)]" />
                    <span className="dark:text-[var(--foreground)]">Add Client</span>
                  </button>
                  <button 
                    className="flex items-center gap-1 p-1 px-2 rounded-md border border-zinc-200 dark:border-[var(--border)] bg-white dark:bg-[var(--muted)] text-[11px] font-medium text-zinc-700 dark:text-[var(--foreground)] transition" 
                    aria-label="Import/Export"
                    style={{
                      backgroundColor: darkMode ? 'var(--muted)' : 'white',
                      borderColor: darkMode ? 'var(--border)' : '#e5e7eb'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
                    }}
                  >
                    <Download className="w-4 h-4 text-zinc-500 dark:text-[var(--foreground)]" />
                    <span className="dark:text-[var(--foreground)]">Import/Export</span>
                  </button>
                </div>
              </div>
              <div className="hidden sm:flex w-full items-center justify-between border-b border-zinc-200 dark:border-[var(--border)] px-8 py-4 bg-white dark:bg-[var(--background)]">
                <div className="flex items-center gap-2">
                  <button 
                    className="flex items-center gap-1 border border-zinc-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-normal bg-white dark:bg-[var(--muted)] text-zinc-700 dark:text-[var(--foreground)] transition"
                    style={{
                      backgroundColor: darkMode ? 'var(--muted)' : 'white',
                      borderColor: darkMode ? 'var(--border)' : '#e5e7eb'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
                    }}
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    Sort
                  </button>
                  <button 
                    className="flex items-center gap-1 border border-zinc-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-normal bg-white dark:bg-[var(--muted)] text-zinc-700 dark:text-[var(--foreground)] transition"
                    style={{
                      backgroundColor: darkMode ? 'var(--muted)' : 'white',
                      borderColor: darkMode ? 'var(--border)' : '#e5e7eb'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
                    }}
                  >
                    <FilterIcon className="w-4 h-4" />
                    Filter
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleOpenModal} 
                    className="flex items-center gap-2 border border-zinc-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-normal bg-white dark:bg-[var(--muted)] text-zinc-700 dark:text-[var(--foreground)] transition"
                    style={{
                      backgroundColor: darkMode ? 'var(--muted)' : 'white',
                      borderColor: darkMode ? 'var(--border)' : '#e5e7eb'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
                    }}
                  >
                    <UserPlus className="w-4 h-4" />
                    Add client
                  </button>
                  <button 
                    className="flex items-center gap-2 border border-zinc-200 dark:border-[var(--border)] rounded-lg px-3 py-1.5 text-sm font-normal bg-white dark:bg-[var(--muted)] text-zinc-700 dark:text-[var(--foreground)] transition"
                    style={{
                      backgroundColor: darkMode ? 'var(--muted)' : 'white',
                      borderColor: darkMode ? 'var(--border)' : '#e5e7eb'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
                    }}
                  >
                    <Download className="w-4 h-4" />
                    Import/Export
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full pt-0 pb-0 flex-1 flex flex-col min-h-0">{clientContent}</div>
          </>
        )}
        {/* UploadModal and ReviewChecklistModal coordination */}
        <UploadModal
          open={uploadModalOpen && !showReviewChecklist}
          onClose={handleCloseUploadModal}
          fileName={undefined}
          onShowReviewChecklist={handleStartChecklistReview}
          onNoPersonalisedChecklist={() => {
            setUploadModalOpen(false);
            handleStartChecklistReview();
          }}
        />
        <ReviewChecklistModal
          open={showReviewChecklist}
          onCancel={() => setShowReviewChecklist(false)}
          onContinue={() => { setShowReviewChecklist(false); handleStartChecklistReview(); }}
          checklistItems={checklistItems}
        />
      </div>
      <ClientFooter selectedClient={selectedClient} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} isEmpty={clients.length === 0} showFooterActions={showChecklistReview && !!reviewChecklistData} />
    </div>
  );
}