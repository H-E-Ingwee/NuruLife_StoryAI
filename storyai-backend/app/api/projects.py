from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields, ValidationError
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Project, User, Storyboard, Shot
from app.extensions import db
from app.nlp.script_parser import parse_script

projects_bp = Blueprint('projects', __name__)

class ProjectSchema(Schema):
    title = fields.Str(required=True)
    description = fields.Str(missing='')
    script_text = fields.Str(missing='')
    status = fields.Str(missing='draft')


class ParseScriptRequestSchema(Schema):
    script_text = fields.Str(required=False, allow_none=True)

@projects_bp.route('', methods=['GET'])
@jwt_required()
def list_projects():
    user_id = get_jwt_identity()

    # Frontend currently expects `data` to be a flat array (not paginated items).
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 20))
    page = max(page, 1)
    page_size = max(min(page_size, 100), 1)

    query = Project.query.filter_by(user_id=user_id).order_by(Project.updated_at.desc())
    projects = query.offset((page - 1) * page_size).limit(page_size).all()

    return jsonify({'success': True, 'data': [p.to_dict() for p in projects]}), 200

@projects_bp.route('', methods=['POST'])
@jwt_required()
def create_project():
    try:
        data = ProjectSchema().load(request.json or {})
    except ValidationError as e:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400
    user_id = get_jwt_identity()

    user = User.query.get(user_id)
    if not user or not getattr(user, 'is_active', True):
        return jsonify({'success': False, 'error': {'code': 'UNAUTHORIZED', 'message': 'Invalid credentials'}}), 401

    project = Project(
        user_id=user_id,
        title=data['title'],
        description=data.get('description', ''),
        script_text=data.get('script_text', ''),
        status=data.get('status', 'draft')
    )
    db.session.add(project)
    db.session.commit()
    return jsonify({'success': True, 'data': project.to_dict()}), 201

@projects_bp.route('/<project_id>', methods=['GET'])
@jwt_required()
def get_project(project_id):
    user_id = get_jwt_identity()
    project = Project.query.filter_by(id=project_id, user_id=user_id).first()
    if not project:
        return jsonify({'success': False, 'error': {'code': 'PROJECT_NOT_FOUND'}}), 404
    return jsonify({'success': True, 'data': project.to_dict()}), 200

@projects_bp.route('/<project_id>', methods=['PUT'])
@jwt_required()
def update_project(project_id):
    try:
        data = ProjectSchema(partial=True).load(request.json or {}, partial=True)
    except ValidationError as e:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400

    user_id = get_jwt_identity()
    project = Project.query.filter_by(id=project_id, user_id=user_id).first()
    if not project:
        return jsonify({'success': False, 'error': {'code': 'PROJECT_NOT_FOUND'}}), 404

    for key, value in data.items():
        setattr(project, key, value)

    db.session.commit()
    return jsonify({'success': True, 'data': project.to_dict()}), 200

@projects_bp.route('/<project_id>', methods=['DELETE'])
@jwt_required()
def delete_project(project_id):
    user_id = get_jwt_identity()
    project = Project.query.filter_by(id=project_id, user_id=user_id).first()
    if not project:
        return jsonify({'success': False, 'error': {'code': 'PROJECT_NOT_FOUND'}}), 404

    db.session.delete(project)
    db.session.commit()
    return jsonify({'success': True, 'data': {'message': 'Project deleted'}}), 200


@projects_bp.route('/<project_id>/parse-script', methods=['POST'])
@jwt_required()
def parse_project_script(project_id):
    """
    MVP parsing endpoint:
    - extracts scenes + action lines from the script
    - creates a Storyboard + Shot rows tied to the project
    - returns the created shot metadata for the client editor
    """
    user_id = get_jwt_identity()

    project = Project.query.filter_by(id=project_id, user_id=user_id).first()
    if not project:
        return jsonify({'success': False, 'error': {'code': 'PROJECT_NOT_FOUND'}}), 404

    try:
        data = ParseScriptRequestSchema().load(request.json or {})
    except ValidationError as e:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400

    script_text = data.get('script_text') or project.script_text or ''
    if not script_text or not script_text.strip():
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'message': 'script_text is empty'}}), 400

    parsed = parse_script(script_text)
    shots_data = parsed.get('shots') or []
    characters = parsed.get('characters') or []

    storyboard = Storyboard(
        project_id=project_id,
        title=f"{project.title} - Storyboard",
        description='',
        layout=[],
    )
    db.session.add(storyboard)
    db.session.flush()  # Get storyboard.id before inserting shots

    for sh in shots_data:
        shot = Shot(
            storyboard_id=storyboard.id,
            scene_number=sh.get('scene_number'),
            shot_number=sh.get('shot_number'),
            scene=sh.get('scene'),
            action=sh.get('action'),
            prompt=sh.get('prompt'),
            shot_size=sh.get('shotSize'),
            camera_angle=sh.get('cameraAngle'),
            lens=sh.get('lens'),
            notes=sh.get('notes'),
            consistency_data=sh.get('consistency_data') or {},
            camera_settings={},
            image_status='pending',
        )
        db.session.add(shot)

    # Mark project as "active" after parsing (simple lifecycle for MVP).
    project.status = 'active'
    project.settings = project.settings or {}
    project.settings['last_parse'] = {
        'characters_found': characters,
        'shots_created': len(shots_data),
    }

    db.session.commit()

    # Reload shots from DB for consistent to_dict values.
    created_shots = Shot.query.filter_by(storyboard_id=storyboard.id).order_by(Shot.shot_number.asc()).all()

    return jsonify({
        'success': True,
        'data': {
            'storyboard_id': storyboard.id,
            'shots': [s.to_dict() for s in created_shots],
        }
    }), 200
