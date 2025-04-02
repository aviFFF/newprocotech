import { Suspense } from "react"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

import { Button } from "@/components/ui/button"
import ProjectsTable from "@/components/admin/projects-table"
import { Plus } from "lucide-react"

// Mark the page as dynamically rendered
export const dynamic = "force-dynamic"

// Fallback data for projects
const fallbackProjects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "A modern e-commerce solution with payment processing",
    image_url: "/placeholder.svg",
    technologies: ["React", "Node.js", "Stripe"],
    url: "https://example.com/ecommerce"
  },
  {
    id: 2,
    title: "Portfolio Website",
    description: "Professional portfolio website with dynamic content",
    image_url: "/placeholder.svg",
    technologies: ["Next.js", "Tailwind CSS"],
    url: null
  }
]

async function getProjects() {
  try {
    // Check if SUPABASE environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("Supabase credentials not found. Using fallback data.")
      return fallbackProjects
    }
    
    // Create a Supabase client directly
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: false })
    
    if (error) {
      console.error("Error fetching projects:", error)
      return fallbackProjects
    }
    
    if (!data || data.length === 0) {
      return fallbackProjects
    }
    
    // Ensure each project has a technologies array
    const formattedData = data.map(project => ({
      ...project,
      technologies: Array.isArray(project.technologies) ? project.technologies : []
    }))
    
    return formattedData
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return fallbackProjects
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  
  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link href="/admin/projects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Project
          </Button>
        </Link>
      </div>
      
      <Suspense fallback={<div>Loading projects...</div>}>
        <ProjectsTable initialProjects={projects} />
      </Suspense>
    </div>
  )
} 