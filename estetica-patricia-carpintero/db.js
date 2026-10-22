const fs = require('fs');
const path = require('path');

let createClient = null;
try {
  createClient = require('@supabase/supabase-js').createClient;
} catch (e) {}

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
if (createClient && supabaseUrl && supabaseKey && !supabaseUrl.includes('TU_PROYECTO')) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ [BD] Conectado a Supabase PostgreSQL');
} else {
  console.log('ℹ️ [BD] Utilizando persistencia en archivo local reservas.json');
}

const LOCAL_DB_PATH = (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
  ? path.join('/tmp', 'reservas.json')
  : path.join(__dirname, 'reservas.json');

function leerReservasLocales() {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const hoyStr = new Date().toISOString().split('T')[0];
    const iniciales = [
      {
        id: 1,
        codigo: '#PC-749201',
        servicio: 'Maderoterapia Corporal Reductora',
        nombre: 'Laura Sánchez',
        telefono: '654 11 22 33',
        email: 'laura.s@gmail.com',
        fecha: hoyStr,
        hora: '10:30',
        notas: 'Primera sesión corporal, bono reductor',
        estado: 'confirmada',
        creadoEl: new Date().toISOString()
      },
      {
        id: 2,
        codigo: '#PC-381940',
        servicio: 'Higiene Facial Profunda con Punta de Diamante',
        nombre: 'Carmen Gómez',
        telefono: '678 44 55 66',
        email: 'carmen.g@hotmail.com',
        fecha: hoyStr,
        hora: '17:00',
        notas: 'Piel sensible con tendencia seca',
        estado: 'pendiente',
        creadoEl: new Date().toISOString()
      },
      {
        id: 3,
        codigo: '#PC-912834',
        servicio: 'Lifting de Pestañas con Tinte & Keratina',
        nombre: 'Sofía Ruiz',
        telefono: '612 99 88 77',
        email: 'sofia.ruiz@gmail.com',
        fecha: hoyStr,
        hora: '18:15',
        notas: 'Cita para antes de evento',
        estado: 'confirmada',
        creadoEl: new Date().toISOString()
      }
    ];
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(iniciales, null, 2), 'utf8');
    return iniciales;
  }
  try {
    const data = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
    return JSON.parse(data || '[]');
  } catch (e) {
    return [];
  }
}

function guardarReservasLocales(data) {
  fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = {
  get client() {
    return supabase;
  },

  async crearReserva(data) {
    const nuevaReserva = {
      codigo: data.codigo,
      servicio: data.servicio,
      nombre: data.nombre,
      telefono: data.telefono,
      email: data.email || '',
      fecha: data.fecha,
      hora: data.hora,
      notas: data.notas || '',
      estado: data.estado || 'pendiente',
      creadoEl: new Date().toISOString()
    };

    if (supabase) {
      const { data: insertada, error } = await supabase
        .from('reservas')
        .insert([nuevaReserva])
        .select()
        .single();
      if (error) throw error;
      return insertada;
    } else {
      const reservas = leerReservasLocales();
      nuevaReserva.id = reservas.length > 0 ? Math.max(...reservas.map(r => r.id || 0)) + 1 : 1;
      reservas.unshift(nuevaReserva);
      guardarReservasLocales(reservas);
      return nuevaReserva;
    }
  },

  async obtenerReservas(filtros = {}) {
    if (supabase) {
      let query = supabase.from('reservas').select('*').order('fecha', { ascending: false }).order('hora', { ascending: true });
      if (filtros.fecha) query = query.eq('fecha', filtros.fecha);
      if (filtros.estado) query = query.eq('estado', filtros.estado);
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    } else {
      let reservas = leerReservasLocales();
      if (filtros.fecha) {
        reservas = reservas.filter(r => r.fecha === filtros.fecha);
      }
      if (filtros.estado) {
        reservas = reservas.filter(r => r.estado === filtros.estado);
      }
      reservas.sort((a, b) => {
        if (a.fecha !== b.fecha) return b.fecha.localeCompare(a.fecha);
        return (a.hora || '').localeCompare(b.hora || '');
      });
      return reservas;
    }
  },

  async obtenerReservaPorCodigo(codigo) {
    if (supabase) {
      const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('codigo', codigo)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } else {
      const reservas = leerReservasLocales();
      return reservas.find(r => r.codigo === codigo) || null;
    }
  },

  async actualizarEstadoReserva(codigo, estado) {
    if (supabase) {
      const { data, error } = await supabase
        .from('reservas')
        .update({ estado })
        .eq('codigo', codigo)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const reservas = leerReservasLocales();
      const index = reservas.findIndex(r => r.codigo === codigo);
      if (index === -1) throw new Error('Reserva no encontrada');
      reservas[index].estado = estado;
      guardarReservasLocales(reservas);
      return reservas[index];
    }
  },

  async eliminarReserva(codigo) {
    if (supabase) {
      const { error } = await supabase
        .from('reservas')
        .delete()
        .eq('codigo', codigo);
      if (error) throw error;
      return true;
    } else {
      let reservas = leerReservasLocales();
      const inicial = reservas.length;
      reservas = reservas.filter(r => r.codigo !== codigo);
      if (reservas.length === inicial) throw new Error('Reserva no encontrada');
      guardarReservasLocales(reservas);
      return true;
    }
  }
};
