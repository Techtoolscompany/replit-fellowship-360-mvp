'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'STAFF' | 'ADMIN' | 'AGENCY'
  churchId: string | null
  church?: {
    id: string
    name: string
    email: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => ({ error: 'Not implemented' }),
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // If Supabase is not configured, skip auth and show demo mode
    if (!isSupabaseConfigured) {
      console.log('Supabase not configured - running in demo mode')
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Get user profile from our users table
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, role, church_id')
        .eq('id', supabaseUser.id)
        .maybeSingle()

      if (error) {
        console.error('Error loading user profile:', error.message ?? error, error)
        setUser(null)
        return
      }

      if (!userProfile) {
        const metadata = (supabaseUser.user_metadata ?? {}) as {
          first_name?: string
          last_name?: string
          firstName?: string
          lastName?: string
          role?: User['role']
        }

        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email || '',
          firstName:
            metadata.first_name ??
            metadata.firstName ??
            supabaseUser.email?.split('@')[0] ??
            'User',
          lastName: metadata.last_name ?? metadata.lastName ?? '',
          role: metadata.role ?? 'STAFF',
          churchId: null,
        })
        return
      }

      // Fetch church data separately if user has a church
      let church = undefined
      if (userProfile.church_id) {
        const { data: churchData, error: churchError } = await supabase
          .from('churches')
          .select('id, name, email')
          .eq('id', userProfile.church_id)
          .single()

        if (!churchError && churchData) {
          church = {
            id: churchData.id,
            name: churchData.name,
            email: churchData.email,
          }
        }
      }

      setUser({
        id: userProfile.id,
        email: userProfile.email,
        firstName: userProfile.first_name,
        lastName: userProfile.last_name,
        role: userProfile.role,
        churchId: userProfile.church_id,
        church,
      })
    } catch (error) {
      console.error(
        'Error in loadUserProfile:',
        error instanceof Error ? error.message : error,
        error
      )
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Demo mode - create mock user for any valid email/password
      if (email && password) {
        const mockUser: User = {
          id: 'demo-user-1',
          email: email,
          firstName: 'Demo',
          lastName: 'User',
          role: 'ADMIN',
          churchId: null, // null triggers demo mode in components
          church: {
            id: 'demo-church-1',
            name: 'Grace Community Church',
            email: 'demo@gracechurch.com'
          }
        }
        setUser(mockUser)
        return {}
      }
      return { error: 'Please enter valid email and password for demo mode.' }
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    return {}
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
