import React, { CSSProperties } from 'react';
import { useTheme } from '../../../theme-context';

type FolderDocumentBoxProps = {
  onClick: () => void;
  children: React.ReactNode;
  style?: CSSProperties;
  [x: string]: unknown;
};

const FolderDocumentBox: React.FC<FolderDocumentBoxProps> = ({ onClick, children, style = {}, ...rest }) => {
  const { darkMode } = useTheme();
  return (
    <div
      onClick={onClick}
      style={{
        border: `1px solid ${darkMode ? '#3f3f46' : '#e4e4e7'}`,
        background: darkMode ? '#2a2a2a' : 'white',
        color: darkMode ? '#f1f5f9' : '#18181b',
        minHeight: 80,
        minWidth: 220,
        maxWidth: 230,
        width: '100%',
        padding: 10,
        overflow: 'auto',
        borderRadius: 14,
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default FolderDocumentBox; 