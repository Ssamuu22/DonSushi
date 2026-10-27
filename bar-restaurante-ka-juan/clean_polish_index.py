import re

with open(r"c:\Users\river\Downloads\Don SUshi\bar-restaurante-ka-juan\index.html", "r", encoding="utf-8") as f:
    html = f.read()

clean_gmaps_url = "https://www.google.es/maps/place/Bar+restaurante+KA+Juan/@40.1040795,-4.8273079,17z/data=!4m7!3m6!1s0xd4011ede96d6c13:0xbab090523329bdf9!8m2!3d40.1040795!4d-4.8273079!10e5!16s%2Fg%2F1tv25fmh"

# Clean any broken url artifacts
html = re.sub(r'https://www\.google\.es/maps/place/Bar\+restaurante\+KA\+Juan/[^\s"\'<>]*', clean_gmaps_url, html)

# Fix brand logo in navbar
html = html.replace('''    <a href="#" class="brand-link">
      <div class="brand-emblem">🍷</div>
      <div class="brand-text">
        <span class="brand-name">YANTAR</span>
        <span class="brand-city">TOLEDO</span>
      </div>
    </a>''', f'''    <a href="#" class="brand-link">
      <div class="brand-emblem" style="background: linear-gradient(135deg, #e27d3b, #8f4012); border-color: var(--cobre);">🥩</div>
      <div class="brand-text">
        <span class="brand-name" style="font-size: 1.25rem; letter-spacing: 1.5px;">KA JUAN</span>
        <span class="brand-city" style="color: var(--cobre); letter-spacing: 2px;">SOTILLO DE LAS PALOMAS</span>
      </div>
    </a>''')

# Fix navbar button text color
html = html.replace('color: #0a0b0d;\n  font-weight: 800;\n  padding: 12px 22px;\n  border-radius: 10px;\n  font-size: 0.85rem;\n  letter-spacing: 1px;\n  text-transform: uppercase;',
                    'color: #ffffff;\n  font-weight: 800;\n  padding: 12px 22px;\n  border-radius: 10px;\n  font-size: 0.85rem;\n  letter-spacing: 1px;\n  text-transform: uppercase;')

# Fix top bar badge
html = html.replace('<span class="top-ta-badge">⭐ 4.5 en Google Maps</span>', '<span class="top-ta-badge" style="background: rgba(226, 125, 59, 0.2); border-color: var(--cobre); color: #fff;">⭐ 4.7 en Google Maps (+200 Reseñas)</span>')
html = html.replace('<span>Chuletón a la Brasa & Cocina Tradicional</span>', '<span>Carne de Angus Madurada & Brasas de Pueblo</span>')

# Fix Hero text
hero_badges = f'''        <div class="hero-badges-wrap">
          <span class="hero-badge-main" style="background: rgba(226, 125, 59, 0.15); border-color: var(--cobre); color: #fff;">🥩 Especialistas en Carne de Angus</span>
          <a href="{clean_gmaps_url}" target="_blank" class="hero-badge-ta" style="background: rgba(251, 188, 4, 0.15); border-color: #fbbc04; color: #fbbc04;">
            <span>⭐</span> Google Maps 4.7 / 5 (Verificado)
          </a>
        </div>'''

html = re.sub(r'<div class="hero-badges-wrap">.*?</a>\s*</div>', hero_badges, html, flags=re.DOTALL)

html = html.replace('El Placer del <span>Buen KA Juan</span> en Sotillo de las Palomas', 'La Mejor Carne de <span>Angus Madurada</span> en la Sierra de San Vicente')
html = html.replace('Carnes nobles a la brasa, guisos históricos y sabor casero', 'Bar Restaurante KA Juan · Sotillo de las Palomas (Toledo)')
html = html.replace('Desde nuestro célebre chuletón madurado y la perdiz roja estofada a la toledana, hasta la carrillada ibérica melosa y pescados de lonja. Una propuesta gastronómica auténtica con imágenes reales de nuestros comensales.',
                    'Famoso por su carne de Angus madurada de primerísima calidad, chuletones a la brasa, croquetas caseras de rabo de toro y chipirón con alioli, saquitos de carrillera y sus célebres torrijas artesanales. Auténtica gastronomía toledana en un entorno rural acogedor.')

# Showcase card on hero
html = html.replace('Google Maps 4.5 ★', 'Google Maps 4.7 ★')
html = html.replace('Chuletón Madurado a la Brasa', 'Chuletón de Angus Madurado')
html = html.replace('Corte seleccionado de vaca con más de 40 días de maduración dry aged, sellado al calor de las brasas de encina con sal de escamas y pimientos asados.',
                    'Corte seleccionado de Angus con más de 30 días de maduración en cámara, veteado perfecto e intensidad inigualable, sellado a la brasa de encina con escamas de sal.')

# Bento gallery captions
html = html.replace('Galería Oficial de Comensales & Sala', 'Galería Fotográfica Real de Bar Restaurante KA Juan')
html = re.sub(r'Imágenes tomadas en directo en Bar Restaurante KA Juan procedentes de.*?Haz clic sobre cualquier foto para ampliarla\.',
              f'Fotografías reales tomadas en directo en nuestro establecimiento en Sotillo de las Palomas, procedentes de <a href="{clean_gmaps_url}" target="_blank" style="color:var(--cobre); text-decoration:underline; font-weight:700;">nuestro perfil verificado de Google Maps</a>. Haz clic en cualquier imagen para verla en alta resolución.',
              html, flags=re.DOTALL)

