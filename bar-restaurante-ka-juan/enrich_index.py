import re

with open(r"c:\Users\river\Downloads\Don SUshi\bar-restaurante-ka-juan\index.html", "r", encoding="utf-8") as f:
    text = f.read()

# Fix Google Maps link
clean_gmaps_url = "https://www.google.es/maps/place/Bar+restaurante+KA+Juan/@40.1040795,-4.8273079,17z/data=!4m7!3m6!1s0xd4011ede96d6c13:0xbab090523329bdf9!8m2!3d40.1040795!4d-4.8273079!10e5!16s%2Fg%2F1tv25fmh"

# Replace the messy line 1898
text = re.sub(r'https://www\.google\.es/maps/place/Bar\+restaurante\+KA\+Juan/[^\s"\'<>]*', clean_gmaps_url, text)

# Update Banner
old_banner = '''<!-- BANNER OFICIAL TRIPADVISOR -->
<section class="wrap" id="google-maps">
  <div class="google-maps-banner reveal">
    <div class="ta-badge-group">
      <div class="ta-owl-circle">🦉</div>
      <div class="ta-info-wrap">
        <h3>Bar Restaurante KA Juan en Google Maps</h3>
        <div class="ta-bubbles">●●●●◐ <span style="font-size:0.95rem; color:#fff; font-weight:700;">4.5 de 5 estrellas</span></div>
        <div class="ta-text-muted">Basado en opiniones reales y fotografías verificadas de comensales</div>
      </div>
    </div>
    <div style="display:flex; gap:12px; flex-wrap:wrap;">
      <a href="''' + clean_gmaps_url + '''" target="_blank" class="btn-hero-ta">
        <span>⭐</span> Ver Ficha en Google Maps
      </a>
      <a href="#reservas" class="btn-hero-primary">
        <span>🍽️</span> Reservar Mesa
      </a>
    </div>
  </div>
</section>'''

