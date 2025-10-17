"""
    Usuarios
"""
from datetime import datetime
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


@usuarios.route('/api/usuarios', methods=["POST"])
def crear_usuario():
    """
        Crear Usuario
    """
    data = request.get_json()
    fecha_nacimiento = datetime.strptime(
        data['fecha_nacimiento'], "%Y-%m-%d").date()
    usr = Usuario(
        nombre=data['nombre'], apellido=data['apellido'],
        correo_electronico=data['correo_electronico'],
        contrasena=data['contrasena'],
        fecha_nacimiento=fecha_nacimiento,
        genero=data['genero'], foto_perfil=data['foto_perfil'],
        descripcion=data['descripcion'], estado=data['estado'])
    db.session.add(usr)
    db.session.commit()
    return jsonify(
        {"mensaje": "Usuario creado", "id":
            usr.id_usuario}), 201
