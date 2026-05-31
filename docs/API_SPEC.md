# API_SPEC.md

# API Specification v1.0

Base URL path: `/api/v1`

All requests and responses use standard JSON format. Authentication uses JSON Web Tokens (JWT) passed in the `Authorization: Bearer <token>` header.

---

## 1. Response Standard Format

### Success Response
```json
{
  "success": true,
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

---

## 2. API Endpoint Inventory

### Authentication
* **`POST /auth/register`**
  * Description: Register a new student account.
  * Public access.
  * Body: `{ "username": "string", "email": "string", "password": "hash_password", "fullName": "string", "semester": number }`
* **`POST /auth/login`**
  * Description: Login and receive a 7-day JWT access token.
  * Public access.
  * Body: `{ "email": "string", "password": "plain_password" }`
* **`POST /auth/logout`**
  * Description: Invalidate token (handled client-side by dropping token).
  * Protected access.
* **`GET /auth/me`**
  * Description: Rehydrate auth state and fetch currently authenticated user details.
  * Protected access.

---

### User Profiles
* **`GET /users/profile`**
  * Description: Get own profile details.
  * Protected access.
* **`PUT /users/profile`**
  * Description: Update profile details (e.g. full name, semester).
  * Protected access.
  * Body: `{ "fullName": "string", "semester": number }`
* **`PUT /users/learning-style`**
  * Description: Update primary and secondary learning preferences.
  * Protected access.
  * Body: `{ "primaryStyle": "string", "secondaryStyle": "string" }`

---

### Subjects Catalog (Read-Only)
* **`GET /subjects`**
  * Description: Browse available academic subjects catalog.
  * Public access.
* **`GET /subjects/:id`**
  * Description: Get single subject details.
  * Public access.

---

### Study Groups Management
* **`GET /study-groups`**
  * Description: Browse public study groups. Optionally filter by query parameters (`?subjectId=xxx`).
  * Public access.
* **`GET /study-groups/:id`**
  * Description: Get study group configuration and member statistics.
  * Public access.
* **`POST /study-groups`**
  * Description: Create a new study group. The creator is automatically added to the group with the `members.role = 'admin'` role.
  * Protected access.
  * Body: `{ "subjectId": "UUID", "name": "string", "description": "string", "maxMembers": number }`
* **`PUT /study-groups/:id`**
  * Description: Update study group configurations.
  * Protected access. Group Admin (`members.role = 'admin'`) only.
  * Body: `{ "name": "string", "description": "string", "maxMembers": number }`
* **`DELETE /study-groups/:id`**
  * Description: Disband a study group.
  * Protected access. Group Admin (`members.role = 'admin'`) only.
* **`POST /study-groups/:id/join`**
  * Description: Join a study group if capacity limit (`max_members`) is not reached.
  * Protected access.
* **`POST /study-groups/:id/leave`**
  * Description: Leave a study group.
  * Protected access.
* **`GET /study-groups/:id/members`**
  * Description: Get list of all members and roles in a group.
  * Protected access. Group Members only.
* **`DELETE /study-groups/:id/members/:userId`**
  * Description: Kick a member out of the study group.
  * Protected access. Group Admin (`members.role = 'admin'`) only.

---

### Sessions Scheduling & Attendance
* **`GET /sessions`**
  * Description: Get study sessions. **Query parameter `?groupId=UUID` is required** to scope sessions.
  * Protected access. Group Members only.
* **`GET /sessions/:id`**
  * Description: Get specific session detail.
  * Protected access. Group Members only.
* **`POST /sessions`**
  * Description: Schedule a new session.
  * Protected access. Group Admin (`members.role = 'admin'`) only.
  * Body: `{ "studyGroupId": "UUID", "title": "string", "scheduledStartTime": "ISO8601", "scheduledEndTime": "ISO8601" }`
* **`PUT /sessions/:id`**
  * Description: Update session timing/details.
  * Protected access. Group Admin (`members.role = 'admin'`) only.
  * Body: `{ "title": "string", "scheduledStartTime": "ISO8601", "scheduledEndTime": "ISO8601", "status": "string" }`
* **`DELETE /sessions/:id`**
  * Description: Remove a session schedule.
  * Protected access. Group Admin (`members.role = 'admin'`) only.
* **`POST /sessions/:id/join`**
  * Description: Log attendance start (creates an active `session_attendances` entry).
  * Protected access. Group Members only.
* **`POST /sessions/:id/leave`**
  * Description: Log attendance completion. Automatically triggers attendance duration calculation, increments session attendance count, adds study hours to progress, and updates mastery level.
  * Protected access. Group Members only.

---

### Materials Sharing
* **`GET /materials`**
  * Description: Browse materials shared in a group. **Query parameter `?groupId=UUID` is required** to scope resources.
  * Protected access. Group Members only.
* **`GET /materials/:id`**
  * Description: View resource details.
  * Protected access. Group Members only.
* **`POST /materials`**
  * Description: Upload a file resource for a group (multipart/form-data request).
  * Protected access. Group Members only.
* **`DELETE /materials/:id`**
  * Description: Delete a resource.
  * Protected access. Allowed for **original uploader** OR **Group Admin** of the corresponding group.

---

### Progress Dashboard
* **`GET /progress`**
  * Description: Retrieve own progress metrics across all joined groups.
  * Protected access.
* **`GET /progress/:userId`**
  * Description: Retrieve study progress metrics for a specific student in public/shared contexts.
  * Protected access.
