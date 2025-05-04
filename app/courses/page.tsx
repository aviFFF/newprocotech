"use client"
import Image from "next/image"
import { useState, useEffect } from "react"

// Mark the page as dynamically rendered
export const dynamic = "force-dynamic"

// Define the Course interface
interface Course {
  id: number;
  title: string;
  description: string;
  duration: string;
  price: number;
  image_url: string;
  icon: string;
  features: string[];
  rating: string;
  level: string;
  tag: string;
}

// Hardcoded fallback data for courses
const fallbackCourses: Course[] = [
  {
    id: 1,
    title: "Web Development Fundamentals",
    description: "Learn HTML, CSS, and JavaScript to build modern websites and web applications from scratch.",
    duration: "8 weeks (64 hours)",
    price: 4999,
    image_url: "/placeholder.svg?height=200&width=400&text=Web+Dev",
    icon: "🌐",
    features: ["HTML & CSS Basics", "JavaScript Fundamentals", "Responsive Design", "Web Accessibility", "Project Deployment"],
    rating: "4.7/5",
    level: "Beginner",
    tag: "Frontend"
  },
  {
    id: 2,
    title: "React.js Masterclass",
    description: "Master React.js and build powerful single-page applications with modern JavaScript frameworks.",
    duration: "10 weeks (80 hours)",
    price: 5999,
    image_url: "/placeholder.svg?height=200&width=400&text=React",
    icon: "⚛️",
    features: ["React Fundamentals", "State Management", "Hooks API", "Performance Optimization", "React Router"],
    rating: "4.9/5",
    level: "Intermediate",
    tag: "JavaScript"
  },
  {
    id: 3,
    title: "Full-Stack Development",
    description: "Become a full-stack developer with Node.js, Express, and MongoDB to create complete web applications.",
    duration: "12 weeks (96 hours)",
    price: 7999,
    image_url: "/placeholder.svg?height=200&width=400&text=Full+Stack",
    icon: "🔋",
    features: ["Backend Development", "RESTful APIs", "Database Design", "Authentication", "Full-Stack Deployment"],
    rating: "4.8/5",
    level: "Advanced",
    tag: "Backend"
  },
  {
    id: 4,
    title: "Mobile App Development",
    description: "Build native mobile apps for iOS and Android using React Native with a single codebase.",
    duration: "10 weeks (80 hours)",
    price: 8999,
    image_url: "/placeholder.svg?height=200&width=400&text=Mobile+Dev",
    icon: "📱",
    features: ["React Native Basics", "Native APIs", "App Navigation", "State Management", "App Store Deployment"],
    rating: "4.6/5",
    level: "Intermediate",
    tag: "Mobile"
  },
  {
    id: 5,
    title: "UI/UX Design Principles",
    description: "Learn the fundamentals of user interface and experience design to create beautiful, user-friendly products.",
    duration: "6 weeks (48 hours)",
    price: 3999,
    image_url: "/placeholder.svg?height=200&width=400&text=UI/UX",
    icon: "🎨",
    features: ["Design Principles", "User Research", "Wireframing", "Prototyping", "Usability Testing"],
    rating: "4.7/5",
    level: "All Levels",
    tag: "Design"
  },
  {
    id: 6,
    title: "DevOps & Cloud Engineering",
    description: "Master CI/CD pipelines, containerization, and cloud deployment for modern application infrastructure.",
    duration: "8 weeks (64 hours)",
    price: 9999,
    image_url: "/placeholder.svg?height=200&width=400&text=DevOps",
    icon: "☁️",
    features: ["Docker", "Kubernetes", "CI/CD Pipelines", "Cloud Services", "Infrastructure as Code"],
    rating: "4.8/5",
    level: "Advanced",
    tag: "DevOps"
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
    
    // Convert the fetched data to match our interface
    const enhancedData = (Array.isArray(data) && data.length > 0 ? data : fallbackCourses).map((course: any) => {
      return {
        ...course,
        icon: course.icon || "📚",
        features: course.features || ["Course content not available"],
        rating: course.rating || "New",
        level: course.level || "All Levels",
        tag: course.tag || "Course",
      }
    })
    
    return enhancedData
  } catch (error) {
    console.error("Error fetching courses:", error)
    return fallbackCourses
  }
}

