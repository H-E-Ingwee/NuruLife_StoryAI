from marshmallow import Schema, fields, ValidationError
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models import Storyboard, Project, Shot


storyboards_bp = Blueprint('storyboards', __name__)


class StoryboardCreateSchema(Schema):
    project_id = fields.Str(required=True)
    title = fields.Str(required=True)
    description = fields.Str(required=False, allow_none=True)
    layout = fields.Dict(required=False)  # MVP stores list; accept dict/array-like JSON


class StoryboardUpdateSchema(Schema):
    title = fields.Str(required=False)
    description = fields.Str(required=False, allow_none=True)
    layout = fields.Raw(required=False)


class ShotCreateSchema(Schema):
    scene_number = fields.Int(required=False, allow_none=True)
    shot_number = fields.Int(required=False, allow_none=True)
    scene = fields.Str(required=False, allow_none=True)
    action = fields.Str(required=False, allow_none=True)
    prompt = fields.Str(required=False, allow_none=True)

    # Client-friendly naming
    shotSize = fields.Str(required=False, allow_none=True)
    cameraAngle = fields.Str(required=False, allow_none=True)
    lens = fields.Str(required=False, allow_none=True)
    notes = fields.Str(required=False, allow_none=True)

    consistency_data = fields.Dict(required=False)
    camera_settings = fields.Dict(required=False)


@storyboards_bp.route('', methods=['GET'])
@jwt_required()
def list_storyboards():
    user_id = get_jwt_identity()
    project_id = request.args.get('project_id')

    query = Storyboard.query.join(Project, Storyboard.project_id == Project.id).filter(Project.user_id == user_id)
    if project_id:
        query = query.filter(Storyboard.project_id == project_id)

    storyboards = query.order_by(Storyboard.updated_at.desc()).all()
    return jsonify({'success': True, 'data': [s.to_dict() for s in storyboards]}), 200


@storyboards_bp.route('', methods=['POST'])
@jwt_required()
def create_storyboard():
    try:
        data = StoryboardCreateSchema().load(request.json or {})
    except ValidationError as e:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400

    user_id = get_jwt_identity()
    project = Project.query.filter_by(id=data['project_id'], user_id=user_id).first()
    if not project:
        return jsonify({'success': False, 'error': {'code': 'PROJECT_NOT_FOUND', 'message': 'Project not found'}}), 404

    storyboard = Storyboard(
        project_id=data['project_id'],
        title=data['title'].strip(),
        description=data.get('description'),
        layout=data.get('layout') or [],
    )
    db.session.add(storyboard)
    db.session.commit()

    return jsonify({'success': True, 'data': storyboard.to_dict()}), 201


@storyboards_bp.route('/<storyboard_id>', methods=['GET'])
@jwt_required()
def get_storyboard(storyboard_id):
    user_id = get_jwt_identity()
    storyboard = (
        Storyboard.query.join(Project, Storyboard.project_id == Project.id)
        .filter(Project.user_id == user_id, Storyboard.id == storyboard_id)
        .first()
    )
    if not storyboard:
        return jsonify({'success': False, 'error': {'code': 'STORYBOARD_NOT_FOUND', 'message': 'Storyboard not found'}}), 404
    return jsonify({'success': True, 'data': storyboard.to_dict()}), 200


@storyboards_bp.route('/<storyboard_id>', methods=['PUT'])
@jwt_required()
def update_storyboard(storyboard_id):
    try:
        data = StoryboardUpdateSchema().load(request.json or {}, partial=True)
    except ValidationError as e:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400

    user_id = get_jwt_identity()
    storyboard = (
        Storyboard.query.join(Project, Storyboard.project_id == Project.id)
        .filter(Project.user_id == user_id, Storyboard.id == storyboard_id)
        .first()
    )
    if not storyboard:
        return jsonify({'success': False, 'error': {'code': 'STORYBOARD_NOT_FOUND', 'message': 'Storyboard not found'}}), 404

    for k, v in data.items():
        setattr(storyboard, k, v)
    db.session.commit()
    return jsonify({'success': True, 'data': storyboard.to_dict()}), 200


@storyboards_bp.route('/<storyboard_id>', methods=['DELETE'])
@jwt_required()
def delete_storyboard(storyboard_id):
    user_id = get_jwt_identity()
    storyboard = (
        Storyboard.query.join(Project, Storyboard.project_id == Project.id)
        .filter(Project.user_id == user_id, Storyboard.id == storyboard_id)
        .first()
    )
    if not storyboard:
        return jsonify({'success': False, 'error': {'code': 'STORYBOARD_NOT_FOUND', 'message': 'Storyboard not found'}}), 404

    db.session.delete(storyboard)
    db.session.commit()
    return jsonify({'success': True, 'data': {'message': 'Storyboard deleted'}}), 200


