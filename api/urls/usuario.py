"""
    Usuarios
"""
from datetime import datetime
from flask import Blueprint, jsonify, request
from api.models import db, Usuario, Habilidad
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import jwt_required, get_jwt_identity

usuarios = Blueprint('usuarios', __name__)


@usuarios.route('/api/usuarios')
def obtener_usuarios():
    """
        Obtener Usuarios
    """
    try:
        users = Usuario.query.all()

        if not users:
            return jsonify({"msj": "No hay usuarios registrados"}), 200
        return jsonify([u.to_dict() for u in users]), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error en la base de datos",
            "detalle": str(e.__dict__.get("orig"))
        }), 500


@usuarios.route('/api/usuarios/<int:id_usuario>', methods=['GET'])
def obtener_usuario(id_usuario):
    """
        Obtener Usuario
    """
    try:
        usuario = Usuario.query.get_or_404(id_usuario)
        return jsonify(usuario.to_dict())

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error en la base de datos",
            "detalle": str(e.__dict__.get("orig"))
        }), 500


@usuarios.route('/api/usuarios/<int:id_usuario>', methods=['DELETE'])
def eliminar_usuario(id_usuario):
    """
        Eliminar Usuario
    """
    usuario = Usuario.query.get(id_usuario)
    if not usuario:
        return jsonify({"msj": "Usuario no existe"}), 404

    try:
        db.session.delete(usuario)
        db.session.commit()
        return jsonify({"msj": "Usuario eliminado"}), 204

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "No se pudo eliminar el usuario",
                        "detalle": str(e)}), 500


@usuarios.route('/api/usuarios', methods=["POST"])
def crear_usuario():
    """
        Crear Usuario
    """
    data = request.get_json() or {}
    try:
        habilidad = Habilidad.query.get(data["id_habilidad"])

        if not data:
            return jsonify({
                "msj": "Parametros vacios"
            }), 400

        if not habilidad:
            return jsonify({
                "msj": "Habilidad no Existente"
            }), 400

        fecha_nacimiento = datetime.strptime(
            data['fecha_nacimiento'], "%Y-%m-%d").date()
        usr = Usuario(
            nombre=data['nombre'], apellido=data['apellido'],
            correo_electronico=data['correo_electronico'],
            contrasena=data['contrasena'],
            fecha_nacimiento=fecha_nacimiento,
            genero=data['genero'],
            descripcion=data['descripcion'],
            acepta_terminos=data['acepta_terminos'])
        usr.habilidades.append(habilidad)

        db.session.add(usr)
        db.session.commit()
        return jsonify(
            {"msj": "Usuario creado",
                "id": usr.id_usuario}), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "El correo ya está registrado"}), 400

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear usuario",
                        "detalle": str(e)}), 500


@usuarios.route('/api/usuarios/<int:id_usuario>', methods=['PUT'])
def actualizar_usuario(id_usuario):
    """
        Actualizar usuario
    """
    actualizar = Usuario.query.get_or_404(id_usuario)
    data = request.get_json() or {}

    try:
        actualizar.nombre = data.get('nombre', actualizar.nombre)
        actualizar.apellido = data.get('apellido', actualizar.apellido)
        actualizar.contrasena = data.get('contrasena', actualizar.contrasena)
        actualizar.descripcion = data.get(
            'descripcion', actualizar.descripcion)
        if 'fecha_nacimiento' in data:
            actualizar.fecha_nacimiento = datetime.strptime(
                data['fecha_nacimiento'], "%Y-%m-%d"
            ).date()
        actualizar.genero = data.get('genero', actualizar.genero)
        actualizar.correo_electronico = data.get(
            'correo_electronico', actualizar.correo_electronico)
        actualizar.foto_perfil = data.get(
            'foto_perfil', actualizar.foto_perfil)
        actualizar.estado = data.get('estado', actualizar.estado)

        db.session.commit()
        return jsonify({"msj": "Usuario actualizado", "actualizado":
                        actualizar.to_dict()})

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Correo electrónico ya registrado"}), 400

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Error en la base de datos",
                        "detalle": str(e)}), 500


@usuarios.route("/api/autorizar", methods=["POST"])
def crear_autorizacion():
    """
        Devuelve un token de autorización
        para acceder a secciones exclusivas
    """
    data = request.get_json() or {}
    email = data.get("correo_electronico")
    passw = data.get("contrasena")

    try:
        user = Usuario.query.filter_by(correo_electronico=email).first()

        if user is None or not user.verificar_contrasena(passw):
            return jsonify(
                {"msj": "correo electronico o contraseña incorrecto"}), 401

        token = create_access_token(identity=user.correo_electronico)
        refresh_token = create_refresh_token(identity=user.correo_electronico)
        return jsonify({
            "token": token,
            "refresh_token": refresh_token,
            "correo_electronico": user.correo_electronico
            }), 200

    except Exception as e:  # pylint: disable=broad-except
        return jsonify(
            {"error": "Error en la autenticación", "detalle": str(e)}), 500


@usuarios.route("/api/autorizacion", methods=["GET"])
@jwt_required()
def obtener_autorizacion():
    """
        Verifica que el usuario esté autorizado
        para permitir acceder a areas exclusivas
    """
    current_user = get_jwt_identity()
    if not current_user:
        return jsonify({"msj": "clave_acceso ha expirado"}), 401

    user = Usuario.query.filter_by(
        correo_electronico=current_user).first()
    return jsonify(user.to_dict()), 200
