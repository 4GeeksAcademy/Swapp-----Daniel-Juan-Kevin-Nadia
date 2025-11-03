"""
    puntuaciones
"""
from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from api.models import db, Usuario, Puntuacion, Intercambio

puntuaciones = Blueprint('puntuaciones', __name__)


@puntuaciones.route('/api/puntuaciones', methods=['GET'])
def listar_puntuaciones():
    """
        Listar todas las Puntuaciones
    """
    try:
        puntuaciones_list = Puntuacion.query.all()

        if not puntuaciones_list:
            return jsonify({"mensaje": "No hay puntuaciones registradas"}), 404

        return jsonify([p.to_dict() for p in puntuaciones_list]), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error al obtener las puntuaciones",
            "detalle": str(e)
        }), 500


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
        required_fields = ["id_intercambio", "id_puntuador", "puntos"]
        missing = [f for f in required_fields if f not in data]

        if missing:
            return jsonify({
                "error":
                f"Faltan campos requeridos: {' ,'.join(missing)}"
            }), 400

        intercambio = Intercambio.query.get_or_404(data["id_intercambio"])
        puntuador = Usuario.query.get_or_404(data["id_puntuador"])

        if puntuador.id_usuario == intercambio.id_usuario_oferta:
            id_puntuado = intercambio.id_usuario_demanda
        else:
            id_puntuado = intercambio.id_usuario_oferta

        if not id_puntuado:
            return jsonify({
                "error":
                "El intercambio aún no tiene un demandante asignado"}), 400

        puntuado = Usuario.query.get_or_404(id_puntuado)

        ptc = Puntuacion(
            id_intercambio=intercambio.id_intercambio,
            id_puntuador=puntuador.id_usuario,
            id_puntuado=puntuado.id_usuario,
            puntos=data["puntos"]
        )

        if "comentario" in data:
            setattr(ptc, "comentario", data["comentario"])

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
            return jsonify({"error": "Parametros incompletos"}), 400

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