export default function CoursesPage() {
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null)
  const [courses, setCourses] = useState(fallbackCourses)

  // Color schemes for each course
  const colorSchemes = [
    {
      bgColor: "#dbeafe",
      accentColor: "#3b82f6",
      textColor: "#1e40af",
      buttonBg: "#3b82f6"
    },
    {
      bgColor: "#cffafe",
      accentColor: "#06b6d4",
      textColor: "#0e7490",
      buttonBg: "#0891b2"
    },
    {
      bgColor: "#dcfce7",
      accentColor: "#22c55e",
      textColor: "#166534",
      buttonBg: "#16a34a"
    },
    {
      bgColor: "#ffedd5",
      accentColor: "#f97316",
      textColor: "#9a3412",
      buttonBg: "#ea580c"
    },
    {
      bgColor: "#fce7f3",
      accentColor: "#ec4899",
      textColor: "#9d174d",
      buttonBg: "#db2777"
    },
    {
      bgColor: "#f3e8ff",
      accentColor: "#a855f7",
      textColor: "#6b21a8",
      buttonBg: "#9333ea"
    }
  ]

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
    if (expandedCourse === courseId) {
      setExpandedCourse(null)
    } else {
      setExpandedCourse(courseId)
    }
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Our Courses</h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl mx-auto">
          Comprehensive programming courses designed to help you master the latest technologies.
        </p>
      </div>

      <div className="space-y-16">
        {courses.map((course, index) => {
          const colorScheme = colorSchemes[index % colorSchemes.length];
          
          return (
            <section key={course.id} className="py-8">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row-reverse items-center">
                  <div className="md:w-1/2 mb-10 md:mb-0 md:pl-10">
                    <div className="relative">
                      <div 
                        className="absolute -top-6 -right-6 w-24 h-24 rounded-lg opacity-50"
                        style={{ backgroundColor: colorScheme.bgColor }}
                      ></div>
                      <div className="relative z-10 bg-white p-6 rounded-lg shadow-lg">
                        <div className="text-5xl mb-6">{course.icon}</div>
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">{course.title}</h2>
                        <p className="text-gray-600 mb-6">
                          {course.description}
                        </p>
                        <div className="mb-6">
                          <div className="flex items-center mb-2">
                            <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-medium">{course.rating}</span>
                            <span className="text-gray-500 ml-2">(85+ reviews)</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{course.duration}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                          <span 
                            className="px-3 py-1 rounded-full text-sm"
                            style={{ 
                              backgroundColor: colorScheme.bgColor, 
                              color: colorScheme.textColor
                            }}
                          >
                            {course.tag}
                          </span>
                          <span 
                            className="px-3 py-1 rounded-full text-sm"
                            style={{ 
                              backgroundColor: colorScheme.bgColor, 
                              color: colorScheme.textColor
                            }}
                          >
                            {course.level}
                          </span>
                        </div>
                        <button 
                          className="w-full text-white py-2 px-6 rounded-md transition-colors"
                          style={{ 
                            backgroundColor: colorScheme.buttonBg,
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.filter = 'brightness(0.9)'
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.filter = 'brightness(1)'
                          }}
                        >
                          Enroll Now - ₹{course.price}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2">
                    <h3 className="text-2xl font-bold mb-6 text-gray-900">What You'll Learn</h3>
                    <ul className="space-y-4">
                      {course.features.map((feature, idx) => (
                        <li key={idx} className="flex">
                          <div 
                            className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-1"
                            style={{ backgroundColor: colorScheme.bgColor }}
                          >
                            <svg 
                              className="w-4 h-4"
                              style={{ color: colorScheme.textColor }}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center mb-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                            style={{ backgroundColor: colorScheme.bgColor }}
                          >
                            <svg 
                              className="w-6 h-6"
                              style={{ color: colorScheme.textColor }}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <h4 className="font-bold">Hands-on Projects</h4>
                        </div>
                        <p className="text-gray-600 text-sm">Build real-world projects that you can add to your portfolio.</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center mb-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                            style={{ backgroundColor: colorScheme.bgColor }}
                          >
                            <svg 
                              className="w-6 h-6"
                              style={{ color: colorScheme.textColor }}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </div>
                          <h4 className="font-bold">Latest Technologies</h4>
                        </div>
                        <p className="text-gray-600 text-sm">Learn modern development tools and industry best practices.</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center mb-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                            style={{ backgroundColor: colorScheme.bgColor }}
                          >
                            <svg 
                              className="w-6 h-6"
                              style={{ color: colorScheme.textColor }}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <h4 className="font-bold">Career Support</h4>
                        </div>
                        <p className="text-gray-600 text-sm">Get guidance on building your portfolio and job preparation.</p>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex items-center mb-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                            style={{ backgroundColor: colorScheme.bgColor }}
                          >
                            <svg 
                              className="w-6 h-6"
                              style={{ color: colorScheme.textColor }}
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <h4 className="font-bold">Expert Mentors</h4>
                        </div>
                        <p className="text-gray-600 text-sm">Learn from industry professionals with years of experience.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  )
}

