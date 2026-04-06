import requests
import json

# Test the health check endpoint (doesn't require auth)
try:
    response = requests.get('http://localhost:8000/health')
    print(f'Health check: {response.status_code}')
    print(f'Response: {response.json()}')
except Exception as e:
    print(f'Health check failed: {e}')

# Test the register endpoint
try:
    response = requests.post('http://localhost:8000/api/auth/register', json={
        'email': 'test@example.com',
        'password': 'testpassword123',
        'full_name': 'Test User'
    })
    print(f'\nRegister: {response.status_code}')
    if response.status_code != 409:
        print(f'Response: {response.text[:500]}')
    else:
        print('Email already exists')
except Exception as e:
    print(f'Register failed: {e}')
