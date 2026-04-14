from flask import Blueprint, request, jsonify
from marshmallow import Schema, fields, ValidationError
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models import Character, Project
from app.extensions import db


characters_bp = Blueprint('characters', __name__)


class CharacterCreateSchema(Schema):
    project_id = fields.Str(required=True)
    name = fields.Str(required=True, validate=lambda x: len(x.strip()) > 0)
    role = fields.Str(required=False)
    type = fields.Str(required=False)
    description = fields.Str(required=False, allow_none=True)
    traits = fields.List(fields.Str(), required=False, allow_none=True)
    avatar_url = fields.Str(required=False, allow_none=True)
    reference_images = fields.List(fields.Str(), required=False, allow_none=True)
    consistency_settings = fields.Dict(required=False)


class CharacterUpdateSchema(Schema):
    name = fields.Str(required=False)
    role = fields.Str(required=False)
    type = fields.Str(required=False)
    description = fields.Str(required=False, allow_none=True)
    traits = fields.List(fields.Str(), required=False, allow_none=True)
    avatar_url = fields.Str(required=False, allow_none=True)
    reference_images = fields.List(fields.Str(), required=False, allow_none=True)
    consistency_settings = fields.Dict(required=False)


@characters_bp.route('', methods=['GET'])
@jwt_required()
def list_characters():
    user_id = get_jwt_identity()
    project_id = request.args.get('project_id')

    query = Character.query.join(Project, Character.project_id == Project.id).filter(Project.user_id == user_id)
    if project_id:
        query = query.filter(Character.project_id == project_id)

    characters = query.order_by(Character.name.asc()).all()
    return jsonify({'success': True, 'data': [c.to_dict() for c in characters]}), 200


@characters_bp.route('', methods=['POST'])
@jwt_required()
def create_character():
    try:
        data = CharacterCreateSchema().load(request.json or {})
    except ValidationError as e:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400

    user_id = get_jwt_identity()
    project = Project.query.filter_by(id=data['project_id'], user_id=user_id).first()
    if not project:
        return jsonify({'success': False, 'error': {'code': 'PROJECT_NOT_FOUND', 'message': 'Project not found'}}), 404

    character = Character(
        project_id=data['project_id'],
        name=data['name'].strip(),
        role=data.get('role'),
        type=data.get('type'),
        description=data.get('description'),
        traits=data.get('traits') or [],
        avatar_url=data.get('avatar_url'),
        reference_images=data.get('reference_images') or [],
        consistency_settings=data.get('consistency_settings') or {},
    )
    db.session.add(character)
    db.session.commit()

    return jsonify({'success': True, 'data': character.to_dict()}), 201


@characters_bp.route('/<character_id>', methods=['GET'])
@jwt_required()
def get_character(character_id):
    user_id = get_jwt_identity()
    character = (
        Character.query.join(Project, Character.project_id == Project.id)
        .filter(Project.user_id == user_id, Character.id == character_id)
        .first()
    )
    if not character:
        return jsonify({'success': False, 'error': {'code': 'CHARACTER_NOT_FOUND', 'message': 'Character not found'}}), 404

    return jsonify({'success': True, 'data': character.to_dict()}), 200


@characters_bp.route('/<character_id>', methods=['PUT'])
@jwt_required()
def update_character(character_id):
    try:
        data = CharacterUpdateSchema().load(request.json or {}, partial=True)
    except ValidationError as e:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400

    user_id = get_jwt_identity()
    character = (
        Character.query.join(Project, Character.project_id == Project.id)
        .filter(Project.user_id == user_id, Character.id == character_id)
        .first()
    )
    if not character:
        return jsonify({'success': False, 'error': {'code': 'CHARACTER_NOT_FOUND', 'message': 'Character not found'}}), 404

    for key, value in data.items():
        setattr(character, key, value)
    db.session.commit()

    return jsonify({'success': True, 'data': character.to_dict()}), 200


@characters_bp.route('/<character_id>', methods=['DELETE'])
@jwt_required()
def delete_character(character_id):
    user_id = get_jwt_identity()
    character = (
        Character.query.join(Project, Character.project_id == Project.id)
        .filter(Project.user_id == user_id, Character.id == character_id)
        .first()
    )
    if not character:
        return jsonify({'success': False, 'error': {'code': 'CHARACTER_NOT_FOUND', 'message': 'Character not found'}}), 404

    db.session.delete(character)
    db.session.commit()
    return jsonify({'success': True, 'data': {'message': 'Character deleted'}}), 200

