import { ArrowUpDown, Filter as FilterIcon, UserPlus, Download, Upload, SquareUserRound, Search as SearchIcon, ArrowLeft, Grid2x2Check } from "lucide-react";
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

// Helper to format date as '25th June 2025'
function formatFancyDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  // Ordinal suffix
  const j = day % 10, k = day % 100;
  let suffix = 'th';
  if (j === 1 && k !== 11) suffix = 'st';
  else if (j === 2 && k !== 12) suffix = 'nd';
  else if (j === 3 && k !== 13) suffix = 'rd';
  return `${day}${suffix} ${month} ${year}`;
}

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
  const pageSize = 14;
  const totalPages = Math.max(1, Math.ceil(clients.length / pageSize));
  const { darkMode } = useTheme();
  const [reviewChecklistData, setReviewChecklistData] = useState<{
    checklistItems: string[];
    reviewerName: string;
  } | null>(null);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [viewingCaseIdx, setViewingCaseIdx] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  const handleGenerateRandomClients = () => {
    if (onGenerateRandomClients) {
      const randomClients = onGenerateRandomClients();
      setClients(randomClients);
      setCurrentPage(1); // Reset to first page
    }
  };

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
    // If a client is selected, show a back button as the first breadcrumb item
    if (selectedClient) {
      path.push({
        label: '',
        icon: <ArrowLeft className="w-4 h-4" />,
        onClick: () => {
          if (viewingCaseIdx !== null) {
            setViewingCaseIdx(null); // Go from case details to cases list
            setSelectedTab('transfers');
            if (onDetailsViewChange) onDetailsViewChange(true, selectedClient.client, 'transfers');
          } else if (selectedTab === 'transfers' && viewingCaseIdx === null) {
            // On cases list, go directly to clients list
            setSelectedClientName(null);
            setShowChecklistReview(false);
            setSelectedTab('details');
            setViewingCaseIdx(null);
            if (onDetailsViewChange) onDetailsViewChange(false);
            if (onBackToClientList) onBackToClientList();
          } else if (selectedTab === 'transfers') {
            setSelectedTab('details'); // Go from cases list to client details (fallback)
            if (onDetailsViewChange) onDetailsViewChange(true, selectedClient.client, 'details');
          } else {
            setSelectedClientName(null); // Go from client details to clients list
            setShowChecklistReview(false);
            setSelectedTab('details');
            setViewingCaseIdx(null);
            if (onDetailsViewChange) onDetailsViewChange(false);
            if (onBackToClientList) onBackToClientList();
          }
        },
        isActive: false,
      });
    }
    // Always add Clients as the next breadcrumb segment
    path.push({
      label: 'Clients',
      icon: <SquareUserRound className="w-4 h-4 text-zinc-400" />,
      onClick: () => {
        setSelectedClientName(null);
        setShowChecklistReview(false);
        setSelectedTab('details');
        setViewingCaseIdx(null);
        if (onDetailsViewChange) onDetailsViewChange(false);
        if (onBackToClientList) onBackToClientList();
      },
      isActive: false,
    });
    if (selectedClient) {
      // Add Client: [Name] as the second segment
      path.push({
        label: `Client: ${selectedClient.client}`,
        onClick: () => {
          setViewingCaseIdx(null);
          setSelectedTab('details');
          if (onDetailsViewChange) onDetailsViewChange(true, selectedClient.client, 'details');
        },
        isActive: false,
      });
      // If in transfers tab (cases list or case details)
      if (selectedTab === 'transfers' || selectedTab.startsWith('transfers/')) {
        // Add Cases as the third segment
        path.push({
          label: 'Cases',
          onClick: () => {
            setViewingCaseIdx(null);
            setSelectedTab('transfers');
            if (onDetailsViewChange) onDetailsViewChange(true, selectedClient.client, 'transfers');
          },
          isActive: false,
        });
        // If viewing a specific case, add the case type/name as the last segment
        if (selectedTab === 'transfers' && viewingCaseIdx !== null && (selectedClient as { cases?: { caseType: string, createdAt: string }[] }).cases && (selectedClient as { cases?: { caseType: string, createdAt: string }[] }).cases![viewingCaseIdx]) {
          const caseObj = (selectedClient as { cases?: { caseType: string, createdAt: string }[] }).cases![viewingCaseIdx];
          path.push({
            label: `${caseObj.caseType} on ${formatFancyDate(caseObj.createdAt)}`,
            isActive: true,
          });
        }
      } else {
        // Not in transfers tab, just show the current tab as the last segment
        path.push({
          label: selectedTab === 'details' ? 'Client details' : selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1),
          isActive: true,
        });
      }
    } else {
      // If not in a client, mark Clients as active
      path[0].isActive = true;
    }
    return path;
  }, [selectedClient, selectedTab, viewingCaseIdx, onDetailsViewChange, onBackToClientList]);

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
      <div className="sm:px-4 sm:ml-16 sm:mt-0">
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
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[var(--background)]" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
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
            {/* Client list subheader - no box styling */}
            <div
              className={`w-full flex-wrap gap-2 min-h-[64px] relative transition-opacity duration-200 mt-1 ${selectedClient ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}
            >
              <div className="block sm:hidden absolute left-1/2 -translate-x-1/2 w-screen bottom-0 h-px bg-zinc-200 dark:bg-[var(--border)]" />
              <div className="flex sm:hidden mb-1 pt-2 pb-4 justify-between w-full">
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
                      className="pl-8 pr-2 py-1 rounded-md border border-zinc-200 dark:border-[var(--border)] text-xs bg-white dark:bg-[var(--muted)] text-zinc-700 dark:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white dark:focus:bg-[var(--muted)] w-full"
                      style={{ backgroundColor: darkMode ? 'var(--muted)' : 'white' }}
                    />
                  </div>
                  {/* Pagination for mobile */}
                  {totalPages > 1 && (
                    <div className="flex items-center ml-2">
                      <button
                        className="h-6 w-6 flex items-center justify-center border border-zinc-200 border-r-0 rounded-l-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        aria-label="Previous page"
                        style={{ 
                          borderTopRightRadius: 0, 
                          borderBottomRightRadius: 0, 
                          borderColor: darkMode ? '#52525b' : '#e4e4e7',
                          backgroundColor: darkMode ? '#27272a' : 'white'
                        }}
                      >
                        <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                      </button>
                      <span
                        className="h-6 flex items-center justify-center border-t border-b border-l border-r border-zinc-200 text-xs font-medium select-none px-2"
                        style={{ 
                          borderRadius: 0, 
                          borderColor: darkMode ? '#52525b' : '#e4e4e7',
                          backgroundColor: darkMode ? '#27272a' : 'white',
                          color: darkMode ? '#e4e4e7' : '#18181b'
                        }}
                      >
                        <span className="font-medium" style={{ color: darkMode ? '#e4e4e7' : '#18181b' }}>{currentPage}</span>
                        <span className="font-normal ml-0.5" style={{ color: darkMode ? '#71717a' : '#a1a1aa' }}>/{totalPages}</span>
                      </span>
                      <button
                        className="h-6 w-6 flex items-center justify-center border border-zinc-200 border-l-0 rounded-r-md disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        aria-label="Next page"
                        style={{ 
                          borderTopLeftRadius: 0, 
                          borderBottomLeftRadius: 0, 
                          borderColor: darkMode ? '#52525b' : '#e4e4e7',
                          backgroundColor: darkMode ? '#27272a' : 'white'
                        }}
                      >
                        <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18" /></svg>
                      </button>
                    </div>
                  )}
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
                    onClick={handleGenerateRandomClients}
                    className="flex items-center gap-1 p-1 px-2 rounded-md border border-zinc-200 dark:border-[var(--border)] bg-white dark:bg-[var(--muted)] text-[11px] font-medium text-zinc-700 dark:text-[var(--foreground)] transition" 
                    aria-label="Generate random clients"
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
                    <Grid2x2Check className="w-4 h-4 text-zinc-500 dark:text-[var(--foreground)]" />
                    <span className="dark:text-[var(--foreground)]">Generate</span>
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
              <div className="hidden sm:flex w-full items-center justify-between pl-20 pr-4 pt-2 pb-0">
                {/* LEFT: Main action buttons */}
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
                    onClick={handleGenerateRandomClients}
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
                    <Grid2x2Check className="w-4 h-4" />
                    Generate
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
                </div>
                {/* RIGHT: Table actions (sort, filter, search, pagination always present) */}
                <div className="flex items-center gap-2">
                  {/* Sort button */}
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
                  {/* Filter button */}
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
                  {/* Search input */}
                  <div className="relative ml-2" style={{ minWidth: 220, maxWidth: 320 }}>
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 pointer-events-none">
                      <SearchIcon className="w-5 h-5" />
                    </span>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="Search clients"
                      className="pl-10 pr-3 py-1.5 rounded-lg border border-zinc-200 dark:border-[var(--border)] text-sm bg-white dark:bg-[var(--muted)] text-zinc-700 dark:text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-blue-200 focus:bg-white dark:focus:bg-[var(--muted)] w-full"
                      style={{ backgroundColor: darkMode ? 'var(--muted)' : 'white' }}
                    />
                  </div>
                  {/* Pagination always present */}
                  <div className="flex items-center ml-4">
                    <button
                      className="h-8 w-8 flex items-center justify-center border border-zinc-200 border-r-0 rounded-l-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      style={{ 
                        borderTopRightRadius: 0, 
                        borderBottomRightRadius: 0, 
                        borderColor: darkMode ? '#52525b' : '#e4e4e7',
                        backgroundColor: darkMode ? '#27272a' : 'white'
                      }}
                    >
                      <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>
                    </button>
                    <span
                      className="h-8 flex items-center justify-center border-t border-b border-l border-r border-zinc-200 text-sm font-medium select-none px-3"
                      style={{ 
                        borderRadius: 0, 
                        borderColor: darkMode ? '#52525b' : '#e4e4e7',
                        backgroundColor: darkMode ? '#27272a' : 'white',
                        color: darkMode ? '#e4e4e7' : '#18181b'
                      }}
                    >
                      <span className="font-medium" style={{ color: darkMode ? '#e4e4e7' : '#18181b' }}>{currentPage}</span>
                      <span className="font-normal ml-1" style={{ color: darkMode ? '#71717a' : '#a1a1aa' }}>/{totalPages}</span>
                    </span>
                    <button
                      className="h-8 w-8 flex items-center justify-center border border-zinc-200 border-l-0 rounded-r-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      style={{ 
                        borderTopLeftRadius: 0, 
                        borderBottomLeftRadius: 0, 
                        borderColor: darkMode ? '#52525b' : '#e4e4e7',
                        backgroundColor: darkMode ? '#27272a' : 'white'
                      }}
                    >
                      <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full pt-0 pb-0 flex-1 flex flex-col min-h-0 -mt-1">{clientContent}</div>
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
      {(showChecklistReview && !!reviewChecklistData) || (selectedTab.startsWith('transfers') && documentOpen) ? (
        <ClientFooter
          selectedClient={selectedClient}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          isEmpty={false}
          showFooterActions={showChecklistReview}
          forceWhiteBg={false}
          greyBg={selectedTab.startsWith('transfers') && documentOpen}
          showTransferDocumentActions={selectedTab.startsWith('transfers') && documentOpen}
          onSaveDraft={showChecklistReview ? handleChecklistReviewBack : undefined}
          onSaveAndContinue={showChecklistReview ? handleChecklistReviewBack : undefined}
        />
      ) : null}
    </div>
  );
}