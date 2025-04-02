"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

type SupabaseContext = {
  supabase: ReturnType<typeof createClient<Database>> | null
}

// Default context value
const Context = createContext<SupabaseContext>({ supabase: null })

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => {
    try {
      // Check if we have the environment variables
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      // Only create client if we have valid URL and key
      if (supabaseUrl && supabaseKey) {
        try {
          // Validate URL
          new URL(supabaseUrl)
          return createClient<Database>(supabaseUrl, supabaseKey)
        } catch (error) {
          console.error('Invalid Supabase URL:', error)
          return null
        }
      }
      
      // Return null if missing environment variables
      console.warn('Supabase URL or key is missing, client not initialized')
      return null
    } catch (error) {
      console.error('Error initializing Supabase client:', error)
      return null
    }
  })

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>
}

export function useSupabase() {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}

