import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'
import { cookies } from 'next/headers'

export const createServerSupabaseClient = () => {
  const cookieStore = cookies()
  
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false
      }
    }
  )
}

export const getAdminSession = async () => {
  const supabase = createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export const isAuthenticated = async () => {
  const session = await getAdminSession()
  return !!session
}

export const isAdmin = async () => {
  const session = await getAdminSession()
  
  if (!session) return false
  
  // Check for admin role in user metadata
  // Assuming your Supabase user has metadata with admin: true for admin users
  return session.user?.user_metadata?.role === 'admin'
} 