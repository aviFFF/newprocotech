import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import type { Database } from "@/lib/database.types"

// Sample fallback data in case the database isn't set up yet
const fallbackCompanies = [
  {
    id: 1,
    name: "Acme Inc",
    logo_url: "/placeholder.svg?height=60&width=120&text=Acme",
    website: "https://example.com/acme",
  },
  {
    id: 2,
    name: "TechCorp",
    logo_url: "/placeholder.svg?height=60&width=120&text=TechCorp",
    website: "https://example.com/techcorp",
  },
  {
    id: 3,
    name: "Innovate Solutions",
    logo_url: "/placeholder.svg?height=60&width=120&text=Innovate",
    website: "https://example.com/innovate",
  },
  {
    id: 4,
    name: "Digital Dynamics",
    logo_url: "/placeholder.svg?height=60&width=120&text=Digital",
    website: "https://example.com/digital",
  },
  {
    id: 5,
    name: "CloudSphere",
    logo_url: "/placeholder.svg?height=60&width=120&text=Cloud",
    website: "https://example.com/cloud",
  },
  {
    id: 6,
    name: "NextGen Systems",
    logo_url: "/placeholder.svg?height=60&width=120&text=NextGen",
    website: "https://example.com/nextgen",
  },
]

export async function GET() {
  try {
    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("Supabase environment variables not found, returning fallback data")
      return NextResponse.json(fallbackCompanies)
    }

    const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Try to fetch data from the companies table
    try {
      const { data, error } = await supabase.from("companies").select("*")

      // If there's an error or no data, return fallback data
      if (error || !data || data.length === 0) {
        console.warn("Error or no data from Supabase, returning fallback data:", error?.message)
        return NextResponse.json(fallbackCompanies)
      }

      return NextResponse.json(data)
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json(fallbackCompanies)
    }
  } catch (error) {
    console.error("Unexpected error in companies API:", error)
    // Return fallback data on any error
    return NextResponse.json(fallbackCompanies)
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, logo_url, website } = body

    // Validate the request
    if (!name || !logo_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Database configuration not found" }, { status: 500 })
    }

    const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    try {
      // Try to insert data into the companies table
      const { data, error } = await supabase
        .from("companies")
        .insert([
          {
            name,
            logo_url,
            website: website || null,
          },
        ])
        .select()

      // If there's an error
      if (error) {
        console.error("Error creating company:", error)

        // If the table doesn't exist, return a more specific error
        if (error.message.includes('relation "companies" does not exist')) {
          return NextResponse.json(
            {
              error: "Companies table does not exist in the database. Please create the table first.",
              details: "Visit /admin/setup for instructions on creating the necessary database tables.",
            },
            { status: 500 },
          )
        }

        return NextResponse.json({ error: "Failed to create company" }, { status: 500 })
      }

      return NextResponse.json({ success: true, data: data[0] })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ error: "Database error occurred" }, { status: 500 })
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

