import React, { useEffect, ReactNode } from "react";
import {
  ArrowLeft,
} from "lucide-react";
import { useTheme } from "../../../theme-context";
// import Stepper from "./Stepper";
import DocumentViewer from "./documentviewer/DocumentViewer";
import ChecklistParser from "./ChecklistParser";

interface ChecklistReviewProps {
  checklistItems: string[];
  reviewerName: string;
  onBack?: () => void;
  title?: string;
  backNav?: ReactNode;
}

export default function ChecklistReview({ reviewerName, onBack, title, backNav }: ChecklistReviewProps) {
  const { darkMode } = useTheme();

  useEffect(() => {
  }, [reviewerName]);

  return (
    <div
      className="flex flex-col h-full min-h-0"
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 6,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0, alignItems: 'stretch', overflow: 'hidden' }}>
        <div style={{ flex: 4, minWidth: 0, background: darkMode ? '#18181b' : '#f4f4f5', display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <div style={{ padding: '8px 24px 2px 24px', background: 'transparent' }}>
            {title && (
              <div style={{ fontWeight: 600, fontSize: 20, marginBottom: 4, color: darkMode ? '#18181b' : '#f1f5f9', textAlign: 'left' }}>{title}</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 0, marginTop: 0 }}>
              {backNav ? backNav : onBack && (
                <button
                  onClick={onBack}
                  className={
                    `px-3 rounded text-sm border transition flex items-center ` +
                    (darkMode
                      ? 'border-zinc-700 text-zinc-300'
                      : 'border-zinc-300 text-zinc-600')
                  }
                  style={{
                    minWidth: 0,
                    backgroundColor: '#fff',
                    border: darkMode ? '1px solid #3f3f46' : '1px solid #e4e4e7',
                    borderRadius: 8,
                    height: 40,
                    padding: '0 14px',
                    fontSize: 16,
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = darkMode ? '#232329' : '#f4f4f5';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = '#fff';
                  }}
                  aria-label="Back to previous"
                >
                  <ArrowLeft className="w-5 h-5 mr-1" /> Back
                </button>
              )}
              <input
                type="text"
                placeholder="Search document..."
                style={{
                  flex: 1,
                  padding: '0 14px',
                  height: 40,
                  borderRadius: 8,
                  border: darkMode ? '1px solid #27272a' : '1px solid #e4e4e7',
                  background: darkMode ? '#232326' : '#fff',
                  color: darkMode ? 'var(--foreground)' : '#18181b',
                  fontSize: 16,
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: 8,
                  transition: 'border 0.2s, background 0.2s, color 0.2s',
                }}
              />
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0, padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            <DocumentViewer document={{ name: "Sample Document" }} />
          </div>
        </div>
        <div style={{ width: 2, height: '100%', borderLeft: `2px solid ${darkMode ? '#3f3f46' : '#e4e4e7'}`, alignSelf: 'stretch' }} />
        <div style={{ flex: 6, minWidth: 0, background: darkMode ? 'var(--background)' : 'white', minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <ChecklistParser checklistTitle={title} />
        </div>
      </div>
    </div>
  );
} 