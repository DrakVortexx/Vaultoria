const socket = io();

let currentPlayer = null;
let playerData = null;
let authToken = null;

// Password strength validation
function validatePasswordStrength(password) {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const errors = [];

  if (password.length < minLength) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!hasUpperCase) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!hasLowerCase) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!hasNumbers) {
    errors.push('Password must contain at least one number');
  }
  if (!hasSpecialChar) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// API helper with JWT token
async function apiCall(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers
  });

  // Handle 401 Unauthorized - token expired
  if (response.status === 401) {
    showNotification('Session expired. Please login again.', 'error');
    logout();
    return null;
  }

  return response;
}

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
  document.getElementById('level-display').textContent = `LEVEL: ${playerData.level}`;
  document.getElementById('xp-display').textContent = `XP: ${playerData.xp % 100}/100`;
  document.getElementById('clicker-level').textContent = playerData.clicker_level;
  document.getElementById('autoclicker-level').textContent = playerData.autoclicker_level || 0;
  document.getElementById('generator-level').textContent = playerData.generator_level;
  document.getElementById('protection-level').textContent = playerData.protection_level;
  document.getElementById('logout-btn').style.display = 'block';
  document.getElementById('daily-reward-btn').style.display = 'block';

  // Update XP progress bar
  const xpProgress = playerData.xp % 100;
  document.getElementById('xp-fill').style.width = `${xpProgress}%`;
  document.getElementById('xp-text').textContent = `${xpProgress}/100 XP`;

  const generatorStatus = document.getElementById('generator-status');
  const autoclickerStatus = document.getElementById('autoclicker-status');
  const breachWarning = document.getElementById('breach-warning');

  if (playerData.generator_active) {
    generatorStatus.textContent = 'ACTIVE';
    generatorStatus.style.color = '#00ff00';
  } else {
    generatorStatus.textContent = 'INACTIVE';
    generatorStatus.style.color = '#666';
  }

  if (playerData.autoclicker_active) {
    autoclickerStatus.textContent = 'ACTIVE';
    autoclickerStatus.style.color = '#00ff00';
  } else {
    autoclickerStatus.textContent = 'INACTIVE';
    autoclickerStatus.style.color = '#666';
  }

  if (playerData.cash >= 100) {
    breachWarning.classList.remove('hidden');
  } else {
    breachWarning.classList.add('hidden');
  }
}

async function loadPlayerData() {
  try {
    const response = await apiCall(`/api/player/${playerData.id}`);
    if (!response) return;

    const data = await response.json();
    playerData = data;
    updatePlayerDisplay();
  } catch (error) {
    console.error('Error loading player data:', error);
  }
}

async function loadInventory() {
  try {
    const response = await apiCall(`/api/inventory/${playerData.id}`);
    if (!response) return;

    const items = await response.json();
    renderInventory(items);
  } catch (error) {
    console.error('Error loading inventory:', error);
  }
}

