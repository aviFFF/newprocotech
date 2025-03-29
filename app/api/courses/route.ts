import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import type { Database } from "@/lib/database.types"

// Sample fallback data in case the database isn't set up yet
const fallbackCourses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description: "Learn HTML, CSS, and JavaScript to build modern websites.",
    duration: "8 weeks",
    price: 299,
    image_url: "/placeholder.svg?height=200&width=400&text=Web+Dev",
  },
  {
    id: 2,
    title: "React.js Masterclass",
    description: "Master React.js and build powerful single-page applications.",
    duration: "10 weeks",
    price: 399,
    image_url: "/placeholder.svg?height=200&width=400&text=React",
  },
  {
    id: 3,
    title: "Full-Stack Development",
    description: "Become a full-stack developer with Node.js, Express, and MongoDB.",
    duration: "12 weeks",
    price: 499,
    image_url: "/placeholder.svg?height=200&width=400&text=Full+Stack",
  },
]

export async function GET() {
  try {
    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("Supabase environment variables not found, returning fallback data")
      return NextResponse.json(fallbackCourses)
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Remove the order by created_at since the column doesn't exist
    const { data, error } = await supabase.from("courses").select("*")

    if (error) {
      console.error("Error fetching courses from Supabase:", error)
      // Return fallback data if there's a database error
      return NextResponse.json(fallbackCourses)
    }

    // If no data is returned from Supabase, use fallback data
    if (!data || data.length === 0) {
      console.warn("No courses found in database, returning fallback data")
      return NextResponse.json(fallbackCourses)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Unexpected error in courses API:", error)
    // Return fallback data on any error
    return NextResponse.json(fallbackCourses)
  }
}

