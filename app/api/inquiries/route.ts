import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import type { Database } from "@/lib/database.types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate the request
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Skip the subject field to avoid schema cache issues
    try {
      // Insert without the problematic 'subject' field
      // Include subject info in the message field
      const combinedMessage = `Subject: ${subject}\n\n${message}`;
      
      const { data, error } = await supabase
        .from("inquiries")
        .insert([{ 
          name, 
          email, 
          message: combinedMessage
        }])
        .select()

      if (error) {
        console.error("Error submitting inquiry:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true, data: data[0] })
    } catch (error) {
      console.error("Unexpected database error:", error)
      return NextResponse.json({ 
        error: "Could not submit inquiry. Please try again later." 
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const page = parseInt(url.searchParams.get('page') || '1')
    const offset = (page - 1) * limit
    
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Get inquiries with pagination
    const { data: inquiries, error, count } = await supabase
      .from("inquiries")
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error("Error fetching inquiries:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Format the date for display and extract subject from message if needed
    const formattedInquiries = inquiries.map(inquiry => {
      // Try to extract subject from message if it's in the format "Subject: xxx\n\nActual message"
      let subject = "Inquiry";
      let processedMessage = inquiry.message;
      
      if (inquiry.message && inquiry.message.startsWith("Subject:")) {
        const parts = inquiry.message.split("\n\n");
        if (parts.length >= 2) {
          subject = parts[0].replace("Subject:", "").trim();
          processedMessage = parts.slice(1).join("\n\n");
        }
      }
      
      return {
        ...inquiry,
        subject: inquiry.subject || subject,
        message: processedMessage,
        date: new Date(inquiry.created_at || '').toISOString().split('T')[0]
      };
    });

    return NextResponse.json({ 
      success: true, 
      data: formattedInquiries,
      total: count,
      page,
      limit
    })
  } catch (error) {
    console.error("Unexpected error fetching inquiries:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

