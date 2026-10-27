# 🍔 Bar Restaurante Casa Paco (Méntrida, Toledo)

Sitio web oficial, motor de reservas interactivo en tiempo real con calendario mensual y panel de control de sala privado (/admin).

---

## 📍 Información del Negocio

- **Nombre Comercial:** Bar Restaurante Casa Paco Méntrida
- **Tipo de Establecimiento:** Restaurante / Bar / Cafetería
- **Dirección Oficial:** Avenida Félix Arranz, 28, 45930 Méntrida (Toledo), España
- **Teléfono Oficial / WhatsApp:** [+34 635 39 12 18](tel:+34635391218)
- **Teléfono Fijo:** [+34 918 17 80 12](tel:+34918178012)
- **Email:** reservas@casapacomentrida.es
- **Valoración en Google Maps:** ⭐ **4.3 / 5** (Más de 500 opiniones de clientes verificadas)

### Horarios de Servicio:
- **Lunes:** Cerrado por descanso del personal
- **Martes a Jueves:** 07:00 – 00:00 h (Desayunos de pueblo, aperitivos, comidas y cenas)
- **Viernes y Sábados:** 07:00 – 02:00 h (Cocina abierta, raciones, copas y cenas)
- **Domingos:** 08:00 – 00:00 h (Desayunos, aperitivos, comidas y tardeo)

---

## 🚀 Características Principales

1. **Despliegue Serverless en Vercel:**
   - Enrutamiento optimizado mediante `vercel.json` con `cleanUrls: true`.
   - Protección frente al problema de descarga de archivos: `/admin` carga `admin.html` directamente en el navegador.
   - Monorepo fix configurado: `rootDirectory` apunta a la subcarpeta del proyecto.

2. **Motor de Reservas en Directo con Calendario Interactivo:**
   - Selector dinámico de comensales (1 a 10+ pax).
   - Calendario mensual en tiempo real con navegación `<` y `>` y colores de ocupación:
     * 🟢 Verde: Mesas libres
     * 🟡 Amarillo: Últimas plazas
     * 🔴 Rojo: Completo / Ocupado
     * ⚫ Gris: Lunes cerrado por descanso
   - Panel dinámico de franjas horarias por turno (Almuerzos 13:30 - 15:30 y Cenas 20:30 - 23:00).
   - Comprobante multicanal con código único `#CP-XXXXXX`:
     * Enlace directo a WhatsApp con plantilla formateada con todos los datos.
     * Descarga de evento de calendario universal `.ICS` (Google Calendar, Apple Calendar, Outlook).
     * Confirmación inmediata sin esperas telefónicas.

3. **Panel Privado de Sala (/admin):**
   - Autenticación criptográfica mediante token HMAC SHA-256 (validez 7 días).
   - Clave maestra por defecto: `casapaco2026` (o `2026`).
   - Métricas KPI en vivo: Reservas de hoy, comensales previstos, solicitudes pendientes, confirmadas y porcentaje de ocupación estimada.
   - Filtros por fecha (Hoy, Mañana, Todas, Selector personalizado) y por estado (Pendiente, Confirmada, Cancelada).
   - Buscador predictivo en directo.
   - Acciones en 1 clic: Confirmar reserva, abrir WhatsApp directo al cliente, llamar o eliminar.
   - Modal para registrar reservas telefónicas o presenciales de sala.
   - Exportación de listados a formato CSV y botón de impresión de hoja de servicio del día.

4. **Diseño Visual & Experiencia de Usuario de Élite:**
   - Paleta de diseño cálido: Obsidian luxury, ámbar dorado y tonos garnacha de la D.O. Méntrida.
   - Top Bar con valoración de Google Maps y teléfono directo.
   - Barra de progreso de lectura vinculada al scroll.
   - Cursor magnético reactivo para ordenadores de sobremesa.
   - Ticker marquee continuo con textos animados en bucle.
   - Hero Section de alto impacto con fotografía real de alta resolución.
   - Bento Grid fotográfico con visor Lightbox a pantalla completa.
   - Carta interactiva con pestañas de categorías, fotos, alérgenos y badges de platos destacados.
   - Sección de Espacios: Salón Comedor Principal, Terraza Exterior de Verano y Barra de Picoteo.
   - Sección de Ubicación con mapa interactivo de Google Maps embebido.
   - Botones flotantes (WhatsApp animado + botón de reserva rápida).
   - Barra sticky inferior fija para teléfonos móviles (Llamar, WhatsApp, Reservar).
   - Cumplimiento estricto del RGPD: Aviso Legal, Privacidad, Cookies y banner de consentimiento.

---

## 🛠️ Ejecución en Local

```bash
# Iniciar servidor Node.js nativo (sin dependencias externas obligatorias)
npm start
# O directamente:
node server.js
```

- Web pública: [http://localhost:3000](http://localhost:3000)
- Panel de Sala: [http://localhost:3000/admin](http://localhost:3000/admin) (Clave: `casapaco2026`)
