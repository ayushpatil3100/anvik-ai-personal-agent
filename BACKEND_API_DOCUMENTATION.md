# Backend API Documentation

This document describes the expected API endpoints that the frontend will call. The backend should implement these endpoints to replace the Telegram bot functionality.

## Base URL

All API endpoints should be prefixed with `/api`. The base URL is configured via `VITE_BACKEND_URL` environment variable (default: `http://localhost:3000`).

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### POST `/api/auth/signup`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### POST `/api/auth/login`
Login with email and password.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### GET `/api/auth/me`
Get current authenticated user information.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

## AI Chat Endpoints

### POST `/api/ai/chat`
Send a message to the AI and get a response.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "prompt": "What's the weather today?",
  "history": [
    {
      "role": "user",
      "content": "Hello"
    },
    {
      "role": "assistant",
      "content": "Hi! How can I help you?"
    }
  ],
  "files": [
    {
      "name": "document.pdf",
      "size": 1024,
      "type": "application/pdf"
    }
  ]
}
```

**Response:**
```json
{
  "reply": "The AI's response here",
  "message": "Alternative response field",
  "response": "Another alternative response field"
}
```

**Note:** The AI should be able to use tools (calendar, notion, email) based on the user's prompt. For example:
- "Schedule a meeting tomorrow at 2pm" → Uses calendar tool
- "Create a Notion page about my project" → Uses Notion tool
- "Send an email to john@example.com" → Uses email tool

---

### GET `/api/ai/history`
Get chat history for the authenticated user.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "chats": [
    {
      "id": "chat_id",
      "title": "Chat Title",
      "messages": [
        {
          "role": "user",
          "content": "Hello"
        },
        {
          "role": "assistant",
          "content": "Hi!"
        }
      ],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### DELETE `/api/ai/chat/:chatId`
Delete a specific chat.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Chat deleted successfully"
}
```

---

## Memory/Document Endpoints

### POST `/api/memory/newdoc`
Upload a document (PDF, etc.) to the memory system.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body:**
- FormData with `file` field

**Response:**
```json
{
  "success": true,
  "documentId": "doc_id",
  "filename": "document.pdf",
  "message": "Document uploaded successfully"
}
```

---

### GET `/api/memory/documents`
Get all documents for the authenticated user.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "documents": [
    {
      "id": "doc_id",
      "filename": "document.pdf",
      "uploadedAt": "2024-01-01T00:00:00Z",
      "size": 1024
    }
  ]
}
```

---

### DELETE `/api/memory/documents/:documentId`
Delete a specific document.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

---

## Calendar Tool Endpoints

### GET `/api/tools/calendar/events`
Get calendar events for a date range.

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `start`: Start date (ISO 8601 format)
- `end`: End date (ISO 8601 format)

**Response:**
```json
{
  "events": [
    {
      "id": "event_id",
      "title": "Meeting",
      "description": "Team meeting",
      "start": "2024-01-01T14:00:00Z",
      "end": "2024-01-01T15:00:00Z",
      "location": "Conference Room A"
    }
  ]
}
```

---

### POST `/api/tools/calendar/events`
Create a new calendar event.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Meeting",
  "description": "Team meeting",
  "start": "2024-01-01T14:00:00Z",
  "end": "2024-01-01T15:00:00Z",
  "location": "Conference Room A",
  "attendees": ["email1@example.com", "email2@example.com"]
}
```

**Response:**
```json
{
  "id": "event_id",
  "title": "Meeting",
  "message": "Event created successfully"
}
```

---

### PUT `/api/tools/calendar/events/:eventId`
Update an existing calendar event.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Updated Meeting",
  "description": "Updated description",
  "start": "2024-01-01T15:00:00Z",
  "end": "2024-01-01T16:00:00Z"
}
```

**Response:**
```json
{
  "id": "event_id",
  "message": "Event updated successfully"
}
```

---

### DELETE `/api/tools/calendar/events/:eventId`
Delete a calendar event.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

## Notion Tool Endpoints

### POST `/api/tools/notion/connect`
Connect a Notion account (OAuth flow).

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "code": "oauth_code_from_notion"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notion account connected successfully"
}
```

---

### GET `/api/tools/notion/pages`
Get Notion pages.

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `database` (optional): Filter by database ID

**Response:**
```json
{
  "pages": [
    {
      "id": "page_id",
      "title": "Page Title",
      "url": "https://notion.so/page",
      "lastEdited": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### POST `/api/tools/notion/pages`
Create a new Notion page.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "parentId": "parent_page_id",
  "title": "New Page",
  "content": "Page content here"
}
```

