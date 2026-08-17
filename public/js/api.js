const API = {
  async request(method, url, body = null) {
    const opts = {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
    };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(url, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Request failed");
    return data;
  },

  register(username, password, confirmPassword) {
    return this.request("POST", "/api/auth/register", { username, password, confirmPassword });
  },

  login(login, password) {
    return this.request("POST", "/api/auth/login", { login, password });
  },

  logout() {
    return this.request("POST", "/api/auth/logout");
  },

  me() {
    return this.request("GET", "/api/auth/me");
  },

  getProfile() {
    return this.request("GET", "/api/player/profile");
  },

  getLeaderboard() {
    return this.request("GET", "/api/player/leaderboard");
  },

  claimDaily() {
    return this.request("POST", "/api/player/daily-reward");
  },

  getShop() {
    return this.request("GET", "/api/shop");
  },

  buyItem(listingId, quantity) {
    return this.request("POST", "/api/shop/buy", { listingId, quantity });
  },

  sellItem(inventoryId, quantity) {
    return this.request("POST", "/api/shop/sell", { inventoryId, quantity });
  },

  getInventory() {
    return this.request("GET", "/api/inventory");
  },

  getInventoryStats() {
    return this.request("GET", "/api/inventory/stats");
  },

  createTrade(data) {
    return this.request("POST", "/api/trade/create", data);
  },

  getPendingTrades() {
    return this.request("GET", "/api/trade/pending");
  },

  acceptTrade(tradeId) {
    return this.request("POST", `/api/trade/${tradeId}/accept`);
  },

  declineTrade(tradeId) {
    return this.request("POST", `/api/trade/${tradeId}/decline`);
  },

  cancelTrade(tradeId) {
    return this.request("POST", `/api/trade/${tradeId}/cancel`);
  },

  getAuctionListings() {
    return this.request("GET", "/api/auction");
  },

  listAuction(data) {
    return this.request("POST", "/api/auction/list", data);
  },

  buyAuction(listingId) {
    return this.request("POST", `/api/auction/buy/${listingId}`);
  },

  cancelAuction(listingId) {
    return this.request("POST", `/api/auction/cancel/${listingId}`);
  },
};
