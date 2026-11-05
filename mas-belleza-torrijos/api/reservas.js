const db = require('../db.js');
const auth = require('../auth.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  let rawCodigo = req.query.codigo || null;
  if (rawCodigo) {
    rawCodigo = rawCodigo.trim().toUpperCase();
    if (!rawCodigo.startsWith('#') && rawCodigo.startsWith('BEL-')) {
      rawCodigo = '#' + rawCodigo;
    }
  }

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
    if (req.method === 'GET' && rawCodigo) {
      const reserva = await db.obtenerReservaPorCodigo(rawCodigo);
      if (!reserva) return res.status(404).json({ error: 'Cita no encontrada con ese código' });
      return res.status(200).json(reserva);
    }

    // 2. Crear nueva cita (desde index.html o formulario web)
    if (req.method === 'POST') {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      if (!data.nombre || !data.telefono || !data.fecha || !data.hora) {
        return res.status(400).json({ error: 'Faltan campos requeridos (nombre, teléfono, fecha, hora)' });
      }
      if (!data.codigo) {
        data.codigo = '#BEL-' + Math.floor(100000 + Math.random() * 900000);
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
        error: 'Acceso no autorizado. Inicia sesión en el panel /admin de +Belleza'
      });
    }

    // 3. Listar reservas (Admin)
    if (req.method === 'GET') {
      const reservas = await db.obtenerReservas(req.query);
      return res.status(200).json(reservas);
    }

    // 4. Modificar estado o datos (Admin)
    if (req.method === 'PATCH') {
      const data = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const id = data.id || req.query.id;
      if (!id) return res.status(400).json({ error: 'Falta el ID de la reserva' });

      if (data.estado && Object.keys(data).length <= 2) {
        const updated = await db.actualizarEstadoReserva(id, data.estado);
        return res.status(200).json({ success: true, reserva: updated });
      } else {
        const updated = await db.actualizarReserva(id, data);
        return res.status(200).json({ success: true, reserva: updated });
      }
    }

    // 5. Eliminar reserva (Admin)
    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'Falta el ID de la reserva' });
      await db.eliminarReserva(id);
      return res.status(200).json({ success: true, message: 'Cita eliminada de la agenda' });
    }

    return res.status(405).json({ error: 'Método no soportado' });
  } catch (err) {
    console.error('Error en API Reservas +Belleza:', err);
    return res.status(500).json({ error: err.message || 'Error interno del servidor' });
  }
};
