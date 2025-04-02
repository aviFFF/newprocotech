import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Login | Proco",
  description: "Login to access the Proco admin panel",
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