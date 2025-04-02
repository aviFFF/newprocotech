import { createServerSupabaseClient } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const { userId } = await request.json()
    
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }
    
    console.log("Updating role to admin for user ID:", userId)

    // Update the user's metadata to include admin role
    const { data, error } = await supabase.auth.admin.updateUserById(
      userId,
      { user_metadata: { role: 'admin' } }
    )

    if (error) {
      console.error("Error updating user role:", error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    console.log("User role updated successfully:", data.user.email)

    return NextResponse.json({ 
      message: "User role updated to admin", 
      user: data.user 
    })
  } catch (error: any) {
    console.error("Error updating user role:", error)
    return NextResponse.json(
      { error: error.message || "Failed to update user role" },
      { status: 500 }
    )
  }
} 