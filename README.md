# VAULTORIA - Multiplayer Incremental Trading & PvP Risk Game

A cyberpunk-themed multiplayer web game where players mine digital items, trade on a global bazaar, upgrade their systems, and breach other players' vaults.

## Tech Stack

- **Backend**: Node.js with Express and Socket.io
- **Database**: Neon (PostgreSQL) using pg connection pooler
- **Frontend**: Vanilla HTML/CSS/JS (retro-futuristic terminal interface)
- **Architecture**: Single web service (Express serves static files and handles API/WebSocket routes)

## Features

### Manual Clicker
- Click to mine digital items (Floppy Disks, Cassette Tapes, etc.)
- Upgrade clicker to unlock rarer item drops (Rare, Epic, Legendary)
- Quick-sell items for cash or list on the Bazaar

### Auto Generator
- Purchase and upgrade automatic generators
- Generators produce items automatically every 5 seconds
- Higher level generators produce better items

### Bazaar (Market)
- Live marketplace with real-time updates via Socket.io
- List items for custom prices
- Buy items from other players
- Instant transactions

### PvP Breach System
- Players with $100+ become vulnerable to breaches
- Purchase breach tools of varying tiers
- Target other players and attempt to steal their cash
- Success depends on tool level vs target's protection level

### Protection System
- Upgrade protection to defend against breaches
- Higher protection levels make you harder to breach

### Leaderboard
- Real-time global rankings by cash balance
- Track your progress against other players

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Neon PostgreSQL Database

1. Create a free account at [Neon](https://neon.tech)
2. Create a new PostgreSQL database
3. Copy your connection string

### 3. Configure Environment Variables

Create a `.env` file in the project root:
```env
DATABASE_URL=postgresql://username:password@ep-xxx.region.aws.neon.tech/database?sslmode=require
PORT=3000
```

### 4. Initialize Database Schema

Run the SQL schema against your Neon database:
```bash
# You can run this using psql, the Neon console, or any PostgreSQL client
psql $DATABASE_URL -f schema.sql
```

### 5. Start the Server

```bash
npm start
```

The server will start on port 3000 (or your configured PORT).

### 6. Play the Game

Open your browser and navigate to:
```
http://localhost:3000
```

## Game Mechanics

### Item Rarities & Quick Sell Prices
- **Junk**: $0.10 (Broken Cable - from level 0 generator)
- **Common**: $0.50 (Floppy Disk, Cassette Tape, etc.)
- **Rare**: $5.00 (SSD Drive, Graphics Card, etc.)
- **Epic**: $25.00 (Quantum Processor, Neural Chip, etc.)
- **Legendary**: $100.00 (AI Core, Time Crystal, etc.)

### Breach Tools & Success Rates
- **Basic Scanner (Level 1)**: $50, 20% success rate
- **Network Sniffer (Level 2)**: $150, 35% success rate
- **Packet Injector (Level 3)**: $400, 50% success rate
- **Zero-Day Exploit (Level 4)**: $1,000, 70% success rate
- **Quantum Decryptor (Level 5)**: $2,500, 90% success rate

### Breach Rules
- Target must have $100+ to be breachable
- Tool level must be higher than target's protection level
- Successful breach steals 10-35% of target's cash (based on tool level)
- Failed breach wastes the tool cost

## File Structure

```
vaultoria/
├── package.json          # Dependencies and scripts
├── server.js             # Express server, Socket.io, API routes
├── db.js                 # PostgreSQL connection pool
├── schema.sql            # Database schema
├── .env.example          # Environment variables template
├── public/
│   ├── index.html        # Main HTML interface
│   ├── style.css         # Cyberpunk terminal styling
│   └── app.js            # Frontend game logic
└── README.md             # This file
```

## API Endpoints

### Player Management
- `POST /api/player` - Create or get player
- `GET /api/player/:username` - Get player data

### Gameplay
- `POST /api/click` - Manual click to generate item
- `GET /api/inventory/:player_id` - Get player inventory
- `POST /api/sell` - Quick sell items

### Bazaar
- `POST /api/bazaar/list` - List item on bazaar
- `GET /api/bazaar` - Get all bazaar listings
- `POST /api/bazaar/buy` - Buy item from bazaar

### Upgrades
- `GET /api/upgrades` - Get available upgrades
- `POST /api/upgrade` - Purchase upgrade

### Breach System
- `GET /api/breach-tools` - Get available breach tools
- `POST /api/breach` - Execute breach attempt
- `GET /api/players` - Get breachable players

### Leaderboard
- `GET /api/leaderboard` - Get top 20 players

## Socket.io Events

### Client → Server
- `join` - Join game with username

### Server → Client
- `bazaarUpdate` - Bazaar listings changed
- `playerUpdate` - Player data updated
- `generatorItem` - Auto-generator produced item

## Deployment

This game is designed for easy deployment. The architecture is a single web service that:
1. Serves static frontend files from the `public/` directory
2. Handles REST API endpoints
3. Manages WebSocket connections via Socket.io

### Deployment Options

1. **Render / Railway / Fly.io**: Deploy as a Node.js service
2. **VPS**: Run with PM2 or systemd
3. **Neon**: Use Neon for PostgreSQL hosting

Ensure your `DATABASE_URL` environment variable is set in your deployment platform.

## License

ISC

## Credits

Built with Node.js, Express, Socket.io, and Neon PostgreSQL.
