import React, { useState, useEffect } from "react";
import { ClientItem } from "./ClientListItem";
import Image from "next/image";
import {
  User,
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
  FolderClosed,
} from "lucide-react";
import UploadModal from "./UploadModal";
import ReviewChecklistModal from "./ReviewChecklistModal";

interface ClientDetailsProps {
  client: ClientItem;
  onClientUpdate: (updated: ClientItem) => void;
  checklist?: boolean[];
  onChecklistChange?: (newChecklist: boolean[]) => void;
  onTabChange?: (tab: string) => void;
}

type TransferType = "pension" | "isa" | null;

const transferFolderData = {
  "Pension Transfer": [
    { type: "folder", name: "Ceding 1", children: [
      { type: "folder", name: "Subfolder A", children: [
        { type: "file", name: "Document 1.pdf" },
        { type: "file", name: "Document 2.pdf" },
      ] },
      { type: "file", name: "Ceding1File.txt" },
    ] },
    { type: "folder", name: "Ceding 2", children: [
      { type: "file", name: "Ceding2File.txt" },
    ] },
    { type: "folder", name: "CFR", children: [
      { type: "file", name: "CFRFile.txt" },
    ] },
    { type: "file", name: "EES file" },
  ],
  "ISA Transfer": [
    { type: "folder", name: "ISA Folder 1", children: [
      { type: "file", name: "ISAFile1.txt" },
    ] },
    { type: "file", name: "ISA file" },
  ],
};

type TransferFolderItem = {
  type: "folder" | "file";
  name: string;
  children?: TransferFolderItem[];
};

function getFolderContents(path: string[]): TransferFolderItem[] {
  if (!path.length) return [];
  let items = transferFolderData[path[0] as keyof typeof transferFolderData] as TransferFolderItem[];
  for (let i = 1; i < path.length; i++) {
    const next = items.find(item => item.name === path[i] && item.type === "folder");
    if (next && next.children) {
      items = next.children;
    } else {
      return [];
    }
  }
  return items;
}

const finderCardBase =
  "flex items-center gap-4 w-full max-w-xs min-w-[220px] px-4 py-3 border border-zinc-200 rounded-lg bg-white cursor-pointer transition-all duration-150 hover:shadow-md hover:border-blue-200 hover:bg-blue-50/30 focus:bg-blue-50/50 focus:border-blue-300 outline-none";

function detectTouchDevice() {
  if (typeof window !== 'undefined') {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-expect-error: msMaxTouchPoints is only present in some browsers
      navigator.msMaxTouchPoints > 0
    );
  }
  return false;
}

