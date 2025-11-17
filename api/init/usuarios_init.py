"""
    DATOS DE INICIO DE LA BASE DE DATOS
"""
from api.models import db, Usuario, Habilidad

USUARIOS = [
    # … tus usuarios aquí (no toco nada)
]


def usuarios_prueba():
    """USUARIOS DE INICIO"""
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

    print(f"[SEED] {len(USUARIOS)} usuarios creados/actualizados.")
