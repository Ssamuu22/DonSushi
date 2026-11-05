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
  console.log('✨ [BD] Conectado a Supabase PostgreSQL (Centro de Estética +Belleza Torrijos - Espacio Aislado #BEL)');
} else {
  console.log('⚡ [BD] Utilizando persistencia en archivo local reservas.json (Modo Autónomo +Belleza)');
}

const LOCAL_DB_PATH = (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
  ? path.join('/tmp', 'reservas_belleza.json')
  : path.join(__dirname, 'reservas.json');

const NEGOCIO_ID = 'Centro de Estética +Belleza Torrijos';
const CODIGO_PREFIX = '#BEL-';

function leerReservasLocales() {
  if (!fs.existsSync(LOCAL_DB_PATH)) {
    const hoyStr = new Date().toISOString().split('T')[0];
    const mananaStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const iniciales = [
      {
        id: 1,
        codigo: '#BEL-102938',
        servicio: 'Higiene Facial Profunda Detox & Extracción',
        nombre: 'Carmen Sánchez',
        telefono: '625 11 22 33',
        email: 'carmen.sanchez@gmail.com',
        fecha: hoyStr,
        hora: '11:00',
        notas: 'Primera visita. Piel mixta con tendencia deshidratada.',
        estado: 'confirmada',
        creadoEl: new Date().toISOString()
      },
      {
        id: 2,
        codigo: '#BEL-482910',
        servicio: 'Manicura Semipermanente Rusa & Refuerzo Rubber',
        nombre: 'Laura Morales',
        telefono: '633 44 55 66',
        email: 'laura.morales@yahoo.es',
        fecha: hoyStr,
        hora: '17:30',
        notas: 'Diseño elegante francesa difuminada baby boomer.',
        estado: 'pendiente',
        creadoEl: new Date().toISOString()
      },
      {
        id: 3,
        codigo: '#BEL-839102',
        servicio: 'Radiofrecuencia Facial Efecto Lifting',
        nombre: 'Rosa María Torres',
        telefono: '677 88 99 00',
        email: 'rosamaria.torres@gmail.com',
        fecha: mananaStr,
        hora: '10:00',
        notas: 'Sesión reafirmante de óvalo facial y cuello.',
        estado: 'confirmada',
        creadoEl: new Date().toISOString()
      },
      {
        id: 4,
        codigo: '#BEL-627194',
        servicio: 'Lifting de Pestañas con Tinte & Queratina',
        nombre: 'Marta Delgado',
        telefono: '699 00 11 22',
        email: 'marta.delgado@outlook.es',
        fecha: mananaStr,
        hora: '16:30',
        notas: 'Mirada definida natural.',
        estado: 'confirmada',
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
    const parsed = JSON.parse(raw);
    return parsed.filter(r => r.codigo && r.codigo.startsWith(CODIGO_PREFIX));
  } catch (err) {
    console.error('Error leyendo reservas locales:', err);
    return [];
  }
}

function guardarReservasLocales(reservas) {
  try {
    const filtradas = reservas.filter(r => r.codigo && r.codigo.startsWith(CODIGO_PREFIX));
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(filtradas, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error guardando reservas locales:', err);
    return false;
  }
}

function parsearFilaSupabase(r) {
  if (!r) return null;
  let servicio = r.servicio || r.servicio_o_local;
  let notas = r.notas || '';
  if (!servicio && notas.startsWith('[') && notas.includes(']')) {
    servicio = notas.substring(1, notas.indexOf(']'));
    notas = notas.substring(notas.indexOf(']') + 1).trim();
  } else if (!servicio) {
    servicio = 'Cita de Estética';
  }
  return {
    id: r.id,
    codigo: r.codigo,
    servicio,
    nombre: r.nombre,
    telefono: r.telefono,
    email: r.email,
    fecha: r.fecha,
    hora: r.hora,
    notas,
    estado: r.estado,
    creadoEl: r.created_at || r.creadoEl || new Date().toISOString()
  };
}

async function obtenerTodasLasReservas() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .ilike('codigo', `${CODIGO_PREFIX}%`)
        .order('fecha', { ascending: false })
        .order('hora', { ascending: true });
      if (!error && Array.isArray(data)) {
        return data.map(parsearFilaSupabase);
      }
      console.warn('Fallo Supabase, recurriendo a local:', error && error.message);
    } catch (e) {
      console.warn('Excepción Supabase:', e.message);
    }
  }
  const lista = leerReservasLocales();
  return lista.sort((a, b) => (b.fecha || '').localeCompare(a.fecha || '') || (a.hora || '').localeCompare(b.hora || ''));
}

async function obtenerReservaPorCodigo(codigo) {
  if (!codigo) return null;
  const codigoNorm = codigo.trim().toUpperCase();
  if (!codigoNorm.startsWith(CODIGO_PREFIX)) return null;

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('reservas')
        .select('*')
        .eq('codigo', codigoNorm)
        .maybeSingle();
      if (!error && data) {
        return parsearFilaSupabase(data);
      }
    } catch (e) {
      console.warn('Excepción obteniendo por código en Supabase:', e.message);
    }
  }

  const locales = leerReservasLocales();
  return locales.find(r => (r.codigo || '').toUpperCase() === codigoNorm) || null;
}

