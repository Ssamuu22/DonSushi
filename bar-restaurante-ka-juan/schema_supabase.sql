-- =========================================================================
-- ESQUEMA SQL PARA BAR RESTAURANTE KA JUAN (SUPABASE POSTGRESQL)
-- Ubicación: Sotillo de las Palomas (Toledo) - Sierra de San Vicente
-- =========================================================================

-- 1. Tabla principal de Reservas
CREATE TABLE IF NOT EXISTS reservas (
  id BIGSERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,             -- Formato: #KJ-XXXXXX (ej: #KJ-928104)
  nombre TEXT NOT NULL,                    -- Titular de la reserva
  telefono TEXT NOT NULL,                  -- Teléfono móvil / WhatsApp
  email TEXT NOT NULL,                     -- Email de confirmación
  fecha DATE NOT NULL,                     -- Fecha del servicio
  hora TEXT NOT NULL,                      -- Hora (ej: 14:30, 21:30)
  comensales INTEGER NOT NULL DEFAULT 2,   -- Número de personas
  zona TEXT NOT NULL DEFAULT 'Comedor de Sala Rústico', -- Comedor de Sala Rústico, Terraza Sierra de San Vicente, Zona de Barra & Tapeo
  experiencia TEXT DEFAULT 'Cena & Carnes Angus a la Brasa', -- Comida / Almuerzo, Cena & Carnes Angus, Tapeo & Raciones, Celebración
  alergias_notas TEXT DEFAULT '',          -- Peticiones, punto de la carne, alergias...
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índices de optimización
CREATE INDEX IF NOT EXISTS idx_reservas_kajuan_codigo ON reservas (codigo);
CREATE INDEX IF NOT EXISTS idx_reservas_kajuan_fecha ON reservas (fecha DESC);
CREATE INDEX IF NOT EXISTS idx_reservas_kajuan_estado ON reservas (estado);
CREATE INDEX IF NOT EXISTS idx_reservas_kajuan_telefono ON reservas (telefono);

-- 3. Seguridad de Nivel de Fila (RLS)
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acceso de servicio completo para reservas KA Juan" ON reservas;
CREATE POLICY "Acceso de servicio completo para reservas KA Juan" 
  ON reservas FOR ALL 
  USING (auth.role() = 'service_role');

-- 4. Inserción de reservas de muestra iniciales
INSERT INTO reservas (codigo, nombre, telefono, email, fecha, hora, comensales, zona, experiencia, alergias_notas, estado)
VALUES 
  ('#KJ-928104', 'Fernando Ramos', '605 98 12 34', 'fernando.ramos@gmail.com', CURRENT_DATE, '14:30', 4, 'Comedor de Sala Rústico', 'Cena & Carnes Angus a la Brasa', 'Chuletón de Angus al punto y croquetas caseras de rabo de toro. 1 comensal celiaco.', 'confirmada'),
  ('#KJ-481920', 'Lucía Sotomayor', '633 44 55 66', 'lucia.sotomayor@hotmail.com', CURRENT_DATE, '21:30', 2, 'Terraza Sierra de San Vicente', 'Tapeo Tradicional & Raciones', 'Mesa exterior con vistas a la Iglesia si el tiempo lo permite. Ración de saquitos de carrillera y torrijas.', 'pendiente'),
  ('#KJ-715492', 'Javier Morales', '619 22 33 44', 'j.morales@construcciones.es', CURRENT_DATE + 1, '14:00', 6, 'Comedor de Sala Rústico', 'Comida / Almuerzo de Temporada', 'Comida de amigos de ruta por la Sierra de San Vicente. Encargo de chuletones madurados.', 'confirmada')
ON CONFLICT (codigo) DO NOTHING;
