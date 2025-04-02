import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

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
  {
    id: 4,
    title: "Mobile App Development",
    description: "Build native mobile apps for iOS and Android using React Native.",
    duration: "10 weeks",
    price: 449,
    image_url: "/placeholder.svg?height=200&width=400&text=Mobile+Dev",
  },
  {
    id: 5,
    title: "UI/UX Design Principles",
    description: "Learn the fundamentals of user interface and experience design.",
    duration: "6 weeks",
    price: 349,
    image_url: "/placeholder.svg?height=200&width=400&text=UI/UX",
  },
  {
    id: 6,
    title: "DevOps & Cloud Engineering",
    description: "Master CI/CD pipelines, containerization, and cloud deployment.",
    duration: "8 weeks",
    price: 499,
    image_url: "/placeholder.svg?height=200&width=400&text=DevOps",
  },
]

// Fetch data from Supabase
async function getCourses() {
  try {
    // Use a relative URL
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

export default async function CoursesPage() {
  // Use fallback data if fetch fails
  let courses = fallbackCourses

  try {
    courses = await getCourses()
  } catch (error) {
    console.error("Error loading courses:", error)
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Courses</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Comprehensive programming courses designed to help you master the latest technologies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="overflow-hidden">
            <div className="bg-primary/10 h-24 flex items-center justify-center">
              <h3 className="text-xl font-bold text-center px-4">{course.title}</h3>
            </div>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">{course.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-medium">{course.duration}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

