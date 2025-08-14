export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          user_id: number;
          name: string;
          username: string | null;
          avatar: string | null;
          inn: string | null;
          corporate_card: string | null;
          account_number: string | null;
          bik: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: number;
          name: string;
          username?: string | null;
          avatar?: string | null;
          inn?: string | null;
          corporate_card?: string | null;
          account_number?: string | null;
          bik?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: number;
          name?: string;
          username?: string | null;
          avatar?: string | null;
          inn?: string | null;
          corporate_card?: string | null;
          account_number?: string | null;
          bik?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          user_id: number;
          full_name: string;
          phone: string;
          date: string;
          status: 'registered' | 'in_progress' | 'rejected' | 'contacted';
          source_id: string;
          comment: string | null;
          deleted: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: number;
          full_name: string;
          phone: string;
          date: string;
          status?: 'registered' | 'in_progress' | 'rejected' | 'contacted';
          source_id: string;
          comment?: string | null;
          deleted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: number;
          full_name?: string;
          phone?: string;
          date?: string;
          status?: 'registered' | 'in_progress' | 'rejected' | 'contacted';
          source_id?: string;
          comment?: string | null;
          deleted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      sources: {
        Row: {
          id: string;
          user_id: number;
          name: string;
          status: 'active' | 'moderation' | 'blocked';
          url: string | null;
          is_default: boolean;
          deleted: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: number;
          name: string;
          status?: 'active' | 'moderation' | 'blocked';
          url?: string | null;
          is_default?: boolean;
          deleted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: number;
          name?: string;
          status?: 'active' | 'moderation' | 'blocked';
          url?: string | null;
          is_default?: boolean;
          deleted?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      lessons: {
        Row: {
          id: string;
          title: string;
          description: string;
          duration: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          duration: string;
          content: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          duration?: string;
          content?: string;
          created_at?: string;
        };
      };
      user_lessons: {
        Row: {
          id: string;
          user_id: number;
          lesson_id: string;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: number;
          lesson_id: string;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: number;
          lesson_id?: string;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
}