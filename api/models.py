"""
    Models of Swapp
"""
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class Usuario(db.Model):
    """
        Model: Usuarios
    """
    __tablename__ = "usuarios"

    id_usuario = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    apellido = db.Column(db.String(100), nullable=False)
    correo_electronico = db.Column(db.String(150), unique=True, nullable=False)
    _contrasena = db.Column("contrasena", db.String(255), nullable=False)
    fecha_nacimiento = db.Column(db.Date)
    genero = db.Column(db.String(20))
    foto_perfil = db.Column(db.String(255))
    descripcion = db.Column(db.Text)
    estado = db.Column(db.Boolean, default=True)
    fecha_registro = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    @property
    def contrasena(self):
        """No se puede obtener la contraseña"""
        raise AttributeError("La contraseña no es un atributo legible")

    @contrasena.setter
    def contrasena(self, contrasena):
        """Establecer una contraseña"""
        self._contrasena = generate_password_hash(contrasena)

    def verificar_contrasena(self, contrasena):
        """Verificar la contraseña"""
        return check_password_hash(self._contrasena, contrasena)

    habilidades = db.relationship(
        "Habilidad",
        secondary="usuarios_habilidades",
        back_populates="usuarios")
    mensajes_enviados = db.relationship(
        "Mensaje",
        foreign_keys="Mensaje.id_emisor",
        back_populates="emisor", cascade="all, delete-orphan")
    mensajes_recibidos = db.relationship(
        "Mensaje", foreign_keys="Mensaje.id_receptor",
        back_populates="receptor", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Usuario {self.nombre} {self.apellido}>"

    def to_dict(self):
        """
            Seralize the attr of Usuario
        """
        return {
            "id_usuario": self.id_usuario,
            "nombre": self.nombre,
            "apellido": self.apellido,
            "correo_electronico": self.correo_electronico,
            "fecha_nacimiento": self.fecha_nacimiento,
            "foto_perfil": self.foto_perfil,
            "genero": self.genero,
            "descripcion": self.descripcion,
            "estado": self.estado,
            "fecha_registro": self.fecha_registro
        }


class Categoria(db.Model):
    """
        Model: Categorias
    """
    __tablename__ = "categorias"

    id_categoria = db.Column(db.Integer, primary_key=True)
    nombre_categoria = db.Column(db.String(100), unique=True, nullable=False)

    habilidades = db.relationship("Habilidad", back_populates="categoria")

    def __repr__(self):
        return f"<Categoria {self.nombre_categoria}>"


class Habilidad(db.Model):
    """
        Model: Habilidades
    """
    __tablename__ = "habilidades"

    id_habilidad = db.Column(db.Integer, primary_key=True)
    nombre_habilidad = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text)
    categoria_nombre = db.Column(db.String(100))
    id_categoria = db.Column(db.Integer, db.ForeignKey(
        "categorias.id_categoria", onupdate="CASCADE", ondelete="SET NULL"))

    categoria = db.relationship("Categoria", back_populates="habilidades")
    usuarios = db.relationship(
        "Usuario",
        secondary="usuarios_habilidades", back_populates="habilidades")

    def __repr__(self):
        return f"<Habilidad {self.nombre_habilidad}>"


class UsuarioHabilidad(db.Model):
    """
        Model: Usuarios_Habilidades (N:M)
    """
    __tablename__ = "usuarios_habilidades"

    id_usuario = db.Column(db.Integer, db.ForeignKey(
        "usuarios.id_usuario", onupdate="CASCADE",
        ondelete="CASCADE"), primary_key=True)
    id_habilidad = db.Column(db.Integer, db.ForeignKey(
        "habilidades.id_habilidad", onupdate="CASCADE",
        ondelete="CASCADE"), primary_key=True)

    def __repr__(self):
        return f"""<UsuarioHabilidad usuario={self.id_usuario},
        habilidad={self.id_habilidad}>"""


class Mensaje(db.Model):
    """
        Model: Mensajes
    """
    __tablename__ = "mensajes"

    id_mensaje = db.Column(db.Integer, primary_key=True)
    id_emisor = db.Column(db.Integer, db.ForeignKey(
        "usuarios.id_usuario", onupdate="CASCADE",
        ondelete="CASCADE"), nullable=False)
    id_receptor = db.Column(db.Integer, db.ForeignKey(
        "usuarios.id_usuario", onupdate="CASCADE",
        ondelete="CASCADE"), nullable=False)
    contenido = db.Column(db.Text, nullable=False)
    fecha_envio = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    visto = db.Column(db.Boolean, default=False)

    emisor = db.relationship(
        "Usuario", foreign_keys=[id_emisor],
        back_populates="mensajes_enviados")
    receptor = db.relationship(
        "Usuario", foreign_keys=[id_receptor],
        back_populates="mensajes_recibidos")

    def __repr__(self):
        return f"<Mensaje de {self.id_emisor} a {self.id_receptor}>"
