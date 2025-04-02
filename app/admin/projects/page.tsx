import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"
import ProjectActions from "./project-actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

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
    // Initialize Supabase client
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (error) {
      console.error("Error fetching projects:", error)
      return fallbackProjects
    }
    
    return projects
  } catch (error) {
    console.error("Error in getProjects:", error)
    return fallbackProjects
  }
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button asChild>
          <Link href="/admin/projects/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Project
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {projects.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No projects found</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Title</th>
                    <th className="text-left py-3 px-4 font-medium">Description</th>
                    <th className="text-left py-3 px-4 font-medium">Technologies</th>
                    <th className="text-left py-3 px-4 font-medium">URL</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b">
                      <td className="py-3 px-4">{project.title}</td>
                      <td className="py-3 px-4 max-w-xs truncate">{project.description}</td>
                      <td className="py-3 px-4">
                        {project.technologies?.join(", ") || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        {project.url ? (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                            {project.url}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <ProjectActions project={project} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 