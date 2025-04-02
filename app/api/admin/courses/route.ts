import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import type { Database } from "@/lib/database.types"

// GET all courses with optional pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")
    const offset = (page - 1) * limit
    
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    
    // Get courses with pagination
    const { data: courses, error, count } = await supabase
      .from("courses")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error("Error fetching courses:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      data: courses,
      total: count,
      page,
      limit
    })
  } catch (error) {
    console.error("Unexpected error fetching courses:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST a new course
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, duration, price, image_url } = body
    
    // Validate required fields
    if (!title || !description || !duration || price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    
    // First check if the table exists
    try {
      const { data: tableExists, error: tableCheckError } = await supabase
        .from("courses")
        .select("count(*)", { count: "exact", head: true })
      
      if (tableCheckError) {
        if (tableCheckError.code === "42P01") { // Table doesn't exist
          return NextResponse.json({ 
            error: "Database table 'courses' does not exist. Please run setup from the admin/setup page."
          }, { status: 500 })
        }
      }
    } catch (tableError) {
      console.error("Error checking courses table:", tableError)
    }
    
    try {
      // Try insertion with all fields
      const { data, error } = await supabase
        .from("courses")
        .insert([{ 
          title, 
          description, 
          duration, 
          price, 
          image_url: image_url || null 
        }])
        .select()
      
      if (error) {
        // If schema error about image_url column, try without it
        if (error.code === "PGRST204" && error.message.includes("image_url")) {
          console.log("Retrying without image_url field...")
          
          const { data: dataWithoutImage, error: errorWithoutImage } = await supabase
            .from("courses")
            .insert([{ title, description, duration, price }])
            .select()
          
          if (errorWithoutImage) {
            console.error("Error creating course (retry):", errorWithoutImage)
            return NextResponse.json({ error: errorWithoutImage.message }, { status: 500 })
          }
          
          return NextResponse.json({ 
            success: true,
            data: dataWithoutImage?.[0] || null
          }, { status: 201 })
        }
        
        console.error("Error creating course:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({ 
        success: true,
        data: data[0]
      }, { status: 201 })
    } catch (insertError) {
      console.error("Error on insert operation:", insertError)
      return NextResponse.json({ 
        error: "Database error during insert operation"
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Unexpected error creating course:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

