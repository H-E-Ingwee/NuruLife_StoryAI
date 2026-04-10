#!/usr/bin/env python
"""Full backend test flow"""

import requests
import json

print("Full Backend Test Flow\n")

# Step 1: Register
print("1. Registering user...")
reg_resp = requests.post('http://localhost:8000/api/auth/register', json={
    'email': 'panel@test.com',
    'password': 'Password123!',
    'full_name': 'Panel Tester'
})
print(f"Register: {reg_resp.status_code}")
if reg_resp.status_code != 201:
    print(f"Error: {reg_resp.text}")
else:
    reg_data = reg_resp.json()
    access_token = reg_data['data']['access_token']
    print(f"✓ Got token: {access_token[:50]}...\n")

# Step 2: Create a project
print("2. Creating project...")
headers = {'Authorization': f'Bearer {access_token}'}
proj_resp = requests.post('http://localhost:8000/api/projects', 
    json={
        'title': 'Test Project',
        'description': 'Test Description',
        'script_text': 'INT. ROOM - DAY\n\nHero enters.'
    },
    headers=headers
)
print(f"Create project: {proj_resp.status_code}")
if proj_resp.status_code != 201:
    print(f"Error: {proj_resp.text}")
else:
    proj = proj_resp.json()['data']
    print(f"✓ Created project: {proj['title']} (ID: {proj['id']})\n")

# Step 3: Get projects
print("3. Getting projects...")
list_resp = requests.get('http://localhost:8000/api/projects?page=1&page_size=20',
    headers=headers
)
print(f"Get projects: {list_resp.status_code}")
print(f"Content-Type: {list_resp.headers.get('content-type')}")
print(f"Response preview: {list_resp.text[:200]}...")

if list_resp.status_code == 200:
    try:
        projects = list_resp.json()
        print(f"\n✓ Success! Got {len(projects.get('data', []))} projects")
    except Exception as e:
        print(f"\n✗ Could not parse JSON response: {e}")
else:
    print(f"\n✗ Failed with status {list_resp.status_code}")
