import { ArrowUpDown, Filter as FilterIcon, UserPlus, Download, Upload, SquareUserRound, RefreshCw, Search as SearchIcon, ArrowLeft } from "lucide-react";
import React, { useState, useEffect, useCallback, useRef } from "react";
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

export default function Clients({ detailsViewOpen, onDetailsViewChange, onGenerateRandomClients, triggerRandomClients, onRandomClientsGenerated, onBreadcrumbChange, onBackToClientList }: { 
  detailsViewOpen?: boolean; 
  onDetailsViewChange?: (open: boolean, name?: string, tab?: string) => void;
  onGenerateRandomClients?: () => ClientItem[];
  triggerRandomClients?: boolean;
  onRandomClientsGenerated?: () => void;
  onBreadcrumbChange?: (path: Array<{label: string, icon?: React.ReactNode, onClick?: () => void, isActive?: boolean}>) => void;
  onBackToClientList?: () => void;
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
  const pageSize = 13;
  const totalPages = Math.max(1, Math.ceil(clients.length / pageSize));
  const { darkMode } = useTheme();
  const [reviewChecklistData, setReviewChecklistData] = useState<{
    checklistItems: string[];
    reviewerName: string;
  } | null>(null);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [viewingCaseIdx, setViewingCaseIdx] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  // 1. Add state for cases pagination at the Clients level
  const [casesCurrentPage, setCasesCurrentPage] = useState<number>(1);

  React.useEffect(() => {
    if (detailsViewOpen === false) {
      setSelectedClientName(null);
      setShowChecklistReview(false);
    }
  }, [detailsViewOpen]);

  React.useEffect(() => {
    if (triggerRandomClients && onGenerateRandomClients && onRandomClientsGenerated) {
      const randomClients = onGenerateRandomClients();
      setClients(randomClients);
      onRandomClientsGenerated();
    }
  }, [triggerRandomClients, onGenerateRandomClients, onRandomClientsGenerated]);

  useEffect(() => {
    if (clients.length !== checklistStates.length) {
      if (clients.length > checklistStates.length) {
        setChecklistStates(prev => [
          ...prev,
          ...clients.slice(prev.length).map((c) => Array(4).fill(false).map((_, i) => i < c.checklist))
        ]);
      } else {
        setChecklistStates(prev => prev.slice(0, clients.length));
      }
    }
  }, [clients, checklistStates.length]);

  const handleChecklistChange = (idx: number, newChecklist: boolean[]) => {
    setChecklistStates((prev) => prev.map((arr, i) => (i === idx ? newChecklist : arr)));
  };

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const handleSubmit = (data: ClientFormData) => {
    setClients((prev) => [
      ...prev,
      {
        advisor: data.advisorName,
        client: data.clientName,
        date: '',
        type: 'N/A',
        pensionTransfer: 0,
        isaTransfer: 0,
        pensionNewMoney: 0,
        isaNewMoney: 0,
        retirementAge: '',
        atr: '',
        cfr: "No",
        plans: 0,
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

  const handleShowReviewChecklist = () => {
    if (selectedClient) {
      setReviewChecklistData({
        checklistItems,
        reviewerName: selectedClient.client,
      });
      setShowReviewChecklist(true);
    }
  };

  const selectedIdx = selectedClientName ? clients.findIndex(c => c.client === selectedClientName) : -1;
  const selectedClient = selectedIdx !== -1 ? clients[selectedIdx] : null;

  const buildBreadcrumb = useCallback(() => {
    const path = [];
    if (selectedClient) {
      // Add back button as first breadcrumb item
      path.push({ label: '', icon: <ArrowLeft className="w-4 h-4" />, onClick: goToClientList, isActive: false });
    }
    const canGoBackToClientSection = !(showChecklistReview && reviewChecklistData);
    path.push({ label: 'Clients', icon: <SquareUserRound className="w-4 h-4 text-zinc-400" />, onClick: canGoBackToClientSection ? () => { if (onDetailsViewChange) onDetailsViewChange(false); } : undefined, isActive: false });
    if (selectedClient) {
      path.push({ label: `Client: ${selectedClient.client}`, isActive: false });
      if (selectedTab === 'transfers' || selectedTab.startsWith('transfers/')) {
        path.push({ label: 'Cases', isActive: false });
        // Only show case type if a case is actually being viewed
        if (
          selectedTab === 'transfers' &&
          viewingCaseIdx !== null &&
          selectedClient &&
          Array.isArray((selectedClient as { cases?: { caseType: string }[] }).cases) &&
          (selectedClient as { cases?: { caseType: string }[] }).cases![viewingCaseIdx]
        ) {
          path.push({ label: (selectedClient as { cases?: { caseType: string }[] }).cases![viewingCaseIdx].caseType, isActive: false });
        }
        if (selectedTab.startsWith('transfers/')) {
          const rest = selectedTab.replace('transfers/', '');
          if (rest) {
            const segments = rest.split('/');
            if (segments[0]) {
              path.push({ label: segments[0], isActive: false });
            }
            // If there are deeper segments (e.g. folders/files), add them
            for (let i = 1; i < segments.length; i++) {
              if (segments[i]) {
                path.push({ label: segments[i], isActive: false });
              }
            }
          }
        }
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
  }, [selectedClient, selectedTab, showChecklistReview, reviewChecklistData, onDetailsViewChange, viewingCaseIdx]);

  const lastBreadcrumbPath = useRef<Array<{label: string, icon?: React.ReactNode, onClick?: () => void, isActive?: boolean}>>([]);

  useEffect(() => {
    if (onBreadcrumbChange) {
      const newPath = !selectedClient && !showChecklistReview ? [] : buildBreadcrumb();
      // Compare newPath to lastBreadcrumbPath.current
      const isSame =
        newPath.length === lastBreadcrumbPath.current.length &&
        newPath.every((item, idx) =>
          item.label === lastBreadcrumbPath.current[idx]?.label &&
          item.isActive === lastBreadcrumbPath.current[idx]?.isActive
        );
      if (!isSame) {
        onBreadcrumbChange(newPath);
        lastBreadcrumbPath.current = newPath;
      }
    }
  }, [selectedClient, selectedTab, showChecklistReview, reviewChecklistData, buildBreadcrumb, onBreadcrumbChange]);

  const handleChecklistReviewBack = () => {
    setShowChecklistReview(false);
  };

  const goToClientList = () => {
    setSelectedClientName(null);
    setShowChecklistReview(false);
    if (onDetailsViewChange) onDetailsViewChange(false);
    if (onBackToClientList) onBackToClientList();
  };

  // Filter clients by search term
  const filteredClients = clients.filter(
    (c) =>
      c.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.advisor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Only show clients for the current page
  const paginatedClients = filteredClients.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  let clientContent;
  if (filteredClients.length === 0) {
    clientContent = <ClientEmptyState onCreate={handleOpenModal} />;
  } else {
    clientContent = (
      <div className="sm:px-8 sm:pt-4">
        <ClientList
          clients={paginatedClients}
          onViewDetails={handleViewDetails}
        />
      </div>
    );
  }

  const checklistItems = [
    "Partner",
    "Client name",
    "Client DOB",
    "SJP SRA",
    "Recommended Fund Choice",
    "Checklist completed by",
    "Provider"
  ];

  useEffect(() => {
    console.log('selectedClient', selectedClient);
    console.log('showReviewChecklist', showReviewChecklist);
    console.log('showChecklistReview', showChecklistReview);
    console.log('reviewChecklistData', reviewChecklistData);
  }, [selectedClient, showReviewChecklist, showChecklistReview, reviewChecklistData]);

  return (
    <div className="flex flex-col h-full" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
      <ClientModal open={modalOpen} onClose={handleCloseModal} onSubmit={handleSubmit} />
      <div className="flex-1 min-h-0 flex flex-col" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {showChecklistReview && reviewChecklistData ? (
          <ChecklistReview
            checklistItems={reviewChecklistData.checklistItems}
            reviewerName={reviewChecklistData.reviewerName}
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
            onShowChecklistReviewTest={handleShowReviewChecklist}
            onTabChange={handleTabChange}
            onDocumentOpen={setDocumentOpen}
            onBackToClientList={goToClientList}
            casesCurrentPage={casesCurrentPage}
            setCasesCurrentPage={setCasesCurrentPage}
            onCaseView={caseType => setSelectedTab(`transfers/${caseType}`)}
            viewingCaseIdx={viewingCaseIdx}
            setViewingCaseIdx={setViewingCaseIdx}
          />
        ) : (
          <>
            <div className="w-full bg-white dark:bg-[var(--background)] flex-wrap gap-2 min-h-[64px] relative border-b" style={{ borderColor: darkMode ? '#52525b' : '#e4e4e7' }}>
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
                  {/* Search input for mobile */}
                  <div className="relative ml-2" style={{ minWidth: 160, maxWidth: 240 }}>
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
                      <SearchIcon className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Search clients"
                      className="pl-8 pr-2 py-1 rounded-md border border-zinc-200 dark:border-[var(--border)] text-xs bg-white dark:bg-[var(--muted)] text-zinc-700 dark:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-200 w-full"
                    />
                  </div>
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
                    {/* Use Upload icon for Export if available, otherwise keep Download */}
                    {typeof Upload !== 'undefined' ? (
                      <Upload className="w-4 h-4 text-zinc-500 dark:text-[var(--foreground)]" />
                    ) : (
                      <Download className="w-4 h-4 text-zinc-500 dark:text-[var(--foreground)]" />
                    )}
                    <span className="dark:text-[var(--foreground)]">Export</span>
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
                  {/* Search input for desktop */}
                  <div className="relative ml-2" style={{ minWidth: 220, maxWidth: 320 }}>
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
                      <SearchIcon className="w-5 h-5" />
                    </span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Search clients"
                      className="pl-10 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-[var(--border)] text-sm bg-white dark:bg-[var(--muted)] text-zinc-700 dark:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-200 w-full"
                    />
                  </div>
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
                    {/* Use Upload icon for Export if available, otherwise keep Download */}
                    {typeof Upload !== 'undefined' ? (
                      <Upload className="w-4 h-4" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    Export
                  </button>
                  {(selectedClientName === null && !showChecklistReview) && (
                    <button
                      onClick={onGenerateRandomClients}
                      className="icon-btn border border-zinc-200 dark:border-[var(--border)] rounded-full p-2 bg-white dark:bg-[var(--muted)] hover:bg-zinc-100 dark:hover:bg-[var(--border)] transition flex items-center justify-center"
                      title="Generate random clients"
                      aria-label="Generate random clients"
                      type="button"
                      style={{
                        borderColor: darkMode ? 'var(--border)' : '#e5e7eb',
                        backgroundColor: darkMode ? 'var(--muted)' : 'white',
                        color: darkMode ? 'var(--foreground)' : '#18181b',
                        boxShadow: 'none',
                        width: 36,
                        height: 36,
                        minWidth: 36,
                        minHeight: 36,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="w-full pt-0 pb-0 flex-1 flex flex-col min-h-0">{clientContent}</div>
          </>
        )}
        <UploadModal
          open={uploadModalOpen && !showReviewChecklist}
          onClose={handleCloseUploadModal}
          fileName={undefined}
          onShowReviewChecklist={handleShowReviewChecklist}
          onNoPersonalisedChecklist={() => {
            setUploadModalOpen(false);
            handleShowReviewChecklist();
          }}
        />
        <ReviewChecklistModal
          open={showReviewChecklist}
          onCancel={() => setShowReviewChecklist(false)}
          onContinue={() => {
            setShowReviewChecklist(false);
            setUploadModalOpen(false);
            setModalOpen(false);
            if (selectedClient) {
              setReviewChecklistData({
                checklistItems,
                reviewerName: selectedClient.client,
              });
            }
            setShowChecklistReview(true);
          }}
          checklistItems={reviewChecklistData?.checklistItems || checklistItems}
        />
      </div>
      {(clients.length > 0 && !selectedClient) || (showChecklistReview && !!reviewChecklistData) || (selectedTab.startsWith('transfers') && documentOpen) ? (
        <ClientFooter
          selectedClient={selectedClient}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          isEmpty={false}
          showFooterActions={showChecklistReview}
          forceWhiteBg={clients.length > 0 && !selectedClient}
          greyBg={selectedTab.startsWith('transfers') && documentOpen}
          showTransferDocumentActions={selectedTab.startsWith('transfers') && documentOpen}
          onSaveDraft={showChecklistReview ? handleChecklistReviewBack : undefined}
          onSaveAndContinue={showChecklistReview ? handleChecklistReviewBack : undefined}
        />
      ) : null}
    </div>
  );
}