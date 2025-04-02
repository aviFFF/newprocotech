import { createServerSupabaseClient } from "@/lib/auth"
import { NextResponse } from "next/server"

// This endpoint creates a default admin account
// In production, you should delete this file after first use

// Default admin credentials
const DEFAULT_ADMIN_EMAIL = "admin@example.com"
const DEFAULT_ADMIN_PASSWORD = "Admin123!"

export async function GET() {
  try {
    // Create the Supabase client
    const supabase = createServerSupabaseClient()
    
    // Check if admin already exists
    const { data: existingUsers, error: checkError } = await supabase.auth.admin.listUsers()
    
    if (checkError) {
      console.error("Error checking for existing users:", checkError)
      return NextResponse.json({ 
        success: false, 
        error: checkError.message 
      }, { status: 500 })
    }
    
    const adminExists = existingUsers.users.some(
      user => user.email === DEFAULT_ADMIN_EMAIL && user.user_metadata?.role === "admin"
    )
    
    if (adminExists) {
      return NextResponse.json({ 
        success: true, 
        message: "Admin account already exists",
        credentials: {
          email: DEFAULT_ADMIN_EMAIL,
          password: "****** (existing password preserved)"
        }
      })
    }
    
    // Create the admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: DEFAULT_ADMIN_EMAIL,
      password: DEFAULT_ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { role: "admin" },
    })
    
    if (error) {
      console.error("Error creating admin user:", error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Default admin account created successfully",
      credentials: {
        email: DEFAULT_ADMIN_EMAIL,
        password: DEFAULT_ADMIN_PASSWORD
      }
    })
  } catch (error: any) {
    console.error("Error creating default admin:", error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || "An unknown error occurred" 
    }, { status: 500 })
  }
} 