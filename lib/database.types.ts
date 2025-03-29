export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: number
          title: string
          description: string
          duration: string
          price: number
          image_url: string
          created_at?: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          duration: string
          price: number
          image_url: string
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          duration?: string
          price?: number
          image_url?: string
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: number
          title: string
          description: string
          image_url: string
          technologies: string[]
          url: string | null
          created_at?: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          image_url: string
          technologies: string[]
          url?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          image_url?: string
          technologies?: string[]
          url?: string | null
          created_at?: string
        }
      }
      inquiries: {
        Row: {
          id: number
          name: string
          email: string
          subject: string
          message: string
          created_at?: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          subject: string
          message: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          subject?: string
          message?: string
          created_at?: string
        }
      }
      companies: {
        Row: {
          id: number
          name: string
          logo_url: string
          website: string | null
          created_at?: string
        }
        Insert: {
          id?: number
          name: string
          logo_url: string
          website?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          logo_url?: string
          website?: string | null
          created_at?: string
        }
      }
    }
  }
}

