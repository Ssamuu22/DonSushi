const auth = require('../auth.js');

async function getRequestBody(req) {
  if (req.body) {
    if (typeof req.body === 'string') {
      try { return JSON.parse(req.body); } catch(e) { return {}; }
    }
    return req.body;
  }
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk.toString(); });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch(e) { resolve({}); }
    });
    req.on('error', () => resolve({}));
  });
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const body = await getRequestBody(req);
    const password = (body.password || body.pin || '').toString().trim();

    if (!password) {
      return res.status(400).json({ error: 'Introduce la contraseña' });
    }

    if (auth.verificarPassword(password)) {
      const token = auth.generarToken('admin');
      return res.status(200).json({
        success: true,
        message: 'Autenticación correcta',
        token,
        expiresIn: '7d'
      });
    }

    return res.status(401).json({ error: 'Contraseña incorrecta' });
  } catch (err) {
    console.error('Error en /api/login:', err);
    return res.status(500).json({ error: 'Error interno en autenticación' });
  }
};
