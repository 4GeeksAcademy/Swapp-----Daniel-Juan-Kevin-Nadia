"""
    This modules is for admin
"""
import os
from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from .models import db
from .models import Usuario
from .models import Categoria
from .models import Habilidad
from .models import UsuarioHabilidad
from .models import Mensaje


def setup_admin(app):
    """Config of app"""
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='Swapp Admin')
    admin.add_view(ModelView(Usuario, db.session))
    admin.add_view(ModelView(Categoria, db.session))
    admin.add_view(ModelView(Habilidad, db.session))
    admin.add_view(ModelView(UsuarioHabilidad, db.session))
    admin.add_view(ModelView(Mensaje, db.session))
