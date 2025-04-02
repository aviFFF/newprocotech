"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useSupabase } from "@/components/supabase-provider"
import { useState } from "react"

export default function LogoutButton() {
  const router = useRouter()
  const { supabase } = useSupabase()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (!supabase || isLoggingOut) return
    
    setIsLoggingOut(true)
    try {
      console.log("Logging out user")
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        throw error
      }
      
      // Clear any local storage items related to auth
      localStorage.removeItem('adminAuthenticated')
      
      // Redirect to login page
      console.log("Logout successful, redirecting to login")
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Error logging out:", error)
    } finally {
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