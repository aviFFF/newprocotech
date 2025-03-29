import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2 } from "lucide-react"

// Mark the page as dynamically rendered
export const dynamic = "force-dynamic"

// Fallback projects data
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

// In a real application, you would fetch this data from your database
async function getProjects() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/projects`, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("Failed to fetch projects:", res.status, res.statusText)
      return fallbackProjects
    }

    const data = await res.json()
    return Array.isArray(data) && data.length > 0 ? data : fallbackProjects
  } catch (error) {
    console.error("Error fetching projects:", error)
    return fallbackProjects
  }
}

export default async function ProjectsAdminPage() {
  // Use fallback data if fetch fails
  let projects = fallbackProjects

  try {
    projects = await getProjects()
  } catch (error) {
    console.error("Error loading projects:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link href="/admin/projects/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Project
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Title</th>
                    <th className="text-left py-3 px-4 font-medium">Technologies</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={project.id} className="border-b">
                      <td className="py-3 px-4">{project.title}</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {project.technologies && project.technologies.map ? (
                            project.technologies.map((tech, index) => (
                              <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                                {tech}
                              </span>
                            ))
                          ) : (
                            <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                              Technology
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link href={`/admin/projects/${project.id}`}>
                            <Button variant="outline" size="icon">
                              <Pencil className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No projects found.</p>
              <Link href="/admin/projects/new">
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Project
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