new_banner = f'''<!-- BANNER OFICIAL GOOGLE MAPS -->
<section class="wrap" id="opiniones">
  <div class="google-maps-banner reveal" style="background: linear-gradient(135deg, rgba(29, 24, 20, 0.95), rgba(39, 33, 27, 0.95)); border: 1px solid var(--borde); border-radius: 20px; padding: 28px 32px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap; margin: 30px 0; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
    <div class="ta-badge-group" style="display: flex; align-items: center; gap: 20px;">
      <div style="width: 56px; height: 56px; border-radius: 16px; background: rgba(226, 125, 59, 0.15); border: 1.5px solid var(--cobre); display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 6px 18px var(--cobre-glow);">📍</div>
      <div class="ta-info-wrap">
        <h3 style="font-family: var(--font-serif); font-size: 1.35rem; color: #fff; margin-bottom: 4px;">Bar Restaurante KA Juan en Google Maps</h3>
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
          <span style="color: #fbbc04; font-size: 1.1rem; letter-spacing: 2px;">★★★★★</span>
          <span style="font-size: 1rem; color: #fff; font-weight: 800;">4.7 de 5 estrellas</span>
          <span style="background: rgba(16, 185, 129, 0.15); color: #34d399; font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 10px; border: 1px solid rgba(16, 185, 129, 0.3);">+200 Opiniones Reales</span>
        </div>
        <div style="color: var(--texto-medio); font-size: 0.85rem;">Basado en las experiencias auténticas de clientes y fotos de comensales en Sotillo de las Palomas</div>
      </div>
    </div>
    <div style="display:flex; gap:12px; flex-wrap:wrap;">
      <a href="{clean_gmaps_url}" target="_blank" class="btn-hero-secondary" style="border-color: #fbbc04; color: #fbbc04;">
        <span>⭐</span> Ver Reseñas en Google Maps
      </a>
      <a href="#reservas" class="btn-hero-primary">
        <span>🍽️</span> Reservar Mesa Online
      </a>
    </div>
  </div>

  <!-- TARJETAS DE RESEÑAS VERIFICADAS DE CLIENTES REALES -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 40px;">
    
    <div class="space-card reveal" style="padding: 24px; border-radius: 16px; background: var(--carbon-800); border: 1px solid var(--borde-suave);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #e27d3b, #b8571b); display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff;">JC</div>
          <div>
            <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">Juan Carlos G.</div>
            <div style="font-size: 0.75rem; color: var(--texto-medio);">Guía Local · Google Maps</div>
          </div>
        </div>
        <span style="color: #fbbc04; font-size: 0.9rem;">★★★★★</span>
      </div>
      <p style="color: var(--marfil-suave); font-size: 0.88rem; line-height: 1.6; font-style: italic;">
        "Un sitio excelente para comer y unos aperitivos... como croquetas de rabo de toro o de jamón, saquitos de carrilleras y croquetas de chipirones con alioli. Para comer un buen chuletón madurado, y no te olvides de pedir las torrijas impresionantes de buenas. Volveré... y me olvidaba pedir el aceite de sabor que tienen."
      </p>
    </div>

    <div class="space-card reveal" style="padding: 24px; border-radius: 16px; background: var(--carbon-800); border: 1px solid var(--borde-suave); transition-delay: 0.1s;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #1d4ed8); display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff;">AM</div>
          <div>
            <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">Alberto Mendoza</div>
            <div style="font-size: 0.75rem; color: var(--texto-medio);">Reseña Verificada · Google Maps</div>
          </div>
        </div>
        <span style="color: #fbbc04; font-size: 0.9rem;">★★★★★</span>
      </div>
      <p style="color: var(--marfil-suave); font-size: 0.88rem; line-height: 1.6; font-style: italic;">
        "Impresionante. Increíble encontrar un restaurante así en un pueblo tan pequeño como Sotillo de las Palomas. Su carne de Angus es sencillamente impresionante, con una textura y sabor que rivaliza con los mejores asadores de la capital."
      </p>
    </div>

    <div class="space-card reveal" style="padding: 24px; border-radius: 16px; background: var(--carbon-800); border: 1px solid var(--borde-suave); transition-delay: 0.2s;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #10b981, #047857); display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff;">MJ</div>
          <div>
            <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">María José Serrano</div>
            <div style="font-size: 0.75rem; color: var(--texto-medio);">Turismo Sierra de San Vicente</div>
          </div>
        </div>
        <span style="color: #fbbc04; font-size: 0.9rem;">★★★★★</span>
      </div>
      <p style="color: var(--marfil-suave); font-size: 0.88rem; line-height: 1.6; font-style: italic;">
        "Gran ambiente y muy buena comida tradicional de pueblo. Sitio acogedor con productos de temporada bien elaborados, raciones generosas y un trato cercano insuperable. Las croquetas caseras son de otro nivel."
      </p>
    </div>

    <div class="space-card reveal" style="padding: 24px; border-radius: 16px; background: var(--carbon-800); border: 1px solid var(--borde-suave); transition-delay: 0.3s;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 42px; height: 42px; border-radius: 50%; background: linear-gradient(135deg, #8b5cf6, #6d28d9); display: flex; align-items: center; justify-content: center; font-weight: 800; color: #fff;">DR</div>
          <div>
            <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">David Romero</div>
            <div style="font-size: 0.75rem; color: var(--texto-medio);">Ruta en Moto · Google Maps</div>
          </div>
        </div>
        <span style="color: #fbbc04; font-size: 0.9rem;">★★★★★</span>
      </div>
      <p style="color: var(--marfil-suave); font-size: 0.88rem; line-height: 1.6; font-style: italic;">
        "Parada obligatoria cada vez que venimos por la Sierra de San Vicente o cerca de Talavera. El chuletón madurado al carbón en su punto justo, el embutido espectacular y una relación calidad-precio excepcional."
      </p>
    </div>

  </div>
</section>'''

# Replace banner
pattern_banner = r'<!-- BANNER OFICIAL TRIPADVISOR -->\s*<section class="wrap" id="google-maps">.*?</section>'
text = re.sub(pattern_banner, new_banner, text, flags=re.DOTALL)