function renderInventory(items) {
  const grid = document.getElementById('inventory-grid');
  grid.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'inventory-item';
    card.onclick = () => openListModal(); // Changed to list on bazaar instead of sell

    const value = rarityPrices[item.item_rarity] * item.quantity;

    card.innerHTML = `
      <div class="inventory-item-name">${item.item_name}</div>
      <div class="inventory-item-rarity rarity-${item.item_rarity}">${item.item_rarity.toUpperCase()}</div>
      <div class="inventory-item-quantity">${item.quantity}x</div>
      <div class="inventory-item-value">Est. Value: $${value.toFixed(2)}</div>
      <div class="inventory-item-actions">
        <button class="action-btn">List on Bazaar</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

let currentSellItem = null;

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
  currentSellItem = null;
}

async function openListModal() {
  const select = document.getElementById('list-item-select');
  select.innerHTML = '<option value="">Select item...</option>';

  const inventory = await apiCall(`/api/inventory/${playerData.id}`);
  if (!inventory) return;

  const items = await inventory.json();
  
  items.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = `${item.item_name} (${item.quantity}x)`;
    option.dataset.quantity = item.quantity;
    option.dataset.name = item.item_name;
    option.dataset.rarity = item.item_rarity;
    select.appendChild(option);
  });
  
  document.getElementById('list-amount').value = 1;
  document.getElementById('list-price').value = 1.00;
  document.getElementById('list-modal').style.display = 'block';
}

async function confirmListItem() {
  const select = document.getElementById('list-item-select');
  const itemId = parseInt(select.value);
  const selectedItem = select.options[select.selectedIndex];
  
  if (!itemId) {
    showNotification('Please select an item', 'error');
    return;
  }
  
  const amount = parseInt(document.getElementById('list-amount').value);
  const price = parseFloat(document.getElementById('list-price').value);
  const maxQuantity = parseInt(selectedItem.dataset.quantity);
  
  if (isNaN(amount) || amount < 1 || amount > maxQuantity) {
    showNotification('Invalid amount', 'error');
    return;
  }
  
  if (isNaN(price) || price <= 0) {
    showNotification('Invalid price', 'error');
    return;
  }
  
  try {
    const response = await apiCall('/api/bazaar/list', {
      method: 'POST',
      body: JSON.stringify({
        player_id: playerData.id,
        item_id: itemId,
        quantity: amount,
        price: price
      })
    });

    if (!response) return;
    
    const result = await response.json();
    
    if (result.success) {
      showNotification(`Listed ${amount}x ${selectedItem.dataset.name} for $${price.toFixed(2)} each`);
      closeModal('list-modal');
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

let bazaarListings = [];

async function loadBazaar() {
  try {
    const response = await fetch('/api/bazaar');
    bazaarListings = await response.json();
    renderBazaar(bazaarListings);
  } catch (error) {
    console.error('Error loading bazaar:', error);
  }
}

function renderBazaar(listings) {
  const grid = document.getElementById('bazaar-grid');
  grid.innerHTML = '';
  
  listings.forEach(listing => {
    const card = document.createElement('div');
    card.className = 'bazaar-item';
    const isOwnListing = listing.player_id === playerData.id;
    
    card.innerHTML = `
      <div class="bazaar-item-header">
        <span class="bazaar-item-seller">${listing.username}</span>
        <span class="bazaar-item-rarity rarity-${listing.item_rarity}">${listing.item_rarity.toUpperCase()}</span>
      </div>
      <div class="bazaar-item-name">${listing.item_name}</div>
      <div class="bazaar-item-details">
        <span class="bazaar-item-quantity">${listing.quantity}x</span>
        <span class="bazaar-item-price">$${listing.price.toFixed(2)}</span>
      </div>
      <div class="inventory-item-actions">
        ${isOwnListing ? 
          '<button class="action-btn" disabled>Own Listing</button>' : 
          `<button class="action-btn" onclick="buyFromBazaar(${listing.id}, ${listing.quantity}, ${listing.price})">Buy</button>`
        }
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterBazaar() {
  const searchTerm = document.getElementById('bazaar-search').value.toLowerCase();
  const rarityFilter = document.getElementById('bazaar-rarity-filter').value;
  const sortType = document.getElementById('bazaar-sort').value;

  let filtered = bazaarListings.filter(listing =>
    listing.item_name.toLowerCase().includes(searchTerm) ||
    listing.username.toLowerCase().includes(searchTerm)
  );

  // Apply rarity filter
  if (rarityFilter !== 'all') {
    filtered = filtered.filter(listing => listing.item_rarity === rarityFilter);
  }

  // Apply sorting
  if (sortType === 'cheapest') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortType === 'expensive') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortType === 'quantity') {
    filtered.sort((a, b) => b.quantity - a.quantity);
  } else if (sortType === 'newest') {
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  renderBazaar(filtered);
}

