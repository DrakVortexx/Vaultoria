// Rarity tiers
export enum Rarity {
  COMMON = 'COMMON',
  UNCOMMON = 'UNCOMMON',
  RARE = 'RARE',
  EPIC = 'EPIC',
  LEGENDARY = 'LEGENDARY',
  MYTHIC = 'MYTHIC',
  DIVINE = 'DIVINE',
  CELESTIAL = 'CELESTIAL',
  ETERNAL = 'ETERNAL',
  OMNIVERSAL = 'OMNIVERSAL'
}

// Item types
export enum ItemType {
  MATERIAL = 'MATERIAL',
  EQUIPMENT = 'EQUIPMENT',
  CURRENCY = 'CURRENCY',
  SPECIAL = 'SPECIAL'
}

// WebSocket message types
export enum MessageType {
  // Authentication
  AUTHENTICATE = 'AUTHENTICATE',
  AUTH_SUCCESS = 'AUTH_SUCCESS',
  AUTH_ERROR = 'AUTH_ERROR',
  
  // Player movement
  PLAYER_MOVE = 'PLAYER_MOVE',
  PLAYER_UPDATE = 'PLAYER_UPDATE',
  PLAYER_JOIN = 'PLAYER_JOIN',
  PLAYER_LEAVE = 'PLAYER_LEAVE',
  
  // Generator
  GENERATE_ITEM = 'GENERATE_ITEM',
  GENERATE_RESULT = 'GENERATE_RESULT',
  
  // Inventory
  INVENTORY_UPDATE = 'INVENTORY_UPDATE',
  SELL_ITEM = 'SELL_ITEM',
  SELL_RESULT = 'SELL_RESULT',
  
  // Vault
  VAULT_UPDATE = 'VAULT_UPDATE',
  UPGRADE_VAULT = 'UPGRADE_VAULT',
  UPGRADE_RESULT = 'UPGRADE_RESULT',
  
  // Money
  MONEY_UPDATE = 'MONEY_UPDATE',
  
  // Market
  MARKET_LISTING = 'MARKET_LISTING',
  MARKET_PURCHASE = 'MARKET_PURCHASE',
  MARKET_UPDATE = 'MARKET_UPDATE',
  
  // Offline production
  OFFLINE_CACHE = 'OFFLINE_CACHE',
  CLAIM_OFFLINE = 'CLAIM_OFFLINE',
  
  // PvP
  PVP_ENTER = 'PVP_ENTER',
  PVP_LEAVE = 'PVP_LEAVE',
  PVP_COMBAT = 'PVP_COMBAT',
  PVP_RESULT = 'PVP_RESULT',
  
  // Notifications
  NOTIFICATION = 'NOTIFICATION',
  
  // Error
  ERROR = 'ERROR'
}

// Player data
export interface Player {
  id: string;
  username: string;
  x: number;
  y: number;
  vaultLevel: number;
  ascension: number;
  avatar?: string;
}

// Item data
export interface Item {
  id: string;
  type: ItemType;
  name: string;
  rarity: Rarity;
  baseValue: number;
  description: string;
  stackSize: number;
  tradable: boolean;
  sellable: boolean;
  createdAt: Date;
}

// Inventory item
export interface InventoryItem {
  item: Item;
  quantity: number;
}

// Vault data
export interface Vault {
  id: string;
  playerId: string;
  level: number;
  ascension: number;
  generatorLevel: number;
  storageLevel: number;
  securityLevel: number;
  storageCapacity: number;
  currentStorage: number;
  value: number;
}

// Generator result
export interface GenerateResult {
  item: Item;
  success: boolean;
}

// WebSocket message base
export interface WSMessage {
  type: MessageType;
  data?: any;
  timestamp: number;
}

// Position
export interface Position {
  x: number;
  y: number;
}

// Transaction type
export enum TransactionType {
  GENERATE = 'GENERATE',
  SELL = 'SELL',
  BUY = 'BUY',
  CRAFT = 'CRAFT',
  UPGRADE = 'UPGRADE',
  PVP_REWARD = 'PVP_REWARD',
  BREACH_LOSS = 'BREACH_LOSS',
  OFFLINE_PRODUCTION = 'OFFLINE_PRODUCTION',
  ASCENSION = 'ASCENSION'
}

// Transaction
export interface Transaction {
  id: string;
  playerId: string;
  type: TransactionType;
  amount: number;
  reason: string;
  itemId?: string;
  relatedPlayerId?: string;
  timestamp: Date;
}

// Validation errors
export interface ValidationError {
  field: string;
  message: string;
}
