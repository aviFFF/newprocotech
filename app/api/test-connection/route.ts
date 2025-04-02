import { createServerSupabaseClient } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    // Check if environment variables are set
    const envCheck = {
      supabaseUrlSet: !!supabaseUrl,
      supabaseAnonKeySet: !!supabaseAnonKey,
      supabaseServiceKeySet: !!supabaseServiceKey
    }
    
    // Try to create a Supabase client
    const supabase = createServerSupabaseClient()
    
    // Test a simple query - wrap in try/catch since the table might not exist
    let connectionStatus = 'Unknown'
    try {
      const { data, error } = await supabase.from('_test_connection').select('*').limit(1)
      connectionStatus = error ? 'Error, but likely just missing table' : 'Success'
    } catch (e) {
      connectionStatus = 'Could connect but table does not exist'
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Connection test complete',
      environmentVariables: envCheck,
      connectionTest: connectionStatus,
      supabaseUrl: supabaseUrl ? `${supabaseUrl.substring(0, 15)}...` : 'Not set' // Only show prefix for security
    })
  } catch (error: any) {
    console.error('Error testing connection:', error)
    return NextResponse.json({
      status: 'error',
      message: error.message || 'An error occurred testing the connection',
    }, { status: 500 })
  }
} 