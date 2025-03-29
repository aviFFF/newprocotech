import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Trash2 } from "lucide-react"

// In a real application, you would fetch this data from your database
async function getInquiry(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/inquiries`, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error("Failed to fetch inquiry:", res.status, res.statusText)
      return null
    }

    return res.json()
  } catch (error) {
    console.error("Error fetching inquiry:", error)
    return null
  }
}

export default async function InquiryDetailPage({ params }: { params: { id: string } }) {
  const inquiry = await getInquiry(params.id)

  if (!inquiry) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/admin/inquiries">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inquiries
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Inquiry not found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/admin/inquiries">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Inquiries
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Inquiry Details</h1>
        </div>
        <Button variant="destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Inquiry
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{inquiry.subject}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Name</h3>
              <p>{inquiry.name}</p>
            </div>
            <div>
              <h3 className="font-medium">Email</h3>
              <p>{inquiry.email}</p>
            </div>
          </div>
          {inquiry.created_at && (
            <div>
              <h3 className="font-medium">Date</h3>
              <p>{new Date(inquiry.created_at).toLocaleString()}</p>
            </div>
          )}
          <div>
            <h3 className="font-medium">Message</h3>
            <p className="whitespace-pre-wrap">{inquiry.message}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

