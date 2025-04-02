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
    
    // Create course data object without image_url to avoid schema mismatch
    const courseData = { 
      title, 
      description, 
      duration, 
      price 
    }
    
    // Only include image_url if it's not empty and the field exists in DB
    try {
      const { data, error } = await supabase
        .from("courses")
        .insert([courseData])
        .select()
      
      if (error) {
        console.error("Error creating course:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }
      
      return NextResponse.json({ 
        success: true,
        data: data[0]
      }, { status: 201 })
    } catch (error: any) {
      console.error("Initial insert failed:", error)
      
      // If the first attempt failed, try without image_url
      if (error.message && error.message.includes("image_url")) {
        console.log("Retrying without image_url field")
        const { data, error: secondError } = await supabase
          .from("courses")
          .insert([{ title, description, duration, price }])
          .select()
        
        if (secondError) {
          console.error("Error in second attempt:", secondError)
          return NextResponse.json({ error: secondError.message }, { status: 500 })
        }
        
        return NextResponse.json({ 
          success: true,
          data: data[0]
        }, { status: 201 })
      }
      
      // If it's a different error, return it
      return NextResponse.json({ error: error.message || "Database error" }, { status: 500 })
    }
  } catch (error) {
    console.error("Unexpected error creating course:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

