import { Rarity } from '@vaultoria/shared';

interface InventoryPanelProps {
  inventory: any[];
  onSell: (itemId: string, quantity: number) => void;
}

export default function InventoryPanel({ inventory, onSell }: InventoryPanelProps) {
  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      [Rarity.COMMON]: '#9e9e9e',
      [Rarity.UNCOMMON]: '#4caf50',
      [Rarity.RARE]: '#2196f3',
      [Rarity.EPIC]: '#9c27b0',
      [Rarity.LEGENDARY]: '#ff9800',
      [Rarity.MYTHIC]: '#e91e63',
      [Rarity.DIVINE]: '#00bcd4',
      [Rarity.CELESTIAL]: '#673ab7',
      [Rarity.ETERNAL]: '#ffeb3b',
      [Rarity.OMNIVERSAL]: '#f44336',
    };
    return colors[rarity] || '#9e9e9e';
  };

  const getRarityGlow = (rarity: string) => {
    const glows: Record<string, string> = {
      [Rarity.LEGENDARY]: '0 0 10px #ff9800',
      [Rarity.MYTHIC]: '0 0 15px #e91e63',
      [Rarity.DIVINE]: '0 0 20px #00bcd4',
      [Rarity.CELESTIAL]: '0 0 25px #673ab7',
      [Rarity.ETERNAL]: '0 0 30px #ffeb3b',
      [Rarity.OMNIVERSAL]: '0 0 35px #f44336',
    };
    return glows[rarity] || 'none';
  };

  return (
    <div className="panel inventory-panel">
      <h2>Inventory</h2>
      
      {inventory.length === 0 ? (
        <p className="empty-message">Your inventory is empty. Generate items to fill it!</p>
      ) : (
        <div className="inventory-grid">
          {inventory.map((item) => (
            <div
              key={item.id}
              className="inventory-item"
              style={{
                borderColor: getRarityColor(item.rarity),
                boxShadow: getRarityGlow(item.rarity),
              }}
            >
              <div className="item-header">
                <span className="item-name">{item.itemName}</span>
                <span className="item-rarity" style={{ color: getRarityColor(item.rarity) }}>
                  {item.rarity}
                </span>
              </div>
              <div className="item-details">
                <p className="item-description">{item.description}</p>
                <p className="item-value">Value: ${item.baseValue.toLocaleString()}</p>
                <p className="item-quantity">Quantity: {item.quantity}</p>
              </div>
              {item.sellable && (
                <button
                  onClick={() => onSell(item.itemId, 1)}
                  className="sell-button"
                >
                  Sell 1 (${item.baseValue.toLocaleString()})
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
