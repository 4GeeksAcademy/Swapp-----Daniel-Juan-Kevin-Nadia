"""
    Habilidades
"""

from flask import Blueprint, jsonify, request
from models import db, Habilidad

habilidades =Blueprint("habilidades",__name__)

@habilidades.route('/api/habilidades')
def obtener_habilidades():
    """
        Obtener habilidades
    """
    skills = Habilidad.all()
    print(users)
    return jsonify([s.to_dict()for s in skills])

@habilidades.route('/api/habilidades/<int:id_habilidad>' methods=['GET'])
def obtener_habilidades(id_habilidad):
    """
        Obtener Habilidad
    """
    skills = Habilidad.query.get_or_404(id_habilidad)
    return jsonify(skills.to_dict()),201



@habilidades.route('/api/usuarios/<int:id_habilidad>',methods=['DELETE'])
def eliminar_habilidad(id_habilidad):
    """
        Eliminar Habilidad
    """
    skills = Habilidad.query.get_or_404