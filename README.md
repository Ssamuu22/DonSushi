# Don Sushi · Cocina Japonesa & Buffet Libre de Autor en Madrid

Sitio web oficial modernizado de **Don Sushi**, con presencia en Fuenlabrada, Móstoles, Boadilla del Monte y Aranjuez.

![Don Sushi Preview](https://www.donsushi.net/public/upbanner/20241003113417566039.jpg)

## 🍣 Características Principales

- **Animaciones fluidas 60 FPS:** Lluvia suave de pétalos de Sakura en HTML5 Canvas con pausa automática mediante IntersectionObserver al hacer scroll.
- **Plato 3D Interactivo:** Gráficos vectoriales gastronómicos en alta definición con perspectiva e inclinación 3D en tiempo real según la posición del cursor.
- **Toda la Carta Oficial (183 Platos):** Menú completo extraído de su web oficial con fotografías reales de cada plato, filtrado por categorías, badges gastronómicos y buscador instantáneo.
- **Tarifas y Políticas del Buffet Libre:** Desglose detallado del buffet mediodía (12,95 €) y noche/fines de semana (15,95 €), normas de consumo responsable y precios especiales para niños.
- **Locales & Mapa Interactivo:** Selector de restaurantes (Fuenlabrada, Móstoles, Boadilla, Aranjuez) con mapa interactivo y botón de enlace directo a Google Maps.
- **Reservas Multicanal con Comprobante:** Generador de código de reserva `#DS-XXXXXX`, confirmación directa por WhatsApp (con mensaje pre-redactado al restaurante y al usuario), envío de copia a correo y descarga de evento para Google Calendar / Apple Calendar (`.ics`).
- **Chatbot Inteligente (Hiroshi Virtual):** Asistente virtual en vivo para resolver dudas de horarios, tarifas, alérgenos, recomendaciones y búsqueda de platos en el menú.
- **Accesibilidad y Rendimiento:** Compatible con `prefers-reduced-motion` y optimizado para dispositivos móviles y de escritorio.

## 🚀 Despliegue en GitHub Pages

Este proyecto es 100% estático (HTML5, CSS3, JavaScript Vanilla) y no requiere ningún servidor backend.

1. Sube este repositorio a tu cuenta de GitHub.
2. Ve a **Settings** > **Pages**.
3. En **Source**, selecciona la rama `main` y guarda.
4. Tu web estará disponible online en minutos en `https://<tu-usuario>.github.io/<tu-repositorio>/`.

## 📁 Estructura del Proyecto

- `index.html` — Archivo principal autocompilado con estilos, animaciones y lógica del chatbot.
- `dishes.json` — Base de datos con los 183 platos y enlaces a fotos oficiales.
- `build_index.js` — Script compilador para regenerar el sitio.
- `extract_menu.js` — Extractor de la carta desde la web oficial.

---

© 2026 Don Sushi. Todos los derechos reservados.
