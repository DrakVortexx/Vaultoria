const App = {
  user: null,
  player: null,

  async init() {
    Auth.init();
    try {
      const data = await API.me();
      this.user = data.user;
      this.player = data.player;
      this.loadGame();
    } catch {
      UI.showAuth();
    }
  },

  async loadGame() {
    try {
      const me = await API.me();
      this.user = me.user;
      this.player = me.player;
    } catch {
      UI.showAuth();
      return;
    }

    UI.showGame();
    this.updateHeader();
    UI.showTab("dashboard");
    this.loadDashboard();
    this.bindTabs();
  },

  updateHeader() {
    document.getElementById("header-username").textContent = this.user.username;
    document.getElementById("header-coins").textContent = this.player.coins.toLocaleString();
    document.getElementById("header-level").textContent = "Lv." + this.player.level;
  },

  bindTabs() {
    document.querySelectorAll(".tab").forEach(function(btn) {
      btn.addEventListener("click", function() {
        var tab = btn.dataset.tab;
        UI.showTab(tab);
        App.loadTab(tab);
      });
    });

    document.getElementById("logout-btn").addEventListener("click", async function() {
      await API.logout();
      App.user = null;
      App.player = null;
      UI.showAuth();
      UI.toast("Logged out", "info");
    });
  },

  async loadTab(tab) {
    switch (tab) {
      case "dashboard": return this.loadDashboard();
      case "shop": return this.loadShop();
      case "inventory": return this.loadInventory();
      case "trades": return this.loadTrades();
      case "leaderboard": return this.loadLeaderboard();
    }
  },

  async loadDashboard() {
    var content = document.getElementById("dashboard-tab");
    var xpNeeded = this.player.level * 100;
    var xpPct = Math.min((this.player.xp / xpNeeded) * 100, 100);

    content.innerHTML =
      '<div class="dash-grid">' +
        '<div class="card">' +
          '<h3>Your Stats</h3>' +
          '<div class="stat-line"><span>Level</span><span>' + this.player.level + '</span></div>' +
          '<div class="stat-line"><span>XP</span><span>' + this.player.xp + ' / ' + xpNeeded + '</span></div>' +
          '<div class="stat-line"><span>Coins</span><span style="color:var(--yellow)">$ ' + this.player.coins.toLocaleString() + '</span></div>' +
          '<div class="xp-track"><div class="xp-fill" style="width:' + xpPct + '%"></div></div>' +
        '</div>' +
        '<div class="card">' +
          '<h3>Daily Reward</h3>' +
          '<p style="color:var(--muted);font-size:.85rem;margin-bottom:14px">Come back every 20 hours for free coins.</p>' +
          '<button id="daily-btn" class="btn btn-primary">Claim</button>' +
        '</div>' +
        '<div class="card">' +
          '<h3>Quick Links</h3>' +
          '<div style="display:flex;gap:8px;margin-top:4px">' +
            '<button id="goto-shop" class="btn btn-secondary">Shop</button>' +
            '<button id="goto-inv" class="btn btn-secondary">Inventory</button>' +
          '</div>' +
        '</div>' +
      '</div>';

    document.getElementById("daily-btn").addEventListener("click", async function() {
      try {
        var res = await API.claimDaily();
        App.player.coins = res.coins;
        App.updateHeader();
        UI.toast(res.message, "success");
        App.loadDashboard();
      } catch (err) {
        UI.toast(err.message, "error");
      }
    });

    document.getElementById("goto-shop").addEventListener("click", function() {
      UI.showTab("shop");
      App.loadShop();
    });

    document.getElementById("goto-inv").addEventListener("click", function() {
      UI.showTab("inventory");
      App.loadInventory();
    });
  },

  async loadShop() {
    var content = document.getElementById("shop-tab");
    content.innerHTML = '<div class="loading">Loading shop...</div>';

    try {
      var res = await API.getShop();
      var listings = res.listings;
      var rarityOrder = { COMMON: 0, RARE: 1, EPIC: 2, LEGENDARY: 3 };
      listings.sort(function(a, b) { return rarityOrder[a.item.rarity] - rarityOrder[b.item.rarity]; });

      content.innerHTML =
        '<div class="filter-row">' +
          '<button class="filter-pill on" data-filter="all">All</button>' +
          '<button class="filter-pill" data-filter="COMMON">Common</button>' +
          '<button class="filter-pill" data-filter="RARE">Rare</button>' +
          '<button class="filter-pill" data-filter="EPIC">Epic</button>' +
          '<button class="filter-pill" data-filter="LEGENDARY">Legendary</button>' +
        '</div>' +
        '<div class="shop-grid" id="shop-grid"></div>';

      var renderListings = function(filter) {
        var grid = document.getElementById("shop-grid");
        var filtered = filter === "all" ? listings : listings.filter(function(l) { return l.item.rarity === filter; });
        grid.innerHTML = filtered.map(function(l) {
          return '<div class="card shop-card border-' + l.item.rarity.toLowerCase() + '">' +
            '<div class="item-icon">' + UI.renderItemIcon(l.item.type) + '</div>' +
            '<h4>' + l.item.name + '</h4>' +
            '<p class="item-desc">' + l.item.description + '</p>' +
            '<span class="rarity-tag ' + l.item.rarity.toLowerCase() + '">' + l.item.rarity + '</span>' +
            '<div class="shop-price">$ ' + l.price.toLocaleString() + '</div>' +
            '<div class="stock">' + (l.stock === -1 ? "Unlimited" : "Stock: " + l.stock) + '</div>' +
            '<button class="btn btn-primary btn-sm buy-btn" data-lid="' + l.id + '">Buy</button>' +
          '</div>';
        }).join("");

        grid.querySelectorAll(".buy-btn").forEach(function(btn) {
          btn.addEventListener("click", async function() {
            try {
              var r = await API.buyItem(btn.dataset.lid, 1);
              App.player.coins = r.coins;
              App.updateHeader();
              UI.toast(r.message, "success");
              App.loadShop();
            } catch (err) {
              UI.toast(err.message, "error");
            }
          });
        });
      };

      renderListings("all");

      content.querySelectorAll(".filter-pill").forEach(function(btn) {
        btn.addEventListener("click", function() {
          content.querySelectorAll(".filter-pill").forEach(function(b) { b.classList.remove("on"); });
          btn.classList.add("on");
          renderListings(btn.dataset.filter);
        });
      });
    } catch (err) {
      content.innerHTML = '<div class="error-msg">Failed to load shop: ' + err.message + '</div>';
    }
  },

  async loadInventory() {
    var content = document.getElementById("inventory-tab");
    content.innerHTML = '<div class="loading">Loading inventory...</div>';

    try {
      var invRes = await API.getInventory();
      var statsRes = await API.getInventoryStats();
      var stats = statsRes.stats;

      content.innerHTML =
        '<div class="inv-stats">' +
          '<div class="inv-pill">Total: ' + stats.totalItems + '</div>' +
          '<div class="inv-pill">Unique: ' + stats.uniqueItems + '</div>' +
          '<div class="inv-pill">Value: $ ' + stats.totalValue.toLocaleString() + '</div>' +
          '<div class="inv-pill" style="color:var(--common)">' + stats.byRarity.COMMON + ' Common</div>' +
          '<div class="inv-pill" style="color:var(--rare)">' + stats.byRarity.RARE + ' Rare</div>' +
          '<div class="inv-pill" style="color:var(--epic)">' + stats.byRarity.EPIC + ' Epic</div>' +
          '<div class="inv-pill" style="color:var(--legendary)">' + stats.byRarity.LEGENDARY + ' Legendary</div>' +
        '</div>' +
        '<div class="inv-grid" id="inv-grid"></div>';

      var grid = document.getElementById("inv-grid");
      if (invRes.inventory.length === 0) {
        grid.innerHTML = '<div class="empty-state">Inventory is empty. Visit the shop.</div>';
        return;
      }

      grid.innerHTML = invRes.inventory.map(function(inv) {
        return '<div class="card inv-card border-' + inv.item.rarity.toLowerCase() + '">' +
          '<div class="item-icon">' + UI.renderItemIcon(inv.item.type) + '</div>' +
          '<h4 style="font-size:.9rem">' + inv.item.name + '</h4>' +
          '<p class="item-desc">' + inv.item.description + '</p>' +
          '<span class="rarity-tag ' + inv.item.rarity.toLowerCase() + '">' + inv.item.rarity + '</span>' +
          '<div class="inv-qty">x' + inv.quantity + '</div>' +
          '<div class="inv-val">$ ' + inv.item.basePrice.toLocaleString() + ' each</div>' +
          '<div class="sell-row">' +
            '<input type="number" min="1" max="' + inv.quantity + '" value="1" class="sell-input" data-iid="' + inv.id + '">' +
            '<button class="btn btn-danger btn-sm sell-btn" data-iid="' + inv.id + '">Sell</button>' +
          '</div>' +
        '</div>';
      }).join("");

      grid.querySelectorAll(".sell-btn").forEach(function(btn) {
        btn.addEventListener("click", async function() {
          var iid = btn.dataset.iid;
          var qtyEl = grid.querySelector('.sell-input[data-iid="' + iid + '"]');
          var qty = parseInt(qtyEl.value) || 1;
          try {
            var r = await API.sellItem(iid, qty);
            App.player.coins = r.coins;
            App.updateHeader();
            UI.toast(r.message, "success");
            App.loadInventory();
          } catch (err) {
            UI.toast(err.message, "error");
          }
        });
      });
    } catch (err) {
      content.innerHTML = '<div class="error-msg">Failed to load inventory: ' + err.message + '</div>';
    }
  },

  async loadTrades() {
    var content = document.getElementById("trades-tab");
    content.innerHTML = '<div class="loading">Loading trades...</div>';

    try {
      var res = await API.getPendingTrades();
      var trades = res.trades;

      content.innerHTML =
        '<div style="margin-bottom:16px"><button id="new-trade-btn" class="btn btn-primary">New Trade</button></div>' +
        '<div class="trade-list" id="trade-list"></div>' +
        '<div class="modal-overlay hidden" id="trade-modal">' +
          '<div class="modal-box">' +
            '<h3>New Trade</h3>' +
            '<form id="create-trade-form">' +
              '<label>Trade with (username)</label>' +
              '<input type="text" id="trade-recv" required>' +
              '<label>Offer coins</label>' +
              '<input type="number" id="trade-ocoins" min="0" value="0">' +
              '<label>Request coins</label>' +
              '<input type="number" id="trade-rcoins" min="0" value="0">' +
              '<button type="submit" class="btn btn-primary">Send</button>' +
              '<button type="button" class="btn btn-secondary" id="close-modal">Cancel</button>' +
            '</form>' +
          '</div>' +
        '</div>';

      var list = document.getElementById("trade-list");
      if (trades.length === 0) {
        list.innerHTML = '<div class="empty-state">No pending trades.</div>';
      } else {
        list.innerHTML = trades.map(function(t) {
          var isSender = t.senderId === App.player.id;
          var otherName = isSender ? t.receiver.user.username : t.sender.user.username;
          var dir = isSender ? "To" : "From";
          var offerItems = t.items.filter(function(i) { return i.direction === "OFFER"; });
          var requestItems = t.items.filter(function(i) { return i.direction === "REQUEST"; });
          var details = "";
          if (t.offerCoins > 0) details += "<p>Offering: $ " + t.offerCoins.toLocaleString() + "</p>";
          offerItems.forEach(function(i) { details += "<p>Offering: " + i.quantity + "x " + i.item.name + "</p>"; });
          if (t.requestCoins > 0) details += "<p>Requesting: $ " + t.requestCoins.toLocaleString() + "</p>";
          requestItems.forEach(function(i) { details += "<p>Requesting: " + i.quantity + "x " + i.item.name + "</p>"; });

          return '<div class="card trade-card">' +
            '<h4>' + dir + ' ' + otherName + '</h4>' + details +
            '<div class="trade-btns">' +
              (!isSender ? '<button class="btn btn-primary btn-sm accept-btn" data-tid="' + t.id + '">Accept</button>' : "") +
              '<button class="btn btn-danger btn-sm dec-btn" data-tid="' + t.id + '">' + (isSender ? "Cancel" : "Decline") + '</button>' +
            '</div>' +
          '</div>';
        }).join("");
      }

      document.getElementById("new-trade-btn").addEventListener("click", function() {
        document.getElementById("trade-modal").classList.remove("hidden");
      });

      document.getElementById("close-modal").addEventListener("click", function() {
        document.getElementById("trade-modal").classList.add("hidden");
      });

      document.getElementById("create-trade-form").addEventListener("submit", async function(e) {
        e.preventDefault();
        try {
          await API.createTrade({
            receiverUsername: document.getElementById("trade-recv").value,
            offerCoins: parseInt(document.getElementById("trade-ocoins").value) || 0,
            requestCoins: parseInt(document.getElementById("trade-rcoins").value) || 0,
          });
          UI.toast("Trade created", "success");
          document.getElementById("trade-modal").classList.add("hidden");
          App.loadTrades();
        } catch (err) {
          UI.toast(err.message, "error");
        }
      });

      list.querySelectorAll(".accept-btn").forEach(function(btn) {
        btn.addEventListener("click", async function() {
          try {
            await API.acceptTrade(btn.dataset.tid);
            UI.toast("Trade accepted", "success");
            var me = await API.me();
            App.player = me.player;
            App.updateHeader();
            App.loadTrades();
          } catch (err) {
            UI.toast(err.message, "error");
          }
        });
      });

      list.querySelectorAll(".dec-btn").forEach(function(btn) {
        btn.addEventListener("click", async function() {
          try {
            var fn = btn.textContent === "Cancel" ? API.cancelTrade : API.declineTrade;
            await fn(btn.dataset.tid);
            UI.toast("Done", "info");
            App.loadTrades();
          } catch (err) {
            UI.toast(err.message, "error");
          }
        });
      });
    } catch (err) {
      content.innerHTML = '<div class="error-msg">Failed to load trades: ' + err.message + '</div>';
    }
  },

  async loadLeaderboard() {
    var content = document.getElementById("leaderboard-tab");
    content.innerHTML = '<div class="loading">Loading leaderboard...</div>';

    try {
      var res = await API.getLeaderboard();
      var lb = res.leaderboard;
      var medals = ["1st", "2nd", "3rd"];

      content.innerHTML =
        '<div class="lb-table">' +
          '<div class="lb-head"><span></span><span>Player</span><span>Level</span><span>XP</span><span>Coins</span></div>' +
          lb.map(function(p) {
            var rankLabel = p.rank <= 3 ? medals[p.rank - 1] : "#" + p.rank;
            var selfClass = p.username === App.user.username ? " lb-self" : "";
            return '<div class="lb-row' + selfClass + '">' +
              '<span class="lb-rank">' + rankLabel + '</span>' +
              '<span class="lb-name">' + p.username + '</span>' +
              '<span class="lb-lv">Lv.' + p.level + '</span>' +
              '<span class="lb-xp">' + p.xp + '</span>' +
              '<span style="color:var(--yellow);font-family:var(--mono)">$ ' + p.coins.toLocaleString() + '</span>' +
            '</div>';
          }).join("") +
        '</div>';
    } catch (err) {
      content.innerHTML = '<div class="error-msg">Failed to load leaderboard: ' + err.message + '</div>';
    }
  },
};

document.addEventListener("DOMContentLoaded", function() { App.init(); });
