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
    // 0. Horas y Días ocupados para el calendario en vivo (Público)
    if (req.method === 'GET' && req.query.ocupacionMes) {
      const mapa = await db.obtenerOcupacionMes(req.query.ocupacionMes);
      return res.status(200).json({ mes: req.query.ocupacionMes, ocupacion: mapa });
    }

    if (req.method === 'GET' && req.query.fecha && req.query.horasOcupadas) {
      const horas = await db.obtenerHorasOcupadas(req.query.fecha);
      return res.status(200).json({ fecha: req.query.fecha, horasOcupadas: horas });
    }

    // 1. Consulta pública por código de reserva
    if (req.method === 'GET' && codigo) {
      const reserva = await db.obtenerReservaPorCodigo(codigo);
      if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' });
      return res.status(200).json(reserva);
    }

    // 2. Crear nueva reserva (desde index.html o formulario web)
    if (req.method === 'POST') {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!data.nombre || !data.telefono || !data.fecha || !data.hora) {
        return res.status(400).json({ error: 'Faltan campos obligatorios (nombre, teléfono, fecha, hora)' });
      }
      if (!data.codigo) {
        data.codigo = '#CP-' + Math.floor(100000 + Math.random() * 900000);
      }
      const nueva = await db.crearReserva(data);
      return res.status(201).json({ success: true, reserva: nueva });
    }

    // =========================================================================
    // RUTAS PRIVADAS ADMINISTRATIVAS
    // =========================================================================
    const token = auth.extraerTokenDeCabecera(req);
    const session = auth.verificarToken(token);

    if (!session) {
      return res.status(401).json({
        error: 'Acceso no autorizado. Inicia sesión en el panel /admin'
      });
    }

    // 3. Listar reservas (Admin)
    if (req.method === 'GET') {
      const reservas = await db.obtenerReservas(req.query);
      return res.status(200).json(reservas);
    }

    // 4. Actualizar estado (Admin)
    if (req.method === 'PATCH' && codigo) {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const actualizada = await db.actualizarEstadoReserva(codigo, body.estado);
      return res.status(200).json({ success: true, reserva: actualizada });
    }

    // 5. Eliminar reserva (Admin)
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
