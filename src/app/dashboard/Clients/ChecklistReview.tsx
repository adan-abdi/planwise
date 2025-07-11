import React, { useEffect } from "react";
import {
  ArrowLeft,
} from "lucide-react";
import { useTheme } from "../../../theme-context";
import Stepper from "./Stepper";
import DocumentViewer from "./documentviewer/DocumentViewer";
import ChecklistParser from "./ChecklistParser";

interface ChecklistReviewProps {
  checklistItems: string[];
  reviewerName: string;
  onBack?: () => void;
}

export default function ChecklistReview({ reviewerName, onBack }: ChecklistReviewProps) {
  const { darkMode } = useTheme();

  useEffect(() => {
  }, [reviewerName]);

  return (
    <div className="bg-white dark:bg-[var(--background)] flex flex-col h-full min-h-0">
      <div className="flex items-center justify-start sm:pl-8 sm:pr-8 py-3 border-b-1 border-zinc-200 dark:border-zinc-700 min-h-[56px] bg-white dark:bg-[var(--background)] w-full flex-nowrap gap-x-2 gap-y-2 flex-wrap sm:flex-nowrap"
        style={{ borderBottomColor: darkMode ? '#3f3f46' : '#e4e4e7' }}
      >
        {onBack && (
          <button
            onClick={onBack}
            className="mr-4 p-2 rounded-full transition flex items-center justify-center"
            aria-label="Back to previous"
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
        <Stepper darkMode={darkMode} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0, alignItems: 'stretch', overflow: 'hidden' }}>
        <div style={{ flex: 4, minWidth: 0, background: darkMode ? '#18181b' : '#f4f4f5', display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <div style={{ padding: '24px 24px 2px 24px', background: 'transparent' }}>
            <input
              type="text"
              placeholder="Search document..."
              style={{
                width: '100%',
                padding: '10px 14px',
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
          <div style={{ flex: 1, minHeight: 0, padding: '0 24px 24px 24px', display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            <DocumentViewer document={{ name: "Sample Document" }} />
          </div>
        </div>
        <div style={{ width: 2, height: '100%', borderLeft: `2px solid ${darkMode ? '#3f3f46' : '#e4e4e7'}`, alignSelf: 'stretch' }} />
        <div style={{ flex: 6, minWidth: 0, background: darkMode ? 'var(--background)' : 'white', minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
          <ChecklistParser />
        </div>
      </div>
    </div>
  );
} 