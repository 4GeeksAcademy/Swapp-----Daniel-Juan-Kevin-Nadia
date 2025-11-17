"""Agregar Categorias y Habilidades"""
from api.models import db, Categoria, Habilidad

CATEGORIAS_Y_HABILIDADES = {
    # ⬅ aquí va tu diccionario tal cual, no lo toco
}


def poblar_datos():
    """Inserta categorías y habilidades."""
    h = 0
    for nombre_categoria, habilidades in CATEGORIAS_Y_HABILIDADES.items():

        categoria = Categoria.query.filter_by(
            nombre_categoria=nombre_categoria).first()

        if not categoria:
            categoria = Categoria(nombre_categoria=nombre_categoria)
            db.session.add(categoria)
            db.session.commit()

        for nombre_habilidad in habilidades:

            habilidad = Habilidad.query.filter_by(
                nombre_habilidad=nombre_habilidad).first()

            if not habilidad:
                nueva_habilidad = Habilidad(
                    nombre_habilidad=nombre_habilidad,
                    descripcion="",
                    id_categoria=categoria.id_categoria
                )
                db.session.add(nueva_habilidad)

        h += len(habilidades)

    print(f"[SEED] Categorías: {len(CATEGORIAS_Y_HABILIDADES)}")
    print(f"[SEED] Habilidades: {h}")
    db.session.commit()
