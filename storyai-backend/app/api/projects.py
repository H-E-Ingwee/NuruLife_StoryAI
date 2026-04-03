from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields, ValidationError
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import Project, User
from app.extensions import db

projects_bp = Blueprint('projects', __name__)

class ProjectSchema(Schema):
    title = fields.Str(required=True)
    description = fields.Str(missing='')
    script_text = fields.Str(missing='')
    status = fields.Str(missing='draft')

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
