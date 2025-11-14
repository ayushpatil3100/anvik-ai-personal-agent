# Troubleshooting Guide: "Failed to Fetch" Error

## Problem
You're seeing "Failed to fetch" or "Cannot connect to backend server" errors when trying to sign up or sign in.

## Common Causes & Solutions

### 1. Backend Server Not Running ⚠️ (Most Common)

**Problem:** The backend server is not running or not accessible.

**Solution:**
1. Navigate to your backend directory (ANVIK_M1)
2. Make sure dependencies are installed:
   ```bash
   npm install
   ```
3. Start the backend server:
   ```bash
   npm start
   # or
   node index.js
   ```
4. Verify the server is running by visiting `http://localhost:3000` in your browser
5. You should see a response (even if it's an error page, it means the server is running)

### 2. Wrong Backend URL

**Problem:** The frontend is trying to connect to the wrong URL.

**Solution:**
1. Check if you have a `.env` file in the frontend root directory
2. If not, create one with:
   ```bash
   VITE_BACKEND_URL=http://localhost:3000
   ```
3. If the file exists, verify the URL is correct
4. **Important:** After changing `.env`, restart your frontend dev server:
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart
   npm run dev
   ```

### 3. CORS Not Enabled on Backend

**Problem:** The backend is running but blocking requests from the frontend due to CORS.

**Solution:**
In your backend `index.js` or main server file, add CORS middleware:

```javascript
const cors = require('cors');

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
```

Make sure to install cors if not already installed:
```bash
npm install cors
```

### 4. Backend Endpoints Not Implemented

**Problem:** The backend server is running but the authentication endpoints don't exist yet.

**Solution:**
You need to implement the authentication endpoints in your backend. See `BACKEND_IMPLEMENTATION_GUIDE.md` for details.

At minimum, you need:
- `POST /api/auth/signup`
- `POST /api/auth/login`

### 5. Port Already in Use

**Problem:** Another application is using port 3000.

**Solution:**
1. Check what's using port 3000:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   
   # Mac/Linux
   lsof -i :3000
   ```
2. Either:
   - Stop the other application
   - Or change your backend port in `.env`:
     ```bash
     PORT=3001
     ```
   - Then update frontend `.env`:
     ```bash
     VITE_BACKEND_URL=http://localhost:3001
     ```

### 6. Firewall or Network Issues

**Problem:** Firewall or network blocking the connection.

**Solution:**
1. Check if your firewall is blocking Node.js
2. Try accessing `http://localhost:3000` directly in your browser
3. If that doesn't work, the backend isn't running properly

## Quick Diagnostic Steps

1. **Check Backend Status:**
   ```bash
   # In backend directory
   curl http://localhost:3000/health
   # or visit http://localhost:3000 in browser
   ```

2. **Check Frontend Environment:**
   ```bash
   # In frontend directory
   # Make sure .env file exists with:
   cat .env
   # Should show: VITE_BACKEND_URL=http://localhost:3000
   ```

3. **Check Browser Console:**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for detailed error messages
   - Go to Network tab to see failed requests

4. **Test Backend Directly:**
   ```bash
   # Test signup endpoint
   curl -X POST http://localhost:3000/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","password":"test123"}'
   ```

## Development Mode (Temporary Workaround)

If you need to test the frontend while the backend is being developed, you can temporarily use mock authentication. However, this is **NOT recommended for production**.

To enable mock mode, you would need to modify the API service, but it's better to get the backend running properly.

## Still Having Issues?

1. **Check Backend Logs:**
   - Look at the terminal where your backend is running
   - Check for error messages

2. **Check Frontend Logs:**
   - Open browser DevTools Console
   - Look for detailed error messages

3. **Verify Backend Structure:**
   - Make sure your backend has the routes set up
   - Check `BACKEND_IMPLEMENTATION_GUIDE.md` for the correct structure

4. **Test with Postman/Thunder Client:**
   - Try making requests directly to your backend
   - This helps isolate if it's a frontend or backend issue

## Expected Backend Response

When working correctly, the backend should return:

**Signup:**
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

**Login:**
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

## Next Steps

Once the backend is running:
1. Verify it's accessible at `http://localhost:3000`
2. Test the endpoints with curl or Postman
3. Make sure CORS is enabled
4. Restart your frontend dev server after setting `.env`
5. Try signing up/login again

