#!/bin/zsh
set -e

SOURCE_ENV_FILE="environment.txt"
TARGET_ENV_FILE=".env"

EXCLUDE_VARS=("DATABASE_URL")

pipenv_run() {
    pipenv run "$@"
}

copy_env() {
    if [[ -f "$SOURCE_ENV_FILE" ]]; then
        cp "$SOURCE_ENV_FILE" "$TARGET_ENV_FILE.tmp"

        for var in "${EXCLUDE_VARS[@]}"; do
            sed -i "/^${var}=/d" "$TARGET_ENV_FILE.tmp"
        done

        mv "$TARGET_ENV_FILE.tmp" "$TARGET_ENV_FILE"
        echo -e "\e[32mINFO Variables de entorno Copiadas!\e[0m"
    else
        echo -e "\e[31mERROR No se encontró $SOURCE_ENV_FILE\e[0m"
        exit 1
    fi
}

migrations() {
    echo -e "\e[34mINFO Iniciando migraciones...\e[0m"

    [[ -d "migrations" ]] && rm -rf migrations && echo -e "\e[36mINFO Eliminado directorio migrations/\e[0m"
    [[ -d "diagrams" ]] && rm -rf diagrams && echo -e "\e[36mINFO Eliminado directorio diagrams/\e[0m"
    [[ -f "local.db" ]] && rm -f local.db && echo -e "\e[36mINFO Eliminado archivo local.db\e[0m"

    pipenv_run init
    pipenv_run migrate
    pipenv_run upgrade
    pipenv_run diagram

    echo "\e[32mINFO Migraciones finalizadas!\e[0m"
}

load_data() {
    DIR="$(pwd)/api/init"

    echo -e "\e[34mINFO Agregando información a la Base de Datos..\e[0m"
    for file in $DIR/*.py; do
        file_name=$(basename "$file" .py)
        if [[ "$file_name" != "__init__" ]]; then
            echo -e "\e[33mINFO => Ejecutando $file_name.py...\e[0m"
            pipenv_run python -m "api.init.$file_name"
        fi
    done
    echo -e "\e[32mINFO Datos agregados correctamente!\e[0m"
}

copy_env
migrations
load_data

echo "\e[32mSUCCESS Migración Completada!\e[0m"