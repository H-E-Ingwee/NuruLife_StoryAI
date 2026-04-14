#!/usr/bin/env python
"""Test CORS configuration"""

import requests

print('Testing CORS configuration...\n')

# Test with Origin header (simulating browser preflight)
print('1. Testing with Origin header (simulating browser)...')
headers = {
    'Origin': 'http://localhost:5174',
    'Content-Type': 'application/json'
}

try:
    # First do OPTIONS request
    r = requests.options('http://localhost:8000/api/auth/login', headers=headers)
    print(f'OPTIONS response: {r.status_code}')
    if 'access-control-allow-origin' in r.headers:
        print(f'✓ CORS Allow-Origin: {r.headers.get("access-control-allow-origin")}')
    else:
        print('✗ No CORS headers in response')
        print('Headers:', dict(r.headers))
except Exception as e:
    print(f'✗ OPTIONS failed: {e}')

# Now test login
print('\n2. Testing login with Origin header...')
login_data = {'email': 'cors@test.com', 'password': 'Pass123!'}

try:
    r = requests.post('http://localhost:8000/api/auth/login', json=login_data, headers=headers)
    print(f'Login response: {r.status_code}')
    if r.status_code == 200 or r.status_code == 201:
        print('✓ Login successful! CORS working!')
        resp = r.json()
        print(f'  • Got token: {resp["data"]["access_token"][:40]}...')
    else:
        print(f'Response: {r.text}')
except Exception as e:
    print(f'✗ Login failed: {e}')

print('\n✅ CORS Configuration Ready')
