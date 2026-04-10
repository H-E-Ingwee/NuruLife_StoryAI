#!/usr/bin/env python
"""Setup test user and projects for UI testing"""

import requests
import json

# Register test user for UI testing
email = 'uitest@storyai.com'
password = 'TestPass123!'

print('🔐 Setting up test account for UI testing...\n')

# Register
r = requests.post('http://localhost:8000/api/auth/register', json={
    'email': email,
    'password': password,
    'full_name': 'UI Tester'
})

if r.status_code in [201, 200]:
    data = r.json()
    token = data['data']['access_token']
    print(f'✓ User registered: {email}')
    print(f'✓ Access token: {token[:50]}...\n')
    
    # Create test projects with different scripts
    headers = {'Authorization': f'Bearer {token}'}
    
    test_projects = [
        {
            'title': 'The Meeting',
            'description': 'Two characters discuss important matters',
            'script_text': '''INT. COFFEE SHOP - MORNING

JOHN sits at a table with a coffee.

SARAH enters and sits across from him.

JOHN
I need to tell you something.

SARAH
I know. I can see it in your eyes.

THEY sit in silence for a moment.'''
        },
        {
            'title': 'Action Scene',
            'description': 'Car chase through the city',
            'script_text': '''EXT. CITY STREETS - DAY

A CAR speeds down the street.

A POLICE CAR follows behind.

The CAR makes a sharp turn.

CLOSE ON the steering wheel turning hard.

The POLICE CAR follows but loses grip.

The CAR escapes around the corner.'''
        }
    ]
    
    for proj in test_projects:
        r = requests.post('http://localhost:8000/api/projects', json=proj, headers=headers)
        if r.status_code == 201:
            project = r.json()['data']
            print(f'✓ Created project: {project["title"]}')
    
    print(f'\n📝 Credentials for UI testing:')
    print(f'   Email: {email}')
    print(f'   Password: {password}')
    print(f'\n✨ Frontend is ready at http://localhost:5174')
    
else:
    print(f'Error: {r.status_code}')
    print(r.json())
