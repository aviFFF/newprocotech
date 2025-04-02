"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { getSupabaseBrowser } from "@/lib/supabase-browser"
import { Loader2 } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const supabase = getSupabaseBrowser()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        
        if (!data.session) {
          router.push('/login?error=unauthorized')
          return
        }
        
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth check error:", error)
        router.push('/login?error=unauthorized')
      } finally {
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [router, supabase.auth])

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <span className="ml-2 text-xl font-medium">Loading...</span>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in the useEffect
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}

