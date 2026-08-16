const express = require("express");
const prisma = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const inventory = await prisma.inventory.findMany({
      where: { playerId: req.player.id },
      include: { item: true },
      orderBy: { acquiredAt: "desc" },
    });
    res.json({ inventory });
  } catch (err) {
    console.error("Inventory error:", err);
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

router.get("/stats", requireAuth, async (req, res) => {
  try {
    const items = await prisma.inventory.findMany({
      where: { playerId: req.player.id },
      include: { item: true },
    });

    const stats = {
      totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
      uniqueItems: items.length,
      totalValue: items.reduce((sum, i) => sum + i.item.basePrice * i.quantity, 0),
      byRarity: {
        COMMON: 0,
        RARE: 0,
        EPIC: 0,
        LEGENDARY: 0,
      },
    };

    for (const inv of items) {
      stats.byRarity[inv.item.rarity] += inv.quantity;
    }

    res.json({ stats });
  } catch (err) {
    console.error("Inventory stats error:", err);
    res.status(500).json({ error: "Failed to fetch inventory stats" });
  }
});

module.exports = router;
