import { createClient } from '@supabase/supabase-js'
import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Check if Supabase environment variables are set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Supabase credentials not found" },
        { status: 500 }
      )
    }

    // Create a Supabase client with the service role key for admin operations
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
    
    // Create projects table
    try {
      const { error: projectsError } = await supabase
        .from('projects')
        .select('id')
        .limit(1)
      
      if (projectsError && projectsError.code === '42P01') {
        // Table doesn't exist, create it
        await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            cmd: `
              CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                image_url TEXT,
                technologies TEXT[] NOT NULL,
                url TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
              )
            `
          }),
        })
      } else {
        // Check if technologies column exists
        try {
          await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
              'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              cmd: `
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
                $$;
              `
            }),
          })
        } catch (alterError) {
          console.error("Error adding technologies column:", alterError)
        }
      }
    } catch (error) {
      console.error("Error creating projects table:", error)
    }
    
    // Create courses table
    try {
      const { error: coursesError } = await supabase
        .from('courses')
        .select('id')
        .limit(1)
      
      if (coursesError && coursesError.code === '42P01') {
        // Table doesn't exist, create it
        await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            cmd: `
              CREATE TABLE IF NOT EXISTS courses (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT NOT NULL,
                duration TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
              )
            `
          }),
        })
      }
    } catch (error) {
      console.error("Error creating courses table:", error)
    }
    
    // Create companies table
    try {
      const { error: companiesError } = await supabase
        .from('companies')
        .select('id')
        .limit(1)
      
      if (companiesError && companiesError.code === '42P01') {
        // Table doesn't exist, create it
        await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            cmd: `
              CREATE TABLE IF NOT EXISTS companies (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                logo_url TEXT,
                website TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
              )
            `
          }),
        })
      }
    } catch (error) {
      console.error("Error creating companies table:", error)
    }
    
    // Create inquiries table
    try {
      const { error: inquiriesError } = await supabase
        .from('inquiries')
        .select('id')
        .limit(1)
      
      if (inquiriesError && inquiriesError.code === '42P01') {
        // Table doesn't exist, create it
        await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            cmd: `
              CREATE TABLE IF NOT EXISTS inquiries (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
              )
            `
          }),
        })
      }
    } catch (error) {
      console.error("Error creating inquiries table:", error)
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Database tables have been created if they didn't exist already" 
    })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json(
      { 
        error: "Failed to set up database. You may need to create tables manually.",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
} 