const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'donsushi.db');
const db = new DatabaseSync(DB_PATH);

// Inicializar tablas
db.exec(`
  CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT UNIQUE NOT NULL,
    restaurante TEXT NOT NULL,
    nombre TEXT NOT NULL,
    telefono TEXT NOT NULL,
    email TEXT NOT NULL,
    fecha TEXT NOT NULL,
    hora TEXT NOT NULL,
    personas INTEGER NOT NULL,
    estado TEXT DEFAULT 'pendiente',
    notas TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS platos (
    id INTEGER PRIMARY KEY,
    codigo_plato TEXT,
    categoria TEXT NOT NULL,
    titulo TEXT NOT NULL,
    imagen TEXT,
    activo INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS log_chat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pregunta TEXT,
    respuesta TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Cargar platos iniciales si la tabla está vacía
const countPlatos = db.prepare('SELECT COUNT(*) as total FROM platos').get().total;

if (countPlatos === 0 && fs.existsSync(path.join(__dirname, 'dishes.json'))) {
  const dishes = JSON.parse(fs.readFileSync(path.join(__dirname, 'dishes.json'), 'utf8'));
  const insertPlato = db.prepare(`
    INSERT INTO platos (id, codigo_plato, categoria, titulo, imagen, activo)
    VALUES (?, ?, ?, ?, ?, 1)
  `);

  const categoriesMap = {
    'NIGIRI': 'Nigiri',
    'MAKI': 'Maki & Slim',
    'MAKISLIM': 'Maki & Slim',
    'CALIFORNIA': 'California Rolls',
    'ROLLO GRANDE': 'Rollos Grandes',
    'SASHIMI': 'Sashimi',
    'TEMAKI': 'Temaki',
    'COMBINADAS': 'Combinadas',
    'ENTRANTES': 'Entrantes',
    'PINCHITAS': 'Pinchitas',
    'COCINA': 'Cocina Caliente',
    'TEPPANYAKI': 'Teppanyaki',
    'POSTRES': 'Postres',
    'BEBIDAS JAPONÉS': 'Bebidas & Vinos',
    'BEBIDA Y REFRESCOS': 'Bebidas & Vinos',
    'VINOS BLANCO': 'Bebidas & Vinos',
    'VINOS TINTO': 'Bebidas & Vinos',
    'VINO ROSADO': 'Bebidas & Vinos'
  };

  db.exec('BEGIN TRANSACTION');
  dishes.forEach((d, idx) => {
    const id = parseInt(d.id, 10) || (idx + 1);
    const cat = categoriesMap[d.category] || d.category;
    insertPlato.run(id, d.id, cat, d.title, d.img);
  });
  db.exec('COMMIT');
  console.log(`[BD] Se importaron ${dishes.length} platos en la base de datos.`);
}

// Métodos de acceso
module.exports = {
  db,
  
  // Reservas
  crearReserva: (data) => {
    const stmt = db.prepare(`
      INSERT INTO reservas (codigo, restaurante, nombre, telefono, email, fecha, hora, personas, estado, notas)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pendiente', ?)
    `);
    const result = stmt.run(
      data.codigo,
      data.restaurante,
      data.nombre,
      data.telefono,
      data.email,
      data.fecha,
      data.hora,
      data.personas,
      data.notas || ''
    );
    return db.prepare('SELECT * FROM reservas WHERE id = ?').get(result.lastInsertRowid);
  },

  obtenerReservas: (filtros = {}) => {
    let sql = 'SELECT * FROM reservas WHERE 1=1';
    const params = [];
    if (filtros.restaurante) {
      sql += ' AND restaurante = ?';
      params.push(filtros.restaurante);
    }
    if (filtros.fecha) {
      sql += ' AND fecha = ?';
      params.push(filtros.fecha);
    }
    if (filtros.estado) {
      sql += ' AND estado = ?';
      params.push(filtros.estado);
    }
    sql += ' ORDER BY fecha DESC, hora DESC';
    return db.prepare(sql).all(...params);
  },

  obtenerReservaPorCodigo: (codigo) => {
    const clean = codigo.trim().toUpperCase().replace('#', '');
    return db.prepare('SELECT * FROM reservas WHERE codigo = ? OR codigo = ?').get(clean, '#' + clean);
  },

  actualizarEstadoReserva: (codigo, nuevoEstado) => {
    const clean = codigo.trim().toUpperCase().replace('#', '');
    db.prepare('UPDATE reservas SET estado = ? WHERE codigo = ? OR codigo = ?').run(nuevoEstado, clean, '#' + clean);
    return db.prepare('SELECT * FROM reservas WHERE codigo = ? OR codigo = ?').get(clean, '#' + clean);
  },

  eliminarReserva: (codigo) => {
    const clean = codigo.trim().toUpperCase().replace('#', '');
    return db.prepare('DELETE FROM reservas WHERE codigo = ? OR codigo = ?').run(clean, '#' + clean);
  },

  // Platos
  obtenerPlatos: (categoria, busqueda) => {
    let sql = 'SELECT * FROM platos WHERE activo = 1';
    const params = [];
    if (categoria && categoria !== 'ALL') {
      sql += ' AND categoria = ?';
      params.push(categoria);
    }
    if (busqueda) {
      sql += ' AND (titulo LIKE ? OR categoria LIKE ?)';
      params.push(`%${busqueda}%`, `%${busqueda}%`);
    }
    sql += ' ORDER BY id ASC';
    return db.prepare(sql).all(...params);
  },

  // Estadísticas del restaurante
  obtenerEstadisticas: () => {
    const totalReservas = db.prepare('SELECT COUNT(*) as c FROM reservas').get().c;
    const confirmadas = db.prepare("SELECT COUNT(*) as c FROM reservas WHERE estado = 'confirmada'").get().c;
    const pendientes = db.prepare("SELECT COUNT(*) as c FROM reservas WHERE estado = 'pendiente'").get().c;
    const totalComensales = db.prepare('SELECT COALESCE(SUM(personas), 0) as s FROM reservas').get().s;
    const totalPlatos = db.prepare('SELECT COUNT(*) as c FROM platos').get().c;
    
    return {
      totalReservas,
      confirmadas,
      pendientes,
      totalComensales,
      totalPlatos
    };
  }
};
