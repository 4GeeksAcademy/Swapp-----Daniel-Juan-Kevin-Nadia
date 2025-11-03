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
if [ ! -d "migrations" ]; then
  pipenv run flask db init
  pipenv run flask db migrate
fi

pipenv run flask db upgrade

# --- Datos Iniciales ---
echo "📚 Cargando datos iniciales..."
pipenv run python -m api.init.usuarios_init
pipenv run python -m api.init.ins_hab_categ

echo "✅ Despliegue completado exitosamente."
