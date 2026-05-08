-- ============ CRIAR TABELAS ENSALAMENTO ============

-- Tabela: rooms (Salas)
CREATE TABLE rooms (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  building TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: courses (Turmas)
CREATE TABLE courses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  professor TEXT NOT NULL,
  students INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: professors (Professores)
CREATE TABLE professors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabela: allocations (Alocações)
CREATE TABLE allocations (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL,
  room_id TEXT NOT NULL,
  semester TEXT NOT NULL,
  shift TEXT NOT NULL,
  weekday TEXT NOT NULL,
  start TEXT NOT NULL,
  end TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

-- ============ CRIAR ÍNDICES PARA PERFORMANCE ============

CREATE INDEX idx_allocations_room_semester_weekday 
  ON allocations(room_id, semester, weekday);

CREATE INDEX idx_allocations_course_id 
  ON allocations(course_id);

CREATE INDEX idx_courses_professor 
  ON courses(professor);

-- ============ HABILITAR REALTIME ============

-- Enable Realtime for rooms
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;

-- Enable Realtime for courses
ALTER PUBLICATION supabase_realtime ADD TABLE courses;

-- Enable Realtime for professors
ALTER PUBLICATION supabase_realtime ADD TABLE professors;

-- Enable Realtime for allocations
ALTER PUBLICATION supabase_realtime ADD TABLE allocations;

-- ============ DADOS INICIAIS (OPCIONAL) ============
-- Descomente se quiser inserir dados de exemplo

/*
INSERT INTO rooms (id, name, building, capacity) VALUES
('room-001', 'A1', 'Bloco A', 35),
('room-002', 'A2', 'Bloco A', 35),
('room-003', 'A3', 'Bloco A', 35),
('room-004', 'A12', 'Bloco A', 60),
('room-005', 'C12', 'Bloco C', 35),
('room-006', 'D1', 'Bloco D', 70);

INSERT INTO professors (id, name) VALUES
('prof-001', 'Prof. João Silva'),
('prof-002', 'Prof. Maria Santos'),
('prof-003', 'Prof. Pedro Oliveira');

INSERT INTO courses (id, name, professor, students) VALUES
('course-001', 'Cálculo I', 'Prof. João Silva', 45),
('course-002', 'Física Básica', 'Prof. Maria Santos', 50),
('course-003', 'Programação', 'Prof. Pedro Oliveira', 40);
*/
