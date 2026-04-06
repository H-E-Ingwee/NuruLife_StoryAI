mport csv
import os
from datetime import datetime
from io import StringIO
from zipfile import ZipFile

from flask import Blueprint, request, jsonify, current_app, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import Schema, fields, ValidationError

from app.models import Export, Project, Storyboard, Shot
from app.extensions import db


exports_bp = Blueprint('exports', __name__)


class ExportCreateSchema(Schema):
    project_id = fields.Str(required=True)
    export_type = fields.Str(required=True)  # pdf|images
    settings = fields.Dict(required=False)


def _ensure_exports_folder() -> str:
    upload_folder = current_app.config.get('UPLOAD_FOLDER')
    if not upload_folder:
        upload_folder = os.path.join(os.getcwd(), 'uploads')
    export_folder = os.path.join(upload_folder, 'exports')
    os.makedirs(export_folder, exist_ok=True)
    return export_folder


def _generated_shots_folder() -> str:
    upload_folder = current_app.config.get('UPLOAD_FOLDER')
    if not upload_folder:
        upload_folder = os.path.join(os.getcwd(), 'uploads')
    folder = os.path.join(upload_folder, 'generated_shots')
    os.makedirs(folder, exist_ok=True)
    return folder


def _candidate_image_files(shot_id: str):
    # Must match `shots.py` generated image names.
    folder = _generated_shots_folder()
    candidates = []
    for ext in ('png', 'jpg', 'jpeg', 'gif'):
        candidates.append((ext, os.path.join(folder, f"{shot_id}.{ext}")))
    return candidates


def _generate_export_zip(export: Export) -> str:
    """
    MVP export:
    - latest storyboard for the project
    - generated shot images (if available)
    - `shot_list.csv`
    - packaged in a `.zip` file
    """
    export_folder = _ensure_exports_folder()
    zip_path = os.path.join(export_folder, f"{export.id}.zip")

    storyboard = (
        Storyboard.query.filter_by(project_id=export.project_id)
        .order_by(Storyboard.updated_at.desc())
        .first()
    )
    shots = []
    if storyboard:
        shots = Shot.query.filter_by(storyboard_id=storyboard.id).order_by(Shot.shot_number.asc()).all()

    csv_buf = StringIO()
    writer = csv.writer(csv_buf)
    writer.writerow([
        'shot_id',
        'scene_number',
        'shot_number',
        'scene',
        'action',
        'prompt',
        'image_status',
    ])

    with ZipFile(zip_path, 'w') as zipf:
        # Add images + CSV rows.
        for shot in shots:
            writer.writerow([
                shot.id,
                shot.scene_number,
                shot.shot_number,
                shot.scene,
                shot.action,
                shot.prompt,
                shot.image_status,
            ])

            for ext, abs_path in _candidate_image_files(shot.id):
                if os.path.exists(abs_path):
                    arcname = f"images/{shot.id}.{ext}"
                    zipf.write(abs_path, arcname=arcname)
                    break

        zipf.writestr('shot_list.csv', csv_buf.getvalue())

    return zip_path


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

    # MVP: generate synchronously.
    try:
        _generate_export_zip(export)
        export.status = 'completed'
        export.file_url = f"/api/exports/{export.id}/download"
        export.completed_at = datetime.utcnow()
        db.session.commit()
    except Exception as e:
        export.status = 'failed'
        db.session.commit()
        return jsonify({'success': False, 'error': {'code': 'EXPORT_FAILED', 'message': str(e)}}), 500

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

    if export.status != 'completed':
        return jsonify({'success': False, 'error': {'code': 'EXPORT_NOT_READY', 'message': 'Export not ready'}}), 409

    export_folder = _ensure_exports_folder()
    abs_zip_path = os.path.join(export_folder, f"{export.id}.zip")
    if not os.path.exists(abs_zip_path):
        return jsonify({'success': False, 'error': {'code': 'EXPORT_FILE_MISSING', 'message': 'Export file missing'}}), 404

    return send_file(
        abs_zip_path,
        as_attachment=True,
        download_name=f"storyai_export_{export.id}.zip",
        mimetype='application/zip',
    )

