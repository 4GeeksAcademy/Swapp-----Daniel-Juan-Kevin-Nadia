from flask import Blueprint, request, jsonify
from api.models import db, Usuario
from api.cloudinary.config import cloudinary
import cloudinary.uploader
from werkzeug.utils import secure_filename

cloudinary_routes = Blueprint("cloudinary_routes", __name__)


@cloudinary_routes.route(
        "/api/usuarios/<int:id_usuario>/foto-perfil", methods=["POST"])
def subir_foto_perfil(id_usuario):
    """
    Sube o actualiza la foto de perfil del usuario en Cloudinary
    """
    try:
        usuario = Usuario.query.get(id_usuario)
        if not usuario:
            return jsonify({"error": "Usuario no encontrado"}), 404

        if "imagen" not in request.files:
            return jsonify({"error": "No se envió ninguna imagen"}), 400

        imagen = request.files["imagen"]
        nombre_seguro = secure_filename(imagen.filename)

        resultado = cloudinary.uploader.upload(
            imagen,
            folder="usuarios_perfil",
            public_id=f"usuario_{id_usuario}_{nombre_seguro}",
            overwrite=True,
            resource_type="image"
        )

        usuario.foto_perfil = resultado.get("secure_url")
        db.session.commit()

        return jsonify({
            "mensaje": "Foto de perfil actualizada",
            "foto_perfil": usuario.foto_perfil
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "error": "Error al subir la imagen",
            "detalle": str(e)
        }), 500
