const express = require("express");
const prisma = require("../db");
const { requireAuth } = require("../middleware/auth");
const { calculateLevelUp } = require("../services/game");

const router = express.Router();

router.get("/profile", requireAuth, async (req, res) => {
  try {
    const player = await prisma.player.findUnique({
      where: { id: req.player.id },
      include: {
        user: { select: { username: true } },
        inventory: { include: { item: true } },
      },
    });
    res.json({ player });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.get("/leaderboard", async (req, res) => {
  try {
    const players = await prisma.player.findMany({
      take: 50,
      orderBy: [
        { level: "desc" },
        { xp: "desc" },
        { coins: "desc" },
      ],
      include: {
        user: { select: { username: true } },
      },
    });

    const totalPlayers = await prisma.player.count();

    const leaderboard = players.map((p, i) => ({
      rank: i + 1,
      username: p.user.username,
      level: p.level,
      xp: p.xp,
      coins: p.coins,
    }));

    res.json({ leaderboard, totalPlayers });
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

router.post("/daily-reward", requireAuth, async (req, res) => {
  try {
    const now = new Date();
    const lastReward = req.player.lastDailyReward;

    if (lastReward) {
      const hoursSince = (now - lastReward) / (1000 * 60 * 60);
      if (hoursSince < 20) {
        const hoursLeft = Math.ceil(20 - hoursSince);
        return res.status(400).json({
          error: `Daily reward available in ${hoursLeft}h ${Math.floor((hoursSince % 1) * 60)}m`,
          nextRewardIn: hoursLeft,
        });
      }
    }

    let streak = req.player.dailyStreak;
    if (lastReward) {
      const hoursSince = (now - lastReward) / (1000 * 60 * 60);
      if (hoursSince <= 48) {
        streak += 1;
      } else {
        streak = 1;
      }
    } else {
      streak = 1;
    }

    const baseReward = 50 + req.player.level * 10;
    const streakBonus = Math.min(streak - 1, 7) * 15;
    const totalReward = baseReward + streakBonus;
    const xpGained = 20 + streak;

    const levelResult = calculateLevelUp(req.player.level, req.player.xp, xpGained);

    const player = await prisma.player.update({
      where: { id: req.player.id },
      data: {
        coins: { increment: totalReward + levelResult.coinBonus },
        lastDailyReward: now,
        dailyStreak: streak,
        level: levelResult.level,
        xp: levelResult.xp,
      },
    });

    res.json({
      message: `Daily reward: ${totalReward} coins!`,
      coins: player.coins,
      reward: totalReward,
      streak,
      streakBonus,
      xpGained,
      levelUp: levelResult.levelsGained > 0,
      newLevel: levelResult.level,
      coinBonus: levelResult.coinBonus,
    });
  } catch (err) {
    console.error("Daily reward error:", err);
    res.status(500).json({ error: "Failed to claim daily reward" });
  }
});

module.exports = router;
