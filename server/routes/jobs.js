const express = require("express");
const prisma = require("../db");
const { requireAuth } = require("../middleware/auth");
const { calculateLevelUp } = require("../services/game");

const router = express.Router();

const JOBS = [
  { id: "blacksmith", name: "Blacksmith", description: "Forge weapons for the realm", levelReq: 1 },
  { id: "herbalist", name: "Herbalist", description: "Gather rare ingredients from the wild", levelReq: 1 },
  { id: "explorer", name: "Explorer", description: "Map ancient ruins and lost temples", levelReq: 5 },
  { id: "merchant", name: "Merchant", description: "Trade goods in the bustling market", levelReq: 10 },
  { id: "enchanter", name: "Enchanter", description: "Imbue items with dormant magic", levelReq: 20 },
  { id: "assassin", name: "Assassin", description: "Complete secret contracts in the shadows", levelReq: 35 },
  { id: "archmage", name: "Archmage", description: "Study forbidden knowledge beyond mortal reach", levelReq: 50 },
  { id: "void_walker", name: "Void Walker", description: "Traverse dimensions and harvest void energy", levelReq: 75 },
];

const XP_PER_SECOND = 0.4;

function coinsPerSecond(level) {
  return Math.floor(level * level / 10 + level);
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const jobs = JOBS.map(function(j) {
      return {
        id: j.id,
        name: j.name,
        description: j.description,
        levelReq: j.levelReq,
        unlocked: req.player.level >= j.levelReq,
      };
    });

    var earnings = null;
    if (req.player.activeJob && req.player.jobStartedAt) {
      var elapsed = Math.floor((Date.now() - req.player.jobStartedAt.getTime()) / 1000);
      var rate = coinsPerSecond(req.player.level);
      var xpEarned = Math.floor(elapsed * XP_PER_SECOND);
      earnings = {
        job: req.player.activeJob,
        elapsed: elapsed,
        coinsEarned: elapsed * rate,
        xpEarned: xpEarned,
        rate: rate,
        xpRate: XP_PER_SECOND,
      };
    }

    res.json({
      jobs: jobs,
      activeJob: req.player.activeJob,
      earnings: earnings,
    });
  } catch (err) {
    console.error("Jobs list error:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

router.post("/start", requireAuth, async (req, res) => {
  try {
    var { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID required" });
    }

    var job = JOBS.find(function(j) { return j.id === jobId; });
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (req.player.level < job.levelReq) {
      return res.status(400).json({ error: "Level " + job.levelReq + " required" });
    }

    if (req.player.activeJob) {
      return res.status(400).json({ error: "Already working. Stop current job first." });
    }

    await prisma.player.update({
      where: { id: req.player.id },
      data: {
        activeJob: jobId,
        jobStartedAt: new Date(),
      },
    });

    res.json({ message: "Started working as " + job.name });
  } catch (err) {
    console.error("Job start error:", err);
    res.status(500).json({ error: "Failed to start job" });
  }
});

router.post("/stop", requireAuth, async (req, res) => {
  try {
    if (!req.player.activeJob) {
      return res.status(400).json({ error: "No active job" });
    }

    var elapsed = 0;
    var coinsEarned = 0;
    var xpEarned = 0;

    if (req.player.jobStartedAt) {
      elapsed = Math.floor((Date.now() - req.player.jobStartedAt.getTime()) / 1000);
      var rate = coinsPerSecond(req.player.level);
      coinsEarned = elapsed * rate;
      xpEarned = Math.floor(elapsed * XP_PER_SECOND);
    }

    var result = await prisma.$transaction(async function(tx) {
      var levelResult = calculateLevelUp(req.player.level, req.player.xp, xpEarned);

      var updated = await tx.player.update({
        where: { id: req.player.id },
        data: {
          activeJob: null,
          jobStartedAt: null,
          coins: { increment: coinsEarned + levelResult.coinBonus },
          level: levelResult.level,
          xp: levelResult.xp,
        },
      });

      return { player: updated, levelResult: levelResult };
    });

    res.json({
      message: "Job complete! Earned $" + coinsEarned.toLocaleString() + " and " + xpEarned + " XP",
      coins: result.player.coins,
      coinsEarned: coinsEarned,
      xpEarned: xpEarned,
      levelUp: result.levelResult.levelsGained > 0,
      newLevel: result.levelResult.level,
      coinBonus: result.levelResult.coinBonus,
    });
  } catch (err) {
    console.error("Job stop error:", err);
    res.status(500).json({ error: "Failed to stop job" });
  }
});

router.post("/collect", requireAuth, async (req, res) => {
  try {
    if (!req.player.activeJob) {
      return res.status(400).json({ error: "No active job" });
    }

    if (!req.player.jobStartedAt) {
      return res.status(400).json({ error: "No start time recorded" });
    }

    var elapsed = Math.floor((Date.now() - req.player.jobStartedAt.getTime()) / 1000);
    if (elapsed < 1) {
      return res.status(400).json({ error: "Nothing to collect yet" });
    }

    var rate = coinsPerSecond(req.player.level);
    var coinsEarned = elapsed * rate;
    var xpEarned = Math.floor(elapsed * XP_PER_SECOND);

    var result = await prisma.$transaction(async function(tx) {
      var levelResult = calculateLevelUp(req.player.level, req.player.xp, xpEarned);

      var updated = await tx.player.update({
        where: { id: req.player.id },
        data: {
          jobStartedAt: new Date(),
          coins: { increment: coinsEarned + levelResult.coinBonus },
          level: levelResult.level,
          xp: levelResult.xp,
        },
      });

      return { player: updated, levelResult: levelResult };
    });

    res.json({
      message: "Collected $" + coinsEarned.toLocaleString() + " and " + xpEarned + " XP",
      coins: result.player.coins,
      coinsEarned: coinsEarned,
      xpEarned: xpEarned,
      levelUp: result.levelResult.levelsGained > 0,
      newLevel: result.levelResult.level,
      coinBonus: result.levelResult.coinBonus,
    });
  } catch (err) {
    console.error("Job collect error:", err);
    res.status(500).json({ error: "Failed to collect earnings" });
  }
});

module.exports = router;
