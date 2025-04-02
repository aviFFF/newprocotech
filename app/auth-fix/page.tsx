"use client"

import { useState } from "react"
import { createClient } from '@supabase/supabase-js'

export default function AuthFix() {
  const [message, setMessage] = useState("Ready to fix auth issues...")
  const [loading, setLoading] = useState(false)

  // Create a client directly in this component
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    }
  })

  const handleDirectLogin = async () => {
    setLoading(true)
    setMessage("Attempting to sign in...")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@admin.com',
        password: 'admin123'
      })

      if (error) throw error

      setMessage(`Logged in as ${data.user.email}! Redirecting in 2 seconds...`)
      
      // Wait a bit to make sure cookies are set
      setTimeout(() => {
        window.location.href = '/admin'
      }, 2000)
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    setMessage("Signing out...")
    
    try {
      await supabase.auth.signOut()
      setMessage("Signed out successfully!")
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const checkSession = async () => {
    setLoading(true)
    setMessage("Checking session...")
    
    try {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        setMessage(`You are logged in as: ${data.session.user.email}
                    Role: ${data.session.user.user_metadata?.role || 'none'}`)
      } else {
        setMessage("You are not logged in.")
      }
    } catch (err: any) {
      setMessage(`Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth Fix Utility</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-6">
        <p className="font-mono">{message}</p>
      </div>
      
      <div className="grid gap-4">
        <button 
          onClick={handleDirectLogin}
          disabled={loading}
          className="bg-blue-500 text-white p-3 rounded font-medium hover:bg-blue-600 disabled:opacity-50"
        >
          Login as admin@admin.com
        </button>
        
        <button 
          onClick={checkSession}
          disabled={loading}
          className="bg-green-500 text-white p-3 rounded font-medium hover:bg-green-600 disabled:opacity-50"
        >
          Check Current Session
        </button>
        
        <button 
          onClick={handleSignOut}
          disabled={loading}
          className="bg-red-500 text-white p-3 rounded font-medium hover:bg-red-600 disabled:opacity-50"
        >
          Sign Out
        </button>
      </div>
      
      <div className="mt-8 text-sm text-gray-600">
        <p>Use this page to fix authentication issues with your admin access.</p>
        <p className="mt-2">Steps:</p>
        <ol className="list-decimal pl-5 mt-1 space-y-1">
          <li>Click "Login as admin@admin.com"</li>
          <li>Wait for the redirect to admin</li>
          <li>If it doesn't work, check your session</li>
        </ol>
      </div>
    </div>
  )
} 