async function obtenerReservas(filtros = {}) {
  const todas = await obtenerTodasLasReservas();
  return todas.filter(r => {
    if (filtros.fecha && r.fecha !== filtros.fecha) return false;
    if (filtros.estado && filtros.estado !== 'todos' && r.estado !== filtros.estado) return false;
    if (filtros.buscar) {
      const term = filtros.buscar.toLowerCase();
      const match = (r.nombre && r.nombre.toLowerCase().includes(term)) ||
                    (r.telefono && r.telefono.toLowerCase().includes(term)) ||
                    (r.codigo && r.codigo.toLowerCase().includes(term)) ||
                    (r.servicio && r.servicio.toLowerCase().includes(term));
      if (!match) return false;
    }
    return true;
  });
}

async function crearReserva(datos) {
  const codigo = datos.codigo || `${CODIGO_PREFIX}${Math.floor(100000 + Math.random() * 900000)}`;
  const servicio = datos.servicio || datos.tratamiento || 'Cita de Estética';
  const nombre = (datos.nombre || '').trim();
  const telefono = (datos.telefono || '').trim();
  const email = (datos.email || '').trim();
  const fecha = datos.fecha;
  const hora = datos.hora;
  const notasRaw = datos.notas || '';
  const estado = datos.estado || 'pendiente';

  if (!nombre || !telefono || !fecha || !hora) {
    throw new Error('Faltan campos requeridos (nombre, teléfono, fecha, hora)');
  }

  if (supabase) {
    try {
      // Inserción adaptativa a esquema Supabase común
      const rowToInsert = {
        codigo,
        restaurante: NEGOCIO_ID,
        nombre,
        telefono,
        email,
        fecha,
        hora,
        personas: 1,
        estado,
        notas: `[${servicio}] ${notasRaw}`.trim()
      };

      const { data, error } = await supabase
        .from('reservas')
        .insert([rowToInsert])
        .select()
        .single();

      if (!error && data) {
        const parsed = parsearFilaSupabase(data);
        const locales = leerReservasLocales();
        locales.unshift(parsed);
        guardarReservasLocales(locales);
        return parsed;
      }
      console.warn('Fallo guardando en Supabase, guardando en local:', error && error.message);
    } catch (e) {
      console.warn('Excepción insertando en Supabase:', e.message);
    }
  }

  const locales = leerReservasLocales();
  const nuevaReserva = {
    id: Date.now(),
    codigo,
    servicio,
    nombre,
    telefono,
    email,
    fecha,
    hora,
    notas: notasRaw,
    estado,
    creadoEl: new Date().toISOString()
  };
  locales.unshift(nuevaReserva);
  guardarReservasLocales(locales);
  return nuevaReserva;
}

