import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Setup | Proco",
  description: "Setup the administrator account for Proco",
}

export default function AdminSetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
} 