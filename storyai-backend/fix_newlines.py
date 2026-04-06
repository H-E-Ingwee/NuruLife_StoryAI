rom pathlib import Path

files = [
    'C:/Users/mutcu/OneDrive/Documents/GitHub/NuruLife_StoryAI/storyai-backend/app/api/auth.py',
    'C:/Users/mutcu/OneDrive/Documents/GitHub/NuruLife_StoryAI/storyai-backend/app/api/projects.py',
    'C:/Users/mutcu/OneDrive/Documents/GitHub/NuruLife_StoryAI/storyai-backend/app/models/__init__.py',
    'C:/Users/mutcu/OneDrive/Documents/GitHub/NuruLife_StoryAI/storyai-backend/app/api/__init__.py',
    'C:/Users/mutcu/OneDrive/Documents/GitHub/NuruLife_StoryAI/storyai-backend/app/__init__.py',
]

for fp in files:
    p = Path(fp)
    text = p.read_text(encoding='utf-8')
    if '\\n' in text:
        text = text.replace('\\n', '\n')
        p.write_text(text, encoding='utf-8')
        print('cleaned', fp)
    else:
        print('no cleanup needed', fp)
