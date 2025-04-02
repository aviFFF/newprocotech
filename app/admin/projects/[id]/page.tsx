import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import ProjectForm from "@/components/admin/project-form"
import type { Database } from "@/lib/database.types"

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
    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.warn("Supabase credentials not found. Using fallback data.")
      return { ...fallbackProject, id: parseInt(id) }
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
    
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .single()
    
    if (error) {
      console.error("Error fetching project:", error)
      return { ...fallbackProject, id: parseInt(id) }
    }
    
    if (!data) {
      return { ...fallbackProject, id: parseInt(id) }
    }
    
    // Ensure the technologies field is an array
    return {
      ...data,
      technologies: Array.isArray(data.technologies) ? data.technologies : []
    }
  } catch (error) {
    console.error("Error fetching project:", error)
    return { ...fallbackProject, id: parseInt(id) }
  }
}

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id)

  if (!project) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/projects">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Project not found.</p>
          </CardContent>
        </Card>
      </div>
    )
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

