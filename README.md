# VAULTORIA

BUILD YOUR VAULT. BUILD YOUR FORTUNE. RISK EVERYTHING. BECOME OMNIVERSAL.

A multiplayer 2D progression game with real-time multiplayer, persistent accounts, economy, PvP, and more.

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+ (local installation or cloud service)
- npm or yarn

## Quick Start

### Step 1: Set up PostgreSQL

**For Windows users without Docker:**
See [SETUP.md](SETUP.md) for detailed Windows setup instructions.

**Quick options:**
- Install PostgreSQL locally from https://www.postgresql.org/download/windows/
- Or use a free cloud service like Supabase or ElephantSQL

Create a database named "vaultoria".

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Configure environment

Update `server/.env` with your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/vaultoria?schema=public"
JWT_SECRET="vaultoria-super-secret-jwt-key-change-this-in-production"
PORT=3001
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"
```

### Step 4: Set up database
```bash
npm run db:push
```

### Step 5: Start the game

Terminal 1 - Start server:
```bash
npm run dev:server
```

Terminal 2 - Start client:
```bash
npm run dev:client
```

### Step 6: Play

Open http://localhost:5173 in your browser.

Register an account, then you can:
- Move around the multiplayer lobby with WASD or arrow keys
- Generate items from your vault's generator
- Sell items for money
- Upgrade your vault (generator, storage, security)
- See other players moving in real-time

## Project Structure

```
Vaultoria/
├── client/          # React + Phaser frontend
├── server/          # Node.js + WebSocket backend
├── shared/          # Shared TypeScript types and config
├── database/        # Database migrations and seeds
├── assets/          # Game assets
├── config/          # Configuration files
└── scripts/         # Utility scripts
```

## Development Commands

```bash
# Install all dependencies
npm install

# Database operations
npm run db:generate   # Generate Prisma client
npm run db:migrate    # Run database migrations
npm run db:push       # Push schema changes (dev only)
npm run db:studio     # Open Prisma Studio

# Development
npm run dev           # Start both server and client
npm run dev:server    # Start server only
npm run dev:client    # Start client only

# Production build
npm run build         # Build all packages
npm run build:server  # Build server
npm run build:client  # Build client

# Testing
npm test              # Run all tests
npm run test:server   # Run server tests
npm run test:client   # Run client tests
```

## Environment Variables

Create `server/.env`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/vaultoria?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=3001
NODE_ENV=development
CORS_ORIGIN="http://localhost:5173"
```

## Game Features

### Phase 1 (Current)
- ✅ Account system with secure authentication
- ✅ Multiplayer lobby with real-time player movement
- ✅ Vaults with generator, storage, and security
- ✅ Server-authoritative item generation with rarity system
- ✅ Inventory system
- ✅ Money system with transaction logging
- ✅ Basic UI (Vault, Inventory, Generator panels)
- ✅ PostgreSQL database with Prisma ORM

### Phase 2 (Planned)
- Vault upgrades
- Offline production
- Bazaar marketplace
- Market listings and buy orders
- Transaction history

### Phase 3 (Planned)
- Crafting system
- Events
- Rarity progression
- Ascension system
- Leaderboards

### Phase 4 (Planned)
- Warzone PvP
- Real-time combat
- Risk inventory system
- Combat rewards

### Phase 5 (Planned)
- Breaches
- Advanced security
- Battle Royale architecture

## Testing

Create multiple accounts to test multiplayer:
1. Open http://localhost:5173
2. Register as player1
3. Open in incognito or different browser
4. Register as player2
5. See both players in the lobby moving in real-time

## Troubleshooting

### PostgreSQL Connection Issues
- Ensure PostgreSQL is running: `docker ps` or check Windows services
- Verify DATABASE_URL in server/.env
- Check that the database exists

### Port Already in Use
- Change PORT in server/.env
- Update CORS_ORIGIN accordingly

### WebSocket Connection Failed
- Check server is running
- Verify token is valid
- Check browser console for errors

## Security Notes

⚠️ **IMPORTANT**: Change the JWT_SECRET in production before deploying!

The game uses:
- bcrypt for password hashing
- JWT for session management
- Server-authoritative game logic
- Rate limiting on API endpoints
- CORS protection

## License

Proprietary - All rights reserved
