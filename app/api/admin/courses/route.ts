import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import type { Database } from "@/lib/database.types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, duration } = body

    // Validate the request
    if (!title || !description || !duration) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Database configuration not found" }, { status: 500 })
    }

    const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Try to create the course
    try {
      const { data, error } = await supabase
        .from("courses")
        .insert([
          {
            title,
            description,
            duration,
          },
        ])
        .select()

      if (error) {
        console.error("Error creating course:", error)
        
        // Check for specific error types
        if (error.code === "42P01") {
          return NextResponse.json({ 
            error: "Database table 'courses' does not exist. Please run the setup SQL queries from the admin/setup page." 
          }, { status: 500 })
        }
        
        return NextResponse.json({ error: error.message || "Failed to create course" }, { status: 500 })
      }

      return NextResponse.json({ success: true, data: data[0] })
    } catch (dbError: any) {
      console.error("Database error:", dbError)
      return NextResponse.json({ 
        error: `Database error: ${dbError.message}. Please check the admin/setup page to create required tables.`
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal Server Error: " + error.message }, { status: 500 })
  }
}

