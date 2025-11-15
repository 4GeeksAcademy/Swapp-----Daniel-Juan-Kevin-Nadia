#!/usr/bin/env bash
set -e

echo "🚀 Iniciando build de Render..."

# --- Backend ---
echo "📦 Instalando dependencias de Python..."
pip install --upgrade pip
pip install pipenv
pipenv install --system --deploy

# --- Frontend ---
echo "🧩 Compilando frontend con Vite..."
cd front
npm install
npm run build
cd ..

# --- Migraciones ---
echo "🗄️ Aplicando migraciones de base de datos..."
pipenv run flask db upgrade

# --- Datos Iniciales ---
echo "📚 Cargando datos iniciales..."
pipenv run python -m api.init.usuarios_init
pipenv run python -m api.init.ins_hab_categ

echo "✅ Despliegue completado exitosamente."