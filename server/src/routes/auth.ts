import { Router, Request, Response } from 'express';
import prisma from '../db';
import { hashPassword, verifyPassword, createSession, deleteAllUserSessions } from '../auth';
import { GameConfig } from '@vaultoria/shared';
import { validateUsername, validatePassword } from '../validation';

const router = Router();

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validate input
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return res.status(400).json({ error: usernameValidation.error });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    // Create player profile
    const profile = await prisma.playerProfile.create({
      data: {
        userId: user.id,
        money: GameConfig.startingMoney,
        vaultLevel: GameConfig.startingVaultLevel,
        ascension: 0,
      },
    });

    // Create vault
    await prisma.vault.create({
      data: {
        playerId: profile.id,
        level: GameConfig.startingVaultLevel,
        ascension: 0,
        generatorLevel: GameConfig.startingGeneratorLevel,
        storageLevel: GameConfig.startingStorageLevel,
        securityLevel: GameConfig.startingSecurityLevel,
        storageCapacity: GameConfig.storageCapacity[0],
        currentStorage: 0,
        value: 0,
      },
    });

    // Create session
    const token = await createSession(user.id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
      },
      profile: {
        id: profile.id,
        money: profile.money,
        vaultLevel: profile.vaultLevel,
        ascension: profile.ascension,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Validate input
    const usernameValidation = validateUsername(username);
    if (!usernameValidation.valid) {
      return res.status(400).json({ error: usernameValidation.error });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ error: passwordValidation.error });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    const token = await createSession(user.id);

    // Get profile
    const profile = await prisma.playerProfile.findUnique({
      where: { userId: user.id },
    });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
      },
      profile: {
        id: profile?.id,
        money: profile?.money,
        vaultLevel: profile?.vaultLevel,
        ascension: profile?.ascension,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (token) {
      await deleteAllUserSessions(req.body.userId);
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
