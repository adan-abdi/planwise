import React from 'react';
import Image from 'next/image';
import DirectoryIcon from '/public/directory.svg';
import FileIcon from '/public/file.png';
import { useTheme } from '../../../theme-context';
import FolderDocumentBox from './FolderDocumentBox';

interface TransferFolderItem {
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
}

const FileExplorer: React.FC<FileExplorerProps> = ({
  transferPath,
  getFolderContents,
  handleEnterFolder,
  handleUploadModal,
  setSelectedDocument,
  clickableLineClass,
}) => {
  const { darkMode } = useTheme();
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        {transferPath.map((folder, idx) => (
          <span key={folder} style={{ display: 'flex', alignItems: 'center', fontSize: 15, color: idx === transferPath.length - 1 ? (darkMode ? 'white' : '#18181b') : '#a1a1aa', fontWeight: idx === transferPath.length - 1 ? 600 : 400 }}>
            {idx > 0 && <span style={{ margin: '0 6px' }}>/</span>}
            {folder}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, maxHeight: 560, overflow: 'auto', paddingRight: 12, paddingBottom: 8, boxSizing: 'border-box' }}>
        {getFolderContents(transferPath).map(item => (
          <FolderDocumentBox
            key={item.name}
            item={item}
            onClick={() => item.type === 'folder' ? handleEnterFolder(item.name) : undefined}
          >
            <>
              <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40, width: 40 }}>
                {item.type === 'folder' ? (
                  <Image src={DirectoryIcon} alt="Folder" width={40} height={40} />
                ) : (
                  <Image src={FileIcon} alt="File" width={40} height={40} />
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
                <span style={{ fontWeight: 600, fontSize: 16 }}>{item.name}</span>
                {item.type === 'folder' && item.children && (
                  <>
                    <span style={{ color: '#a1a1aa', fontSize: 12, marginTop: 1 }}>No. of items: {item.children.length}</span>
                    <span className={clickableLineClass} style={{ fontSize: 12 }} onClick={e => { e.stopPropagation(); handleUploadModal(); }}>Click to upload</span>
                  </>
                )}
                {item.type === 'file' && (
                  <span className={clickableLineClass} style={{ fontSize: 12 }} onClick={e => { e.stopPropagation(); setSelectedDocument(item); }}>Click to open</span>
                )}
              </div>
            </>
          </FolderDocumentBox>
        ))}
      </div>
    </div>
  );
};

export default FileExplorer; 