const express = require("express");
const prisma = require("../db");
const { requireAuth } = require("../middleware/auth");
const { calculateLevelUp, rollMysteryBox } = require("../services/game");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const listings = await prisma.shopListing.findMany({
      where: { active: true, stock: { not: 0 } },
      include: { item: true },
      orderBy: { item: { rarity: "asc" } },
    });
    res.json({ listings });
  } catch (err) {
    console.error("Shop list error:", err);
    res.status(500).json({ error: "Failed to fetch shop" });
  }
});

router.post("/buy", requireAuth, async (req, res) => {
  try {
    const { listingId, quantity = 1 } = req.body;

    if (!listingId || quantity < 1 || quantity > 99) {
      return res.status(400).json({ error: "Invalid listing or quantity (1-99)" });
    }

    const listing = await prisma.shopListing.findUnique({
      where: { id: listingId },
      include: { item: true },
    });

    if (!listing || !listing.active) {
      return res.status(404).json({ error: "Listing not found" });
    }

    if (listing.stock !== -1 && listing.stock < quantity) {
      return res.status(400).json({ error: "Not enough stock" });
    }

    const totalCost = listing.price * quantity;

    if (req.player.coins < totalCost) {
      return res.status(400).json({ error: "Not enough coins", required: totalCost, current: req.player.coins });
    }

    const xpGained = quantity * 5;

    const result = await prisma.$transaction(async (tx) => {
      const levelResult = calculateLevelUp(req.player.level, req.player.xp, xpGained);

      await tx.player.update({
        where: { id: req.player.id },
        data: {
          coins: { decrement: totalCost },
          level: levelResult.level,
          xp: levelResult.xp,
          ...(levelResult.coinBonus > 0 ? { coins: { increment: levelResult.coinBonus } } : {}),
        },
      });

      if (listing.stock !== -1) {
        await tx.shopListing.update({
          where: { id: listingId },
          data: { stock: { decrement: quantity } },
        });
      }

      const inventory = await tx.inventory.upsert({
        where: {
          playerId_itemId: { playerId: req.player.id, itemId: listing.itemId },
        },
        update: { quantity: { increment: quantity } },
        create: {
          playerId: req.player.id,
          itemId: listing.itemId,
          quantity,
        },
      });

      const updatedPlayer = await tx.player.findUnique({
        where: { id: req.player.id },
      });

      return { inventory, player: updatedPlayer, levelResult };
    });

    res.json({
      message: `Bought ${quantity}x ${listing.item.name} for ${totalCost} coins`,
      inventory: result.inventory,
      coins: result.player.coins,
      xpGained,
      levelUp: result.levelResult.levelsGained > 0,
      newLevel: result.levelResult.level,
      coinBonus: result.levelResult.coinBonus,
    });
  } catch (err) {
    console.error("Buy error:", err);
    res.status(500).json({ error: "Purchase failed" });
  }
});

router.post("/sell", requireAuth, async (req, res) => {
  try {
    const { inventoryId, quantity = 1 } = req.body;

    if (!inventoryId || quantity < 1) {
      return res.status(400).json({ error: "Invalid inventory item or quantity" });
    }

    const inventoryItem = await prisma.inventory.findUnique({
      where: { id: inventoryId },
      include: { item: true },
    });

    if (!inventoryItem || inventoryItem.playerId !== req.player.id) {
      return res.status(404).json({ error: "Item not found in your inventory" });
    }

    if (inventoryItem.quantity < quantity) {
      return res.status(400).json({ error: "Not enough items to sell" });
    }

    const sellPrice = Math.floor(inventoryItem.item.basePrice * 0.6);
    const xpGained = quantity * 3;

    const result = await prisma.$transaction(async (tx) => {
      const levelResult = calculateLevelUp(req.player.level, req.player.xp, xpGained);

      if (inventoryItem.quantity === quantity) {
        await tx.inventory.delete({ where: { id: inventoryId } });
      } else {
        await tx.inventory.update({
          where: { id: inventoryId },
          data: { quantity: { decrement: quantity } },
        });
      }

      const updatedPlayer = await tx.player.update({
        where: { id: req.player.id },
        data: {
          coins: { increment: sellPrice * quantity + levelResult.coinBonus },
          level: levelResult.level,
          xp: levelResult.xp,
        },
      });

      return { player: updatedPlayer, levelResult };
    });

    res.json({
      message: `Sold ${quantity}x ${inventoryItem.item.name} for ${sellPrice * quantity} coins`,
      coins: result.player.coins,
      xpGained,
      levelUp: result.levelResult.levelsGained > 0,
      newLevel: result.levelResult.level,
      coinBonus: result.levelResult.coinBonus,
    });
  } catch (err) {
    console.error("Sell error:", err);
    res.status(500).json({ error: "Sale failed" });
  }
});

router.post("/mystery-box", requireAuth, async (req, res) => {
  try {
    const cost = 100;

    if (req.player.coins < cost) {
      return res.status(400).json({ error: "Need 100 coins for a mystery box" });
    }

    const rarity = rollMysteryBox(req.player.level);

    const items = await prisma.item.findMany({
      where: { rarity },
    });

    if (items.length === 0) {
      return res.status(500).json({ error: "No items available for this rarity" });
    }

    const item = items[Math.floor(Math.random() * items.length)];
    const xpGained = rarity === "LEGENDARY" ? 50 : rarity === "EPIC" ? 30 : rarity === "RARE" ? 15 : 5;

    const result = await prisma.$transaction(async (tx) => {
      const levelResult = calculateLevelUp(req.player.level, req.player.xp, xpGained);

      await tx.player.update({
        where: { id: req.player.id },
        data: {
          coins: { decrement: cost },
          level: levelResult.level,
          xp: levelResult.xp,
          ...(levelResult.coinBonus > 0 ? { coins: { increment: levelResult.coinBonus } } : {}),
        },
      });

      const inventory = await tx.inventory.upsert({
        where: {
          playerId_itemId: { playerId: req.player.id, itemId: item.id },
        },
        update: { quantity: { increment: 1 } },
        create: {
          playerId: req.player.id,
          itemId: item.id,
          quantity: 1,
        },
      });

      const updatedPlayer = await tx.player.findUnique({
        where: { id: req.player.id },
      });

      return { inventory, player: updatedPlayer, levelResult };
    });

    res.json({
      message: `You opened a mystery box and found ${item.name}!`,
      item: {
        id: item.id,
        name: item.name,
        rarity: item.rarity,
        type: item.type,
        description: item.description,
      },
      coins: result.player.coins,
      xpGained,
      levelUp: result.levelResult.levelsGained > 0,
      newLevel: result.levelResult.level,
      coinBonus: result.levelResult.coinBonus,
    });
  } catch (err) {
    console.error("Mystery box error:", err);
    res.status(500).json({ error: "Failed to open mystery box" });
  }
});

module.exports = router;
