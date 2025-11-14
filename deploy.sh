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

# 1) Usuarios iniciales
pipenv run python -m api.init.usuarios_init

# 2) Categorías y habilidades
#    ⚠ Aquí no importamos ninguna función manualmente
#    El módulo ejecuta poblar_datos() con el if __name__ == "__main__"
pipenv run python -m api.init.ins_hab_categ

echo "✅ Despliegue completado exitosamente."
