const auth = require('../auth.js');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const password = (data.password || data.pin || '').toString().trim();

    if (!password) {
      return res.status(400).json({ error: 'Introduce la contraseña' });
    }

    if (auth.verificarPassword(password)) {
      const token = auth.generarToken('admin');
      return res.status(200).json({
        success: true,
        message: 'Autenticación correcta en Centro de Estética +Belleza Torrijos',
        token,
        expiresIn: '7d'
      });
    }

    return res.status(401).json({ error: 'Contraseña incorrecta' });
  } catch (e) {
    return res.status(500).json({ error: 'Error interno en autenticación' });
  }
};
