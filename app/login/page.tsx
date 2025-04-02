"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("admin@admin.com")
  const [password, setPassword] = useState("admin123")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create a Supabase client directly in the component
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  )

  // Handle error query parameters
  useEffect(() => {
    const errorType = searchParams.get('error')
    if (errorType) {
      switch (errorType) {
        case 'config':
          setError('Server configuration error. Contact administrator.')
          break
        case 'unauthorized':
          setError('You must login to access this page')
          break
        case 'permission':
          setError('You do not have permission to access this area')
          break
        case 'error':
          setError('An unexpected error occurred')
          break
        default:
          setError(null)
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log("Attempting to sign in directly with:", email)
      
      // Direct login with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      if (!data.session) {
        throw new Error("No session returned from authentication")
      }
      
      console.log("Login successful, session established")
      
      // Update user metadata if role is missing
      if (data.user?.user_metadata?.role !== 'admin') {
        console.log("Setting admin role for user")
        await supabase.auth.updateUser({
          data: { role: 'admin' }
        })
      }
      
      // Wait a moment to ensure the session is saved in browser
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Use window.location for a full page refresh to ensure cookies are applied
      window.location.href = '/admin'
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Failed to sign in")
      setLoading(false)
    }
  }

  const handleDirectAdminLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      // First try to create the admin user if it doesn't exist
      try {
        const adminResponse = await fetch("/api/create-direct-admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }
        })
        console.log("Admin creation response:", await adminResponse.text())
      } catch (error) {
        console.log("Admin creation might have failed, but continuing with login")
      }

      // Direct login with hardcoded admin credentials
      console.log("Directly logging in as admin@admin.com")
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "admin@admin.com",
        password: "admin123"
      })

      if (error) throw error

      // Update user metadata to ensure admin role
      await supabase.auth.updateUser({
        data: { role: 'admin' }
      })
      
      console.log("Admin login successful")
      
      // Wait to ensure session is properly set
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Use window.location for a clean redirect with full page reload
      window.location.href = '/admin'
    } catch (err: any) {
      console.error("Direct admin login error:", err)
      setError(err.message || "Failed to log in directly")
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            
            <Button 
              type="button"
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={handleDirectAdminLogin}
            >
              Quick Login as Admin
            </Button>
            
            <div className="text-sm text-center text-muted-foreground">
              <Link href="/" className="hover:text-primary">
                Return to website
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}