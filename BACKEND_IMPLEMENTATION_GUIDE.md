# Backend Implementation Guide

This guide helps you implement the REST API endpoints to replace the Telegram bot functionality.

## Overview

Your backend currently uses a Telegram bot. We need to convert it to REST API endpoints that the frontend can call. The backend should use:

- **Google OAuth**: For Calendar and Email (Gmail) integration
- **Notion API**: For Notion integration
- **SMTP**: For email sending
- **OpenAI**: For AI chat responses
- **MongoDB**: For data storage

## Project Structure

Based on your backend repository structure, organize your code like this:

```
backend/
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── ai.js                # AI chat routes
│   ├── memory.js            # Document/memory routes
│   └── tools/
│       ├── calendar.js      # Calendar tool routes
│       ├── notion.js        # Notion tool routes
│       └── email.js         # Email tool routes
├── services/
│   ├── authService.js       # Authentication logic
│   ├── aiService.js         # AI/OpenAI integration
│   ├── calendarService.js   # Google Calendar integration
│   ├── notionService.js     # Notion API integration
│   └── emailService.js      # Email (Gmail/SMTP) integration
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── errorHandler.js      # Error handling middleware
├── models/
│   ├── User.js              # User model
│   ├── Chat.js              # Chat history model
│   ├── Document.js          # Document model
│   └── ToolConnection.js    # Tool OAuth connections model
├── utils/
│   ├── jwt.js               # JWT utilities
│   └── validators.js        # Input validation
├── db/
│   └── connection.js        # MongoDB connection
├── .env                     # Environment variables (not in git)
├── .env.example             # Example env file
├── index.js                 # Main server file
└── package.json
```

## Step 1: Install Required Dependencies

```bash
npm install express cors dotenv mongoose jsonwebtoken bcryptjs
npm install openai @google-cloud/calendar googleapis nodemailer
npm install @notionhq/client axios
```

## Step 2: Authentication Implementation

### routes/auth.js

```javascript
const express = require('express');
const router = express.Router();
const { signup, login, getCurrentUser } = require('../services/authService');
const { authenticateToken } = require('../middleware/auth');

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await signup(name, email, password);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await getCurrentUser(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

module.exports = router;
```

### middleware/auth.js

```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
```

## Step 3: AI Chat Implementation

### routes/ai.js

```javascript
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { sendMessage, getChatHistory, deleteChat } = require('../services/aiService');

// POST /api/ai/chat
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { prompt, history, files } = req.body;
    const userId = req.user.id;
    
    const reply = await sendMessage(userId, prompt, history, files);
    res.json({ reply, message: reply, response: reply });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/ai/history
router.get('/history', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await getChatHistory(userId);
    res.json({ chats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/ai/chat/:chatId
router.delete('/chat/:chatId', authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user.id;
    await deleteChat(userId, chatId);
    res.json({ success: true, message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### services/aiService.js

```javascript
const OpenAI = require('openai');
const { detectToolUsage, executeTool } = require('../utils/toolDetector');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function sendMessage(userId, prompt, history = [], files = []) {
  // Build messages array
  const messages = [
    {
      role: 'system',
      content: 'You are Anvik, an AI personal assistant. You can help users with calendar, Notion, and email tasks. Use tools when appropriate.'
    },
    ...history,
    { role: 'user', content: prompt }
  ];

  // Detect if user wants to use a tool
  const toolIntent = detectToolUsage(prompt);
  
  if (toolIntent) {
    // Execute tool and include result in response
    const toolResult = await executeTool(userId, toolIntent);
    messages.push({
      role: 'assistant',
      content: `I've ${toolIntent.action} using ${toolIntent.tool}. ${toolResult.message}`
    });
  }

  // Call OpenAI
  const completion = await openai.chat.completions.create({
    model: process.env.DEFAULT_LLM_MODEL || 'gpt-4o-mini',
    messages: messages,
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

async function getChatHistory(userId) {
  // Query MongoDB for user's chat history
  const Chat = require('../models/Chat');
  const chats = await Chat.find({ userId }).sort({ createdAt: -1 });
  return chats;
}

async function deleteChat(userId, chatId) {
  const Chat = require('../models/Chat');
  await Chat.findOneAndDelete({ _id: chatId, userId });
}

module.exports = { sendMessage, getChatHistory, deleteChat };
```

## Step 4: Tool Integration

### Google Calendar Integration

```javascript
// services/calendarService.js
const { google } = require('googleapis');
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

async function getCalendarEvents(userId, startDate, endDate) {
  // Get user's stored OAuth tokens
  const ToolConnection = require('../models/ToolConnection');
  const connection = await ToolConnection.findOne({ 
    userId, 
    tool: 'calendar' 
  });
  
  if (!connection) {
    throw new Error('Calendar not connected');
  }

  oauth2Client.setCredentials({
    access_token: connection.accessToken,
    refresh_token: connection.refreshToken,
  });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: startDate,
    timeMax: endDate,
    singleEvents: true,
    orderBy: 'startTime',
  });

  return response.data.items;
}

async function createCalendarEvent(userId, eventData) {
  // Similar implementation using Google Calendar API
  // ...
}

module.exports = { getCalendarEvents, createCalendarEvent };
```

### Notion Integration

```javascript
// services/notionService.js
const { Client } = require('@notionhq/client');

async function getNotionClient(userId) {
  const ToolConnection = require('../models/ToolConnection');
  const connection = await ToolConnection.findOne({ 
    userId, 
    tool: 'notion' 
  });
  
  if (!connection) {
    throw new Error('Notion not connected');
  }

  return new Client({
    auth: connection.accessToken,
  });
}

async function getNotionPages(userId, databaseId = null) {
  const notion = await getNotionClient(userId);
  
  if (databaseId) {
    const response = await notion.databases.query({
      database_id: databaseId,
    });
    return response.results;
  } else {
    const response = await notion.search({});
    return response.results;
  }
}

async function createNotionPage(userId, pageData) {
  const notion = await getNotionClient(userId);
  const response = await notion.pages.create({
    parent: { page_id: pageData.parentId },
    properties: {
      title: {
        title: [
          {
            text: {
              content: pageData.title,
            },
          },
        ],
      },
    },
  });
  return response;
}

module.exports = { getNotionPages, createNotionPage };
```

### Email Integration

```javascript
// services/emailService.js
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// For SMTP (Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendEmail(emailData) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: emailData.to.join(', '),
    cc: emailData.cc?.join(', '),
    bcc: emailData.bcc?.join(', '),
    subject: emailData.subject,
    text: emailData.body,
    html: emailData.body, // If HTML email
  };

  const info = await transporter.sendMail(mailOptions);
  return { success: true, messageId: info.messageId };
}