async function actualizarEstadoReserva(idOcodigo, nuevoEstado) {
  const estadosValidos = ['pendiente', 'confirmada', 'cancelada'];
  if (!estadosValidos.includes(nuevoEstado)) {
    throw new Error('Estado inválido. Debe ser pendiente, confirmada o cancelada.');
  }

  if (supabase) {
    try {
      const isNum = !isNaN(idOcodigo) && !idOcodigo.toString().startsWith('#');
      let query = supabase.from('reservas').update({ estado: nuevoEstado });
      if (isNum) query = query.eq('id', Number(idOcodigo));
      else query = query.eq('codigo', idOcodigo.toString().trim());

      const { data, error } = await query.select().single();
      if (!error && data) {
        return parsearFilaSupabase(data);
      }
    } catch (e) {
      console.warn('Excepción actualizando en Supabase:', e.message);
    }
  }

  const locales = leerReservasLocales();
  const target = locales.find(r => r.id == idOcodigo || r.codigo == idOcodigo);
  if (!target) throw new Error('Reserva no encontrada');
  target.estado = nuevoEstado;
  target.actualizadoEl = new Date().toISOString();
  guardarReservasLocales(locales);
  return target;
}

async function actualizarReserva(id, camposActualizados) {
  if (supabase) {
    try {
      const isNum = !isNaN(id) && !id.toString().startsWith('#');
      let query = supabase.from('reservas').update(camposActualizados);
      if (isNum) query = query.eq('id', Number(id));
      else query = query.eq('codigo', id.toString().trim());

      const { data, error } = await query.select().single();
      if (!error && data) {
        return parsearFilaSupabase(data);
      }
    } catch (e) {
      console.warn('Excepción editando en Supabase:', e.message);
    }
  }

  const locales = leerReservasLocales();
  const target = locales.find(r => r.id == id || r.codigo == id);
  if (!target) throw new Error('Reserva no encontrada');
  Object.assign(target, camposActualizados, { actualizadoEl: new Date().toISOString() });
  guardarReservasLocales(locales);
  return target;
}

async function eliminarReserva(id) {
  if (supabase) {
    try {
      const isNum = !isNaN(id) && !id.toString().startsWith('#');
      let query = supabase.from('reservas').delete();
      if (isNum) query = query.eq('id', Number(id));
      else query = query.eq('codigo', id.toString().trim());
      const { error } = await query;
      if (!error) return true;
    } catch (e) {
      console.warn('Excepción eliminando en Supabase:', e.message);
    }
  }

  let locales = leerReservasLocales();
  const antes = locales.length;
  locales = locales.filter(r => r.id != id && r.codigo != id);
  if (locales.length === antes) throw new Error('Reserva no encontrada');
  guardarReservasLocales(locales);
  return true;
}

async function obtenerOcupacionMes(mesStr) {
  const todas = await obtenerTodasLasReservas();
  const mapa = {};
  todas.forEach(r => {
    if (r.fecha && r.fecha.startsWith(mesStr) && r.estado !== 'cancelada') {
      mapa[r.fecha] = (mapa[r.fecha] || 0) + 1;
    }
  });
  return mapa;
}

async function obtenerHorasOcupadas(fechaStr) {
  const todas = await obtenerTodasLasReservas();
  const ocupadas = [];
  todas.forEach(r => {
    if (r.fecha === fechaStr && r.estado !== 'cancelada' && r.hora) {
      ocupadas.push(r.hora);
    }
  });
  return ocupadas;
}

module.exports = {
  NEGOCIO_ID,
  CODIGO_PREFIX,
  obtenerTodasLasReservas,
  obtenerReservas,
  obtenerReservaPorCodigo,
  crearReserva,
  actualizarEstadoReserva,
  actualizarReserva,
  eliminarReserva,
  obtenerOcupacionMes,
  obtenerHorasOcupadas
};
