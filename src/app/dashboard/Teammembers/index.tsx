export default function Teammembers() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center bg-white dark:bg-[var(--background)] py-24">
      <div className="w-24 h-24 bg-blue-50 rounded-[14px] flex items-center justify-center mb-8 shadow-sm">
        <svg width="64" height="64" fill="none" stroke="#b0b0b0" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="13" rx="2"/><path d="M8 7V5a4 4 0 018 0v2"/></svg>
      </div>
      <div className="text-xl font-semibold mb-2 text-zinc-900 dark:text-[var(--foreground)]">Team members Section</div>
      <div className="text-zinc-400 dark:text-[var(--foreground)] text-base mb-8">This is a placeholder for the <span className="text-zinc-400 dark:text-[var(--foreground)]">Team members</span> section.</div>
    </div>
  );
} 