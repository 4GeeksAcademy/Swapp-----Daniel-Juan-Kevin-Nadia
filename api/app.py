import os
from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from api.models import db
from api.urls.usuario import usuarios
from api.urls.habilidades import habilidades
from api.urls.categorias import categorias
from api.urls.mensaje import mensajes
from api.urls.google_oauth import google_oauth

# ⬅️ IMPORTA AQUI EL oauth Y blueprint
from api.urls.auth_google import auth_google, oauth


def create_app():
    app = Flask(__name__)
    
    # Configuración
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

    # Inicializar extensiones
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)
    CORS(app)

    # ⬅️ **MUY IMPORTANTE**
    oauth.init_app(app)

    # Registrar Blueprints
    app.register_blueprint(usuarios)
    app.register_blueprint(habilidades)
    app.register_blueprint(categorias)
    app.register_blueprint(mensajes)
    app.register_blueprint(google_oauth)

    # ⬅️ REGISTRA EL NUEVO AUTH DE GOOGLE
    app.register_blueprint(auth_google)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
