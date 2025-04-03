"use client"
import Image from "next/image"
import { useState, useEffect } from "react"

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

export default function CoursesPage() {
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null)
  const [courses, setCourses] = useState(fallbackCourses)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const fetchedCourses = await getCourses()
        setCourses(fetchedCourses)
      } catch (error) {
        console.error("Error loading courses:", error)
      }
    }
    fetchCourses()
  }, [])

  const toggleCourse = (courseId: number) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId)
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
          <div key={course.id} className="card bg-white rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{course.title}</h3>
                <p className="text-gray-600 mt-2">{course.description}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-gray-600 font-medium">{course.duration}</span>
              <button 
                onClick={() => toggleCourse(course.id)}
                className="text-primary font-medium flex items-center"
              >
                {expandedCourse === course.id ? 'Show Less' : 'Learn More'}
                <svg 
                  className={`w-4 h-4 ml-1 transition-transform ${expandedCourse === course.id ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {expandedCourse === course.id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">What you'll learn:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Hands-on practical exercises
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Industry-relevant projects
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Certificate of completion
                  </li>
                </ul>
                <button className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors">
                  Enroll Now - ₹{course.price}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

