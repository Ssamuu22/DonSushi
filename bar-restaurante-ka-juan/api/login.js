const auth = require('../auth.js');

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
    const data = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const password = (data.password || data.pin || '').toString().trim();

    if (!password) {
      return res.status(400).json({ error: 'Introduce la clave de acceso' });
    }

    if (auth.verificarPassword(password)) {
      const token = auth.generarToken('admin');
      return res.status(200).json({
        success: true,
        message: 'Bienvenido al Panel de Bar Restaurante KA Juan',
        token,
        expiresIn: '7d'
      });
    }

    return res.status(401).json({ error: 'Contraseña incorrecta' });
  } catch (error) {
    console.error('Error en /api/login:', error);
    return res.status(500).json({ error: 'Error interno en la autenticación' });
  }
};