**Response:**
```json
{
  "id": "page_id",
  "url": "https://notion.so/page",
  "message": "Page created successfully"
}
```

---

### PUT `/api/tools/notion/pages/:pageId`
Update a Notion page.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Response:**
```json
{
  "id": "page_id",
  "message": "Page updated successfully"
}
```

---

### POST `/api/tools/notion/search`
Search Notion pages and databases.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "query": "search query"
}
```

**Response:**
```json
{
  "results": [
    {
      "id": "page_id",
      "title": "Page Title",
      "url": "https://notion.so/page"
    }
  ]
}
```

---

## Email Tool Endpoints

### POST `/api/tools/email/connect`
Connect an email account.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "provider": "gmail" | "outlook" | "imap",
  "credentials": {
    "email": "user@example.com",
    "accessToken": "oauth_token" // For OAuth providers
    // OR
    "password": "app_password" // For IMAP
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email account connected successfully"
}
```

---

### GET `/api/tools/email/messages`
Get emails from a folder.

**Headers:**
- `Authorization: Bearer <token>`

**Query Parameters:**
- `folder`: Folder name (default: "inbox")
- `limit`: Number of emails to return (default: 50)

**Response:**
```json
{
  "messages": [
    {
      "id": "message_id",
      "from": "sender@example.com",
      "to": ["recipient@example.com"],
      "subject": "Email Subject",
      "body": "Email body",
      "date": "2024-01-01T00:00:00Z",
      "read": false
    }
  ]
}
```

---

### POST `/api/tools/email/send`
Send an email.

**Headers:**
- `Authorization: Bearer <token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "to": ["recipient@example.com"],
  "cc": ["cc@example.com"],
  "bcc": ["bcc@example.com"],
  "subject": "Email Subject",
  "body": "Email body",
  "attachments": []
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "message_id",
  "message": "Email sent successfully"
}
```

---

### GET `/api/tools/email/messages/:messageId`
Get a specific email.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "id": "message_id",
  "from": "sender@example.com",
  "to": ["recipient@example.com"],
  "subject": "Email Subject",
  "body": "Email body",
  "date": "2024-01-01T00:00:00Z",
  "attachments": []
}
```

---

## Tools Management Endpoints

### GET `/api/tools`
Get all available tools.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "tools": [
    {
      "name": "calendar",
      "displayName": "Calendar",
      "description": "Manage calendar events",
      "connected": true
    },
    {
      "name": "notion",
      "displayName": "Notion",
      "description": "Manage Notion pages",
      "connected": false
    },
    {
      "name": "email",
      "displayName": "Email",
      "description": "Send and receive emails",
      "connected": true
    }
  ]
}
```

---

### GET `/api/tools/connected`
Get all connected tools for the current user.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "connectedTools": [
    {
      "name": "calendar",
      "displayName": "Calendar",
      "connectedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

### POST `/api/tools/:toolName/disconnect`
Disconnect a tool.

**Headers:**
- `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "message": "Tool disconnected successfully"
}
```

---

## Error Responses

All endpoints should return appropriate HTTP status codes and error messages:

**400 Bad Request:**
```json
{
  "error": "Validation error",
  "message": "Invalid input parameters"
}
```

**401 Unauthorized:**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authentication token"
}
```

**404 Not Found:**
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Implementation Notes

1. **Replace Telegram Bot**: The backend should replace all Telegram bot handlers with REST API endpoints.

2. **Tool Integration**: The AI chat endpoint (`/api/ai/chat`) should be able to detect when a user wants to use a tool (calendar, notion, email) and call the appropriate tool functions.

3. **Authentication**: Implement JWT-based authentication. Store user sessions and validate tokens on protected routes.

4. **Database**: Store user data, chat history, documents, and tool connections in your database.

5. **CORS**: Enable CORS for your frontend domain in the backend.

6. **Environment Variables**: The backend should use environment variables for sensitive configuration (database URLs, API keys, etc.).

---

## Example Backend Structure

```
backend/
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── ai.js            # AI chat routes
│   ├── memory.js        # Document/memory routes
│   └── tools/
│       ├── calendar.js  # Calendar tool routes
│       ├── notion.js    # Notion tool routes
│       └── email.js     # Email tool routes
├── services/
│   ├── authService.js
│   ├── aiService.js
│   ├── calendarService.js
│   ├── notionService.js
│   └── emailService.js
├── middleware/
│   └── auth.js          # JWT authentication middleware
└── index.js             # Main server file
```

