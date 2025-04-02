import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

// Set up a fixed admin user
export async function seedAdminUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables')
    return { success: false, error: 'Missing environment variables' }
  }

  try {
    // Create a Supabase client with admin privileges
    const supabase = createClient<Database>(
      supabaseUrl,
      supabaseServiceKey
    )
    
    // Create a predefined admin user
    const adminEmail = 'admin@admin.com'
    const adminPassword = 'admin123'
    
    // Check if the admin user already exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('Error checking for existing admin:', listError)
      return { success: false, error: listError.message }
    }
    
    const adminExists = users.some(user => user.email === adminEmail)
    
    if (adminExists) {
      console.log('Admin user already exists, skipping creation')
      return { 
        success: true, 
        message: 'Admin user already exists', 
        credentials: { email: adminEmail, password: '(existing)' } 
      }
    }
    
    // Create the admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { role: 'admin' }
    })
    
    if (error) {
      console.error('Error creating admin user:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Created admin user:', data.user.email)
    return { 
      success: true, 
      message: 'Admin user created successfully', 
      credentials: { email: adminEmail, password: adminPassword } 
    }
  } catch (error: any) {
    console.error('Error seeding admin user:', error)
    return { success: false, error: error.message }
  }
} 