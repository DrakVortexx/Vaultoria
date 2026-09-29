const socket = io();

let currentPlayer = null;
let playerData = null;

const rarityPrices = {
  junk: 0.10,
  common: 0.50,
  rare: 5.00,
  epic: 25.00,
  legendary: 100.00
};

function showNotification(message, type = 'success') {
  const panel = document.getElementById('notification-panel');
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  panel.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

function updatePlayerDisplay() {
  if (!playerData) return;
  
  document.getElementById('player-status').textContent = `CONNECTED: ${playerData.username}`;
  document.getElementById('cash-display').textContent = `CASH: $${playerData.cash.toFixed(2)}`;
  document.getElementById('clicker-level').textContent = playerData.clicker_level;
  document.getElementById('generator-level').textContent = playerData.generator_level;
  document.getElementById('protection-level').textContent = playerData.protection_level;
  
  const generatorStatus = document.getElementById('generator-status');
  const breachWarning = document.getElementById('breach-warning');
  
  if (playerData.generator_active) {
    generatorStatus.textContent = 'ACTIVE';
    generatorStatus.style.color = '#00ff00';
  } else {
    generatorStatus.textContent = 'INACTIVE';
    generatorStatus.style.color = '#666';
  }
  
  if (playerData.cash >= 100) {
    breachWarning.classList.remove('hidden');
  } else {
    breachWarning.classList.add('hidden');
  }
}

async function loadPlayerData() {
  try {
    const response = await fetch(`/api/player/${playerData.id}`);
    const data = await response.json();
    playerData = data;
    updatePlayerDisplay();
  } catch (error) {
    console.error('Error loading player data:', error);
  }
}

async function loadInventory() {
  try {
    const response = await fetch(`/api/inventory/${playerData.id}`);
    const items = await response.json();
    renderInventory(items);
  } catch (error) {
    console.error('Error loading inventory:', error);
  }
}

function renderInventory(items) {
  const table = document.getElementById('inventory-table');
  table.innerHTML = '';
  
  items.forEach(item => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.item_name}</td>
      <td class="rarity-${item.item_rarity}">${item.item_rarity.toUpperCase()}</td>
      <td>${item.quantity}</td>
      <td>
        <button class="action-btn" onclick="quickSell(${item.id}, ${item.quantity}, '${item.item_rarity}')">
          SELL ($${(rarityPrices[item.item_rarity] * item.quantity).toFixed(2)})
        </button>
      </td>
      <td>
        <input type="number" class="list-price-input" id="price-${item.id}" value="1.00" step="0.01" min="0.01">
        <button class="action-btn" onclick="listOnBazaar(${item.id}, ${item.quantity}, '${item.item_name}', '${item.item_rarity}')">
          LIST
        </button>
      </td>
    `;
    table.appendChild(row);
  });
}

async function quickSell(itemId, quantity, rarity) {
  try {
    const response = await fetch('/api/sell', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_id: playerData.id,
        item_id: itemId,
        quantity: quantity
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showNotification(`Sold for $${(rarityPrices[rarity] * quantity).toFixed(2)}`);
      await loadPlayerData();
      await loadInventory();
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Error selling item:', error);
    showNotification('Error selling item', 'error');
  }
}

async function listOnBazaar(itemId, quantity, itemName, rarity) {
  const priceInput = document.getElementById(`price-${itemId}`);
  const price = parseFloat(priceInput.value);
  
  if (isNaN(price) || price <= 0) {
    showNotification('Invalid price', 'error');
    return;
  }
  
  try {
    const response = await fetch('/api/bazaar/list', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_id: playerData.id,
        item_id: itemId,
        quantity: quantity,
        price: price
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showNotification(`Listed ${quantity}x ${itemName} for $${price.toFixed(2)} each`);
      await loadPlayerData();
      await loadInventory();
      await loadBazaar();
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Error listing item:', error);
    showNotification('Error listing item', 'error');
  }
}

async function loadBazaar() {
  try {
    const response = await fetch('/api/bazaar');
    const listings = await response.json();
    renderBazaar(listings);
  } catch (error) {
    console.error('Error loading bazaar:', error);
  }
}

function renderBazaar(listings) {
  const table = document.getElementById('bazaar-table');
  table.innerHTML = '';
  
  listings.forEach(listing => {
    const row = document.createElement('tr');
    const isOwnListing = listing.player_id === playerData.id;
    
    row.innerHTML = `
      <td>${listing.username}</td>
      <td>${listing.item_name}</td>
      <td class="rarity-${listing.item_rarity}">${listing.item_rarity.toUpperCase()}</td>
      <td>${listing.quantity}</td>
      <td>$${listing.price.toFixed(2)}</td>
      <td>
        ${isOwnListing ? 
          '<span style="color: #666;">OWN_LISTING</span>' : 
          `<button class="action-btn" onclick="buyFromBazaar(${listing.id}, ${listing.quantity}, ${listing.price})">BUY</button>`
        }
      </td>
    `;
    table.appendChild(row);
  });
}

async function buyFromBazaar(listingId, quantity, price) {
  const totalCost = price * quantity;
  
  if (playerData.cash < totalCost) {
    showNotification('Not enough cash', 'error');
    return;
  }
  
  try {
    const response = await fetch('/api/bazaar/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_id: playerData.id,
        listing_id: listingId,
        quantity: quantity
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showNotification(`Purchased items for $${totalCost.toFixed(2)}`);
      await loadPlayerData();
      await loadInventory();
      await loadBazaar();
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Error buying from bazaar:', error);
    showNotification('Error buying item', 'error');
  }
}

async function loadUpgrades() {
  try {
    const response = await fetch('/api/upgrades');
    const upgrades = await response.json();
    renderUpgrades(upgrades);
  } catch (error) {
    console.error('Error loading upgrades:', error);
  }
}

function renderUpgrades(upgrades) {
  const clickerSection = document.getElementById('clicker-upgrades');
  const generatorSection = document.getElementById('generator-upgrades');
  const protectionSection = document.getElementById('protection-upgrades');
  
  clickerSection.innerHTML = '';
  generatorSection.innerHTML = '';
  protectionSection.innerHTML = '';
  
  upgrades.forEach(upgrade => {
    const item = document.createElement('div');
    item.className = 'upgrade-item';
    
    const isOwned = upgrade.level <= (upgrade.upgrade_type === 'clicker' ? playerData.clicker_level :
                                       upgrade.upgrade_type === 'generator' ? playerData.generator_level :
                                       playerData.protection_level);
    
    const canAfford = playerData.cash >= upgrade.cost;
    
    item.innerHTML = `
      <div class="upgrade-info">
        <div class="upgrade-name">${upgrade.upgrade_type.toUpperCase()} LEVEL ${upgrade.level}</div>
        <div class="upgrade-cost">$${upgrade.cost.toFixed(2)}</div>
        <div class="upgrade-description">${upgrade.description}</div>
      </div>
      <button class="action-btn" 
              ${isOwned ? 'disabled' : ''} 
              ${!canAfford ? 'disabled' : ''}
              onclick="purchaseUpgrade('${upgrade.upgrade_type}', ${upgrade.level})">
        ${isOwned ? 'OWNED' : canAfford ? 'PURCHASE' : 'INSUFFICIENT_FUNDS'}
      </button>
    `;
    
    if (upgrade.upgrade_type === 'clicker') {
      clickerSection.appendChild(item);
    } else if (upgrade.upgrade_type === 'generator') {
      generatorSection.appendChild(item);
    } else if (upgrade.upgrade_type === 'protection') {
      protectionSection.appendChild(item);
    }
  });
}

async function purchaseUpgrade(upgradeType, level) {
  try {
    const response = await fetch('/api/upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player_id: playerData.id,
        upgrade_type: upgradeType,
        level: level
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showNotification(`Purchased ${upgradeType} level ${level}`);
      playerData = result.player;
      updatePlayerDisplay();
      await loadUpgrades();
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Error purchasing upgrade:', error);
    showNotification('Error purchasing upgrade', 'error');
  }
}

async function loadBreachTools() {
  try {
    const response = await fetch('/api/breach-tools');
    const tools = await response.json();
    renderBreachTools(tools);
  } catch (error) {
    console.error('Error loading breach tools:', error);
  }
}

function renderBreachTools(tools) {
  const section = document.getElementById('breach-tools');
  section.innerHTML = '';
  
  tools.forEach(tool => {
    const item = document.createElement('div');
    item.className = 'tool-item';
    
    const canAfford = playerData.cash >= tool.price;
    
    item.innerHTML = `
      <div class="tool-info">
        <div class="tool-name">${tool.name} (Level ${tool.level})</div>
        <div class="tool-cost">$${tool.price.toFixed(2)}</div>
        <div class="upgrade-description">Success Rate: ${tool.success_rate}%</div>
      </div>
      <button class="action-btn" 
              ${!canAfford ? 'disabled' : ''}
              onclick="executeBreach(${tool.level})">
        ${canAfford ? 'USE_TOOL' : 'INSUFFICIENT_FUNDS'}
      </button>
    `;
    section.appendChild(item);
  });
}

async function loadTargets() {
  try {
    const response = await fetch('/api/players');
    const players = await response.json();
    const select = document.getElementById('target-select');
    
    select.innerHTML = '<option value="">Select target...</option>';
    
    players.forEach(player => {
      if (player.id !== playerData.id) {
        const option = document.createElement('option');
        option.value = player.id;
        option.textContent = `${player.username} ($${player.cash.toFixed(2)}) - Protection: ${player.protection_level}`;
        select.appendChild(option);
      }
    });
  } catch (error) {
    console.error('Error loading targets:', error);
  }
}

async function executeBreach(toolLevel) {
  const targetSelect = document.getElementById('target-select');
  const targetId = parseInt(targetSelect.value);
  
  if (!targetId) {
    showNotification('Please select a target', 'error');
    return;
  }
  
  try {
    const response = await fetch('/api/breach', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        attacker_id: playerData.id,
        target_id: targetId,
        tool_level: toolLevel
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showNotification(result.message, 'success');
    } else {
      showNotification(result.message, 'error');
    }
    
    await loadPlayerData();
    await loadTargets();
    await loadBreachTools();
  } catch (error) {
    console.error('Error executing breach:', error);
    showNotification('Error executing breach', 'error');
  }
}

async function loadLeaderboard() {
  try {
    const response = await fetch('/api/leaderboard');
    const players = await response.json();
    renderLeaderboard(players);
  } catch (error) {
    console.error('Error loading leaderboard:', error);
  }
}

function renderLeaderboard(players) {
  const table = document.getElementById('leaderboard-table');
  table.innerHTML = '';
  
  players.forEach((player, index) => {
    const row = document.createElement('tr');
    const isCurrentPlayer = player.id === playerData.id;
    
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${player.username} ${isCurrentPlayer ? '(YOU)' : ''}</td>
      <td>$${player.cash.toFixed(2)}</td>
      <td>${player.protection_level}</td>
    `;
    
    if (isCurrentPlayer) {
      row.style.background = 'rgba(0, 255, 0, 0.2)';
    }
    
    table.appendChild(row);
  });
}

