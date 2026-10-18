-- ============================================================
-- Don Sushi · Esquema de Supabase (PostgreSQL) - Seguro e Idempotente
-- Copia y pega este script en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Tabla de Reservas
CREATE TABLE IF NOT EXISTS reservas (
  id BIGSERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  restaurante TEXT NOT NULL,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  fecha DATE NOT NULL,
  hora TEXT NOT NULL,
  personas INTEGER NOT NULL CHECK (personas > 0),
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada')),
  notas TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reservas_codigo ON reservas (codigo);
CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON reservas (fecha DESC);
CREATE INDEX IF NOT EXISTS idx_reservas_restaurante ON reservas (restaurante);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas (estado);

-- 2. Tabla de Platos (183 platos del menú)
CREATE TABLE IF NOT EXISTS platos (
  id INTEGER PRIMARY KEY,
  codigo_plato TEXT,
  categoria TEXT NOT NULL,
  titulo TEXT NOT NULL,
  imagen TEXT,
  activo BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_platos_categoria ON platos (categoria);
CREATE INDEX IF NOT EXISTS idx_platos_activo ON platos (activo);

-- 3. Habilitar Seguridad por Filas (Row Level Security - RLS)
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE platos ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de Acceso (elimina si ya existe y la recrea limpiamente)
DROP POLICY IF EXISTS "Acceso de servicio completo para reservas" ON reservas;
CREATE POLICY "Acceso de servicio completo para reservas" 
  ON reservas FOR ALL 
  USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Acceso de servicio completo para platos" ON platos;
CREATE POLICY "Acceso de servicio completo para platos" 
  ON platos FOR ALL 
  USING (auth.role() = 'service_role');
