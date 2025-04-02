import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import type { Database } from "@/lib/database.types"

// GET a single course by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }
    
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", id)
      .single()
    
    if (error) {
      console.error("Error fetching course:", error)
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// UPDATE a course by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }
    
    const body = await request.json()
    
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    
    // Validate required fields
    if (!body.title || !body.description || !body.duration || body.price === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    
    const { data, error } = await supabase
      .from("courses")
      .update({
        title: body.title,
        description: body.description,
        duration: body.duration,
        price: body.price,
        image_url: body.image_url,
      })
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Error updating course:", error)
      return NextResponse.json({ error: "Failed to update course" }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// DELETE a course by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 })
    }
    
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    
    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", id)
    
    if (error) {
      console.error("Error deleting course:", error)
      return NextResponse.json({ error: "Failed to delete course" }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

