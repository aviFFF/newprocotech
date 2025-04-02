import { createClient } from '@supabase/supabase-js'
import { NextResponse } from "next/server"

export async function POST() {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
      { error: "Missing environment variables for database connection" },
        { status: 500 }
      )
    }

  // Initialize Supabase admin client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    
  try {
    const errors = []
    
    // Direct REST API approach instead of RPC
    async function executeSql(sqlQuery: string, description: string) {
      try {
        // Use direct SQL approach
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
            'apikey': `${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
          } as HeadersInit,
          body: JSON.stringify({
            cmd: sqlQuery
          }),
        })
        
        if (!response.ok) {
          const error = await response.json()
          throw new Error(`Failed to execute SQL: ${error?.message || 'Unknown error'}`)
        }
        
        return { success: true }
      } catch (error) {
        console.error(`Error in ${description}:`, error)
        errors.push(`${description}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        return { success: false, error }
      }
    }

    // Create inquiries table
    await executeSql(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `, 'Creating inquiries table')
    
    // Create courses table
    await executeSql(`
              CREATE TABLE IF NOT EXISTS courses (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                duration TEXT NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `, 'Creating courses table')

    // Create projects table
    await executeSql(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        technologies TEXT[] DEFAULT '{}',
        url TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `, 'Creating projects table')
    
    // Create companies table
    await executeSql(`
              CREATE TABLE IF NOT EXISTS companies (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
        logo_url TEXT NOT NULL,
                website TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `, 'Creating companies table')

    // Add subject column to inquiries table if it doesn't exist
    await executeSql(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 
          FROM information_schema.columns 
          WHERE table_name = 'inquiries' 
          AND column_name = 'subject'
        ) THEN
          ALTER TABLE inquiries ADD COLUMN subject TEXT NOT NULL DEFAULT 'Inquiry';
        END IF;
      END
      $$;
    `, 'Adding subject column')

    // Refresh the schema cache to make sure newly added tables and columns are recognized
    try {
      // Try to refresh through direct API fetches
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/inquiries?limit=1`, {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
          'apikey': `${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
        } as HeadersInit
      })
      
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/courses?limit=1`, {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
          'apikey': `${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
        } as HeadersInit
      })
      
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/projects?limit=1`, {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
          'apikey': `${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
        } as HeadersInit
      })
      
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/companies?limit=1`, {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
          'apikey': `${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
        } as HeadersInit
      })
      
      console.log('Schema cache refresh attempts completed')
    } catch (refreshError) {
      console.error('Error refreshing schema cache:', refreshError)
      errors.push(`Schema refresh: ${refreshError instanceof Error ? refreshError.message : 'Unknown error'}`)
    }

    // Check which tables exist by direct API calls
    let existingTables = []
    
    try {
      // Check if inquiries table exists
      const inquiriesResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/inquiries?limit=1`, {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
          'apikey': `${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
        } as HeadersInit
      })
      if (inquiriesResponse.ok) existingTables.push('inquiries')
      
      // Check if courses table exists
      const coursesResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/courses?limit=1`, {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
          'apikey': `${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
        } as HeadersInit
      })
      if (coursesResponse.ok) existingTables.push('courses')
      
      // Check if projects table exists
      const projectsResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/projects?limit=1`, {
        headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
          'apikey': `${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
        } as HeadersInit
      })
      if (projectsResponse.ok) existingTables.push('projects')
      
      // Check if companies table exists
      const companiesResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/companies?limit=1`, {
          headers: {
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
          'apikey': `${process.env.SUPABASE_SERVICE_ROLE_KEY || ''}`,
        } as HeadersInit
      })
      if (companiesResponse.ok) existingTables.push('companies')
    } catch (checkError) {
      console.error('Error checking tables:', checkError)
      errors.push(`Table check: ${checkError instanceof Error ? checkError.message : 'Unknown error'}`)
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { 
          message: "Database setup completed with some errors",
          errors,
          tables: existingTables
        },
        { status: 207 } // Multi-Status
      )
    }

    return NextResponse.json(
      { 
        message: "Database tables created successfully",
        tables: existingTables
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error occurred" },
      { status: 500 }
    )
  }
} 