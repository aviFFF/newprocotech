import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import ChatAssistant from "@/components/chat-assistant"

// Mark the page as dynamically rendered
export const dynamic = "force-dynamic"

// Hardcoded fallback data for courses
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
]

// Hardcoded companies data - used as fallback
const companiesData = [
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

// Fetch data from API with fallback
async function getCourses() {
  try {
    // Use a relative URL for API routes
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/courses`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })

    if (!res.ok) {
      console.error("Failed to fetch courses:", res.status, res.statusText)
      return fallbackCourses
    }

    const data = await res.json()
    return Array.isArray(data) && data.length > 0 ? data : fallbackCourses
  } catch (error) {
    console.error("Error fetching courses:", error)
    return fallbackCourses
  }
}

async function getProjects() {
  try {
    // Use the full URL with the environment variable
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/projects`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
      console.error("Failed to fetch projects:", res.status, res.statusText);
      return fallbackProjects;
    }

    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : fallbackProjects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return fallbackProjects;
  }
}

async function getCompanies() {
  try {
    // Use the full URL with the environment variable
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/companies`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!res.ok) {
      console.error("Failed to fetch companies:", res.status, res.statusText);
      return companiesData;
    }

    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : companiesData;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return companiesData;
  }
}

export default async function Home() {
  // Use fallback data if fetch fails
  let courses = fallbackCourses
  let projects = fallbackProjects
  let companies = companiesData

  try {
    courses = await getCourses()
  } catch (error) {
    console.error("Error loading courses:", error)
  }

  try {
    projects = await getProjects()
  } catch (error) {
    console.error("Error loading projects:", error)
  }
  
  try {
    companies = await getCompanies()
  } catch (error) {
    console.error("Error loading companies:", error)
  }

  // Display only 3 courses and projects on the homepage
  const featuredCourses = courses.slice(0, 3)
  const featuredProjects = projects.slice(0, 3)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-20 md:py-32 md:h-screen overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: "url('/banner1.jpg')" }}
      >
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="hidden lg:block"></div> {/* Empty column for alignment */}
            <div className="flex flex-col justify-center space-y-4 text-white text-right">
              <div className="space-y-2">
                <h1 className="text-3xl text-black font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Transform Your Ideas Into Reality
                </h1>
                <p className="max-w-[600px] ml-auto text-violet-500 text-muted-foreground md:text-xl">
                  Expert software development services and comprehensive programming courses to help you succeed in the
                  digital world.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-end">
                <Link href="/inquiry">
                  <Button size="lg" className="gap-1">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button size="lg"  variant="outline">
                    Explore Courses
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Courses</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Comprehensive programming courses designed to help you master the latest technologies.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="bg-primary/10 h-24 flex items-center justify-center">
                  <h3 className="text-xl font-bold text-center px-4">{course.title}</h3>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4 line-clamp-3">{course.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{course.duration}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Link href="/courses">
              <Button variant="outline" size="lg" className="gap-1">
                View All Courses <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Projects</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Explore our portfolio of successful projects delivered to clients worldwide.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <Image
                  src={project.image_url || "/placeholder.svg?height=200&width=400"}
                  alt="projectimage"
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
          <div className="flex justify-center mt-10">
            <Link href="/portfolio">
              <Button variant="outline" size="lg" className="gap-1">
                View All Projects <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Companies We Worked With</h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Trusted by leading companies around the world.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {companies.map((company) => (
              <div key={company.id} className="flex items-center justify-center p-4">
                <Image
                  src={company.logo_url || "/placeholder.svg?height=60&width=120"}
                  alt="company.name"
                  width={120}
                  height={60}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chat Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatAssistant />
      </div>
    </div>
  )
}

