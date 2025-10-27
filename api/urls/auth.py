# api/urls/auth.py
import os
from flask import Blueprint, current_app, request, session, url_for, jsonify
from flask_jwt_extended import create_access_token
import requests

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
    # Intercambia code→tokens (valida state/PKCE internamente)
    token = current_app.oauth.google.authorize_access_token()

    # userinfo puede venir embebido; si no, parsea id_token
    userinfo = token.get(
        "userinfo") or current_app.oauth.google.parse_id_token(token)

    # Guarda tokens en sesión (por si quieres revocar en logout)
    session["google_access_token"] = token.get("access_token")
    session["google_id_token"] = token.get("id_token")

    # Crea JWT local (stateless). Identidad = sub (Google)
    access_token = create_access_token(
        identity=userinfo["sub"],
        additional_claims={
            "email": userinfo.get("email"),
            "name": userinfo.get("name"),
            "picture": userinfo.get("picture"),
            "provider": "google",
        },
    )
    return jsonify(
        {
            "token_type": "Bearer",
            "access_token": access_token,
            "google_id_token": token.get("id_token"),  # opcional, debug
            "user": userinfo,
            "redirect": session.pop("post_auth_redirect", "/auth/me"),
        }
    )


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

    #
    session.clear()

    return jsonify({"ok": True, "google_token_revoked": revoked})


@auth.route("/me", methods=["GET"])
def me():
    return jsonify({"status": "ok"})