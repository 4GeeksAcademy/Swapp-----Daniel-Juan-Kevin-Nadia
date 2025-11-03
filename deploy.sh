#!/usr/bin/env bash
set -e

echo "🚀 Iniciando build de Render..."

# --- Backend ---
echo "📦 Instalando dependencias de Python..."
pip install pipenv
pipenv install --system --deploy

# --- Frontend ---
echo "🧩 Compilando frontend con Vite..."
npm install
npm run build

# --- Copia del build ---
echo "📂 Copiando archivos compilados a Flask..."
mkdir -p api/static/
cp -r dist/* api/static/

# --- Migraciones ---
echo "🗄️ Ejecutando migraciones de base de datos..."
flask db upgrade

echo "✅ Despliegue completado exitosamente."
