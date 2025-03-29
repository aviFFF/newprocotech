import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import CourseForm from "@/components/admin/course-form"

// In a real application, you would fetch this data from your database
async function getCourse(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/courses/${id}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("Failed to fetch course:", res.status, res.statusText)
      return null
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching course:", error)
    return null
  }
}

export default async function EditCoursePage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id)

  if (!course) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/courses">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Courses
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Course not found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/courses">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Courses
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Course</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseForm initialData={course} isEditing />
        </CardContent>
      </Card>
    </div>
  )
}

