import { useEffect, useState, useCallback } from "react";
import { dbService } from "@/lib/db";
import type { Room, Course, Allocation, Professor } from "@/lib/scheduling";

export function useScheduling() {
  const [rooms, setRoomsState] = useState<Room[]>([]);
  const [courses, setCoursesState] = useState<Course[]>([]);
  const [allocations, setAllocationsState] = useState<Allocation[]>([]);
  const [professors, setProfessorsState] = useState<Professor[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const [roomsData, coursesData, allocationsData, professorsData] = await Promise.all([
        dbService.rooms.getAll(),
        dbService.courses.getAll(),
        dbService.allocations.getAll(),
        dbService.professors.getAll(),
      ]);
      setRoomsState(roomsData);
      setCoursesState(coursesData);
      setAllocationsState(allocationsData);
      setProfessorsState(professorsData);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();

    // Subscribe to real-time updates
    const roomsSub = dbService.rooms.subscribe(setRoomsState);
    const coursesSub = dbService.courses.subscribe(setCoursesState);
    const allocationsSub = dbService.allocations.subscribe(setAllocationsState);
    const professorsSub = dbService.professors.subscribe(setProfessorsState);

    setHydrated(true);

    return () => {
      roomsSub?.unsubscribe();
      coursesSub?.unsubscribe();
      allocationsSub?.unsubscribe();
      professorsSub?.unsubscribe();
    };
  }, [refresh]);

  return {
    rooms,
    courses,
    allocations,
    professors,
    hydrated,
    loading,
    setRooms: dbService.rooms.create,
    setCourses: dbService.courses.create,
    setAllocations: dbService.allocations.create,
    setProfessors: dbService.professors.create,
    refresh,
  };
}
