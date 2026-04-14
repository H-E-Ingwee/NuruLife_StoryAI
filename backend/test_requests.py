#!/usr/bin/env python
import requests
import time

# Give the server a moment to start
time.sleep(2)

try:
    print("Testing health endpoint...")
    response = requests.get('http://127.0.0.1:8000/health', timeout=5)
    print(f"Status: {response.status_code}")
    print(f"Content: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()

try:
    print("\nTesting login endpoint...")
    response = requests.post('http://127.0.0.1:8000/api/auth/login', json={'email': 'test@test.com', 'password': 'TestPass123'}, timeout=5)
    print(f"Status: {response.status_code}")
    print(f"Content: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
