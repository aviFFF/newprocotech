"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

type SupabaseContext = {
  supabase: ReturnType<typeof createClient<Database>> | null;
  session: any | null;
  isLoading: boolean;
}

// Default context value
const Context = createContext<SupabaseContext>({ 
  supabase: null,
  session: null,
  isLoading: true
})

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
          return createClient<Database>(supabaseUrl, supabaseKey, {
            auth: {
              persistSession: true,
              autoRefreshToken: true
            }
          })
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
  
  const [session, setSession] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!supabase) return;
    
    // Initial session fetch
    const getInitialSession = async () => {
      try {
        console.log("Fetching initial session");
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        console.log("Session state:", data.session ? "Authenticated" : "Not authenticated");
      } catch (err) {
        console.error("Error fetching session:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    getInitialSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event);
        setSession(currentSession);
      }
    );
    
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <Context.Provider value={{ supabase, session, isLoading }}>
      {children}
    </Context.Provider>
  )
}

export function useSupabase() {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}

