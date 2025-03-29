import type React from "react"
import { redirect } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // In a real application, you would check for admin authentication here
  // This is a simplified version for demonstration purposes
  const isAuthenticated = true // Replace with actual auth check

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

