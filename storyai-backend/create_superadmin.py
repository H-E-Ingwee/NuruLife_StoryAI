import os
import sys
sys.path.insert(0, os.path.dirname(__file__))

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash

# Create app with minimal config
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Create db instance
db = SQLAlchemy(app)

# Import models
from app.models import User

with app.app_context():
    # Check if superadmin exists
    existing = User.query.filter_by(email='Ingweplex@gmail.com').first()
    if existing:
        print('✓ Superadmin already exists')
    else:
        user = User(email='Ingweplex@gmail.com', full_name='Super Admin')
        user.password_hash = generate_password_hash('Ingweplex')
        db.session.add(user)
        db.session.commit()
        print('✓ Superadmin created: Ingweplex@gmail.com')