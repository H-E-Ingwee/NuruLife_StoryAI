# StoryAI API Contract (MVP)

Base URL: `/api`

Common response envelope:
```json
{ "success": true, "data": { } }
```

Common error envelope:
```json
{ "success": false, "error": { "code": "SOME_CODE", "message": "Human readable", "details": null } }
```

All endpoints that require authentication must be called with:
`Authorization: Bearer <access_token>`

---

## Auth

### `POST /auth/register`
Request body:
```json
{ "email": "user@example.com", "password": "SecurePass123", "full_name": "John Doe" }
```
Response (`201`):
```json
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "full_name": "...", "avatar_url": null, "created_at": "...", "updated_at": "..." },
    "access_token": "jwt",
    "refresh_token": "jwt-refresh",
    "token_type": "Bearer"
  }
}
```

### `POST /auth/login`
Request body:
```json
{ "email": "user@example.com", "password": "SecurePass123" }
```
Response (`200`):
Same shape as `POST /auth/register`.

### `GET /auth/me`
Response (`200`):
```json
{ "success": true, "data": { "id": "uuid", "email": "...", "full_name": "...", "created_at": "...", "updated_at": "..." } }
```

### `POST /auth/refresh`
Request body:
```json
{ "refresh_token": "jwt-refresh" }
```
Response (`200`):
```json
{
  "success": true,
  "data": {
    "access_token": "jwt",
    "refresh_token": "jwt-refresh",
    "token_type": "Bearer"
  }
}
```

---

## Projects

### `GET /projects`
Query parameters (optional; MVP may ignore):
- `page` (number)
- `page_size` (number)
Response (`200`) expected by current frontend:
```json
{ "success": true, "data": [ { "id": "uuid", "title": "...", "description": "...", "script_text": "...", "status": "draft|active|completed|archived", "settings": {}, "created_at": "...", "updated_at": "..." } ] }
```

### `POST /projects`
Request body:
```json
{ "title": "My Storyboard", "description": "Optional", "script_text": "INT. ROOM - DAY ...", "status": "draft" }
```
Response (`201`):
```json
{ "success": true, "data": { "id": "uuid", "title": "...", "description": "...", "script_text": "...", "status": "draft", "settings": {}, "created_at": "...", "updated_at": "..." } }
```

### `GET /projects/<project_id>`
Response (`200`):
```json
{ "success": true, "data": { "id": "uuid", "title": "...", "description": "...", "script_text": "...", "status": "...", "settings": {}, "created_at": "...", "updated_at": "..." } }
```

### `PUT /projects/<project_id>`
Request body (partial update):
```json
{ "title": "...", "description": "...", "script_text": "...", "status": "...", "settings": {} }
```
Response (`200`): same as `GET /projects/<project_id>`.

### `DELETE /projects/<project_id>`
Response (`200`):
```json
{ "success": true, "data": { "message": "Project deleted" } }
```

---

## Script Parsing (creates shots/panels for a storyboard)

### `POST /projects/<project_id>/parse-script`
Request body (MVP):
```json
{ "script_text": "Optional override; if omitted server uses project.script_text" }
```
Response (`200`):
```json
{
  "success": true,
  "data": {
    "storyboard_id": "uuid",
    "shots": [
      {
        "id": "uuid",
        "scene": "INT. COFFEE SHOP - DAY",
        "action": "Jane sips coffee, anxious.",
        "prompt": "Generated prompt...",
        "shotSize": "MS",
        "cameraAngle": "Eye Level",
        "lens": "50mm",
        "notes": "",
        "image": null,
        "image_status": "pending"
      }
    ]
  }
}
```

---

## Shots + Image Generation

### `POST /shots/<shot_id>/generate-image`
Request body:
```json
{
  "service": "stable_diffusion|dalle",
  "prompt": "Optional override (defaults to shot.prompt)",
  "width": 1024,
  "height": 1024,
  "consistency": {
    "lockSeed": true,
    "lockStyle": true,
    "characterIdentity": { "character_id": "uuid", "traits": ["..."] },
    "referenceImageAssetIds": ["uuid"]
  }
}
```
Response (`200`):
```json
{ "success": true, "data": { "job_id": "uuid", "status": "processing" } }
```
Or if synchronous:
```json
{ "success": true, "data": { "image_url": "https://...", "status": "completed" } }
```

### `GET /shots/<shot_id>/image-status`
Response (`200`):
```json
{
  "success": true,
  "data": {
    "job_id": "uuid",
    "image_status": "pending|processing|completed|failed",
    "image_url": "https://..." 
  }
}
```

---

## Storyboards

### `GET /storyboards?project_id=<project_id>`
Response (`200`):
```json
{ "success": true, "data": [ { "id": "uuid", "project_id": "uuid", "title": "...", "layout": [], "created_at": "...", "updated_at": "..." } ] }
```

### `POST /storyboards`
Request body:
```json
{ "project_id": "uuid", "title": "Storyboard Title", "layout": [] }
```
Response (`201`): storyboard object.

---

## Characters

### `GET /characters?project_id=<project_id>`
Response (`200`):
```json
{ "success": true, "data": [ { "id": "uuid", "project_id": "uuid", "name": "...", "role": "hero|villain|supporting|historical", "type": "...", "description": "...", "traits": [], "avatar_url": null, "reference_images": [], "consistency_settings": {} } ] }
```

### `POST /characters`
Request body:
```json
{
  "project_id": "uuid",
  "name": "Anansi",
  "role": "hero",
  "type": "hero",
  "description": "...",
  "traits": ["..."],
  "avatar_url": null,
  "reference_images": [],
  "consistency_settings": {}
}
```
Response (`201`): character object.

---

## Assets (reference images)

### `POST /assets/upload`
Content-Type: `multipart/form-data`
Form fields:
- `file`: uploaded file
- `project_id` (optional)
- `asset_type` (optional): `image|video|audio|document`
Response (`201`):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "project_id": "uuid|null",
    "filename": "character.png",
    "file_path": "...",
    "mime_type": "image/png",
    "file_type": "image",
    "url": "http://.../assets/..."
  }
}
```

### `GET /assets?project_id=<project_id>`
Response (`200`):
```json
{ "success": true, "data": [ { "id": "uuid", "project_id": "uuid|null", "filename": "...", "file_path": "...", "mime_type": "...", "file_type": "image", "url": "...", "tags": [], "favorite": false } ] }
```

---

## Exports

### `GET /exports?project_id=<project_id>`
Response (`200`):
```json
{ "success": true, "data": [ { "id": "uuid", "project_id": "uuid", "export_type": "pdf|images", "status": "processing|completed|failed", "file_url": null, "created_at": "...", "completed_at": null } ] }
```

### `POST /exports`
Request body:
```json
{ "project_id": "uuid", "export_type": "pdf", "settings": {} }
```
Response (`201`):
```json
{ "success": true, "data": { "id": "uuid", "status": "processing", "export_type": "pdf" } }
```

### `GET /exports/<export_id>/download`
Returns the export file (binary) with appropriate headers.

