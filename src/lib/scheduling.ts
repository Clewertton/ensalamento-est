// Domain types & business logic for academic room scheduling.

export type Weekday =
  | "Segunda"
  | "Terça"
  | "Quarta"
  | "Quinta"
  | "Sexta"
  | "Sábado";

export const WEEKDAYS: Weekday[] = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export type Shift = "Matutino" | "Vespertino" | "Noturno";
export const SHIFTS: Shift[] = ["Matutino", "Vespertino", "Noturno"];

export type Status = "Pendente" | "Confirmado" | "Conflito";
export const STATUSES: Status[] = ["Pendente", "Confirmado", "Conflito"];

export interface Room {
  id: string;
  name: string;
  building: string;
  capacity: number;
}

export interface Course {
  id: string;
  name: string;
  professor: string;
  students: number;
}

export interface Professor {
  id: string;
  name: string;
}

export interface Allocation {
  id: string;
  courseId: string;
  roomId: string;
  semester: string; // e.g. "2026.1"
  shift: Shift;
  weekday: Weekday;
  start: string; // "HH:MM"
  end: string; // "HH:MM"
  status: Status;
  createdAt: string;
  confirmedAt?: string; // Data de confirmação
  notes?: string; // Notas para acompanhar movimentação
}

// ---------- Storage ----------

const KEYS = {
  rooms: "ens.rooms",
  courses: "ens.courses",
  allocations: "ens.allocations",
  professors: "ens.professors",
};

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("ens:changed", { detail: { key } }));
}

export const store = {
  getRooms: () => read<Room[]>(KEYS.rooms, []),
  setRooms: (v: Room[]) => write(KEYS.rooms, v),
  getCourses: () => read<Course[]>(KEYS.courses, []),
  setCourses: (v: Course[]) => write(KEYS.courses, v),
  getAllocations: () => read<Allocation[]>(KEYS.allocations, []),
  setAllocations: (v: Allocation[]) => write(KEYS.allocations, v),
  getProfessors: () => read<Professor[]>(KEYS.professors, []),
  setProfessors: (v: Professor[]) => write(KEYS.professors, v),
};

// ---------- Overlap logic ----------

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  const aS = toMinutes(aStart);
  const aE = toMinutes(aEnd);
  const bS = toMinutes(bStart);
  const bE = toMinutes(bEnd);
  if (aE <= aS || bE <= bS) return false;
  return aS < bE && bS < aE;
}

export interface ConflictCheck {
  conflict: boolean;
  conflictingWith?: Allocation;
}

export function findConflict(
  candidate: Pick<
    Allocation,
    "roomId" | "semester" | "weekday" | "start" | "end"
  >,
  allocations: Allocation[],
  ignoreId?: string,
): ConflictCheck {
  for (const a of allocations) {
    if (ignoreId && a.id === ignoreId) continue;
    if (
      a.roomId === candidate.roomId &&
      a.semester === candidate.semester &&
      a.weekday === candidate.weekday &&
      rangesOverlap(a.start, a.end, candidate.start, candidate.end)
    ) {
      return { conflict: true, conflictingWith: a };
    }
  }
  return { conflict: false };
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ---------- Seeding ----------

export function seedIfEmpty() {
  if (!isBrowser()) return;

  // Sempre garantir que há salas, mesmo se já existirem algumas
  const currentRooms = store.getRooms();
  if (currentRooms.length === 0) {
    const rooms: Room[] = [
      { id: uid(), name: "A1", building: "Bloco A", capacity: 35 },
      { id: uid(), name: "A2", building: "Bloco A", capacity: 35 },
      { id: uid(), name: "A3", building: "Bloco A", capacity: 35 },
      { id: uid(), name: "A4", building: "Bloco A", capacity: 35 },
      { id: uid(), name: "A5", building: "Bloco A", capacity: 35 },
      { id: uid(), name: "A6", building: "Bloco A", capacity: 35 },
      { id: uid(), name: "A7", building: "Bloco A", capacity: 35 },
      { id: uid(), name: "A8", building: "Bloco A", capacity: 35 },
      { id: uid(), name: "A12", building: "Bloco A", capacity: 60 },
      { id: uid(), name: "A13", building: "Bloco A", capacity: 50 },
      { id: uid(), name: "A14", building: "Bloco A", capacity: 60 },
      { id: uid(), name: "A16", building: "Bloco A", capacity: 40 },
      { id: uid(), name: "A17", building: "Bloco A", capacity: 40 },
      { id: uid(), name: "A18", building: "Bloco A", capacity: 40 },
      { id: uid(), name: "C9 - Monitoria", building: "Bloco C", capacity: 25 },
      { id: uid(), name: "C12", building: "Bloco C", capacity: 35 },
      { id: uid(), name: "C13", building: "Bloco C", capacity: 35 },
      { id: uid(), name: "C14", building: "Bloco C", capacity: 35 },
      { id: uid(), name: "C16", building: "Bloco C", capacity: 35 },
      { id: uid(), name: "C17", building: "Bloco C", capacity: 35 },
      { id: uid(), name: "C18", building: "Bloco C", capacity: 35 },
      {
        id: uid(),
        name: "C19 - Pós Graduação",
        building: "Bloco C",
        capacity: 35,
      },
      { id: uid(), name: "C22", building: "Bloco C", capacity: 35 },
      { id: uid(), name: "C23", building: "Bloco C", capacity: 35 },
      { id: uid(), name: "C24", building: "Bloco C", capacity: 35 },
      { id: uid(), name: "C25", building: "Bloco C", capacity: 35 },
      { id: uid(), name: "C26", building: "Bloco C", capacity: 35 },
      { id: uid(), name: "D1", building: "Bloco D", capacity: 70 },
      { id: uid(), name: "D2", building: "Bloco D", capacity: 45 },
      { id: uid(), name: "D3", building: "Bloco D", capacity: 45 },
      { id: uid(), name: "D4", building: "Bloco D", capacity: 45 },
      { id: uid(), name: "D5", building: "Bloco D", capacity: 60 },
      { id: uid(), name: "D6", building: "Bloco D", capacity: 45 },
      { id: uid(), name: "D7", building: "Bloco D", capacity: 45 },
      { id: uid(), name: "D8", building: "Bloco D", capacity: 45 },
      { id: uid(), name: "D9", building: "Bloco D", capacity: 45 },
    ];
    store.setRooms(rooms);
  }

  if (store.getProfessors().length === 0) {
    const uniqueNames = [
      ...new Set(store.getCourses().map((course) => course.professor)),
    ];
    const professors: Professor[] = uniqueNames.map((name) => ({
      id: uid(),
      name,
    }));
    store.setProfessors(professors);
  }
}
