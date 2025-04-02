import { createServerSupabaseClient } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

// This endpoint should only be accessible in development mode or through a secure setup process
// In production, you would want to restrict this or remove it entirely

export async function POST(request: NextRequest) {
  // Only allow in development mode or with a special setup key
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This endpoint is only available in development mode" },
      { status: 403 }
    )
  }

  try {
    const supabase = createServerSupabaseClient()
    const { email, password, role } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Ensure role is admin
    const userRole = role === 'admin' ? 'admin' : 'admin' // Ensure it's always admin

    console.log("Creating admin user with email:", email)

    // Create user with admin role
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: userRole },
    })

    if (error) {
      console.error("Error creating admin user:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    console.log("Admin user created successfully:", data.user.email)

    return NextResponse.json({ 
      message: "Admin user created successfully", 
      user: data.user 
    })
  } catch (error: any) {
    console.error("Error creating admin user:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create admin user" },
      { status: 500 }
    )
  }
} 