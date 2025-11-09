"""
    DATOS DE INICIO DE LA BASE DE DATOS
"""
from api.models import db, Usuario, Habilidad
from api.app import app

USUARIOS = [
    {
        "nombre": "Kevin",
        "apellido": "Erazo",
        "estado": "ocupado",
        "descripcion": "Apasionado por la tecnología y el café. Siempre \
            buscando nuevos retos.",
        "correo_electronico": "kevin@demo.com",
        "contrasena_plana": "kevin123",
        "foto_perfil": "/Hombre1.png",
        "habilidades": [
            "Desarrollo web",
            "Ciberseguridad básica",
            "Instalación de software"
        ]
    },
    {
        "nombre": "Maddy",
        "apellido": "García",
        "estado": "ausente",
        "descripcion": "Programadora, gamer y fan de los gatos.",
        "correo_electronico": "maddy@demo.com",
        "contrasena_plana": "maddy123",
        "foto_perfil": "/Mujer1.png",
        "habilidades": [
            "Diseño gráfico",
            "Fotografía de viajes",
            "Publicidad digital"
        ]
    },
    {
        "nombre": "Juan",
        "apellido": "Martínez",
        "estado": "en-linea",
        "descripcion": "Emprendedor, curioso y con ganas de aprender algo \
            nuevo cada día.",
        "correo_electronico": "juan@demo.com",
        "contrasena_plana": "juan123",
        "foto_perfil": "/Hombre2.png",
        "habilidades": ["Branding", "Podcasting", "Mindfulness"]
    },
    {
        "nombre": "Nadia",
        "apellido": "Koukouss",
        "foto_perfil": "/Mujer2.png",
        "estado": "en-linea",
        "descripcion": "Creativa, soñadora y amante del arte en todas sus \
            formas",
        "correo_electronico": "nadia@demo.com",
        "contrasena_plana": "nadia123",
        "habilidades": [
            "Apoyo escolar",
            "Aprendizaje de idiomas",
            "Educación animal"
        ]
    },
    {
        "nombre": "Daniel",
        "apellido": "Andueza",
        "estado": "ocupado",
        "descripcion": "Jugador de ajedrez y amante de los libros de misterio",
        "correo_electronico": "daniel@demo.com",
        "contrasena_plana": "daniel123",
        "foto_perfil": "/Hombre3.png",
        "habilidades": [
            "Ciberseguridad básica",
            "Hablar en público",
            "Asistencia virtual"
        ]
    },
    {
        "nombre": "Lucía",
        "apellido": "Torres",
        "estado": "en-linea",
        "descripcion": "Me encanta bailar, reír y disfrutar de las \
            pequeñas cosas.",
        "correo_electronico": "lucia@demo.com",
        "contrasena_plana": "lucia123",
        "foto_perfil": "/Mujer3.png",
        "habilidades": [
            "Decoración del hogar",
            "Jardinería",
            "Tareas domésticas"
        ]
    },
    {
        "nombre": "Carlos",
        "apellido": "Mendoza",
        "estado": "en-linea",
        "descripcion": "Me gusta viajar, hacer senderismo y descubrir \
            lugares con buena comida.",
        "correo_electronico": "carlos@demo.com",
        "contrasena_plana": "carlos123",
        "foto_perfil": "/Hombre4.png",
        "habilidades": [
            "Acompañamiento fitness",
            "Voluntariado",
            "Nutrición saludable"
        ]
    },
    {
        "nombre": "Sofía",
        "apellido": "Ramírez",
        "estado": "ocupado",
        "correo_electronico": "sofia@demo.com",
        "descripcion": "Periodista viajera. Siempre con la cámara lista y \
            la mente abierta.",
        "contrasena_plana": "sofia123",
        "foto_perfil": "/Mujer4.png",
        "habilidades": [
            "Higiene y bienestar animal",
            "DJ y eventos",
            "Apoyo escolar"
        ]
    },
    {
        "nombre": "Andrés",
        "apellido": "Gutiérrez",
        "estado": "ocupado",
        "descripcion": "Fotógrafo urbano en busca de los mejores atardeceres.",
        "correo_electronico": "andres@demo.com",
        "contrasena_plana": "andres123",
        "foto_perfil": "/Hombre5.png",
        "habilidades": [
            "Soporte técnico",
            "Programación en Python, Java o C++",
            "Animación infantil"
        ]
    },
    {
        "nombre": "Valeria",
        "apellido": "Martínez",
        "estado": "ausente",
        "descripcion": "Arquitecta enamorada del diseño minimalista y \
            las plantas.",
        "correo_electronico": "valeria@demo.com",
        "contrasena_plana": "valeria123",
        "foto_perfil": "/Mujer5.png",
        "habilidades": [
            "Asesoría contable",
            "Marketing digital",
            "Maquillaje y peinados"
        ]
    }
]


def usuarios_prueba():
    """USUARIOS DE INICIO"""
    with app.app_context():
        for u in USUARIOS:
            email = u["correo_electronico"]
            usuario = Usuario.query.filter_by(correo_electronico=email).first()

            if not usuario:
                usuario = Usuario(
                    nombre=u["nombre"],
                    apellido=u["apellido"],
                    correo_electronico=email,
                    acepta_terminos=True,
                    foto_perfil=u["foto_perfil"],
                    estado=u["estado"],
                    descripcion=u["descripcion"]
                )
                usuario.contrasena = u["contrasena_plana"]
                db.session.add(usuario)
                db.session.flush()  # Para tener el ID antes de commit

            # Limpiar y asignar habilidades
            usuario.habilidades.clear()
            for nombre_habilidad in u["habilidades"]:
                habilidad = Habilidad.query.filter_by(
                    nombre_habilidad=nombre_habilidad).first()
                if not habilidad:
                    habilidad = Habilidad(
                        nombre_habilidad=nombre_habilidad, descripcion="")
                    db.session.add(habilidad)
                    db.session.flush()
                usuario.habilidades.append(habilidad)

            db.session.commit()

        print(
            f"[SEED] Se han creado o actualizado {len(USUARIOS)}"
            "usuarios con habilidades y fotos."
            )


if __name__ == "__main__":
    usuarios_prueba()
