import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"
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

// GET all companies with optional pagination
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
    
    // Get companies with pagination
    const { data: companies, error, count } = await supabase
      .from("companies")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1)
    
    if (error) {
      console.error("Error fetching companies:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      data: companies,
      total: count,
      page,
      limit
    })
  } catch (error) {
    console.error("Unexpected error fetching companies:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST a new company
export async function POST(request: NextRequest) {
  try {
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
      .insert([{ name, logo_url, website }])
      .select()
    
    if (error) {
      console.error("Error creating company:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true,
      data: data[0]
    }, { status: 201 })
  } catch (error) {
    console.error("Unexpected error creating company:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

