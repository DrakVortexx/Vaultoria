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

module.exports = { xpForLevel, calculateLevelUp };
