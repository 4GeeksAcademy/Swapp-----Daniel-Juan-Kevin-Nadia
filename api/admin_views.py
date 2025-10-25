"""Admin Views"""
from flask_admin.contrib.sqla import ModelView
from wtforms import PasswordField


class UsuarioAdmin(ModelView):
    """View model Usuario"""
    form_columns = ['nombre', 'apellido', 'contrasena', 'correo_electronico',
                    "fecha_nacimiento", "genero", "foto_perfil",
                    "descripcion", "estado"]
    form_extra_fields = {
        'contrasena': PasswordField('Contraseña')
    }

    def on_model_change(self, form, model, is_created):
        if form.contrasena.data:
            model.contrasena = form.contrasena.data
