from api.models import db, Usuario
from werkzeug.security import generate_password_hash


USUARIOS_DEMO = [

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
    for u in USUARIOS_DEMO:
        email = u["correo_electronico"]
        usuario = Usuario.query.filter_by(correo_electronico=email).first()

        hash_pw = generate_password_hash(u["contrasena_plana"])

        if usuario:
            usuario.nombre = u["nombre"]
            usuario.apellido = u["apellido"]
            usuario._contrasena = hash_pw
        else:
            usuario = Usuario(
                nombre=u["nombre"],
                apellido=u["apellido"],
                correo_electronico=email,
            )
            usuario._contrasena = hash_pw
            db.session.add(usuario)

        db.session.commit()
        print("[seed] Usuarios de demo insertados/actualizados.")
