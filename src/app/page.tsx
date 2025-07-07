import Link from 'next/link'

export default function Home() {
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Planwise</h1>
      <Link href="/auth/login" className="text-blue-600 underline">Login</Link>
      <Link href="/auth/signup" className="text-blue-600 underline block">Signup</Link>
      <Link href="/auth/profile" className="text-blue-600 underline block">Profile</Link>
      <Link href="/dashboard" className="text-blue-600 underline block">Dashboard</Link>
    </main>
  )
}