# Bento items captions
html = html.replace('Salón Rústico Noble Castellano', 'Comedor de Sala Rústico')
html = html.replace('Perdiz a la Toledana', 'Croquetas Caseras de Rabo de Toro')
html = html.replace('Plato insignia de caza menor', 'Bechamel cremosa con estofado noble de 6 horas')
html = html.replace('Carrillada Ibérica', 'Croquetas de Chipirones en su Tinta')
html = html.replace('Cocción de 8h que se deshace', 'Con alioli casero suave y rebozado crujiente')
html = html.replace('Salmón de Lonja', 'Saquitos de Carrillera & Raciones')
html = html.replace('Jugoso y con verduritas frescas', 'Pasta filo horneada y crujiente para compartir')
html = html.replace('Celebraciones y Comuniones', 'Terraza Plaza de la Iglesia')
html = html.replace('Menús especiales personalizados', 'Ambiente al aire libre en Sotillo de las Palomas')
html = html.replace('Guisos de Cuchara Tradicionales', 'Chuletón de Angus a la Brasa de Encina')
html = html.replace('Elaborados a diario con legumbres y verduras de la vega del Tajo', 'Carne roja con maduración noble y corte supremo al fuego')
html = html.replace('Emplatados de Autor', 'Parrilla & Fuego Vivo')
html = html.replace('Postres de la Casa', 'Torrijas Caramelizadas con Helado')

# Spaces section images and texts
html = html.replace('Salón Noble', 'Comedor de Sala Rústico')
html = html.replace('El Rincón de Brasas', 'La Brasa de Carbón & Angus')
html = html.replace('Vistas al corte y sellado en directo de nuestros chuletones y asados al calor del fuego vivo.',
                    'Parrilla tradicional donde asamos al punto exacto los chuletones de Angus y cortes de ibérico al fuego de leña.')
html = html.replace('Eventos & Comuniones', 'Terraza Exterior Sierra de San Vicente')
html = html.replace('Montajes especiales de gala para bautizos, comuniones, comidas de empresa y reuniones familiares.',
                    'Terraza situada en la Calle la Iglesia, el rincón idóneo para comer al sol, tapear con cañas y cenar en las noches de verano.')
html = html.replace('Bienvenida & Entrada', 'Barra de Pueblo & Tapeo Diario')
html = html.replace('Fácil acceso, recibimiento profesional y zona de aparcamiento cómodo para todos los comensales.',
                    'El punto de encuentro tradicional de Sotillo de las Palomas: vermú de grifo, raciones generosas y trato familiar cercano.')

# Replace space images
html = html.replace('<img src="assets/interior-salon.jpg" alt="Salón Principal Bar Restaurante KA Juan" class="space-img">',
                    '<img src="assets/ka_juan_17.jpg" alt="Comedor de Sala Rústico Bar Restaurante KA Juan" class="space-img">')
html = html.replace('<img src="assets/chuleton.jpg" alt="Zona de brasas Bar Restaurante KA Juan" class="space-img">',
                    '<img src="assets/ka_juan_08.jpg" alt="Brasa de Angus Bar Restaurante KA Juan" class="space-img">')
html = html.replace('<img src="assets/comunion-eventos.jpg" alt="Celebraciones y banquetes" class="space-img">',
                    '<img src="assets/ka_juan_12.jpg" alt="Terraza al aire libre Bar Restaurante KA Juan" class="space-img">')
html = html.replace('<img src="assets/entrada-restaurante.jpg" alt="Fachada y bienvenida Bar Restaurante KA Juan" class="space-img">',
                    '<img src="assets/ka_juan_22.jpg" alt="Barra tradicional Bar Restaurante KA Juan" class="space-img">')

# Footer corrections
html = html.replace('Cocina tradicional toledana, carnes a la brasa de encina, asados y celebraciones en la provincia de Sotillo de las Palomas.',
                    'Especialistas en carne de Angus madurada, chuletones a la brasa, croquetas caseras de rabo de toro y chipirón, y cocina tradicional en Sotillo de las Palomas (Toledo), Sierra de San Vicente.')
html = html.replace('<div class="brand-emblem" style="width:38px; height:38px; font-size:18px;">🍷</div>',
                    '<div class="brand-emblem" style="width:38px; height:38px; font-size:18px; background:linear-gradient(135deg, #e27d3b, #8f4012); border-color:var(--cobre);">🥩</div>')

# Floating WA message
html = html.replace('text=Hola,%20me%20gustar%C3%ADa%20informaci%C3%B3n%20para%20reservar%20en%20Restaurante%20KA Juan%20Sotillo de las Palomas',
                    'text=Hola%20Bar%20Restaurante%20KA%20Juan,%20quisiera%20reservar%20una%20mesa%20en%20Sotillo%20de%20las%20Palomas')
html = html.replace('text=Hola,%20quisiera%20reservar%20en%20Restaurante%20KA Juan%20Sotillo de las Palomas',
                    'text=Hola%20Bar%20Restaurante%20KA%20Juan,%20quisiera%20consultar%20disponibilidad%20para%20reservar')

# Write output
with open(r"c:\Users\river\Downloads\Don SUshi\bar-restaurante-ka-juan\index.html", "w", encoding="utf-8") as f:
    f.write(html)

with open(r"c:\Users\river\Downloads\Don SUshi\bar-restaurante-ka-juan\public\index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Polish completed successfully!")