async function getEmails(userId, folder = 'inbox', limit = 50) {
  // Use Gmail API if OAuth is set up, or IMAP
  // Implementation depends on your email provider
}

module.exports = { sendEmail, getEmails };
```

## Step 5: OAuth Callback Routes

```javascript
// routes/auth.js (add these routes)

// Google OAuth callback
router.get('/google/callback', async (req, res) => {
  try {
    const { code } = req.query;
    // Exchange code for tokens
    // Store tokens in ToolConnection model
    // Redirect to frontend with success
    res.redirect(`${process.env.FRONTEND_URL}/settings?connected=calendar`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/settings?error=connection_failed`);
  }
});

// Notion OAuth callback
router.get('/notion/callback', async (req, res) => {
  try {
    const { code } = req.query;
    // Exchange code for tokens
    // Store tokens in ToolConnection model
    res.redirect(`${process.env.FRONTEND_URL}/settings?connected=notion`);
  } catch (error) {
    res.redirect(`${process.env.FRONTEND_URL}/settings?error=connection_failed`);
  }
});
```

## Step 6: Main Server File

```javascript
// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/memory', require('./routes/memory'));
app.use('/api/tools/calendar', require('./routes/tools/calendar'));
app.use('/api/tools/notion', require('./routes/tools/notion'));
app.use('/api/tools/email', require('./routes/tools/email'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Step 7: Tool Detection Utility

```javascript
// utils/toolDetector.js

function detectToolUsage(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  
  // Calendar detection
  if (lowerPrompt.match(/(schedule|meeting|calendar|event|appointment)/)) {
    if (lowerPrompt.match(/(create|add|new|schedule)/)) {
      return { tool: 'calendar', action: 'create', prompt };
    }
    if (lowerPrompt.match(/(get|show|list|view|what)/)) {
      return { tool: 'calendar', action: 'get', prompt };
    }
  }
  
  // Notion detection
  if (lowerPrompt.match(/(notion|page|note|document)/)) {
    if (lowerPrompt.match(/(create|add|new|write)/)) {
      return { tool: 'notion', action: 'create', prompt };
    }
    if (lowerPrompt.match(/(get|show|list|view|search)/)) {
      return { tool: 'notion', action: 'get', prompt };
    }
  }
  
  // Email detection
  if (lowerPrompt.match(/(email|mail|send|message)/)) {
    if (lowerPrompt.match(/(send|write|compose)/)) {
      return { tool: 'email', action: 'send', prompt };
    }
    if (lowerPrompt.match(/(get|show|list|view|check|read)/)) {
      return { tool: 'email', action: 'get', prompt };
    }
  }
  
  return null;
}

async function executeTool(userId, toolIntent) {
  const { tool, action, prompt } = toolIntent;
  
  switch (tool) {
    case 'calendar':
      if (action === 'create') {
        // Parse prompt for event details
        // Call calendarService.createCalendarEvent
      }
      break;
    case 'notion':
      if (action === 'create') {
        // Parse prompt for page details
        // Call notionService.createNotionPage
      }
      break;
    case 'email':
      if (action === 'send') {
        // Parse prompt for email details
        // Call emailService.sendEmail
      }
      break;
  }
}

module.exports = { detectToolUsage, executeTool };
```

## Next Steps

1. Implement all the route handlers
2. Create MongoDB models (User, Chat, Document, ToolConnection)
3. Set up OAuth flows for Google and Notion
4. Test each endpoint with the frontend
5. Add error handling and logging
6. Deploy to production

## Testing

Use tools like Postman or curl to test endpoints:

```bash
# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test AI chat (with token)
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"prompt":"Hello, how are you?","history":[]}'
```

