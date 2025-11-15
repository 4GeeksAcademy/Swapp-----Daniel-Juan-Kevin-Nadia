#############################################
#              STAGE 1: FRONTEND            #
#############################################
FROM node:18 AS frontend
WORKDIR /app

# Copiar el código del frontend
COPY front/ ./front/

# Instalar dependencias y construir
RUN cd front && npm install && npm run build


#############################################
#              STAGE 2: BACKEND             #
#############################################
FROM python:3.11-slim AS backend
WORKDIR /app

# Instalar dependencias del sistema necesarias para compilar paquetes Python
RUN apt-get update && apt-get install -y \
    build-essential \
    && apt-get clean

# Copiar backend
COPY api/ ./api/

# Copiar requirements dentro de /app
COPY api/requirements.txt .

# Instalar dependencias del backend
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el frontend compilado al backend
COPY --from=frontend /app/front/dist ./api/static/

# Render usa la var PORT obligatoriamente
ENV PORT=10000
EXPOSE 10000

# Iniciar la app Flask via Gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:10000", "api.app:app"]
