import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Database } from "lucide-react"

export default function SetupPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Database Setup</h1>
      </div>

      <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
        <CardContent className="p-4 flex items-start gap-2 mt-4">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
          <div>
            <p className="text-amber-800 dark:text-amber-300 font-medium">Database Tables Missing</p>
            <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
              One or more required database tables are missing. Follow the instructions below to create them in your
              Supabase project.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Setup Database Tables
          </CardTitle>
          <CardDescription>
            Run these SQL queries in your Supabase SQL Editor to create the necessary tables for the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="companies">
            <TabsList className="mb-4">
              <TabsTrigger value="companies">Companies</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            </TabsList>
            <TabsContent value="companies" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto">
                    {`-- Create companies table
CREATE TABLE IF NOT EXISTS public.companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow anonymous read access" 
  ON public.companies 
  FOR SELECT 
  USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated insert" 
  ON public.companies 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" 
  ON public.companies 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" 
  ON public.companies 
  FOR DELETE 
  USING (auth.role() = 'authenticated');`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="courses" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto">
                    {`-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow anonymous read access" 
  ON public.courses 
  FOR SELECT 
  USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated insert" 
  ON public.courses 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" 
  ON public.courses 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" 
  ON public.courses 
  FOR DELETE 
  USING (auth.role() = 'authenticated');`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto">
                    {`-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  technologies TEXT[] NOT NULL,
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow anonymous read access" 
  ON public.projects 
  FOR SELECT 
  USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated insert" 
  ON public.projects 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" 
  ON public.projects 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" 
  ON public.projects 
  FOR DELETE 
  USING (auth.role() = 'authenticated');`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inquiries" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <pre className="bg-slate-100 dark:bg-slate-800 p-4 rounded-md overflow-x-auto">
                    {`-- Create inquiries table
CREATE TABLE IF NOT EXISTS public.inquiries (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add RLS policies
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert access (for contact form)
CREATE POLICY "Allow anonymous insert" 
  ON public.inquiries 
  FOR INSERT 
  WITH CHECK (true);

-- Allow authenticated users to select/update/delete
CREATE POLICY "Allow authenticated select" 
  ON public.inquiries 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" 
  ON public.inquiries 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" 
  ON public.inquiries 
  FOR DELETE 
  USING (auth.role() = 'authenticated');`}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal pl-5 space-y-2">
            <li>
              Go to your{" "}
              <Link
                href="https://app.supabase.com"
                className="text-primary underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Supabase project dashboard
              </Link>
            </li>
            <li>Click on "SQL Editor" in the left sidebar</li>
            <li>Create a new query</li>
            <li>Copy and paste the SQL for the table you want to create</li>
            <li>Run the query</li>
            <li>Repeat for each table you need</li>
          </ol>
          <p className="text-muted-foreground">
            After creating the tables, your application will be able to store and retrieve data from the database. Until
            then, the application will use fallback data.
          </p>

          <div className="flex justify-center mt-6">
            <Link href="https://app.supabase.com" target="_blank" rel="noopener noreferrer">
              <Button className="gap-2">
                <Database className="h-4 w-4" />
                Open Supabase Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

