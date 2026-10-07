import { Rarity } from './types';

// Game configuration - server-side configurable
export const GameConfig = {
  // Starting values
  startingMoney: 1000,
  startingVaultLevel: 1,
  startingGeneratorLevel: 1,
  startingStorageLevel: 1,
  startingSecurityLevel: 1,
  
  // Generator
  generatorCooldown: 3000, // ms
  generatorOdds: {
    [Rarity.COMMON]: 0.50,
    [Rarity.UNCOMMON]: 0.30,
    [Rarity.RARE]: 0.12,
    [Rarity.EPIC]: 0.05,
    [Rarity.LEGENDARY]: 0.02,
    [Rarity.MYTHIC]: 0.008,
    [Rarity.DIVINE]: 0.0015,
    [Rarity.CELESTIAL]: 0.0004,
    [Rarity.ETERNAL]: 0.0001,
    [Rarity.OMNIVERSAL]: 0.00001
  },
  
  // Item values (base multiplier by rarity)
  rarityMultipliers: {
    [Rarity.COMMON]: 1,
    [Rarity.UNCOMMON]: 3,
    [Rarity.RARE]: 10,
    [Rarity.EPIC]: 30,
    [Rarity.LEGENDARY]: 100,
    [Rarity.MYTHIC]: 300,
    [Rarity.DIVINE]: 1000,
    [Rarity.CELESTIAL]: 5000,
    [Rarity.ETERNAL]: 25000,
    [Rarity.OMNIVERSAL]: 100000
  },
  
  // Vault upgrades
  vaultUpgradeCosts: {
    generator: [100, 500, 2000, 10000, 50000, 250000, 1000000, 5000000],
    storage: [50, 250, 1000, 5000, 25000, 125000, 500000, 2500000],
    security: [75, 375, 1500, 7500, 37500, 187500, 750000, 3750000]
  },
  
  // Storage capacity per level
  storageCapacity: [20, 50, 100, 200, 400, 800, 1600, 3200],
  
  // Offline production
  offlineProductionRate: 0.1, // items per minute per generator level
  offlineMaximumHours: 12,
  offlineMultiplier: 0.5, // reduced rate when offline
  
  // Breach
  breachCooldown: 3600000, // 1 hour in ms
  breachLossPercentage: 0.1, // 10% of value
  newPlayerProtectionHours: 24,
  
  // PvP
  pvpLootPercentage: 0.3, // 30% of carried items can be lost
  
  // Market
  marketFeePercentage: 0.05, // 5% fee
  
  // Lobby
  maxLobbySize: 8,
  lobbyWidth: 2000,
  lobbyHeight: 1500
};
