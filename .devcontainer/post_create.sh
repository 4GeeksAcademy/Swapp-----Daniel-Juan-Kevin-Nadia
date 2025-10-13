#!/bin/sh
set -e

echo "- Configurando entorno fullstack..."

# --- Python / Backend ---
echo "+ Instalando dependencias Python..."
python -m pip install --upgrade pip setuptools wheel --root-user-action ignore
python -m pip install --upgrade pipenv --root-user-action ignore

if [ -f Pipfile ]; then
  echo "+ Encontrado Pipfile, instalando entorno Pipenv..."
  pipenv lock --pre
  pipenv install --dev
else
  echo "- No se encontró Pipfile, saltando instalación de backend"
fi

# --- Node / Frontend ---
echo "+ Instalando dependencias Node..."
if [ -f package.json ]; then
  npm install
else
  echo "- No se encontró package.json, saltando instalación de frontend"
fi

echo "-- Entorno listo. Puedes iniciar Flask y React sin problemas."