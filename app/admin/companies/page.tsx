import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, PlusCircle, AlertTriangle } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"
import CompanyActions from "./company-actions"

// Mark the page as dynamically rendered
export const dynamic = "force-dynamic"

// Fallback companies data
const fallbackCompanies = [
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
]

// In a real application, you would fetch this data from your database
async function getCompanies() {
  try {
    // Initialize Supabase client
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    
    const { data: companies, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (error) {
      console.error("Error fetching companies:", error)
      return []
    }
    
    return companies
  } catch (error) {
    console.error("Error in getCompanies:", error)
    return []
  }
}

export default async function CompaniesAdminPage() {
  const companies = await getCompanies()
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Partner Companies</h1>
        <Button asChild>
          <Link href="/admin/companies/add">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Company
          </Link>
        </Button>
      </div>

      {companies.length === 0 ? (
        <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
          <CardContent className="p-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <div>
              <p className="text-amber-800 dark:text-amber-300">
                The companies table doesn't exist in the database yet. You're seeing sample data.
              </p>
              <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
                Visit the{" "}
                <Link href="/admin/setup" className="underline font-medium">
                  Database Setup
                </Link>{" "}
                page for instructions on creating the necessary tables.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>All Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Logo</th>
                    <th className="text-left py-3 px-4 font-medium">Website</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map((company) => (
                    <tr key={company.id} className="border-b">
                      <td className="py-3 px-4">{company.name}</td>
                      <td className="py-3 px-4">
                        <img 
                          src={company.logo_url} 
                          alt={`${company.name} logo`}
                          className="h-10 w-auto object-contain"
                        />
                      </td>
                      <td className="py-3 px-4">
                        {company.website ? (
                          <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:underline">
                            {company.website}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <CompanyActions company={company} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

