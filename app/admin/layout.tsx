import type React from "react"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { isAdmin } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // DEVELOPMENT ONLY: Bypass authentication check
  const isAuthenticated = true
  
  // Production code (currently disabled)
  // const isAuthenticated = await isAdmin()

  if (!isAuthenticated) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}

