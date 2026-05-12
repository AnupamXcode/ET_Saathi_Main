'use client'

import { useEffect, useState, useCallback } from 'react'
import { getSupabase } from '@/lib/supabase'
import { User } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>({
    id: 'demo-user',
    email: 'demo@example.com',
    name: 'Demo User',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const isAuthenticated = !!user

  useEffect(() => {
    // Keep user state for offline mode
  }, [])

  const signUp = useCallback(
    async (email: string, password: string, name: string) => {
      try {
        setLoading(true)
        const supabase = getSupabase()
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        })

        if (error) throw error
        return { success: true, user: data.user }
      } catch (err) {
        setError(err as Error)
        return { success: false, error: err }
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const signIn = useCallback(
    async (email: string, _password: string) => {
      setUser({
        id: 'demo-user',
        email,
        name: 'Demo User',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      return { success: true, user: { id: 'demo-user', email } }
    },
    []
  )

  const signOut = useCallback(async () => {
    setUser(null)
    return { success: true }
  }, [])

  return {
    user,
    loading,
    error,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
  }
}