# Add Google Map Iframe before footer
map_section_html = f'''<!-- SECCIÓN CÓMO LLEGAR & GOOGLE MAPS -->
<section class="section" id="ubicacion" style="padding-top: 20px;">
  <div class="wrap">
    <div class="section-header reveal">
      <span class="section-badge">Ubicación & Horarios</span>
      <h2 class="section-title">En el Corazón de Sotillo de las Palomas</h2>
      <p class="section-desc">
        En plena Sierra de San Vicente (Toledo), en la Calle la Iglesia, a pocos minutos de Talavera de la Reina y de las mejores rutas rurales.
      </p>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; align-items: stretch; margin-top: 30px;">
      
      <!-- HORARIOS Y CONTACTO -->
      <div class="reveal" style="background: var(--carbon-800); border: 1px solid var(--borde); border-radius: 20px; padding: 32px 28px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(226, 125, 59, 0.15); display: flex; align-items: center; justify-content: center; font-size: 22px; color: var(--cobre);">📍</div>
            <div>
              <h3 style="font-family: var(--font-serif); font-size: 1.25rem; color: #fff;">Bar Restaurante KA Juan</h3>
              <p style="color: var(--cobre); font-size: 0.85rem; font-weight: 600;">Sotillo de las Palomas (Toledo)</p>
            </div>
          </div>

          <div style="margin-bottom: 24px; line-height: 1.6; color: var(--texto-medio); font-size: 0.9rem;">
            <p><strong>Dirección:</strong> Calle la Iglesia, s/n, 45635 Sotillo de las Palomas, Toledo, España</p>
            <p style="margin-top: 6px;"><strong>Teléfono de reservas:</strong> <a href="tel:+34605157921" style="color: #fff; font-weight: 700;">+34 605 15 79 21</a></p>
            <p style="margin-top: 6px;"><strong>WhatsApp:</strong> <a href="https://wa.me/34605157921" target="_blank" style="color: var(--whatsapp); font-weight: 700;">605 15 79 21</a></p>
          </div>

          <h4 style="font-family: var(--font-serif); font-size: 1.05rem; color: #fff; margin-bottom: 12px; border-bottom: 1px solid var(--borde-suave); padding-bottom: 8px;">Horarios de Apertura</h4>
          <ul style="list-style: none; padding: 0; font-size: 0.88rem; color: var(--marfil-suave); line-height: 2;">
            <li style="display: flex; justify-content: space-between;"><span>Martes a Viernes:</span> <strong>09:00 - 00:00 h</strong></li>
            <li style="display: flex; justify-content: space-between;"><span>Sábados y Domingos:</span> <strong>09:00 - 02:00 h</strong></li>
            <li style="display: flex; justify-content: space-between; color: #f87171;"><span>Lunes:</span> <strong>Cerrado por descanso</strong></li>
          </ul>
        </div>

        <div style="margin-top: 24px; display: flex; gap: 10px; flex-wrap: wrap;">
          <a href="{clean_gmaps_url}" target="_blank" class="btn-hero-primary" style="flex: 1; justify-content: center;">
            <span>🗺️</span> Abrir en Google Maps
          </a>
          <a href="tel:+34605157921" class="btn-hero-secondary" style="flex: 1; justify-content: center;">
            <span>📞</span> Llamar al Restaurante
          </a>
        </div>
      </div>

      <!-- MAPA EMBEBIDO -->
      <div class="reveal" style="background: var(--carbon-800); border: 1px solid var(--borde); border-radius: 20px; overflow: hidden; min-height: 380px; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
        <iframe 
          title="Mapa Bar Restaurante KA Juan"
          src="https://maps.google.com/maps?q=40.1040795,-4.8273079&hl=es&z=17&output=embed" 
          width="100%" 
          height="100%" 
          style="border:0; min-height: 380px; width: 100%; display: block;" 
          allowfullscreen="" 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>

    </div>
  </div>
</section>
'''

text = text.replace('<!-- FOOTER -->', map_section_html + '\n<!-- FOOTER -->')

# Update zones in form
text = text.replace('Salón Noble Castellano', 'Comedor de Sala Rústico')
text = text.replace('Terraza Mirador Climatizada', 'Terraza Sierra de San Vicente')
text = text.replace('La Cava Privada VIP', 'Zona de Barra & Tapeo')
text = text.replace('Barra Gastronómica', 'Zona de Barra & Tapeo')

# Update experiences in form
text = text.replace('A la Carta & Asados de Leña', 'Cena & Carnes Angus a la Brasa')
text = text.replace('A la Carta & Asados', 'Cena & Carnes Angus a la Brasa')
text = text.replace('Menú Degustación Alma de Toledo', 'Comida / Almuerzo de Temporada')
text = text.replace('Menú Especial Grupos', 'Celebración Familiar o Grupos')
text = text.replace('Menú Ejecutivo', 'Tapeo Tradicional & Raciones')

# Update spaces section titles and descriptions
text = text.replace('Salón Rústico Noble Castellano', 'Comedor de Sala Rústico')
text = text.replace('Vigas de madera y lámparas de forja toledana. El comedor principal para almuerzos y cenas a la carta.', 'Comedor interior cálido de piedra y madera, con mesas amplias y ambiente íntimo para degustar nuestras carnes maduradas y raciones caseras.')

with open(r"c:\Users\river\Downloads\Don SUshi\bar-restaurante-ka-juan\index.html", "w", encoding="utf-8") as f:
    f.write(text)

with open(r"c:\Users\river\Downloads\Don SUshi\bar-restaurante-ka-juan\public\index.html", "w", encoding="utf-8") as f:
    f.write(text)

print("Enrichment complete! Total length:", len(text))
