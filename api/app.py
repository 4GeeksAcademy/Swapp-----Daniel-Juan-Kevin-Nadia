"""
    This module takes care of starting the API Server,
    Loading the DB and Adding the endpoints
"""
import os
from datetime import timedelta
from pathlib import Path
from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_cors import CORS
from utils import APIException, generate_sitemap
from admin import setup_admin
from models import db
from flask_jwt_extended import JWTManager
from urls.usuario import usuarios
from urls.habilidades import habilidades
from urls.categorias import categorias


app = Flask(__name__)
app.url_map.strict_slashes = False

DB_URL = os.getenv("DATABASE_URL")

if DB_URL:
    if DB_URL.startswith("postgres://"):
        DB_URL = DB_URL.replace("postgres://", "postgresql://", 1)
else:
    BASE_DIR = Path(__file__).resolve().parent.parent
    db_path = BASE_DIR / "local.db"
    DB_URL = f"sqlite:///{db_path}"

print(f" * Base de datos usada: {DB_URL}")
app.config["SQLALCHEMY_DATABASE_URI"] = DB_URL
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=6)

MIGRATE = Migrate(app, db)
db.init_app(app)
CORS(app)
setup_admin(app)
jwt = JWTManager(app)


@app.errorhandler(APIException)
def handle_invalid_usage(error):
    """ Handle/serialize errors like a JSON object """
    return jsonify(error.to_dict()), error.status_code


@app.route('/')
def sitemap():
    """ generate sitemap with all your endpoints """
    return generate_sitemap(app)


app.register_blueprint(usuarios)
app.register_blueprint(habilidades)
app.register_blueprint(categorias)
