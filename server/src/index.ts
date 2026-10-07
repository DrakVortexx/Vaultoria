import express from 'express';
import path from 'path';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import authRoutes from './routes/auth';
import gameRoutes from './routes/game';
import { validateSession } from './auth';
import prisma from './db';
import { Rarity, ItemType, GameConfig } from '@vaultoria/shared';
import { validateEnv } from './env';

// Validate environment variables
const env = validateEnv();

const app = express();
const server = createServer(app);
const PORT = env.PORT;
const NODE_ENV = env.NODE_ENV;
const IS_PROD = NODE_ENV === 'production';

// Middleware
app.use(helmet({
  contentSecurityPolicy: IS_PROD ? undefined : false,
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Serve static files from React build in production
if (IS_PROD) {
  const clientDistPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));

  // SPA fallback - serve index.html for all non-API routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health' || req.path === '/ws') {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// Health check with database connection
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: NODE_ENV
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      environment: NODE_ENV
    });
  }
});

// WebSocket Server
const wss = new WebSocketServer({ server, path: '/ws' });

// Connected clients map
const clients = new Map<string, WebSocket>();

// Player positions (for lobby)
const playerPositions = new Map<string, { x: number; y: number; username: string; vaultLevel: number }>();

wss.on('connection', async (ws: WebSocket, req) => {
  const token = req.headers['sec-websocket-protocol'] as string;
  
  if (!token) {
    ws.close(1008, 'No token provided');
    return;
  }

  const session = await validateSession(token);
  if (!session) {
    ws.close(1008, 'Invalid token');
    return;
  }

  const { userId, username } = session;
  clients.set(userId, ws);

  console.log(`User connected: ${username} (${userId})`);

  // Get player profile
  const profile = await prisma.playerProfile.findUnique({
    where: { userId },
    include: { vault: true },
  });

  if (!profile) {
    ws.close(1008, 'Profile not found');
    return;
  }

  // Initialize player position
  if (!playerPositions.has(userId)) {
    playerPositions.set(userId, {
      x: Math.random() * 2000,
      y: Math.random() * 1500,
      username,
      vaultLevel: profile.vaultLevel,
    });
  }

  // Send initial state
  ws.send(JSON.stringify({
    type: 'AUTH_SUCCESS',
    data: {
      userId,
      username,
      profile: {
        id: profile.id,
        money: profile.money,
        vaultLevel: profile.vaultLevel,
        ascension: profile.ascension,
      },
      vault: profile.vault,
    },
    timestamp: Date.now(),
  }));

  // Broadcast player join to other players
  broadcastToOthers(userId, {
    type: 'PLAYER_JOIN',
    data: {
      id: userId,
      username,
      x: playerPositions.get(userId)!.x,
      y: playerPositions.get(userId)!.y,
      vaultLevel: profile.vaultLevel,
      ascension: profile.ascension,
    },
    timestamp: Date.now(),
  });

  // Send existing players to new player
  const existingPlayers = Array.from(playerPositions.entries())
    .filter(([id]) => id !== userId)
    .map(([id, pos]) => ({
      id,
      username: pos.username,
      x: pos.x,
      y: pos.y,
      vaultLevel: pos.vaultLevel,
    }));

  ws.send(JSON.stringify({
    type: 'PLAYER_UPDATE',
    data: { players: existingPlayers },
    timestamp: Date.now(),
  }));

  ws.on('message', async (data: string) => {
    try {
      const message = JSON.parse(data);
      handleMessage(userId, username, message, ws);
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });

  ws.on('close', async () => {
    clients.delete(userId);
    playerPositions.delete(userId);
    
    // Update last online time
    await prisma.playerProfile.update({
      where: { userId },
      data: { lastOnlineTime: new Date() },
    });

    // Broadcast player leave
    broadcast({
      type: 'PLAYER_LEAVE',
      data: { id: userId },
      timestamp: Date.now(),
    });

    console.log(`User disconnected: ${username} (${userId})`);
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error for ${username}:`, error);
  });
});

function broadcast(message: any) {
  const data = JSON.stringify(message);
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
}

function broadcastToOthers(excludeUserId: string, message: any) {
  const data = JSON.stringify(message);
  clients.forEach((ws, userId) => {
    if (userId !== excludeUserId && ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
}

async function handleMessage(userId: string, username: string, message: any, ws: WebSocket) {
  const { type, data } = message;

  switch (type) {
    case 'PLAYER_MOVE': {
      const { x, y } = data;
      playerPositions.set(userId, { 
        ...playerPositions.get(userId)!, 
        x, y,
        username,
      });
      
      broadcastToOthers(userId, {
        type: 'PLAYER_UPDATE',
        data: {
          id: userId,
          x,
          y,
        },
        timestamp: Date.now(),
      });
      break;
    }

    case 'GENERATE_ITEM': {
      await handleGenerateItem(userId, ws);
      break;
    }

    case 'SELL_ITEM': {
      await handleSellItem(userId, data.itemId, data.quantity, ws);
      break;
    }

    case 'UPGRADE_VAULT': {
      await handleUpgradeVault(userId, data.upgradeType, ws);
      break;
    }

    default:
      console.log(`Unknown message type: ${type}`);
  }
}

async function handleGenerateItem(userId: string, ws: WebSocket) {
  try {
    const profile = await prisma.playerProfile.findUnique({
      where: { userId },
      include: { vault: true, inventory: true },
    });

    if (!profile || !profile.vault) {
      ws.send(JSON.stringify({
        type: 'ERROR',
        data: { message: 'Profile or vault not found' },
        timestamp: Date.now(),
      }));
      return;
    }

    // Check storage capacity
    if (profile.vault.currentStorage >= profile.vault.storageCapacity) {
      ws.send(JSON.stringify({
        type: 'ERROR',
        data: { message: 'Storage full' },
        timestamp: Date.now(),
      }));
      return;
    }

    // Generate item based on rarity odds
    const rarity = generateRarity(profile.vault.generatorLevel, profile.ascension);
    const item = generateItem(rarity);

    // Add to inventory
    const existingItem = profile.inventory.find(
      (inv: any) => inv.itemName === item.name && inv.rarity === rarity
    );

    if (existingItem) {
      await prisma.inventory.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + 1 },
      });
    } else {
      await prisma.inventory.create({
        data: {
          playerId: profile.id,
          itemId: item.id,
          itemType: item.type,
          itemName: item.name,
          rarity,
          baseValue: item.baseValue,
          description: item.description,
          stackSize: item.stackSize,
          tradable: item.tradable,
          sellable: item.sellable,
          quantity: 1,
        },
      });
    }

    // Update vault storage
    await prisma.vault.update({
      where: { id: profile.vault.id },
      data: { currentStorage: profile.vault.currentStorage + 1 },
    });

    // Update profile stats
    await prisma.playerProfile.update({
      where: { id: profile.id },
      data: {
        itemsCollected: { increment: 1 },
        highestRarity: rarity,
      },
    });

    // Log transaction
    await prisma.transaction.create({
      data: {
        playerId: profile.id,
        type: 'GENERATE',
        amount: item.baseValue,
        reason: `Generated ${item.name}`,
        itemId: item.id,
      },
    });

    ws.send(JSON.stringify({
      type: 'GENERATE_RESULT',
      data: {
        item: {
          id: item.id,
          type: item.type,
          name: item.name,
          rarity,
          baseValue: item.baseValue,
          description: item.description,
        },
        success: true,
      },
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.error('Generate item error:', error);
    ws.send(JSON.stringify({
      type: 'ERROR',
      data: { message: 'Failed to generate item' },
      timestamp: Date.now(),
    }));
  }
}

async function handleSellItem(userId: string, itemId: string, quantity: number, ws: WebSocket) {
  try {
    const profile = await prisma.playerProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      ws.send(JSON.stringify({
        type: 'ERROR',
        data: { message: 'Profile not found' },
        timestamp: Date.now(),
      }));
      return;
    }

    const inventoryItem = await prisma.inventory.findFirst({
      where: {
        playerId: profile.id,
        itemId,
      },
    });

    if (!inventoryItem || inventoryItem.quantity < quantity) {
      ws.send(JSON.stringify({
        type: 'ERROR',
        data: { message: 'Item not found or insufficient quantity' },
        timestamp: Date.now(),
      }));
      return;
    }

    const totalValue = inventoryItem.baseValue * quantity;

    // Update inventory
    if (inventoryItem.quantity === quantity) {
      await prisma.inventory.delete({ where: { id: inventoryItem.id } });
    } else {
      await prisma.inventory.update({
        where: { id: inventoryItem.id },
        data: { quantity: inventoryItem.quantity - quantity },
      });
    }

    // Update player money
    await prisma.playerProfile.update({
      where: { id: profile.id },
      data: { money: { increment: totalValue } },
    });

    // Update vault storage
    const vault = await prisma.vault.findUnique({
      where: { playerId: profile.id },
    });

    if (vault) {
      await prisma.vault.update({
        where: { id: vault.id },
        data: { currentStorage: Math.max(0, vault.currentStorage - quantity) },
      });
    }

    // Log transaction
    await prisma.transaction.create({
      data: {
        playerId: profile.id,
        type: 'SELL',
        amount: totalValue,
        reason: `Sold ${quantity}x ${inventoryItem.itemName}`,
        itemId,
      },
    });

    ws.send(JSON.stringify({
      type: 'SELL_RESULT',
      data: {
        success: true,
        amount: totalValue,
        itemId,
        quantity,
      },
      timestamp: Date.now(),
    }));

    // Send money update
    const updatedProfile = await prisma.playerProfile.findUnique({
      where: { id: profile.id },
    });

    ws.send(JSON.stringify({
      type: 'MONEY_UPDATE',
      data: { money: updatedProfile?.money || 0 },
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.error('Sell item error:', error);
    ws.send(JSON.stringify({
      type: 'ERROR',
      data: { message: 'Failed to sell item' },
      timestamp: Date.now(),
    }));
  }
}

async function handleUpgradeVault(userId: string, upgradeType: string, ws: WebSocket) {
  try {
    const profile = await prisma.playerProfile.findUnique({
      where: { userId },
      include: { vault: true },
    });

    if (!profile || !profile.vault) {
      ws.send(JSON.stringify({
        type: 'ERROR',
        data: { message: 'Profile or vault not found' },
        timestamp: Date.now(),
      }));
      return;
    }

    const costArray = GameConfig.vaultUpgradeCosts[upgradeType as keyof typeof GameConfig.vaultUpgradeCosts];
    if (!costArray) {
      ws.send(JSON.stringify({
        type: 'ERROR',
        data: { message: 'Invalid upgrade type' },
        timestamp: Date.now(),
      }));
      return;
    }

    const currentLevel = upgradeType === 'generator' ? profile.vault.generatorLevel :
                        upgradeType === 'storage' ? profile.vault.storageLevel :
                        profile.vault.securityLevel;

    if (currentLevel >= costArray.length) {
      ws.send(JSON.stringify({
        type: 'ERROR',
        data: { message: 'Upgrade already at max level' },
        timestamp: Date.now(),
      }));
      return;
    }

    const cost = costArray[currentLevel];

    if (profile.money < cost) {
      ws.send(JSON.stringify({
        type: 'ERROR',
        data: { message: 'Not enough money' },
        timestamp: Date.now(),
      }));
      return;
    }

    // Deduct money
    await prisma.playerProfile.update({
      where: { id: profile.id },
      data: { money: profile.money - cost },
    });

    // Update vault
    const updateData: any = {};
    if (upgradeType === 'generator') {
      updateData.generatorLevel = currentLevel + 1;
    } else if (upgradeType === 'storage') {
      updateData.storageLevel = currentLevel + 1;
      updateData.storageCapacity = GameConfig.storageCapacity[currentLevel];
    } else if (upgradeType === 'security') {
      updateData.securityLevel = currentLevel + 1;
    }

    await prisma.vault.update({
      where: { id: profile.vault.id },
      data: updateData,
    });

    // Log transaction
    await prisma.transaction.create({
      data: {
        playerId: profile.id,
        type: 'UPGRADE',
        amount: -cost,
        reason: `Upgraded ${upgradeType} to level ${currentLevel + 1}`,
      },
    });

    ws.send(JSON.stringify({
      type: 'UPGRADE_RESULT',
      data: {
        success: true,
        upgradeType,
        newLevel: currentLevel + 1,
      },
      timestamp: Date.now(),
    }));

    // Send updated vault
    const updatedVault = await prisma.vault.findUnique({
      where: { id: profile.vault.id },
    });

    ws.send(JSON.stringify({
      type: 'VAULT_UPDATE',
      data: updatedVault,
      timestamp: Date.now(),
    }));

    // Send money update
    const updatedProfile = await prisma.playerProfile.findUnique({
      where: { id: profile.id },
    });

    ws.send(JSON.stringify({
      type: 'MONEY_UPDATE',
      data: { money: updatedProfile?.money || 0 },
      timestamp: Date.now(),
    }));
  } catch (error) {
    console.error('Upgrade vault error:', error);
    ws.send(JSON.stringify({
      type: 'ERROR',
      data: { message: 'Failed to upgrade vault' },
      timestamp: Date.now(),
    }));
  }
}

function generateRarity(generatorLevel: number, ascension: number): string {
  // Adjust odds based on generator level and ascension
  const adjustedOdds = { ...GameConfig.generatorOdds };
  
  // Improve odds with higher levels
  const bonus = (generatorLevel - 1) * 0.01 + (ascension * 0.02);
  
  adjustedOdds[Rarity.COMMON] -= bonus * 0.5;
  adjustedOdds[Rarity.UNCOMMON] -= bonus * 0.3;
  adjustedOdds[Rarity.RARE] += bonus * 0.2;
  adjustedOdds[Rarity.EPIC] += bonus * 0.15;
  adjustedOdds[Rarity.LEGENDARY] += bonus * 0.1;
  adjustedOdds[Rarity.MYTHIC] += bonus * 0.05;
  adjustedOdds[Rarity.DIVINE] += bonus * 0.03;
  adjustedOdds[Rarity.CELESTIAL] += bonus * 0.02;
  adjustedOdds[Rarity.ETERNAL] += bonus * 0.01;
  adjustedOdds[Rarity.OMNIVERSAL] += bonus * 0.005;

  const rand = Math.random();
  let cumulative = 0;
  
  for (const [rarity, odds] of Object.entries(adjustedOdds)) {
    cumulative += odds as number;
    if (rand < cumulative) {
      return rarity;
    }
  }
  
  return Rarity.COMMON;
}

function generateItem(rarity: string) {
  const items = {
    [Rarity.COMMON]: [
      { name: 'Iron Scrap', type: ItemType.MATERIAL, description: 'Basic scrap metal', stackSize: 99 },
      { name: 'Copper Wire', type: ItemType.MATERIAL, description: 'Common electrical component', stackSize: 99 },
      { name: 'Plastic Bits', type: ItemType.MATERIAL, description: 'Recycled plastic fragments', stackSize: 99 },
    ],
    [Rarity.UNCOMMON]: [
      { name: 'Steel Plate', type: ItemType.MATERIAL, description: 'Sturdy steel plating', stackSize: 50 },
      { name: 'Gold Nugget', type: ItemType.MATERIAL, description: 'Small piece of gold', stackSize: 50 },
      { name: 'Circuit Board', type: ItemType.MATERIAL, description: 'Basic electronic circuit', stackSize: 50 },
    ],
    [Rarity.RARE]: [
      { name: 'Titanium Alloy', type: ItemType.MATERIAL, description: 'Lightweight titanium metal', stackSize: 25 },
      { name: 'Plasma Cell', type: ItemType.MATERIAL, description: 'Energy storage device', stackSize: 25 },
      { name: 'Quantum Chip', type: ItemType.MATERIAL, description: 'Advanced processing unit', stackSize: 25 },
    ],
    [Rarity.EPIC]: [
      { name: 'Dark Matter Core', type: ItemType.SPECIAL, description: 'Unstable matter essence', stackSize: 10 },
      { name: 'Starlight Crystal', type: ItemType.SPECIAL, description: 'Crystalized star energy', stackSize: 10 },
    ],
    [Rarity.LEGENDARY]: [
      { name: 'Phoenix Feather', type: ItemType.SPECIAL, description: 'Immortal bird\'s feather', stackSize: 5 },
      { name: 'Dragon Scale', type: ItemType.EQUIPMENT, description: 'Legendary dragon armor', stackSize: 1 },
    ],
    [Rarity.MYTHIC]: [
      { name: 'Time Shard', type: ItemType.SPECIAL, description: 'Fragment of time itself', stackSize: 3 },
    ],
    [Rarity.DIVINE]: [
      { name: 'Celestial Essence', type: ItemType.SPECIAL, description: 'Pure divine energy', stackSize: 1 },
    ],
    [Rarity.CELESTIAL]: [
      { name: 'Galaxy Core', type: ItemType.SPECIAL, description: 'Heart of a galaxy', stackSize: 1 },
    ],
    [Rarity.ETERNAL]: [
      { name: 'Void Fragment', type: ItemType.SPECIAL, description: 'Piece of the void', stackSize: 1 },
    ],
    [Rarity.OMNIVERSAL]: [
      { name: 'Omni Artifact', type: ItemType.SPECIAL, description: 'Beyond comprehension', stackSize: 1 },
    ],
  };

  const rarityItems = items[rarity as keyof typeof items] || items[Rarity.COMMON];
  const itemTemplate = rarityItems[Math.floor(Math.random() * rarityItems.length)];
  const multiplier = GameConfig.rarityMultipliers[rarity as keyof typeof GameConfig.rarityMultipliers] || 1;
  
  return {
    id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    ...itemTemplate,
    baseValue: Math.floor(10 * multiplier),
    tradable: true,
    sellable: true,
  };
}

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Vaultoria server running on port ${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`WebSocket endpoint: ws://localhost:${PORT}/ws`);
  if (IS_PROD) {
    console.log(`Serving frontend from ${path.join(__dirname, '../../client/dist')}`);
  }
});
