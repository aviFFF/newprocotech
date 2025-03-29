import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react"

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
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/companies`, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("Failed to fetch companies:", res.status, res.statusText)
      return { companies: fallbackCompanies, error: true }
    }

    const data = await res.json()
    return {
      companies: Array.isArray(data) && data.length > 0 ? data : fallbackCompanies,
      error: false,
    }
  } catch (error) {
    console.error("Error fetching companies:", error)
    return {
      companies: fallbackCompanies,
      error: true,
    }
  }
}

export default async function CompaniesAdminPage() {
  // Use fallback data if fetch fails
  let companies = fallbackCompanies
  let error = false

  try {
    const result = await getCompanies()
    companies = result.companies
    error = result.error
  } catch (e) {
    console.error("Error loading companies:", e)
    error = true
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Partner Companies</h1>
        <Link href="/admin/companies/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Company
          </Button>
        </Link>
      </div>

      {error && (
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
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Card key={company.id} className="overflow-hidden">
                <div className="p-4 flex justify-center">
                  <Image
                    src={company.logo_url || "/placeholder.svg?height=60&width=120"}
                    alt={company.name}
                    width={120}
                    height={60}
                    className="object-contain"
                  />
                </div>
                <CardContent className="p-4 border-t">
                  <h3 className="font-bold text-center mb-2">{company.name}</h3>
                  <div className="flex justify-center space-x-2">
                    <Link href={`/admin/companies/${company.id}`}>
                      <Button variant="outline" size="sm">
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

