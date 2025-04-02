import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
import type { Database } from "@/lib/database.types"

// GET a single inquiry by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json({ error: "Inquiry ID is required" }, { status: 400 })
    }
    
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    
    const { data, error } = await supabase
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .single()
    
    if (error) {
      console.error("Error fetching inquiry:", error)
      return NextResponse.json({ error: "Inquiry not found" }, { status: 404 })
    }
    
    // Format inquiry data
    const formattedInquiry = {
      ...data,
      date: new Date(data.created_at || "").toISOString().split("T")[0],
    }
    
    // Extract subject from message if it's in the format "Subject: xxx\n\nActual message"
    if (formattedInquiry.message && formattedInquiry.message.startsWith("Subject:")) {
      const parts = formattedInquiry.message.split("\n\n")
      if (parts.length >= 2) {
        formattedInquiry.subject = parts[0].replace("Subject:", "").trim()
        formattedInquiry.message = parts.slice(1).join("\n\n")
      }
    }
    
    return NextResponse.json(formattedInquiry)
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// DELETE an inquiry by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json({ error: "Inquiry ID is required" }, { status: 400 })
    }
    
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    
    const { error } = await supabase
      .from("inquiries")
      .delete()
      .eq("id", id)
    
    if (error) {
      console.error("Error deleting inquiry:", error)
      return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

