const express = require("express");
const prisma = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/profile", requireAuth, async (req, res) => {
  try {
    const player = await prisma.player.findUnique({
      where: { id: req.player.id },
      include: {
        inventory: {
          include: { item: true },
        },
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

    const leaderboard = players.map((p, i) => ({
      rank: i + 1,
      username: p.user.username,
      level: p.level,
      xp: p.xp,
      coins: p.coins,
    }));

    res.json({ leaderboard });
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
          error: `Daily reward available in ${hoursLeft} hour(s)`,
          nextRewardIn: hoursLeft,
        });
      }
    }

    const reward = 50 + (req.player.level * 10);

    const player = await prisma.player.update({
      where: { id: req.player.id },
      data: {
        coins: { increment: reward },
        lastDailyReward: now,
      },
    });

    res.json({
      message: `You received ${reward} coins!`,
      coins: player.coins,
      reward,
    });
  } catch (err) {
    console.error("Daily reward error:", err);
    res.status(500).json({ error: "Failed to claim daily reward" });
  }
});

module.exports = router;
