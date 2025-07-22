import React from "react";

export default function IllustrationForm({ onBack, darkMode }: { onBack: () => void; darkMode: boolean }) {
  return (
    <div
      className="w-full h-full flex flex-col border rounded-lg max-w-full"
      style={{
        background: darkMode ? '#18181b' : '#fff',
        boxSizing: 'border-box',
        borderColor: darkMode ? '#3f3f46' : '#e4e4e7'
      }}
    >
      <button
        onClick={onBack}
        className="self-start m-4 px-2.5 py-1.5 rounded border border-blue-600 bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition"
        style={{ minWidth: 0, lineHeight: 1.2 }}
      >
        ← Back
      </button>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="text-lg font-semibold mb-4" style={{ color: darkMode ? '#f1f5f9' : '#18181b' }}>
          Illustration Section (placeholder)
        </div>
        {/* Add your Illustration workflow UI here */}
      </div>
    </div>
  );
} 