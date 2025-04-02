'use client'

import { createClient } from '@supabase/supabase-js'

// Create a single instance of the Supabase client to be used throughout the app
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowser() {
  if (supabaseInstance) {
    return supabaseInstance
  }
  
  supabaseInstance = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'supabase.auth.token',
        storage: {
          getItem: (key) => {
            if (typeof window !== 'undefined') {
              return localStorage.getItem(key)
            }
            return null
          },
          setItem: (key, value) => {
            if (typeof window !== 'undefined') {
              localStorage.setItem(key, value)
            }
          },
          removeItem: (key) => {
            if (typeof window !== 'undefined') {
              localStorage.removeItem(key)
            }
          }
        }
      }
    }
  )
  
  return supabaseInstance
} 