#!/usr/bin/env bash
# exit on error
# set -o errexit

# npm install
# npm run build

# pipenv install

# pipenv run upgrade
set -e

echo "  ¡Configurando entorno!"

# --- Python / Backend ---
python -m pip install --upgrade pip setuptools wheel --root-user-action ignore
python -m pip install --upgrade pipenv --root-user-action ignore

if [ -f Pipfile ]; then
  echo "  ¡Instalando dependencias Pipenv!"
  pipenv lock --pre
  pipenv install --dev
else
  echo "  ¡No se encontró Pipfile!"
fi

# --- Node / Frontend ---
echo "  ¡Instalando dependencias Node!"
if [ -f package.json ]; then
  npm install
else
  echo "  ¡No se encontró package.json!"
fi

# --- Ohmyzsh ---
export RUNZSH=no
export CHSH=no
sh -c "$(curl -fsSL https://install.ohmyz.sh/)"

echo "✔ ¡Entorno configurado correctamente!"
