"""Autenticación con Google"""
import os
import urllib.parse
from flask import Blueprint, current_app, request, session, jsonify
from flask import redirect, url_for
from flask_jwt_extended import create_access_token, create_refresh_token
import requests
from api.models import db, Usuario
from api.extensions import google


auth = Blueprint("auth", __name__)


@auth.route("/auth/google/login", methods=["GET"])
def google_login():
    """Inicia sesión con google"""
    # session["post_auth_redirect"] = request.args.get("next", "/auth/me")

    # redirect_uri = os.getenv("OAUTH_REDIRECT_URI")
    # return current_app.oauth.google.authorize_redirect(redirect_uri)
    redirect_uri = url_for("auth.google_callback", _external=True)
    return google.authorize_redirect(redirect_uri)


@auth.route("/auth/google/callback", methods=["GET"])
def google_callback():
    """Autenticación con Google"""
    try:
        if "error" in request.args:
            print("❌ Usuario canceló acceso o no concedió permisos.")
            return redirect(
                os.getenv("FRONTEND_URL", "https://swapp-app.onrender.com"))

        token = current_app.oauth.google.authorize_access_token()
        if not token:
            print("❌ No se pudo obtener el token de Google")
            return redirect(
                os.getenv("FRONTEND_URL", "https://swapp-app.onrender.com"))

        userinfo = token.get("userinfo") \
            or current_app.oauth.google.parse_id_token(token)

        if not userinfo:
            print("❌ No se pudo obtener información del usuario")
            return redirect(
                os.getenv("FRONTEND_URL", "https://swapp-app.onrender.com"))

        nombre_completo = userinfo.get("name", "")
        partes = nombre_completo.split(" ", 1)
        nombre = partes[0]
        apellido = partes[1] if len(partes) > 1 else ""

        usuario_db = Usuario.query.filter_by(
            correo_electronico=userinfo.get("email")).first()

        if not usuario_db:
            usuario_db = Usuario(
                nombre=nombre,
                apellido=apellido,
                correo_electronico=userinfo.get("email"),
                foto_perfil=userinfo.get("picture"),
                contrasena="google_oauth_dummy",
            )
            db.session.add(usuario_db)
            db.session.commit()
        else:
            usuario_db.nombre = nombre
            usuario_db.apellido = apellido
            if not usuario_db.foto_perfil:
                usuario_db.foto_perfil = userinfo.get("picture")
            db.session.commit()

        access_token = create_access_token(
            identity=usuario_db.correo_electronico)
        refresh_token = create_refresh_token(
            identity=usuario_db.correo_electronico)

        frontend_url = os.getenv(
            "FRONTEND_URL", "https://swapp-app.onrender.com")
        params = {
            "token": access_token,
            "refresh_token": refresh_token,
            "id_usuario": usuario_db.id_usuario,
        }

        redirect_url = (
            f"{frontend_url}/auth/google/callback?"
            f"{urllib.parse.urlencode(params)}"
            )
        return redirect(redirect_url)

    except Exception as e:  # pylint: disable=broad-exception-caught
        print("Error en google_callback:", e)
        return redirect(
            os.getenv(
                "FRONTEND_URL", "https://swapp-app.onrender.com"))


@auth.route("/auth/logout", methods=["POST", "GET"])
def logout():
    """Cerrar sesión de Google"""
    access_token = session.pop("google_access_token", None)
    revoked = False
    if access_token:
        try:
            requests.post(
                "https://oauth2.googleapis.com/revoke",
                params={"token": access_token},
                headers={"content-type": "application/x-www-form-urlencoded"},
                timeout=5,
            )
            revoked = True
        except Exception:  # pylint: disable=broad-exception-caught
            revoked = False

    session.clear()
    return jsonify({"ok": True, "google_token_revoked": revoked})


@auth.route("/auth/me", methods=["GET"])
def me():
    """Estado de la Autenticación"""
    return jsonify({"status": "ok"})
