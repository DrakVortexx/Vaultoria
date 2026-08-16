const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const ITEMS = [
  { name: "Wooden Shield", description: "A basic wooden shield. Better than nothing.", rarity: "COMMON", basePrice: 25, type: "ARMOR" },
  { name: "Iron Sword", description: "A sturdy iron sword for beginners.", rarity: "COMMON", basePrice: 30, type: "WEAPON" },
  { name: "Health Potion", description: "Restores a small amount of health.", rarity: "COMMON", basePrice: 15, type: "GENERAL" },
  { name: "Leather Boots", description: "Comfortable boots for long journeys.", rarity: "COMMON", basePrice: 20, type: "ARMOR" },
  { name: "Campfire Kit", description: "Everything you need for a warm night.", rarity: "COMMON", basePrice: 35, type: "GENERAL" },

  { name: "Steel Dagger", description: "A sharp dagger with a leather grip.", rarity: "RARE", basePrice: 80, type: "WEAPON" },
  { name: "Chainmail Armor", description: "Flexible yet protective chainmail.", rarity: "RARE", basePrice: 100, type: "ARMOR" },
  { name: "Mystic Cat", description: "A magical feline companion.", rarity: "RARE", basePrice: 120, type: "PET" },
  { name: "Enchanted Ring", description: "A ring that glows with faint magic.", rarity: "RARE", basePrice: 90, type: "COSMETIC" },
  { name: "Silver Bow", description: "An elegant bow made of silver.", rarity: "RARE", basePrice: 110, type: "WEAPON" },

  { name: "Flame Sword", description: "A blade that burns with eternal fire.", rarity: "EPIC", basePrice: 300, type: "WEAPON" },
  { name: "Dragon Shield", description: "Forged from dragon scales.", rarity: "EPIC", basePrice: 350, type: "ARMOR" },
  { name: "Phoenix Pet", description: "A majestic bird reborn from ashes.", rarity: "EPIC", basePrice: 400, type: "PET" },
  { name: "Shadow Cloak", description: "Grants the wearer near-invisibility.", rarity: "EPIC", basePrice: 320, type: "COSMETIC" },

  { name: "Excalibur", description: "The legendary sword of kings.", rarity: "LEGENDARY", basePrice: 1000, type: "WEAPON" },
  { name: "Aegis of the Gods", description: "Divine armor worn by ancient deities.", rarity: "LEGENDARY", basePrice: 1200, type: "ARMOR" },
  { name: "Celestial Dragon", description: "A dragon from beyond the stars.", rarity: "LEGENDARY", basePrice: 1500, type: "PET" },
  { name: "Crown of Eternity", description: "Grants immortality to the worthy.", rarity: "LEGENDARY", basePrice: 2000, type: "COSMETIC" },
];

const SHOP_MULTIPLIERS = {
  COMMON: 1,
  RARE: 1.2,
  EPIC: 1.5,
  LEGENDARY: 2,
};

async function seed() {
  console.log("Seeding database...");

  await prisma.tradeItem.deleteMany();
  await prisma.trade.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.shopListing.deleteMany();
  await prisma.item.deleteMany();
  await prisma.session.deleteMany();
  await prisma.player.deleteMany();
  await prisma.user.deleteMany();

  for (const itemData of ITEMS) {
    const item = await prisma.item.create({ data: itemData });

    const multiplier = SHOP_MULTIPLIERS[itemData.rarity];
    const shopPrice = Math.floor(itemData.basePrice * multiplier);

    await prisma.shopListing.create({
      data: {
        itemId: item.id,
        price: shopPrice,
        stock: itemData.rarity === "LEGENDARY" ? 3 : itemData.rarity === "EPIC" ? 5 : -1,
      },
    });
  }

  const adminHash = await bcrypt.hash("admin123", 12);
  const adminUser = await prisma.user.create({
    data: {
      username: "admin",
      passwordHash: adminHash,
      player: {
        create: { coins: 5000, level: 10, xp: 500 },
      },
    },
    include: { player: true },
  });

  console.log(`Created admin user: admin / admin123`);
  console.log(`Seeded ${ITEMS.length} items`);
  console.log("Database seeding complete!");
}

seed()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
