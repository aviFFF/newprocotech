import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, BookOpen, FolderKanban, Building2 } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"

// Function to fetch dashboard stats from various APIs and databases
async function getDashboardStats() {
  try {
    // Initialize Supabase client
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Fetch inquiries count and recent inquiries
    const { data: inquiriesCount, error: inquiriesCountError } = await supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
    
    const { data: recentInquiries, error: recentInquiriesError } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    if (inquiriesCountError || recentInquiriesError) {
      console.error("Error fetching inquiries data:", inquiriesCountError || recentInquiriesError)
    }

    // Fetch courses count
    const { data: coursesCount, error: coursesCountError } = await supabase
      .from("courses")
      .select("*", { count: "exact", head: true })
    
    if (coursesCountError) {
      console.error("Error fetching courses data:", coursesCountError)
    }

    // Fetch projects count
    const { data: projectsCount, error: projectsCountError } = await supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
    
    if (projectsCountError) {
      console.error("Error fetching projects data:", projectsCountError)
    }

    // Fetch companies count
    const { data: companiesCount, error: companiesCountError } = await supabase
      .from("companies")
      .select("*", { count: "exact", head: true })
    
    if (companiesCountError) {
      console.error("Error fetching companies data:", companiesCountError)
    }

    // Format inquiries for display
    const formattedInquiries = recentInquiries ? recentInquiries.map(inquiry => ({
      id: inquiry.id,
      name: inquiry.name,
      email: inquiry.email,
      subject: inquiry.subject,
      date: new Date(inquiry.created_at || '').toISOString().split('T')[0]
    })) : []

    return {
      inquiries: inquiriesCount?.length || 0,
      courses: coursesCount?.length || 0,
      projects: projectsCount?.length || 0,
      companies: companiesCount?.length || 0,
      recentInquiries: formattedInquiries,
    }
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    // Return default values in case of error
    return {
      inquiries: 0,
      courses: 0,
      projects: 0,
      companies: 0,
      recentInquiries: [],
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Inquiries</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inquiries}</div>
            <p className="text-xs text-muted-foreground">Latest inquiries from users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.courses}</div>
            <p className="text-xs text-muted-foreground">Available courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.projects}</div>
            <p className="text-xs text-muted-foreground">Showcase projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Partner Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.companies}</div>
            <p className="text-xs text-muted-foreground">Business partnerships</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {stats.recentInquiries.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No inquiries found</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Subject</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentInquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="border-b">
                      <td className="py-3 px-4">{inquiry.name}</td>
                      <td className="py-3 px-4">{inquiry.email}</td>
                      <td className="py-3 px-4">{inquiry.subject}</td>
                      <td className="py-3 px-4">{inquiry.date}</td>
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

