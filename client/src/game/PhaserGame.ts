import Phaser from 'phaser';

class LobbyScene extends Phaser.Scene {
  private players: Map<string, Phaser.GameObjects.Sprite> = new Map();
  private myPlayer!: Phaser.GameObjects.Sprite;
  private playerX: number = 1000;
  private playerY: number = 750;
  private sendMessage: (message: any) => void;
  private lastMoveTime: number = 0;
  private moveInterval: number = 50; // ms between movement updates
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: any;

  constructor(sendMessage: (message: any) => void) {
    super({ key: 'LobbyScene' });
    this.sendMessage = sendMessage;
  }

  preload() {
    // Create simple colored rectangles as player sprites
    this.load.image('player', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDUxRjY0ODgyQTc1MTFFMjk0RkFBRDRCN0UwQjNDNzYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDUxRjY0ODkyQTc1MTFFMjk0RkFBRDRCN0UwQjNDNzYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpENTFGNjQ4NjJBNzUxMUUyOTRGQUFENEI3RTBCM0M3NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpENTFGNjQ4NzJBNzUxMUUyOTRGQUFENEI3RTBCM0M3NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PuOqS7QAAAA+SURBVHjaYvz//z8DEwMDwwcGBob/DAwMzAxAAEGAAc7gH/07S9qwAAAABJRU5ErkJggg==');
  }

  create() {
    // Create background
    this.add.rectangle(1000, 750, 2000, 1500, 0x1a1a2e);
    
    // Create grid pattern
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x2a2a4e, 0.3);
    
    for (let x = 0; x <= 2000; x += 100) {
      graphics.lineBetween(x, 0, x, 1500);
    }
    for (let y = 0; y <= 1500; y += 100) {
      graphics.lineBetween(0, y, 2000, y);
    }

    // Create central hub
    this.add.circle(1000, 750, 150, 0x4a4a6e);
    this.add.text(1000, 750, 'CENTRAL HUB', {
      fontSize: '24px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Create Warzone entrance
    this.add.rectangle(1000, 100, 200, 80, 0xff4444);
    this.add.text(1000, 100, 'WARZONE', {
      fontSize: '16px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Create Bazaar entrance
    this.add.rectangle(100, 750, 80, 200, 0x44ff44);
    this.add.text(100, 750, 'BAZAAR', {
      fontSize: '16px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // Create player
    this.myPlayer = this.add.sprite(this.playerX, this.playerY, 'player');
    this.myPlayer.setScale(2);
    this.myPlayer.setTint(0x00ff00);

    // Create camera
    this.cameras.main.startFollow(this.myPlayer);
    this.cameras.main.setZoom(1);
    this.cameras.main.setBounds(0, 0, 2000, 1500);

    // Setup controls
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys('W,A,S,D');

    // Listen for player updates from WebSocket
    this.setupWebSocketListeners();
  }

  update() {
    const speed = 5;
    let moved = false;

    if (this.cursors.left.isDown || (this.wasd as any).A.isDown) {
      this.playerX -= speed;
      moved = true;
    }
    if (this.cursors.right.isDown || (this.wasd as any).D.isDown) {
      this.playerX += speed;
      moved = true;
    }
    if (this.cursors.up.isDown || (this.wasd as any).W.isDown) {
      this.playerY -= speed;
      moved = true;
    }
    if (this.cursors.down.isDown || (this.wasd as any).S.isDown) {
      this.playerY += speed;
      moved = true;
    }

    // Clamp position to map bounds
    this.playerX = Phaser.Math.Clamp(this.playerX, 20, 1980);
    this.playerY = Phaser.Math.Clamp(this.playerY, 20, 1480);

    this.myPlayer.setPosition(this.playerX, this.playerY);

    // Send movement update with throttling
    const now = Date.now();
    if (moved && now - this.lastMoveTime > this.moveInterval) {
      this.sendMessage({
        type: 'PLAYER_MOVE',
        data: { x: this.playerX, y: this.playerY },
        timestamp: now,
      });
      this.lastMoveTime = now;
    }
  }

  private setupWebSocketListeners() {
    const ws = (window as any).gameWebSocket;
    if (!ws) return;

    // Use ReconnectingWebSocket's on/off methods
    ws.on('PLAYER_JOIN', (data: any) => this.addOtherPlayer(data));
    ws.on('PLAYER_LEAVE', (data: any) => this.removePlayer(data.id));
    ws.on('PLAYER_UPDATE', (data: any) => {
      if (data.players) {
        data.players.forEach((player: any) => this.addOtherPlayer(player));
      } else {
        this.updatePlayerPosition(data.id, data.x, data.y);
      }
    });
  }

  private addOtherPlayer(playerData: any) {
    if (this.players.has(playerData.id)) return;

    const sprite = this.add.sprite(playerData.x, playerData.y, 'player');
    sprite.setScale(2);
    sprite.setTint(0xff0000);
    this.players.set(playerData.id, sprite);

    // Add name tag
    const text = this.add.text(playerData.x, playerData.y - 30, playerData.username, {
      fontSize: '14px',
      color: '#ffffff',
      backgroundColor: '#000000',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5);

    sprite.setData('nameTag', text);
  }

  private removePlayer(playerId: string) {
    const sprite = this.players.get(playerId);
    if (sprite) {
      const nameTag = sprite.getData('nameTag');
      if (nameTag) nameTag.destroy();
      sprite.destroy();
      this.players.delete(playerId);
    }
  }

  private updatePlayerPosition(playerId: string, x: number, y: number) {
    const sprite = this.players.get(playerId);
    if (sprite) {
      // Simple interpolation could be added here
      sprite.setPosition(x, y);

      const nameTag = sprite.getData('nameTag');
      if (nameTag) {
        nameTag.setPosition(x, y - 30);
      }
    }
  }
}

export default function PhaserGame(_token: string, sendMessage: (message: any) => void): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: '#1a1a2e',
    scene: new LobbyScene(sendMessage),
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  };

  const game = new Phaser.Game(config);
  return game;
}
