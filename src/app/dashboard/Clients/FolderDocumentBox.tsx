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
        background: darkMode ? '#18181b' : 'white',
        color: darkMode ? 'white' : '#18181b',
        minHeight: 80,
        maxWidth: 190,
        width: '100%',
        padding: 10,
        overflow: 'auto',
        borderRadius: 14,
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default FolderDocumentBox; 