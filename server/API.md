# Bug Tracking API Documentation

Base URL: `http://localhost:8000/api`

## Authentication

All endpoints except `/auth/register`, `/auth/login`, and `/integrations/github/webhook` require authentication via JWT Bearer token.

**Header Format:**

```
Authorization: Bearer <token>
```

---

## 🔐 Authentication

### Register User

```http
POST /auth/register
```

**Request Body:**

```json
{
   "name": "John Doe",
   "email": "john@example.com",
   "password": "securePassword123",
   "role": "DEV"
}
```

**Roles:** `QA`, `DEV`, `PM`, `CLIENT`

**Response:** `201 Created`

```json
{
   "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "DEV",
      "active": true
   },
   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login

```http
POST /auth/login
```

**Request Body:**

```json
{
   "email": "john@example.com",
   "password": "securePassword123"
}
```

**Response:** `200 OK` (same format as register)

### Get Current User

```http
GET /auth/me
```

**Response:** `200 OK`

```json
{
   "id": 1,
   "name": "John Doe",
   "email": "john@example.com",
   "role": "DEV",
   "active": true
}
```

---

## 👥 Users

### List Users

```http
GET /users?role=DEV&active=true
```

**Query Parameters:**

- `role` (optional): Filter by role (`QA`, `DEV`, `PM`, `CLIENT`)
- `active` (optional): Filter by active status (`true`, `false`)

**Response:** `200 OK`

```json
[
   {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "DEV",
      "active": true
   }
]
```

### Get User by ID

```http
GET /users/:id
```

**Response:** `200 OK`

```json
{
   "id": 1,
   "name": "John Doe",
   "email": "john@example.com",
   "role": "DEV",
   "active": true
}
```

---

## 🐛 Issues

### Create Issue

```http
POST /issues
```

**Request Body:**

```json
{
   "title": "Login button not responding",
   "description": "When clicking the login button, nothing happens",
   "priority": "HIGH",
   "severity": "MAJOR",
   "environment": "Production v1.2.3"
}
```

**Priority:** `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`  
**Severity:** `TRIVIAL`, `MINOR`, `MAJOR`, `CRITICAL`

**Response:** `201 Created`

```json
{
   "id": 1,
   "key": "BUG-1",
   "title": "Login button not responding",
   "description": "When clicking the login button, nothing happens",
   "status": "NEW",
   "priority": "HIGH",
   "severity": "MAJOR",
   "environment": "Production v1.2.3",
   "reporter": {
      "id": 1,
      "name": "John Doe"
   },
   "assignee": null,
   "createdAt": "2025-12-07T10:30:00.000Z",
   "updatedAt": "2025-12-07T10:30:00.000Z"
}
```

### List Issues

```http
GET /issues?status=NEW&assigneeId=5&page=1&pageSize=20
```

**Query Parameters:**

- `status` (optional): Filter by status (`NEW`, `IN_PROGRESS`, `READY_FOR_QA`, `REOPENED`, `CLOSED`)
- `assigneeId` (optional): Filter by assignee user ID
- `reporterId` (optional): Filter by reporter user ID
- `search` (optional): Search in title and description
- `page` (optional, default: 1): Page number
- `pageSize` (optional, default: 20): Items per page

**Response:** `200 OK`

```json
{
   "items": [
      {
         "id": 1,
         "key": "BUG-1",
         "title": "Login button not responding",
         "status": "NEW",
         "priority": "HIGH",
         "severity": "MAJOR",
         "reporter": { "id": 1, "name": "John Doe" },
         "assignee": null,
         "createdAt": "2025-12-07T10:30:00.000Z",
         "updatedAt": "2025-12-07T10:30:00.000Z"
      }
   ],
   "page": 1,
   "pageSize": 20,
   "total": 1
}
```

### Get Issue by ID

```http
GET /issues/:id
```

**Response:** `200 OK` (includes comments, code changes, and watchers)

```json
{
   "id": 1,
   "key": "BUG-1",
   "title": "Login button not responding",
   "description": "When clicking the login button, nothing happens",
   "status": "NEW",
   "priority": "HIGH",
   "severity": "MAJOR",
   "environment": "Production v1.2.3",
   "reporter": { "id": 1, "name": "John Doe" },
   "assignee": null,
   "comments": [],
   "codeChanges": [],
   "watchers": [],
   "createdAt": "2025-12-07T10:30:00.000Z",
   "updatedAt": "2025-12-07T10:30:00.000Z"
}
```

### Update Issue

```http
PATCH /issues/:id
```

**Request Body:** (all fields optional)

```json
{
   "title": "Updated title",
   "description": "Updated description",
   "priority": "CRITICAL",
   "severity": "CRITICAL",
   "environment": "Production v1.3.0"
}
```

**Response:** `200 OK` (updated issue object)

### Take Issue

```http
POST /issues/:id/take
```

Assigns the issue to the current user.

**Response:** `200 OK`

```json
{
   "message": "Issue assigned successfully",
   "issue": {
      /* issue object */
   }
}
```

### Assign Issue

```http
POST /issues/:id/assign
```

**Request Body:**

```json
{
   "assigneeId": 5
}
```

**Response:** `200 OK`

### Change Status

```http
POST /issues/:id/status
```

**Request Body:**

```json
{
   "status": "IN_PROGRESS"
}
```

**Valid Status Transitions:**

- `NEW` → `IN_PROGRESS`, `CLOSED`
- `IN_PROGRESS` → `READY_FOR_QA`, `NEW`, `CLOSED`
- `READY_FOR_QA` → `CLOSED`, `REOPENED`
- `REOPENED` → `IN_PROGRESS`, `CLOSED`
- `CLOSED` → `REOPENED`

**Response:** `200 OK`

### Subscribe to Issue

```http
POST /issues/:id/subscribe
```

Adds the current user as a watcher of the issue.

**Response:** `200 OK`

```json
{
   "message": "Successfully subscribed to issue",
   "watcher": {
      "userId": 1,
      "issueId": 1,
      "createdAt": "2025-12-07T10:30:00.000Z"
   }
}
```

---

## 💬 Comments

### List Comments

```http
GET /issues/:id/comments
```

**Response:** `200 OK`

```json
[
   {
      "id": 1,
      "author": {
         "id": 1,
         "name": "John Doe"
      },
      "text": "I'm investigating this issue",
      "isSystem": false,
      "createdAt": "2025-12-07T10:35:00.000Z",
      "updatedAt": "2025-12-07T10:35:00.000Z"
   },
   {
      "id": 2,
      "author": null,
      "text": "Status changed from NEW to IN_PROGRESS",
      "isSystem": true,
      "createdAt": "2025-12-07T10:36:00.000Z",
      "updatedAt": "2025-12-07T10:36:00.000Z"
   }
]
```

### Create Comment

```http
POST /issues/:id/comments
```

**Request Body:**

```json
{
   "text": "I'm investigating this issue"
}
```

**Response:** `201 Created`

```json
{
   "id": 1,
   "author": { "id": 1, "name": "John Doe" },
   "text": "I'm investigating this issue",
   "isSystem": false,
   "createdAt": "2025-12-07T10:35:00.000Z",
   "updatedAt": "2025-12-07T10:35:00.000Z"
}
```

### Update Comment

```http
PATCH /comments/:id
```

**Request Body:**

```json
{
   "text": "Updated comment text"
}
```

**Response:** `200 OK` (updated comment object)

---

## 📝 Code Changes

### List Code Changes by Issue

```http
GET /issues/:id/code-changes
```

**Response:** `200 OK`

```json
[
   {
      "id": 1,
      "type": "COMMIT",
      "externalId": "abc123def456",
      "title": "Fix login button click handler",
      "url": "https://github.com/user/repo/commit/abc123",
      "author": "john@example.com",
      "occurredAt": "2025-12-07T10:40:00.000Z",
      "createdAt": "2025-12-07T10:45:00.000Z"
   }
]
```

**Types:** `COMMIT`, `PULL_REQUEST`

### Get Code Change by ID

```http
GET /code-changes/:id
```

**Response:** `200 OK`

```json
{
   "id": 1,
   "type": "COMMIT",
   "externalId": "abc123def456",
   "title": "Fix login button click handler",
   "url": "https://github.com/user/repo/commit/abc123",
   "author": "john@example.com",
   "occurredAt": "2025-12-07T10:40:00.000Z",
   "createdAt": "2025-12-07T10:45:00.000Z",
   "linkedIssues": [
      {
         "id": 1,
         "key": "BUG-1",
         "title": "Login button not responding"
      }
   ]
}
```

---

## 🔗 Integrations

### GitHub Webhook

```http
POST /integrations/github/webhook
```

Receives GitHub webhook events (push, pull_request) and automatically links commits/PRs to issues based on issue keys in commit messages or PR descriptions.

**Expected Format in Commit Messages:**

```
Fix login issue BUG-1
```

or

```
Implement feature [BUG-42] with new UI
```

**Headers Required:**

- `X-Hub-Signature-256`: GitHub webhook signature
- `X-GitHub-Event`: Event type (push, pull_request)

**Response:** `200 OK`

---

## 🩺 Health Check

### Health

```http
GET /health
```

**Response:** `200 OK`

```json
{
   "status": "ok",
   "timestamp": "2025-12-07T10:30:00.000Z"
}
```

---

## Error Responses

All endpoints return errors in the following format:

**400 Bad Request / 404 Not Found / 401 Unauthorized / 403 Forbidden:**

```json
{
   "error": "Error name",
   "message": "Detailed error message",
   "details": {}
}
```

**500 Internal Server Error:**

```json
{
   "error": "Internal Server Error",
   "message": "Something went wrong"
}
```

---

## Rate Limits

No rate limiting is currently implemented.

## CORS

CORS is enabled for all origins in development mode.
