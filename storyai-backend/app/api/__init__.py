from flask import Blueprint
from app.api.auth import auth_bp
from app.api.projects import projects_bp

api_bp = Blueprint('api', __name__)

api_bp.register_blueprint(auth_bp, url_prefix='/auth')
api_bp.register_blueprint(projects_bp, url_prefix='/projects')
