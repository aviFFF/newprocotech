import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import type { Database } from "@/lib/database.types"

// Sample fallback data in case the database isn't set up yet
const fallbackInquiries = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    subject: "Custom Software Development",
    message: "I would like to discuss a custom software project for my business.",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    subject: "Course Enrollment Question",
    message: "I have a question about the React.js Masterclass course.",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    subject: "Partnership Opportunity",
    message: "Our company is interested in partnering with you on educational content.",
  },
]

export async function GET() {
  try {
    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("Supabase environment variables not found, returning fallback data")
      return NextResponse.json(fallbackInquiries)
    }

    const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Remove the order by created_at since the column might not exist
    const { data, error } = await supabase.from("inquiries").select("*")

    if (error) {
      console.error("Error fetching inquiries from Supabase:", error)
      // Return fallback data if there's a database error
      return NextResponse.json(fallbackInquiries)
    }

    // If no data is returned from Supabase, use fallback data
    if (!data || data.length === 0) {
      console.warn("No inquiries found in database, returning fallback data")
      return NextResponse.json(fallbackInquiries)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error in inquiries API:", error)
    // Return fallback data on any error
    return NextResponse.json(fallbackInquiries)
  }
}

