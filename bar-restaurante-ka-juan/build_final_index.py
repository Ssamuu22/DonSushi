import re

# Read intermediate.html
with open(r"c:\Users\river\Downloads\Don SUshi\intermediate.html", "r", encoding="utf-8") as f:
    text = f.read()

# Replace any lingering mentions of Yantar or Toledo
text = re.sub(r'YANTAR TOLEDO', 'BAR RESTAURANTE KA JUAN', text, flags=re.IGNORECASE)
text = text.replace('Yantar', 'KA Juan')
text = text.replace('yantar', 'kajuan')
text = text.replace('925 59 66 40', '605 15 79 21')
text = text.replace('925596640', '605157921')
text = text.replace('644 12 34 56', '605 15 79 21')
text = text.replace('644123456', '605157921')

# Replace TripAdvisor references with Google Maps (4.7 ⭐)
gmaps_url = "https://www.google.es/maps/place/Bar+restaurante+KA+Juan/@40.1040795,-4.8273079,3a,75y,90t/data=!3m8!1e2!3m6!1sCIABIhCbBsvyJmcgNlNymRfMvki9!2e10!3e12!6shttps:%2F%2Flh3.googleusercontent.com%2Fgrass-cs%2FAABkmLcknAEFtFdPgxcOukcx9vdnLTscNFEYw5L6y5rhia0_Tj8xveM63JEy_2ojECitTqYzI2YWW4PLQOjlsrRI8b9-lB-rNt_KKtnL2_bKpmvPQtpPHp_zyVSa1LXjMEfN_0i3MgVhRjsuaOAv%3Dw114-h86-k-no!7i1600!8i1200!4m7!3m6!1s0xd4011ede96d6c13:0xbab090523329bdf9!8m2!3d40.1040795!4d-4.8273079!10e5!16s%2Fg%2F1tv25fmh"

text = re.sub(r'https://www\.tripadvisor\.es/[^\s"\'<>]+', gmaps_url, text)
text = text.replace('TripAdvisor Oficial', 'Ficha Oficial en Google Maps')
text = text.replace('TripAdvisor', 'Google Maps')
text = text.replace('tripadvisor', 'google-maps')

# Bento gallery image replacements
text = text.replace('assets/interior-salon.jpg', 'assets/ka_juan_17.jpg')
text = text.replace('assets/perdiz-estofada.jpg', 'assets/ka_juan_11.jpg')
text = text.replace('assets/carrillada-iberica.jpg', 'assets/ka_juan_01.jpg')
text = text.replace('assets/salmon.jpg', 'assets/ka_juan_18.jpg')
text = text.replace('assets/comunion-eventos.jpg', 'assets/ka_juan_12.jpg')
text = text.replace('assets/comida-casera-1.jpg', 'assets/ka_juan_05.jpg')
text = text.replace('assets/gourmet-1.jpg', 'assets/ka_juan_08.jpg')
text = text.replace('assets/postre-dulce.jpg', 'assets/ka_juan_06.jpg')
text = text.replace('assets/chuleton.jpg', 'assets/ka_juan_08.jpg')
text = text.replace('assets/entrada-restaurante.jpg', 'assets/ka_juan_12.jpg')
text = text.replace('assets/comida-casera-2.jpg', 'assets/ka_juan_07.jpg')
text = text.replace('assets/comida-casera-3.jpg', 'assets/ka_juan_03.jpg')
text = text.replace('assets/comida-casera-4.jpg', 'assets/ka_juan_04.jpg')
text = text.replace('assets/gourmet-2.jpg', 'assets/ka_juan_11.jpg')
text = text.replace('assets/gourmet-3.jpg', 'assets/ka_juan_13.jpg')
text = text.replace('assets/guiso-cuchara.jpg', 'assets/ka_juan_07.jpg')
text = text.replace('assets/plato-mesa.jpg', 'assets/ka_juan_10.jpg')

