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

# --- Datos Iniciales (solo si no existen) ---
echo "📚 Comprobando datos iniciales..."
pipenv run python - <<'EOF'
from api.models import Categoria, Usuario, Habilidad, db
from api.app import app

with app.app_context():
    if Categoria.query.count() == 0:
        print("➡ Insertando categorías iniciales")
        from api.init.ins_hab_categ import init_categorias
        init_categorias()
    if Habilidad.query.count() == 0:
        print("➡ Insertando habilidades iniciales")
        from api.init.ins_hab_categ import init_habilidades
        init_habilidades()
    if Usuario.query.count() == 0:
        print("➡ Insertando usuario base")
        from api.init.usuarios_init import init_usuarios
        init_usuarios()
    print("✔ Datos iniciales OK")
EOF

echo "✅ Despliegue completado exitosamente."
