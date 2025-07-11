export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full relative bg-white dark:bg-[var(--background)] dark:text-[var(--foreground)]">
      {children}
    </div>
  )
}
