const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const db = require('./db.js');
const auth = require('./auth.js');

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        resolve({});
      }
    });
    req.on('error', err => reject(err));
  });
}

const serverHandler = async (req, res) => {
  // Polyfill status y json para compatibilidad nativa HTTP con Vercel Functions
  if (!res.status) {
    res.status = function(code) {
      this.statusCode = code;
      return this;
    };
  }
  if (!res.json) {
    res.json = function(data) {
      this.setHeader('Content-Type', 'application/json; charset=utf-8');
      return this.end(JSON.stringify(data));
    };
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Pre-parsear req.body si es POST o PATCH
  if (['POST', 'PATCH', 'PUT'].includes(req.method) && !req.body) {
    try {
      req.body = await parseBody(req);
    } catch (e) {
      req.body = {};
    }
  }

  // API: Autenticación Admin
  if (pathname === '/api/login') {
    const apiLoginHandler = require('./api/login.js');
    return apiLoginHandler(req, res);
  }

  // API: Reservas CRUD
  if (pathname.startsWith('/api/reservas')) {
    const apiReservasHandler = require('./api/reservas.js');
    req.query = parsedUrl.query;
    return apiReservasHandler(req, res);
  }

  // Rutas de administración
  if (pathname === '/admin' || pathname === '/admin.html') {
    const adminPath = path.join(__dirname, 'admin.html');
    if (fs.existsSync(adminPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(fs.readFileSync(adminPath));
    }
  }

  // Archivos Estáticos
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  let filePath = path.join(__dirname, safePath);

  // Si no tiene extensión y no existe, probar agregando .html
  if (!path.extname(filePath) && !fs.existsSync(filePath)) {
    if (fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    }
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    return res.end(fs.readFileSync(filePath));
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>404 - Página no encontrada en +Belleza Torrijos</h1>');
};

const server = http.createServer(serverHandler);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`🌸 [Centro de Estética +Belleza] Servidor activo en http://localhost:${PORT}`);
    console.log(`🔑 Panel de Gestión: http://localhost:${PORT}/admin`);
  });
}

module.exports = serverHandler;
