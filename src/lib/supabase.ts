import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://stewutteibgsgqpnbnqo.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '#42Tt10WeR6002';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Database = {
  public: {
    Tables: {
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
