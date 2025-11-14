# Backend Environment Variables

This file shows the required environment variables for the ANVIK backend. **DO NOT commit actual secrets to version control.**

Create a `.env` file in your backend root directory with these variables:

```bash
# Telegram (DEPRECATED - Remove after migrating to REST API)
# BOT_TOKEN=your_telegram_bot_token

# OpenAI
OPENAI_API_KEY=your_openai_api_key
DEFAULT_LLM_MODEL=openai/gpt-4o-mini

# Google OAuth (for Calendar and Email integration)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# App Configuration
PORT=3000
BASE_URL=http://localhost:3000

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Notion Integration
NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
NOTION_REDIRECT_URI=http://localhost:3000/auth/notion/callback
NOTION_PARENT_PAGE_ID=your_notion_parent_page_id

# Email (SMTP) - For email sending functionality
SMTP_USER=your_smtp_email
SMTP_PASS=your_smtp_app_password

# Optional: Twilio (for SMS/Phone features)
# TWILIO_SID=your_twilio_sid
# TWILIO_AUTH_TOKEN=your_twilio_auth_token
# TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Setup Instructions

### 1. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Calendar API and Gmail API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/auth/google/callback`
6. Copy Client ID and Client Secret

### 2. Notion Setup
1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
2. Create a new integration
3. Copy the Client ID and Client Secret
4. Set redirect URI: `http://localhost:3000/auth/notion/callback`
5. Share your Notion pages with the integration

### 3. SMTP Setup (Gmail)
1. Enable 2-Step Verification on your Google account
2. Generate an App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use the app password as `SMTP_PASS`

### 4. MongoDB Setup
1. Create a MongoDB Atlas account or use local MongoDB
2. Get connection string
3. Replace `<password>` and `<database>` in connection string

### 5. OpenAI Setup
1. Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add billing information if needed
3. Copy API key

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` file to git
- Add `.env` to `.gitignore`
- Use environment variables in production (not .env files)
- Rotate secrets regularly
- Use different credentials for development and production

## Production Considerations

For production:
- Use environment variables from your hosting platform
- Use secure secret management (AWS Secrets Manager, Azure Key Vault, etc.)
- Update `GOOGLE_REDIRECT_URI` and `NOTION_REDIRECT_URI` to production URLs
- Use HTTPS for all OAuth redirects
- Set `BASE_URL` to your production domain

