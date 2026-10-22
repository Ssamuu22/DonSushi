# Centro de Estética Patricia Carpintero · Web & Sistema de Reservas

Sitio web oficial, catálogo interactivo de tratamientos y sistema integral de citas online para el **Centro de Estética Patricia Carpintero** en Fuensalida (Toledo).

---

## 🌸 Características Principales

1. **Identidad Visual Exclusiva y Elegante**:
   - Paleta cromática botánica: Rosa peonía (`#b47999`), Verde eucalipto/salvia (`#52796f`), Blanco seda y Oro champagne.
   - Tipografía editorial (`Playfair Display` + `Plus Jakarta Sans` + firma caligráfica `Alex Brush`).
   - Logotipo oficial extraído del perfil de Facebook e integrado en alta resolución (`assets/logo.jpg`).
   - Animaciones fluidas: cursor magnético interactivo, barra de progreso de lectura y tarjetas con microinteracciones.

2. **Catálogo Real de Tratamientos**:
   - **Faciales Avanzados**: Higiene Facial con Punta de Diamante, Radiofrecuencia Efecto Lifting, Despigmentante & Antimanchas, Dermapen con Cóctel de Vitaminas, Hidratación con Ácido Hialurónico.
   - **Corporal & Remodelación**: Maderoterapia Corporal Reductora (técnica con maderas nobles), Cavitación, Presoterapia Médica y Masajes Relajantes.
   - **Mirada**: Lifting de Pestañas con Tinte & Queratina, Diseño de Cejas con Henna, Extensiones de Pestañas.
   - **Manos y Pies**: Manicura Semipermanente Rusa, Nivelación Rubber, Pedicura Spa Completa, Uñas de Gel/Acrigel.
   - **Depilación**: Depilación Láser de Diodo de alta potencia indoloro y cera tradicional.

3. **Motor de Reservas Interactivo en 3 Pasos**:
   - Paso 1: Selección de tratamiento con duración y precio orientativo.
   - Paso 2: Selección de fecha y turno horario (respetando turnos de mañana 10:00-13:30, tardes 16:00-20:00 y sábados mañanas).
   - Paso 3: Datos de cliente y notas sobre su piel.
   - Generación de código único de cita: `#PC-XXXXXX`.
   - **Comprobante Digital Instantáneo**:
     - Botón directo de **WhatsApp con mensaje preformateado** dirigido al 647 54 32 25.
     - Descarga de evento de calendario `.ics` compatible con iPhone (Apple Calendar), Google Calendar y Outlook.
     - Botón de imprimir / guardar en PDF.

4. **Panel Administrativo Privado (`/admin.html` y `/admin.htlm`)**:
   - Acceso con contraseña privada: `patricia2026`.
   - Contadores en tiempo real: Citas de Hoy, Pendientes, Confirmadas y Total.
   - Filtros avanzados por fecha (Hoy, Mañana, Esta Semana), por estado y buscador por cliente/código.
   - Botón directo de WhatsApp para cada cita con mensaje personalizado.
   - Cambio de estado instantáneo (Pendiente, Confirmada, Realizada, Cancelada).
   - Agendamiento manual de citas para llamadas telefónicas.
   - Exportación a hoja de cálculo CSV con 1 clic.

5. **Páginas Legales Completas**:
   - `aviso-legal.html` (LSSI-CE con datos de Fuensalida).
   - `privacidad.html` (RGPD).
   - `cookies.html`.

6. **Datos Reales de Contacto**:
   - Dirección: Calle Fray Luis Fuensalida, 2, 45510 Fuensalida, Toledo.
   - Teléfono & WhatsApp: +34 647 54 32 25.
   - Facebook oficial enlazado.

---

## 🚀 Puesta en Marcha Local

### Opción A: Servidor Node.js Nativo
```bash
cd "estetica-patricia-carpintero"
node server.js
```
- **Web Pública:** [http://localhost:3000](http://localhost:3000)
- **Panel Admin:** [http://localhost:3000/admin.html](http://localhost:3000/admin.html) *(o `http://localhost:3000/admin.htlm`)*
- **Clave Admin:** `patricia2026`

### Opción B: Modo Estático Directo
Puedes hacer doble clic en `index.html` o `admin.html` directamente en tu navegador sin necesidad de terminal. Cuenta con almacenamiento en memoria `localStorage` automático.

---

## ☁️ Conexión con Supabase PostgreSQL (Opcional)

Si deseas sincronización en la nube con Supabase:
1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ejecuta el script SQL incluido en `schema_supabase.sql` en el SQL Editor de Supabase.
3. Configura tus variables en `.env`:
   ```env
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_SERVICE_KEY=tu-service-role-key
   ADMIN_PASSWORD=patricia2026
   ```

---

## 🌐 Despliegue en Vercel

El proyecto incluye `vercel.json` y los endpoints serverless en `/api/reservas.js` y `/api/login.js`. Solo ejecuta:
```bash
vercel
```
O conéctalo a tu repositorio GitHub para despliegue automático.
