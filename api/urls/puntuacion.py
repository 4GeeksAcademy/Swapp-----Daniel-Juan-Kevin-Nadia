"""
    puntuaciones
"""
from flask import Blueprint, jsonify, request
from api.models import db, Usuario, Puntuacion
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

puntuaciones = Blueprint('puntuaciones', __name__)


@puntuaciones.route('/api/puntuaciones/<int:id_puntuacion>', methods=['GET'])
def obtener_puntuacion(id_puntuacion):
    """
        Obtener una Puntuación
    """
    try:
        ptc = Puntuacion.query.get(id_puntuacion)

        if not ptc:
            return jsonify({"error": "Puntuacion no encontrada"}), 404

        return jsonify(ptc.to_dict())

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Error en la base de datos",
                        "detalle": str(e)}), 500


@puntuaciones.route('/api/puntuaciones', methods=["POST"])
def crear_puntuacion():
    """
        Hacer Puntuación
    """
    data = request.get_json() or {}
    try:
        puntuador = Usuario.query.get_or_404(data["puntuador"])
        puntuado = Usuario.query.get_or_404(data["puntuado"])

        if not puntuador:
            return jsonify({
                "error": f"Usuario {data["puntuador"]} no encontrado"}), 404
        if not puntuado:
            return jsonify({
                "error": f"Usuario {data["puntuado"]} no encontrado"}), 404
        if not data:
            return jsonify({"error": "Parametros vacios"}), 404

        ptc = Puntuacion(
            puntuador=puntuador,
            puntuado=puntuado,
            puntos=data["puntos"],
            comentario=data["comentario"],
        )

        db.session.add(ptc)
        db.session.commit()
        return jsonify({"id_puntuacion": ptc.id_puntuacion}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Algunos parametros son invalidos"}), 400

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Error al hacer la Puntuacion",
                        "detalle": str(e)}), 500


@puntuaciones.route('/api/puntuaciones/<int:id_puntuacion>', methods=['PUT'])
def actualizar_puntuacion(id_puntuacion):
    """
        Actualizar una Puntuación
    """
    data = request.get_json() or {}

    try:
        ptc = Puntuacion.query.get(id_puntuacion)

        if not ptc:
            return jsonify({"error": "Puntuacion no encontrada"}), 404
        if not data:
            return jsonify({"error": "Parametros incompletos"}), 404

        fields = [
            "puntos", "comentario"
        ]

        for f in fields:
            if f in data:
                setattr(ptc, f, data[f])

        db.session.commit()
        return jsonify(ptc.to_dict()), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Error en la base de datos",
                        "detalle": str(e)}), 500


@puntuaciones.route(
        '/api/puntuaciones/<int:id_puntuacion>', methods=['DELETE'])
def eliminar_puntuacion(id_puntuacion):
    """
        Eliminar Puntuación
    """
    try:
        ptc = Puntuacion.query.get(id_puntuacion)

        if not ptc:
            return jsonify({"msj": "Puntuacion no existe"}), 404

        db.session.delete(ptc)
        db.session.commit()
        return jsonify({"msj": "Puntuacion eliminada"}), 204

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "No se pudo eliminar la Puntuacion",
                        "detalle": str(e)}), 500
