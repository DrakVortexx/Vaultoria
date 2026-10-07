import { useEffect, useRef, useState, useCallback } from 'react';
import { useWebSocket } from '../hooks/useWebSocket';
import PhaserGame from '../game/PhaserGame';
import VaultPanel from '../components/VaultPanel';
import InventoryPanel from '../components/InventoryPanel';
import GeneratorPanel from '../components/GeneratorPanel';
import { MessageType, Player } from '@vaultoria/shared';

interface GamePageProps {
  token: string;
  user: any;
  onLogout: () => void;
}

export default function GamePage({ token, user, onLogout }: GamePageProps) {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [vault, setVault] = useState<any>(null);
  const [inventory, setInventory] = useState<any[]>([]);
  const [money, setMoney] = useState(0);
  const [players, setPlayers] = useState<Player[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  const gameRef = useRef<Phaser.Game | null>(null);
  const { sendMessage, isConnected } = useWebSocket(token);

  const loadInventory = useCallback(async () => {
    try {
      const response = await fetch('/api/game/inventory', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.inventory) {
        setInventory(data.inventory);
      }
    } catch (error) {
      console.error('Failed to load inventory:', error);
    }
  }, [token]);

  const loadVault = useCallback(async () => {
    try {
      const response = await fetch('/api/game/vault', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.vault) {
        setVault(data.vault);
      }
    } catch (error) {
      console.error('Failed to load vault:', error);
    }
  }, [token]);

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = PhaserGame(token, sendMessage);
    }

    // Load initial data
    loadInventory();
    loadVault();

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [token, sendMessage, loadInventory, loadVault]);

  useEffect(() => {
    // Setup WebSocket message handler
    const ws = (window as any).gameWebSocket;
    if (ws) {
      ws.on('AUTH_SUCCESS', (data: any) => {
        setVault(data.vault);
        setMoney(data.profile.money);
      });
      ws.on('PLAYER_JOIN', (data: any) => {
        setPlayers((prev) => [...prev, data]);
      });
      ws.on('PLAYER_LEAVE', (data: any) => {
        setPlayers((prev) => prev.filter((p) => p.id !== data.id));
      });
      ws.on('PLAYER_UPDATE', (data: any) => {
        if (data.players) {
          setPlayers(data.players);
        } else {
          setPlayers((prev) =>
            prev.map((p) =>
              p.id === data.id
                ? { ...p, x: data.x, y: data.y }
                : p
            )
          );
        }
      });
      ws.on('GENERATE_RESULT', (data: any) => {
        if (data.success) {
          addNotification(`Generated ${data.item.name}!`, data.item.rarity);
          loadInventory();
        }
      });
      ws.on('SELL_RESULT', (data: any) => {
        if (data.success) {
          addNotification(`Sold ${data.quantity} items for $${data.amount}`, 'COMMON');
          loadInventory();
        }
      });
      ws.on('UPGRADE_RESULT', (data: any) => {
        if (data.success) {
          addNotification(`Upgraded ${data.upgradeType} to level ${data.newLevel}`, 'RARE');
          loadVault();
        }
      });
      ws.on('VAULT_UPDATE', (data: any) => {
        setVault(data);
      });
      ws.on('MONEY_UPDATE', (data: any) => {
        setMoney(data.money);
      });
      ws.on('ERROR', (data: any) => {
        addNotification(data.message, 'COMMON');
      });
    }

    return () => {
      if (ws) {
        ws.off('AUTH_SUCCESS');
        ws.off('PLAYER_JOIN');
        ws.off('PLAYER_LEAVE');
        ws.off('PLAYER_UPDATE');
        ws.off('GENERATE_RESULT');
        ws.off('SELL_RESULT');
        ws.off('UPGRADE_RESULT');
        ws.off('VAULT_UPDATE');
        ws.off('MONEY_UPDATE');
        ws.off('ERROR');
      }
    };
  }, [sendMessage, loadInventory, loadVault]);

  const addNotification = (message: string, rarity: string) => {
    const notification = {
      id: Date.now(),
      message,
      rarity,
      timestamp: new Date(),
    };
    setNotifications((prev) => [notification, ...prev].slice(0, 5));

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    }, 5000);
  };

  const handleGenerate = () => {
    sendMessage({
      type: MessageType.GENERATE_ITEM,
      timestamp: Date.now(),
    });
  };

  const handleSell = (itemId: string, quantity: number) => {
    sendMessage({
      type: MessageType.SELL_ITEM,
      data: { itemId, quantity },
      timestamp: Date.now(),
    });
  };

  const handleUpgrade = (upgradeType: string) => {
    sendMessage({
      type: MessageType.UPGRADE_VAULT,
      data: { upgradeType },
      timestamp: Date.now(),
    });
  };

  return (
    <div className="game-container">
      <div id="phaser-game" />

      <div className="game-ui">
        <div className="top-bar">
          <div className="player-info">
            <span className="username">{user?.username}</span>
            <span className="money">${money.toLocaleString()}</span>
          </div>
          <div className="connection-status">
            <span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`} />
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>

        <div className="main-menu">
          <button
            onClick={() => setActivePanel('vault')}
            className={`menu-button ${activePanel === 'vault' ? 'active' : ''}`}
          >
            Vault
          </button>
          <button
            onClick={() => setActivePanel('inventory')}
            className={`menu-button ${activePanel === 'inventory' ? 'active' : ''}`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActivePanel('generator')}
            className={`menu-button ${activePanel === 'generator' ? 'active' : ''}`}
          >
            Generator
          </button>
          <button
            onClick={() => setActivePanel(null)}
            className={`menu-button ${activePanel === null ? 'active' : ''}`}
          >
            Close
          </button>
        </div>

        {activePanel === 'vault' && vault && (
          <VaultPanel vault={vault} onUpgrade={handleUpgrade} money={money} />
        )}

        {activePanel === 'inventory' && (
          <InventoryPanel inventory={inventory} onSell={handleSell} />
        )}

        {activePanel === 'generator' && (
          <GeneratorPanel onGenerate={handleGenerate} vault={vault} />
        )}

        <div className="notifications">
          {notifications.map((notification) => (
            <div key={notification.id} className={`notification ${notification.rarity.toLowerCase()}`}>
              {notification.message}
            </div>
          ))}
        </div>

        <div className="player-list">
          <h3>Players Online: {players.length + 1}</h3>
          <ul>
            <li className="current-player">{user?.username} (You)</li>
            {players.map((player) => (
              <li key={player.id}>
                {player.username} - Vault Level {player.vaultLevel}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
