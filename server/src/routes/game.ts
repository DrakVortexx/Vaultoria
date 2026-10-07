import { Router, Request, Response } from 'express';
import prisma from '../db';
import { validateSession } from '../auth';

const router = Router();

// Get inventory
router.get('/inventory', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const session = await validateSession(token);
    if (!session) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const profile = await prisma.playerProfile.findUnique({
      where: { userId: session.userId },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const inventory = await prisma.inventory.findMany({
      where: { playerId: profile.id },
    });

    res.json({ inventory });
  } catch (error) {
    console.error('Get inventory error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get vault
router.get('/vault', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const session = await validateSession(token);
    if (!session) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const profile = await prisma.playerProfile.findUnique({
      where: { userId: session.userId },
      include: { vault: true },
    });

    if (!profile || !profile.vault) {
      return res.status(404).json({ error: 'Vault not found' });
    }

    res.json({ vault: profile.vault });
  } catch (error) {
    console.error('Get vault error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get profile
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const session = await validateSession(token);
    if (!session) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const profile = await prisma.playerProfile.findUnique({
      where: { userId: session.userId },
      include: { vault: true },
    });

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ 
      profile: {
        id: profile.id,
        money: profile.money,
        vaultLevel: profile.vaultLevel,
        ascension: profile.ascension,
        pvpWins: profile.pvpWins,
        pvpLosses: profile.pvpLosses,
        itemsCollected: profile.itemsCollected,
        highestRarity: profile.highestRarity,
      },
      vault: profile.vault,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
