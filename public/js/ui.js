var UI = {
  $(sel) { return document.querySelector(sel); },
  $$(sel) { return document.querySelectorAll(sel); },

  show(id) {
    this.$$(".screen").forEach(function(s) { s.classList.remove("active"); });
    var el = document.getElementById(id);
    if (el) el.classList.add("active");
  },

  showAuth() { this.show("auth-screen"); },
  showGame() { this.show("game-screen"); },

  showTab(name) {
    this.$$(".tab").forEach(function(b) { b.classList.remove("active"); });
    this.$$(".tab-panel").forEach(function(c) { c.classList.remove("active"); });
    var btn = document.querySelector('[data-tab="' + name + '"]');
    var panel = document.getElementById(name + "-tab");
    if (btn) btn.classList.add("active");
    if (panel) panel.classList.add("active");
  },

  toast(msg, type) {
    type = type || "info";
    var container = document.getElementById("toast-container");
    var t = document.createElement("div");
    t.className = "toast toast-" + type;
    t.textContent = msg;
    container.appendChild(t);
    setTimeout(function() { t.classList.add("show"); }, 10);
    setTimeout(function() {
      t.classList.remove("show");
      setTimeout(function() { t.remove(); }, 300);
    }, 3000);
  },

  renderRarity(r) {
    return '<span class="rarity-tag ' + r.toLowerCase() + '">' + r + '</span>';
  },

  renderItemIcon(type) {
    var icons = { WEAPON: "\u2694\uFE0F", ARMOR: "\uD83D\uDEE1\uFE0F", PET: "\uD83D\uDC3E", COSMETIC: "\u2728", GENERAL: "\uD83D\uDCE6" };
    return icons[type] || "\uD83D\uDCE6";
  },
};
