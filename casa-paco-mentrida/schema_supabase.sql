-- =========================================================================
-- ESQUEMA SQL PARA BAR RESTAURANTE CASA PACO (SUPABASE POSTGRESQL)
-- Ubicación: Av. Félix Arranz, 28, 45930 Méntrida (Toledo)
-- =========================================================================

-- 1. Tabla principal de Reservas
CREATE TABLE IF NOT EXISTS reservas (
  id BIGSERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,             -- Formato: #CP-XXXXXX (ej: #CP-839201)
  nombre TEXT NOT NULL,                    -- Titular de la reserva
  telefono TEXT NOT NULL,                  -- Teléfono móvil / WhatsApp
  email TEXT NOT NULL,                     -- Email de confirmación
  fecha DATE NOT NULL,                     -- Fecha del servicio
  hora TEXT NOT NULL,                      -- Hora (ej: 14:30, 21:30)
  comensales INTEGER NOT NULL DEFAULT 2,   -- Número de personas
  zona TEXT NOT NULL DEFAULT 'Salón Comedor Principal', -- Salón Comedor Principal, Terraza Exterior de Verano, Zona de Barra & Picoteo
  experiencia TEXT DEFAULT 'Cena & Hamburguesas Gourmet', -- Almuerzo de Tapeo, Cena & Hamburguesas Gourmet, Pizzas Artesanas, Desayuno de Campo, Celebración Familiar
  alergias_notas TEXT DEFAULT '',          -- Peticiones, puntos de carne, alergias...
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada', 'completada')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Índices de optimización
CREATE INDEX IF NOT EXISTS idx_reservas_casapaco_codigo ON reservas (codigo);
CREATE INDEX IF NOT EXISTS idx_reservas_casapaco_fecha ON reservas (fecha DESC);
CREATE INDEX IF NOT EXISTS idx_reservas_casapaco_estado ON reservas (estado);
CREATE INDEX IF NOT EXISTS idx_reservas_casapaco_telefono ON reservas (telefono);

-- 3. Seguridad de Nivel de Fila (RLS)
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acceso de servicio completo para reservas Casa Paco" ON reservas;
CREATE POLICY "Acceso de servicio completo para reservas Casa Paco" 
  ON reservas FOR ALL 
  USING (auth.role() = 'service_role');

-- 4. Inserción de reservas de muestra iniciales
INSERT INTO reservas (codigo, nombre, telefono, email, fecha, hora, comensales, zona, experiencia, alergias_notas, estado)
VALUES 
  ('#CP-839201', 'Carlos Méndez', '635 12 34 56', 'carlos.mendez@gmail.com', CURRENT_DATE, '14:30', 4, 'Salón Comedor Principal', 'Cena & Hamburguesas Gourmet', 'Hamburguesas completas con patatas caseras y vino D.O. Méntrida. 1 persona celiaca.', 'confirmada'),
  ('#CP-521943', 'Elena Gómez', '622 88 99 00', 'elena.gomez@outlook.es', CURRENT_DATE, '21:30', 2, 'Terraza Exterior de Verano', 'Pizzas Artesanas & Tapeo', 'Mesa tranquila en la terraza exterior. Ración de croquetas de jamón y pizza rústica.', 'pendiente'),
  ('#CP-914028', 'David Serrano', '610 45 67 89', 'david.serrano@empresa.com', CURRENT_DATE + 1, '14:00', 6, 'Salón Comedor Principal', 'Almuerzo de Tapeo & Raciones', 'Comida de amigos de fin de semana. Alitas a la barbacoa, patatas bravas y hamburguesas.', 'confirmada')
ON CONFLICT (codigo) DO NOTHING;
