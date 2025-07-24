import React, { useEffect, ReactNode, useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Domain-specific search suggestions
  const searchSuggestions = [
    "Partner", "Client name", "Client DOB", "SJP SRA", "Recommended Fund Choice",
    "Checklist completed by", "Provider", "Policy Number", "Plan Type", "Start Date",
    "End Date", "Annual Premium", "Beneficiary", "Advisor", "Risk Level", "Notes",
    "Pension Transfer", "ISA Transfer", "Pension New Money", "ISA New Money",
    "Standard Life", "Retirement", "Employer", "Scheme provider", "Loyalty Bonuses",
    "Initial charge", "Annual Management Charges", "AMC", "Product charge", "Wrapper charge",
    "Fixed charge", "Policy fee", "Transfer value", "Single contribution", "Regular contribution",
    "Crystallised funds", "ESS", "Money Purchase", "Employer Sponsored Scheme",
    "Attitude to risk", "Experienced investor", "Sophisticated investor", "Critical yield",
    "Replacement plan", "Ongoing Advice Fee", "OAF", "Top-up", "Lump sums", "Fund allocation"
  ];

  // Filter suggestions based on search query
  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
  }, [reviewerName]);

  return (
    <div
      className="flex flex-col h-full min-h-0"
      style={{
        width: '100%',
        height: '100%',
        background: darkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(15px) saturate(180%)',
        WebkitBackdropFilter: 'blur(15px) saturate(180%)',
        borderRadius: 6,
        border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)'}`,
        boxShadow: darkMode 
          ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
          : '0 1px 3px 0 rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0, alignItems: 'stretch', overflow: 'hidden', borderRadius: 6 }}>
        <div style={{ flex: 9, minWidth: 0, background: darkMode ? '#18181b' : '#f4f4f5', display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 }}>
                        <div style={{
                padding: '16px 12px 12px 12px',
                background: darkMode ? 'rgba(0, 0, 0, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(15px) saturate(180%)',
                WebkitBackdropFilter: 'blur(15px) saturate(180%)',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '80px',
                borderTopLeftRadius: 6,
                borderBottom: `1px solid ${darkMode ? '#3f3f46' : '#e4e4e7'}`,
                boxShadow: darkMode
                  ? '0 1px 3px 0 rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.08)'
                  : '0 1px 3px 0 rgba(31, 38, 135, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
              }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8, marginTop: 0 }}>
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
                    backgroundColor: darkMode ? '#1e1e1e' : '#f8fafc',
                    border: darkMode ? '1px solid #3f3f46' : '1px solid #d1d5db',
                    borderRadius: 8,
                    height: 40,
                    padding: '0 12px',
                    fontSize: 14,
                    fontWeight: 500,
                    boxSizing: 'border-box',
                    display: 'flex',
                    alignItems: 'center',
                    color: darkMode ? '#f1f5f9' : '#374151',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = darkMode ? '#232329' : '#f1f5f9';
                    e.currentTarget.style.borderColor = darkMode ? '#52525b' : '#9ca3af';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 2px 4px 0 rgba(0, 0, 0, 0.1)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = darkMode ? '#1e1e1e' : '#f8fafc';
                    e.currentTarget.style.borderColor = darkMode ? '#3f3f46' : '#d1d5db';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                  }}
                  aria-label="Back to previous"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </button>
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearching(e.target.value.length > 0);
                }}
                placeholder="Search document..."
                style={{
                  flex: 1,
                  padding: '0 16px',
                  height: 40,
                  borderRadius: 8,
                  border: darkMode ? '1px solid #27272a' : '1px solid #d1d5db',
                  background: darkMode ? '#1e1e1e' : '#ffffff',
                  color: darkMode ? 'var(--foreground)' : '#374151',
                  fontSize: 14,
                  fontWeight: 400,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                }}
                onMouseEnter={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.style.backgroundColor = darkMode ? '#232329' : '#f9fafb';
                  target.style.borderColor = darkMode ? '#3f3f46' : '#9ca3af';
                  target.style.transform = 'translateY(-1px)';
                  target.style.boxShadow = '0 2px 4px 0 rgba(0, 0, 0, 0.1)';
                }}
                onMouseLeave={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.style.backgroundColor = darkMode ? '#1e1e1e' : '#ffffff';
                  target.style.borderColor = darkMode ? '#27272a' : '#d1d5db';
                  target.style.transform = 'translateY(0)';
                  target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
                onFocus={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.style.borderColor = darkMode ? '#52525b' : '#3b82f6';
                  target.style.boxShadow = darkMode ? '0 0 0 3px rgba(82, 82, 91, 0.1)' : '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.style.borderColor = darkMode ? '#27272a' : '#d1d5db';
                  target.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>
            {/* Suggestion pills area */}
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', overflowX: 'auto', paddingBottom: 8, maxHeight: isSearching ? '65px' : 'auto', overflowY: 'hidden' }}>
              {isSearching ? (
                /* Search suggestions - exactly 2 rows, no vertical scroll */
                filteredSuggestions.slice(0, 16).map((suggestion, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '4px 12px',
                      backgroundColor: darkMode ? '#27272a' : '#f3f4f6',
                      border: `1px solid ${darkMode ? '#3f3f46' : '#e5e7eb'}`,
                      borderRadius: '16px',
                      fontSize: '12px',
                      color: darkMode ? '#e4e4e7' : '#374151',
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? '#3f3f46' : '#e5e7eb';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = darkMode ? '#27272a' : '#f3f4f6';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    onClick={() => {
                      setSearchQuery(suggestion);
                      setIsSearching(false);
                    }}
                  >
                    {suggestion}
                  </div>
                ))
              ) : (
                /* Default pills */
                <>
                  <div style={{
                    padding: '4px 12px',
                    backgroundColor: darkMode ? '#27272a' : '#f3f4f6',
                    border: `1px solid ${darkMode ? '#3f3f46' : '#e5e7eb'}`,
                    borderRadius: '16px',
                    fontSize: '12px',
                    color: darkMode ? '#e4e4e7' : '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>Recent documents</div>
                  <div style={{
                    padding: '4px 12px',
                    backgroundColor: darkMode ? '#27272a' : '#f3f4f6',
                    border: `1px solid ${darkMode ? '#3f3f46' : '#e5e7eb'}`,
                    borderRadius: '16px',
                    fontSize: '12px',
                    color: darkMode ? '#e4e4e7' : '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>PDF files</div>
                  <div style={{
                    padding: '4px 12px',
                    backgroundColor: darkMode ? '#27272a' : '#f3f4f6',
                    border: `1px solid ${darkMode ? '#3f3f46' : '#e5e7eb'}`,
                    borderRadius: '16px',
                    fontSize: '12px',
                    color: darkMode ? '#e4e4e7' : '#374151',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}>Images</div>
                </>
              )}
            </div>
          </div>
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            <DocumentViewer document={{ name: "Sample Document" }} />
          </div>
        </div>
                 <div style={{ width: 2, height: '100%', borderLeft: `2px solid ${darkMode ? '#3f3f46' : '#e4e4e7'}`, alignSelf: 'stretch' }} />
        <div style={{ flex: 11, minWidth: 0, background: darkMode ? '#1e1e1e' : '#ffffff', minHeight: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', borderTopRightRadius: 6, borderBottomRightRadius: 6 }}>
          <ChecklistParser checklistTitle={title} />
        </div>
      </div>
    </div>
  );
} 