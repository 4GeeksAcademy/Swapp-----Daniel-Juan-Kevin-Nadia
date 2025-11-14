import os
import urllib.parse
from flask import Blueprint, request, redirect, current_app, url_for
from flask_jwt_extended import create_access_token, create_refresh_token
from api.extensions import oauth
from api.models import db, Usuario

auth = Blueprint("auth", __name__)

@auth.route("/auth/google/login")
def google_login():
    redirect_uri = os.getenv("FRONTEND_URL")  # solo para fallback
    callback_url = url_for("auth.google_callback", _external=True)
    return oauth.google.authorize_redirect(callback_url)

@auth.route("/auth/google/callback")
def google_callback():
    try:
        token = oauth.google.authorize_access_token()
        if not token:
            print("🔥 No se recibió token de Google")
            raise Exception("No token")

        # Obtener userinfo SIEMPRE desde endpoint oficial
        userinfo = oauth.google.userinfo()

        if not userinfo:
            print("🔥 No se pudo obtener userinfo")
            raise Exception("No userinfo")

        nombre = userinfo.get("given_name", "")
        apellido = userinfo.get("family_name", "")
        email = userinfo["email"]
        picture = userinfo.get("picture", "")

        usuario = Usuario.query.filter_by(correo_electronico=email).first()

        if not usuario:
            usuario = Usuario(
                nombre=nombre,
                apellido=apellido,
                correo_electronico=email,
                foto_perfil=picture,
                contrasena="google_oauth_dummy",
            )
            db.session.add(usuario)
        else:
            usuario.nombre = nombre
            usuario.apellido = apellido
            if not usuario.foto_perfil:
                usuario.foto_perfil = picture

        db.session.commit()

        access = create_access_token(identity=email)
        refresh = create_refresh_token(identity=email)

        frontend = os.getenv("FRONTEND_URL", "http://localhost:3000")

        params = urllib.parse.urlencode({
            "token": access,
            "refresh_token": refresh,
            "id_usuario": usuario.id_usuario,
            "nombre": usuario.nombre,
            "apellido": usuario.apellido,
            "email": usuario.correo_electronico,
            "picture": usuario.foto_perfil,
        })

        return redirect(f"{frontend}/auth/google/callback?{params}")

    except Exception as e:
        print("🔥 Error en google_callback:", e)
        return redirect(os.getenv("FRONTEND_URL", "/"))

