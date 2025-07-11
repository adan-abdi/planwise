import React, { useMemo } from 'react';
import { useTheme } from '../../../../theme-context';

interface DocumentViewerProps {
  document: { name: string };
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document }) => {
  const { darkMode } = useTheme();
  const background = darkMode ? 'var(--background)' : 'white';
  const border = darkMode ? '#333333' : '#E0E0E0';
  const skeletonBase = darkMode ? '#333' : '#eee';
  const skeletonHighlight = darkMode ? '#444' : '#f5f5f5';

  const skeletonWidths = useMemo(() => {
    return Array.from({ length: 4 }).map(() =>
      Array.from({ length: 4 }).map(() => `${70 + Math.floor(Math.random() * 31)}%`)
    );
  }, []);

  return (
    <div
      style={{
        padding: 32,
        background,
        width: '100%',
        height: '100%',
        border: `1px solid ${border}`,
        overflow: 'auto',
        transition: 'background 0.2s, color 0.2s, border 0.2s',
      }}
    >
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: darkMode ? 'var(--foreground)' : '#18181b' }}>{document.name}</h2>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -468px 0; }
          100% { background-position: 468px 0; }
        }
        .skeleton-shimmer {
          background: ${skeletonBase};
          background-image: linear-gradient(to right, ${skeletonBase} 0%, ${skeletonHighlight} 20%, ${skeletonBase} 40%, ${skeletonBase} 100%);
          background-repeat: no-repeat;
          background-size: 800px 104px;
          display: inline-block;
          position: relative;
          animation: shimmer 1.2s linear infinite;
        }
      `}</style>
      <div style={{ color: darkMode ? 'var(--foreground)' : '#888', fontSize: 16, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {skeletonWidths.map((group, groupIdx) => (
          <div key={groupIdx} style={{ marginBottom: groupIdx < 3 ? 40 : 0 }}>
            {group.map((width, lineIdx) => (
              <div
                key={lineIdx}
                className="skeleton-shimmer"
                style={{
                  height: 16,
                  width,
                  borderRadius: 4,
                  marginBottom: lineIdx < 3 ? 8 : 0
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentViewer; 