"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/supabase-provider"
import { useState } from "react"
import { getSupabaseBrowser } from "@/lib/supabase-browser"

export default function LogoutButton() {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    
    setIsLoggingOut(true)
    try {
      console.log("Logging out user")
      
      // Use both provider instance and direct client to ensure signout works
      if (supabase) {
        await supabase.auth.signOut()
      }
      
      // Also use direct client as backup
      const directClient = getSupabaseBrowser()
      await directClient.auth.signOut({ scope: 'global' })
      
      // Clear any auth-related items from localStorage
      if (typeof window !== 'undefined') {
        // Clear specific Supabase items
        localStorage.removeItem('supabase.auth.token')
        localStorage.removeItem('adminAuthenticated')
        
        // Clear any session storage too
        sessionStorage.clear()
        
        // If using JWT directly somewhere
        localStorage.removeItem('jwt')
        localStorage.removeItem('authToken')
        
        // Remove all Supabase related items
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('supabase.') || key.includes('auth')) {
            localStorage.removeItem(key)
          }
        })
      }
      
      // Redirect to login page
      console.log("Logout successful, redirecting to login")
      
      // Use window.location for hard refresh to ensure clean state
      window.location.href = '/login'
    } catch (error) {
      console.error("Error logging out:", error)
      setIsLoggingOut(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
    >
      <LogOut className="h-4 w-4" />
      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
    </Button>
  )
} 