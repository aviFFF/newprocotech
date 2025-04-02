import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Login | DevGenius",
  description: "Login to access the DevGenius admin panel",
}

export default function LoginLayout({
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