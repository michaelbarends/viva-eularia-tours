'use client'

import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path ? 'bg-white text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-white/80'
  }

  return (
    <div className="bg-background border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <img src="/viva-eularia-logo.svg" alt="Viva Eularia" className="h-8" />
            <nav className="flex gap-4">
              <a
                href="/tours"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/tours')}`}
              >
                Tours
              </a>
              <a
                href="/users"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/users')}`}
              >
                Gebruikers
              </a>
            </nav>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-white/80 transition-colors"
          >
            Uitloggen
          </button>
        </div>
      </div>
    </div>
  )
}
