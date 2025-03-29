"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  FolderKanban,
  Building2,
  LogOut,
  Settings,
  Database,
} from "lucide-react"

const navItems = [
  { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { name: "Inquiries", path: "/admin/inquiries", icon: MessageSquare },
  { name: "Courses", path: "/admin/courses", icon: BookOpen },
  { name: "Projects", path: "/admin/projects", icon: FolderKanban },
  { name: "Companies", path: "/admin/companies", icon: Building2 },
  { name: "Database Setup", path: "/admin/setup", icon: Database },
  { name: "Settings", path: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen p-4">
      <div className="mb-8 pt-4">
        <h1 className="text-2xl font-bold text-center">Admin Panel</h1>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-slate-800"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-4 w-52">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 transition-colors">
          <LogOut className="h-5 w-5" />
          <span>Back to Website</span>
        </Link>
      </div>
    </div>
  )
}

