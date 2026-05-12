'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { LogOut, Home, Newspaper, GitBranch, Target, BarChart3, History } from 'lucide-react'
import { useEffect } from 'react'

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'News Intelligence', href: '/dashboard/news', icon: Newspaper },
  { name: 'Scenario Engine', href: '/dashboard/scenarios', icon: GitBranch },
  { name: 'Decision Engine', href: '/dashboard/decisions', icon: Target },
  { name: 'Simulation', href: '/dashboard/simulation', icon: BarChart3 },
  { name: 'History', href: '/dashboard/history', icon: History },
]

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, signOut, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-gold text-xl">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-black grid grid-cols-1 md:grid-cols-[250px_1fr]">
      {/* Sidebar */}
      <aside className="bg-gradient-to-b from-gray-900 to-black border-r border-white/10 p-6">
        <Link href="/dashboard" className="block mb-8">
          <h1 className="text-2xl font-bold gradient-gold">ET Saathi</h1>
        </Link>

        <nav className="space-y-2 mb-8">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                pathname === item.href
                  ? 'bg-gold/20 text-gold border border-gold/50'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="border-t border-white/10 pt-6">
          <div className="text-sm text-gray-400 mb-4 truncate">{user?.email}</div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="p-6 overflow-auto">{children}</main>
    </div>
  )
}
