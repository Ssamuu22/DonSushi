const db = require('../db.js');
const auth = require('../auth.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { codigo } = req.query;

  try {
    // 0. CONSULTA PÚBLICA DE HORAS OCUPADAS PARA UNA FECHA
    if (req.method === 'GET' && req.query.fecha && req.query.horasOcupadas) {
      const horas = await db.obtenerHorasOcupadas(req.query.fecha);
      return res.status(200).json({ fecha: req.query.fecha, horasOcupadas: horas });
    }

    // 1. CONSULTA ESPECÍFICA DE CITA (Pública para clientes que tienen su código #PC-XXXXXX)
    if (req.method === 'GET' && codigo) {
      const reserva = await db.obtenerReservaPorCodigo(codigo);
      if (!reserva) return res.status(404).json({ error: 'Cita no encontrada' });
      return res.status(200).json(reserva);
    }

    // 2. CREAR CITA (Público para el formulario de reservas de index.html)
    if (req.method === 'POST') {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!data.nombre || !data.telefono || !data.fecha) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
      }
      if (!data.codigo) {
        data.codigo = '#PC-' + Math.floor(100000 + Math.random() * 900000);
      }
      const nueva = await db.crearReserva(data);
      return res.status(201).json({ success: true, reserva: nueva });
    }

    // =========================================================================
    // RUTAS ADMINISTRATIVAS PROTEGIDAS (Requieren Token de Administrador)
    // =========================================================================
    const token = auth.extraerTokenDeCabecera(req);
    const session = auth.verificarToken(token);

    if (!session) {
      return res.status(401).json({
        error: 'Acceso no autorizado. Inicia sesión como administrador en el panel.'
      });
    }

    // 3. OBTENER TODAS LAS RESERVAS (Solo Admin)
    if (req.method === 'GET') {
      const reservas = await db.obtenerReservas(req.query);
      return res.status(200).json(reservas);
    }

    // 4. ACTUALIZAR ESTADO DE RESERVA (Solo Admin)
    if (req.method === 'PATCH' && codigo) {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const actualizada = await db.actualizarEstadoReserva(codigo, body.estado);
      return res.status(200).json({ success: true, reserva: actualizada });
    }

    // 5. ELIMINAR RESERVA (Solo Admin)
    if (req.method === 'DELETE' && codigo) {
      await db.eliminarReserva(codigo);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Método no permitido' });
  } catch (error) {
    console.error('Error en /api/reservas:', error);
    return res.status(500).json({ error: error.message });
  }
};
