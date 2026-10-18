const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Cargar variables de entorno locales si existe .env
if (fs.existsSync(path.join(__dirname, '.env'))) {
  const envConfig = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
  envConfig.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        process.env[key] = val;
      }
    }
  });
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey && !supabaseUrl.includes('TU_PROYECTO')) {
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.warn('⚠️ [DB] SUPABASE_URL o SUPABASE_SERVICE_KEY no configurados. Las operaciones fallarán si no se configuran.');
}

module.exports = {
  get client() {
    return supabase;
  },

  // 1. Crear Reserva
  async crearReserva(data) {
    if (!supabase) throw new Error('Cliente Supabase no configurado.');
    const insertPayload = {
      codigo: data.codigo,
      restaurante: data.restaurante,
      nombre: data.nombre,
      telefono: data.telefono,
      email: data.email,
      fecha: data.fecha,
      hora: data.hora,
      personas: parseInt(data.personas, 10),
      estado: data.estado || 'pendiente',
      notas: data.notas || ''
    };

    const { data: nuevaReserva, error } = await supabase
      .from('reservas')
      .insert(insertPayload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return nuevaReserva;
  },

  // 2. Obtener Reservas con filtros
  async obtenerReservas(filtros = {}) {
    if (!supabase) throw new Error('Cliente Supabase no configurado.');
    let query = supabase.from('reservas').select('*');

    if (filtros.restaurante) {
      query = query.ilike('restaurante', `%${filtros.restaurante}%`);
    }
    if (filtros.fecha) {
      query = query.eq('fecha', filtros.fecha);
    }
    if (filtros.estado) {
      query = query.eq('estado', filtros.estado);
    }

    query = query.order('fecha', { ascending: false }).order('hora', { ascending: false });

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  },

  // 3. Obtener Reserva por Código
  async obtenerReservaPorCodigo(codigo) {
    if (!supabase) throw new Error('Cliente Supabase no configurado.');
    const clean = codigo.trim().toUpperCase().replace('#', '');
    const { data, error } = await supabase
      .from('reservas')
      .select('*')
      .or(`codigo.eq.${clean},codigo.eq.#${clean}`)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  },

  // 4. Actualizar Estado
  async actualizarEstadoReserva(codigo, nuevoEstado) {
    if (!supabase) throw new Error('Cliente Supabase no configurado.');
    const clean = codigo.trim().toUpperCase().replace('#', '');
    const { data, error } = await supabase
      .from('reservas')
      .update({ estado: nuevoEstado })
      .or(`codigo.eq.${clean},codigo.eq.#${clean}`)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  // 5. Eliminar Reserva
  async eliminarReserva(codigo) {
    if (!supabase) throw new Error('Cliente Supabase no configurado.');
    const clean = codigo.trim().toUpperCase().replace('#', '');
    const { error } = await supabase
      .from('reservas')
      .delete()
      .or(`codigo.eq.${clean},codigo.eq.#${clean}`);

    if (error) throw new Error(error.message);
    return true;
  },

  // 6. Platos
  async obtenerPlatos(categoria, busqueda) {
    if (!supabase) throw new Error('Cliente Supabase no configurado.');
    let query = supabase.from('platos').select('*').eq('activo', true);

    if (categoria && categoria !== 'ALL') {
      query = query.eq('categoria', categoria);
    }
    if (busqueda) {
      query = query.or(`titulo.ilike.%${busqueda}%,categoria.ilike.%${busqueda}%`);
    }

    query = query.order('id', { ascending: true });

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data || [];
  },

  // 7. Estadísticas
  async obtenerEstadisticas() {
    if (!supabase) throw new Error('Cliente Supabase no configurado.');

    const [resTotal, resConf, resPend, resPlatos, resPersonas] = await Promise.all([
      supabase.from('reservas').select('*', { count: 'exact', head: true }),
      supabase.from('reservas').select('*', { count: 'exact', head: true }).eq('estado', 'confirmada'),
      supabase.from('reservas').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente'),
      supabase.from('platos').select('*', { count: 'exact', head: true }),
      supabase.from('reservas').select('personas')
    ]);

    const totalComensales = (resPersonas.data || []).reduce((acc, r) => acc + (r.personas || 0), 0);

    return {
      totalReservas: resTotal.count || 0,
      confirmadas: resConf.count || 0,
      pendientes: resPend.count || 0,
      totalComensales,
      totalPlatos: resPlatos.count || 0
    };
  }
};
