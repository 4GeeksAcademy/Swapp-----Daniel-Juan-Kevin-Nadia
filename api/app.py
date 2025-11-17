# api/app.py
import os
from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from api.utils import APIException, generate_sitemap
from api.admin import setup_admin
from api.models import db
from api.urls.usuario import usuarios
from api.urls.habilidades import habilidades
from api.urls.categorias import categorias
from api.urls.mensaje import mensajes
from api.urls.auth_google import auth_google, oauth

# Seeds
from api.init.usuarios_init import usuarios_prueba
from api.init.ins_hab_categ import poblar_datos


def create_app():
    app = Flask(__name__)
    app.url_map.strict_slashes = False

    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "SQLALCHEMY_DATABASE_URI")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "clave_secreta")

    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)
    CORS(app)

    oauth.init_app(app)
    setup_admin(app)

    # Seeds (solo una vez)
    with app.app_context():
        usuarios_prueba()
        poblar_datos()

    # Blueprints
    app.register_blueprint(usuarios)
    app.register_blueprint(habilidades)
    app.register_blueprint(categorias)
    app.register_blueprint(mensajes)
    app.register_blueprint(auth_google)

    @app.errorhandler(APIException)
    def handle_invalid_usage(error):
        return jsonify(error.to_dict()), error.status_code

    @app.route("/")
    def sitemap():
        return generate_sitemap(app)

    return app
