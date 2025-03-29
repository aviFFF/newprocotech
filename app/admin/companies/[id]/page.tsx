import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import CompanyForm from "@/components/admin/company-form"

// In a real application, you would fetch this data from your database
async function getCompany(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/companies/${id}`, {
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
  const company = await getCompany(params.id)

  if (!company) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/companies">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Company not found.</p>
          </CardContent>
        </Card>
      </div>
    )
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

