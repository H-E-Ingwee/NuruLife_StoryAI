from marshmallow import Schema, fields, ValidationError
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.extensions import db
from app.models import Shot, Storyboard, Project


shots_bp = Blueprint('shots', __name__)


class ShotUpdateSchema(Schema):
    scene = fields.Str(required=False, allow_none=True)
    action = fields.Str(required=False, allow_none=True)
    prompt = fields.Str(required=False, allow_none=True)
    shotSize = fields.Str(required=False, allow_none=True)
    cameraAngle = fields.Str(required=False, allow_none=True)
    lens = fields.Str(required=False, allow_none=True)
    notes = fields.Str(required=False, allow_none=True)

    consistency_data = fields.Dict(required=False)
    camera_settings = fields.Dict(required=False)


def _get_user_shot(user_id: str, shot_id: str):
    return (
        Shot.query.join(Storyboard, Shot.storyboard_id == Storyboard.id)
        .join(Project, Storyboard.project_id == Project.id)
        .filter(Project.user_id == user_id, Shot.id == shot_id)
        .first()
    )


@shots_bp.route('/<shot_id>', methods=['GET'])
@jwt_required()
def get_shot(shot_id):
    user_id = get_jwt_identity()
    shot = _get_user_shot(user_id, shot_id)
    if not shot:
        return jsonify({'success': False, 'error': {'code': 'SHOT_NOT_FOUND', 'message': 'Shot not found'}}), 404
    return jsonify({'success': True, 'data': shot.to_dict()}), 200


@shots_bp.route('/<shot_id>', methods=['PUT'])
@jwt_required()
def update_shot(shot_id):
    try:
        data = ShotUpdateSchema().load(request.json or {}, partial=True)
    except ValidationError as e:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400

    user_id = get_jwt_identity()
    shot = _get_user_shot(user_id, shot_id)
    if not shot:
        return jsonify({'success': False, 'error': {'code': 'SHOT_NOT_FOUND', 'message': 'Shot not found'}}), 404

    # Map client-friendly keys to model columns
    if 'shotSize' in data:
        shot.shot_size = data.get('shotSize')
    if 'cameraAngle' in data:
        shot.camera_angle = data.get('cameraAngle')
    if 'consistency_data' in data:
        shot.consistency_data = data.get('consistency_data') or {}
    if 'camera_settings' in data:
        shot.camera_settings = data.get('camera_settings') or {}

    for key, value in data.items():
        if key in {'shotSize', 'cameraAngle', 'consistency_data', 'camera_settings'}:
            continue
        setattr(shot, key, value)

    db.session.commit()
    return jsonify({'success': True, 'data': shot.to_dict()}), 200


@shots_bp.route('/<shot_id>', methods=['DELETE'])
@jwt_required()
def delete_shot(shot_id):
    user_id = get_jwt_identity()
    shot = _get_user_shot(user_id, shot_id)
    if not shot:
        return jsonify({'success': False, 'error': {'code': 'SHOT_NOT_FOUND', 'message': 'Shot not found'}}), 404

    db.session.delete(shot)
    db.session.commit()
    return jsonify({'success': True, 'data': {'message': 'Shot deleted'}}), 200


@shots_bp.route('/<shot_id>/generate-image', methods=['POST'])
@jwt_required()
def generate_image_for_shot(shot_id):
    # Implemented in a later todo: backend-ai-generation
    return jsonify({
        'success': False,
        'error': {
            'code': 'NOT_IMPLEMENTED',
            'message': 'AI image generation is not implemented yet'
        }
    }), 501


@shots_bp.route('/<shot_id>/image-status', methods=['GET'])
@jwt_required()
def get_image_status(shot_id):
    user_id = get_jwt_identity()
    shot = _get_user_shot(user_id, shot_id)
    if not shot:
        return jsonify({'success': False, 'error': {'code': 'SHOT_NOT_FOUND', 'message': 'Shot not found'}}), 404

    return jsonify({
        'success': True,
        'data': {
            'job_id': shot.generation_job_id,
            'image_status': shot.image_status,
            'image_url': shot.image_url,
        }
    }), 200

