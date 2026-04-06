from app.minimal_app import create_app
from app.extensions import db
from app.models import User

app = create_app()

with app.app_context():
    # Check if user exists
    existing = User.query.filter_by(email='Ingweplex@gmail.com').first()
    if existing:
        print('Superadmin already exists')
    else:
        user = User(email='Ingweplex@gmail.com', full_name='Super Admin')
        user.set_password('Ingweplex')
        db.session.add(user)
        db.session.commit()
        print('Superadmin created')