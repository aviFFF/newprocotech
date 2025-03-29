import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import type { Database } from "@/lib/database.types"

// Sample fallback data in case the database isn't set up yet
const fallbackProjects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A full-featured e-commerce platform with payment processing and inventory management.",
    image_url: "/placeholder.svg?height=200&width=400&text=E-commerce",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    url: "https://example.com/ecommerce",
  },
  {
    id: 2,
    title: "Healthcare Management System",
    description: "A comprehensive system for managing patient records, appointments, and billing.",
    image_url: "/placeholder.svg?height=200&width=400&text=Healthcare",
    technologies: ["Angular", "Java", "Spring Boot", "PostgreSQL"],
    url: "https://example.com/healthcare",
  },
  {
    id: 3,
    title: "Real Estate Marketplace",
    description: "A platform connecting property buyers, sellers, and agents with advanced search features.",
    image_url: "/placeholder.svg?height=200&width=400&text=Real+Estate",
    technologies: ["Vue.js", "Python", "Django", "AWS"],
    url: "https://example.com/realestate",
  },
]

export async function GET() {
  try {
    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("Supabase environment variables not found, returning fallback data")
      return NextResponse.json(fallbackProjects)
    }

    const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    // Remove the order by created_at since the column might not exist
    const { data, error } = await supabase.from("projects").select("*")

    if (error) {
      console.error("Error fetching projects from Supabase:", error)
      // Return fallback data if there's a database error
      return NextResponse.json(fallbackProjects)
    }

    // If no data is returned from Supabase, use fallback data
    if (!data || data.length === 0) {
      console.warn("No projects found in database, returning fallback data")
      return NextResponse.json(fallbackProjects)
    }

    // Ensure technologies is always an array
    const processedData = data.map((project) => ({
      ...project,
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
    }))

    return NextResponse.json(processedData)
  } catch (error) {
    console.error("Unexpected error in projects API:", error)
    // Return fallback data on any error
    return NextResponse.json(fallbackProjects)
  }
}

