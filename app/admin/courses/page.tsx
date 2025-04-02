import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"
import CourseActions from "./course-actions"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"

// Mark the page as dynamically rendered
export const dynamic = "force-dynamic"

// Fallback courses data
const fallbackCourses = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description: "Learn HTML, CSS, and JavaScript to build modern websites.",
    duration: "8 weeks",
    price: 199.99
  },
  {
    id: 2,
    title: "React.js Masterclass",
    description: "Master React.js and build powerful single-page applications.",
    duration: "10 weeks",
    price: 299.99
  },
  {
    id: 3,
    title: "Full-Stack Development",
    description: "Become a full-stack developer with Node.js, Express, and MongoDB.",
    duration: "12 weeks",
    price: 399.99
  },
]

// In a real application, you would fetch this data from your database
async function getCourses() {
  try {
    // Initialize Supabase client
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    
    // Remove the order by created_at since it's causing issues
    const { data: courses, error } = await supabase
      .from("courses")
      .select("*")
    
    if (error) {
      console.error("Error fetching courses:", error)
      return fallbackCourses
    }
    
    return courses
  } catch (error) {
    console.error("Error in getCourses:", error)
    return fallbackCourses
  }
}

export default async function CoursesAdminPage() {
  const courses = await getCourses()
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Courses</h1>
        <Button asChild>
          <Link href="/admin/courses/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Course
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {courses.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No courses found</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Title</th>
                    <th className="text-left py-3 px-4 font-medium">Description</th>
                    <th className="text-left py-3 px-4 font-medium">Duration</th>
                    <th className="text-left py-3 px-4 font-medium">Price</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-b">
                      <td className="py-3 px-4">{course.title}</td>
                      <td className="py-3 px-4 max-w-xs truncate">{course.description}</td>
                      <td className="py-3 px-4">{course.duration}</td>
                      <td className="py-3 px-4">${course.price}</td>
                      <td className="py-3 px-4 text-right">
                        <CourseActions course={course} />
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

