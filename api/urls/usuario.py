"""
    Usuarios
"""
from datetime import datetime
from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity
from api.models import db, Usuario, Habilidad, Categoria

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
        usuario = Usuario.query.get(id_usuario)

        if not usuario:
            return jsonify({"error": "Usuario no encontrado"}), 404

        usr = usuario.to_dict()
        usr["habilidades"] = [h.to_dict() for h in usuario.habilidades]
        return jsonify(usr), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({
            "error": "Error en la base de datos",
            "detalle": str(e.__dict__.get("orig"))
        }), 500


@usuarios.route("/api/usuarios/categoria/<int:id_categoria>", methods=["GET"])
def usuarios_por_categoria(id_categoria):
    """
        Devuelve todos los usuarios que tienen habilidades de una categoría
    """

    categoria = Categoria.query.get_or_404(id_categoria)

    habilidades_ids = [h.id_habilidad for h in categoria.habilidades]

    if not habilidades_ids:
        return jsonify([]), 200
    usuarios_categoria = (
        Usuario.query
        .join(Usuario.habilidades)
        .filter(Habilidad.id_habilidad.in_(habilidades_ids))
        .all()
    )

    return jsonify([u.to_dict() for u in usuarios_categoria]), 200


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
        if not data:
            return jsonify({
                "msj": "Parametros vacios"
            }), 400

        usr = Usuario(
            nombre=data['nombre'], apellido=data['apellido'],
            correo_electronico=data['correo_electronico'],
            contrasena=data['contrasena'],
            acepta_terminos=data['acepta_terminos']
        )

        extra = [
                    "descripcion", "fecha_nacimiento",
                    "genero", "foto_perfil", "id_habilidad"
                ]

        for f in extra:
            if f in data:
                if f == "fecha_nacimiento":
                    setattr(usr, f, datetime.strptime(
                        data[f], "%Y-%m-%d").date())
                elif f == "id_habilidad":
                    habilidad = Habilidad.query.get(data[f])
                    if habilidad:
                        usr.habilidades.append(habilidad)
                else:
                    setattr(usr, f, data[f])

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
    data = request.get_json() or {}

    try:
        actualizar = Usuario.query.get_or_404(id_usuario)

        if not actualizar:
            return jsonify({"error": "Usuario no encontrado"}), 404

        fields = [
            "nombre", "apellido", "correo_electronico",
            "contrasena", "foto_perfil", "genero",
            "descripcion", "estado", "fecha_nacimiento"
        ]

        for f in fields:
            if f in data:
                if f == "fecha_nacimiento":
                    setattr(actualizar, f, datetime.strptime(
                        data[f], "%Y-%m-%d").date())
                else:
                    setattr(actualizar, f, data[f])

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


@usuarios.route('/api/usuarios/<int:id_usuario>/habilidad', methods=["POST"])
def agregar_habilidad_usuario(id_usuario):
    """
        Asociar/Desasociar Habilidades a los Usuarios
    """
    data = request.get_json() or {}
    try:
        usr = Usuario.query.get(id_usuario)
        id_habilidad = data.get("asociar") or data.get("desasociar")
        habilidad = Habilidad.query.get(id_habilidad)

        if not usr or not habilidad:
            return jsonify({
                "msj": "El Usuario o Habilidad No Existe"
            }), 404

        if not data or "asociar" in data and "desasociar" in data:
            return jsonify({
                "msj": "Parametros invalidos"
            }), 401

        if "asociar" in data:
            usr.habilidades.append(habilidad)

        if "desasociar" in data:
            usr.habilidades.remove(habilidad)

        user = usr.to_dict()
        user["habilidades"] = [h.to_dict() for h in usr.habilidades]

        db.session.commit()
        return jsonify(user), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "El correo ya está registrado"}), 400

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Error al crear usuario",
                        "detalle": str(e)}), 500


@usuarios.route("/api/autorizar", methods=["POST"])
def crear_autorizacion():
    """
        Devuelve un token de autorización
        para acceder a secciones exclusivas
        (inicio de sesión con correo y contraseña)
    """
    data = request.get_json() or {}
    email = data.get("correo_electronico")
    passw = data.get("contrasena")

    try:
        user = Usuario.query.filter_by(correo_electronico=email).first()

        if user is None or not user.verificar_contrasena(passw):
            return jsonify(
                {"msj": "correo electrónico o contraseña incorrecto"}), 401

        token = create_access_token(identity=user.correo_electronico)
        refresh_token = create_refresh_token(identity=user.correo_electronico)
        return jsonify({
            "token": token,
            "refresh_token": refresh_token,
            "correo_electronico": user.correo_electronico
        }), 200

    except Exception as e:  # pylint: disable=broad-exception-caught
        return jsonify(
            {"error": "Error en la autenticación", "detalle": str(e)}), 500


@usuarios.route("/api/autorizacion", methods=["GET"])
@jwt_required()
def obtener_autorizacion():
    """
        Devuelve un Usuario asociado a la autorización
        para acceder a secciones exclusivas
    """
    email = get_jwt_identity()

    if not email:
        return jsonify({"msg": "Token sin email"}), 400

    user = Usuario.query.filter_by(correo_electronico=email).first()

    if not user:
        nuevo_usuario = Usuario(
            nombre="",
            apellido="",
            correo_electronico=email,
            foto_perfil="",
            contrasena="google_oauth_dummy"
        )
        db.session.add(nuevo_usuario)
        db.session.commit()
        user = nuevo_usuario

    return jsonify(user.to_dict()), 200
