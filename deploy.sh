#!/usr/bin/env bash
set -e

echo "🚀 Iniciando build de Render..."

# --- Backend ---
echo "📦 Instalando dependencias de Python..."
pip install pipenv
pipenv install --system --deploy

# --- Frontend ---
echo "🧩 Compilando frontend con Vite..."
cd front && npm install && npm run build && cd ..

# --- Copia del build ---
echo "📂 Copiando archivos compilados a Flask..."
mkdir -p api/static && cp -r front/dist/* api/static/

# --- Migraciones ---
echo "🗄️ Ejecutando migraciones de base de datos..."
flask db upgrade

# --- Carga inicial ---
echo "📚 Cargando datos iniciales..."
python -m api.init.usuarios_init
python -m api.init.ins_hab_categ

echo "✅ Despliegue completado exitosamente."
