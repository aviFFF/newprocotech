import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import type { Database } from "@/lib/database.types"

// GET a single company by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 })
    }
    
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single()
    
    if (error) {
      console.error("Error fetching company:", error)
      return NextResponse.json({ error: "Company not found" }, { status: 404 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// UPDATE a company by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 })
    }
    
    const body = await request.json()
    const { name, logo_url, website } = body
    
    // Validate required fields
    if (!name || !logo_url) {
      return NextResponse.json({ error: "Name and logo URL are required" }, { status: 400 })
    }
    
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    
    const { data, error } = await supabase
      .from("companies")
      .update({ name, logo_url, website })
      .eq("id", id)
      .select()
      .single()
    
    if (error) {
      console.error("Error updating company:", error)
      return NextResponse.json({ error: "Failed to update company" }, { status: 500 })
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// DELETE a company by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json({ error: "Company ID is required" }, { status: 400 })
    }
    
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    
    const { error } = await supabase
      .from("companies")
      .delete()
      .eq("id", id)
    
    if (error) {
      console.error("Error deleting company:", error)
      return NextResponse.json({ error: "Failed to delete company" }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

