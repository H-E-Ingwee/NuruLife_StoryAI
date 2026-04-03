import uuid
from datetime import datetime

from app.extensions import db


class Asset(db.Model):
    __tablename__ = 'assets'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.String(36), db.ForeignKey('projects.id'), nullable=True)

    filename = db.Column(db.String(255), nullable=False)
    original_filename = db.Column(db.String(255), nullable=False)
    file_path = db.Column(db.String(500), nullable=False)

    file_size = db.Column(db.BigInteger)
    mime_type = db.Column(db.String(100))
    file_type = db.Column(db.String(50))  # image, video, audio, document

    tags = db.Column(db.JSON, default=list)  # list[str]
    metadata = db.Column(db.JSON, default=dict)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    is_favorite = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'project_id': self.project_id,
            'filename': self.filename,
            'original_filename': self.original_filename,
            'file_path': self.file_path,
            'file_size': self.file_size,
            'mime_type': self.mime_type,
            'file_type': self.file_type,
            'tags': self.tags or [],
            'metadata': self.metadata or {},
            'uploaded_at': self.uploaded_at.isoformat() if self.uploaded_at else None,
            'favorite': self.is_favorite,
            # `url` is filled by the storage layer / later endpoints
            'url': None,
        }

