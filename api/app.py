"""
    This module takes care of starting the API Server,
    Loading the DB and Adding the endpoints
"""
import os
from datetime import timedelta
from pathlib import Path
from dotenv import load_dotenv
from flask import Flask
from flask import send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from authlib.integrations.flask_client import OAuth
from api.utils import APIException
# from api.utils import generate_sitemap
from api.admin import setup_admin
from api.models import db
from api.urls.usuario import usuarios
from api.urls.habilidades import habilidades
from api.urls.categorias import categorias
from api.urls.mensaje import mensajes
from api.urls.intercambio import intercambios
from api.urls.puntuacion import puntuaciones
from api.cloudinary.routes import cloudinary_routes


load_dotenv()


BASE_DIR = os.path.abspath(os.path.dirname(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "../dist")

app = Flask(__name__,  static_folder=STATIC_DIR, static_url_path="/")
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
app.config["SECRET_KEY"] = os.getenv("FLASK_APP_KEY")


MIGRATE = Migrate(app, db)
db.init_app(app)
CORS(app)
setup_admin(app)
jwt = JWTManager(app)
oauth = OAuth()


@app.errorhandler(APIException)
def handle_invalid_usage():
    """ Handle/serialize errors like a JSON object """
    return {}


# @app.route('/')
# def sitemap():
    #  """ generate sitemap with all your endpoints """
    # return generate_sitemap(app)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    """Front"""
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


app.register_blueprint(cloudinary_routes)
app.register_blueprint(usuarios)
app.register_blueprint(habilidades)
app.register_blueprint(categorias)
app.register_blueprint(mensajes)
app.register_blueprint(intercambios)
app.register_blueprint(puntuaciones)
