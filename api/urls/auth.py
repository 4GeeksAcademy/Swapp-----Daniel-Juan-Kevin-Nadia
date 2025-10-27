import os
from flask import Blueprint, current_app, request, session, url_for, jsonify
from flask_jwt_extended import create_access_token

auth = Blueprint("auth", __name__)


@auth.route("/google/login", methods=["GET"])
def google_login():
    session["post_auth_redirect"] = request.args.get("next", "/auth/me")
    redirect_uri = os.getenv(
        "OAUTH_REDIRECT_URI") or url_for(
            "auth.google_callback", _external=True)
    return current_app.oauth.google.authorize_redirect(redirect_uri)


@auth.route("/google/callback", methods=["GET"])
def google_callback():
    # Intercambia code->tokens y valida state/PKCE
    token = current_app.oauth.google.authorize_access_token()
    userinfo = token.get(
        "userinfo") or current_app.oauth.google.parse_id_token(token)

    # JWT local (SIN BD): identidad = sub de Google
    access_token = create_access_token(
        identity=userinfo["sub"],
        additional_claims={
            "email": userinfo.get("email"),
            "name": userinfo.get("name"),
            "picture": userinfo.get("picture"),
            "provider": "google"
        }
    )

    return jsonify({
        "token_type": "Bearer",
        "access_token": access_token,  # úsalo en tus endpoints si quieres
        "google_id_token": token.get("id_token"),  # opcional, para depurar
        "user": userinfo,                           # perfil OIDC
        "redirect": session.pop("post_auth_redirect", "/auth/me")
    })


@auth.route("/me", methods=["GET"])
def me():
    return jsonify({"status": "ok"})
