mport uuid
from datetime import datetime

from app.extensions import db


class Export(db.Model):
    __tablename__ = 'exports'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.String(36), db.ForeignKey('projects.id'), nullable=True)

    export_type = db.Column(db.String(50))  # pdf, images
    status = db.Column(db.String(50), default='processing')  # processing|completed|failed
    file_url = db.Column(db.String(500))
    settings = db.Column(db.JSON, default=dict)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'project_id': self.project_id,
            'export_type': self.export_type,
            'status': self.status,
            'file_url': self.file_url,
            'settings': self.settings or {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
        }

