# Vaultoria

A multiplayer item-hoarding game with vaults, bazaar, and friends. Collect items, trade with other players, and grow your fortune in this real-time multiplayer world.

![Vaultoria](assets/favicon.svg)

## Features

- **Real-time Multiplayer**: Join worlds with up to 8 players and interact in real-time
- **Item Generation**: Generate items with different rarities (Common, Uncommon, Rare, Epic, Legendary, Electric)
- **Vault System**: Protect your items in your personal vault
- **Trading**: Trade items and money with other players
- **Bazaar**: Buy and sell items in the global marketplace
- **Social**: Add friends and see who's online
- **Boss Battles**: Fight world bosses together and earn rewards based on your contribution
- **Upgrades**: Upgrade your generator level for better luck and item generation
- **Mutations**: Items can have special mutations (Gold, Diamond, Electric) that increase their value
- **Achievements**: Unlock achievements as you progress
- **Daily Quests**: Complete daily quests for rewards
- **Rebirth System**: Reset progress for permanent bonuses
- **Mobile Support**: Touch controls for phones and tablets
- **Admin Panel**: Full admin controls for managing users and game state

## Tech Stack

- **Frontend**: HTML5, Canvas API, JavaScript
- **Backend**: Node.js, Express
- **Database**: PostgreSQL (Neon)
- **Real-time**: WebSocket (ws)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js 18.0.0 or higher
- PostgreSQL database (Neon recommended for deployment)
- npm or yarn

## Local Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/DrakVortexx/Vaultoria.git
   cd Vaultoria
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_secret_key
   ```

4. **Initialize the database**
   Run the SQL schema files in order:
   ```bash
   psql DATABASE_URL < schema.sql
   psql DATABASE_URL < migrate.sql
   ```

5. **Start the server**
   ```bash
   npm start
   ```

6. **Open the game**
   Navigate to `http://localhost:3000` in your browser

## How to Play

### Getting Started

1. **Create an account** - Register with a username and password
2. **Join a world** - Select a server from the dashboard
3. **Walk around** - Use WASD or arrow keys (touch controls on mobile)
4. **Find your vault** - Look for the glowing pad with your name

### Basic Gameplay

- **Generate Items**: Stand on your vault pad and press E to open your vault, then generate items
- **Sell Items**: Sell items from your inventory to earn money
- **Upgrade Generator**: Use money to upgrade your generator level for better item luck
- **Trade**: Use the Trade button to trade with other players
- **Bazaar**: Visit the Bazaar to buy and sell items globally

### Advanced Features

- **Mutations**: Rare items can have mutations (Gold, Diamond, Electric) that multiply their value
- **Boss Battles**: When the world boss appears, attack it to earn rewards based on damage dealt
- **Breaching**: Buy breaches in the shop to raid other players' vaults (if they're not shielded)
- **Daily Quests**: Complete daily quests for bonus rewards
- **Rebirth**: Once you reach a high level, rebirth for permanent bonuses

### Controls

- **WASD / Arrow Keys**: Move around
- **E**: Interact (open vault, spin wheel, etc.)
- **ESC**: Close modals
- **Mobile**: On-screen joystick and E button

## Game Mechanics

### Item Rarities

- **Common** (grey): Base items
- **Uncommon** (green): Slightly better
- **Rare** (blue): Good items
- **Epic** (purple): Great items
- **Legendary** (orange): Excellent items
- **Electric** (pink/cyan): The rarest items

### Mutations

Items can have special mutations that significantly increase their value:
- **Gold**: 3x value
- **Diamond**: 10x value
- **Electric**: 50x value

### Vault System

- Each player has a personal vault in the world
- Only you can access your vault (when standing on your pad)
- Items are protected in your vault from theft
- You can activate a shield to temporarily protect against breaches

## Deployment

### Render (Recommended)

1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set environment variables:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `JWT_SECRET`: A secure random string
4. Deploy

The `render.yaml` file is included for easy Render deployment.

### Other Platforms

The game can be deployed to any Node.js hosting platform that supports:
- Node.js 18+
- PostgreSQL
- WebSocket connections

## Admin Panel

The admin panel is accessible to users with admin privileges (username: `knowkey` by default).

Features:
- View all users and their online status
- Kick, mute, and ban users
- Give/remove items and mutations
- Set user money and levels
- Reset user progress
- Send global announcements
- Restart the game

## License

This project is private and owned by DrakVortexx.

## Support

For issues or questions, please contact the maintainers.

---

**Enjoy Vaultoria!** 🎮✨
