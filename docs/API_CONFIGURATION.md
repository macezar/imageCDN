# API Configuration

This document explains how the frontend connects to the backend API.

## Development Mode

### Default Setup (Recommended)

**No configuration needed!** The frontend uses Vite's proxy feature:

1. Frontend runs on: `http://localhost:3000`
2. Backend runs on: `http://localhost:5000`
3. API calls use relative path: `/api/*`
4. Vite proxy forwards `/api/*` to `http://localhost:5000/api/*`

**Configuration location**: `frontend/vite.config.js`

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

### Why Use a Proxy?

✅ **Avoids CORS issues** - Browser thinks frontend and backend are same origin
✅ **Simpler configuration** - No need to set API URL
✅ **Matches production** - Same relative URLs work in both environments

### Custom Backend URL

If your backend runs on a different port or host:

**Option 1: Update Vite Proxy** (Recommended)
```javascript
// frontend/vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:8080', // Your custom port
    changeOrigin: true,
  },
}
```

**Option 2: Use Environment Variable**
```bash
# frontend/.env
VITE_API_URL=http://localhost:8080/api
```

This bypasses the proxy and makes direct requests.

## Production Mode

### Same Server Deployment (Default)

When you deploy with the backend serving the frontend:

1. Build frontend: `npm run build` (creates `frontend/dist`)
2. Backend serves static files from `dist/`
3. API calls to `/api/*` go to same server
4. **No configuration needed!**

The backend is already configured to serve the frontend in production:

```javascript
// backend/src/server.js
if (config.nodeEnv === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
}
```

### Separate Server Deployment

If frontend and backend are on different domains:

**Build with API URL:**
```bash
# Set environment variable before build
VITE_API_URL=https://api.example.com/api npm run build
```

Or create `frontend/.env.production`:
```env
VITE_API_URL=https://api.example.com/api
```

**Important:** Make sure backend allows your frontend origin in CORS:
```env
# backend/.env
ALLOWED_ORIGINS=https://frontend.example.com
```

## Environment Variables

### Frontend (.env files)

Create any of these files in the `frontend/` directory:

- `.env` - Loaded in all cases
- `.env.local` - Loaded in all cases, ignored by git
- `.env.development` - Loaded in development only
- `.env.production` - Loaded in production build only

**Example:**
```env
# frontend/.env.development
VITE_API_URL=http://localhost:5000/api

# frontend/.env.production
VITE_API_URL=https://api.myapp.com/api
```

### Variable Naming

⚠️ **Must start with `VITE_`** to be exposed to the frontend code!

```javascript
// ✅ Correct - accessible in code
VITE_API_URL=http://localhost:5000

// ❌ Wrong - not accessible
API_URL=http://localhost:5000
```

Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Testing Different Configurations

### 1. Default (with proxy)
```bash
cd frontend
npm run dev
# API calls: /api → proxy → http://localhost:5000/api
```

### 2. Direct to backend
```bash
cd frontend
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm run dev
# API calls: direct to http://localhost:5000/api
```

### 3. Custom backend
```bash
cd frontend
echo "VITE_API_URL=http://192.168.1.100:5000/api" > .env
npm run dev
# API calls: direct to http://192.168.1.100:5000/api
```

## Troubleshooting

### CORS Errors

If you see CORS errors:

1. **Using proxy?** Make sure backend is running on `localhost:5000`
2. **Direct connection?** Add your frontend URL to backend's `ALLOWED_ORIGINS`
3. **Check backend logs** for CORS-related errors

### Connection Refused

1. **Is backend running?** Check `http://localhost:5000/api/health`
2. **Wrong port?** Update proxy in `vite.config.js`
3. **Using Docker?** Use `host.docker.internal` instead of `localhost`

### 404 Not Found

1. **Check API endpoint** - Verify route exists in backend
2. **Check base URL** - Console log: `console.log(import.meta.env.VITE_API_URL)`
3. **Missing /api prefix?** Make sure all routes include `/api`

## Quick Reference

| Scenario | Configuration | API Calls Go To |
|----------|--------------|-----------------|
| Dev (default) | No config needed | Proxy → localhost:5000 |
| Dev (custom port) | Update `vite.config.js` proxy | Proxy → custom port |
| Dev (direct) | Set `VITE_API_URL` | Direct to URL |
| Prod (same server) | No config needed | Same origin /api |
| Prod (different server) | Set `VITE_API_URL` in build | External API server |

## Summary

**TL;DR**: In development, the default setup uses Vite's proxy to forward `/api` requests to `localhost:5000`. No configuration file needed - it just works! 🎉

For custom setups, you can:
- Modify the proxy in `vite.config.js`, OR
- Set `VITE_API_URL` environment variable
