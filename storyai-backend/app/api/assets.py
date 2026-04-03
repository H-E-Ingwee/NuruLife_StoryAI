import os
import uuid

from flask import Blueprint, request, jsonify, current_app, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, ValidationError
from werkzeug.utils import secure_filename

from app.models import Asset, Project
from app.extensions import db


assets_bp = Blueprint('assets', __name__)


class AssetUploadErrorSchema(Schema):
    """Placeholder schema for future detailed validation."""


def _ensure_upload_folder():
    upload_folder = current_app.config.get('UPLOAD_FOLDER')
    if not upload_folder:
        upload_folder = os.path.join(os.getcwd(), 'uploads')
    os.makedirs(upload_folder, exist_ok=True)
    return upload_folder


@assets_bp.route('', methods=['GET'])
@jwt_required()
def list_assets():
    user_id = get_jwt_identity()
    project_id = request.args.get('project_id')

    query = Asset.query.filter_by(user_id=user_id)
    if project_id:
        query = query.filter_by(project_id=project_id)

    assets = query.order_by(Asset.uploaded_at.desc()).all()
    data = []
    for a in assets:
        item = a.to_dict()
        item['url'] = f"/api/assets/{a.id}/download"
        data.append(item)
    return jsonify({'success': True, 'data': data}), 200


@assets_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_asset():
    if 'file' not in request.files:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'message': 'Missing file'}}), 400

    file = request.files['file']
    if not file or not file.filename:
        return jsonify({'success': False, 'error': {'code': 'VALIDATION_ERROR', 'message': 'Invalid file'}}), 400

    user_id = get_jwt_identity()
    project_id = request.form.get('project_id') or None
    asset_type = request.form.get('asset_type') or None

    if project_id:
        # Ensure ownership
        project = Project.query.filter_by(id=project_id, user_id=user_id).first()
        if not project:
            return jsonify({'success': False, 'error': {'code': 'PROJECT_NOT_FOUND', 'message': 'Project not found'}}), 404

    upload_folder = _ensure_upload_folder()
    original_filename = secure_filename(file.filename)
    _, ext = os.path.splitext(original_filename)
    ext = ext.lower().lstrip('.')

    file_id = str(uuid.uuid4())
    stored_filename = f"{file_id}.{ext}" if ext else file_id
    stored_path = stored_filename

    # Save to disk (dev MVP)
    file.save(os.path.join(upload_folder, stored_path))

    mime_type = file.mimetype
    derived_file_type = asset_type
    if not derived_file_type:
        if mime_type and mime_type.startswith('image/'):
            derived_file_type = 'image'
        elif mime_type and mime_type.startswith('video/'):
            derived_file_type = 'video'
        elif mime_type and mime_type.startswith('audio/'):
            derived_file_type = 'audio'
        else:
            derived_file_type = 'document'

    asset = Asset(
        user_id=user_id,
        project_id=project_id,
        filename=stored_filename,
        original_filename=original_filename,
        file_path=stored_path,
        file_size=os.path.getsize(os.path.join(upload_folder, stored_path)) if os.path.exists(os.path.join(upload_folder, stored_path)) else None,
        mime_type=mime_type,
        file_type=derived_file_type,
        tags=[],
        metadata={},
        is_favorite=False,
    )

    db.session.add(asset)
    db.session.commit()

    item = asset.to_dict()
    item['url'] = f"/api/assets/{asset.id}/download"
    return jsonify({'success': True, 'data': item}), 201


@assets_bp.route('/<asset_id>/download', methods=['GET'])
def download_asset(asset_id):
    # MVP note: assets are publicly readable so the frontend can render thumbnails.
    # List/create/delete remain JWT-protected.
    asset = Asset.query.filter_by(id=asset_id).first()
    if not asset:
        return jsonify({'success': False, 'error': {'code': 'ASSET_NOT_FOUND', 'message': 'Asset not found'}}), 404

    upload_folder = _ensure_upload_folder()
    abs_path = os.path.join(upload_folder, asset.file_path)
    if not os.path.exists(abs_path):
        return jsonify({'success': False, 'error': {'code': 'ASSET_FILE_MISSING', 'message': 'File missing'}}), 404

    # Use Flask's send_file to stream content
    return send_file(abs_path, mimetype=asset.mime_type or 'application/octet-stream', as_attachment=False)


@assets_bp.route('/<asset_id>', methods=['DELETE'])
@jwt_required()
def delete_asset(asset_id):
    user_id = get_jwt_identity()
    asset = Asset.query.filter_by(id=asset_id, user_id=user_id).first()
    if not asset:
        return jsonify({'success': False, 'error': {'code': 'ASSET_NOT_FOUND', 'message': 'Asset not found'}}), 404

    db.session.delete(asset)
    db.session.commit()
    return jsonify({'success': True, 'data': {'message': 'Asset deleted'}}), 200

