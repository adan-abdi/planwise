import { useTheme } from "../../../theme-context";
import { CalendarClock } from "lucide-react";

export default function Templates() {
  const { darkMode } = useTheme();
  
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center bg-white dark:bg-[var(--background)] py-24">
      <div 
        className="w-24 h-24 rounded-[14px] flex items-center justify-center mb-8 shadow-sm"
        style={{
          backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
          border: `1px solid ${darkMode ? '#3f3f46' : '#e4e4e7'}`
        }}
      >
        <CalendarClock size={64} stroke="#b0b0b0" strokeWidth={1.5} />
      </div>
      <div className="text-xl font-semibold mb-2 text-zinc-900 dark:text-[var(--foreground)]">Templates Section</div>
      <div className="text-zinc-400 dark:text-[var(--foreground)] text-base mb-8">This is a placeholder for the <span className="text-zinc-400 dark:text-[var(--foreground)]">Templates</span> section.</div>
    </div>
  );
} 