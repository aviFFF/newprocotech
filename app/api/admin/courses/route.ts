import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import type { Database } from "@/lib/database.types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, duration, price, image_url } = body

    // Validate the request
    if (!title || !description || !duration || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Database configuration not found" }, { status: 500 })
    }

    const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Remove created_at from the insert since it might not exist in the table
    const { data, error } = await supabase
      .from("courses")
      .insert([
        {
          title,
          description,
          duration,
          price,
          image_url: image_url || "/placeholder.svg?height=200&width=400",
        },
      ])
      .select()

    if (error) {
      console.error("Error creating course:", error)
      return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: data[0] })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

