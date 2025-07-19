import React from 'react';
import Image from 'next/image';
import DirectoryIcon from '/public/directory.svg';
import FileIcon from '/public/file.png';
import { useTheme } from '../../../theme-context';
import FolderDocumentBox from './FolderDocumentBox';

export interface TransferFolderItem {
  type: 'folder' | 'file';
  name: string;
  children?: TransferFolderItem[];
}

interface FileExplorerProps {
  transferPath: string[];
  getFolderContents: (path: string[]) => TransferFolderItem[];
  handleEnterFolder: (name: string) => void;
  handleUploadModal: () => void;
  setSelectedDocument: (item: TransferFolderItem) => void;
  clickableLineClass: string;
  getDisplayName?: (name: string) => string;
  getProviderName?: (name: string) => string | undefined;
  onPlanFolderWithProvider?: (providerName: string) => void;
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  transferPath,
  getFolderContents,
  handleEnterFolder,
  handleUploadModal,
  clickableLineClass,
  getDisplayName = (name: string) => name,
  getProviderName,
  onPlanFolderWithProvider,
}) => {
  const { darkMode } = useTheme();
  // Helper to check if a folder is a plan/ceding folder
  function isPlanFolder(name: string) {
    return (
      /^Ceding \d+$/.test(name) ||
      /^Stocks & Shares Ceding \d+$/.test(name) ||
      /^Cash ISA Ceding \d+$/.test(name)
    );
  }
  return (
    <div
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        padding: '4px 0',
        borderRadius: 8,
      }}>
      </div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 12,
        maxHeight: 560,
        overflow: 'auto',
        paddingRight: 12,
        paddingBottom: 8,
        boxSizing: 'border-box',
        background: darkMode ? '#222222' : 'none',
        borderRadius: 10,
        transition: 'background 0.2s, border 0.2s',
      }}>
        {getFolderContents(transferPath).map(item => (
          <FolderDocumentBox
            key={item.name}
            item={item}
            onClick={() => {
              if (item.type === 'folder') {
                if (isPlanFolder(item.name)) {
                  const provider = getProviderName ? getProviderName(item.name) : undefined;
                  // Only call onPlanFolderWithProvider if you want to show a checklist, not upload modal
                  if (provider && onPlanFolderWithProvider) {
                    onPlanFolderWithProvider(provider);
                    return;
                  }
                }
                if (item.children && item.children.length > 0) {
                  handleEnterFolder(item.name);
                }
              }
            }}
            style={{
              boxShadow: darkMode
                ? '0 1px 4px 0 #232329'
                : '0 1px 4px 0 #e0e7ef',
              border: `1.5px solid ${darkMode ? '#27272a' : '#e0e7ef'}`,
              background: darkMode ? '#232329' : '#f9fafb',
              color: darkMode ? '#f1f5f9' : '#18181b',
              transition: 'background 0.2s, border 0.2s',
            }}
          >
            <div>
              <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, width: 40 }}>
                {item.type === 'folder' ? (
                  <Image src={DirectoryIcon} alt="Folder" width={40} height={40} />
                ) : (
                  <Image src={FileIcon} alt="File" width={40} height={40} />
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
                <span style={{ fontWeight: 700, fontSize: 16, color: darkMode ? '#f1f5f9' : '#18181b' }}>{getDisplayName(item.name)}</span>
                {item.type === 'folder' && (
                  getProviderName && getProviderName(item.name)
                    ? <span style={{ fontSize: 12, color: darkMode ? '#a1a1aa' : '#64748b' }}>{getProviderName(item.name)}</span>
                    : <span className={clickableLineClass} style={{ fontSize: 12, color: darkMode ? '#60a5fa' : '#2563eb', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); handleUploadModal(); }}>Click to upload</span>
                )}
                {item.type === 'file' && (
                  getProviderName && getProviderName(item.name)
                    ? <span style={{ fontSize: 12, color: darkMode ? '#a1a1aa' : '#64748b' }}>{getProviderName(item.name)}</span>
                    : <span className={clickableLineClass} style={{ fontSize: 12, color: darkMode ? '#60a5fa' : '#2563eb', cursor: 'pointer' }} onClick={e => { e.stopPropagation(); handleUploadModal(); }}>Click to upload</span>
                )}
              </div>
            </div>
          </FolderDocumentBox>
        ))}
      </div>
    </div>
  );
};

export default FileExplorer; 