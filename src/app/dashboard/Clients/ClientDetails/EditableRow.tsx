import * as React from "react";
import { Edit2 } from "lucide-react";
import { useTheme } from "../../../../theme-context";

interface EditableRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  editing: boolean;
  onEdit: () => void;
  onChange: (v: string) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  type?: string;
}

export default function EditableRow({ icon, label, value, editing, onEdit, onChange, onBlur, onKeyDown, type }: EditableRowProps) {
  const { darkMode } = useTheme();
  return (
    <div className="flex items-center gap-4 py-2 group cursor-pointer" onClick={editing ? undefined : onEdit}>
      <div className="text-zinc-400 text-sm flex items-center gap-2 min-w-[220px] max-w-[260px] pr-8">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex-1 flex items-start gap-2 text-left justify-start w-full max-w-2xl">
        {editing ? (
          <input
            type={type || 'text'}
            className="border rounded-md px-3 py-2 text-base focus:outline-none focus:ring-2 w-full text-left max-w-2xl"
            value={value}
            autoFocus
            onChange={e => onChange(e.target.value)}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            style={{
              border: darkMode ? '1px solid #3f3f46' : '1px solid #e4e4e7',
              background: darkMode ? 'var(--background)' : 'white',
              color: darkMode ? 'var(--foreground)' : '#18181b',
              boxShadow: 'none',
              minWidth: 0,
              maxWidth: '100%',
              textAlign: 'left',
            }}
          />
        ) : (
          <span
            className="text-base font-normal w-full text-left"
            style={{ color: darkMode ? 'var(--foreground)' : '#18181b', textAlign: 'left', width: '100%' }}
          >
            {value || <span className="text-zinc-300">-</span>}
          </span>
        )}
        <Edit2 className="w-4 h-4 text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity ml-2" />
      </div>
    </div>
  );
} 