"""
    intercambios
"""
from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from api.models import db, Intercambio, Usuario, Habilidad

intercambios = Blueprint("intercambios", __name__)


@intercambios.route("/api/intercambios", methods=["GET"])
def listar_intercambios():
    """
        Listar todos los intercambios existentes
    """
    try:
        lista_intercambios = Intercambio.query.all()

        if not lista_intercambios:
            return jsonify({"mensaje": "No hay intercambios registrados"}), 404

        return jsonify([i.to_dict() for i in lista_intercambios]), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error al obtener los intercambios",
            "detalle": str(e)
        }), 500


@intercambios.route("/api/intercambios/<int:id_intercambio>", methods=["GET"])
def obtener_intercambio(id_intercambio):
    """
        Obtener un intercambio específico
    """
    try:
        intercambio = Intercambio.query.get(id_intercambio)

        if not intercambio:
            return jsonify({"error": "Intercambio no encontrado"}), 404

        return jsonify(intercambio.to_dict()), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error en la base de datos", "detalle": str(e)}), 500


@intercambios.route(
        "/api/intercambios/postulante/<int:id_usuario>", methods=["GET"])
def obtener_intercambios_creados(id_usuario):
    """
        Obtener todos los intercambios creados por el usuario (como ofertante)
    """
    try:
        intercambios_usuario = Intercambio.query.filter_by(
            id_usuario_oferta=id_usuario).all()

        if not intercambios_usuario:
            return jsonify({
                "mensaje": "El usuario no ha creado intercambios"
            }), 404

        return jsonify([i.to_dict() for i in intercambios_usuario]), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error al obtener los intercambios creados",
            "detalle": str(e)
        }), 500


@intercambios.route(
        "/api/intercambios/demandante/<int:id_usuario>", methods=["GET"])
def obtener_intercambios_demandante(id_usuario):
    """
        Obtener todos los intercambios en donde el usuario ha sido demandante
    """
    try:
        intercambios_usuario = Intercambio.query.filter_by(
            id_usuario_demanda=id_usuario).all()

        if not intercambios_usuario:
            return jsonify({
                "mensaje": "El usuario no ha participado como demandante"
            }), 404

        return jsonify([i.to_dict() for i in intercambios_usuario]), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error al obtener los intercambios como demandante",
            "detalle": str(e)
        }), 500


@intercambios.route("/api/intercambios", methods=["POST"])
def crear_intercambio():
    """
        Crear un nuevo intercambio entre usuarios
    """
    data = request.get_json() or {}

    try:
        required = ["id_usuario_postulante", "id_habilidad"]
        for field in required:
            if field not in data:
                return jsonify({
                    "error": f"Falta el campo requerido: {field}"}), 400

        usuario_oferta = Usuario.query.get_or_404(
            data["id_usuario_postulante"])
        habilidad = Habilidad.query.get_or_404(data["id_habilidad"])

        intercambio = Intercambio(
            id_usuario_oferta=usuario_oferta.id_usuario,
            id_habilidad=habilidad.id_habilidad
        )

        db.session.add(intercambio)
        db.session.commit()

        return jsonify({
            "mensaje": "Intercambio creado exitosamente",
            "id_intercambio": intercambio.id_intercambio
        }), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Datos inválidos o duplicados"}), 400

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error en la base de datos", "detalle": str(e)}), 500


@intercambios.route(
        "/api/intercambios/<int:id_intercambio>/finalizar", methods=["PUT"])
def finalizar_intercambio(id_intercambio):
    """
        Marcar un intercambio como finalizado
    """
    try:
        intercambio = Intercambio.query.get(id_intercambio)

        if not intercambio:
            return jsonify({"error": "Intercambio no encontrado"}), 404

        if intercambio.intercambio_finalizado:
            return jsonify({
                "mensaje": "El intercambio ya está finalizado"}), 400

        intercambio.intercambio_finalizado = True
        intercambio.fecha_fin = db.func.now()

        db.session.commit()
        return jsonify({
            "mensaje": "Intercambio finalizado correctamente"}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error al finalizar el intercambio",
            "detalle": str(e)
        }), 500


@intercambios.route(
        "/api/intercambios/usuario/<int:id_usuario>", methods=["GET"])
def obtener_intercambios_por_usuario(id_usuario):
    """
        Obtener todos los intercambios en los que participa un usuario
    """
    try:
        interkambios = Intercambio.query.filter(
            (Intercambio.id_usuario_oferta == id_usuario) |
            (Intercambio.id_usuario_demanda == id_usuario)
        ).all()

        if not interkambios:
            return jsonify({
                "mensaje": "El usuario no tiene intercambios registrados"
            }), 404

        return jsonify([i.to_dict() for i in interkambios]), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error en la base de datos",
            "detalle": str(e)
        }), 500


@intercambios.route(
        "/api/intercambios/unirse/<int:id_intercambio>", methods=["PUT"])
def asignar_demandante(id_intercambio):
    """
        Permitir que un usuario se asigne como demandante de un intercambio
    """
    data = request.get_json() or {}

    try:
        id_usuario_demanda = data.get("id_usuario")
        if not id_usuario_demanda:
            return jsonify({
                "error": "Debe proporcionar el id_usuario_demanda"}), 400

        intercambio = Intercambio.query.get(id_intercambio)
        if not intercambio:
            return jsonify({"error": "Intercambio no encontrado"}), 404

        if intercambio.id_usuario_demanda is not None:
            return jsonify({
                "error": "El intercambio ya tiene un demandante asignado"
            }), 400

        if intercambio.id_usuario_oferta == id_usuario_demanda:
            return jsonify({
                "error": "El ofertante no puede ser su propio demandante"
            }), 400

        usuario_demanda = Usuario.query.get(id_usuario_demanda)
        if not usuario_demanda:
            return jsonify({"error": "Usuario demandante no encontrado"}), 404

        intercambio.id_usuario_demanda = usuario_demanda.id_usuario
        db.session.commit()

        return jsonify({
            "mensaje": "Usuario asignado como demandante exitosamente",
            "intercambio": intercambio.to_dict()
        }), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error al asignar el demandante al intercambio",
            "detalle": str(e)
        }), 500


@intercambios.route(
        "/api/intercambios/<int:id_intercambio>", methods=["DELETE"])
def eliminar_intercambio(id_intercambio):
    """
        Eliminar un intercambio (solo si no está finalizado)
    """
    try:
        intercambio = Intercambio.query.get(id_intercambio)

        if not intercambio:
            return jsonify({"error": "Intercambio no encontrado"}), 404

        if intercambio.intercambio_finalizado:
            return jsonify({
                "error": "No se puede eliminar un intercambio finalizado"
            }), 400

        db.session.delete(intercambio)
        db.session.commit()
        return jsonify({"mensaje": "Intercambio eliminado correctamente"}), 204

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error al eliminar el intercambio",
            "detalle": str(e)
        }), 500
