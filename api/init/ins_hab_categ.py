"""Agregar Categorias y Habilidades"""
from api.models import db, Categoria, Habilidad
from api.app import app

CATEGORIAS_Y_HABILIDADES = {
    "Sostenibilidad": [
        "Reciclaje y compostaje",
        "Huertos urbanos",
        "Energias renovables",
        "Educación ambiental",
        "Moda sostenible",
        "Productos ecologicos DIY",
    ],
    "Entretenimiento": [
        "Teatro",
        "Organización de eventos",
        "Juegos de rol",
        "Cine",
        "Espectaculos en vivo",
        "Animacion infantil",
    ],
    "Estilo de Vida": [
        "Planificación de viajes",
        "Intercambio cultural",
        "Cocina internacional",
        "Fotografía de viajes",
        "Consejos para nómadas digitales",
    ],
    "Comunicación": [
        "Creación de contenido",
        "Copywriting",
        "Branding",
        "Estrategia de redes sociales",
        "Publicidad digital",
        "Podcasting",
    ],
    "Desarrollo Personal": [
        "Coaching de vida",
        "Mindfulness",
        "Productividad y gestión del tiempo",
        "Hablar en público",
        "Motivación personal",
        "Asesoría vocacional",
    ],
    "Miscelaneos": [
        "Voluntariado",
        "Asesoría legal básica",
        "Apoyo psicologico (no profesional)",
        "Servicios comunitarios",
        "Asistencia virtual",
        "Tareas domésticas",
    ]
}


def poblar_datos():
    """Algoritmo"""
    with app.app_context():
        for nombre_categoria, habilidades in CATEGORIAS_Y_HABILIDADES.items():
            categoria = Categoria.query.filter_by(
                nombre_categoria=nombre_categoria).first()
            if not categoria:
                categoria = Categoria(nombre_categoria=nombre_categoria)
                db.session.add(categoria)
                db.session.commit()
                print(f" Categoría creada: {nombre_categoria}")

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
                    print(f" Habilidad añadida: {nombre_habilidad}")
        db.session.commit()
        print(" Datos iniciales cargados correctamente.")


if __name__ == "__main__":
    poblar_datos()
