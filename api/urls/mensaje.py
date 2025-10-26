"""
    Mensajes
"""
from flask import Blueprint, jsonify, request
from api.models import db, Mensaje
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

mensajes = Blueprint('mensajes', __name__)


@mensajes.route('/api/mensajes/<int:id_usuario>/enviados')
def mensajes_enviados(id_usuario):
    """
        Listar mensajes enviados
    """
    try:
        msjs = (
            Mensaje.query
            .filter_by(id_receptor=id_usuario)
            .order_by(Mensaje.fecha_envio.desc())
            .all()
        )

        return jsonify([
            m.to_dict(excluye=["id_receptor"])
            for m in msjs])

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error en la base de datos",
            "detalle": str(e.__dict__.get("orig"))
        }), 500


@mensajes.route('/api/mensajes/<int:id_usuario>/recibidos')
def mensajes_recibidos(id_usuario):
    """
        Listar mensajes recibidos
    """
    try:
        msjs = (
            Mensaje.query
            .filter_by(id_emisor=id_usuario)
            .order_by(Mensaje.fecha_envio.desc())
            .all()
        )

        return jsonify([
            m.to_dict(excluye=["id_emisor"])
            for m in msjs])

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error en la base de datos",
            "detalle": str(e.__dict__.get("orig"))
        }), 500


@mensajes.route('/api/mensajes/<int:id_mensaje>', methods=['GET'])
def obtener_mensaje(id_mensaje):
    """
        Obtener Mensaje
    """
    try:
        msj = Mensaje.query.get_or_404(id_mensaje)
        return jsonify(msj.to_dict())

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error en la base de datos",
            "detalle": str(e.__dict__.get("orig"))
        }), 500


@mensajes.route('/api/mensajes', methods=["POST"])
def crear_mensaje():
    """
        Crear Mensaje
    """
    data = request.get_json()
    try:
        msj = Mensaje(
            contenido=data['contenido'],
            id_emisor=data['id_emisor'],
            id_receptor=data['id_receptor']
        )
        db.session.add(msj)
        db.session.commit()
        return jsonify(msj.to_dict()), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "El correo ya está registrado"}), 400

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear Mensaje",
                        "detalle": str(e)}), 500


@mensajes.route('/api/mensajes/<int:id_mensaje>', methods=['PUT'])
def actualizar_mensaje(id_mensaje):
    """
        Actualizar Mensaje
    """
    data = request.get_json() or {}

    try:
        msj = Mensaje.query.get_or_404(id_mensaje)

        if not msj:
            return jsonify({"error": "Mensaje no encontrado"}), 404
        if not data:
            return jsonify({"error": "Parametros incompletos"}), 404

        fields = [
            "contenido", "visto"
        ]

        for f in fields:
            if f in data:
                setattr(msj, f, data[f])

        if "contenido" in data:
            setattr(msj, "visto", False)

        db.session.commit()
        return jsonify(msj.to_dict()), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Error en la base de datos",
                        "detalle": str(e)}), 500


@mensajes.route('/api/mensajes/<int:id_mensaje>', methods=['DELETE'])
def eliminar_mensaje(id_mensaje):
    """
        Eliminar Mensaje
    """
    try:
        msj = Mensaje.query.get(id_mensaje)

        if not msj:
            return jsonify({"msj": "Mensaje no existe"}), 404

        db.session.delete(msj)
        db.session.commit()
        return jsonify({"msj": "Mensaje eliminado"}), 204

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "No se pudo eliminar el Mensaje",
                        "detalle": str(e)}), 500
