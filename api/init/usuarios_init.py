"""
    DATOS DE INICIO DE LA BASE DE DATOS
"""
from werkzeug.security import generate_password_hash
from api.models import db, Usuario
from api.app import app


USUARIOS = [

    {
        "nombre": "Kevin",
        "apellido": "Erazo",
        "correo_electronico": "kevin@demo.com",
        "contrasena_plana": "kevin123"
    },
    {
        "nombre": "Maddy",
        "apellido": "Demo",
        "correo_electronico": "maddy@demo.com",
        "contrasena_plana": "maddy123"
    },
    {
        "nombre": "Juan",
        "apellido": "Demo",
        "correo_electronico": "juan@demo.com",
        "contrasena_plana": "juan123"
    },
    {
        "nombre": "Nadia",
        "apellido": "Demo",
        "correo_electronico": "nadia@demo.com",
        "contrasena_plana": "nadia123"
    },
    {
        "nombre": "Daniel",
        "apellido": "Demo",
        "correo_electronico": "daniel@demo.com",
        "contrasena_plana": "daniel123"
    },
    {
        "nombre": "Lucía",
        "apellido": "Torres",
        "correo_electronico": "lucia@demo.com",
        "contrasena_plana": "lucia123"
    },
    {
        "nombre": "Carlos",
        "apellido": "Mendoza",
        "correo_electronico": "carlos@demo.com",
        "contrasena_plana": "carlos123"
    },
    {
        "nombre": "Sofía",
        "apellido": "Ramírez",
        "correo_electronico": "sofia@demo.com",
        "contrasena_plana": "sofia123"
    },
    {
        "nombre": "Andrés",
        "apellido": "López",
        "correo_electronico": "andres@demo.com",
        "contrasena_plana": "andres123"
    },
    {
        "nombre": "Valeria",
        "apellido": "Martínez",
        "correo_electronico": "valeria@demo.com",
        "contrasena_plana": "valeria123"
    }
]


def usuarios_prueba():
    """USUARIOS DE INICIO"""
    with app.app_context():
        for u in USUARIOS:
            email = u["correo_electronico"]
            usuario = Usuario.query.filter_by(correo_electronico=email).first()

            hash_pw = generate_password_hash(u["contrasena_plana"])

            if usuario:
                usuario.nombre = u["nombre"]
                usuario.apellido = u["apellido"]
                usuario.contrasena = hash_pw
            else:
                usuario = Usuario(
                    nombre=u["nombre"],
                    apellido=u["apellido"],
                    correo_electronico=email,
                    acepta_terminos=True
                )
                usuario.contrasena = hash_pw
                db.session.add(usuario)

            db.session.commit()
        print(f"[SEED] Se han Creado {len(USUARIOS)} Usuarios")


if __name__ == "__main__":
    usuarios_prueba()