async function handleLogin() {
  const usernameInput = document.getElementById('username-input');
  const passwordInput = document.getElementById('password-input');
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!username || !password) {
    showNotification('Please enter username and password', 'error');
    return;
  }
  
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      currentPlayer = username;
      playerData = data;
      
      document.getElementById('login-panel').style.display = 'none';
      document.getElementById('main-interface').style.display = 'grid';
      
      socket.emit('join', currentPlayer);
      
      updatePlayerDisplay();
      await loadInventory();
      await loadBazaar();
      await loadUpgrades();
      await loadBreachTools();
      await loadTargets();
      await loadLeaderboard();
      
      showNotification(`Connected as ${username}`);
    } else {
      showNotification(data.error || 'Login failed', 'error');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    showNotification('Error connecting', 'error');
  }
}

async function handleRegister() {
  const usernameInput = document.getElementById('username-input');
  const passwordInput = document.getElementById('password-input');
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  
  if (!username || !password) {
    showNotification('Please enter username and password', 'error');
    return;
  }
  
  if (password.length < 6) {
    showNotification('Password must be at least 6 characters', 'error');
    return;
  }
  
  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      currentPlayer = username;
      playerData = data;
      
      document.getElementById('login-panel').style.display = 'none';
      document.getElementById('main-interface').style.display = 'grid';
      
      socket.emit('join', currentPlayer);
      
      updatePlayerDisplay();
      await loadInventory();
      await loadBazaar();
      await loadUpgrades();
      await loadBreachTools();
      await loadTargets();
      await loadLeaderboard();
      
      showNotification(`Account created for ${username}`);
    } else {
      showNotification(data.error || 'Registration failed', 'error');
    }
  } catch (error) {
    console.error('Error registering:', error);
    showNotification('Error creating account', 'error');
  }
}

