import { createServerSupabaseClient } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Hardcoded admin credentials for testing
    const email = "admin@admin.com"
    const password = "admin123"
    
    console.log("Creating direct admin user with email:", email)

    // Create a new admin user with email confirmation already done
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Skip email confirmation
      user_metadata: { role: 'admin' },
    })

    if (error) {
      // If the user already exists, try to update their role
      if (error.message.includes("already exists")) {
        console.log("User already exists, trying to sign in and update")
        
        // Try to sign in with the credentials to get the user ID
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        
        if (signInError) {
          console.error("Error signing in:", signInError)
          return NextResponse.json(
            { error: "User exists but password may be different. Try logging in with admin@admin.com." },
            { status: 400 }
          )
        }
        
        // Update user role
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          signInData.user.id,
          { user_metadata: { role: 'admin' } }
        )
        
        if (updateError) {
          console.error("Error updating user:", updateError)
          return NextResponse.json(
            { error: updateError.message },
            { status: 400 }
          )
        }
        
        return NextResponse.json({ 
          message: "Existing admin user updated successfully", 
          user: signInData.user
        })
      }
      
      console.error("Error creating direct admin user:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    console.log("Direct admin user created successfully:", data.user.email)

    return NextResponse.json({ 
      message: "Direct admin user created successfully", 
      user: data.user 
    })
  } catch (error: any) {
    console.error("Error creating direct admin user:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create direct admin user" },
      { status: 500 }
    )
  }
} 