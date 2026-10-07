# Quick Deployment Guide for Render

## Current Status

✅ Server is running locally on port 3001
✅ TypeScript compilation fixed
✅ Build errors resolved
✅ Render configuration ready

## Errors Fixed

1. **TypeScript build error** - Removed require() statements and used ES6 imports instead
2. **Prisma generation error** - Separated build and prisma generate commands
3. **Shared package import** - Configured proper import paths

## Deploy to Render (Step-by-Step)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### Step 2: Deploy Using render.yaml

1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect `render.yaml`
5. Review the configuration and click "Apply"

This will automatically create:
- PostgreSQL database (free tier)
- Web service for the server (free tier)

### Step 3: Deploy Client (Separate)

The client should be deployed separately for best performance:

**Option A: Vercel (Recommended)**
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Root Directory: `client`
5. Framework Preset: Vite
6. Click "Deploy"

**Option B: Netlify**
1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub
4. Build command: `cd client && npm run build`
5. Publish directory: `client/dist`
6. Click "Deploy site"

### Step 4: Update Environment Variables

After deploying both services:

1. Get your client URL (e.g., https://your-project.vercel.app)
2. Go to your Render server dashboard
3. Update `CORS_ORIGIN` environment variable to match your client URL
4. Wait for the server to redeploy

### Step 5: Test

1. Visit your deployed client URL
2. Register a new account
3. Test the game features

## Manual Deployment (Alternative)

If render.yaml doesn't work, deploy manually:

### Deploy Database

1. Render Dashboard → "New +" → "PostgreSQL"
2. Name: `vaultoria-db`
3. Database: `vaultoria`
4. User: `vaultoria`
5. Click "Create Database"
6. Copy the "Internal Database URL"

### Deploy Server

1. Render Dashboard → "New +" → "Web Service"
2. Connect GitHub
3. Name: `vaultoria-server`
4. Runtime: Node
5. Build Command: `cd server && npm install && npm run build`
6. Start Command: `cd server && node dist/index.js`
7. Environment Variables:
   - `DATABASE_URL`: (paste your database URL)
   - `JWT_SECRET`: (generate a random string)
   - `PORT`: `3001`
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: (your client URL)
8. Click "Create Web Service"

## Important Notes

### PostgreSQL Required

Before deployment, you need PostgreSQL:
- Local: Install from https://www.postgresql.org/download/windows/
- Cloud: Use Supabase (free) or ElephantSQL (free)
- Render: Use Render's PostgreSQL (free tier)

### Environment Variables

Never commit `.env` files. Use Render's environment variable management.

### WebSocket Support

Render supports WebSockets. The configuration in `render.yaml` is set up correctly.

### Free Tier Limitations

- Web services spin down after 15 minutes inactivity
- Cold starts take 30-60 seconds
- Database has 90-day retention on free tier

For production, consider upgrading to paid plans (~$14/month total).

## Troubleshooting

### Build fails on Render
- Check Render logs
- Ensure `package.json` has all dependencies
- Verify TypeScript compiles locally first

### Database connection fails
- Verify DATABASE_URL format
- Check if database is running
- Ensure database name matches

### WebSocket doesn't work
- Check CORS_ORIGIN matches client URL
- Verify server is running
- Check browser console for errors

## Current Local Server Status

The server is currently running locally:
- URL: http://localhost:3001
- WebSocket: ws://localhost:3001/ws
- Status: ✅ Running

You can test locally by:
1. Starting the client: `npm run dev:client`
2. Opening http://localhost:5173
3. Registering and playing

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy to Render using render.yaml
3. ✅ Deploy client to Vercel/Netlify
4. ✅ Update CORS_ORIGIN
5. ✅ Test deployment
6. ✅ (Optional) Upgrade from free tier for production
