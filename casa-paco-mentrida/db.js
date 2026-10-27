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
  console.log('✅ [BD] Conectado a Supabase PostgreSQL (Bar Restaurante Casa Paco Méntrida)');
} else {
  console.log('ℹ️ [BD] Utilizando persistencia en archivo local reservas.json (Modo Autónomo)');
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
        codigo: '#CP-839201',
        nombre: 'Carlos Méndez',
        telefono: '635 12 34 56',
        email: 'carlos.mendez@gmail.com',
        fecha: hoyStr,
        hora: '14:30',
        comensales: 4,
        zona: 'Salón Comedor Principal',
        experiencia: 'Cena & Hamburguesas Gourmet',
        alergias_notas: 'Hamburguesas completas con patatas caseras y vino D.O. Méntrida. 1 persona celiaca.',
        estado: 'confirmada',
        creadoEl: new Date().toISOString()
      },
      {
        id: 2,
        codigo: '#CP-521943',
        nombre: 'Elena Gómez',
        telefono: '622 88 99 00',
        email: 'elena.gomez@outlook.es',
        fecha: hoyStr,
        hora: '21:30',
        comensales: 2,
        zona: 'Terraza Exterior de Verano',
        experiencia: 'Pizzas Artesanas & Tapeo',
        alergias_notas: 'Mesa tranquila en la terraza exterior. Ración de croquetas de jamón y pizza rústica.',
        estado: 'pendiente',
        creadoEl: new Date().toISOString()
      },
      {
        id: 3,
        codigo: '#CP-914028',
        nombre: 'David Serrano',
        telefono: '610 45 67 89',
        email: 'david.serrano@empresa.com',
        fecha: hoyStr,
        hora: '14:00',
        comensales: 6,
        zona: 'Salón Comedor Principal',
        experiencia: 'Almuerzo de Tapeo & Raciones',
        alergias_notas: 'Comida de amigos de fin de semana. Alitas a la barbacoa, patatas bravas y hamburguesas.',
        estado: 'confirmada',
        creadoEl: new Date().toISOString()
      },
      {
        id: 4,
        codigo: '#CP-372819',
        nombre: 'Patricia Barroso',
        telefono: '670 11 22 33',
        email: 'patricia.barroso@yahoo.es',
        fecha: hoyStr,
        hora: '21:00',
        comensales: 3,
        zona: 'Zona de Barra & Picoteo',
        experiencia: 'Tapeo & Vinos D.O. Méntrida',
        alergias_notas: 'Picoteo rápido, huevos rotos y tarta de queso casera.',
        estado: 'pendiente',
        creadoEl: new Date().toISOString()
      }
    ];
    try {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(iniciales, null, 2), 'utf8');
      return iniciales;
    } catch (e) {
      return iniciales;
    }
  }

  try {
    const raw = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error leyendo reservas.json:', err);
    return [];
  }
}

function guardarReservasLocales(reservas) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(reservas, null, 2), 'utf8');
  } catch (err) {
    console.error('Error guardando en reservas.json:', err);
  }
}

async function obtenerReservas(filtros = {}) {
  if (supabase) {
    let query = supabase.from('reservas').select('*').order('fecha', { ascending: false }).order('hora', { ascending: true });
    if (filtros.fecha) query = query.eq('fecha', filtros.fecha);
    if (filtros.estado && filtros.estado !== 'todos') query = query.eq('estado', filtros.estado);
    const { data, error } = await query;
    if (!error && data) return data;
  }

  let list = leerReservasLocales();
  if (filtros.fecha) {
    list = list.filter(r => r.fecha === filtros.fecha);
  }
  if (filtros.estado && filtros.estado !== 'todos') {
    list = list.filter(r => r.estado === filtros.estado);
  }
  if (filtros.search) {
    const q = filtros.search.toLowerCase();
    list = list.filter(r =>
      (r.nombre && r.nombre.toLowerCase().includes(q)) ||
      (r.telefono && r.telefono.includes(q)) ||
      (r.codigo && r.codigo.toLowerCase().includes(q)) ||
      (r.alergias_notas && r.alergias_notas.toLowerCase().includes(q))
    );
  }
  return list.sort((a, b) => (b.fecha > a.fecha ? 1 : -1));
}

async function obtenerReservaPorCodigo(codigo) {
  if (!codigo) return null;
  const cleanCodigo = codigo.startsWith('#') ? codigo : `#${codigo}`;

  if (supabase) {
    const { data, error } = await supabase.from('reservas').select('*').eq('codigo', cleanCodigo).single();
    if (!error && data) return data;
  }

  const list = leerReservasLocales();
  return list.find(r => r.codigo.toLowerCase() === cleanCodigo.toLowerCase()) || null;
}

