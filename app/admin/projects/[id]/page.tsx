import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import ProjectForm from "@/components/admin/project-form"
import type { Database } from "@/lib/database.types"
import { notFound } from "next/navigation"

// Fallback project data
const fallbackProject = {
  id: 0,
  title: "Sample Project",
  description: "This is a sample project",
  image_url: "/placeholder.svg", 
  technologies: ["Sample Technology"],
  url: null
}

// Fetch project from the database
async function getProject(id: string) {
  try {
    // Check if this is the "add" route
    if (id === "add") {
      // Return null for add route - we'll handle this case separately
      return null
    }

    // Try to convert ID to number - handle error gracefully if not a valid number
    let projectId: number;
    try {
      projectId = parseInt(id);
      if (isNaN(projectId)) {
        console.error("Invalid project ID format:", id);
        return null;
      }
    } catch (e) {
      console.error("Error parsing project ID:", e);
      return null;
    }

    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("Supabase credentials not found. Using fallback data.")
      return { ...fallbackProject, id: projectId }
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single()
    
    if (error) {
      console.error("Error fetching project:", error)
      return { ...fallbackProject, id: projectId }
    }
    
    if (!data) {
      return { ...fallbackProject, id: projectId }
    }
    
    // Ensure the technologies field is an array
    return {
      ...data,
      technologies: Array.isArray(data.technologies) ? data.technologies : []
    }
  } catch (error) {
    console.error("Error fetching project:", error)
    return null
  }
}

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  // Special handling for "add" route
  if (params.id === "add") {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/projects">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Add New Project</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectForm isEditing={false} />
          </CardContent>
        </Card>
      </div>
    )
  }

  const project = await getProject(params.id)

  if (!project) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/projects">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Project</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm initialData={project} isEditing />
        </CardContent>
      </Card>
    </div>
  )
}

