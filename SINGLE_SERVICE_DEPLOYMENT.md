# Vaultoria Single-Service Deployment Guide

## Architecture Overview

Vaultoria is now deployed as **ONE Render Web Service** that serves:

- ✅ React/Phaser frontend
- ✅ Node.js backend API
- ✅ WebSocket server
- ✅ Game logic
- ✅ Authentication
- ✅ All connected to Neon PostgreSQL

### Final Architecture

```
Player Browser
    |
    | HTTPS / WSS
    v
┌──────────────────────────────┐
│  RENDER WEB SERVICE          │
│  (vaultoria.onrender.com)    │
│                              │
│  • React UI                  │
│  • Phaser Game               │
│  • Node.js Backend           │
│  • REST API                  │
│  • WebSocket Server          │
│  • Authentication            │
│  • Game Logic                │
│  • Multiplayer State         │
└──────────────┬───────────────┘
               |
               | PostgreSQL
               v
┌─────────────────┐
│  NEON           │
│  PostgreSQL     │
│                 │
│  • Users        │
│  • Players      │
│  • Vaults       │
│  • Inventory   │
│  • Items        │
│  • Economy      │
│  • Marketplace  │
│  • Crafting     │
│  • PvP          │
│  • Events       │
│  • Progression  │
└─────────────────┘
```

## Prerequisites

1. **Neon PostgreSQL Account** - Free tier available at https://neon.tech
2. **Render Account** - Free tier available at https://render.com
3. **GitHub Account** - For deployment
4. **Node.js 18+** - For local development

## Step 1: Set Up Neon PostgreSQL

### Create Neon Database

1. Go to https://console.neon.tech
2. Sign up / Log in
3. Click "Create a project"
4. Name: `vaultoria`
5. Region: Choose nearest to your users
6. Click "Create Project"
7. Copy the **Connection String** from the dashboard
   - Format: `postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`

### Run Database Migrations

Locally, set your DATABASE_URL in `server/.env`:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
```

Then run:

```bash
npm run db:push
```

This will create all tables in Neon.

## Step 2: Configure Environment Variables

### For Local Development

Edit `server/.env`:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="vaultoria-super-secret-jwt-key-change-in-production"
PORT=3001
NODE_ENV=development
```

### For Render Deployment

These will be set in the Render dashboard:

- `DATABASE_URL` - Your Neon connection string
- `JWT_SECRET` - Generate a random string (Render can auto-generate)
- `PORT` - Render sets this automatically (default: 10000)
- `NODE_ENV` - Set to `production`

## Step 3: Build the Project

### Local Build Test

```bash
# Install all dependencies
npm install

# Build everything (shared, client, server, prisma)
npm run build

# Start the production server
npm start
```

The server will:
1. Serve the React frontend from `/client/dist`
2. Expose API endpoints at `/api/*`
3. Expose WebSocket at `/ws`
4. Connect to Neon PostgreSQL
5. Handle SPA routing for all frontend routes

### Test Locally

1. Visit http://localhost:3001
2. Register a new account
3. Test the game
4. Verify database persistence
5. Test WebSocket connections

## Step 4: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. **Push code to GitHub**

```bash
git add .
git commit -m "Ready for single-service Render deployment"
git push origin main
```

2. **Deploy on Render**

- Go to https://dashboard.render.com
- Click "New +" → "Blueprint"
- Connect your GitHub repository
- Render will detect `render.yaml`
- Review the configuration
- Click "Apply"

### Option B: Manual Deployment

1. **Create Web Service**

- Go to Render Dashboard → "New +" → "Web Service"
- Connect your GitHub repository
- Name: `vaultoria`
- Region: Choose nearest to users
- Branch: `main`
- Runtime: `Node`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

2. **Add Environment Variables**

In the web service settings, add:

- `DATABASE_URL`: Your Neon connection string
- `JWT_SECRET`: Generate a random string (or let Render generate)
- `PORT`: `10000` (or leave empty for Render default)
- `NODE_ENV`: `production`

3. **Click "Create Web Service"**

## Step 5: Run Database Migrations on Render

After deployment, you need to run the initial database migration:

### Using Render CLI

```bash
# Install Render CLI
npm install -g @renderhq/render-cli

# Login
render login

# Run migration
render deploy vaultoria --command="npx prisma db push"
```

### Or Use Render Shell

1. Go to your web service on Render
2. Click "Shell" (if available)
3. Run:
```bash
npx prisma db push
```

### Or Add to Build Process

Add a script to your `package.json` to run migrations on deploy:

```json
"scripts": {
  "postinstall": "npx prisma generate && npx prisma db push"
}
```

## Step 6: Verify Deployment

1. **Wait for deployment to complete** (2-5 minutes)

2. **Visit your Render URL**
   - Format: `https://vaultoria.onrender.com`
   - Or your custom service name

3. **Test health endpoint**
   - Visit: `https://vaultoria.onrender.com/health`
   - Should return: `{"status":"ok","database":"connected","environment":"production"}`

4. **Test the game**
   - Register a new account
   - Log in
   - Move around the lobby
   - Generate items
   - Test multiplayer (open in multiple tabs)

