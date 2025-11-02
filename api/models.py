"""
    Models of Swapp
"""
from datetime import datetime, timezone
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import UniqueConstraint, Enum
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
    _contrasena = db.Column("contrasena", db.String(255), nullable=True)
    fecha_nacimiento = db.Column(db.Date)
    genero = db.Column(db.String(20))
    foto_perfil = db.Column(db.String(255))
    descripcion = db.Column(db.Text)
    estado = db.Column(
        Enum("ausente", "en-linea", "ocupado", name="estado_usuario"),
        default="ausente",
        nullable=False)
    acepta_terminos = db.Column(db.Boolean, default=False, nullable=False)
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

    @property
    def puntos(self):
        """Promedio de puntuaciones recibidas en intercambios."""
        puntuaciones = Puntuacion.query.filter_by(
            id_puntuado=self.id_usuario).all()
        if not puntuaciones:
            return 0
        return sum(
            p.puntos
            for p in puntuaciones
            ) / len(puntuaciones)

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

    puntuaciones_dadas = db.relationship(
        "Puntuacion",
        foreign_keys="Puntuacion.id_puntuador",
        back_populates="puntuador",
        cascade="all, delete-orphan"
    )
    puntuaciones_recibidas = db.relationship(
        "Puntuacion",
        foreign_keys="Puntuacion.id_puntuado",
        back_populates="puntuado",
        cascade="all, delete-orphan"
    )

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
            "fecha_nacimiento": (
                self.fecha_nacimiento.isoformat()
                if self.fecha_nacimiento else None
                ),
            "foto_perfil": self.foto_perfil,
            "genero": self.genero,
            "descripcion": self.descripcion,
            "estado": self.estado,
            "puntuacion": self.puntos,
            "fecha_registro": self.fecha_registro.strftime("%Y-%m-%d %H:%M:%S")
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

    def to_dict(self):
        """
            Serialize the attrs of Categoria
        """
        return {
            "id_categoria": self.id_categoria,
            "nombre_categoria": self.nombre_categoria
            }


class Habilidad(db.Model):
    """
        Model: Habilidades
    """
    __tablename__ = "habilidades"

    id_habilidad = db.Column(db.Integer, primary_key=True)
    nombre_habilidad = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text)
    id_categoria = db.Column(db.Integer, db.ForeignKey(
        "categorias.id_categoria", onupdate="CASCADE", ondelete="SET NULL"))

    categoria = db.relationship("Categoria", back_populates="habilidades")
    usuarios = db.relationship(
        "Usuario",
        secondary="usuarios_habilidades", back_populates="habilidades")

    def __repr__(self):
        return f"<Habilidad {self.nombre_habilidad}>"

    def to_dict(self):
        """
            Seralize the attr of Habilidad
        """
        return {
            "id_habilidad": self.id_habilidad,
            "nombre_habilidad": self.nombre_habilidad,
            "descripcion": self.descripcion
        }


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

    def to_dict(self, excluye=None):
        """
            Serialize attrs of Mensaje
        """
        serial = {
            "id_mensaje": self.id_mensaje,
            "id_emisor": self.id_emisor,
            "id_receptor": self.id_receptor,
            "contenido": self.contenido,
            "fecha_envio": self.fecha_envio.strftime("%Y-%m-%d %H:%M:%S"),
            "visto": self.visto
        }
        if excluye:
            for key in excluye:
                serial.pop(key, None)
        return serial


