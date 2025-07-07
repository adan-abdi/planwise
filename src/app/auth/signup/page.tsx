'use client'

export default function Signup() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <form className="bg-white p-8 rounded shadow max-w-sm w-full space-y-4">
        <h1 className="text-xl font-semibold">Signup</h1>
        <input type="email" placeholder="Email" className="w-full border p-2 rounded" />
        <input type="password" placeholder="Password" className="w-full border p-2 rounded" />
        <button className="w-full bg-black text-white p-2 rounded">Sign Up</button>
      </form>
    </main>
  )
}
