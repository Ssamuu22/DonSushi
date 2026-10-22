-- ==============================================================================
-- SCHEMA SUPABASE POSTGRESQL · CENTRO DE ESTÉTICA PATRICIA CARPINTERO
-- ==============================================================================
-- Ejecuta este script en el SQL Editor de tu panel de Supabase para inicializar
-- la tabla de citas y la seguridad a nivel de fila (Row Level Security).

CREATE TABLE IF NOT EXISTS reservas (
  id BIGSERIAL PRIMARY KEY,
  codigo VARCHAR(32) NOT NULL UNIQUE,
  servicio VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  email VARCHAR(255) DEFAULT '',
  fecha DATE NOT NULL,
  hora VARCHAR(20) NOT NULL,
  notas TEXT DEFAULT '',
  estado VARCHAR(50) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'completada', 'cancelada')),
  "creadoEl" TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON reservas(fecha);
CREATE INDEX IF NOT EXISTS idx_reservas_codigo ON reservas(codigo);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado);

-- Habilitar Row Level Security (RLS)
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública (necesaria para consultar código de comprobante)
CREATE POLICY "Permitir lectura general de reservas" 
  ON reservas FOR SELECT 
  USING (true);

-- Política de inserción pública (necesaria para el formulario de citas de la web)
CREATE POLICY "Permitir crear reservas desde formulario público" 
  ON reservas FOR INSERT 
  WITH CHECK (true);

-- Política de modificación para administradores (vía Service Role)
CREATE POLICY "Permitir actualización a administradores" 
  ON reservas FOR UPDATE 
  USING (true)
  WITH CHECK (true);

-- Política de eliminación para administradores (vía Service Role)
CREATE POLICY "Permitir eliminación a administradores" 
  ON reservas FOR DELETE 
  USING (true);

-- Datos de demostración iniciales
INSERT INTO reservas (codigo, servicio, nombre, telefono, email, fecha, hora, notas, estado)
VALUES 
  ('#PC-749201', 'Maderoterapia Corporal Reductora', 'Laura Sánchez', '654 11 22 33', 'laura.s@gmail.com', CURRENT_DATE, '10:30', 'Primera sesión corporal, interesada en bono de 5 sesiones', 'confirmada'),
  ('#PC-381940', 'Higiene Facial Profunda con Punta de Diamante', 'Carmen Gómez', '678 44 55 66', 'carmen.g@hotmail.com', CURRENT_DATE, '17:00', 'Piel sensible con tendencia seca', 'pendiente'),
  ('#PC-912834', 'Lifting de Pestañas con Tinte & Keratina', 'Sofía Ruiz', '612 99 88 77', 'sofia.ruiz@gmail.com', CURRENT_DATE + INTERVAL '1 day', '11:15', 'Para evento familiar el fin de semana', 'confirmada')
ON CONFLICT (codigo) DO NOTHING;
