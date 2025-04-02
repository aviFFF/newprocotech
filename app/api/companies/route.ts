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

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Query the companies table
    const { data, error } = await supabase.from("companies").select("*")

    if (error) {
      console.error("Error fetching companies from Supabase:", error)
      // Return fallback data if there's a database error
      return NextResponse.json(fallbackCompanies)
    }

    // If no data is returned from Supabase, use fallback data
    if (!data || data.length === 0) {
      console.warn("No companies found in database, returning fallback data")
      return NextResponse.json(fallbackCompanies)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error in companies API:", error)
    // Return fallback data on any error
    return NextResponse.json(fallbackCompanies)
  }
} 