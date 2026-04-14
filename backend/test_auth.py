#!/usr/bin/env python
import sys
sys.path.insert(0, '.')

from app import create_app
from app.extensions import db
from app.models import User
from app.auth.auth_service import AuthService

app = create_app()
with app.app_context():
    # Test if User model works
    print("✓ Testing User model...")
    try:
        test_email = 'debug@test.com'
        # Clean up if exists
        existing = User.query.filter_by(email=test_email).first()
        if existing:
            db.session.delete(existing)
            db.session.commit()
        
        # Try to create a user
        user, err = AuthService.register_user(test_email, 'TestPass123', 'Debug User')
        if err:
            print(f"✗ Registration error: {err}")
        else:
            print(f"✓ User created: {user.email}")
            
            # Try to authenticate
            auth_user = AuthService.authenticate_user(test_email, 'TestPass123')
            if auth_user:
                print(f"✓ Authentication successful: {auth_user.email}")
                tokens = AuthService.create_tokens(auth_user)
                print(f"✓ Tokens created: {list(tokens.keys())}")
            else:
                print("✗ Authentication failed")
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
