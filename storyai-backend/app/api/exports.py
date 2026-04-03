from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError

from app.models import Export, Project
from app.extensions import db


exports_bp = Blueprint('exports', __name__)


class ExportCreateSchema(Schema):
    project_id = fields.Str(required=True)
    export_type = fields.Str(required=True)  # pdf|images
    settings = fields.Dict(required=False)


@exports_bp.route('', methods=['GET'])
@jwt_required()
def list_exports():
    user_id = get_jwt_identity()
    project_id = request.args.get('project_id')

    query = Export.query.filter_by(user_id=user_id)
    if project_id:
        query = query.filter_by(project_id=project_id)

    exports = query.order_by(Export.created_at.desc()).all()
    return jsonify({'success': True, 'data': [e.to_dict() for e in exports]}), 200


@exports_bp.route('', methods=['POST'])
@jwt_required()
def create_export():
    try:
        data = ExportCreateSchema().load(request.json or {})
    except ValidationError as e:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'details': e.messages}}), 400

    user_id = get_jwt_identity()
    project = Project.query.filter_by(id=data['project_id'], user_id=user_id).first()
    if not project:
        return jsonify({'success': False, 'error': {'code': 'PROJECT_NOT_FOUND', 'message': 'Project not found'}}), 404

    export = Export(
        user_id=user_id,
        project_id=data['project_id'],
        export_type=data['export_type'],
        status='processing',
        settings=data.get('settings') or {},
    )
    db.session.add(export)
    db.session.commit()
    return jsonify({'success': True, 'data': export.to_dict()}), 201


@exports_bp.route('/<export_id>', methods=['GET'])
@jwt_required()
def get_export(export_id):
    user_id = get_jwt_identity()
    export = Export.query.filter_by(id=export_id, user_id=user_id).first()
    if not export:
        return jsonify({'success': False, 'error': {'code': 'EXPORT_NOT_FOUND', 'message': 'Export not found'}}), 404
    return jsonify({'success': True, 'data': export.to_dict()}), 200


@exports_bp.route('/<export_id>/download', methods=['GET'])
@jwt_required()
def download_export(export_id):
    user_id = get_jwt_identity()
    export = Export.query.filter_by(id=export_id, user_id=user_id).first()
    if not export:
        return jsonify({'success': False, 'error': {'code': 'EXPORT_NOT_FOUND', 'message': 'Export not found'}}), 404

    # Implemented in a later todo: backend-export
    if not export.file_url:
        return jsonify({'success': False, 'error': {'code': 'EXPORT_NOT_READY', 'message': 'Export not ready'}}), 409

    return jsonify({'success': False, 'error': {'code': 'NOT_IMPLEMENTED', 'message': 'Export download not implemented yet'}}), 501

