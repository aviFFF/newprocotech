import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"
import InquiryActions from "./inquiry-actions"

// Mark the page as dynamically rendered
export const dynamic = "force-dynamic"

async function getInquiries() {
  try {
    // Initialize Supabase client
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    
    const { data: inquiries, error } = await supabase
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
    
    if (error) {
      console.error("Error fetching inquiries:", error)
      return []
    }
    
    // Format inquiries
    return inquiries.map(inquiry => {
      // Process each inquiry to extract subject if needed
      let subject = inquiry.subject || "Inquiry";
      let message = inquiry.message;
      
      if (!inquiry.subject && inquiry.message && inquiry.message.startsWith("Subject:")) {
        const parts = inquiry.message.split("\n\n");
        if (parts.length >= 2) {
          subject = parts[0].replace("Subject:", "").trim();
          message = parts.slice(1).join("\n\n");
        }
      }
      
      return {
        ...inquiry,
        subject,
        message,
        date: new Date(inquiry.created_at || '').toISOString().split('T')[0]
      }
    })
  } catch (error) {
    console.error("Error in getInquiries:", error)
    return []
  }
}

export default async function InquiriesPage() {
  const inquiries = await getInquiries()
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Inquiries</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>All Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {inquiries.length === 0 ? (
              <p className="text-center py-4 text-muted-foreground">No inquiries found</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Email</th>
                    <th className="text-left py-3 px-4 font-medium">Subject</th>
                    <th className="text-left py-3 px-4 font-medium">Message</th>
                    <th className="text-left py-3 px-4 font-medium">Date</th>
                    <th className="text-right py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="border-b">
                      <td className="py-3 px-4">{inquiry.name}</td>
                      <td className="py-3 px-4">{inquiry.email}</td>
                      <td className="py-3 px-4">{inquiry.subject}</td>
                      <td className="py-3 px-4 max-w-xs truncate">{inquiry.message}</td>
                      <td className="py-3 px-4">{inquiry.date}</td>
                      <td className="py-3 px-4 text-right">
                        <InquiryActions inquiry={inquiry} />
                      </td>
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

