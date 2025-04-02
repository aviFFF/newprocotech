import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Setup | DevGenius",
  description: "Setup the administrator account for DevGenius",
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