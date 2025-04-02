"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function DatabaseSetupPage() {
  const [isCreating, setIsCreating] = useState(false)
  const [status, setStatus] = useState<{
    inquiries?: 'success' | 'error' | 'pending';
    courses?: 'success' | 'error' | 'pending';
    projects?: 'success' | 'error' | 'pending';
    companies?: 'success' | 'error' | 'pending';
    message?: string;
  }>({})

  async function setupTables() {
    setIsCreating(true)
    setStatus({ 
      inquiries: 'pending',
      courses: 'pending',
      projects: 'pending',
      companies: 'pending'
    })

    try {
      const response = await fetch('/api/admin/setup', {
        method: 'POST',
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to set up database tables')
      }

      // Update status based on response
      setStatus({
        inquiries: data.tables.includes('inquiries') ? 'success' : 'error',
        courses: data.tables.includes('courses') ? 'success' : 'error',
        projects: data.tables.includes('projects') ? 'success' : 'error',
        companies: data.tables.includes('companies') ? 'success' : 'error',
        message: data.message,
      })
    } catch (error) {
      console.error('Error setting up database:', error)
      setStatus({
        inquiries: 'error',
        courses: 'error',
        projects: 'error',
        companies: 'error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Database Setup</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Initialize Database Tables</CardTitle>
          <CardDescription>
            Create or update the required tables in your Supabase database. This is needed for the admin dashboard to work correctly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border border-muted">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Inquiries Table</CardTitle>
                    {status.inquiries && (
                      <Badge variant={status.inquiries === 'success' ? 'default' : status.inquiries === 'pending' ? 'outline' : 'destructive'}>
                        {status.inquiries === 'success' ? 'Created' : status.inquiries === 'pending' ? 'Pending' : 'Failed'}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>Fields: id, name, email, subject, message, created_at</p>
                </CardContent>
              </Card>
              
              <Card className="border border-muted">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Courses Table</CardTitle>
                    {status.courses && (
                      <Badge variant={status.courses === 'success' ? 'default' : status.courses === 'pending' ? 'outline' : 'destructive'}>
                        {status.courses === 'success' ? 'Created' : status.courses === 'pending' ? 'Pending' : 'Failed'}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>Fields: id, title, description, duration, price, image_url, created_at</p>
                </CardContent>
              </Card>
              
              <Card className="border border-muted">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Projects Table</CardTitle>
                    {status.projects && (
                      <Badge variant={status.projects === 'success' ? 'default' : status.projects === 'pending' ? 'outline' : 'destructive'}>
                        {status.projects === 'success' ? 'Created' : status.projects === 'pending' ? 'Pending' : 'Failed'}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>Fields: id, title, description, image_url, technologies, url, created_at</p>
                </CardContent>
              </Card>
              
              <Card className="border border-muted">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base">Companies Table</CardTitle>
                    {status.companies && (
                      <Badge variant={status.companies === 'success' ? 'default' : status.companies === 'pending' ? 'outline' : 'destructive'}>
                        {status.companies === 'success' ? 'Created' : status.companies === 'pending' ? 'Pending' : 'Failed'}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="text-sm">
                  <p>Fields: id, name, logo_url, website, created_at</p>
                </CardContent>
              </Card>
            </div>
            
            {status.message && (
              <Alert variant={Object.values(status).includes('error') ? "destructive" : "default"}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{Object.values(status).includes('error') ? "Error" : "Success"}</AlertTitle>
                <AlertDescription>
                  {status.message}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={setupTables} disabled={isCreating} className="w-full">
            {isCreating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Setting Up Tables...
              </>
            ) : (
              'Initialize Database Tables'
            )}
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Database Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Required Tables</h3>
            <p className="text-muted-foreground">
              The admin dashboard requires the following tables in your Supabase database:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>inquiries - Store user inquiries submitted through the contact form</li>
              <li>courses - Manage course offerings</li>
              <li>projects - Showcase portfolio projects</li>
              <li>companies - List partner companies</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Manual Setup</h3>
            <p className="text-muted-foreground">
              If the automatic setup fails, you can create the tables manually in your Supabase dashboard:
            </p>
            <ol className="list-decimal pl-6 mt-2 space-y-1">
              <li>Log in to your Supabase project</li>
              <li>Go to the SQL editor</li>
              <li>Run the following SQL commands:</li>
            </ol>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto mt-2 text-xs">
              {`-- Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

