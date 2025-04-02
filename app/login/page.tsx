"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { signIn } from "@/lib/client-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      console.log("Attempting to sign in with:", email)
      const data = await signIn({ email, password })
      console.log("Sign in response:", data)
      
      if (!data.session) {
        throw new Error("No session returned from authentication")
      }
      
      console.log("User metadata:", data.session.user.user_metadata)
      console.log("User role:", data.session.user.user_metadata?.role)
      
      // Check if user has admin role
      if (data.session?.user?.user_metadata?.role !== 'admin') {
        setError("Access denied: You do not have admin privileges")
        setLoading(false)
        return
      }

      // Redirect to admin dashboard on successful login
      console.log("Login successful, redirecting to admin dashboard")
      
      // Store a token in localStorage to help with session persistence
      localStorage.setItem('adminAuthenticated', 'true')
      
      // Force hard navigation instead of client-side routing
      window.location.href = '/admin'
    } catch (err: any) {
      console.error("Login error:", err)
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
            {/* <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => window.open('/api/seed-admin', '_blank')}
            >
              Create Default Admin Account
            </Button> */}
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