import { createServerSupabaseClient } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      return NextResponse.json({
        status: 'unauthenticated',
        message: 'No active session found'
      })
    }
    
    // Return basic session data without sensitive information
    return NextResponse.json({
      status: 'authenticated',
      message: 'Active session found',
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.user_metadata?.role || 'no role defined'
      }
    })
  } catch (error: any) {
    console.error('Error checking session:', error)
    return NextResponse.json({
      status: 'error',
      message: error.message || 'An error occurred checking the session'
    }, { status: 500 })
  }
} 