import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Mark the page as dynamically rendered
export const dynamic = "force-dynamic"

// Hardcoded fallback data for projects
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
  {
    id: 4,
    title: "Financial Dashboard",
    description: "Interactive dashboard for tracking investments, expenses, and financial goals.",
    image_url: "/placeholder.svg?height=200&width=400&text=Finance",
    technologies: ["React", "D3.js", "Node.js", "MongoDB"],
    url: "https://example.com/finance",
  },
  {
    id: 5,
    title: "Learning Management System",
    description: "Platform for creating, delivering, and managing educational content.",
    image_url: "/placeholder.svg?height=200&width=400&text=LMS",
    technologies: ["React", "Firebase", "Node.js", "Express"],
    url: "https://example.com/lms",
  },
  {
    id: 6,
    title: "Social Media Analytics Tool",
    description: "Tool for tracking and analyzing social media performance across platforms.",
    image_url: "/placeholder.svg?height=200&width=400&text=Analytics",
    technologies: ["Vue.js", "Python", "Flask", "PostgreSQL"],
    url: "https://example.com/analytics",
  },
]

// Fetch data from Supabase
async function getProjects() {
  try {
    // Use a relative URL
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/projects`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
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

export default async function PortfolioPage() {
  // Use fallback data if fetch fails
  let projects = fallbackProjects

  try {
    projects = await getProjects()
  } catch (error) {
    console.error("Error loading projects:", error)
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Portfolio</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Explore our successful projects delivered to clients worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <Image
              src={project.image_url || "/placeholder.svg?height=200&width=400"}
              alt="portfolioImage"
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">{project.title}</h3>
              <p className="text-muted-foreground mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies && project.technologies.map ? (
                  project.technologies.map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">Technology</span>
                )}
              </div>
              {project.url && (
                <Link href={project.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full">
                    View Project
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

