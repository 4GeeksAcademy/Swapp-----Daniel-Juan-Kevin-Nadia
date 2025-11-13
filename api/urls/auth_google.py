# api/urls/auth_google.py
import os
from flask import Blueprint, redirect, url_for
from flask_jwt_extended import create_access_token
from authlib.integrations.flask_client import OAuth
from api.models import db, Usuario
from datetime import timedelta

auth_google = Blueprint("auth_google", __name__)

# Configurar OAuth (solo una vez)
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


@auth_google.route("/auth/google/login")
def google_login():
    # Esto genera la URL correcta según estés en localhost o Render
    redirect_uri = url_for("auth_google.google_callback", _external=True)
    return google.authorize_redirect(redirect_uri)


@auth_google.route("/auth/google/callback")
def google_callback():
    try:
        token = google.authorize_access_token()
        user_info = google.get("userinfo").json()
    except Exception as e:
        print("ERROR GOOGLE:", e)
        return redirect("http://localhost:3000/login")

    if not user_info or "email" not in user_info:
        return redirect("http://localhost:3000/login")

    correo = user_info["email"]
    nombre = user_info.get("name", "")
    foto = user_info.get("picture", "")

    # Verificar si el usuario ya existe
    usuario = Usuario.query.filter_by(correo_electronico=correo).first()
    if not usuario:
        usuario = Usuario(
            nombre=nombre,
            correo_electronico=correo,
            contrasena="",
            imagen=foto,
        )
        db.session.add(usuario)
        db.session.commit()

    access_token = create_access_token(
        identity=usuario.id, expires_delta=timedelta(days=1)
    )

    # URL del frontend (Render o local)
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # Redirigir a login con el token en la URL: /login?token=...
    return redirect(f"{FRONTEND_URL}/login?token={access_token}")
