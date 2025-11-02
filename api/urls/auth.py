# api/urls/auth.py
import os
from flask import Blueprint, current_app, request, session, url_for, jsonify
from flask import redirect
from flask_jwt_extended import create_access_token
import requests
import urllib.parse
from api.models import db, Usuario


auth = Blueprint("auth", __name__)


@auth.route("/google/login", methods=["GET"])
def google_login():

    session["post_auth_redirect"] = request.args.get("next", "/auth/me")

    redirect_uri = os.getenv("OAUTH_REDIRECT_URI") or url_for(
        "auth.google_callback", _external=True
    )
    return current_app.oauth.google.authorize_redirect(redirect_uri)


@auth.route("/google/callback", methods=["GET"])
def google_callback():
    try:

        if "error" in request.args:
            print("Usuario canceló el acceso a Google o no concedió permisos.")
            return redirect("http://localhost:3000/login")

        token = current_app.oauth.google.authorize_access_token()
        if not token:
            print("No se pudo obtener el token de Google")
            return redirect("http://localhost:3000/login")

        userinfo = token.get(
            "userinfo") or current_app.oauth.google.parse_id_token(token)
        if not userinfo:
            print("No se pudo obtener información del usuario")
            return redirect("http://localhost:3000/login")

        nombre_completo = userinfo.get("name", "")
        partes = nombre_completo.split(" ", 1)
        nombre = partes[0]
        apellido = partes[1] if len(partes) > 1 else ""

        userinfo["nombre"] = nombre
        userinfo["apellido"] = apellido
        usuario_db = Usuario.query.filter_by(
            correo_electronico=userinfo.get("email")).first()

        if not usuario_db:
            usuario_db = Usuario(
                    nombre=userinfo.get("nombre"),
                    apellido=userinfo.get("apellido"),
                    correo_electronico=userinfo.get("email"),
                    foto_perfil=userinfo.get("picture"),
                )
            db.session.add(usuario_db)
            db.session.commit()
        else:
            usuario_db.nombre = userinfo.get("nombre")
            usuario_db.apellido = userinfo.get("apellido")
            if not usuario_db.foto_perfil:
                usuario_db.foto_perfil = userinfo.get("picture")
            db.session.commit()

        session["google_access_token"] = token.get("access_token")
        session["google_id_token"] = token.get("id_token")

        access_token = create_access_token(
            identity=userinfo.get("email"),
            additional_claims={
                "name": userinfo.get("name"),
                "picture": userinfo.get("picture"),
                "provider": "google",
            },
        )

        print("Userinfo recibido:", userinfo)

        frontend_url = "http://localhost:3000/auth/google/callback"
        params = {
                "token": access_token,
                "id_usuario": usuario_db.id_usuario,
                "nombre": userinfo.get("nombre", ""),
                "apellido": userinfo.get("apellido", ""),
                "email": userinfo.get("email", ""),
                "picture": userinfo.get("picture", "")
                }

        redirect_url = f"{frontend_url}?{urllib.parse.urlencode(params)}"
        return redirect(redirect_url)

    except Exception as e:
        print("Error en google_callback:", e)
        return redirect("http://localhost:3000/login")


@auth.route("/logout", methods=["POST", "GET"])
def logout():
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
        except Exception:
            revoked = False

    session.clear()
    return jsonify({"ok": True, "google_token_revoked": revoked})


@auth.route("/me", methods=["GET"])
def me():
    return jsonify({"status": "ok"})
