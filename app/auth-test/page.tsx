"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/client-auth"

export default function AuthTest() {
  const [status, setStatus] = useState<string>("Checking authentication...")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    async function checkAuth() {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setStatus(`Authenticated as ${data.session.user.email}`)
        console.log("User metadata:", data.session.user.user_metadata)
      } else {
        setStatus("Not authenticated")
      }
    }
    
    checkAuth()
  }, [])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin'
          }
        }
      })

      if (error) throw error
      
      setSuccess(`User created: ${email}. Check your email for confirmation.`)
      console.log("Sign up response:", data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      
      setSuccess(`Signed in as ${data.user?.email}`)
      console.log("Sign in response:", data)
      console.log("User metadata:", data.user?.user_metadata)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      setError(error.message)
    } else {
      setStatus("Not authenticated")
      setSuccess("Signed out successfully")
    }
  }

  const createDirectAdmin = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch("/api/create-direct-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create admin user")
      }

      setSuccess("Direct admin created successfully: admin@admin.com / admin123")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const directLoginAsAdmin = async () => {
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Direct login with hardcoded admin credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@admin.com',
        password: 'admin123'
      })

      if (error) throw error

      // Check user role
      if (data.user?.user_metadata?.role !== 'admin') {
        // Update user role if not admin
        const { error: updateError } = await fetch("/api/update-admin-role", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: data.user.id })
        }).then(res => res.json())

        if (updateError) {
          throw new Error("Failed to update admin role")
        }
      }

      setSuccess(`Directly logged in as ${data.user.email}. You can now access the admin page.`)
      console.log("Login response:", data)
      
      // Redirect to admin after short delay
      setTimeout(() => {
        window.location.href = '/admin'
      }, 1500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      <div className="mb-4">
        <p>Status: {status}</p>
      </div>

      {error && (
        <div className="bg-red-100 p-4 mb-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 p-4 mb-4 rounded">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <button 
            onClick={createDirectAdmin}
            className="bg-purple-500 text-white p-2 rounded w-full"
            disabled={loading}
          >
            {loading ? "Creating..." : "1. Create Direct Admin (admin@admin.com)"}
          </button>
          <p className="text-sm mt-2 text-gray-600">
            Step 1: Creates admin@admin.com with password admin123
          </p>
        </div>
        
        <div>
          <button 
            onClick={directLoginAsAdmin}
            className="bg-indigo-500 text-white p-2 rounded w-full"
            disabled={loading}
          >
            {loading ? "Logging in..." : "2. Direct Login As Admin"}
          </button>
          <p className="text-sm mt-2 text-gray-600">
            Step 2: Login directly and redirect to admin
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border p-4 rounded">
          <h2 className="text-lg font-bold mb-2">Sign Up (Create Admin)</h2>
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 w-full rounded"
                required
              />
            </div>
            <button 
              type="submit" 
              className="bg-blue-500 text-white p-2 rounded"
              disabled={loading}
            >
              {loading ? "Processing..." : "Sign Up"}
            </button>
          </form>
        </div>

        <div className="border p-4 rounded">
          <h2 className="text-lg font-bold mb-2">Sign In</h2>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block mb-1">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border p-2 w-full rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border p-2 w-full rounded"
                required
              />
            </div>
            <button 
              type="submit" 
              className="bg-green-500 text-white p-2 rounded"
              disabled={loading}
            >
              {loading ? "Processing..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8">
        <button 
          onClick={handleSignOut}
          className="bg-red-500 text-white p-2 rounded"
        >
          Sign Out
        </button>
      </div>
    </div>
  )
} 