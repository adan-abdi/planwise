import React, { useState, useEffect } from "react";
import type { TransferFolderItem } from "./FileExplorer";
import { ClientItem } from "./ClientListItem";
import Image from "next/image";
import {
  Users,
  UserCircle,
  Layers,
  Flame,
  ListChecks,
  Calendar,
  Mail,
  Phone,
  Globe,
  FileText,
  ActivitySquare,
  FolderTree,
  Edit2,
  X,
  Check,
  ArrowLeft,
  ChevronRight,
  PlusCircle,
  Upload,
} from "lucide-react";
import DirectoryIcon from '/public/directory.svg';
import UploadModal from "./UploadModal";
import { useTheme } from "../../../theme-context";
import dynamic from 'next/dynamic';
import FileExplorer from './FileExplorer';
import FolderDocumentBox from './FolderDocumentBox';
import CreateNewCase from './CreateNewCase';
const DocumentViewer = dynamic(() => import('./documentviewer/DocumentViewer'), { ssr: false });

interface ClientDetailsProps {
  client: ClientItem;
  onClientUpdate: (updated: ClientItem) => void;
  checklist?: boolean[];
  onChecklistChange?: (newChecklist: boolean[]) => void;
  onTabChange?: (tab: string) => void;
  onShowChecklistReviewTest?: () => void;
  onDocumentOpen?: (open: boolean) => void;
  onBackToClientList?: () => void;
  transferPath?: string[];
  setTransferPath?: (path: string[]) => void;
}

type TransferType = "pension" | "isa" | null;

const transferTypes = [
  { key: 'pensionTransfer', label: 'Pension Transfers' },
  { key: 'isaTransfer', label: 'ISA Transfers' },
  { key: 'pensionNewMoney', label: 'Pension New Money' },
  { key: 'isaNewMoney', label: 'ISA New Money' },
];

function getDynamicFolderContents(transferKey: string, count: number, transferPath: string[]) {
  if (transferPath.length === 1) {
    const seedingFolders = Array.from({ length: count }, (_, i) => ({
      type: 'folder' as const,
      name: `Seeding ${i + 1}`,
      children: [
        { type: 'file' as const, name: `Document ${i + 1}.pdf` },
      ],
    }));
    return [
      { type: 'file' as const, name: 'CFR Document.pdf' },
      { type: 'file' as const, name: 'ESS Document.pdf' },
      ...seedingFolders,
    ];
  }
  if (transferPath.length === 2 && transferPath[1].startsWith('Seeding ')) {
    const idx = parseInt(transferPath[1].replace('Seeding ', ''));
    if (!isNaN(idx) && idx >= 1 && idx <= count) {
      return [
        { type: 'file' as const, name: `Document ${idx}.pdf` },
      ];
    }
  }
  return [];
}

