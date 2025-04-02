"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { ArrowRight, Check, Database } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function DatabaseSetupPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [tablesCreated, setTablesCreated] = useState(false)
  const { toast } = useToast()

  const createSQLTables = async () => {
    setIsCreating(true)

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create database tables")
      }

      setTablesCreated(true)
      toast({
        title: "Success",
        description: "Database tables created successfully",
      })
    } catch (error) {
      console.error("Error creating tables:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create database tables",
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Database Setup</h1>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Initialize Database</CardTitle>
            <CardDescription>
              Create the necessary tables in your Supabase database
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              This will create the following tables if they don&apos;t exist:
            </p>

            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Database className="h-4 w-4" /> <strong>projects</strong> - Store your portfolio projects
              </li>
              <li className="flex items-center gap-2">
                <Database className="h-4 w-4" /> <strong>courses</strong> - Store your available courses
              </li>
              <li className="flex items-center gap-2">
                <Database className="h-4 w-4" /> <strong>companies</strong> - Store company information
              </li>
              <li className="flex items-center gap-2">
                <Database className="h-4 w-4" /> <strong>inquiries</strong> - Store contact form submissions
              </li>
            </ul>

            {tablesCreated ? (
              <div className="mt-6 p-4 bg-green-50 text-green-700 rounded-md flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span>Tables created successfully!</span>
              </div>
            ) : (
              <div className="space-y-4">
                <Button onClick={createSQLTables} disabled={isCreating} className="mt-4">
                  {isCreating ? "Creating Tables..." : "Attempt Automatic Setup"}
                </Button>
                
                <div className="mt-6 border rounded-md p-4">
                  <h3 className="font-medium mb-2">Manual Setup</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If automatic setup fails, copy and run the following SQL in your Supabase SQL Editor:
                  </p>
                  <pre className="bg-secondary/50 p-4 rounded-md text-xs overflow-auto">
                    {`-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  technologies TEXT[] NOT NULL,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
                  </pre>
                </div>

                <div className="mt-6 border rounded-md p-4">
                  <h3 className="font-medium mb-2">Update Existing Tables</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    If you're seeing errors about missing columns, run this SQL to add them:
                  </p>
                  <pre className="bg-secondary/50 p-4 rounded-md text-xs overflow-auto">
                    {`-- Add technologies column to projects table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'projects' 
    AND column_name = 'technologies'
  ) THEN
    ALTER TABLE projects ADD COLUMN technologies TEXT[] DEFAULT '{}';
  END IF;
END
$$;`}
                  </pre>
                </div>
              </div>
            )}

            {tablesCreated && (
              <div className="mt-6">
                <p className="text-sm text-muted-foreground mb-4">
                  Your database is now set up! You can now continue to:
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/admin/projects">
                    <Button variant="outline" className="flex items-center gap-1">
                      Manage Projects <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                  <Link href="/admin/courses">
                    <Button variant="outline" className="flex items-center gap-1">
                      Manage Courses <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                  <Link href="/admin">
                    <Button variant="outline" className="flex items-center gap-1">
                      Admin Dashboard <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

