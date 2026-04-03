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
# @jwt_required()  # Temporarily disabled for testing
def list_projects():
    # user_id = get_jwt_identity()
    # For testing, use a mock user ID
    user_id = "test-user-123"
    
    projects = Project.query.filter_by(user_id=user_id).order_by(Project.updated_at.desc()).all()
    return jsonify({'success': True, 'data': [p.to_dict() for p in projects]}), 200

@projects_bp.route('', methods=['POST'])
# @jwt_required()  # Temporarily disabled for testing
def create_project():
    try:
        data = ProjectSchema().load(request.json)
    except ValidationError as e:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400

    # user_id = get_jwt_identity()
    # For testing, use a mock user ID
    user_id = "test-user-123"
    
    # Check if user exists, if not create a test user
    user = User.query.get(user_id)
    if not user:
        user = User(id=user_id, email="test@example.com", username="testuser")
        db.session.add(user)
        db.session.commit()

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
# @jwt_required()  # Temporarily disabled for testing
def get_project(project_id):
    # user_id = get_jwt_identity()
    user_id = "test-user-123"
    project = Project.query.filter_by(id=project_id, user_id=user_id).first()
    if not project:
        return jsonify({'success': False, 'error': {'code': 'PROJECT_NOT_FOUND'}}), 404
    return jsonify({'success': True, 'data': project.to_dict()}), 200

@projects_bp.route('/<project_id>', methods=['PUT'])
# @jwt_required()  # Temporarily disabled for testing
def update_project(project_id):
    # user_id = get_jwt_identity()
    user_id = "test-user-123"
    project = Project.query.filter_by(id=project_id, user_id=user_id).first()
    if not project:
        return jsonify({'success': False, 'error': {'code': 'PROJECT_NOT_FOUND'}}), 404

    try:
        data = ProjectSchema(partial=True).load(request.json)
    except ValidationError as e:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400

    for key, value in data.items():
        setattr(project, key, value)

    db.session.commit()
    return jsonify({'success': True, 'data': project.to_dict()}), 200

@projects_bp.route('/<project_id>', methods=['DELETE'])
# @jwt_required()  # Temporarily disabled for testing
def delete_project(project_id):
    # user_id = get_jwt_identity()
    user_id = "test-user-123"
    project = Project.query.filter_by(id=project_id, user_id=user_id).first()
    if not project:
        return jsonify({'success': False, 'error': {'code': 'PROJECT_NOT_FOUND'}}), 404
    db.session.delete(project)
    db.session.commit()
    return jsonify({'success': True, 'data': {'message': 'Project deleted'}}), 200
