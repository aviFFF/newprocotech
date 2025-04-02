"use client"

import { useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/supabase-provider"
import { Loader2 } from "lucide-react"

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { supabase, session, isLoading } = useSupabase()
  const router = useRouter()
  const [isCheckingRole, setIsCheckingRole] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Skip if still loading session
    if (isLoading) return

    const checkAuthentication = async () => {
      try {
        // Check if we have a session
        if (!session) {
          console.log("ProtectedRoute: No session, redirecting to login")
          router.push("/login?error=unauthorized")
          return
        }

        // Check if user has admin role
        const role = session.user?.user_metadata?.role
        const hasAdminRole = role === "admin"

        if (!hasAdminRole) {
          console.log("ProtectedRoute: User doesn't have admin role")
          router.push("/login?error=permission")
          return
        }

        // User is authenticated and has admin role
        setIsAdmin(true)
      } catch (error) {
        console.error("Error checking authentication:", error)
        router.push("/login?error=error")
      } finally {
        setIsCheckingRole(false)
      }
    }

    checkAuthentication()
  }, [session, isLoading, router, supabase])

  // Show loading state while checking authentication
  if (isLoading || isCheckingRole) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-2 text-xl font-medium">Loading...</span>
      </div>
    )
  }

  // If authenticated and has admin role, render the children
  if (isAdmin) {
    return <>{children}</>
  }

  // Fallback - should not reach here as we redirect in the useEffect
  return null
} 