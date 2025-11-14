# Quick Start Guide

## Fix "Failed to Fetch" Error

### Step 1: Check Backend Server

1. **Navigate to your backend directory:**
   ```bash
   cd path/to/ANVIK_M1
   ```

2. **Install dependencies (if not done):**
   ```bash
   npm install
   ```

3. **Start the backend server:**
   ```bash
   npm start
   # or
   node index.js
   ```

4. **Verify it's running:**
   - Open browser and go to: `http://localhost:3000`
   - You should see some response (even an error page means it's running)

### Step 2: Configure Frontend

1. **Create `.env` file in frontend root:**
   ```bash
   # In the ANVK (frontend) directory
   echo "VITE_BACKEND_URL=http://localhost:3000" > .env
   ```

2. **Or manually create `.env` file with:**
   ```
   VITE_BACKEND_URL=http://localhost:3000
   ```

3. **Restart frontend dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   # Then restart
   npm run dev
   ```

### Step 3: Enable CORS on Backend

In your backend `index.js`, add:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
```

If `cors` is not installed:
```bash
npm install cors
```

### Step 4: Test

1. Open browser console (F12)
2. You should see: `🔗 Backend URL: http://localhost:3000`
3. Try signing up or logging in
4. Check console for any errors

## Common Issues

### Issue: "Cannot connect to backend server"

**Solution:** Backend is not running. Start it first (Step 1).

### Issue: CORS error in console

**Solution:** Enable CORS on backend (Step 3).

### Issue: 404 Not Found

**Solution:** Backend endpoints not implemented. See `BACKEND_IMPLEMENTATION_GUIDE.md`.

### Issue: Port 3000 already in use

**Solution:** 
- Change backend port in backend `.env`: `PORT=3001`
- Update frontend `.env`: `VITE_BACKEND_URL=http://localhost:3001`
- Restart both servers

## Verification Checklist

- [ ] Backend server is running (check `http://localhost:3000`)
- [ ] Frontend `.env` file exists with `VITE_BACKEND_URL=http://localhost:3000`
- [ ] Frontend dev server restarted after creating `.env`
- [ ] CORS enabled on backend
- [ ] Browser console shows backend URL
- [ ] No CORS errors in browser console

## Still Not Working?

See `TROUBLESHOOTING.md` for detailed solutions.

