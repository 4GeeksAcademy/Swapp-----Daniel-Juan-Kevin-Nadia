import os
from flask import Blueprint, redirect
from flask_jwt_extended import create_access_token
from authlib.integrations.flask_client import OAuth
from api.models import db, Usuario
from datetime import timedelta

auth_google = Blueprint("auth_google", __name__)

oauth = OAuth()
google = oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    access_token_url="https://accounts.google.com/o/oauth2/token",
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    api_base_url="https://www.googleapis.com/oauth2/v1/",
    client_kwargs={"scope": "openid email profile"},
)

RENDER_URL = "https://swapp-app-nw6o.onrender.com"
FRONT_URL = "https://swapp-app-nw6o.onrender.com"   # frontend en Render


@auth_google.route("/auth/google/login")
def google_login():
    redirect_uri = f"{RENDER_URL}/auth/google/callback"
    return google.authorize_redirect(redirect_uri)


@auth_google.route("/auth/google/callback")
def google_callback():
    google.authorize_access_token()
    user_info = google.get("userinfo").json()

    if not user_info or "email" not in user_info:
        return redirect(f"{FRONT_URL}/login")

    correo = user_info["email"]
    nombre = user_info.get("name", "")
    foto = user_info.get("picture", "")

    usuario = Usuario.query.filter_by(correo_electronico=correo).first()
    if not usuario:
        usuario = Usuario(
            nombre=nombre,
            correo_electronico=correo,
            contrasena="",
            imagen=foto
        )
        db.session.add(usuario)
        db.session.commit()

    access_token = create_access_token(
        identity=usuario.id, expires_delta=timedelta(days=1))
    return redirect(f"{FRONT_URL}/login?token={access_token}")
