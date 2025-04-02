"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { getSupabaseBrowser } from "@/lib/supabase-browser"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function AdminSettingsPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const { toast } = useToast()
  const supabase = getSupabaseBrowser()

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      // Call the admin creation API
      const response = await fetch("/api/admin/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role: "admin" }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create admin user")
      }

      setMessage({ type: 'success', text: "Admin user created successfully" })
      toast({
        title: "Success",
        description: "Admin user created successfully",
      })

      // Reset form
      setEmail("")
      setPassword("")
    } catch (error: any) {
      console.error("Error creating admin:", error)
      setMessage({ type: 'error', text: error.message || "Failed to create admin user" })
      toast({
        title: "Error",
        description: error.message || "Failed to create admin user",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Settings</h1>
        <p className="text-muted-foreground">
          Manage admin users and application settings.
        </p>
      </div>
      
      <Separator />
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Admin User</CardTitle>
            <CardDescription>
              Create a new admin user who will have full access to the admin dashboard.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateAdmin}>
            <CardContent className="space-y-4">
              {message && (
                <Alert variant={message.type === 'error' ? "destructive" : "default"}>
                  {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  <AlertTitle>{message.type === 'error' ? "Error" : "Success"}</AlertTitle>
                  <AlertDescription>{message.text}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Strong password"
                  required
                  minLength={8}
                />
                <p className="text-sm text-muted-foreground">
                  Password must be at least 8 characters long.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Admin User"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
} 