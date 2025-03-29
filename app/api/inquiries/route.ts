import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import type { Database } from "@/lib/database.types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate the request
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { data, error } = await supabase.from("inquiries").insert([{ name, email, subject, message }]).select()

    if (error) {
      console.error("Error submitting inquiry:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send notification email (would implement with a service like SendGrid or AWS SES)
    // This is a placeholder for the email notification functionality

    return NextResponse.json({ success: true, data: data[0] })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

