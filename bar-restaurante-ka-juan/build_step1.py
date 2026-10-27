import re

with open(r"c:\Users\river\Downloads\Don SUshi\restaurante-yantar-toledo\index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Colors replacement
# --oro: #c99738 -> --cobre: #e27d3b
# --oro-claro: #dfb259 -> --cobre-claro: #f59e5b
# --oro-oscuro: #9b6f1e -> --cobre-oscuro: #b8571b
# --oro-glow: rgba(201, 151, 56, 0.35) -> rgba(226, 125, 59, 0.35)
# --borde: rgba(201, 151, 56, 0.25) -> rgba(226, 125, 59, 0.28)
# Carbon shades:
# #0a0b0d -> #0c0a08
# #111216 -> #14110e
# #181920 -> #1d1814
# #22242c -> #27211b
# #2e303b -> #362e26

replacements = [
    # Metadata and Title
    ("Restaurante Yantar Toledo · Alta Cocina Castellana, Horno de Leña y Brasas", "Bar Restaurante KA Juan · Sotillo de las Palomas (Toledo) · Carnes Angus & Brasas"),
    ("Restaurante Yantar Toledo. Cocina tradicional toledana y carnes a la brasa. Chuletón madurado, perdiz estofada a la toledana, carrillada ibérica, salmón fresco, asados de leña y celebraciones. Reserva tu mesa online con confirmación inmediata.",
     "Bar Restaurante KA Juan en Sotillo de las Palomas (Toledo), Sierra de San Vicente. Especialistas en carne de Angus madurada, chuletones a la brasa, croquetas caseras de rabo de toro y chipirón, saquitos de carrillera y torrijas artesanales. Reserva tu mesa online en directo con confirmación inmediata."),
    
    # CSS root colors
    ("--oro: #c99738;", "--cobre: #e27d3b;"),
    ("--oro-claro: #dfb259;", "--cobre-claro: #f59e5b;"),
    ("--oro-oscuro: #9b6f1e;", "--cobre-oscuro: #b8571b;"),
    ("--oro-glow: rgba(201, 151, 56, 0.35);", "--cobre-glow: rgba(226, 125, 59, 0.35);"),
    ("--carbon-950: #0a0b0d;", "--carbon-950: #0c0a08;"),
    ("--carbon-900: #111216;", "--carbon-900: #14110e;"),
    ("--carbon-800: #181920;", "--carbon-800: #1d1814;"),
    ("--carbon-700: #22242c;", "--carbon-700: #27211b;"),
    ("--carbon-600: #2e303b;", "--carbon-600: #362e26;"),
    ("--borde: rgba(201, 151, 56, 0.25);", "--borde: rgba(226, 125, 59, 0.28);"),
    ("rgba(201, 151, 56, 0.08)", "rgba(226, 125, 59, 0.08)"),
    ("rgba(201, 151, 56, 0.12)", "rgba(226, 125, 59, 0.12)"),
    ("rgba(201, 151, 56, 0.15)", "rgba(226, 125, 59, 0.15)"),
    ("rgba(201, 151, 56, 0.2)", "rgba(226, 125, 59, 0.2)"),
    ("rgba(201, 151, 56, 0.22)", "rgba(226, 125, 59, 0.22)"),
    ("rgba(201, 151, 56, 0.3)", "rgba(226, 125, 59, 0.3)"),
    ("rgba(201, 151, 56, 0.35)", "rgba(226, 125, 59, 0.35)"),
    ("rgba(201, 151, 56, 0.4)", "rgba(226, 125, 59, 0.4)"),
    ("rgba(201, 151, 56, 0.5)", "rgba(226, 125, 59, 0.5)"),
    ("rgba(201, 151, 56, 0.6)", "rgba(226, 125, 59, 0.6)"),
    ("var(--oro)", "var(--cobre)"),
    ("var(--oro-claro)", "var(--cobre-claro)"),
    ("var(--oro-oscuro)", "var(--cobre-oscuro)"),
    ("var(--oro-glow)", "var(--cobre-glow)"),
    ("#c99738", "#e27d3b"),
    ("#dfb259", "#f59e5b"),
    ("#9b6f1e", "#b8571b"),
    ("#b07d25", "#b8571b"),
    ("#8c6018", "#8f4012"),

    # Branding
    ("Restaurante Yantar Toledo", "Bar Restaurante KA Juan"),
    ("RESTAURANTE YANTAR TOLEDO", "BAR RESTAURANTE KA JUAN"),
    ("Restaurante Yantar", "Bar Restaurante KA Juan"),
    ("Yantar Toledo", "KA Juan Sotillo"),
    ("Yantar", "KA Juan"),

    # Town & geography
    ("Toledo Capital", "Sotillo de las Palomas"),
    ("Casco Histórico de Toledo", "Sotillo de las Palomas (Sierra de San Vicente)"),
    ("Calle Santo Tomé, 14, 45002 Toledo", "Calle la Iglesia, s/n, 45635 Sotillo de las Palomas, Toledo"),
    ("Calle Santo Tomé", "Calle la Iglesia"),
    ("Toledo", "Sotillo de las Palomas"),

    # Phone numbers
    ("925 25 36 47", "605 15 79 21"),
    ("+34 925 25 36 47", "+34 605 15 79 21"),
    ("34925253647", "34605157921"),
    ("600 00 00 00", "605 15 79 21"),

    # Booking code prefix
    ("#YT-", "#KJ-"),
    ("YT-", "KJ-"),
    ("yantar_admin_token", "kajuan_admin_token"),
    ("yantar_reservas_offline", "kajuan_reservas_offline"),
]

for old, new in replacements:
    html = html.replace(old, new)

print("Pass 1 completed. Checking images & sections...")

# Save intermediate
with open("intermediate.html", "w", encoding="utf-8") as f:
    f.write(html)
