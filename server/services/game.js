const XP_PER_LEVEL = 100;

function xpForLevel(level) {
  return level * XP_PER_LEVEL;
}

function calculateLevelUp(currentLevel, currentXp, xpGained) {
  let level = currentLevel;
  let xp = currentXp + xpGained;
  let levelsGained = 0;
  let coinBonus = 0;

  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level += 1;
    levelsGained += 1;
    coinBonus += 25 + level * 5;
  }

  return { level, xp, levelsGained, coinBonus };
}

function rollMysteryBox(playerLevel) {
  const roll = Math.random() * 100;
  let rarity;

  if (roll < 2) {
    rarity = "LEGENDARY";
  } else if (roll < 10) {
    rarity = "EPIC";
  } else if (roll < 30) {
    rarity = "RARE";
  } else {
    rarity = "COMMON";
  }

  const levelBonus = Math.floor(playerLevel / 5);
  const adjustedRoll = Math.random() * 100;
  if (adjustedRoll < levelBonus) {
    rarity = rarity === "COMMON" ? "RARE" : rarity === "RARE" ? "EPIC" : "LEGENDARY";
  }

  return rarity;
}

module.exports = { xpForLevel, calculateLevelUp, rollMysteryBox };
