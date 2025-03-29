import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Trash2 } from "lucide-react"

// Mark the page as dynamically rendered
export const dynamic = "force-dynamic"

// In a real application, you would fetch this data from your database
async function getInquiries() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/inquiries`, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("Failed to fetch inquiries:", res.status, res.statusText)
      return []
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching inquiries:", error)
    return [] // Return empty array on error
  }
}

export default async function InquiriesPage() {
  const inquiries = await getInquiries()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Inquiries</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          {inquiries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Subject</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="border-b">
                      <td className="py-3 px-4">{inquiry.name}</td>
                      <td className="py-3 px-4">{inquiry.email}</td>
                      <td className="py-3 px-4">{inquiry.subject}</td>
                      <td className="py-3 px-4">
                        {inquiry.created_at ? new Date(inquiry.created_at).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link href={`/admin/inquiries/${inquiry.id}`}>
                            <Button variant="outline" size="icon">
                              <Eye className="h-4 w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </Link>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No inquiries found.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

