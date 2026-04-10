#!/usr/bin/env python
"""Test image generation feature"""

import requests
import json

email = 'uitest@storyai.com'
password = 'TestPass123!'

# Login
print("1. Logging in...")
r = requests.post('http://localhost:8000/api/auth/login', json={'email': email, 'password': password})
if r.status_code != 200:
    print(f"Login failed: {r.text}")
    exit(1)

token = r.json()['data']['access_token']
headers = {'Authorization': f'Bearer {token}'}
print("✓ Logged in\n")

# Get projects
print("2. Getting projects...")
r = requests.get('http://localhost:8000/api/projects?page=1&page_size=20', headers=headers)
projects = r.json()['data']
print(f"✓ Found {len(projects)} projects")

if not projects:
    print("No projects available")
    exit(1)

project = projects[0]
print(f"Selected: {project['title']}\n")

# Parse script to create shots
print("3. Parsing script...")
script_text = project.get('script_text', 'INT. ROOM - DAY\n\nA hero enters.')

r = requests.post(f'http://localhost:8000/api/projects/{project["id"]}/parse-script', 
    json={'script_text': script_text},
    headers=headers)

print(f"Parse response: {r.status_code}")
if r.status_code != 200:
    print(f"Error: {r.text[:500]}")
    exit(1)

result = r.json()
if not result.get('success'):
    print(f"Parse failed: {result}")
    exit(1)

shots = result['data']['shots']
print(f"✓ Created {len(shots)} shots\n")

if shots:
    shot = shots[0]
    print(f"4. Selected shot: {shot.get('scene')}")
    print(f"   Prompt: {shot.get('prompt', 'N/A')[:100]}...\n")
    
    # Try to generate image
    print("5. Requesting image generation...")
    gen_payload = {
        'prompt': shot.get('prompt', 'Scene from a movie'),
        'service': 'dalle',
        'width': 1920,
        'height': 1080
    }
    
    print(f"   Shot ID: {shot['id']}")
    print(f"   Endpoint: /api/shots/{shot['id']}/generate-image")
    
    r = requests.post(f'http://localhost:8000/api/shots/{shot["id"]}/generate-image',
        json=gen_payload,
        headers=headers)
    
    print(f"\n   Response status: {r.status_code}")
    
    try:
        response_text = r.text[:1000]
        print(f"   Response preview: {response_text}")
    except:
        print(f"   Could not read response")
    
    if r.status_code in [200, 202]:
        print("\n✓ Image generation started successfully!")
    else:
        print(f"\n✗ Image generation failed with status {r.status_code}")
        try:
            error_data = r.json()
            if isinstance(error_data, dict) and 'error' in error_data:
                print(f"Error code: {error_data['error'].get('code')}")
                print(f"Error message: {error_data['error'].get('message')}")
        except:
            pass
