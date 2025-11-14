# Setup Guide: Connecting Frontend to Backend

This guide will help you connect the ANVIK frontend to your backend API.

## Prerequisites

1. Backend server running (from ANVIK_M1 repository)
2. Node.js and npm installed
3. Frontend dependencies installed

## Step 1: Configure Environment Variables

Create a `.env` file in the root of the frontend project:

```bash
# Backend API URL
VITE_BACKEND_URL=http://localhost:3000
```

**Note:** Replace `http://localhost:3000` with your actual backend URL if different.

## Step 2: Install Frontend Dependencies

```bash
npm install
```

## Step 3: Start the Frontend

```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or the port Vite assigns).

## Step 4: Backend Configuration

### Required Backend Changes

1. **Replace Telegram Bot with REST API**: 
   - Remove Telegram bot handlers
   - Implement REST API endpoints as documented in `BACKEND_API_DOCUMENTATION.md`
   - See `BACKEND_IMPLEMENTATION_GUIDE.md` for detailed implementation examples

2. **Environment Variables**:
   - Copy your environment variables to backend `.env` file
   - See `BACKEND_ENV_EXAMPLE.md` for reference
   - **Important**: Remove Telegram BOT_TOKEN after migration

3. **Enable CORS**:
   ```javascript
   // Example for Express.js
   const cors = require('cors');
   app.use(cors({
     origin: 'http://localhost:5173', // Your frontend URL
     credentials: true
   }));
   ```

4. **Implement Authentication**:
   - JWT token-based authentication
   - Token validation middleware for protected routes
   - See `BACKEND_IMPLEMENTATION_GUIDE.md` for code examples

5. **Tool Integration**:
   - **Calendar**: Google Calendar API (using your GOOGLE_CLIENT_ID/SECRET)
   - **Notion**: Notion API (using your NOTION_CLIENT_ID/SECRET)
   - **Email**: SMTP (using your SMTP_USER/PASS) or Gmail API
   - See `BACKEND_IMPLEMENTATION_GUIDE.md` for integration code

## Step 5: Test the Connection

1. Start your backend server
2. Start the frontend (`npm run dev`)
3. Navigate to `http://localhost:5173`
4. Try signing up or logging in
5. Test the chat functionality

## API Endpoints Summary

The frontend expects these main endpoints:

- **Authentication**: `/api/auth/signup`, `/api/auth/login`, `/api/auth/me`
- **AI Chat**: `/api/ai/chat`, `/api/ai/history`
- **Memory**: `/api/memory/newdoc`, `/api/memory/documents`
- **Tools**: 
  - Calendar: `/api/tools/calendar/*`
  - Notion: `/api/tools/notion/*`
  - Email: `/api/tools/email/*`

See `BACKEND_API_DOCUMENTATION.md` for complete API specification.

## Troubleshooting

### CORS Errors
- Ensure CORS is enabled on the backend
- Check that the frontend URL is whitelisted

### Authentication Errors
- Verify JWT token is being sent in Authorization header
- Check token expiration and validation logic

### API Connection Errors
- Verify `VITE_BACKEND_URL` is set correctly
- Check backend server is running
- Verify backend endpoints match the documentation

### Tool Integration Issues
- Ensure tool credentials are stored securely
- Check OAuth flows for Notion/Calendar/Email
- Verify API keys and permissions

## Next Steps

1. Implement backend endpoints according to `BACKEND_API_DOCUMENTATION.md`
2. Test each endpoint individually
3. Integrate tools (Calendar, Notion, Email) with proper OAuth flows
4. Add error handling and logging
5. Deploy both frontend and backend

## Documentation Files

- **BACKEND_API_DOCUMENTATION.md** - Complete API specification with request/response formats
- **BACKEND_IMPLEMENTATION_GUIDE.md** - Step-by-step implementation guide with code examples
- **BACKEND_ENV_EXAMPLE.md** - Environment variables reference and setup instructions
- **SETUP_GUIDE.md** - This file - Quick setup instructions

## Support

For issues or questions, refer to:
- `BACKEND_API_DOCUMENTATION.md` - Complete API specification
- `BACKEND_IMPLEMENTATION_GUIDE.md` - Implementation examples
- Backend repository: https://github.com/Pruthviraj-sawant/ANVIK_M1

