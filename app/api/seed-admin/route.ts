import { seedAdminUser } from "@/lib/seed-admin"
import { NextResponse } from "next/server"

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "This endpoint is only available in development mode" },
      { status: 403 }
    )
  }

  try {
    const result = await seedAdminUser()
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }
    
    return NextResponse.json({
      message: result.message,
      credentials: result.credentials,
    })
  } catch (error: any) {
    console.error("Error seeding admin:", error)
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 }
    )
  }
} 