@storyboards_bp.route('/<storyboard_id>/shots', methods=['GET'])
@jwt_required()
def list_storyboard_shots(storyboard_id):
    user_id = get_jwt_identity()

    query = (
        Shot.query.join(Storyboard, Shot.storyboard_id == Storyboard.id)
        .join(Project, Storyboard.project_id == Project.id)
        .filter(Project.user_id == user_id, Storyboard.id == storyboard_id)
    )
    shots = query.order_by(Shot.scene_number.asc(), Shot.shot_number.asc()).all()
    return jsonify({'success': True, 'data': [sh.to_dict() for sh in shots]}), 200


@storyboards_bp.route('/<storyboard_id>/shots', methods=['POST'])
@jwt_required()
def create_storyboard_shot(storyboard_id):
    try:
        data = ShotCreateSchema().load(request.json or {})
    except ValidationError as e:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400

    user_id = get_jwt_identity()

    storyboard = (
        Storyboard.query.join(Project, Storyboard.project_id == Project.id)
        .filter(Project.user_id == user_id, Storyboard.id == storyboard_id)
        .first()
    )
    if not storyboard:
        return jsonify({'success': False, 'error': {'code': 'STORYBOARD_NOT_FOUND', 'message': 'Storyboard not found'}}), 404

    shot = Shot(
        storyboard_id=storyboard_id,
        scene_number=data.get('scene_number'),
        shot_number=data.get('shot_number'),
        scene=data.get('scene'),
        action=data.get('action'),
        prompt=data.get('prompt'),
        shot_size=data.get('shotSize'),
        camera_angle=data.get('cameraAngle'),
        lens=data.get('lens'),
        notes=data.get('notes'),
        consistency_data=data.get('consistency_data') or {},
        camera_settings=data.get('camera_settings') or {},
    )
    db.session.add(shot)
    db.session.commit()
    return jsonify({'success': True, 'data': shot.to_dict()}), 201


@storyboards_bp.route('/parse-script', methods=['POST'])
@jwt_required()
def parse_script_endpoint():
    """
    Parse a script and auto-generate storyboard with shots.
    
    Request body:
    {
        "project_id": "project_id",
        "storyboard_title": "optional, defaults to 'Untitled Storyboard'",
        "script_text": "full script text",
        "max_shots_per_scene": 4
    }
    
    Returns:
        storyboard with all parsed shots
    """
    try:
        req_data = request.json or {}
        project_id = req_data.get('project_id')
        script_text = req_data.get('script_text', '')
        storyboard_title = req_data.get('storyboard_title', 'Untitled Storyboard').strip()
        max_shots_per_scene = req_data.get('max_shots_per_scene', 4)
        
        if not project_id or not script_text.strip():
            return jsonify({
                'success': False, 
                'error': {'code': 'INVALID_INPUT', 'message': 'project_id and script_text are required'}
            }), 400
    except Exception as e:
        return jsonify({
            'success': False, 
            'error': {'code': 'PARSE_ERROR', 'message': str(e)}
        }), 400
    
    user_id = get_jwt_identity()
    
    # Verify project exists and belongs to user
    project = Project.query.filter_by(id=project_id, user_id=user_id).first()
    if not project:
        return jsonify({
            'success': False, 
            'error': {'code': 'PROJECT_NOT_FOUND', 'message': 'Project not found'}
        }), 404
    
    try:
        # Import the NLP parser
        from app.nlp.script_parser import parse_script
        
        # Parse the script
        parse_result = parse_script(script_text, max_shots_per_scene=max_shots_per_scene)
        
        # Create storyboard
        storyboard = Storyboard(
            project_id=project_id,
            title=storyboard_title,
            description=f"Auto-parsed from script. {len(parse_result['shots'])} shots generated.",
            layout=[],
        )
        db.session.add(storyboard)
        db.session.flush()  # Get the ID without committing yet
        
        # Create shots from parsed data
        shots_created = []
        for shot_data in parse_result['shots']:
            shot = Shot(
                storyboard_id=storyboard.id,
                scene_number=shot_data.get('scene_number'),
                shot_number=shot_data.get('shot_number'),
                scene=shot_data.get('scene'),
                action=shot_data.get('action'),
                prompt=shot_data.get('prompt'),
                shot_size=shot_data.get('shotSize'),
                camera_angle=shot_data.get('cameraAngle'),
                lens=shot_data.get('lens'),
                notes=shot_data.get('notes'),
                consistency_data=shot_data.get('consistency_data') or {},
                camera_settings=shot_data.get('camera_settings') or {},
                image_status='pending',
            )
            db.session.add(shot)
            shots_created.append(shot)
        
        db.session.commit()
        
        # Return storyboard with shots
        response_data = storyboard.to_dict()
        response_data['shots'] = [sh.to_dict() for sh in shots_created]
        response_data['characters'] = parse_result.get('characters', [])
        response_data['locations'] = parse_result.get('locations', [])
        response_data['total_shots'] = len(shots_created)
       
        return jsonify({'success': True, 'data': response_data}), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'error': {'code': 'SCRIPT_PARSE_ERROR', 'message': f'Failed to parse script: {str(e)}'}
        }), 500

