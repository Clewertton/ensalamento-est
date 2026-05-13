import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Add them to .env.local.',
  );
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'user';
          created_at: string;
          invited_by: string | null;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      invites: {
        Row: {
          id: string;
          email: string;
          code: string;
          created_by: string;
          used: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['invites']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['invites']['Insert']>;
      };
      rooms: {
        Row: {
          id: string;
          name: string;
          building: string;
          capacity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['rooms']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['rooms']['Insert']>;
      };
      courses: {
        Row: {
          id: string;
          name: string;
          professor: string;
          students: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['courses']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['courses']['Insert']>;
      };
      professors: {
        Row: {
          id: string;
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['professors']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['professors']['Insert']>;
      };
      allocations: {
        Row: {
          id: string;
          course_id: string;
          room_id: string;
          semester: string;
          shift: string;
          weekday: string;
          start: string;
          end: string;
          status: string;
          created_at: string;
          confirmed_at: string | null;
          notes: string | null;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['allocations']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['allocations']['Insert']>;
      };
    };
  };
};