export default function ClientDetails({ client, onClientUpdate, checklist, onChecklistChange, onTabChange }: ClientDetailsProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'activity' | 'transfers'>('details');
  const [openedTransfer, setOpenedTransfer] = useState<TransferType>(null);
  const [transferPath, setTransferPath] = useState<string[]>([]);
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

  const handleOpenTransfer = (type: TransferType) => {
    setOpenedTransfer(type);
    if (type) {
      const root = type === "pension" ? "Pension Transfer" : "ISA Transfer";
      setTransferPath([root]);
      if (onTabChange) onTabChange(`transfers/${root}`);
    } else {
      setTransferPath([]);
      if (onTabChange) onTabChange("transfers");
    }
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

  const [showReviewChecklist, setShowReviewChecklist] = useState(false);

  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(detectTouchDevice());
  }, []);

  return (
    <div className="bg-white min-h-full">
      <div className="flex items-center justify-between px-2 sm:pl-8 sm:pr-8 py-3 border-b-1 border-zinc-200 min-h-[56px] bg-white w-full mb-4 flex-nowrap gap-x-2 gap-y-2 flex-wrap sm:flex-nowrap">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="relative w-8 h-8 sm:w-10 sm:h-10">
            <Image
              src={editValues.avatar}
              alt={editValues.client}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="text-lg sm:text-2xl font-semibold text-zinc-900 truncate">{editValues.client}</div>
          </div>
        </div>
        <div className="flex gap-1 sm:gap-2 ml-auto flex-shrink-0">
          {hasUnsavedChanges && (
            <button
              className="px-2 sm:px-4 py-1 text-sm sm:text-base font-medium text-zinc-700 bg-white hover:bg-zinc-100 transition flex items-center justify-center border border-zinc-200 rounded-[6px] h-8 sm:h-[32px] min-w-[60px] sm:min-w-[80px] font-sans shadow-none"
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </button>
          )}
          {hasUnsavedChanges && (
            <button
              className="px-2 sm:px-4 py-1 text-sm sm:text-base font-medium transition flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 rounded-[6px] h-8 sm:h-[32px] min-w-[80px] sm:min-w-[110px] font-sans shadow-none"
              onClick={handleSave}
              type="button"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center border-b pb-4 border-zinc-200 gap-2 px-2 sm:px-8 mb-8 flex-nowrap overflow-x-auto">
        <button
          className={`px-3 py-2 text-sm font-medium rounded-[10px] border transition-colors flex items-center gap-1 whitespace-nowrap ${activeTab === 'details' ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-50 border-zinc-100 text-zinc-400 hover:bg-zinc-100'}`}
          onClick={() => setActiveTab('details')}
        >
          <FileText className="w-4 h-4 mr-1" />
          Client details
        </button>
        <button
          className={`px-3 py-2 text-sm font-medium rounded-[10px] border transition-colors flex items-center gap-1 whitespace-nowrap ${activeTab === 'transfers' ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-50 border-zinc-100 text-zinc-400 hover:bg-zinc-100'}`}
          onClick={() => setActiveTab('transfers')}
        >
          <FolderTree className="w-4 h-4 mr-1" />
          Transfers
        </button>
        <button
          className={`px-3 py-2 text-sm font-medium rounded-[10px] border transition-colors flex items-center gap-1 whitespace-nowrap ${activeTab === 'activity' ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-zinc-50 border-zinc-100 text-zinc-400 hover:bg-zinc-100'}`}
          onClick={() => setActiveTab('activity')}
        >
          <ActivitySquare className="w-4 h-4 mr-1" />
          Activity
        </button>
      </div>
      {activeTab === 'details' && (
        <div className="max-w-2xl px-4 sm:px-12">
          <div className="flex flex-col gap-4">
            <DetailRowVertical icon={<User className="w-5 h-5 text-zinc-400" />} label="Profile picture">
              <div className="relative w-8 h-8">
                <Image src={editValues.avatar} alt={editValues.client} fill className="rounded-full object-cover" />
              </div>
            </DetailRowVertical>
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
      )}
      {activeTab === 'transfers' && (
        <div className="max-w-4xl px-2 sm:px-12">
          <div className="text-xl font-semibold text-zinc-900 mb-6">Transfers</div>
          {openedTransfer === null ? (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 w-full">
              <div
                className="flex flex-col items-start bg-white rounded-xl border border-zinc-200 px-2 py-2 sm:px-4 sm:py-4 w-full sm:w-auto mb-2 sm:mb-0 cursor-pointer transition-colors hover:bg-zinc-50 focus:bg-zinc-100"
                onClick={() => handleOpenTransfer('pension')}
                tabIndex={0}
                role="button"
                aria-label="Open Pension Transfer"
              >
                <FolderClosed className="w-8 h-8 mb-1 text-zinc-400" />
                <div className="text-base font-semibold text-zinc-900 mb-0.5">Pension Transfer</div>
                <div className="text-xs text-zinc-400">No. of transfers <span className="inline-block ml-1 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 text-xs font-medium">2</span></div>
              </div>
              <div
                className="flex flex-col items-start bg-white rounded-xl border border-zinc-200 px-2 py-2 sm:px-4 sm:py-4 w-full sm:w-auto cursor-pointer transition-colors hover:bg-zinc-50 focus:bg-zinc-100"
                onClick={() => handleOpenTransfer('isa')}
                tabIndex={0}
                role="button"
                aria-label="Open ISA Transfer"
              >
                <FolderClosed className="w-8 h-8 mb-1 text-zinc-400" />
                <div className="text-base font-semibold text-zinc-900 mb-0.5">ISA Transfer</div>
                <div className="text-xs text-zinc-400">No. of transfers <span className="inline-block ml-1 px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-500 text-xs font-medium">1</span></div>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <div className="flex items-center mb-6">
                {(transferPath.length > 1 || transferPath.length === 1) && (
                  <button
                    onClick={transferPath.length === 1 ? () => handleOpenTransfer(null) : handleBackFolder}
                    className="mr-2 p-1 rounded-full hover:bg-zinc-100 transition flex items-center justify-center"
                    aria-label="Back"
                  >
                    <svg width="20" height="20" fill="none" stroke="#222" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
                  </button>
                )}
                <div className="text-xl font-semibold text-zinc-900">{transferPath[transferPath.length-1]}</div>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-4 w-full">
                {getFolderContents(transferPath).map((item) => (
                  <div
                    key={item.name}
                    className={finderCardBase + ' w-full sm:w-auto px-2 py-2 sm:px-4 sm:py-4'}
                    onClick={item.type === 'folder' ? () => handleEnterFolder(item.name) : undefined}
                    tabIndex={0}
                    role="button"
                    aria-label={item.type === 'folder' ? `Open ${item.name}` : `Open file ${item.name}`}
                  >
                    {item.type === 'folder'
                      ? <FolderClosed className="w-8 h-8 text-zinc-400" />
                      : <FileText className="w-8 h-8 text-zinc-400" />}
                    <div className="flex flex-col flex-1 min-w-0 items-start">
                      <span className="text-base font-semibold text-zinc-900 truncate">{item.name}</span>
                      <button
                        type="button"
                        className="text-xs text-blue-600 hover:underline mt-0.5 ml-0 p-0 bg-transparent border-none cursor-pointer focus:outline-none"
                        onClick={e => { e.stopPropagation(); handleUploadModal(); }}
                      >
                        {isTouch ? 'Tap to upload' : 'Double click to upload'} {item.type === 'folder' ? 'docs' : 'file'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <UploadModal
        open={uploadModalOpen && !showReviewChecklist}
        onClose={handleCloseUploadModal}
        onNoPersonalisedChecklist={() => {
          setUploadModalOpen(false);
          setShowReviewChecklist(true);
        }}
        onShowReviewChecklist={() => {
          setUploadModalOpen(false);
          setShowReviewChecklist(true);
        }}
      />
      <ReviewChecklistModal
        open={showReviewChecklist}
        onCancel={() => setShowReviewChecklist(false)}
        onContinue={() => setShowReviewChecklist(false)}
        checklistItems={[
          "Partner",
          "Client name",
          "Client DOB",
          "SJP SRA",
          "Recommended Fund Choice",
          "Checklist completed by",
          "Provider"
        ]}
      />
    </div>
  );
}

function DetailRowVertical({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 py-2">
      <div className="text-zinc-400 text-sm flex items-center gap-2 min-w-[180px] pr-8">
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
  return (
    <div className="flex items-center gap-4 py-2 group cursor-pointer" onClick={editing ? undefined : onEdit}>
      <div className="text-zinc-400 text-sm flex items-center gap-2 min-w-[180px] pr-8">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex-1 flex items-center gap-2 text-left">
        {editing ? (
          <input
            type={type || 'text'}
            className="border border-zinc-200 rounded-md px-2 py-1 text-base text-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-100 w-full text-left"
            value={value}
            autoFocus
            onChange={e => onChange(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
          />
        ) : (
          <span className="text-zinc-900 text-base font-normal w-full text-left">{value || <span className="text-zinc-300">-</span>}</span>
        )}
        <Edit2 className="w-4 h-4 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
      </div>
    </div>
  );
} 