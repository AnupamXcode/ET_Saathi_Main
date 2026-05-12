'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { Button, Input } from '@/components/ui/index'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { motion } from 'framer-motion'
import { Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await signIn(email, password)
      if (result.success) {
        router.push('/dashboard')
      } else {
        const error = 'error' in result ? result.error : 'Login failed'
        setError(error instanceof Error ? error.message : String(error))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader>
            <Link href="/" className="inline-block mb-6">
              <h1 className="text-3xl font-bold gradient-gold">ET Saathi</h1>
            </Link>
            <h2 className="text-2xl font-semibold">Welcome Back</h2>
            <p className="text-gray-400 text-sm mt-1">Sign in to your account to continue</p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/50 flex gap-2 text-red-400 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className="text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <Link href="/signup" className="text-gold hover:text-darkgold transition">
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>Demo credentials:</p>
          <p className="font-mono text-xs mt-2">demo@example.com / password123</p>
        </div>
      </motion.div>
    </div>
  )
}
