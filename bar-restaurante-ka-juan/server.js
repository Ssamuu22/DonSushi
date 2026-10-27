const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const db = require('./db.js');
const auth = require('./auth.js');

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

const PORT = process.env.PORT || 3000;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', err => reject(err));
  });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htlm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.ics': 'text/calendar; charset=utf-8'
};

const requestHandler = async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // ===================== REST API =====================

  // 1. Login Admin (POST /api/login)
  if (req.method === 'POST' && pathname === '/api/login') {
    try {
      const data = await parseBody(req);
      const password = (data.password || data.pin || '').toString().trim();

      if (!password) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Introduce la contraseña' }));
        return;
      }

      if (auth.verificarPassword(password)) {
        const token = auth.generarToken('admin');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: 'Autenticación correcta',
          token,
          expiresIn: '7d'
        }));
        return;
      }

      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Contraseña incorrecta' }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Error interno en autenticación' }));
    }
    return;
  }

  // 2. Rutas de Reservas (/api/reservas)
  if (pathname.startsWith('/api/reservas')) {
    const matchCodigo = pathname.match(/^\/api\/reservas\/([^/]+)$/);

    // Consulta de ocupación de mes en tiempo real para el calendario
    if (req.method === 'GET' && parsedUrl.query.ocupacionMes) {
      try {
        const mapa = await db.obtenerOcupacionMes(parsedUrl.query.ocupacionMes);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ mes: parsedUrl.query.ocupacionMes, ocupacion: mapa }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    // Consulta de horas ocupadas para una fecha concreta
    if (req.method === 'GET' && parsedUrl.query.fecha && parsedUrl.query.horasOcupadas) {
      try {
        const horas = await db.obtenerHorasOcupadas(parsedUrl.query.fecha);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ fecha: parsedUrl.query.fecha, horasOcupadas: horas }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    // Consulta pública por código
    if (req.method === 'GET' && (matchCodigo || parsedUrl.query.codigo)) {
      try {
        const codigo = matchCodigo ? decodeURIComponent(matchCodigo[1]) : parsedUrl.query.codigo;
        const reserva = await db.obtenerReservaPorCodigo(codigo);
        if (!reserva) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Reserva no encontrada' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(reserva));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    // Crear reserva (POST /api/reservas)
    if (req.method === 'POST') {
      try {
        const data = await parseBody(req);
        if (!data.nombre || !data.telefono || !data.fecha || !data.hora) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Faltan campos obligatorios' }));
          return;
        }
        if (!data.codigo) {
          data.codigo = '#KJ-' + Math.floor(100000 + Math.random() * 900000);
        }
        const nueva = await db.crearReserva(data);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, reserva: nueva }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    // ================== RUTAS PRIVADAS ADMIN ==================
    const token = auth.extraerTokenDeCabecera(req);
    const session = auth.verificarToken(token);

    if (!session) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Acceso no autorizado' }));
      return;
    }

    // Listar reservas (GET /api/reservas)
    if (req.method === 'GET' && !matchCodigo) {
      try {
        const reservas = await db.obtenerReservas(parsedUrl.query);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(reservas));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    // Actualizar estado (PATCH /api/reservas/:codigo)
    if (req.method === 'PATCH' && matchCodigo) {
      try {
        const codigo = decodeURIComponent(matchCodigo[1]);
        const data = await parseBody(req);
        const reserva = await db.actualizarEstadoReserva(codigo, data.estado);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, reserva }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }

    // Eliminar reserva (DELETE /api/reservas/:codigo)
    if (req.method === 'DELETE' && matchCodigo) {
      try {
        const codigo = decodeURIComponent(matchCodigo[1]);
        await db.eliminarReserva(codigo);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }
  }

  // ===================== ARCHIVOS ESTÁTICOS =====================
  let safePath = pathname;
  if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  } else if (safePath === '/admin' || safePath === '/admin.html' || safePath === '/admin.htlm') {
    safePath = '/admin.html';
  }

  const filePath = path.join(__dirname, safePath);

  // Prevenir Directory Traversal
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Acceso denegado');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // 404
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 - Página no encontrada</h1><p><a href="/">Volver al inicio</a></p>');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
  });
};

const server = http.createServer(requestHandler);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`  🥩 BAR RESTAURANTE KA JUAN - SISTEMA ACTIVO`);
    console.log(`  📍 Sotillo de las Palomas (Toledo) - Sierra de San Vicente`);
    console.log(`  🌐 Web Pública:       http://localhost:${PORT}/`);
    console.log(`  🛡️ Panel Reservas:    http://localhost:${PORT}/admin`);
    console.log(`  🔑 Clave de Acceso:   ${auth.getMasterPassword()}`);
    console.log(`======================================================\n`);
  });
}

module.exports = server;
