const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const db = require('./db.js');

const PORT = process.env.PORT || 3000;

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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
  });
}

const server = http.createServer(async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // ===================== REST API =====================
  
  // 1. Crear Reserva (POST /api/reservas)
  if (req.method === 'POST' && pathname === '/api/reservas') {
    try {
      const data = await parseBody(req);
      if (!data.nombre || !data.telefono || !data.email || !data.fecha) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Faltan campos obligatorios' }));
        return;
      }

      if (!data.codigo) {
        data.codigo = '#DS-' + Math.floor(100000 + Math.random() * 900000);
      }

      const nuevaReserva = db.crearReserva(data);
      console.log(`[BD] Nueva reserva creada en SQLite: ${nuevaReserva.codigo} - ${nuevaReserva.nombre} (${nuevaReserva.personas}p)`);
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, reserva: nuevaReserva }));
    } catch (e) {
      console.error('Error al crear reserva:', e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // 2. Obtener Reservas (GET /api/reservas)
  if (req.method === 'GET' && pathname === '/api/reservas') {
    try {
      const reservas = db.obtenerReservas(parsedUrl.query);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(reservas));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // 3. Consultar Reserva por Código (GET /api/reservas/:codigo)
  if (req.method === 'GET' && pathname.startsWith('/api/reservas/')) {
    const codigo = decodeURIComponent(pathname.replace('/api/reservas/', ''));
    const reserva = db.obtenerReservaPorCodigo(codigo);
    if (!reserva) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Reserva no encontrada en la base de datos' }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(reserva));
    return;
  }

  // 4. Actualizar Estado (PATCH /api/reservas/:codigo/estado)
  if (req.method === 'PATCH' && pathname.includes('/estado')) {
    try {
      const parts = pathname.split('/');
      const codigo = decodeURIComponent(parts[3]);
      const body = await parseBody(req);
      if (!body.estado) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Falta el campo estado' }));
        return;
      }
      const actualizada = db.actualizarEstadoReserva(codigo, body.estado);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, reserva: actualizada }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
    return;
  }

  // 5. Eliminar Reserva (DELETE /api/reservas/:codigo)
  if (req.method === 'DELETE' && pathname.startsWith('/api/reservas/')) {
    const codigo = decodeURIComponent(pathname.replace('/api/reservas/', ''));
    db.eliminarReserva(codigo);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, message: 'Reserva eliminada de la base de datos' }));
    return;
  }

  // 6. Platos desde la Base de Datos (GET /api/platos)
  if (req.method === 'GET' && pathname === '/api/platos') {
    const categoria = parsedUrl.query.cat;
    const busqueda = parsedUrl.query.q;
    const platos = db.obtenerPlatos(categoria, busqueda);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(platos));
    return;
  }

  // 7. Estadísticas del Restaurante (GET /api/stats)
  if (req.method === 'GET' && pathname === '/api/stats') {
    const stats = db.obtenerEstadisticas();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(stats));
    return;
  }

  // ===================== ARCHIVOS ESTÁTICOS =====================
  
  let filePath = path.join(__dirname, 'index.html');
  let contentType = 'text/html; charset=utf-8';

  if (pathname === '/admin' || pathname === '/admin.html') {
    filePath = path.join(__dirname, 'admin.html');
  } else if (pathname === '/dishes.json') {
    filePath = path.join(__dirname, 'dishes.json');
    contentType = 'application/json';
  } else if (pathname === '/' || pathname === '/index.html') {
    filePath = path.join(__dirname, 'index.html');
  } else {
    // Si solicita un archivo relativo
    const potential = path.join(__dirname, pathname);
    if (fs.existsSync(potential) && fs.statSync(potential).isFile()) {
      filePath = potential;
      if (pathname.endsWith('.js')) contentType = 'application/javascript';
      else if (pathname.endsWith('.css')) contentType = 'text/css';
      else if (pathname.endsWith('.json')) contentType = 'application/json';
      else if (pathname.endsWith('.png')) contentType = 'image/png';
      else if (pathname.endsWith('.jpg')) contentType = 'image/jpeg';
    }
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 No Encontrado');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🍣 Servidor Don Sushi con Base de Datos SQLite ACTIVO`);
  console.log(`🌐 Web Pública:      http://localhost:${PORT}`);
  console.log(`📊 Panel de Gestión: http://localhost:${PORT}/admin`);
  console.log(`🗄️  Archivo BD:       ${path.join(__dirname, 'donsushi.db')}`);
  console.log(`====================================================`);
});
