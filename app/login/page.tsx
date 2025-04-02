"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Loader2 } from "lucide-react"
import { getSupabaseBrowser } from "@/lib/supabase-browser"

// Create a separate component that uses the search params
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("Admin123!")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get the shared Supabase client instance
  const supabase = getSupabaseBrowser()

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        // User is already logged in, redirect to admin
        router.push('/admin')
      }
    }
    
    checkSession()
  }, [router, supabase.auth])

  // Handle error query parameters
  useEffect(() => {
    const errorType = searchParams.get('error')
    if (errorType) {
      switch (errorType) {
        case 'unauthorized':
          setError('You must login to access this page')
          break
        case 'permission':
          setError('You do not have permission to access this area')
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
      // First create the admin user if it doesn't exist (for convenience in development)
      if (process.env.NODE_ENV === 'development' && 
          email === 'admin@example.com' && 
          password === 'Admin123!') {
        console.log("Attempting to create default admin user...")
        try {
          await fetch("/api/create-default-admin", { method: "GET" })
        } catch (error) {
          console.log("Error creating default admin, but continuing with login")
        }
      }

      console.log(`Attempting to sign in with email: ${email}`)
      
      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      if (!data.session) {
        throw new Error("No session returned from authentication")
      }

      console.log("Login successful, session established", data.session)

      // Ensure user has admin role
      if (data.user?.user_metadata?.role !== 'admin') {
        console.log("Setting admin role for user")
        await supabase.auth.updateUser({
          data: { role: 'admin' }
        })
      }
      
      // Navigate to the admin page
      router.push('/admin')
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Failed to sign in")
      setLoading(false)
    }
  }

  // Quick login button for development
  const handleQuickLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      // Try to create the default admin user first
      await fetch("/api/create-default-admin", { method: "GET" })
      
      // Then sign in with the default admin credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "admin@example.com",
        password: "Admin123!",
      })
      
      if (error) throw error
      
      // Navigate to the admin page
      router.push('/admin')
    } catch (err: any) {
      console.error("Quick login error:", err)
      setError(err.message || "Failed to sign in")
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
            
            {process.env.NODE_ENV === 'development' && (
              <Button 
                type="button" 
                variant="outline" 
                className="w-full"
                onClick={handleQuickLogin}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Quick Login (Dev Only)"}
              </Button>
            )}
            
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

// Loading fallback component
function LoginLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p>Loading login page...</p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  )
}