import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import CoursesTable from "@/components/admin/courses-table"

// Mark the page as dynamically rendered
export const dynamic = "force-dynamic"

// Fallback courses data
const fallbackCourses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description: "Learn HTML, CSS, and JavaScript to build modern websites.",
    duration: "8 weeks",
  },
  {
    id: 2,
    title: "React.js Masterclass",
    description: "Master React.js and build powerful single-page applications.",
    duration: "10 weeks",
  },
  {
    id: 3,
    title: "Full-Stack Development",
    description: "Become a full-stack developer with Node.js, Express, and MongoDB.",
    duration: "12 weeks",
  },
]

// In a real application, you would fetch this data from your database
async function getCourses() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/courses`, {
      cache: "no-store",
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

export default async function CoursesAdminPage() {
  // Use fallback data if fetch fails
  let courses = fallbackCourses

  try {
    courses = await getCourses()
  } catch (error) {
    console.error("Error loading courses:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Courses</h1>
        <Link href="/admin/courses/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Course
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <CoursesTable initialCourses={courses} />
        </CardContent>
      </Card>
    </div>
  )
}

