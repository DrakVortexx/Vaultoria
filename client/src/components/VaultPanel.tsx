interface VaultPanelProps {
  vault: any;
  onUpgrade: (upgradeType: string) => void;
  money: number;
}

export default function VaultPanel({ vault, onUpgrade, money }: VaultPanelProps) {
  const upgradeCosts = {
    generator: [100, 500, 2000, 10000, 50000, 250000, 1000000, 5000000],
    storage: [50, 250, 1000, 5000, 25000, 125000, 500000, 2500000],
    security: [75, 375, 1500, 7500, 37500, 187500, 750000, 3750000],
  };

  const getUpgradeCost = (type: string, level: number) => {
    const costs = upgradeCosts[type as keyof typeof upgradeCosts];
    if (!costs || level >= costs.length) return null;
    return costs[level];
  };

  const canAfford = (cost: number) => money >= cost;

  return (
    <div className="panel vault-panel">
      <h2>Your Vault</h2>
      
      <div className="vault-stats">
        <div className="stat">
          <span className="stat-label">Level</span>
          <span className="stat-value">{vault.level}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Ascension</span>
          <span className="stat-value">{vault.ascension}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Value</span>
          <span className="stat-value">${vault.value.toLocaleString()}</span>
        </div>
      </div>

      <div className="upgrades">
        <h3>Upgrades</h3>
        
        <div className="upgrade-item">
          <div className="upgrade-info">
            <span className="upgrade-name">Generator</span>
            <span className="upgrade-level">Level {vault.generatorLevel}</span>
          </div>
          <button
            onClick={() => onUpgrade('generator')}
            disabled={
              vault.generatorLevel >= 8 ||
              !canAfford(getUpgradeCost('generator', vault.generatorLevel) || 0)
            }
            className="upgrade-button"
          >
            Upgrade (${(getUpgradeCost('generator', vault.generatorLevel) || 0).toLocaleString()})
          </button>
        </div>

        <div className="upgrade-item">
          <div className="upgrade-info">
            <span className="upgrade-name">Storage</span>
            <span className="upgrade-level">Level {vault.storageLevel}</span>
            <span className="upgrade-detail">{vault.currentStorage} / {vault.storageCapacity}</span>
          </div>
          <button
            onClick={() => onUpgrade('storage')}
            disabled={
              vault.storageLevel >= 8 ||
              !canAfford(getUpgradeCost('storage', vault.storageLevel) || 0)
            }
            className="upgrade-button"
          >
            Upgrade (${(getUpgradeCost('storage', vault.storageLevel) || 0).toLocaleString()})
          </button>
        </div>

        <div className="upgrade-item">
          <div className="upgrade-info">
            <span className="upgrade-name">Security</span>
            <span className="upgrade-level">Level {vault.securityLevel}</span>
          </div>
          <button
            onClick={() => onUpgrade('security')}
            disabled={
              vault.securityLevel >= 8 ||
              !canAfford(getUpgradeCost('security', vault.securityLevel) || 0)
            }
            className="upgrade-button"
          >
            Upgrade (${(getUpgradeCost('security', vault.securityLevel) || 0).toLocaleString()})
          </button>
        </div>
      </div>
    </div>
  );
}
