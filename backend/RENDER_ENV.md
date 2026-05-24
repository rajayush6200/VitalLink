# Render deployment — environment variables

Set these on **vitallink-backend** → Environment:

| Key | Example value |
|-----|----------------|
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/vitallink?retryWrites=true&w=majority` |
| `JWT_SECRET` | long random string (64+ chars) |
| `AI_SERVICE_URL` | `https://vitallink-ai-service.onrender.com/analyze` (required for blood sample AI) |
| `ADMIN_EMAIL` | your admin login email |
| `ADMIN_PASSWORD` | your admin password |

`PORT` is set automatically by Render — do not override unless you know why.

## MongoDB Atlas checklist

1. **Database user** — username + password with read/write on `vitallink` database.
2. **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`). Render uses dynamic IPs; without this, login returns errors.
3. **Connection string** — copy from Atlas → Connect → Drivers → Node.js. Replace `<password>` with your password.
4. **URL-encode special characters** in the password (`@` → `%40`, `#` → `%23`, etc.).

## After first deploy

1. Open `https://vitallink-backend.onrender.com/api/health` — `database` must be `"connected"`.
2. Seed admin (run once locally with production `MONGO_URI` in `.env`):
   ```bash
   cd backend
   node changeAdminPassword.js
   ```
3. Redeploy **frontend** if you change `frontend/js/config.js`.

## Frontend (vitallink-app-2jb5)

**Live URL:** https://vitallink-app-2jb5.onrender.com

**Static Site** settings in Render Dashboard:

| Setting | Value |
|---------|--------|
| **Root Directory** | `.` (repo root) or leave blank |
| **Publish Directory** | `frontend` ← **required** |
| **Build Command** | leave empty or `echo ok` |

If Publish Directory is wrong (e.g. `.` or `backend`), every page including **Become a Donor** shows **Not Found**.

After fixing, these must work:
- https://vitallink-app-2jb5.onrender.com/
- https://vitallink-app-2jb5.onrender.com/donate.html

Ensure `frontend/js/config.js` has:
```js
API_BASE_URL: "https://vitallink-backend.onrender.com"
```

## AI service (vitallink-ai-service)

No MongoDB required. Root URL should return `AI service running`.
