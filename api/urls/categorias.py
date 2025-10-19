

from flask import Blueprint, jsonify, request
from models import db, Categoria

categorias = Blueprint('categorias', __name__)


@categorias.route('/api/categorias')
def obtener_categorias():
    """
        Obtener Categorias
    """
    categorias_todas = Categoria.query.all()
    return jsonify([c.to_dict() for c in categorias_todas]), 200


@categorias.route('/api/categorias/<int:id_categoria>', methods=['GET'])
def obtener_categoria(id_categoria):
    """
        Obtener Categoria
    """
    categoria = Categoria.query.get_or_404(id_categoria)
    return jsonify(categoria.to_dict()), 200


@categorias.route('/api/categorias', methods=['POST'])
def crear_categoria():
    data = request.get_json()

    nombre_categoria = data.get("nombre_categoria")

    nueva_categoria = Categoria(nombre_categoria=nombre_categoria)
    db.session.add(nueva_categoria)
    db.session.commit()
    return jsonify({"mensaje": "Categoría creada con éxito",
                    "categoria": nueva_categoria.to_dict()}), 201


@categorias.route('/api/categorias/<int:id_categoria>', methods=['PUT'])
def actualizar_categoria(id_categoria):
    """
        Actualizar Categoria
    """
    actualizar = Categoria.query.get_or_404(id_categoria)
    data = request.get_json()

    actualizar.nombre_categoria = data.get(
        'nombre_categoria', actualizar.nombre_categoria)

    db.session.commit()

    return jsonify({
        "id_categoria": actualizar.id_categoria,
        "nombre_categoria": actualizar.nombre_categoria,

    }), 200


@categorias.route('/api/categorias/<int:id_categoria>', methods=['DELETE'])
def eliminar_categoria(id_categoria):
    """
        Eliminar categoria
    """
    eliminar = Categoria.query.get_or_404(id_categoria)
    db.session.delete(eliminar)
    db.session.commit()
    return jsonify({
        "Mensaje": "Categoria eliminada"
    }), 200