async function handleClick() {
  try {
    const response = await fetch('/api/click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player_id: playerData.id })
    });
    
    const result = await response.json();
    
    if (result.success) {
      showNotification(`Found: ${result.item.name} (${result.item.rarity})`);
      await loadInventory();
    }
  } catch (error) {
    console.error('Error clicking:', error);
  }
}

function setupEventListeners() {
  document.getElementById('login-btn').addEventListener('click', handleLogin);
  document.getElementById('register-btn').addEventListener('click', handleRegister);
  document.getElementById('username-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
  document.getElementById('password-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
  
  document.getElementById('click-btn').addEventListener('click', handleClick);
  document.getElementById('breach-btn').addEventListener('click', () => {
    const toolSelect = document.getElementById('breach-tool-select');
    const toolLevel = parseInt(toolSelect.value);
    if (toolLevel) {
      executeBreach(toolLevel);
    } else {
      showNotification('Please select a breach tool', 'error');
    }
  });
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
      
      if (tabId === 'bazaar') loadBazaar();
      if (tabId === 'shop') {
        loadUpgrades();
        loadBreachTools();
        loadTargets();
      }
      if (tabId === 'leaderboard') loadLeaderboard();
    });
  });
  
  socket.on('bazaarUpdate', () => {
    loadBazaar();
  });
  
  socket.on('playerUpdate', (data) => {
    if (data.player_id === playerData.id) {
      loadPlayerData();
    }
  });
  
  socket.on('generatorItem', (data) => {
    const log = document.getElementById('generator-log');
    const entry = document.createElement('div');
    entry.textContent = `[${new Date().toLocaleTimeString()}] Generated: ${data.item.name} (${data.item.rarity})`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
    
    loadInventory();
  });
}

setupEventListeners();