export default function ClientDetails({ client, onClientUpdate, checklist, onChecklistChange, onTabChange, onShowChecklistReviewTest, onDocumentOpen, onBackToClientList, transferPath: controlledTransferPath, setTransferPath: controlledSetTransferPath }: ClientDetailsProps) {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState<'details' | 'activity' | 'transfers'>('details');
  const [openedTransfer, setOpenedTransfer] = useState<TransferType>(null);
  const [internalTransferPath, internalSetTransferPath] = useState<string[]>([]);
  const transferPath = typeof controlledTransferPath !== 'undefined' ? controlledTransferPath : internalTransferPath;
  const setTransferPath = typeof controlledSetTransferPath !== 'undefined' ? controlledSetTransferPath : internalSetTransferPath;
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<ClientItem>(client);
  const [localChecklist, setLocalChecklist] = useState<boolean[]>(checklist || Array(4).fill(false));
  useEffect(() => {
    setEditValues(client);
    setLocalChecklist(checklist || Array(4).fill(false));
  }, [client, checklist]);

  useEffect(() => {
    if (openedTransfer === null && onTabChange) {
      onTabChange(activeTab);
    }
  }, [activeTab, onTabChange, openedTransfer]);

  const handleEdit = (field: string) => setEditingField(field);
  const handleChange = (field: keyof ClientItem, value: string) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  };
  const handleBlur = () => setEditingField(null);
  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter') setEditingField(null); };
  const handleChecklistToggle = (idx: number) => {
    setLocalChecklist((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };
  const handleSave = () => {
    onClientUpdate(editValues);
    if (onChecklistChange) onChecklistChange(localChecklist);
  };
  const handleCancel = () => {
    setEditValues(client);
    setLocalChecklist(checklist || Array(4).fill(false));
  };
  const hasUnsavedChanges =
    JSON.stringify(editValues) !== JSON.stringify(client) ||
    JSON.stringify(localChecklist) !== JSON.stringify(checklist || Array(4).fill(false));

  const handleOpenTransfer = (type: string) => {
    setOpenedTransfer(type as TransferType);
    setTransferPath([transferTypes.find(t => t.key === type)?.label || type]);
    if (onTabChange) onTabChange(`transfers/${type}`);
  };

  const handleEnterFolder = (name: string) => {
    const newPath = [...transferPath, name];
    setTransferPath(newPath);
    if (onTabChange) onTabChange(`transfers/${newPath.join("/")}`);
  };

  const handleBackFolder = () => {
    if (transferPath.length > 1) {
      const newPath = transferPath.slice(0, -1);
      setTransferPath(newPath);
      if (onTabChange) onTabChange(`transfers/${newPath.join("/")}`);
    } else {
      setOpenedTransfer(null);
      setTransferPath([]);
      if (onTabChange) onTabChange("transfers");
    }
  };

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const handleUploadModal = () => {
    setUploadModalOpen(true);
  };
  const handleCloseUploadModal = () => setUploadModalOpen(false);

  const [selectedDocument, setSelectedDocument] = useState<TransferFolderItem | null>(null);
  useEffect(() => {
    setSelectedDocument(null);
  }, [transferPath]);
  useEffect(() => {
    if (onDocumentOpen) onDocumentOpen(!!selectedDocument);
  }, [selectedDocument, onDocumentOpen]);

  const [createCaseModalOpen, setCreateCaseModalOpen] = useState(false);

  const clickableLineClass = "text-blue-600 dark:text-blue-400 text-sm mt-1 cursor-pointer hover:underline w-fit";

  return (
    <div className="bg-white dark:bg-[var(--background)] min-h-full">
      <div className="flex items-center justify-between px-2 sm:pl-8 sm:pr-8 py-3 border-b-1 border-zinc-200 dark:border-zinc-700 min-h-[56px] bg-white dark:bg-[var(--background)] w-full mb-4 flex-nowrap gap-x-2 gap-y-2 flex-wrap sm:flex-nowrap"
        style={{ borderBottomColor: darkMode ? '#3f3f46' : '#e4e4e7' }}
      >
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {onBackToClientList && (
            <button
              onClick={onBackToClientList}
              className="mr-2 p-2 rounded-full transition flex items-center justify-center"
              aria-label="Back to client list"
              style={{
                backgroundColor: darkMode ? 'transparent' : 'transparent',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = darkMode ? '#232329' : '#f4f4f5';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ArrowLeft className="w-5 h-5 text-[var(--foreground)]" />
            </button>
          )}
          <div className="min-w-0">
            <div
              className="text-lg sm:text-2xl font-semibold truncate"
              style={{ color: darkMode ? 'white' : 'black' }}
            >
              {editValues.client}
            </div>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2 ml-auto flex-shrink-0">
          {hasUnsavedChanges && (
            <button
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-normal transition"
              onClick={handleCancel}
              type="button"
              aria-label="Cancel"
              style={{
                cursor: 'pointer',
                backgroundColor: darkMode ? '#18181b' : 'white',
                border: `1px solid ${darkMode ? '#3f3f46' : '#e4e4e7'}`,
                color: darkMode ? '#f87171' : '#dc2626',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = darkMode ? '#3a2323' : '#f4f4f5';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = darkMode ? '#18181b' : 'white';
              }}
            >
              <X className="w-4 h-4" style={{ color: darkMode ? '#f87171' : '#dc2626' }} />
              <span>Cancel</span>
            </button>
          )}
          {hasUnsavedChanges && (
            <button
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-normal transition"
              onClick={handleSave}
              type="button"
              aria-label="Save Changes"
              style={{
                cursor: 'pointer',
                backgroundColor: darkMode ? '#18181b' : '#e6fbe8',
                border: `1px solid ${darkMode ? '#166534' : '#a7f3d0'}`,
                color: darkMode ? '#4ade80' : '#166534',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = darkMode ? '#1a3a23' : '#bbf7d0';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = darkMode ? '#18181b' : '#e6fbe8';
              }}
            >
              <Check className="w-4 h-4" style={{ color: darkMode ? '#4ade80' : '#166534' }} />
              <span>Save</span>
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center border-b pb-4 border-zinc-200 dark:border-zinc-700 gap-2 px-2 sm:px-8 flex-nowrap overflow-x-auto"
        style={{ borderBottomColor: darkMode ? '#3f3f46' : '#e4e4e7' }}
      >
        <div className="flex gap-2 flex-nowrap">
          <button
            className={`px-3 py-2 text-sm rounded-[10px] border transition-colors flex items-center gap-1 whitespace-nowrap font-medium`}
            onClick={() => setActiveTab('details')}
            style={{
              backgroundColor: darkMode
                ? (activeTab === 'details' ? 'var(--muted)' : 'var(--background)')
                : 'white',
              border: darkMode
                ? (activeTab === 'details' ? '1px solid #3f3f46' : '1px solid transparent')
                : (activeTab === 'details' ? '1px solid #d4d4d8' : '1px solid transparent'),
              color: darkMode ? 'var(--foreground)' : '#18181b',
              cursor: activeTab !== 'details' ? 'pointer' : 'default',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f4f4f5';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = darkMode
                ? (activeTab === 'details' ? 'var(--muted)' : 'var(--background)')
                : 'white';
            }}
          >
            <FileText className="w-4 h-4 mr-1" />
            Client details
          </button>
          <button
            className={`px-3 py-2 text-sm rounded-[10px] border transition-colors flex items-center gap-1 whitespace-nowrap font-medium`}
            onClick={() => setActiveTab('transfers')}
            style={{
              backgroundColor: darkMode
                ? (activeTab === 'transfers' ? 'var(--muted)' : 'var(--background)')
                : 'white',
              border: darkMode
                ? (activeTab === 'transfers' ? '1px solid #3f3f46' : '1px solid transparent')
                : (activeTab === 'transfers' ? '1px solid #d4d4d8' : '1px solid transparent'),
              color: darkMode ? 'var(--foreground)' : '#18181b',
              cursor: activeTab !== 'transfers' ? 'pointer' : 'default',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f4f4f5';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = darkMode
                ? (activeTab === 'transfers' ? 'var(--muted)' : 'var(--background)')
                : 'white';
            }}
          >
            <FolderTree className="w-4 h-4 mr-1" />
            Transfers
          </button>
          <button
            className={`px-3 py-2 text-sm rounded-[10px] border transition-colors flex items-center gap-1 whitespace-nowrap font-medium`}
            onClick={() => setActiveTab('activity')}
            style={{
              backgroundColor: darkMode
                ? (activeTab === 'activity' ? 'var(--muted)' : 'var(--background)')
                : 'white',
              border: darkMode
                ? (activeTab === 'activity' ? '1px solid #3f3f46' : '1px solid transparent')
                : (activeTab === 'activity' ? '1px solid #d4d4d8' : '1px solid transparent'),
              color: darkMode ? 'var(--foreground)' : '#18181b',
              cursor: activeTab !== 'activity' ? 'pointer' : 'default',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f4f4f5';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = darkMode
                ? (activeTab === 'activity' ? 'var(--muted)' : 'var(--background)')
                : 'white';
            }}
          >
            <ActivitySquare className="w-4 h-4 mr-1" />
            Activity
          </button>
        </div>
        <div className="flex-1" />
        {activeTab === 'transfers' && openedTransfer === null && transferPath.length === 0 && (
          <div className="flex gap-2 ml-auto">
            <button
              type="button"
              onClick={() => setCreateCaseModalOpen(true)}
              className={`px-3 py-2 text-sm rounded-[10px] border transition-colors flex items-center gap-1 whitespace-nowrap font-medium bg-white dark:bg-[var(--muted)] border-zinc-200 dark:border-[var(--border)] text-zinc-700 dark:text-[var(--foreground)]`}
              style={{
                backgroundColor: darkMode ? 'var(--muted)' : 'white',
                borderColor: darkMode ? 'var(--border)' : '#e5e7eb',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
              }}
            >
              <PlusCircle className="w-4 h-4" />
              Add new case
            </button>
            <button
              type="button"
              onClick={() => alert('Upload CFR (TODO)')}
              className={`px-3 py-2 text-sm rounded-[10px] border transition-colors flex items-center gap-1 whitespace-nowrap font-medium bg-white dark:bg-[var(--muted)] border-zinc-200 dark:border-[var(--border)] text-zinc-700 dark:text-[var(--foreground)]`}
              style={{
                backgroundColor: darkMode ? 'var(--muted)' : 'white',
                borderColor: darkMode ? 'var(--border)' : '#e5e7eb',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = darkMode ? '#444' : '#f9fafb';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = darkMode ? 'var(--muted)' : 'white';
              }}
            >
              <Upload className="w-4 h-4" />
              Upload CFR
            </button>
          </div>
        )}
      </div>
      {activeTab === 'details' && (
        <div style={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0, height: '85%', overflow: 'auto' }}>
          <div style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
            <div style={{ width: '100%', maxWidth: 400, minWidth: 220, paddingLeft: 32, paddingTop: 24 }}>
              <EditableRow icon={<Users className="w-5 h-5 text-zinc-400" />} label="Client name" value={editValues.client} editing={editingField==='client'} onEdit={() => handleEdit('client')} onChange={v => handleChange('client', v)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
              <EditableRow icon={<UserCircle className="w-5 h-5 text-zinc-400" />} label="Partner name" value={editValues.advisor} editing={editingField==='advisor'} onEdit={() => handleEdit('advisor')} onChange={v => handleChange('advisor', v)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
              <EditableRow icon={<Layers className="w-5 h-5 text-zinc-400" />} label="Number of plans" value={editValues.plans?.toString() || ''} editing={editingField==='plans'} onEdit={() => handleEdit('plans')} onChange={v => handleChange('plans', v)} onBlur={handleBlur} onKeyDown={handleKeyDown} type="number" />
              <DetailRowVertical icon={<ListChecks className="w-5 h-5 text-zinc-400" />} label="Checklist status">
                <span className="flex items-center gap-1">
                  {localChecklist.map((checked, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleChecklistToggle(i)}
                      className={`w-5 h-5 flex items-center justify-center rounded-[6px] border transition-all align-middle cursor-pointer focus:ring-2 focus:ring-blue-200 appearance-none shadow-none ${checked ? 'border-green-500 bg-green-50' : 'border-zinc-200 bg-white'}`}
                      style={{ outline: 'none' }}
                    >
                      {checked && (
                        <svg className="w-4 h-4 text-green-500 mx-auto my-auto" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      )}
                    </button>
                  ))}
                  <span className="text-zinc-400 text-xs ml-2">{localChecklist.filter(Boolean).length}/4 completed</span>
                </span>
              </DetailRowVertical>
              <EditableRow icon={<Flame className="w-5 h-5 text-zinc-400" />} label="ATR (Attitude to risk)" value={editValues.atr || ''} editing={editingField==='atr'} onEdit={() => handleEdit('atr')} onChange={v => handleChange('atr', v)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
              <EditableRow icon={<Calendar className="w-5 h-5 text-zinc-400" />} label="Date of Birth" value={editValues.dob || ''} editing={editingField==='dob'} onEdit={() => handleEdit('dob')} onChange={v => handleChange('dob', v)} onBlur={handleBlur} onKeyDown={handleKeyDown} type="date" />
              <EditableRow icon={<Mail className="w-5 h-5 text-zinc-400" />} label="Email address" value={editValues.email || ''} editing={editingField==='email'} onEdit={() => handleEdit('email')} onChange={v => handleChange('email', v)} onBlur={handleBlur} onKeyDown={handleKeyDown} type="email" />
              <EditableRow icon={<Phone className="w-5 h-5 text-zinc-400" />} label="Telephone number" value={editValues.phone || ''} editing={editingField==='phone'} onEdit={() => handleEdit('phone')} onChange={v => handleChange('phone', v)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
              <EditableRow icon={<Globe className="w-5 h-5 text-zinc-400" />} label="Website link" value={editValues.website || ''} editing={editingField==='website'} onEdit={() => handleEdit('website')} onChange={v => handleChange('website', v)} onBlur={handleBlur} onKeyDown={handleKeyDown} />
              <EditableRow icon={<Calendar className="w-5 h-5 text-zinc-400" />} label="Retirement age" value={editValues.retirementAge || ''} editing={editingField==='retirementAge'} onEdit={() => handleEdit('retirementAge')} onChange={v => handleChange('retirementAge', v)} onBlur={handleBlur} onKeyDown={handleKeyDown} type="number" />
            </div>
          </div>
          <div style={{ width: 1, background: 'transparent', height: '100%', alignSelf: 'stretch' }} />
          <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
          </div>
        </div>
      )}
      {activeTab === 'transfers' && (
        <div style={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0, height: '85%', overflow: 'auto' }}>
          <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
            <div style={{ paddingLeft: 32, paddingTop: 24 }}>
              {(openedTransfer === null || transferPath.length === 0) ? (
                <>
                  <div className="text-lg font-semibold mb-6" style={{ color: darkMode ? 'white' : '#18181b' }}>Transfers</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, maxHeight: 700, overflow: 'auto' }}>
                    {transferTypes.map(({ key, label }) => {
                      const count = editValues[key as keyof typeof editValues] as number | undefined;
                      if (!count || count <= 0) return null;
                      return (
                        <FolderDocumentBox key={key} onClick={() => handleOpenTransfer(key as unknown as string)}>
                          <>
                            <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, width: 40 }}>
                              <Image src={DirectoryIcon} alt="Folder" width={40} height={40} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
                              <span style={{ fontWeight: 600, fontSize: 16 }}>{label}</span>
                              <span style={{ color: '#a1a1aa', fontSize: 12, marginTop: 1 }}>No. of transfers: {count}</span>
                            </div>
                          </>
                        </FolderDocumentBox>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 mb-4">
                  <button
                    type="button"
                    onClick={handleBackFolder}
                    className="rounded-full p-1 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200"
                    style={{
                      background: darkMode ? '#27272a' : '#f4f4f5',
                      color: darkMode ? 'white' : '#18181b',
                      border: 'none',
                      width: 32,
                      height: 32,
                      minWidth: 32,
                      minHeight: 32,
                      boxShadow: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = darkMode ? '#3f3f46' : '#e4e4e7';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = darkMode ? '#27272a' : '#f4f4f5';
                    }}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  {transferPath.map((folder, idx) => (
                    <span key={folder} className="flex items-center text-base font-medium">
                      {idx > 0 && <ChevronRight className="w-4 h-4 text-zinc-400 mx-1" />}
                      <span className={idx === transferPath.length - 1 ? '' : 'text-zinc-400'} style={{ color: idx === transferPath.length - 1 ? (darkMode ? 'white' : '#18181b') : undefined }}>
                        {folder}
                      </span>
                    </span>
                  ))}
                </div>
              )}
              {openedTransfer !== null && transferPath.length > 0 && (
                <FileExplorer
                  transferPath={transferPath}
                  getFolderContents={() => {
                    const transferType = transferTypes.find(t => t.label === transferPath[0]);
                    if (!transferType) return [];
                    const count = editValues[transferType.key as keyof typeof editValues] as number | undefined;
                    return getDynamicFolderContents(transferType.key, count || 0, transferPath);
                  }}
                  handleEnterFolder={handleEnterFolder}
                  handleUploadModal={handleUploadModal}
                  setSelectedDocument={setSelectedDocument}
                  clickableLineClass={clickableLineClass}
                />
              )}
            </div>
          </div>
          <div style={{ width: 1, background: darkMode ? '#3f3f46' : '#e4e4e7', height: '100%', alignSelf: 'stretch' }} className={activeTab === 'transfers' && !selectedDocument ? 'invisible' : ''} />
          <div style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 32 }}>
            {selectedDocument ? (
              <DocumentViewer document={selectedDocument} />
            ) : null}
          </div>
        </div>
      )}
      {activeTab === 'activity' && (
        <div style={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0, height: '85%', overflow: 'auto' }}>
          <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
          </div>
          <div style={{ width: 1, background: 'transparent', height: '100%', alignSelf: 'stretch' }} />
          <div style={{ flex: 1, minWidth: 0, height: '100%' }}>
          </div>
        </div>
      )}
      <UploadModal
        open={uploadModalOpen}
        onClose={handleCloseUploadModal}
        onNoPersonalisedChecklist={onShowChecklistReviewTest}
        onShowReviewChecklist={onShowChecklistReviewTest}
      />
      <CreateNewCase
        open={createCaseModalOpen}
        onClose={() => setCreateCaseModalOpen(false)}
        onSubmit={({ pensionTransfer, isaTransfer, pensionNewMoney, isaNewMoney }) => {
          const updatedClient = { ...editValues };
          updatedClient.pensionTransfer = (updatedClient.pensionTransfer || 0) + (pensionTransfer || 0);
          updatedClient.isaTransfer = (updatedClient.isaTransfer || 0) + (isaTransfer || 0);
          updatedClient.pensionNewMoney = (updatedClient.pensionNewMoney || 0) + (pensionNewMoney || 0);
          updatedClient.isaNewMoney = (updatedClient.isaNewMoney || 0) + (isaNewMoney || 0);
          updatedClient.plans =
            (updatedClient.pensionTransfer || 0) +
            (updatedClient.isaTransfer || 0) +
            (updatedClient.pensionNewMoney || 0) +
            (updatedClient.isaNewMoney || 0);
          onClientUpdate(updatedClient);
          setCreateCaseModalOpen(false);
        }}
      />
    </div>
  );
}

function DetailRowVertical({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="text-zinc-400 text-sm flex items-center gap-2 min-w-[220px] max-w-[260px] pr-8">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-zinc-900 text-base font-normal flex-1 text-left">{children}</div>
    </div>
  );
}

function EditableRow({ icon, label, value, editing, onEdit, onChange, onBlur, onKeyDown, type }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  editing: boolean;
  onEdit: () => void;
  onChange: (v: string) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  type?: string;
}) {
  const { darkMode } = useTheme();
  return (
    <div className="flex items-center gap-4 py-2 group cursor-pointer" onClick={editing ? undefined : onEdit}>
      <div className="text-zinc-400 text-sm flex items-center gap-2 min-w-[220px] max-w-[260px] pr-8">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex-1 flex items-start gap-2 text-left justify-start w-full">
        {editing ? (
          <input
            type={type || 'text'}
            className="border rounded-md px-2 py-1 text-base focus:outline-none focus:ring-2 w-full text-left"
            value={value}
            autoFocus
            onChange={e => onChange(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            style={{
              border: darkMode ? '1px solid #3f3f46' : '1px solid #e4e4e7',
              background: darkMode ? 'var(--background)' : 'white',
              color: darkMode ? 'var(--foreground)' : '#18181b',
              boxShadow: 'none',
              minWidth: 0,
              maxWidth: '100%',
              textAlign: 'left',
            }}
          />
        ) : (
          <span
            className="text-base font-normal w-full text-left"
            style={{ color: darkMode ? 'var(--foreground)' : '#18181b', textAlign: 'left', width: '100%' }}
          >
            {value || <span className="text-zinc-300">-</span>}
          </span>
        )}
        <Edit2 className="w-4 h-4 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
      </div>
    </div>
  );
} 