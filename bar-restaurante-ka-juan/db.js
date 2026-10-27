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
  console.log('✅ [BD] Conectado a Supabase PostgreSQL (Bar Restaurante KA Juan)');
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
        codigo: '#KJ-928104',
        nombre: 'Fernando Ramos',
        telefono: '605 98 12 34',
        email: 'fernando.ramos@gmail.com',
        fecha: hoyStr,
        hora: '14:30',
        comensales: 4,
        zona: 'Comedor de Sala Rústico',
        experiencia: 'Cena & Carnes Angus a la Brasa',
        alergias_notas: 'Chuletón de Angus al punto y croquetas caseras de rabo de toro. 1 comensal celiaco.',
        estado: 'confirmada',
        creadoEl: new Date().toISOString()
      },
      {
        id: 2,
        codigo: '#KJ-481920',
        nombre: 'Lucía Sotomayor',
        telefono: '633 44 55 66',
        email: 'lucia.sotomayor@hotmail.com',
        fecha: hoyStr,
        hora: '21:30',
        comensales: 2,
        zona: 'Terraza Sierra de San Vicente',
        experiencia: 'Tapeo Tradicional & Raciones',
        alergias_notas: 'Mesa exterior con vistas a la Iglesia si el tiempo lo permite. Ración de saquitos de carrillera y torrijas.',
        estado: 'pendiente',
        creadoEl: new Date().toISOString()
      },
      {
        id: 3,
        codigo: '#KJ-715492',
        nombre: 'Javier Morales',
        telefono: '619 22 33 44',
        email: 'j.morales@construcciones.es',
        fecha: hoyStr,
        hora: '14:00',
        comensales: 6,
        zona: 'Comedor de Sala Rústico',
        experiencia: 'Comida / Almuerzo de Temporada',
        alergias_notas: 'Comida de amigos de ruta por la Sierra de San Vicente. Encargo de chuletones madurados.',
        estado: 'confirmada',
        creadoEl: new Date().toISOString()
      },
      {
        id: 4,
        codigo: '#KJ-390158',
        nombre: 'Carmen Herranz',
        telefono: '654 11 22 33',
        email: 'carmen.herranz@yahoo.es',
        fecha: hoyStr,
        hora: '21:00',
        comensales: 3,
        zona: 'Zona de Barra & Tapeo',
        experiencia: 'Tapeo Tradicional & Raciones',
        alergias_notas: 'Tapeo variado, croquetas de chipirón y vino de la zona.',
        estado: 'pendiente',
        creadoEl: new Date().toISOString()
      }
    ];
    try {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(iniciales, null, 2), 'utf8');
    } catch (e) {}
    return iniciales;
  }
  try {
    const data = fs.readFileSync(LOCAL_DB_PATH, 'utf8');
    return JSON.parse(data || '[]');
  } catch (e) {
    return [];
  }
}

