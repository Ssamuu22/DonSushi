-- Script DDL Idempotente para Supabase PostgreSQL
-- Centro de Estética +Belleza (Torrijos, Toledo)
-- Prefijo de Reservas Aislado: #BEL-XXXXXX

CREATE TABLE IF NOT EXISTS reservas (
  id BIGSERIAL PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  servicio TEXT NOT NULL,
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  fecha DATE NOT NULL,
  hora TEXT NOT NULL,
  notas TEXT DEFAULT '',
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'cancelada')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices de alto rendimiento para búsqueda y filtrado
CREATE INDEX IF NOT EXISTS idx_reservas_codigo ON reservas (codigo);
CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON reservas (fecha DESC);
CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas (estado);

-- Seguridad Row Level Security (RLS)
ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Acceso de servicio completo para reservas" ON reservas;
CREATE POLICY "Acceso de servicio completo para reservas" 
  ON reservas FOR ALL 
  USING (auth.role() = 'service_role');

-- Datos de demostración iniciales
INSERT INTO reservas (codigo, servicio, nombre, telefono, email, fecha, hora, notas, estado)
VALUES
  ('#BEL-102938', 'Higiene Facial Profunda Detox & Extracción', 'Carmen Sánchez', '625 11 22 33', 'carmen.sanchez@gmail.com', CURRENT_DATE, '11:00', 'Primera visita. Piel mixta con tendencia deshidratada.', 'confirmada'),
  ('#BEL-482910', 'Manicura Semipermanente Rusa & Refuerzo', 'Laura Morales', '633 44 55 66', 'laura.morales@yahoo.es', CURRENT_DATE, '17:30', 'Diseño elegante francesa difuminada baby boomer.', 'pendiente'),
  ('#BEL-839102', 'Radiofrecuencia Facial Efecto Lifting', 'Rosa María Torres', '677 88 99 00', 'rosamaria.torres@gmail.com', CURRENT_DATE + INTERVAL '1 day', '10:30', 'Sesión reafirmante de óvalo facial y cuello.', 'confirmada'),
  ('#BEL-627194', 'Lifting de Pestañas con Tinte & Queratina', 'Marta Delgado', '699 00 11 22', 'marta.delgado@outlook.es', CURRENT_DATE + INTERVAL '2 day', '12:00', 'Mirada definida natural.', 'confirmada')
ON CONFLICT (codigo) DO NOTHING;
