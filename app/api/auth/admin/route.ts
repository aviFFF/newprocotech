import { createServerSupabaseClient } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { email, password } = await request.json()

    // Sign in with provided credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    // Check if user has admin role in metadata
    const user = data.user
    if (user?.user_metadata?.role !== "admin") {
      return NextResponse.json(
        { error: "Access denied: You do not have admin privileges" },
        { status: 403 }
      )
    }

    // Return session data
    return NextResponse.json({ session: data.session })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Authentication failed" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data } = await supabase.auth.getSession()

    return NextResponse.json({ session: data.session })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to get session" },
      { status: 500 }
    )
  }
} 