# 🥩 Bar Restaurante KA Juan · Sotillo de las Palomas (Toledo)

Sitio web oficial y motor de reservas telemático en tiempo real para **Bar Restaurante KA Juan**, ubicado en **Calle la Iglesia, s/n, 45635 Sotillo de las Palomas (Toledo)**, en plena **Sierra de San Vicente**.

El establecimiento es célebre por sus **carnes de raza Angus maduradas**, chuletones a la brasa de encina, tapas caseras de pueblo (croquetas de rabo de toro, croquetas de chipirón con alioli suave, saquitos de carrillera) y sus famosas **torrijas caseras caramelizadas**.

---

## 🌟 Características Implementadas

### 1. Diseño Visual & Experiencia de Usuario (UX/UI)
- **Paleta de Color Exclusiva**: Inspirada en la brasa viva, el cobre flameado (`#e27d3b`, `#f59e5b`), maderas nobles y fondos en carbón tostado (`#0c0a08`, `#14110e`).
- **Fotografías Reales de Alta Resolución**: 23 fotografías auténticas obtenidas directamente de la ficha oficial de Google Maps de Bar Restaurante KA Juan.
- **Bento Grid Fotográfico**: Galería interactiva con ampliación Lightbox a pantalla completa.
- **Carta Gastronómica con Fotografía y Filtros por Categoría**:
  - *Carnes Angus & Brasas*: Chuletón Angus madurado dry-aged, entrecot a la parrilla, solomillo y costillar.
  - *Tapas & Raciones Estrella*: Croquetas de rabo de toro, croquetas de chipirones en su tinta, saquitos de carrillera, jamón ibérico y queso curado.
  - *Guisos & Cuchara*: Rabo de toro estofado al vino de Méntrida, carrilladas con setas de la Sierra y judías caseras.
  - *Postres Caseros*: Torrijas caramelizadas al momento con helado, tarta de queso horneada y mousse de chocolate puro.
- **Reseñas Verificadas de Google Maps (4.7 ⭐)**: Testimonios auténticos de comensales locales y viajeros de la Sierra de San Vicente.
- **Ubicación & Mapa Interactivo**: Horarios oficiales de apertura (Martes a Domingo, Lunes descanso) y mapa de Google Maps integrado.

---

### 2. Motor de Reservas Interactivo con Calendario en Directo
- **Calendario en Vivo**: Indicación visual instantánea de días libres (🟢), últimas plazas (🟡) y días completos (🔴).
- **Lunes Descanso**: Días no operativos deshabilitados automáticamente.
- **Selector de Franjas Horarias en Tiempo Real**: Cálculo telemático de horas ocupadas (`/api/reservas?fecha=YYYY-MM-DD&horasOcupadas=1`), alertando si una franja de almuerzo o cena está llena.
- **Comprobante Multicanal Inmediato**:
  - Código único de confirmación: `#KJ-XXXXXX`
  - Sincronización instantánea con **WhatsApp** hacia el teléfono oficial del restaurante (`+34 605 15 79 21`).
  - Descarga directa de evento `.ICS` para agendar en Google Calendar, iPhone/Apple Calendar o Microsoft Outlook.

---

### 3. Panel de Control de Sala y Reservas Privado (`/admin`)
- Acceso directo y discreto mediante `/admin` o `/admin.html`.
- Protección mediante contraseña maestra / PIN:
  - **Clave predeterminada**: `kajuan2026` (o `2026` / `kajuan`).
- Sesión cifrada mediante token seguro HMAC.
- Métricas KPI en directo: Reservas hoy, comensales previstos, solicitudes pendientes, mesas confirmadas y % de ocupación.
- Gestión ágil: Confirmación en 1 clic, botón de WhatsApp directo al comensal, llamadas telefónicas, buscador predictivo y cancelación.
- Registro de reservas manuales (para comensales presenciales o llamadas de teléfono).
- Exportación completa a formato **CSV** e impresión limpia de la hoja de servicio de sala.

---

### 4. Arquitectura Híbrida y Despliegue en Vercel
- **Listo para Vercel**: Configurado con Serverless Functions en `/api/` y `vercel.json` optimizado (con `cleanUrls`, reescrituras de `/admin` y entrega estática sin descargas erróneas).
- **Servidor Local Autónomo**: Ejecutable con `node server.js` en el puerto `3000`.
- **Doble Persistencia**:
  - En la nube con **Supabase PostgreSQL** (`schema_supabase.sql` con Row Level Security activado).
  - En local o modo autónomo mediante `reservas.json` automático sin dependencias externas.
- **Cumplimiento Legal RGPD / LSSI**: Páginas de Aviso Legal, Política de Privacidad y Política de Cookies con banner de consentimiento.

---

## 🚀 Puesta en Marcha Local

```bash
# Entrar a la carpeta del proyecto
cd bar-restaurante-ka-juan

# Iniciar el servidor local
node server.js
```

Abrir en el navegador:
- **Web Pública:** `http://localhost:3000/`
- **Panel Administrativo:** `http://localhost:3000/admin` (Clave: `kajuan2026`)

---

## ☁️ Despliegue en Vercel

```bash
cd bar-restaurante-ka-juan
vercel --prod
```