function guardarReservasLocales(reservas) {
  try {
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(reservas, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Error escribiendo en BD local:', e);
    return false;
  }
}

async function obtenerReservas(filtros = {}) {
  if (supabase) {
    let query = supabase.from('reservas').select('*').order('fecha', { ascending: false }).order('hora', { ascending: true });
    if (filtros.fecha) query = query.eq('fecha', filtros.fecha);
    if (filtros.estado && filtros.estado !== 'todos') query = query.eq('estado', filtros.estado);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  let lista = leerReservasLocales();
  if (filtros.fecha) {
    lista = lista.filter(r => r.fecha === filtros.fecha);
  }
  if (filtros.estado && filtros.estado !== 'todos') {
    lista = lista.filter(r => r.estado === filtros.estado);
  }
  if (filtros.busqueda) {
    const q = filtros.busqueda.toLowerCase();
    lista = lista.filter(r => 
      (r.nombre && r.nombre.toLowerCase().includes(q)) ||
      (r.codigo && r.codigo.toLowerCase().includes(q)) ||
      (r.telefono && r.telefono.includes(q)) ||
      (r.email && r.email.toLowerCase().includes(q)) ||
      (r.zona && r.zona.toLowerCase().includes(q))
    );
  }
  return lista;
}

async function obtenerReservaPorCodigo(codigo) {
  if (!codigo) return null;
  const codNormalizado = codigo.startsWith('#') ? codigo : `#${codigo}`;
  
  if (supabase) {
    const { data, error } = await supabase.from('reservas').select('*').eq('codigo', codNormalizado).single();
    if (error && error.code !== 'PGRST116') throw error;
    return data || null;
  }

  const lista = leerReservasLocales();
  return lista.find(r => r.codigo.toUpperCase() === codNormalizado.toUpperCase()) || null;
}

async function crearReserva(datos) {
  const codigo = datos.codigo || `#KJ-${Math.floor(100000 + Math.random() * 900000)}`;
  const comensales = parseInt(datos.comensales || datos.personas || 2, 10);
  const nuevaReserva = {
    codigo,
    nombre: (datos.nombre || '').trim(),
    telefono: (datos.telefono || '').trim(),
    email: (datos.email || '').trim(),
    fecha: datos.fecha,
    hora: datos.hora,
    comensales: isNaN(comensales) ? 2 : comensales,
    zona: datos.zona || 'Comedor de Sala Rústico',
    experiencia: datos.experiencia || 'Cena & Carnes Angus a la Brasa',
    alergias_notas: datos.alergias_notas || datos.notas || '',
    estado: datos.estado || 'pendiente'
  };

  if (supabase) {
    const { data, error } = await supabase.from('reservas').insert([nuevaReserva]).select().single();
    if (error) throw error;
    return data;
  }

  const lista = leerReservasLocales();
  nuevaReserva.id = Date.now();
  nuevaReserva.creadoEl = new Date().toISOString();
  lista.unshift(nuevaReserva);
  guardarReservasLocales(lista);
  return nuevaReserva;
}

async function actualizarEstadoReserva(codigo, estado) {
  const codNormalizado = codigo.startsWith('#') ? codigo : `#${codigo}`;
  if (supabase) {
    const { data, error } = await supabase.from('reservas').update({ estado }).eq('codigo', codNormalizado).select().single();
    if (error) throw error;
    return data;
  }

  const lista = leerReservasLocales();
  const idx = lista.findIndex(r => r.codigo.toUpperCase() === codNormalizado.toUpperCase());
  if (idx === -1) return null;
  lista[idx].estado = estado;
  guardarReservasLocales(lista);
  return lista[idx];
}

async function eliminarReserva(codigo) {
  const codNormalizado = codigo.startsWith('#') ? codigo : `#${codigo}`;
  if (supabase) {
    const { error } = await supabase.from('reservas').delete().eq('codigo', codNormalizado);
    if (error) throw error;
    return true;
  }

  let lista = leerReservasLocales();
  lista = lista.filter(r => r.codigo.toUpperCase() !== codNormalizado.toUpperCase());
  guardarReservasLocales(lista);
  return true;
}

async function obtenerHorasOcupadas(fecha) {
  const reservas = await obtenerReservas({ fecha });
  const ocupacionPorHora = {};
  reservas.filter(r => r.estado !== 'cancelada').forEach(r => {
    ocupacionPorHora[r.hora] = (ocupacionPorHora[r.hora] || 0) + (r.comensales || 2);
  });
  // Si en una franja horaria hay 18 o más comensales reservados, se marca como ocupada/completa
  return Object.keys(ocupacionPorHora).filter(hora => ocupacionPorHora[hora] >= 18);
}

async function obtenerOcupacionMes(mes) {
  // mes en formato YYYY-MM
  const prefix = mes || new Date().toISOString().substring(0, 7);
  let todas = [];
  if (supabase) {
    const { data } = await supabase.from('reservas').select('*').neq('estado', 'cancelada');
    todas = data || [];
  } else {
    todas = leerReservasLocales().filter(r => r.estado !== 'cancelada');
  }

  const mapa = {};
  todas.forEach(r => {
    if (r.fecha && r.fecha.startsWith(prefix)) {
      if (!mapa[r.fecha]) {
        mapa[r.fecha] = { comensales: 0, horas: {} };
      }
      const pax = parseInt(r.comensales || 2, 10);
      mapa[r.fecha].comensales += pax;
      mapa[r.fecha].horas[r.hora] = (mapa[r.fecha].horas[r.hora] || 0) + pax;
    }
  });

  return mapa;
}

module.exports = {
  obtenerReservas,
  obtenerReservaPorCodigo,
  crearReserva,
  actualizarEstadoReserva,
  eliminarReserva,
  obtenerHorasOcupadas,
  obtenerOcupacionMes
};
