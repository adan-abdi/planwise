import * as React from "react";
import { FolderTree } from "lucide-react";
import { useTheme } from "../../../../theme-context";

interface EmptyCasesStateProps {
  onAddNewCase: () => void;
}

export default function EmptyCasesState({ onAddNewCase }: EmptyCasesStateProps) {
  const { darkMode } = useTheme();
  return (
    <div
      className="flex flex-col items-center justify-center py-16 px-4 text-center w-full h-full"
      style={{
        background: darkMode ? "#222222" : "#fff",
        color: darkMode ? "#e4e4e7" : "#18181b",
        transition: "background 0.2s, color 0.2s"
      }}
    >
      <div
        className="flex items-center justify-center w-16 h-16 rounded-full mb-4"
        style={{
          background: darkMode ? "#27272a" : "#eff6ff"
        }}
      >
        <FolderTree style={{ width: 32, height: 32, color: darkMode ? "#60a5fa" : "#3b82f6" }} />
      </div>
      <h2
        className="text-xl font-semibold mb-2"
        style={{ color: darkMode ? "#fafafa" : "#18181b" }}
      >
        No Cases Yet
      </h2>
      <p
        className="mb-4 max-w-md"
        style={{ color: darkMode ? "#a1a1aa" : "#64748b" }}
      >
        This client doesn&apos;t have any cases yet.
      </p>
      <button
        type="button"
        onClick={onAddNewCase}
        style={{
          background: darkMode ? "#2563eb" : "#3b82f6",
          color: "#fff",
          fontWeight: 500,
          borderRadius: 8,
          padding: "10px 20px",
          fontSize: 16,
          boxShadow: darkMode ? "0 2px 8px #18181b33" : "0 2px 8px #3b82f622",
          border: "none",
          outline: "none",
          cursor: "pointer",
          transition: "background 0.2s"
        }}
        onMouseOver={e => (e.currentTarget.style.background = darkMode ? "#1d4ed8" : "#2563eb")}
        onMouseOut={e => (e.currentTarget.style.background = darkMode ? "#2563eb" : "#3b82f6")}
        aria-label="Add new case"
      >
        Add new case
      </button>
    </div>
  );
} 