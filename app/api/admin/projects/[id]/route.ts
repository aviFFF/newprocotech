import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"
import type { Database } from "@/lib/database.types"

// Validate project ID is numeric
function isValidProjectId(id: string): boolean {
  return /^\d+$/.test(id);
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Extract ID first
  const { id } = params;
  
  try {
    // Validate ID is numeric
    if (!isValidProjectId(id)) {
      console.error(`Invalid project ID: ${id} - must be numeric`);
      return NextResponse.json({ 
        error: "Invalid project ID - must be numeric" 
      }, { status: 400 });
    }

    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase credentials")
      return NextResponse.json({ 
        error: "Database configuration not found" 
      }, { status: 500 })
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single()

      if (error) {
        console.error("Error fetching project:", error)
        
        // If the table doesn't exist, return useful error
        if (error.code === "42P01") {
          return NextResponse.json({ 
            error: "Projects table doesn't exist. Please run setup from admin/setup page" 
          }, { status: 500 })
        }
        
        return NextResponse.json({ 
          error: error.message || "Failed to fetch project" 
        }, { status: 500 })
      }

      if (!data) {
        return NextResponse.json({ 
          error: "Project not found" 
        }, { status: 404 })
      }

      // Ensure technologies is always an array
      let safeData = {
        ...data,
        technologies: Array.isArray(data.technologies) ? data.technologies : []
      }

      // Try to parse technologies if it's a string (sometimes Supabase returns JSON as string)
      if (typeof data.technologies === 'string') {
        try {
          safeData.technologies = JSON.parse(data.technologies)
        } catch (e) {
          console.warn("Could not parse technologies string:", e)
          safeData.technologies = []
        }
      }

      return NextResponse.json({ data: safeData })
    } catch (dbError) {
      console.error("Database error:", dbError)
      return NextResponse.json({ 
        error: "Database error when fetching project" 
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ 
      error: error.message || "Internal Server Error" 
    }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  // Extract ID first
  const { id } = params;
  
  try {
    // Validate ID is numeric
    if (!isValidProjectId(id)) {
      console.error(`Invalid project ID for deletion: ${id} - must be numeric`);
      return NextResponse.json({ 
        error: "Invalid project ID - must be numeric" 
      }, { status: 400 });
    }

    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Database configuration not found" }, { status: 500 })
    }

    const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) {
      console.error("Error deleting project:", error)
      return NextResponse.json({ error: error.message || "Failed to delete project" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  // Extract ID first
  const { id } = params;
  
  try {
    // Validate ID is numeric
    if (!isValidProjectId(id)) {
      console.error(`Invalid project ID for update: ${id} - must be numeric`);
      return NextResponse.json({ 
        error: "Invalid project ID - must be numeric" 
      }, { status: 400 });
    }
    
    console.log(`Updating project with ID ${id}`);
    
    // Parse the request body
    const requestText = await request.text();
    console.log('Request body:', requestText);
    
    let body;
    try {
      body = JSON.parse(requestText);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }
    
    const { title, description, image_url, technologies, url } = body

    console.log('Parsed request data:', { title, description, image_url, technologies, url });

    // Ensure technologies is an array, but don't require items
    let sanitizedTechnologies = [];
    if (Array.isArray(technologies)) {
      sanitizedTechnologies = technologies;
    } else if (typeof technologies === 'string') {
      try {
        const parsed = JSON.parse(technologies);
        if (Array.isArray(parsed)) {
          sanitizedTechnologies = parsed;
        }
      } catch (e) {
        // If technologies is a comma-separated string, try to split it
        sanitizedTechnologies = technologies.split(',').map(t => t.trim()).filter(Boolean);
      }
    }

    // Validate the request - only require title and description
    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 })
    }

    // Check if Supabase environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("Missing Supabase credentials");
      return NextResponse.json({ error: "Database configuration not found" }, { status: 500 })
    }

    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL, 
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )

    console.log('Updating project with data:', { 
      title, 
      description, 
      image_url: image_url || "/placeholder.svg?height=200&width=400", 
      technologies: sanitizedTechnologies,
      url: url || null 
    });

    try {
      // Try update with technologies array
      const { data, error } = await supabase
        .from("projects")
        .update({
          title,
          description,
          image_url: image_url || "/placeholder.svg?height=200&width=400",
          technologies: sanitizedTechnologies,
          url: url || null,
        })
        .eq("id", id)
        .select()

      if (error) {
        console.error("Error updating project:", error)
        
        // If the error is related to technologies, try without it
        if (error.message && (
          error.message.includes("technologies") && 
          (error.message.includes("column") || error.message.includes("schema"))
        )) {
          console.log("Trying update without technologies field");
          const { data: dataWithoutTech, error: errorWithoutTech } = await supabase
            .from("projects")
            .update({
              title,
              description,
              image_url: image_url || "/placeholder.svg?height=200&width=400",
              url: url || null,
            })
            .eq("id", id)
            .select()
            
          if (errorWithoutTech) {
            console.error("Error updating project without technologies:", errorWithoutTech);
            return NextResponse.json({ 
              error: errorWithoutTech.message || "Failed to update project" 
            }, { status: 500 })
          }
          
          return NextResponse.json({ 
            success: true, 
            data: dataWithoutTech?.[0] || null,
            message: "Project updated without technologies field" 
          })
        }
        
        return NextResponse.json({ error: error.message || "Failed to update project" }, { status: 500 })
      }

      console.log("Project updated successfully:", data);
      return NextResponse.json({ success: true, data: data[0] })
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json({ 
        error: "Database error when updating project" 
      }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}

