# 🌸 Centro de Estética +Belleza (Torrijos, Toledo)

Sitio web oficial interactivo, motor de reservas de citas en cabina en tiempo real con calendario mensual y panel de control administrativo privado (`/admin`).

Desplegado en producción serverless con **Vercel** y sincronizado con base de datos **Supabase PostgreSQL** (aislamiento por prefijo `#BEL-`).

---

## 📍 Información del Establecimiento

- **Nombre Comercial:** Centro de Estética +Belleza
- **Directora & Esteticista:** Belén y su equipo
- **Especialidades:** Higiene Facial Profunda Detox con Extracción y Vapor Ozono, Radiofrecuencia Facial y Corporal Reafirmante, Mesoterapia Virtual con Ácido Hialurónico, Manicura Semipermanente Rusa con refuerzo Rubber, Uñas Acrílicas y de Gel, Spa Pedicure Completa, Lifting de Pestañas con Tinte & Queratina, Depilación con Cera y Eléctrica, y Cabina de Bronceado Rayos UVA.
- **Dirección Oficial:** Plaza del Cristo, 10 (Local izquierdo, esquina con C/ Camarín), 45500 Torrijos (Toledo), España.
- **Teléfono:** [925 77 08 12](tel:925770812) / [+34 925 77 08 12](tel:+34925770812)
- **Valoración en Google Maps:** ⭐ **4.8 / 5** (73 reseñas verificadas)

### Horarios Oficiales de Apertura (Google Maps):
- **Lunes:** 15:00 a 20:30 h (Tardes)
- **Martes a Viernes:** 09:00 a 20:30 h (Jornada continua ininterrumpida)
- **Sábados:** 10:15 a 13:45 h (Citas de mañana)
- **Domingos:** Cerrado por descanso del personal

---

## 🎨 Paleta Cromática Fiel al Establecimiento

Extraída directamente de las fotografías de fachada y cabinas de su ficha de Google Maps:
- **Turquesa Spa (+Belleza Brand):** `#0d9488`, `#0f766e`, `#115e59` (el color corporativo del rótulo y vinilos)
- **Aro Dinámico Aqua Halo:** `#5eead4`, `#99f6e4`, `#ccfbf1` (el trazo ovalado de las lunas)
- **Verde Menta Cabina:** `#7fc8a9`, `#e8f5ee`, `#4d9370` (las puertas y mostradores interiores)
- **Verde Esmeralda Espera:** `#1a7a68` (los sillones ergonómicos de la sala de espera)
- **Granito Plateado & Seda Spa:** `#64748b`, `#f8fafc`, `#ffffff`, `#fbfdfc` (la piedra exterior y ambiente clínico limpio)
- **Toques Champagne:** `#c89b53`

---

## 💻 Características del Sitio Web

1. **Diseño Visual de Alta Gama y Microinteracciones Fluidas:**
   - Barra superior con horarios y teléfono directo.
   - Orbes de luz ambiental flotantes.
   - Tipografías de lujo (*Playfair Display*, *Alex Brush* y *Plus Jakarta Sans*).
   - Barra superior de progreso de scroll.

2. **Slider Interactivo Antes / Después (Glow Facial & Piel Renovada):**
   - Comparador táctil y de ratón (*touch & drag*) para visualizar el cambio dérmico tras una sesión de higiene facial profunda y ácido hialurónico.
   - Botones rápidos (Antes, 50/50 y Ver Resultado).

3. **Carta Completa de Tratamientos y Servicios:**
   - 6 Categorías filtrables: *Faciales & Aparatología*, *Uñas & Manicura*, *Mirada & Pestañas*, *Corporal & Bienestar*, *Depilación Cera & Eléctrica* y *Cosmética & Solares*.
   - Botón directo "Reservar Cita" que preselecciona el servicio y salta al motor de reservas.

4. **Motor de Citas en Directo en 3 Pasos:**
   - Paso 1: Selección del servicio.
   - Paso 2: Calendario mensual inteligente con días de descanso bloqueados (domingos) y selector de horas dinámico con consulta a la API para evitar solapamientos.
   - Paso 3: Datos de contacto y notas dermatológicas.
   - Generación de código único `#BEL-XXXXXX`.

5. **Comprobante Multicanal Inmediato:**
   - **WhatsApp:** Enlace directo con mensaje preformateado listo para enviar a +Belleza.
   - **Calendario Universal (.ICS):** Descarga de archivo de cita para Google Calendar, Apple Calendar y Outlook.

6. **Panel Privado de Gestión de Citas (`/admin`):**
   - Acceso protegido por contraseña: `belleza2026` (o `2026`).
   - Métricas KPI en directo (Citas de Hoy, Pendientes, Confirmadas y Total histórico).
   - Filtros por fecha (Hoy, Mañana, Todas) y estado.
   - Buscador predictivo en vivo.
   - Modificación instantánea de estado (Confirmar, Pendiente, Cancelar, Eliminar).
   - Botón directo de WhatsApp para cada clienta con mensaje preescrito.
   - Modal para añadir citas manuales presenciales o telefónicas.
   - Exportación de la agenda en formato Excel / CSV.

7. **Páginas Legales Adaptadas (RGPD, LOPDGDD y LSSI-CE):**
   - Aviso Legal (`/aviso-legal.html`)
   - Política de Privacidad (`/privacidad.html`)
   - Política de Cookies (`/cookies.html`) con banner informativo AEPD.

---

## 🚀 Despliegue en Vercel

Configuración limpia con funciones serverless Node.js en `/api/*` y enrutamiento en `vercel.json`.
Para desplegar:
```bash
cmd /c npx vercel --prod
```
