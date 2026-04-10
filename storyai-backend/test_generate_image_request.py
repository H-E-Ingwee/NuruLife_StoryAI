import requests
import json
from datetime import datetime, timedelta
import jwt

# Configuration
BACKEND_URL = "http://localhost:8000"
JWT_SECRET_KEY = "dev-jwt-secret"  # From app config

# Create a JWT token with the correct secret
payload = {
    'sub': 'test-user-id',  # User ID
    'exp': datetime.utcnow() + timedelta(hours=1),
    'iat': datetime.utcnow()
}

try:
    token = jwt.encode(payload, JWT_SECRET_KEY, algorithm='HS256')
    print(f"Generated JWT Token: {token}\n")
except Exception as e:
    print(f"Error generating token: {e}\n")
    token = "test-token"

# Make a test request to /api/shots/test/generate-image
headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

data = {
    'prompt': 'A beautiful sunset over mountains',
    'width': 1024,
    'height': 1024
}

try:
    print(f"Making POST request to {BACKEND_URL}/api/shots/test/generate-image")
    print(f"Payload: {json.dumps(data, indent=2)}\n")
    
    response = requests.post(
        f"{BACKEND_URL}/api/shots/test/generate-image",
        headers=headers,
        json=data,
        timeout=10
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {dict(response.headers)}")
    print(f"\nResponse Body:\n{response.text}")
    
    # Try to parse as JSON
    try:
        print(f"\nParsed JSON:\n{json.dumps(response.json(), indent=2)}")
    except:
        pass
        
except Exception as e:
    print(f"Error making request: {e}")
    import traceback
    traceback.print_exc()
