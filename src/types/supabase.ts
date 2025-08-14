export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      applications: {
        Row: {
          id: string
          user_id: string
          name: string
          phone: string
          email: string | null
          status: 'registered' | 'in_progress' | 'contacted' | 'rejected'
          source_id: string
          source: string
          date: string
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          phone: string
          email?: string | null
          status?: 'registered' | 'in_progress' | 'contacted' | 'rejected'
          source_id: string
          source: string
          date: string
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          phone?: string
          email?: string | null
          status?: 'registered' | 'in_progress' | 'contacted' | 'rejected'
          source_id?: string
          source?: string
          date?: string
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          title: string
          description: string
          content: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          content: string
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          content?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      sources: {
        Row: {
          id: string
          user_id: string
          name: string
          url: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          url?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          url?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_lessons: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          completed: boolean
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          user_id: string
          name: string
          username: string | null
          avatar: string | null
          requisites: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          username?: string | null
          avatar?: string | null
          requisites?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          username?: string | null
          avatar?: string | null
          requisites?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}