# Replace Carta dishes definitions with KA Juan specialty dishes
carta_js_replacement = """const CARTA = {
  carnes: [
    {
      nombre: 'Chuletón de Angus Madurado a la Brasa de Encina',
      precio: '28,50 €',
      desc: 'Lomo alto de vacuno Angus seleccionado con más de 30 días de maduración en cámara seca. Veteado noble, sellado a la brasa viva y servido con escamas de sal marina.',
      img: 'assets/ka_juan_08.jpg',
      badge: 'Plato Insignia',
      alergenos: 'Sin gluten'
    },
    {
      nombre: 'Entrecot de Angus Selección Sierra de San Vicente',
      precio: '24,00 €',
      desc: 'Corte jugoso y tierno a la parrilla de carbón vegetal, con guarnición de patatas rústicas fritas al estilo casero y pimientos rojos confitados.',
      img: 'assets/ka_juan_05.jpg',
      badge: 'Corte Premium',
      alergenos: 'Sin gluten'
    },
    {
      nombre: 'Solomillo Ibérico Sellado al Carbón con Escamas de Sal',
      precio: '22,50 €',
      desc: 'Medallón noble de solomillo de cerdo ibérico criado en dehesa, jugoso y dorado con reducción suave de vino y setas de temporada.',
      img: 'assets/ka_juan_13.jpg',
      badge: 'Muy Tierno',
      alergenos: 'Sin gluten'
    },
    {
      nombre: 'Costillar de Cerdo Meloso a la Brasa de Leña',
      precio: '18,50 €',
      desc: 'Costillar macerado con especias del monte y asado lentamente hasta desprenderse del hueso. Pura tradición campera.',
      img: 'assets/ka_juan_04.jpg',
      badge: 'Brasa Viva',
      alergenos: 'Sin gluten'
    }
  ],
  tapas: [
    {
      nombre: 'Croquetas Caseras de Rabo de Toro Meloso',
      precio: '13,50 €',
      desc: 'Elaboradas a mano a diario con el auténtico estofado de rabo de toro deshilachado a fuego lento. Rebozado extra fino y crujiente.',
      img: 'assets/ka_juan_11.jpg',
      badge: 'Top Ventas',
      alergenos: 'Gluten, Lácteos'
    },
    {
      nombre: 'Croquetas de Chipirones en su Tinta con Alioli',
      precio: '13,50 €',
      desc: 'Croquetas negras rellenas de chipirón salteado en su tinta natural, coronadas con suave emulsión casera de alioli suave.',
      img: 'assets/ka_juan_01.jpg',
      badge: 'Imprescindible',
      alergenos: 'Moluscos, Gluten, Huevo'
    },
    {
      nombre: 'Saquitos Crujientes de Carrillera Ibérica',
      precio: '14,00 €',
      desc: 'Finos saquitos de pasta filo crujiente horneados con relleno meloso de carrillada y cebolla pochada al caramelo.',
      img: 'assets/ka_juan_18.jpg',
      badge: 'Favorito',
      alergenos: 'Gluten'
    },
    {
      nombre: 'Jamón Ibérico de Bellota con Tostas y Aceite Aromatizado',
      precio: '19,50 €',
      desc: 'Jamón cortado a cuchillo al momento, servido con pan rústico de pueblo y nuestro exclusivo aceite de sabor especial.',
      img: 'assets/ka_juan_03.jpg',
      badge: 'Dehesa',
      alergenos: 'Sin gluten'
    },
    {
      nombre: 'Tabla de Queso Curado de Oveja de la Sierra',
      precio: '15,00 €',
      desc: 'Queso puro de oveja curado en cueva con aroma intenso, acompañado de nueces, almendras tostadas y confitura casera.',
      img: 'assets/ka_juan_10.jpg',
      badge: 'Artesano',
      alergenos: 'Lácteos'
    }
  ],
  guisos: [
    {
      nombre: 'Rabo de Toro Tradicional Estofado al Vino Tinto',
      precio: '19,50 €',
      desc: 'Receta de la abuela cocinada durante más de 6 horas con verduras frescas y vino de la comarca hasta conseguir una textura tiernísima.',
      img: 'assets/ka_juan_07.jpg',
      badge: 'Guiso Lento',
      alergenos: 'Sin gluten'
    },
    {
      nombre: 'Carrillada Ibérica en Salsa de Setas de San Vicente',
      precio: '18,00 €',
      desc: 'Carrilleras de cerdo ibérico guisadas a fuego pausado con boletus silvestres, patatas confitadas y salsa aterciopelada.',
      img: 'assets/ka_juan_09.jpg',
      badge: 'Tradicional',
      alergenos: 'Sin gluten'
    },
    {
      nombre: 'Judías Caseras del Barco con Chorizo y Oreja Adobada',
      precio: '14,50 €',
      desc: 'Plato de cuchara castellano reconfortante, con legumbre mantecosa y el mejor compango adobado de pueblo.',
      img: 'assets/ka_juan_14.jpg',
      badge: 'Plato de Cuchara',
      alergenos: 'Sin gluten'
    }
  ],
  postres: [
    {
      nombre: 'Torrijas Caseras Caramelizadas al Momento con Helado',
      precio: '6,50 €',
      desc: 'La joya dulce de KA Juan: pan brioche empapado en leche con canela y cítricos, tostado al soplete con azúcar crujiente y bola de helado artesano.',
      img: 'assets/ka_juan_06.jpg',
      badge: 'Postre Estrella',
      alergenos: 'Gluten, Lácteos, Huevo'
    },
    {
      nombre: 'Tarta de Queso Horneada con Mermelada de Frutos Rojos',
      precio: '6,50 €',
      desc: 'Tarta horneada suave y cremosa en su interior, con base de galleta y coulis de frambuesas y moras.',
      img: 'assets/ka_juan_19.jpg',
      badge: 'Casera',
      alergenos: 'Lácteos, Huevo'
    },
    {
      nombre: 'Mousse de Chocolate Puro con Aceite de Sabor y Escamas',
      precio: '6,00 €',
      desc: 'Mousse artesana de cacao negro 70% con un toque de sal en escamas y gotas de aceite virgen aromatizado.',
      img: 'assets/ka_juan_22.jpg',
      badge: 'Artesano',
      alergenos: 'Lácteos'
    }
  ]
};"""

