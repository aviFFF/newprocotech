import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import CompanyForm from "@/components/admin/company-form"
import { notFound } from "next/navigation"

// In a real application, you would fetch this data from your database
async function getCompany(id: string) {
  try {
    // Check if this is the "add" route
    if (id === "add") {
      // Return null for add route - we'll handle this case separately
      return null
    }

    // Try to convert ID to number - handle error gracefully if not a valid number
    let companyId: number;
    try {
      companyId = parseInt(id);
      if (isNaN(companyId)) {
        console.error("Invalid company ID format:", id);
        return null;
      }
    } catch (e) {
      console.error("Error parsing company ID:", e);
      return null;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/companies/${companyId}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("Failed to fetch company:", res.status, res.statusText)
      return null
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching company:", error)
    return null
  }
}

export default async function EditCompanyPage({ params }: { params: { id: string } }) {
  // Special handling for "add" route
  if (params.id === "add") {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/companies">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Add New Company</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyForm isEditing={false} />
          </CardContent>
        </Card>
      </div>
    )
  }

  const company = await getCompany(params.id)

  if (!company) {
    return notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/companies">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Companies
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Company</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <CompanyForm initialData={company} isEditing />
        </CardContent>
      </Card>
    </div>
  )
}

