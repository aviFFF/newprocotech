import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import type { Database } from "@/lib/database.types"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Database configuration not found" }, { status: 500 })
    }

    const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      console.error("Error deleting project:", error)
      return NextResponse.json({ error: error.message || "Failed to delete project" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { title, description, image_url, technologies, url } = body

    // Ensure technologies is an array
    const sanitizedTechnologies = Array.isArray(technologies) ? technologies : []

    // Validate the request
    if (!title || !description || sanitizedTechnologies.length === 0) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Database configuration not found" }, { status: 500 })
    }

    const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    const { data, error } = await supabase
      .from("projects")
      .update({
        title,
        description,
        image_url: image_url || "/placeholder.svg?height=200&width=400",
        technologies: sanitizedTechnologies,
        url: url || null,
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating project:", error)
      
      // Check for column not found error
      if (error.message && (
        error.message.includes("technologies") && 
        (error.message.includes("column") || error.message.includes("schema"))
      )) {
        return NextResponse.json({ 
          error: "The 'technologies' column is missing in the projects table. Please go to the admin/setup page to update your database schema." 
        }, { status: 500 })
      }
      
      return NextResponse.json({ error: error.message || "Failed to update project" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data[0] })
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

