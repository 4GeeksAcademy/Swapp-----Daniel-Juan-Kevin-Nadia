"""
    Usuarios
"""
from flask import Blueprint, jsonify, request
from models import db, Usuario

usuarios = Blueprint('usuarios', __name__)


@usuarios.route('/api/usuarios')
def obtener_usuarios():
    """
        Obtener Usuarios
    """
    users = Usuario.query.all()
    return jsonify([u.to_dict() for u in users])


@usuarios.route('/api/usuarios/<int:id_usuario>', methods=['GET'])
def obtener_usuario(id_usuario):
    """
        Obtener Usuario
    """
    usuario = Usuario.query.get_or_404(id_usuario)
    return jsonify(usuario.to_dict()), 201


@usuarios.route('/api/usuarios/<int:id_usuario>', methods=['DELETE'])
def eliminar_usuario(id_usuario):
    """
        Eliminar Usuario
    """
    usuario = Usuario.query.get_or_404(id_usuario)
    db.session.delete(usuario)
    db.session.commit()
    return jsonify({"mensaje": "Usuario eliminado"})
