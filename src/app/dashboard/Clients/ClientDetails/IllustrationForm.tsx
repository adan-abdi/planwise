import React from "react";

export default function IllustrationForm({ onBack, darkMode }: { onBack: () => void; darkMode: boolean }) {
  return (
    <div
      className="w-full h-full flex flex-col border rounded-lg max-w-full ml-2"
      style={{
        background: darkMode ? '#18181b' : '#fff',
        boxSizing: 'border-box',
        borderColor: darkMode ? '#3f3f46' : '#e4e4e7'
      }}
    >
      <button
        onClick={onBack}
        className="self-start m-4 px-3 py-1 rounded text-sm border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
        style={{ minWidth: 0 }}
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