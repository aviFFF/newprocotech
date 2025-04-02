"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { supabase } from "./client-auth"

// Define the session type
type SessionType = {
  user: any;
} | null;

// Define the context type
type SessionContextType = {
  session: SessionType;
  isLoading: boolean;
};

// Create context with default values
const SessionContext = createContext<SessionContextType>({
  session: null,
  isLoading: true,
});

// Hook to use the session context
export const useSession = () => {
  return useContext(SessionContext);
};

// Session provider component
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionType>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    const getInitialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log(`Auth event: ${event}`);
        setSession(newSession);
      }
    );

    // Clean up the subscription
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    isLoading,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
} 