async function crearReserva(reservaData) {
  const codigo = reservaData.codigo || ('#CP-' + Math.floor(100000 + Math.random() * 900000));
  const record = {
    codigo,
    nombre: reservaData.nombre || 'Comensal',
    telefono: reservaData.telefono || '',
    email: reservaData.email || '',
    fecha: reservaData.fecha,
    hora: reservaData.hora,
    comensales: parseInt(reservaData.comensales, 10) || 2,
    zona: reservaData.zona || 'Salón Comedor Principal',
    experiencia: reservaData.experiencia || 'Cena & Hamburguesas Gourmet',
    alergias_notas: reservaData.alergias_notas || '',
    estado: reservaData.estado || 'pendiente',
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('reservas').insert([record]).select().single();
      if (!error && data) {
        const localList = leerReservasLocales();
        localList.unshift(data);
        guardarReservasLocales(localList);
        return data;
      }
    } catch (e) {}
  }

  const list = leerReservasLocales();
  record.id = Date.now();
  record.creadoEl = new Date().toISOString();
  list.unshift(record);
  guardarReservasLocales(list);
  return record;
}

async function actualizarEstadoReserva(codigo, nuevoEstado) {
  const cleanCodigo = codigo.startsWith('#') ? codigo : `#${codigo}`;

  if (supabase) {
    const { data, error } = await supabase
      .from('reservas')
      .update({ estado: nuevoEstado })
      .eq('codigo', cleanCodigo)
      .select()
      .single();
    if (!error && data) {
      const list = leerReservasLocales();
      const idx = list.findIndex(r => r.codigo.toLowerCase() === cleanCodigo.toLowerCase());
      if (idx !== -1) {
        list[idx].estado = nuevoEstado;
        guardarReservasLocales(list);
      }
      return data;
    }
  }

  const list = leerReservasLocales();
  const idx = list.findIndex(r => r.codigo.toLowerCase() === cleanCodigo.toLowerCase());
  if (idx !== -1) {
    list[idx].estado = nuevoEstado;
    guardarReservasLocales(list);
    return list[idx];
  }
  return null;
}

async function eliminarReserva(codigo) {
  const cleanCodigo = codigo.startsWith('#') ? codigo : `#${codigo}`;

  if (supabase) {
    await supabase.from('reservas').delete().eq('codigo', cleanCodigo);
  }

  const list = leerReservasLocales();
  const filtradas = list.filter(r => r.codigo.toLowerCase() !== cleanCodigo.toLowerCase());
  guardarReservasLocales(filtradas);
  return true;
}

async function obtenerOcupacionMes(mesStr) {
  let list = [];
  if (supabase) {
    const inicio = `${mesStr}-01`;
    const fin = `${mesStr}-31`;
    const { data } = await supabase.from('reservas').select('fecha, comensales').gte('fecha', inicio).lte('fecha', fin).neq('estado', 'cancelada');
    if (data) list = data;
  }
  if (!list.length) {
    const locales = leerReservasLocales();
    list = locales.filter(r => r.fecha && r.fecha.startsWith(mesStr) && r.estado !== 'cancelada');
  }

  const ocupacionPorDia = {};
  list.forEach(r => {
    const dia = r.fecha;
    ocupacionPorDia[dia] = (ocupacionPorDia[dia] || 0) + (parseInt(r.comensales, 10) || 2);
  });
  return ocupacionPorDia;
}

async function obtenerHorasOcupadas(fechaStr) {
  let list = [];
  if (supabase) {
    const { data } = await supabase.from('reservas').select('hora, comensales').eq('fecha', fechaStr).neq('estado', 'cancelada');
    if (data) list = data;
  }
  if (!list.length) {
    const locales = leerReservasLocales();
    list = locales.filter(r => r.fecha === fechaStr && r.estado !== 'cancelada');
  }

  const horas = {};
  list.forEach(r => {
    if (r.hora) {
      horas[r.hora] = (horas[r.hora] || 0) + (parseInt(r.comensales, 10) || 2);
    }
  });
  return horas;
}

module.exports = {
  obtenerReservas,
  obtenerReservaPorCodigo,
  crearReserva,
  actualizarEstadoReserva,
  eliminarReserva,
  obtenerOcupacionMes,
  obtenerHorasOcupadas,
  leerReservasLocales
};
