import { useState } from 'react';

interface GeneratorPanelProps {
  onGenerate: () => void;
  vault: any;
}

export default function GeneratorPanel({ onGenerate, vault }: GeneratorPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const handleGenerate = () => {
    if (cooldown > 0 || isGenerating) return;
    
    setIsGenerating(true);
    onGenerate();
    
    // Simulate cooldown
    setCooldown(3);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsGenerating(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const canGenerate = vault && vault.currentStorage < vault.storageCapacity && cooldown === 0;

  return (
    <div className="panel generator-panel">
      <h2>Generator</h2>
      
      <div className="generator-status">
        <div className="status-item">
          <span className="status-label">Generator Level</span>
          <span className="status-value">{vault?.generatorLevel || 1}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Storage</span>
          <span className="status-value">
            {vault?.currentStorage || 0} / {vault?.storageCapacity || 20}
          </span>
        </div>
      </div>

      <div className="generator-display">
        <div className={`generator-core ${isGenerating ? 'active' : ''}`}>
          {isGenerating ? 'GENERATING...' : 'READY'}
        </div>
      </div>

      <button
        onClick={handleGenerate}
        disabled={!canGenerate || isGenerating}
        className="generate-button"
      >
        {isGenerating ? 'Generating...' : cooldown > 0 ? `Cooldown: ${cooldown}s` : 'Generate Item'}
      </button>

      {!canGenerate && vault?.currentStorage >= vault?.storageCapacity && (
        <p className="warning">Storage full! Sell items or upgrade storage.</p>
      )}

      <div className="generator-info">
        <h3>Rarity Chances</h3>
        <ul className="rarity-list">
          <li className="rarity common">Common: 50%</li>
          <li className="rarity uncommon">Uncommon: 30%</li>
          <li className="rarity rare">Rare: 12%</li>
          <li className="rarity epic">Epic: 5%</li>
          <li className="rarity legendary">Legendary: 2%</li>
          <li className="rarity mythic">Mythic: 0.8%</li>
          <li className="rarity divine">Divine: 0.15%</li>
          <li className="rarity celestial">Celestial: 0.04%</li>
          <li className="rarity eternal">Eternal: 0.01%</li>
          <li className="rarity omniversal">Omniversal: 0.001%</li>
        </ul>
      </div>
    </div>
  );
}
