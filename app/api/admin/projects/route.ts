import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import type { Database } from "@/lib/database.types"

// GET all projects with optional pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get("limit") || "10")
    const page = parseInt(searchParams.get("page") || "1")
    const offset = (page - 1) * limit
    
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    // Get projects with pagination
    const { data: projects, error, count } = await supabase
      .from("projects")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error("Error fetching projects:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      data: projects,
      total: count,
      page,
      limit
    })
  } catch (error) {
    console.error("Unexpected error fetching projects:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST a new project
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image_url, technologies, url } = body

    // Ensure technologies is an array (even if empty)
    const sanitizedTechnologies = Array.isArray(technologies) ? technologies : []

    // Validate the request
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Database configuration not found" }, { status: 500 })
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    // First check if the table exists
    try {
      const { data: tableExists, error: tableCheckError } = await supabase
        .from("projects")
        .select("count(*)", { count: "exact", head: true })
      
      if (tableCheckError) {
        if (tableCheckError.code === "42P01") { // Table doesn't exist
          return NextResponse.json({ 
            error: "Database table 'projects' does not exist. Please run setup from the admin/setup page."
          }, { status: 500 })
        }
      }
    } catch (tableError) {
      console.error("Error checking projects table:", tableError)
    }

    try {
      // Prepare project data with all fields
      const projectData = {
        title,
        description,
        image_url: image_url || "/placeholder.svg?height=200&width=400",
        technologies: sanitizedTechnologies,
        url: url || null,
      }

      // First, try with technologies as array
      const { data, error } = await supabase
        .from("projects")
        .insert([projectData])
        .select()

      if (error) {
        console.error("Error creating project:", error)
        
        // If there's an error with technologies column, try without it
        if (error.code === "PGRST204" || error.message.includes("technologies")) {
          console.log("Retrying without technologies field...")
          
          // Remove technologies from the data object
          const { technologies: _, ...dataWithoutTechnologies } = projectData

          const { data: dataWithoutTech, error: errorWithoutTech } = await supabase
            .from("projects")
            .insert([dataWithoutTechnologies])
            .select()
          
          if (errorWithoutTech) {
            console.error("Error creating project (retry):", errorWithoutTech)
            return NextResponse.json({ error: errorWithoutTech.message }, { status: 500 })
          }
          
          return NextResponse.json({ 
            success: true, 
            data: dataWithoutTech?.[0] || null,
            note: "Project created without technologies. Database may need updating."
          })
        }
        
        // Check for specific error types
        if (error.code === "42P01") {
          return NextResponse.json({ 
            error: "Database table 'projects' does not exist. Please run the setup SQL queries from the admin/setup page." 
          }, { status: 500 })
        }
        
        return NextResponse.json({ error: error.message || "Failed to create project" }, { status: 500 })
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
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

// PUT/PATCH for updating a project
export async function PUT(request: NextRequest) {
  return NextResponse.json({ error: "Please use the project-specific endpoint with ID" }, { status: 405 })
}

