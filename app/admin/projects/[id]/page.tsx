import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import ProjectForm from "@/components/admin/project-form"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database.types"
import { notFound } from "next/navigation"

// Fallback project data
const fallbackProject = {
  id: 0,
  title: "Sample Project",
  description: "This is a sample project",
  image_url: "/placeholder.svg", 
  technologies: ["Sample Technology"],
  url: null
}

// Validate project ID is numeric
function isValidProjectId(id: string): boolean {
  return /^\d+$/.test(id);
}

// Fetch project from the API
async function getProject(id: string) {
  try {
    // Validate ID is numeric first
    if (!isValidProjectId(id)) {
      console.error(`Invalid project ID: ${id} - must be numeric`);
      return null;
    }
    
    console.log(`Fetching project with ID ${id}`);
    
    // Try direct database query first with service role key (more reliable)
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log("Using direct Supabase query with service role key");
      
      const supabase = createClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();
        
      if (error) {
        console.error("Supabase error fetching project:", error);
      } else if (data) {
        console.log("Project found via direct Supabase query");
        return {
          ...data,
          technologies: Array.isArray(data.technologies) ? data.technologies : []
        };
      }
    }
    
    // Fallback to API endpoint
    console.log("Falling back to API endpoint");
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    const response = await fetch(`${baseUrl}/api/admin/projects/${id}`, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error("Error fetching project: HTTP", response.status);
      const errorText = await response.text();
      console.error("Error response:", errorText);
      return null;
    }

    const result = await response.json()
    
    if (!result.data) {
      console.error("No data returned from API");
      return null;
    }
    
    console.log("Project found via API:", result.data);
    
    // Ensure the technologies field is an array
    return {
      ...result.data,
      technologies: Array.isArray(result.data.technologies) ? result.data.technologies : []
    }
  } catch (error) {
    console.error("Error fetching project:", error)
    return null;
  }
}

interface EditProjectPageProps {
  params: {
    id: string;
  }
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  // Extract and validate ID
  const { id } = params;
  
  if (!isValidProjectId(id)) {
    notFound();
  }
  
  console.log("Rendering edit page for project ID:", id);
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/projects">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Edit Project</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <ProjectForm initialData={project} isEditing />
        </CardContent>
      </Card>
    </div>
  )
}