## Step 7: (Optional) Add Custom Domain

1. Go to your web service on Render
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Wait for SSL certificate to generate

## Important Notes

### WebSocket Support

Render supports WebSockets on web services. The single-service architecture ensures:
- WebSocket runs on the same domain as the frontend
- No CORS issues
- Automatic HTTPS/WSS handling
- Dynamic WebSocket URL detection in client

### SPA Routing

The server is configured to serve `index.html` for all non-API routes, so:
- `/vault`
- `/inventory`
- `/bazaar`
- `/craft`
- `/warzone`
- `/profile`
- `/leaderboards`

All work correctly when accessed directly or refreshed.

### Environment Variables

**NEVER commit secrets to GitHub.** Use Render's environment variable management.

Required variables:
- `DATABASE_URL` - Neon connection string
- `JWT_SECRET` - Secret for JWT tokens
- `PORT` - Server port (Render sets this)
- `NODE_ENV` - Set to `production`

### Neon PostgreSQL

Neon is serverless PostgreSQL. Benefits:
- Free tier available
- Auto-scaling
- Branching for development
- Connection pooling
- SSL by default

Connection string format:
```
postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

### Render Free Tier Limitations

- Web services spin down after 15 minutes inactivity
- Cold starts take 30-60 seconds
- 512MB RAM, 0.1 CPU
- 100GB bandwidth/month

For production, consider upgrading to Render Starter ($7/month).

### Database Persistence

All game data is stored in Neon PostgreSQL:
- Users and authentication
- Player profiles
- Vaults and upgrades
- Inventory and items
- Transactions
- Marketplace listings
- PvP logs
- Everything persists across server restarts

### Reconnection Handling

The client includes automatic reconnection:
- Detects WebSocket disconnects
- Shows "Connection lost. Reconnecting..."
- Attempts reconnection
- Re-authenticates session
- Restores player state
- Prevents duplicate transactions

## Troubleshooting

### Build Fails

- Check Render logs
- Ensure `package.json` has all dependencies
- Verify TypeScript compiles locally: `npm run build`
- Check Prisma generates: `npm run db:generate`

### Database Connection Fails

- Verify DATABASE_URL format
- Check Neon dashboard for connection string
- Ensure `?sslmode=require` is in the connection string
- Test connection locally first

### WebSocket Doesn't Connect

- Check if WebSocket URL is dynamic (it should be)
- Verify server is running
- Check browser console for errors
- Ensure WSS (not WS) in production

### SPA Routes Return 404

- Verify server has SPA fallback middleware
- Check that `express.static` serves the correct path
- Ensure build output is in `client/dist`

### Health Check Fails

- Check if DATABASE_URL is set
- Verify Neon database is accessible
- Check Render logs for database errors

## Development vs Production

### Development

```bash
# Terminal 1 - Start server
npm run dev:server

# Terminal 2 - Start client (for hot reload)
npm run dev:client
```

- Server runs on http://localhost:3001
- Client dev server runs on http://localhost:5173
- API proxied through Vite
- WebSocket proxied through Vite

### Production

```bash
# Build everything
npm run build

# Start production server
npm start
```

- Single server on http://localhost:3001
- Frontend served from same server
- No proxy needed
- WebSocket connects to same origin

## Cost Breakdown

### Free Tier

- Render Web Service: $0 (with spin-down)
- Neon PostgreSQL: $0 (0.5GB, ~200 hours/month)
- **Total: $0/month**

### Production (Recommended)

- Render Starter: $7/month (no spin-down)
- Neon Scale: $19/month (1GB, unlimited)
- **Total: ~$26/month**

## Security Checklist

- [ ] JWT_SECRET is set to a secure random string
- [ ] DATABASE_URL uses SSL (`sslmode=require`)
- [ ] NODE_ENV is set to `production`
- [ ] No secrets committed to GitHub
- [ ] Helmet security headers enabled
- [ ] Rate limiting on API endpoints
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma)
- [ ] Password hashing with bcrypt
- [ ] HTTPS enforced in production

## Monitoring

### Render Dashboard

- View logs in real-time
- Monitor CPU and memory usage
- Check response times
- View error rates

### Health Endpoint

Visit `/health` to check:
- Server status
- Database connection
- Environment

### Database Monitoring

Use Neon dashboard to:
- View query performance
- Monitor connection usage
- Check storage usage
- View slow queries

## Scaling

If you need to scale:

1. **Upgrade Render plan** - More CPU/RAM
2. **Upgrade Neon plan** - More storage/connections
3. **Add Redis** - For session storage/caching
4. **Add CDN** - For static assets
5. **Load balancing** - Multiple Render instances

## Summary

Vaultoria is now deployed as a single Render Web Service:

✅ **One repository**
✅ **One build**
✅ **One deployment**
✅ **One Render Web Service**
✅ **One public domain**
✅ **Frontend + Backend + WebSocket + API together**

Connected to Neon PostgreSQL for persistent data storage.

The game is fully playable with real-time multiplayer, persistent progression, and all game mechanics working correctly.
