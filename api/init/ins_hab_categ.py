"""Agregar Categorias y Habilidades"""
from api.models import db, Categoria, Habilidad
from api.app import app

CATEGORIAS_Y_HABILIDADES = {
    "Educación y Tutorías": [
        "Clases particulares",
        "Tutorías académicas",
        "Apoyo escolar",
        "Asesoría universitaria",
        "Aprendizaje de idiomas",
        "Educación ambiental"
    ],
    "Tecnología y Programación": [
        "Desarrollo web",
        "Programación en Python, Java o C++",
        "Soporte técnico",
        "Automatización con scripts",
        "Ciberseguridad básica",
        "Instalación de software"
    ],
    "Música y Audio": [
        "Producción musical",
        "Clases de guitarra o piano",
        "Grabación y mezcla de audio",
        "Composición musical",
        "DJ y eventos",
        "Podcasting"
    ],
    "Negocios y Finanzas": [
        "Emprendimiento",
        "Gestión financiera básica",
        "Marketing digital",
        "Planificación de proyectos",
        "Inversiones personales",
        "Asesoría contable"
    ],
    "Entretenimiento y Cultura": [
        "Actuación / teatro",
        "Organización de eventos",
        "Juegos de mesa / rol",
        "Cine / análisis de películas",
        "Espectáculos en vivo",
        "Animación infantil"
    ],
    "Dibujo y Pintura": [
        "Ilustración digital",
        "Retratos y caricaturas",
        "Pintura acrílica o acuarela",
        "Diseño de murales",
        "Creación de cómics",
        "Manualidades artísticas"
    ],
    "Deporte y Bienestar": [
        "Entrenamiento personal",
        "Yoga y meditación",
        "Boxeo o defensa personal",
        "Acompañamiento fitness",
        "Nutrición saludable",
        "Mindfulness"
    ],
    "Moda, Belleza y Cuidado Personal": [
        "Asesoría de imagen",
        "Moda sostenible",
        "Maquillaje y peinados",
        "Diseño y costura",
        "Cuidado de la piel",
        "Productos ecológicos DIY"
    ],
    "Hogar y Reparaciones": [
        "Electricidad básica",
        "Fontanería y mantenimiento",
        "Decoración del hogar",
        "Reciclaje y compostaje",
        "Reparación de muebles",
        "Jardinería"
    ],
    "Mascotas y Animales": [
        "Adiestramiento básico",
        "Cuidado de mascotas",
        "Paseo de perros",
        "Rescate y adopción",
        "Educación animal",
        "Higiene y bienestar animal"
    ],
    "Viajes y Estilo de Vida": [
        "Planificación de viajes",
        "Intercambio cultural",
        "Cocina internacional",
        "Fotografía de viajes",
        "Consejos para nómadas digitales",
        "Blog de experiencias"
    ],
    "Comunicación y Marketing": [
        "Creación de contenido",
        "Copywriting",
        "Branding",
        "Estrategia de redes sociales",
        "Publicidad digital",
        "Podcasting"
    ],
    "Desarrollo Personal y Coaching": [
        "Coaching de vida",
        "Productividad y gestión del tiempo",
        "Hablar en público",
        "Motivación personal",
        "Asesoría vocacional",
        "Mindfulness"
    ],
    "Otros / Misceláneos": [
        "Voluntariado",
        "Asesoría legal básica",
        "Apoyo psicológico (no profesional)",
        "Servicios comunitarios",
        "Asistencia virtual",
        "Tareas domésticas"
    ]
}


def poblar_datos():
    """Algoritmo"""
    with app.app_context():
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
        print(f"[SEED] Categorias: {len(CATEGORIAS_Y_HABILIDADES)}")
        print(f"[SEED] Habilidades: {h}")
        db.session.commit()


if __name__ == "__main__":
    poblar_datos()
