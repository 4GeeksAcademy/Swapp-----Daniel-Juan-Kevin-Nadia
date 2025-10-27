"""
    Habilidades
"""
from sqlalchemy.exc import IntegrityError
from flask import Blueprint, jsonify, request
from api.models import db, Habilidad

habilidades = Blueprint('habilidades', __name__)


@habilidades.route('/api/habilidades')
def obtener_habilidades():
    """
        Obtener habilidades
    """
    skills = Habilidad.query.all()
    return jsonify([s.to_dict() for s in skills]), 200


@habilidades.route('/api/habilidades/<int:id_habilidad>', methods=['GET'])
def obtener_habilidad(id_habilidad):
    """
        Obtener habilidad
    """
    habilidad = Habilidad.query.get_or_404(id_habilidad)
    return jsonify(habilidad.to_dict()), 200


@habilidades.route('/api/habilidades', methods=["POST"])
def crear_habilidad():
    """
        Crear habilidad
    """
    data = request.get_json()
    if not data or not data.get("nombre_habilidad"):
        return jsonify({
            "Error": "El campo 'nombre_habilidad' es obligatorio"}), 400
    nueva_habilidad = Habilidad(
        nombre_habilidad=data["nombre_habilidad"],
        descripcion=data["descripcion"],
        id_categoria=data["id_categoria"]
    )

    db.session.add(nueva_habilidad)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"Error": "La habilidad ya existe"}), 400
    return jsonify({
            "id_habilidad": nueva_habilidad.id_habilidad
        }), 201


@habilidades.route('/api/habilidades/<int:id_habilidad>', methods=['DELETE'])
def eliminar_habilidad(id_habilidad):
    """
        Eliminar habilidad
    """
    quitar_habilidad = Habilidad.query.get_or_404(id_habilidad)
    db.session.delete(quitar_habilidad)
    db.session.commit()
    return jsonify({"mensaje": "Habilidad eliminada"}), 200


@habilidades.route('/api/habilidades/<int:id_habilidad>', methods=['PUT'])
def actualizar_habilidad(id_habilidad):
    """
        Actualizar habilidad
    """
    actualizar = Habilidad.query.get_or_404(id_habilidad)
    data = request.get_json()

    actualizar.descripcion = data.get('descripcion', actualizar.descripcion)
    actualizar.id_categoria = data.get('id_categoria', actualizar.id_categoria)

    db.session.commit()
    return jsonify({
        "id_habilidad": actualizar.id_habilidad,
        "descripcion": actualizar.descripcion,
        "id_categoria": actualizar.id_categoria
    }), 200