# Replace the CARTA object in text
text = re.sub(r'const CARTA = \{.*?\n\};\n\nfunction renderCarta', carta_js_replacement + '\n\nfunction renderCarta', text, flags=re.DOTALL)

# Ensure menu tab buttons are carnes, tapas, guisos, postres
menu_tabs_html = """    <!-- NAVEGACIÓN DE CATEGORÍAS CARTA -->
    <div class="menu-tabs-bar reveal">
      <button class="menu-tab-btn active" onclick="cambiarCategoriaMenu('carnes', this)">
        <span>🥩</span> Carnes Angus & Brasas
      </button>
      <button class="menu-tab-btn" onclick="cambiarCategoriaMenu('tapas', this)">
        <span>🥘</span> Tapas & Raciones Estrella
      </button>
      <button class="menu-tab-btn" onclick="cambiarCategoriaMenu('guisos', this)">
        <span>🍲</span> Guisos & Cuchara
      </button>
      <button class="menu-tab-btn" onclick="cambiarCategoriaMenu('postres', this)">
        <span>🍰</span> Postres Caseros & Torrijas
      </button>
    </div>"""

text = re.sub(r'<div class="menu-tabs-bar reveal">.*?</div>\s*<!-- CONTENEDOR DE PLATOS -->', menu_tabs_html + '\n\n    <!-- CONTENEDOR DE PLATOS -->', text, flags=re.DOTALL)

# Default category to carnes
text = text.replace("renderCarta('asados');", "renderCarta('carnes');")
text = text.replace("renderCarta('carnes');", "renderCarta('carnes');")

# Save final index.html
with open(r"c:\Users\river\Downloads\Don SUshi\bar-restaurante-ka-juan\index.html", "w", encoding="utf-8") as f:
    f.write(text)

with open(r"c:\Users\river\Downloads\Don SUshi\bar-restaurante-ka-juan\public\index.html", "w", encoding="utf-8") as f:
    f.write(text)

print("Generated bar-restaurante-ka-juan/index.html & public/index.html successfully!")
print("Size:", len(text), "bytes")
