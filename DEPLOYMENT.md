# Deploying Vaultoria to Render

This guide will help you deploy Vaultoria to Render.com.

## Prerequisites

- A Render.com account (free tier available)
- GitHub account with your Vaultoria repository
- Render account connected to GitHub

## Deployment Architecture

Vaultoria requires two services on Render:
1. **PostgreSQL Database** - For persistent data
2. **Web Service (Server)** - Node.js backend with WebSocket support

The client will be deployed separately (see below).

## Step 1: Prepare Your Repository

1. Push your Vaultoria code to GitHub
2. Ensure your `.gitignore` includes sensitive files (already done)
3. The `render.yaml` file is already included in the repo

## Step 2: Deploy to Render Using render.yaml

### Option A: Automatic Deployment (Recommended)

1. Go to https://dashboard.render.com
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect `render.yaml` and show the configuration
5. Review and click "Apply"

This will automatically create:
- PostgreSQL database
- Web service for the server

### Option B: Manual Deployment

#### Deploy Database

1. Go to Render Dashboard → "New +" → "PostgreSQL"
2. Name: `vaultoria-db`
3. Database: `vaultoria`
4. User: `vaultoria`
5. Region: Choose nearest to your users
6. Plan: Free (or paid for better performance)
7. Click "Create Database"

**Important:** Copy the "Internal Database URL" from the database dashboard - you'll need this.

#### Deploy Server

1. Go to Render Dashboard → "New +" → "Web Service"
2. Connect your GitHub repository
3. Name: `vaultoria-server`
4. Region: Same as database
5. Branch: `main`
6. Runtime: `Node`
7. Build Command: `cd server && npm install && npm run build`
8. Start Command: `cd server && npm start`
9. Environment Variables:
   - `DATABASE_URL`: Paste your Internal Database URL
   - `JWT_SECRET`: Generate a random string (use: https://generate-secret.vercel.app/32)
   - `PORT`: `3001`
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: Your client URL (e.g., `https://your-client.vercel.app`)
10. Click "Create Web Service"

## Step 3: Deploy Client (Frontend)

### Option A: Vercel (Recommended for React apps)

1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Root Directory: `client`
5. Framework Preset: Vite
6. Build Command: `npm run build`
7. Output Directory: `dist`
8. Environment Variables:
   - `VITE_API_URL`: Your Render server URL (e.g., `https://vaultoria-server.onrender.com`)
9. Click "Deploy"

### Option B: Netlify

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub
4. Build command: `cd client && npm run build`
5. Publish directory: `client/dist`
6. Add environment variable: `VITE_API_URL`
7. Click "Deploy site"

### Option C: Render Static Site

1. Go to Render Dashboard → "New +" → "Static Site"
2. Connect GitHub
3. Name: `vaultoria-client`
4. Root Directory: `client`
5. Build Command: `npm run build`
6. Publish Directory: `dist`
7. Add environment variables as needed
8. Click "Create Static Site"

## Step 4: Update Client Configuration

After deploying the server, update the client to use the production server URL:

In `client/src/hooks/useWebSocket.ts`:
```typescript
const wsUrl = import.meta.env.VITE_API_URL || 'ws://localhost:3001';
const ws = new WebSocket(`${wsUrl}/ws`, token);
```

In `client/src/pages/LoginPage.tsx` and `RegisterPage.tsx`:
```typescript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const response = await fetch(`${apiUrl}/api/auth/login`, ...);
```

In `client/src/pages/GamePage.tsx`:
```typescript
const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const response = await fetch(`${apiUrl}/api/game/inventory`, ...);
```

## Step 5: Database Migration

After the server is deployed, you need to run the database migrations:

1. Go to your server service on Render
2. Click "Shell" (if available) or use the Render CLI
3. Run:
```bash
cd server
npx prisma db push
```

Or add a render.com build script that runs this automatically.

## Step 6: Update CORS

Update the `CORS_ORIGIN` environment variable on your Render server to match your deployed client URL:
- If using Vercel: `https://your-project.vercel.app`
- If using Netlify: `https://your-project.netlify.app`
- If using Render: `https://vaultoria-client.onrender.com`

## Step 7: Test the Deployment

1. Visit your deployed client URL
2. Try registering a new account
3. Try logging in
4. Move around the lobby
5. Generate items
6. Check if everything works

## Important Notes

### WebSocket Support on Render

Render supports WebSockets on web services. The configuration in `render.yaml` should work, but if you encounter issues:

1. Ensure your server is set up to handle WebSocket upgrades
2. Check Render logs for WebSocket-related errors
3. The server already uses the `ws` library which is compatible

### Free Tier Limitations

Render Free Tier:
- Web services spin down after 15 minutes of inactivity
- Cold starts take 30-60 seconds
- 512MB RAM, 0.1 CPU
- 100GB bandwidth/month

For production, consider:
- Render Starter ($7/month) - Keeps service running
- Better performance with paid plans

### Database

Free PostgreSQL on Render:
- 90 days of data retention
- 1GB storage
- 90 connections limit

For production, upgrade to paid PostgreSQL.

### Environment Variables

Never commit `.env` files to GitHub. Use Render's environment variable management instead.

## Troubleshooting

### Server won't start
- Check Render logs for errors
- Ensure `DATABASE_URL` is correct
- Verify `JWT_SECRET` is set

### WebSocket connection fails
- Check if CORS_ORIGIN matches your client URL
- Verify the server is running
- Check browser console for errors

### Database connection fails
- Verify DATABASE_URL format
- Check if database is running
- Ensure database exists

### Build fails
- Check if all dependencies are in package.json
- Verify TypeScript compiles without errors
- Check build logs

## Current render.yaml Configuration

The included `render.yaml` is set up for:
- PostgreSQL database (free tier)
- Node.js web service (free tier)
- Automatic environment variable generation
- Proper build and start commands

This should work out of the box for most deployments.

## Production Checklist

Before going live:
- [ ] Change JWT_SECRET to a secure random string
- [ ] Set NODE_ENV to production
- [ ] Update CORS_ORIGIN to your production client URL
- [ ] Run database migrations
- [ ] Test all features
- [ ] Set up monitoring (Render provides logs)
- [ ] Consider upgrading from free tier for better performance
- [ ] Set up custom domain (optional)
- [ ] Enable SSL (Render provides this automatically)

## Cost Estimate

**Free Tier:**
- Server: $0 (with spin-down)
- Database: $0 (90-day retention)
- Client (Vercel/Netlify): $0

**Production (Recommended):**
- Server: $7/month (Render Starter)
- Database: $7/month (Render PostgreSQL)
- Client: $0 (Vercel/Netlify free tier)
- **Total: ~$14/month**

## Alternative: Single Service Deployment

If you want to deploy everything as a single service, you can:

1. Serve the React client from the Express server
2. Use `express.static()` to serve the built client
3. Update the build process to build both client and server

This is more complex but reduces the number of services needed.
