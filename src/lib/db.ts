import { supabase } from './supabase';
import type { Allocation, Course, Professor, Room } from './scheduling';

export const dbService = {
  // ============ ROOMS ============
  rooms: {
    async getAll(): Promise<Room[]> {
      const { data, error } = await supabase
        .from('rooms')
        .select('id, name, building, capacity');
      if (error) {
        console.error('Error fetching rooms:', error);
        return [];
      }
      return data || [];
    },

    async create(room: Omit<Room, 'id'>): Promise<Room | null> {
      const { data, error } = await supabase
        .from('rooms')
        .insert([{ ...room, id: crypto.randomUUID() }])
        .select()
        .single();
      if (error) {
        console.error('Error creating room:', error);
        return null;
      }
      return data;
    },

    async update(id: string, updates: Partial<Room>): Promise<Room | null> {
      const { data, error } = await supabase
        .from('rooms')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.error('Error updating room:', error);
        return null;
      }
      return data;
    },

    async delete(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Error deleting room:', error);
        return false;
      }
      return true;
    },

    subscribe(callback: (rooms: Room[]) => void) {
      const channel = supabase
        .channel('rooms-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'rooms' },
          () => {
            dbService.rooms.getAll().then(callback);
          },
        )
        .subscribe();
      return channel;
    },
  },

  // ============ COURSES ============
  courses: {
    async getAll(): Promise<Course[]> {
      const { data, error } = await supabase
        .from('courses')
        .select('id, name, professor, students');
      if (error) {
        console.error('Error fetching courses:', error);
        return [];
      }
      return data || [];
    },

    async create(course: Omit<Course, 'id'>): Promise<Course | null> {
      const { data, error } = await supabase
        .from('courses')
        .insert([{ ...course, id: crypto.randomUUID() }])
        .select()
        .single();
      if (error) {
        console.error('Error creating course:', error);
        return null;
      }
      return data;
    },

    async update(id: string, updates: Partial<Course>): Promise<Course | null> {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        console.error('Error updating course:', error);
        return null;
      }
      return data;
    },

    async delete(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Error deleting course:', error);
        return false;
      }
      return true;
    },

    subscribe(callback: (courses: Course[]) => void) {
      const channel = supabase
        .channel('courses-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'courses' },
          () => {
            dbService.courses.getAll().then(callback);
          },
        )
        .subscribe();
      return channel;
    },
  },

  // ============ PROFESSORS ============
  professors: {
    async getAll(): Promise<Professor[]> {
      const { data, error } = await supabase
        .from('professors')
        .select('id, name');
      if (error) {
        console.error('Error fetching professors:', error);
        return [];
      }
      return data || [];
    },

    async create(professor: Omit<Professor, 'id'>): Promise<Professor | null> {
      const { data, error } = await supabase
        .from('professors')
        .insert([{ ...professor, id: crypto.randomUUID() }])
        .select()
        .single();
      if (error) {
        console.error('Error creating professor:', error);
        return null;
      }
      return data;
    },

    async delete(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('professors')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Error deleting professor:', error);
        return false;
      }
      return true;
    },

    subscribe(callback: (professors: Professor[]) => void) {
      const channel = supabase
        .channel('professors-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'professors' },
          () => {
            dbService.professors.getAll().then(callback);
          },
        )
        .subscribe();
      return channel;
    },
  },

  // ============ ALLOCATIONS ============
  allocations: {
    async getAll(): Promise<Allocation[]> {
      const { data, error } = await supabase
        .from('allocations')
        .select('*');
      if (error) {
        console.error('Error fetching allocations:', error);
        return [];
      }
      return (data || []).map((row: any) => ({
        id: row.id,
        courseId: row.course_id,
        roomId: row.room_id,
        semester: row.semester,
        shift: row.shift,
        weekday: row.weekday,
        start: row.start,
        end: row.end,
        status: row.status,
        createdAt: row.created_at,
        confirmedAt: row.confirmed_at,
        notes: row.notes,
      }));
    },

    async create(allocations: Allocation[]): Promise<Allocation[] | null> {
      const rows = allocations.map((a) => ({
        id: a.id,
        course_id: a.courseId,
        room_id: a.roomId,
        semester: a.semester,
        shift: a.shift,
        weekday: a.weekday,
        start: a.start,
        end: a.end,
        status: a.status,
        created_at: a.createdAt,
        confirmed_at: a.confirmedAt || null,
        notes: a.notes || null,
      }));

      const { data, error } = await supabase
        .from('allocations')
        .insert(rows)
        .select();

      if (error) {
        console.error('Error creating allocations:', error);
        return null;
      }

      return (data || []).map((row: any) => ({
        id: row.id,
        courseId: row.course_id,
        roomId: row.room_id,
        semester: row.semester,
        shift: row.shift,
        weekday: row.weekday,
        start: row.start,
        end: row.end,
        status: row.status,
        createdAt: row.created_at,
        confirmedAt: row.confirmed_at,
        notes: row.notes,
      }));
    },

    async update(id: string, updates: Partial<Allocation>): Promise<Allocation | null> {
      const row: any = {};
      if (updates.courseId) row.course_id = updates.courseId;
      if (updates.roomId) row.room_id = updates.roomId;
      if (updates.semester) row.semester = updates.semester;
      if (updates.shift) row.shift = updates.shift;
      if (updates.weekday) row.weekday = updates.weekday;
      if (updates.start) row.start = updates.start;
      if (updates.end) row.end = updates.end;
      if (updates.status) row.status = updates.status;
      if (updates.confirmedAt !== undefined) row.confirmed_at = updates.confirmedAt;
      if (updates.notes !== undefined) row.notes = updates.notes;

      const { data, error } = await supabase
        .from('allocations')
        .update(row)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating allocation:', error);
        return null;
      }

      return {
        id: data.id,
        courseId: data.course_id,
        roomId: data.room_id,
        semester: data.semester,
        shift: data.shift,
        weekday: data.weekday,
        start: data.start,
        end: data.end,
        status: data.status,
        createdAt: data.created_at,
        confirmedAt: data.confirmed_at,
        notes: data.notes,
      };
    },

    async delete(id: string): Promise<boolean> {
      const { error } = await supabase
        .from('allocations')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Error deleting allocation:', error);
        return false;
      }
      return true;
    },

    subscribe(callback: (allocations: Allocation[]) => void) {
      const channel = supabase
        .channel('allocations-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'allocations' },
          () => {
            dbService.allocations.getAll().then(callback);
          },
        )
        .subscribe();
      return channel;
    },
  },
};