async function buyFromBazaar(listingId, quantity, price) {
  const totalCost = price * quantity;
  
  if (playerData.cash < totalCost) {
    showNotification('Not enough cash', 'error');
    return;
  }
  
  try {
    const response = await apiCall('/api/bazaar/buy', {
      method: 'POST',
      body: JSON.stringify({
        player_id: playerData.id,
        listing_id: listingId,
        quantity: quantity
      })
    });

    if (!response) return;
    
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
  const autoclickerSection = document.getElementById('autoclicker-upgrades');
  const generatorSection = document.getElementById('generator-upgrades');
  const protectionSection = document.getElementById('protection-upgrades');

  clickerSection.innerHTML = '';
  autoclickerSection.innerHTML = '';
  generatorSection.innerHTML = '';
  protectionSection.innerHTML = '';

  upgrades.forEach(upgrade => {
    const item = document.createElement('div');
    item.className = 'upgrade-item';

    const isOwned = upgrade.level <= (upgrade.upgrade_type === 'clicker' ? playerData.clicker_level :
                                       upgrade.upgrade_type === 'autoclicker' ? playerData.autoclicker_level || 0 :
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
    } else if (upgrade.upgrade_type === 'autoclicker') {
      autoclickerSection.appendChild(item);
    } else if (upgrade.upgrade_type === 'generator') {
      generatorSection.appendChild(item);
    } else if (upgrade.upgrade_type === 'protection') {
      protectionSection.appendChild(item);
    }
  });
}

async function purchaseUpgrade(upgradeType, level) {
  try {
    const response = await apiCall('/api/upgrade', {
      method: 'POST',
      body: JSON.stringify({
        player_id: playerData.id,
        upgrade_type: upgradeType,
        level: level
      })
    });

    if (!response) return;

    const result = await response.json();

    if (result.success) {
      showNotification(`Purchased ${upgradeType} level ${level}`, 'success');
      playerData = result.player;
      updatePlayerDisplay();
      animateCashChange(document.getElementById('cash-display'));
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
    const response = await apiCall('/api/breach', {
      method: 'POST',
      body: JSON.stringify({
        attacker_id: playerData.id,
        target_id: targetId,
        tool_level: toolLevel
      })
    });

    if (!response) return;
    
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
      <td>${player.level || 1}</td>
    `;

    if (isCurrentPlayer) {
      row.style.background = 'rgba(0, 255, 0, 0.2)';
    }

    table.appendChild(row);
  });
}

async function loadAchievements() {
  try {
    const response = await apiCall('/api/achievements');
    if (!response) return;

    const achievements = await response.json();
    renderAchievements(achievements);
  } catch (error) {
    console.error('Error loading achievements:', error);
  }
}

function renderAchievements(achievements) {
  const grid = document.getElementById('achievements-grid');
  grid.innerHTML = '';

  achievements.forEach(achievement => {
    const card = document.createElement('div');
    card.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;

    const icon = achievement.unlocked ? '🏆' : '🔒';

    card.innerHTML = `
      <div class="achievement-status">${achievement.unlocked ? 'UNLOCKED' : 'LOCKED'}</div>
      <div class="achievement-icon">${icon}</div>
      <div class="achievement-name">${achievement.name}</div>
      <div class="achievement-description">${achievement.description}</div>
      <div class="achievement-rewards">
        <span>XP: +${achievement.reward_xp}</span>
        <span>Cash: +$${achievement.reward_cash.toFixed(2)}</span>
      </div>
    `;

    grid.appendChild(card);
  });
}

async function claimDailyReward() {
  try {
    const response = await apiCall('/api/daily-reward', {
      method: 'POST'
    });

    if (!response) return;

    const result = await response.json();

    if (result.success) {
      showNotification(result.message, 'success');
      await loadPlayerData();
      await loadAchievements();
    } else {
      showNotification(result.error, 'error');
    }
  } catch (error) {
    console.error('Error claiming daily reward:', error);
    showNotification('Error claiming daily reward', 'error');
  }
}

async function handleLogin() {
  const usernameInput = document.getElementById('username-input');
  const passwordInput = document.getElementById('password-input');
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // Client-side validation
  if (!username || !password) {
    showNotification('Please enter username and password', 'error');
    return;
  }

  if (username.length < 3 || username.length > 20) {
    showNotification('Username must be 3-20 characters', 'error');
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
      authToken = data.token;

      // Store token in localStorage for persistence
      localStorage.setItem('vaultoria_token', authToken);
      localStorage.setItem('vaultoria_player', JSON.stringify(data));

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
      await loadAchievements();

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

  // Client-side validation
  if (!username || !password) {
    showNotification('Please enter username and password', 'error');
    return;
  }

  if (username.length < 3 || username.length > 20) {
    showNotification('Username must be 3-20 characters', 'error');
    return;
  }

  // Password strength validation
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.valid) {
    showNotification(passwordValidation.errors[0], 'error');
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
      authToken = data.token;

      // Store token in localStorage for persistence
      localStorage.setItem('vaultoria_token', authToken);
      localStorage.setItem('vaultoria_player', JSON.stringify(data));

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
      await loadAchievements();

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
  const clickBtn = document.getElementById('click-btn');
  const rect = clickBtn.getBoundingClientRect();

  // Visual feedback
  addClickFeedback(clickBtn);
  createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, '#00d4ff', 8);

  try {
    const response = await apiCall('/api/click', {
      method: 'POST',
      body: JSON.stringify({ player_id: playerData.id })
    });

    if (!response) return;

    const result = await response.json();

    if (result.success) {
      // Color based on rarity
      const rarityColors = {
        junk: '#6b7280',
        common: '#4ade80',
        rare: '#00d4ff',
        epic: '#a855f7',
        legendary: '#fbbf24'
      };

      const color = rarityColors[result.item.rarity] || '#00d4ff';

      createFloatingText(
        rect.left + rect.width / 2,
        rect.top,
        `+${result.xpGained} XP`,
        color
      );

      showNotification(`Found: ${result.item.name} (${result.item.rarity}) +${result.xpGained} XP`);

      if (result.levelUp) {
        showLevelUpOverlay(result.newLevel);
        showNotification(`🎉 LEVEL UP! You are now level ${result.newLevel}!`, 'success');
      }

      await loadInventory();
      await loadPlayerData();
    }
  } catch (error) {
    console.error('Error clicking:', error);
  }
}

function logout() {
  currentPlayer = null;
  playerData = null;
  authToken = null;

  localStorage.removeItem('vaultoria_token');
  localStorage.removeItem('vaultoria_player');

  document.getElementById('login-panel').style.display = 'flex';
  document.getElementById('main-interface').style.display = 'none';
  document.getElementById('username-input').value = '';
  document.getElementById('password-input').value = '';

  showNotification('Logged out successfully');
}

// Check for existing session on page load
function checkExistingSession() {
  const storedToken = localStorage.getItem('vaultoria_token');
  const storedPlayer = localStorage.getItem('vaultoria_player');

  if (storedToken && storedPlayer) {
    try {
      authToken = storedToken;
      playerData = JSON.parse(storedPlayer);
      currentPlayer = playerData.username;

      document.getElementById('login-panel').style.display = 'none';
      document.getElementById('main-interface').style.display = 'grid';

      socket.emit('join', currentPlayer);

      updatePlayerDisplay();
      loadInventory();
      loadBazaar();
      loadUpgrades();
      loadBreachTools();
      loadTargets();
      loadLeaderboard();

      showNotification(`Welcome back, ${currentPlayer}!`);
    } catch (error) {
      console.error('Error restoring session:', error);
      logout();
    }
  }
}

function setupEventListeners() {
  document.getElementById('login-btn').addEventListener('click', handleLogin);
  document.getElementById('register-btn').addEventListener('click', handleRegister);
  document.getElementById('logout-btn').addEventListener('click', logout);
  document.getElementById('daily-reward-btn').addEventListener('click', claimDailyReward);
  document.getElementById('username-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });
  document.getElementById('password-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  // Bazaar filtering
  document.getElementById('bazaar-search').addEventListener('input', filterBazaar);
  document.getElementById('bazaar-rarity-filter').addEventListener('change', filterBazaar);
  document.getElementById('bazaar-sort').addEventListener('change', filterBazaar);
  
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
      if (tabId === 'achievements') loadAchievements();
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

  socket.on('autoclickerItem', (data) => {
    const log = document.getElementById('autoclicker-log');
    const entry = document.createElement('div');
    entry.textContent = `[${new Date().toLocaleTimeString()}] Auto-clicked: ${data.item.name} (${data.item.rarity}) +${data.xpGained} XP`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;

    if (data.levelUp) {
      showNotification(`🎉 LEVEL UP! You are now level ${data.newLevel}!`, 'success');
    }

    loadInventory();
    loadPlayerData();
  });

  socket.on('achievementUnlocked', (data) => {
    showNotification(`🏆 Achievement Unlocked: ${data.name}! +${data.reward_xp} XP +$${data.reward_cash.toFixed(2)}`, 'success');
    loadAchievements();
    loadPlayerData();
  });
}

// Visual Effects Functions
function createParticles(x, y, color, count = 10) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.width = Math.random() * 10 + 5 + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = color;
    particle.style.animationDuration = Math.random() * 1 + 0.5 + 's';

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 100 + 50;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    particle.style.transform = `translate(${vx}px, ${vy}px)`;

    document.body.appendChild(particle);

    setTimeout(() => particle.remove(), 1500);
  }
}

function createFloatingText(x, y, text, color) {
  const floatingText = document.createElement('div');
  floatingText.className = 'floating-text';
  floatingText.textContent = text;
  floatingText.style.left = x + 'px';
  floatingText.style.top = y + 'px';
  floatingText.style.color = color;
  floatingText.style.fontSize = '1.5em';

  document.body.appendChild(floatingText);

  setTimeout(() => floatingText.remove(), 1500);
}

function screenShake() {
  document.body.classList.add('screen-shake');
  setTimeout(() => document.body.classList.remove('screen-shake'), 500);
}

function animateValue(element, start, end, duration) {
  const startTime = performance.now();
  const diff = end - start;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

    const current = Math.floor(start + diff * easeProgress);
    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function showLevelUpOverlay(newLevel) {
  const overlay = document.createElement('div');
  overlay.className = 'level-up-overlay';
  overlay.innerHTML = `
    <div class="level-up-content">
      <div class="level-up-text">LEVEL UP!</div>
      <div style="font-size: 2em; color: #e0e0e0; margin-top: 20px;">Level ${newLevel}</div>
    </div>
  `;

  document.body.appendChild(overlay);

  screenShake();
  createParticles(window.innerWidth / 2, window.innerHeight / 2, '#fbbf24', 30);

  setTimeout(() => overlay.remove(), 2000);
}

function showAchievementPopup(achievement) {
  const popup = document.createElement('div');
  popup.className = 'achievement-popup';
  popup.innerHTML = `
    <div class="achievement-icon-large">🏆</div>
    <div style="font-size: 2em; color: #fbbf24; margin: 20px 0;">${achievement.name}</div>
    <div style="font-size: 1.2em; color: #e0e0e0;">${achievement.description}</div>
    <div style="margin-top: 20px; color: #4ade80;">+${achievement.reward_xp} XP +$${achievement.reward_cash.toFixed(2)}</div>
  `;

  document.body.appendChild(popup);

  screenShake();
  createParticles(window.innerWidth / 2, window.innerHeight / 2, '#fbbf24', 20);

  setTimeout(() => popup.remove(), 3000);
}

function addClickFeedback(element) {
  const rect = element.getBoundingClientRect();
  const ripple = document.createElement('div');
  ripple.className = 'click-feedback';
  ripple.style.left = rect.left + rect.width / 2 - 50 + 'px';
  ripple.style.top = rect.top + rect.height / 2 - 50 + 'px';

  document.body.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
}

function animateCashChange(element) {
  element.classList.add('cash-animate');
  setTimeout(() => element.classList.remove('cash-animate'), 300);
}

// Initialize app
checkExistingSession();
setupEventListeners();