class Puntuacion(db.Model):
    """
        Model: Puntuaciones
    """
    __tablename__ = "puntuaciones"

    id_puntuacion = db.Column(db.Integer, primary_key=True)
    id_intercambio = db.Column(
        db.Integer,
        db.ForeignKey(
            "intercambios.id_intercambio", onupdate="CASCADE",
            ondelete="CASCADE"),
        nullable=False
    )
    id_puntuador = db.Column(db.Integer, db.ForeignKey(
        "usuarios.id_usuario", onupdate="CASCADE", ondelete="CASCADE"),
        nullable=False)
    id_puntuado = db.Column(db.Integer, db.ForeignKey(
        "usuarios.id_usuario", onupdate="CASCADE", ondelete="CASCADE"),
        nullable=False)

    puntos = db.Column(db.Float, nullable=False)
    comentario = db.Column(db.Text, nullable=True)
    fecha_registro = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    intercambio = db.relationship(
        "Intercambio", back_populates="puntuaciones")
    puntuador = db.relationship(
        "Usuario", foreign_keys=[id_puntuador],
        back_populates="puntuaciones_dadas")
    puntuado = db.relationship(
        "Usuario", foreign_keys=[id_puntuado],
        back_populates="puntuaciones_recibidas")

    __table_args__ = (
        UniqueConstraint(
            "id_intercambio",
            "id_puntuador",
            name="uq_intercambio_puntuador"),
    )

    def __repr__(self):
        return f"<Puntuacion {self.puntos} en \
            intercambio {self.id_intercambio}>"

    def to_dict(self):
        """
            Seralize the attr of Puntuacion
        """
        return {
            "id_puntuacion": self.id_puntuacion,
            "id_intercambio": self.id_intercambio,
            "id_puntuador": self.id_puntuador,
            "id_puntuado": self.id_puntuado,
            "puntos": self.puntos,
            "comentario": self.comentario,
            "fecha_registro": self.fecha_registro.strftime("%Y-%m-%d %H:%M:%S")
        }


class Intercambio(db.Model):
    """
        Model: Intercambios
        Representa los intercambios de habilidades entre usuarios
    """
    __tablename__ = "intercambios"

    id_intercambio = db.Column(db.Integer, primary_key=True)
    id_usuario_oferta = db.Column(
        db.Integer,
        db.ForeignKey(
            "usuarios.id_usuario", onupdate="CASCADE",
            ondelete="CASCADE"),
        nullable=False
    )
    id_usuario_demanda = db.Column(
        db.Integer,
        db.ForeignKey(
            "usuarios.id_usuario", onupdate="CASCADE",
            ondelete="CASCADE"),
        nullable=True
    )
    id_habilidad = db.Column(
        db.Integer,
        db.ForeignKey(
            "habilidades.id_habilidad", onupdate="CASCADE",
            ondelete="SET NULL"),
        nullable=True
    )
    fecha_creacion = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    intercambio_finalizado = db.Column(db.Boolean, default=False)
    fecha_fin = db.Column(db.DateTime, nullable=True)

    usuario_oferta = db.relationship(
        "Usuario",
        foreign_keys=[id_usuario_oferta],
        backref=db.backref(
            "intercambios_ofrecidos",
            cascade="all,delete-orphan")
    )
    usuario_demanda = db.relationship(
        "Usuario",
        foreign_keys=[id_usuario_demanda],
        backref=db.backref(
            "intercambios_recibidos",
            cascade="all,delete-orphan")
    )
    habilidad = db.relationship("Habilidad")
    puntuaciones = db.relationship(
        "Puntuacion",
        back_populates="intercambio",
        cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Intercambio {self.id_intercambio} entre \
            {self.id_usuario_oferta} y {self.id_usuario_demanda}>"

    def to_dict(self):
        """
            Serializa los atributos de Intercambio
        """
        return {
            "id_intercambio": self.id_intercambio,
            "id_usuario_oferta": self.id_usuario_oferta,
            "id_usuario_demanda": self.id_usuario_demanda,
            "fecha_creacion": (
                self.fecha_creacion.strftime("%Y-%m-%d %H:%M:%S")
                if self.fecha_creacion else None
            ),
            "intercambio_finalizado": self.intercambio_finalizado,
            "fecha_fin": (
                self.fecha_fin.strftime("%Y-%m-%d %H:%M:%S")
                if self.fecha_fin else None
            ),
            "habilidad": (
                self.habilidad.to_dict()
                if self.habilidad else None
            ),
            "puntuaciones": [p.to_dict() for p in self.puntuaciones]
        }
