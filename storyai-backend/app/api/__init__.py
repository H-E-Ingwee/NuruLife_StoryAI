rom flask import Blueprint
from app.api.auth import auth_bp
from app.api.projects import projects_bp
from app.api.characters import characters_bp
from app.api.assets import assets_bp
from app.api.storyboards import storyboards_bp
from app.api.shots import shots_bp
from app.api.exports import exports_bp

api_bp = Blueprint('api', __name__)

api_bp.register_blueprint(auth_bp, url_prefix='/auth')
api_bp.register_blueprint(projects_bp, url_prefix='/projects')
api_bp.register_blueprint(characters_bp, url_prefix='/characters')
api_bp.register_blueprint(assets_bp, url_prefix='/assets')
api_bp.register_blueprint(storyboards_bp, url_prefix='/storyboards')
api_bp.register_blueprint(shots_bp, url_prefix='/shots')
api_bp.register_blueprint(exports_bp, url_prefix='/exports')
