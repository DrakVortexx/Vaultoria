'use strict';
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorValues(e) { if (null != e) { var t = e["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r = 0; if (t) return t.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) return { next: function next() { return e && r >= e.length && (e = void 0), { value: e && e[r++], done: !e }; } }; } throw new TypeError(_typeof(e) + " is not iterable"); }
function _slicedToArray(e, i) { return _iterableToArrayLimit(e, i) || _unsupportedIterableToArray(e, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, t) { var e = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (Array.isArray(r) && (null == e || e === ("undefined" != typeof Symbol && [][Symbol.iterator]) || e === []["@@iterator"])) return r; if (null != e) { var l, n, i, a, u = [], o = !0, f = !1; try { if (i = (e = e.call(r)).next, 0 === t) { if (Object(e) !== e) return; o = !1; } else for (; !(o = (l = i.call(e)).done) && (u.push(l.value), u.length !== t); o = !0); } catch (r) { f = !0, n = r; } finally { try { if (!o && null != e.return && (a = e.return(), Object(a) !== a)) return; } finally { if (f) throw n; } } return u; } }
function _regenerator() { var r, e, o = "function" == typeof Symbol ? Symbol : {}, n = o.iterator || "@@iterator", a = o.toStringTag || "@@toStringTag"; function i(o, n, a, i) { var u = n && n.prototype instanceof Generator ? n : Generator, f = Object.create(u.prototype); return _regeneratorDefine2(f, "_invoke", function (t, o, n) { var a, i, u, f = 0, p = n || [], y = !1, G = { p: 0, n: 0, v: r, a: l, f: l.bind(r, 4), d: function d(t, e) { return a = t, i = 0, u = r, G.n = e, c; } }; function l(t, o) { for (i = t, u = o, e = 0; !y && f && !n && e < p.length; e++) { var n, a = p[e], l = G.p, F = a[2]; t > 3 ? (n = F === o) && (u = a[(i = a[4]) ? 5 : (i = 3, 3)], a[4] = a[5] = r) : a[0] <= l && ((n = t < 2 && l < a[1]) ? (i = 0, G.v = o, G.n = a[1]) : l < F && (n = t < 3 || a[0] > o || o > F) && (a[4] = t, a[5] = o, G.n = F, i = 0)); } if (n || t > 1) return c; throw y = !0, o; } return function (n, p, F) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && l(p, F), i = p, u = F; (e = i < 2 ? r : u) || !y;) { a || (i ? (i > 1 && (G.n = i < 3 ? -1 : u), l(i, u)) : G.v = u); try { if (f = 2, a) { if (i || (n = "next"), e = a[n]) { if (!(e = e.call(a, u))) throw TypeError("iterator result is not an object"); if (!e.done) return e; u = e.value, i < 2 && (i = 0); } else 1 === i && (e = a.return) && e.call(a), i < 2 && (u = TypeError("The iterator does not provide a '" + n + "' method"), i = 1); a = r; } else if ((e = (y = G.n < 0) ? u : t.call(o, G)) !== c) break; } catch (t) { a = r, i = 1, u = t; } finally { f = 1; } } return { value: e, done: y }; }; }(o, a, i), !0), f; } var c = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} e = Object.getPrototypeOf; var u = [][n] ? e(e([][n]())) : (_regeneratorDefine2(e = {}, n, function () { return this; }), e), f = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(u); function p(r) { return Object.setPrototypeOf ? Object.setPrototypeOf(r, GeneratorFunctionPrototype) : (r.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(r, a, "GeneratorFunction")), r.prototype = Object.create(f), r; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(f, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, a, "GeneratorFunction"), _regeneratorDefine2(f), _regeneratorDefine2(f, a, "Generator"), _regeneratorDefine2(f, n, function () { return this; }), _regeneratorDefine2(f, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: p }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelper(e, t) { var _n = "undefined" != typeof Symbol && e[Symbol.iterator] || e["@@iterator"]; if (!_n) { if (Array.isArray(e) || (_n = _unsupportedIterableToArray(e)) || t && e && "number" == typeof e.length) { _n && (e = _n); var o = 0, F = function F() {}; return { s: F, n: function n() { return o >= e.length ? { done: !0 } : { done: !1, value: e[o++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var a, u, i = !0; return { s: function s() { _n = _n.call(e); }, n: function n() { i = !0; var r = _n.next(); return r.done ? { done: !0 } : { value: r.value, done: i = !1 }; }, e: function e(r) { a = !0, u = r; }, f: function f() { try { i || null == _n.return || _n.return(); } finally { if (a) throw u; } } }; }
function _unsupportedIterableToArray(t, e) { if (t) { if ("string" == typeof t) return _arrayLikeToArray(t, e); var o = {}.toString.call(t).slice(8, -1); return "Object" === o && t.constructor && (o = t.constructor.name), "Map" === o || "Set" === o ? Array.from(t) : "Arguments" === o || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o) ? _arrayLikeToArray(t, e) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var RARITIES = [{
  key: 'common',
  name: 'Common',
  color: '#9aa0b4',
  weight: 45000
}, {
  key: 'uncommon',
  name: 'Uncommon',
  color: '#5cd66b',
  weight: 28000
}, {
  key: 'rare',
  name: 'Rare',
  color: '#4fa8ff',
  weight: 35000
}, {
  key: 'epic',
  name: 'Epic',
  color: '#b15cff',
  weight: 15000
}, {
  key: 'legendary',
  name: 'Legendary',
  color: '#ffb648',
  weight: 6000
}, {
  key: 'mythic',
  name: 'Mythic',
  color: '#ff4d5e',
  weight: 3000
}, {
  key: 'divine',
  name: 'Divine',
  color: '#fff3c0',
  weight: 1500
}, {
  key: 'celestial',
  name: 'Celestial',
  color: '#5a7bff',
  weight: 800
}, {
  key: 'eternal',
  name: 'Eternal',
  color: '#ff4fd8',
  weight: 400
}, {
  key: 'omniversal',
  name: 'Omniversal',
  color: '#8affd8',
  weight: 200
}, {
  key: 'rush',
  name: 'Rush',
  color: '#ff9f1c',
  weight: 0,
  eventKey: 'rush'
}, {
  key: 'christmas',
  name: 'Christmas',
  color: '#ff6b6b',
  weight: 0,
  eventKey: 'christmas'
}];
var ITEMS_BY_RARITY = {
  common: ["Iron Scrap", "Cracked Stone", "Copper Wire", "Coal Chunk", "Rusty Bolt", "Glass Shard", "Faded Circuit", "Dust Crystal", "Scrap Metal", "Empty Power Cell"],
  uncommon: ["Refined Iron", "Charged Battery", "Polished Copper", "Reinforced Gear", "Emerald Circuit", "Stable Energy Core", "Quartz Lens", "Dense Alloy", "Neon Shard", "Compressed Coal"],
  rare: ["Plasma Crystal", "Quantum Circuit", "Titanium Plate", "Void Glass", "Flux Capacitor", "Synthetic Diamond", "Magnetic Core", "Arc Battery", "Echo Fragment", "Reinforced Data Chip"],
  epic: ["Rift Crystal", "Quantum Battery", "Phantom Alloy", "Chrono Gear", "Dimensional Lens", "Singularity Dust", "Astral Circuit", "Void Battery", "Gravity Core", "Phase Fragment"],
  legendary: ["Solar Core", "Golden Singularity", "Phoenix Circuit", "Celestial Alloy", "Eternal Battery", "Starforge Crystal", "Timekeeper Gear", "Royal Voidstone", "Aether Engine", "Crown Fragment"],
  mythic: ["Bloodmoon Core", "Oblivion Shard", "Infernal Reactor", "Reality Fracture", "Dragonheart Battery", "Chaos Engine", "Worldbreaker Alloy", "Crimson Singularity", "Godforge Fragment", "Eclipse Relic"],
  divine: ["Heavenstone", "Genesis Core", "Seraphic Engine", "Miracle Fragment", "Dawn Singularity", "Divine Circuit", "Worldroot Crystal", "Sacred Chrono Gear", "Creation Battery", "Halo of Eternity"],
  celestial: ["Nebula Heart", "Galaxy Engine", "Starborn Relic", "Cosmic Prism", "Astral Crown", "Blackstar Core", "Universe Fragment", "Event Horizon Lens", "Multiverse Battery", "Celestial Throne"],
  eternal: ["Infinity Heart", "Eternal Singularity", "Timebreak Relic", "Unending Engine", "Immortal Prism", "Endlessness Core", "Absolute Chrono Gear", "Evernight Crystal", "Eternal Crown", "Last Light of Time"],
  omniversal: ["Omniversal Seed", "Reality's Last Spark", "Infinite Paradox", "The First Singularity", "Multiverse Heart", "Absolute Infinity", "The Unwritten World", "Omniscient Core", "The Final Constant", "The Omniversal"],
  rush: ["Rushlight Capacitor", "Velocity Core", "Blitz Circuit", "Hyperdrive Prism", "Tempest Rush Engine"],
  christmas: ["Candy Cane Shard", "Frosted Circuit", "Jingle Bell Alloy", "Gingerbread Core", "Snowglobe Prism", "Tinsel Power Cell", "Reindeer Flux Drive", "North Star Fragment", "Santa's Sigil", "Christmas Miracle"]
};
var ITEM_BASE = {
  "Iron Scrap": 5,
  "Cracked Stone": 3,
  "Copper Wire": 8,
  "Coal Chunk": 6,
  "Rusty Bolt": 4,
  "Glass Shard": 7,
  "Faded Circuit": 12,
  "Dust Crystal": 10,
  "Scrap Metal": 9,
  "Empty Power Cell": 15,
  "Refined Iron": 25,
  "Charged Battery": 35,
  "Polished Copper": 30,
  "Reinforced Gear": 45,
  "Emerald Circuit": 60,
  "Stable Energy Core": 75,
  "Quartz Lens": 55,
  "Dense Alloy": 80,
  "Neon Shard": 90,
  "Compressed Coal": 40,
  "Plasma Crystal": 180,
  "Quantum Circuit": 240,
  "Titanium Plate": 200,
  "Void Glass": 300,
  "Flux Capacitor": 350,
  "Synthetic Diamond": 275,
  "Magnetic Core": 400,
  "Arc Battery": 450,
  "Echo Fragment": 500,
  "Reinforced Data Chip": 325,
  "Rift Crystal": 1000,
  "Quantum Battery": 1250,
  "Phantom Alloy": 1500,
  "Chrono Gear": 1800,
  "Dimensional Lens": 2000,
  "Singularity Dust": 2500,
  "Astral Circuit": 2200,
  "Void Battery": 3000,
  "Gravity Core": 3500,
  "Phase Fragment": 4000,
  "Solar Core": 8000,
  "Golden Singularity": 10000,
  "Phoenix Circuit": 12000,
  "Celestial Alloy": 15000,
  "Eternal Battery": 18000,
  "Starforge Crystal": 22000,
  "Timekeeper Gear": 25000,
  "Royal Voidstone": 30000,
  "Aether Engine": 35000,
  "Crown Fragment": 40000,
  "Bloodmoon Core": 75000,
  "Oblivion Shard": 90000,
  "Infernal Reactor": 110000,
  "Reality Fracture": 135000,
  "Dragonheart Battery": 160000,
  "Chaos Engine": 200000,
  "Worldbreaker Alloy": 250000,
  "Crimson Singularity": 300000,
  "Godforge Fragment": 400000,
  "Eclipse Relic": 500000,
  "Heavenstone": 1000000,
  "Genesis Core": 1250000,
  "Seraphic Engine": 1500000,
  "Miracle Fragment": 1800000,
  "Dawn Singularity": 2200000,
  "Divine Circuit": 2700000,
  "Worldroot Crystal": 3200000,
  "Sacred Chrono Gear": 4000000,
  "Creation Battery": 5000000,
  "Halo of Eternity": 7500000,
  "Nebula Heart": 10000000,
  "Galaxy Engine": 12500000,
  "Starborn Relic": 15000000,
  "Cosmic Prism": 20000000,
  "Astral Crown": 25000000,
  "Blackstar Core": 35000000,
  "Universe Fragment": 50000000,
  "Event Horizon Lens": 65000000,
  "Multiverse Battery": 85000000,
  "Celestial Throne": 100000000,
  "Infinity Heart": 150000000,
  "Eternal Singularity": 200000000,
  "Timebreak Relic": 250000000,
  "Unending Engine": 300000000,
  "Immortal Prism": 400000000,
  "Endlessness Core": 500000000,
  "Absolute Chrono Gear": 650000000,
  "Evernight Crystal": 800000000,
  "Eternal Crown": 1000000000,
  "Last Light of Time": 1500000000,
  "Omniversal Seed": 2000000000,
  "Reality's Last Spark": 3000000000,
  "Infinite Paradox": 5000000000,
  "The First Singularity": 7500000000,
  "Multiverse Heart": 10000000000,
  "Absolute Infinity": 15000000000,
  "The Unwritten World": 20000000000,
  "Omniscient Core": 30000000000,
  "The Final Constant": 50000000000,
  "The Omniversal": 100000000000,
  "Rushlight Capacitor": 50,
  "Velocity Core": 250,
  "Blitz Circuit": 1500,
  "Hyperdrive Prism": 12000,
  "Tempest Rush Engine": 150000,
  "Candy Cane Shard": 25,
  "Frosted Circuit": 60,
  "Jingle Bell Alloy": 150,
  "Gingerbread Core": 400,
  "Snowglobe Prism": 1000,
  "Tinsel Power Cell": 3000,
  "Reindeer Flux Drive": 10000,
  "North Star Fragment": 50000,
  "Santa's Sigil": 250000,
  "Christmas Miracle": 1000000
};
var EVENTS = [{
  key: 'rush',
  name: 'Rush Week',
  startMonth: 11,
  startDay: 20,
  endMonth: 11,
  endDay: 30,
  color: '#ff9f1c',
  theme: 'rush-week',
  items: ITEMS_BY_RARITY.rush,
  desc: 'Limited Rush items drop from the generator, and every generate has a 5% chance to roll the Rush mutation on any item.'
}, {
  key: 'christmas',
  name: 'Christmas Event',
  startMonth: 12,
  startDay: 1,
  endMonth: 12,
  endDay: 25,
  color: '#ff6b6b',
  theme: 'christmas',
  items: ITEMS_BY_RARITY.christmas,
  desc: 'Limited holiday items drop from the generator, and the world gets a festive new look.'
}];
function eventWindowActive(ev) {
  var date = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date();
  var m = date.getUTCMonth() + 1;
  var d = date.getUTCDate();
  return (m > ev.startMonth || m === ev.startMonth && d >= ev.startDay) && (m < ev.endMonth || m === ev.endMonth && d <= ev.endDay);
}
function activeEvent() {
  var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Date();
  return EVENTS.find(function (ev) {
    return eventWindowActive(ev, date);
  }) || null;
}
var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function eventRangeText(ev) {
  var start = MONTH_NAMES[ev.startMonth - 1] + ' ' + ev.startDay;
  var end = (ev.startMonth === ev.endMonth ? '' : MONTH_NAMES[ev.endMonth - 1] + ' ') + ev.endDay;
  return start + "\u2013" + end;
}
function applyEventTheme() {
  var current = activeEvent();
  document.body.classList.toggle('christmas', !!(current && current.theme === 'christmas'));
  document.body.classList.toggle('rush-week', !!(current && current.theme === 'rush-week'));
  if ($('eventBtn')) {
    $('eventBadge').classList.toggle('hidden', !current);
    $('eventCardDesc').textContent = current ? current.name + " is live \u2014 limited items and special rewards await." : 'Seasonal events bring limited items and special rewards.';
  }
  if ($('panel-codex') && $('panel-codex').classList.contains('active')) renderCodex();
  if (!$('dashPanel').classList.contains('hidden') && $('dashPanel').dataset.panel === 'event') renderEventPanel();
}
var MAX_LEVEL = 100;
var SUF = ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", "Dc", "UDc", "DDc", "TDc", "QaDc", "QiDc", "SxDc"];
var SERVER_CAPACITY = 8;
var OFFLINE_REWARDS = [{
  level: 1,
  name: 'Basic Generator',
  cost: 10000000,
  rate: 1000,
  minRebirth: 1
}, {
  level: 2,
  name: 'Efficient Engine',
  cost: 50000000,
  rate: 5000,
  minRebirth: 1
}, {
  level: 3,
  name: 'Auto-Miner',
  cost: 250000000,
  rate: 25000,
  minRebirth: 2
}, {
  level: 4,
  name: 'Quantum Harvester',
  cost: 1000000000,
  rate: 100000,
  minRebirth: 2
}, {
  level: 5,
  name: 'Void Collector',
  cost: 5000000000,
  rate: 500000,
  minRebirth: 3
}, {
  level: 6,
  name: 'Singularity Siphon',
  cost: 25000000000,
  rate: 1000000,
  minRebirth: 3
}, {
  level: 7,
  name: 'Omniverse Pump',
  cost: 100000000000,
  rate: 2000000,
  minRebirth: 4
}, {
  level: 8,
  name: 'Eternal Flow',
  cost: 500000000000,
  rate: 3000000,
  minRebirth: 4
}, {
  level: 9,
  name: 'Infinity Stream',
  cost: 2500000000000,
  rate: 4000000,
  minRebirth: 5
}, {
  level: 10,
  name: 'Ultimate Generator',
  cost: 10000000000000,
  rate: 5000000,
  minRebirth: 5
}];
var SLOT_COLORS = ['#4fd1ff', '#b14dff', '#ff5c8a', '#ffb648', '#7bdc78', '#ff8c42', '#5c8cff', '#ff4fd8'];
var VAULT_POS = [{
  x: 380,
  y: 300
}, {
  x: 1050,
  y: 300
}, {
  x: 1720,
  y: 300
}, {
  x: 2390,
  y: 300
}, {
  x: 380,
  y: 1400
}, {
  x: 1050,
  y: 1400
}, {
  x: 1720,
  y: 1400
}, {
  x: 2390,
  y: 1400
}];
var WORLD_W = 2800,
  WORLD_H = 1700,
  WALL = 24,
  SPAWN = {
    x: 1400,
    y: 850
  };
var EL = {
  x: SPAWN.x,
  y: SPAWN.y,
  r: 60
};
var CAM_ZOOM = 0.9;
var EW_SPIN_COST = 0;
var $ = function $(id) {
  return document.getElementById(id);
};
var isMobile = function () {
  var ua = navigator.userAgent || '';
  var uaMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
  var touch = (navigator.maxTouchPoints || 0) > 0 || 'ontouchstart' in window;
  var coarse = !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  var isIPad = /Macintosh/i.test(ua) && (navigator.maxTouchPoints || 0) > 1;
  return uaMobile || touch || coarse || isIPad;
}();
function fmt(n) {
  n = Math.floor(Number(n) || 0);
  if (n < 1000) return '' + n;
  var i = 0;
  while (n >= 1000 && i < SUF.length - 1) {
    n /= 1000;
    i++;
  }
  if (n >= 100) return n.toFixed(0) + SUF[i];
  if (n >= 10) return n.toFixed(1) + SUF[i];
  return n.toFixed(2) + SUF[i];
}
var SELL_MULT = 1.25;
var genCost = function genCost() {
  var n = state.level + 1;
  var baseCost = state.level < 8 ? 300 : 15000;
  return Math.floor(n * n * baseCost);
};
function rarityFor(name) {
  var _iterator = _createForOfIteratorHelper(RARITIES),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var r = _step.value;
      if (ITEMS_BY_RARITY[r.key].indexOf(name) !== -1) return r;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return RARITIES[0];
}
function itemBase(name) {
  return ITEM_BASE[name] || 0;
}
var MUT_SEP = "\u241F";
var MUTATIONS = [{
  id: 'gold',
  name: 'Gold',
  mult: 2,
  color: '#ffd24a'
}, {
  id: 'diamond',
  name: 'Diamond',
  mult: 3,
  color: '#7be0ff'
}, {
  id: 'electric',
  name: 'Electric',
  mult: 4,
  color: '#c77bff'
}, {
  id: 'rush',
  name: 'Rush',
  mult: 5,
  color: '#ff9f1c'
}];
var MUT_BY_ID = {};
MUTATIONS.forEach(function (m) {
  MUT_BY_ID[m.id] = m;
});
function splitKey(key) {
  var s = String(key);
  var i = s.indexOf(MUT_SEP);
  if (i === -1) return {
    item: s,
    mut: null
  };
  return {
    item: s.slice(i + 1),
    mut: s.slice(0, i)
  };
}
function baseName(key) {
  return splitKey(key).item;
}
function mutationOf(key) {
  return MUT_BY_ID[splitKey(key).mut] || null;
}
function makeKey(item, mut) {
  return mut ? mut.id + MUT_SEP + item : item;
}
function itemValueKey(key) {
  var _splitKey = splitKey(key),
    item = _splitKey.item,
    mut = _splitKey.mut;
  var m = MUT_BY_ID[mut];
  return Math.round((ITEM_BASE[item] || 0) * (m ? m.mult : 1) * SELL_MULT);
}
function mutBadge(key) {
  var m = mutationOf(key);
  if (!m) return '';
  return '<span class="rarity" style="color:' + m.color + ';background:' + m.color + '1f;border:1px solid ' + m.color + '59">' + m.name + ' x' + m.mult + '</span>';
}
function itemDisplayName(key) {
  var m = mutationOf(key);
  var base = baseName(key);
  if (!m) return '<span style="color:' + rarityFor(base).color + '">' + esc(base) + '</span>';
  return '<span style="color:' + m.color + '">' + esc(m.name) + '</span> <span style="color:' + rarityFor(base).color + '">' + esc(base) + '</span>';
}
var tooltipEl = $('itemTooltip');
function showItemTooltip(e, itemKey, rar, mut, baseValue, mult) {
  var rect = e.target.getBoundingClientRect();
  var name = itemDisplayName(itemKey);
  var sellValue = itemValueKey(itemKey);
  tooltipEl.innerHTML = '<div class="tt-name" style="color:' + rar.color + '">' + name + '</div>' + '<div class="tt-rarity" style="color:' + rar.color + '">' + rar.name + '</div>' + '<div class="tt-value">Sell Value: $' + fmt(sellValue) + '</div>' + '<div class="tt-base">Base Value: $' + fmt(baseValue) + '</div>' + (mut ? '<div class="tt-mut">' + mut.name.toUpperCase() + ' (x' + mult + ' multiplier)</div>' : '');
  var x = rect.right + 12;
  var y = rect.top;
  if (x + 280 > window.innerWidth) x = rect.left - 292;
  if (y + 150 > window.innerHeight) y = window.innerHeight - 150;
  tooltipEl.style.left = x + 'px';
  tooltipEl.style.top = y + 'px';
  tooltipEl.classList.add('visible');
}
function hideItemTooltip() {
  tooltipEl.classList.remove('visible');
}
document.addEventListener('click', function (e) {
  if (!e.target || e.target.getAttribute('data-codex') !== '1') hideItemTooltip();
}, false);
var REBIRTHS = [{
  name: 'Awakening',
  rarity: 2,
  count: 1,
  cost: 25000
}, {
  name: 'Ascension',
  rarity: 3,
  count: 2,
  cost: 250000
}, {
  name: 'Transcend',
  rarity: 4,
  count: 3,
  cost: 2500000
}, {
  name: 'Apotheosis',
  rarity: 5,
  count: 4,
  cost: 25000000
}, {
  name: 'Godhood',
  rarity: 6,
  count: 5,
  cost: 250000000
}];
var SHIELD_BASE_SECONDS = 300;
var SHIELD_PER_REBIRTH = 60;
function shieldActive() {
  return !!(state && state.shieldUntil && state.shieldUntil > Date.now());
}
function shieldSeconds() {
  return SHIELD_BASE_SECONDS + (state ? state.rebirths : 0) * SHIELD_PER_REBIRTH;
}
var NEWBIE_LEVEL = 8;
function countRarity(ri) {
  var n = 0;
  for (var k in state.counts || {}) {
    var rar = rarityFor(baseName(k));
    if (RARITIES.indexOf(rar) === ri) n += Number(state.counts[k]) || 0;
  }
  return n;
}
var token = localStorage.getItem('vaultoria_token') || null;
var me = null;
var state = null;
var inGame = false;
var currentServer = null;
var mySlot = -1;
var members = [];
var others = {};
var ws = null;
var wsTimer = null;
var saveTimer = null;
var hideTimeout = null;
var salesCount = 0;
var bazaarOpened = false;
var ev = null;
var vaultOpen = false;
var generating = false;
var genBusy = false;
var upgradeBusy = false;
var genEnd = 0;
var tutorialDone = false;
var tutIdx = 0;
var lastTutRender = -1;
var tutTimer = null;
var spotTimer = null;
var dailyData = null;
var bossState = null;
var lastMoneyShown = null;
var ownedProducts = [];
applyEventTheme();
setInterval(applyEventTheme, 60000);
var actx = null;
function ac() {
  if (!actx) {
    try {
      actx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {}
  }
  return actx;
}
function tone(freq, dur, type, vol, when, slide) {
  var c = ac();
  if (!c) return;
  var t = c.currentTime + (when || 0);
  var o = c.createOscillator(),
    g = c.createGain();
  o.type = type || 'sine';
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + dur);
  g.gain.setValueAtTime(vol || 0.12, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}
function sfxGen(r) {
  var b = [220, 330, 440, 550, 660, 880][Math.min(r, 5)];
  tone(b, 0.08, 'square', 0.05);
  tone(b * 1.5, 0.1, 'square', 0.04, 0.06);
  if (r >= 3) tone(b * 2, 0.15, 'triangle', 0.08, 0.03);
  if (r >= 4) {
    tone(b * 2.5, 0.18, 'sine', 0.1, 0.12);
    tone(b * 3.5, 0.22, 'sine', 0.09, 0.24);
  }
}
function sfxSell() {
  tone(880, 0.05, 'square', 0.06);
  tone(1318, 0.1, 'square', 0.05, 0.06);
  tone(1760, 0.12, 'square', 0.04, 0.12);
}
function sfxBuy() {
  tone(500, 0.1, 'triangle', 0.1);
  tone(740, 0.12, 'triangle', 0.1, 0.08);
  tone(1000, 0.2, 'triangle', 0.1, 0.16);
}
function sfxToast() {
  tone(660, 0.12, 'sine', 0.12);
  tone(990, 0.2, 'sine', 0.1, 0.1);
}
function sfxDoor() {
  tone(180, 0.25, 'sawtooth', 0.06, 0, 90);
  tone(240, 0.18, 'sine', 0.05, 0.05);
}
function sfxStep() {
  tone(90, 0.06, 'triangle', 0.02);
}
function float(x, y, text, color) {
  var el = document.createElement('div');
  el.className = 'float';
  el.textContent = text;
  el.style.left = x - 6 + 'px';
  el.style.top = y + 'px';
  el.style.color = color || '#7bdc78';
  document.body.appendChild(el);
  setTimeout(function () {
    return el.remove();
  }, 1200);
}
function burst(x, y, rar) {
  var layer = $('confettiLayer');
  var colors = [rar.color, '#fff', '#4fd1ff', '#ffb648'];
  var _loop = function _loop() {
    var c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = x + 'px';
    c.style.top = y + 'px';
    c.style.background = colors[i % colors.length];
    c.style.setProperty('--dx', (Math.random() * 2 - 1) * 170 + 'px');
    c.style.setProperty('--dy', -60 - Math.random() * 170 + 'px');
    c.style.setProperty('--rot', Math.random() * 760 - 380 + 'deg');
    c.style.animationDuration = 0.9 + Math.random() * 1.1 + 's';
    layer.appendChild(c);
    setTimeout(function () {
      return c.remove();
    }, 2100);
  };
  for (var i = 0; i < 44; i++) {
    _loop();
  }
}
function shock(color) {
  var el = document.createElement('div');
  el.className = 'shock';
  el.style.color = color || '#4fd1ff';
  el.style.left = window.innerWidth / 2 + 'px';
  el.style.top = window.innerHeight * 0.42 + 'px';
  document.body.appendChild(el);
  setTimeout(function () {
    return el.remove();
  }, 720);
}
function screenFlash(color) {
  var el = document.createElement('div');
  el.className = 'flash';
  el.style.background = 'radial-gradient(circle at 50% 42%, ' + hexA(color, 0.34) + ', transparent 62%)';
  document.body.appendChild(el);
  setTimeout(function () {
    return el.remove();
  }, 520);
}
function shakeScreen() {
  var g = $('game');
  if (!g) return;
  g.classList.remove('shake');
  void g.offsetWidth;
  g.classList.add('shake');
  setTimeout(function () {
    return g.classList.remove('shake');
  }, 340);
}
function toast(title, desc, reward, color) {
  var box = $('toasts');
  var el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = '<div class="t-title" style="color:' + (color || '#ffb648') + '">' + title + '</div>' + (desc ? '<div class="t-desc">' + desc + '</div>' : '') + (reward ? '<div class="t-reward">+' + reward + '</div>' : '');
  box.appendChild(el);
  while (box.children.length > 4) box.removeChild(box.firstChild);
  setTimeout(function () {
    el.style.transition = 'opacity 0.4s';
    el.style.opacity = 0;
    setTimeout(function () {
      return el.remove();
    }, 420);
  }, 3200);
}
function announce(text) {
  var box = $('toasts');
  var el = document.createElement('div');
  el.className = 'toast announce';
  el.innerHTML = "<div class=\"t-title\" style=\"color:#ffb648\">\u26A0 ANNOUNCEMENT</div><div class=\"t-desc\">" + esc(text) + '</div>';
  box.appendChild(el);
  while (box.children.length > 4) box.removeChild(box.firstChild);
  setTimeout(function () {
    el.style.transition = 'opacity 0.4s';
    el.style.opacity = 0;
    setTimeout(function () {
      return el.remove();
    }, 420);
  }, 8000);
}
function api(_x, _x2) {
  return _api.apply(this, arguments);
}
function _api() {
  _api = _asyncToGenerator(_regenerator().m(function _callee15(path, opts) {
    var headers, res, data, err, _t15;
    return _regenerator().w(function (_context15) {
      while (1) switch (_context15.p = _context15.n) {
        case 0:
          opts = opts || {};
          headers = Object.assign({
            'Content-Type': 'application/json'
          }, opts.headers || {});
          if (token) headers.Authorization = 'Bearer ' + token;
          _context15.n = 1;
          return fetch('/api' + path, Object.assign({}, opts, {
            headers: headers
          }));
        case 1:
          res = _context15.v;
          data = {};
          _context15.p = 2;
          _context15.n = 3;
          return res.json();
        case 3:
          data = _context15.v;
          _context15.n = 5;
          break;
        case 4:
          _context15.p = 4;
          _t15 = _context15.v;
        case 5:
          if (res.ok) {
            _context15.n = 6;
            break;
          }
          err = new Error(data.error || 'Request failed (' + res.status + ')');
          err.status = res.status;
          throw err;
        case 6:
          return _context15.a(2, data);
      }
    }, _callee15, null, [[2, 4]]);
  }));
  return _api.apply(this, arguments);
}
function showScreen(name) {
  $('authScreen').classList.toggle('hidden', name !== 'auth');
  $('dashScreen').classList.toggle('hidden', name !== 'dash');
  $('gameHud').classList.toggle('hidden', name !== 'game');
  var mc = $('mobileControls');
  if (mc) mc.classList.toggle('hidden', !(name === 'game' && isMobile));
  inGame = name === 'game';
  if (name !== 'game') closeAllModals();
}
var authMode = 'login';
$('tabLogin').addEventListener('click', function () {
  return setAuthMode('login');
});
$('tabRegister').addEventListener('click', function () {
  return setAuthMode('register');
});
function setAuthMode(m) {
  authMode = m;
  $('tabLogin').classList.toggle('active', m === 'login');
  $('tabRegister').classList.toggle('active', m === 'register');
  $('authSubmit').textContent = m === 'login' ? 'Sign In' : 'Create Account';
  $('authPass').setAttribute('autocomplete', m === 'login' ? 'current-password' : 'new-password');
  $('authError').textContent = '';
}
$('authForm').addEventListener('submit', function () {
  var _ref = _asyncToGenerator(_regenerator().m(function _callee(e) {
    var username, password, data, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          e.preventDefault();
          username = $('authUser').value.trim();
          password = $('authPass').value;
          $('authError').textContent = '';
          if (!(!username || !password)) {
            _context.n = 1;
            break;
          }
          $('authError').textContent = 'Enter a username and password';
          return _context.a(2);
        case 1:
          $('authSubmit').disabled = true;
          _context.p = 2;
          _context.n = 3;
          return api('/' + (authMode === 'login' ? 'login' : 'register'), {
            method: 'POST',
            body: JSON.stringify({
              username: username,
              password: password
            })
          });
        case 3:
          data = _context.v;
          token = data.token;
          localStorage.setItem('vaultoria_token', token);
          me = data.user;
          _context.n = 4;
          return loadMe();
        case 4:
          $('authPass').value = '';
          toast('WELCOME', 'Signed in as ' + me.username, null, '#4fd1ff');
          _context.n = 6;
          break;
        case 5:
          _context.p = 5;
          _t = _context.v;
          $('authError').textContent = _t.message;
        case 6:
          _context.p = 6;
          $('authSubmit').disabled = false;
          return _context.f(6);
        case 7:
          return _context.a(2);
      }
    }, _callee, null, [[2, 5, 6, 7]]);
  }));
  return function (_x3) {
    return _ref.apply(this, arguments);
  };
}());
function loadMe() {
  return _loadMe.apply(this, arguments);
}
function _loadMe() {
  _loadMe = _asyncToGenerator(_regenerator().m(function _callee16() {
    var data;
    return _regenerator().w(function (_context16) {
      while (1) switch (_context16.n) {
        case 0:
          _context16.n = 1;
          return api('/me');
        case 1:
          data = _context16.v;
          me = data.user;
          state = data.state;
          ownedProducts = Array.isArray(state.ownedProducts) ? state.ownedProducts : [];
          dailyData = data.daily || null;
          tutorialDone = !!state.tutorialDone;
          $('dashPanel').classList.add('hidden');
          renderDash();
          renderVault();
          showScreen('dash');
          refreshEvent();
          checkPurchaseReturn();
          if (data.login && data.login.isNew) {
            setTimeout(function () {
              return toast("DAILY REWARD \xB7 DAY " + data.login.day, data.login.streak + ' day streak', '$' + fmt(data.login.reward), '#ffb648');
            }, 600);
          }
          if ($('adminBtn')) {
            if (me && me.isAdmin && me.username === 'knowkey') {
              $('adminBtn').style.display = 'inline-block';
            } else {
              $('adminBtn').style.display = 'none';
            }
          }
        case 2:
          return _context16.a(2);
      }
    }, _callee16);
  }));
  return _loadMe.apply(this, arguments);
}
$('logoutBtn').addEventListener('click', function () {
  saveNow();
  token = null;
  me = null;
  state = null;
  localStorage.removeItem('vaultoria_token');
  disconnectWS();
  showScreen('auth');
});
function refreshState() {
  return _refreshState.apply(this, arguments);
}
function _refreshState() {
  _refreshState = _asyncToGenerator(_regenerator().m(function _callee17() {
    var data;
    return _regenerator().w(function (_context17) {
      while (1) switch (_context17.n) {
        case 0:
          _context17.n = 1;
          return api('/me');
        case 1:
          data = _context17.v;
          me = data.user;
          state = data.state;
          ownedProducts = Array.isArray(state.ownedProducts) ? state.ownedProducts : ownedProducts;
          dailyData = data.daily || null;
          tutorialDone = !!state.tutorialDone;
          renderVault();
        case 2:
          return _context17.a(2);
      }
    }, _callee17);
  }));
  return _refreshState.apply(this, arguments);
}
function onBreached(_x4) {
  return _onBreached.apply(this, arguments);
}
function _onBreached() {
  _onBreached = _asyncToGenerator(_regenerator().m(function _callee18(msg) {
    var took, _t16;
    return _regenerator().w(function (_context18) {
      while (1) switch (_context18.p = _context18.n) {
        case 0:
          took = [];
          if (msg.item) took.push(itemDisplayName(makeKey(msg.item.name, msg.item.mutation ? MUT_BY_ID[msg.item.mutation] || null : null)) + ' x' + msg.item.qty);
          if (msg.money > 0) took.push('$' + fmt(msg.money));
          toast('YOU WERE BREACHED', (msg.byName || 'Someone') + ' raided your vault' + (took.length ? " \u2014 stole " + took.join(' + ') : " \u2014 took your change"), null, '#ff6b8a');
          sfxToast();
          _context18.p = 1;
          _context18.n = 2;
          return refreshState();
        case 2:
          _context18.n = 4;
          break;
        case 3:
          _context18.p = 3;
          _t16 = _context18.v;
        case 4:
          renderBreachTargets();
        case 5:
          return _context18.a(2);
      }
    }, _callee18, null, [[1, 3]]);
  }));
  return _onBreached.apply(this, arguments);
}
function onTradeRequest(msg) {
  var reqId = msg.requestId || msg.id;
  if (pendingTradeReqs.find(function (x) {
    return x.id === reqId;
  })) return;
  pendingTradeReqs.push({
    id: reqId,
    fromName: msg.fromName
  });
  if (!$('tradeModal').classList.contains('hidden') && !activeTrade) renderPendingReqs();
  toast('TRADE REQUEST', msg.fromName + ' wants to trade with you', null, '#4fd1ff');
}
function onTradeOpened(msg) {
  activeTrade = msg.trade;
  if (!$('tradeModal').classList.contains('hidden')) {
    $('tradeStart').classList.add('hidden');
    $('tradeBuilder').classList.remove('hidden');
    renderTrade();
  }
}
function onTradeDone(msg) {
  state = msg.state;
  activeTrade = null;
  toast('TRADE COMPLETE', 'Your trade was successful', null, '#7bdc78');
  if (!$('tradeModal').classList.contains('hidden')) {
    $('tradeStart').classList.remove('hidden');
    $('tradeBuilder').classList.add('hidden');
    renderPendingReqs();
    loadOnline();
  }
  renderVault();
}
function onTradeCancelled(msg) {
  activeTrade = null;
  toast('TRADE CANCELLED', 'The trade was cancelled', null, '#8b93bd');
  if (!$('tradeModal').classList.contains('hidden')) {
    $('tradeStart').classList.remove('hidden');
    $('tradeBuilder').classList.add('hidden');
    renderPendingReqs();
    loadOnline();
  }
}
function onTradeDeclined(msg) {
  toast('DECLINED', msg.fromName + ' declined your trade request', null, '#8b93bd');
  pendingTradeReqs = pendingTradeReqs.filter(function (x) {
    return x.id !== msg.id;
  });
  if (!$('tradeModal').classList.contains('hidden') && !activeTrade) renderPendingReqs();
}
function pollTrade() {
  return _pollTrade.apply(this, arguments);
}
function _pollTrade() {
  _pollTrade = _asyncToGenerator(_regenerator().m(function _callee19() {
    var r, _t17;
    return _regenerator().w(function (_context19) {
      while (1) switch (_context19.p = _context19.n) {
        case 0:
          if (activeTrade) {
            _context19.n = 1;
            break;
          }
          return _context19.a(2);
        case 1:
          _context19.p = 1;
          _context19.n = 2;
          return api('/trade/' + activeTrade.id);
        case 2:
          r = _context19.v;
          if (r.trade) {
            activeTrade = r.trade;
            if (!$('tradeModal').classList.contains('hidden')) renderTrade();
          }
          _context19.n = 4;
          break;
        case 3:
          _context19.p = 3;
          _t17 = _context19.v;
        case 4:
          return _context19.a(2);
      }
    }, _callee19, null, [[1, 3]]);
  }));
  return _pollTrade.apply(this, arguments);
}
function nearWheel() {
  var cx = player.x + player.w / 2,
    cy = player.y + player.h / 2;
  return Math.hypot(cx - EL.x, cy - EL.y) < EL.r + 30;
}
function eventActive() {
  return !!(ev && ev.active);
}
function refreshEvent() {
  return _refreshEvent.apply(this, arguments);
}
function _refreshEvent() {
  _refreshEvent = _asyncToGenerator(_regenerator().m(function _callee20() {
    var r, _t18;
    return _regenerator().w(function (_context20) {
      while (1) switch (_context20.p = _context20.n) {
        case 0:
          _context20.p = 0;
          _context20.n = 1;
          return api('/event');
        case 1:
          r = _context20.v;
          ev = r.event;
          renderEventTag();
          if (!$('wheelModal').classList.contains('hidden')) renderWheelModal();
          _context20.n = 3;
          break;
        case 2:
          _context20.p = 2;
          _t18 = _context20.v;
        case 3:
          return _context20.a(2);
      }
    }, _callee20, null, [[0, 2]]);
  }));
  return _refreshEvent.apply(this, arguments);
}
function renderEventTag() {
  var tag = $('eventTag');
  if (!tag) return;
  var now = Date.now();
  if (ev && (ev.active || ev.startsAt && ev.startsAt - now < 120000)) {
    tag.classList.remove('hidden');
    if (ev.active) {
      tag.textContent = 'ELECTRIC ' + Math.max(0, Math.ceil((ev.endsAt - now) / 1000)) + 's';
      tag.classList.add('live');
      tag.classList.remove('soon');
    } else {
      tag.textContent = 'ELECTRIC IN ' + Math.max(0, Math.ceil((ev.startsAt - now) / 1000)) + 's';
      tag.classList.add('soon');
      tag.classList.remove('live');
    }
  } else {
    tag.classList.add('hidden');
  }
}
function onElectricMsg(msg) {
  if (msg.type === 'electricNotice') {
    var sec = Math.max(0, Math.ceil((msg.startsAt - Date.now()) / 1000));
    toast('ELECTRIC EVENT', 'The Electric Wheel awakens at the center of the world in ' + sec + 's', null, '#8affd8');
    sfxToast();
  } else if (msg.on) {
    toast('ELECTRIC EVENT', "The wheel is live \u2014 hurry to the center of the world!", null, '#8affd8');
    sfxToast();
  } else {
    toast('ELECTRIC EVENT', 'The Electric Wheel powers down...', null, '#8b93bd');
  }
  refreshEvent();
}
function onWheelMsg(msg) {
  var name = itemDisplayName(makeKey(msg.item.name, msg.item.mutation ? MUT_BY_ID[msg.item.mutation] || null : null));
  addChat('sys', '', msg.name + " spun the wheel \u2014 " + name + (msg.jackpot ? ' (ELECTRIC!)' : ''));
}
var WHEEL_SLICE = Math.PI * 2 / 8;
var wheelSpin = {
  angle: 0,
  spinning: false,
  raf: 0
};
var wheelSpinCtxObj = null;
function wheelSpinCtx() {
  if (!wheelSpinCtxObj) {
    wheelSpinCtxObj = document.getElementById('wheelSpinCanvas').getContext('2d');
  }
  return wheelSpinCtxObj;
}
function drawWheelSpinFrame(ctx, angle, spinning) {
  var S = 180;
  ctx.clearRect(0, 0, S, S);
  var g = ctx.createRadialGradient(90, 90, 18, 90, 90, 110);
  g.addColorStop(0, 'rgba(138,255,216,0.30)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(90, 90, 90, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.translate(90, 90);
  ctx.rotate(angle);
  for (var i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 84, i * WHEEL_SLICE, (i + 1) * WHEEL_SLICE);
    ctx.closePath();
    ctx.fillStyle = i % 2 ? '#5a7bff' : '#ff4fd8';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.fillStyle = '#0b0f1e';
  ctx.beginPath();
  ctx.arc(0, 0, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = spinning ? '#8affd8' : '#c8b8ff';
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.strokeStyle = spinning ? 'rgba(138,255,216,0.9)' : 'rgba(150,120,255,0.7)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(90, 90, 92, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = spinning ? '#8affd8' : '#c8b8ff';
  ctx.beginPath();
  ctx.moveTo(90, 8);
  ctx.lineTo(83, 36);
  ctx.lineTo(97, 36);
  ctx.closePath();
  ctx.fill();
}
function startWheelSpin(cb) {
  if (wheelSpin.spinning) return;
  var c = document.getElementById('wheelSpinCanvas');
  if (!c) {
    if (cb) {
      cb();
    }
    return;
  }
  var dpr = Math.min(2, window.devicePixelRatio || 1);
  var S = 180;
  c.width = S * dpr;
  c.height = S * dpr;
  var ctx = c.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  var t0 = performance.now();
  var duration = 1800;
  var from = wheelSpin.angle;
  var to = from + Math.PI * 14 + Math.random() * Math.PI * 2;
  var _tick = function tick(ts) {
    var t = Math.min(1, (ts - t0) / duration);
    var e = 1 - Math.pow(1 - t, 3);
    wheelSpin.angle = from + (to - from) * e;
    drawWheelSpinFrame(ctx, wheelSpin.angle, true);
    if (t < 1) {
      wheelSpin.raf = requestAnimationFrame(_tick);
    } else {
      cancelAnimationFrame(wheelSpin.raf);
      wheelSpin.spinning = false;
      wheelSpin.angle = Math.floor(wheelSpin.angle / WHEEL_SLICE) * WHEEL_SLICE;
      drawWheelSpinFrame(ctx, wheelSpin.angle, false);
      if (cb) {
        cb();
      }
    }
  };
  wheelSpin.spinning = true;
  wheelSpin.raf = requestAnimationFrame(_tick);
}
function openWheel() {
  return _openWheel.apply(this, arguments);
}
function _openWheel() {
  _openWheel = _asyncToGenerator(_regenerator().m(function _callee21() {
    return _regenerator().w(function (_context21) {
      while (1) switch (_context21.n) {
        case 0:
          if (inGame) {
            _context21.n = 1;
            break;
          }
          return _context21.a(2);
        case 1:
          closeAllModals();
          $('wheelModal').classList.remove('hidden');
          $('wheelResult').innerHTML = '';
          renderWheelModal();
          _context21.n = 2;
          return refreshEvent();
        case 2:
          if (eventActive()) startWheelSpin();
        case 3:
          return _context21.a(2);
      }
    }, _callee21);
  }));
  return _openWheel.apply(this, arguments);
}
function renderWheelModal() {
  if (!state) return;
  $('wMoney').textContent = '$' + fmt(state.money);
  var info = $('wheelInfo');
  var spin = $('wheelSpin');
  var canvas = $('wheelSpinCanvas');
  var nextIn = ev && ev.startsAt ? Math.max(0, Math.ceil((ev.startsAt - Date.now()) / 1000)) : 0;
  if (!ev || !ev.active) {
    info.innerHTML = "The wheel is resting. It awakens for 90 seconds roughly every hour at the center of the world \u2014 next event in <b>" + nextIn + 's</b>.';
    spin.disabled = true;
    spin.textContent = 'NOT LIVE';
    if (canvas) canvas.style.display = 'none';
    return;
  }
  if (canvas) canvas.style.display = 'block';
  var end = Math.max(0, ev.endsAt - Date.now());
  info.innerHTML = 'Live for <b>' + Math.ceil(end / 1000) + "s</b> \xB7 <b>" + ev.remaining + "</b> items left on the wheel \xB7 your spins: <b>" + ev.spinsLeft + '</b>/' + ev.maxSpins;
  var broke = state.money < ev.cost;
  spin.disabled = ev.spinsLeft <= 0 || ev.remaining <= 0 || broke;
  spin.textContent = broke ? 'NEED $' + fmt(ev.cost) : (ev.cost > 0 ? 'SPIN $' + fmt(ev.cost) : 'SPIN FREE') + (ev.spinsLeft <= 0 ? " \u2014 MAX SPINS" : '');
}
$('wheelSpin').addEventListener('click', function () {
  if (wheelSpin.spinning) return;
  startWheelSpin(function () {
    return runWheelSpin();
  });
});
function runWheelSpin() {
  return _runWheelSpin.apply(this, arguments);
}
function _runWheelSpin() {
  _runWheelSpin = _asyncToGenerator(_regenerator().m(function _callee22() {
    var r, name, _t19;
    return _regenerator().w(function (_context22) {
      while (1) switch (_context22.p = _context22.n) {
        case 0:
          _context22.p = 0;
          _context22.n = 1;
          return api('/event/spin', {
            method: 'POST'
          });
        case 1:
          r = _context22.v;
          state = r.state;
          renderVault();
          ev = r.event;
          renderWheelModal();
          renderEventTag();
          name = itemDisplayName(makeKey(r.item, r.mutation ? MUT_BY_ID[r.mutation] || null : null));
          $('wheelResult').innerHTML = '<div class="empty-note" style="padding:10px 0;text-align:center"><div style="font-weight:800;color:#8affd8;font-size:16px">' + name + (r.jackpot ? " \u2014 ELECTRIC!" : '') + '</div><div style="font-size:12px;color:#8b93bd">-\$' + fmt(r.cost) + '</div></div>';
          sfxBuy();
          if (r.newAch && r.newAch.length) showNewAch(r.newAch);
          _context22.n = 3;
          break;
        case 2:
          _context22.p = 2;
          _t19 = _context22.v;
          toast('OOPS', _t19.message, null, '#ff6b8a');
        case 3:
          return _context22.a(2);
      }
    }, _callee22, null, [[0, 2]]);
  }));
  return _runWheelSpin.apply(this, arguments);
}
function renderDash() {
  if (!me) return;
  $('dashWho').textContent = 'Signed in as ' + me.username;
  $('dashMoney').textContent = '$' + fmt(state.money);
  $('dashLevel').textContent = 'Lv ' + state.level;
  applyEventTheme();
}
function openDashPanel(which) {
  var p = $('dashPanel');
  p.classList.remove('hidden');
  p.dataset.panel = which;
  p.innerHTML = '<div class="spinner">Loading...</div>';
  if (which === 'event') renderEventPanel();else if (which === 'servers') renderServersPanel();else if (which === 'friends') renderFriendsPanel();else if (which === 'settings') renderSettingsPanel();else if (which === 'customize') renderCustomizePanel();else if (which === 'store') renderStorePanel();
}
$('playBtn').addEventListener('click', play);
$('eventBtn').addEventListener('click', function () {
  return openDashPanel('event');
});
$('serversBtn').addEventListener('click', function () {
  return openDashPanel('servers');
});
$('friendsBtn').addEventListener('click', function () {
  return openDashPanel('friends');
});
$('settingsBtn').addEventListener('click', function () {
  return openDashPanel('settings');
});
$('customizeBtn').addEventListener('click', function () {
  return openDashPanel('customize');
});
$('storeBtn').addEventListener('click', function () {
  return openDashPanel('store');
});
function renderEventPanel() {
  var p = $('dashPanel');
  var current = activeEvent();
  p.classList.remove('hidden');
  var html = '<h3>Event</h3>';
  if (current) {
    html += '<div class="event-banner">' + '<div class="event-title" style="color:' + current.color + '">' + esc(current.name) + '</div>' + '<div class="event-desc">' + esc(eventRangeText(current)) + ' &middot; ' + esc(current.desc) + '</div>' + '</div>' + '<h4 class="event-subtitle">Limited Items</h4>' + '<div class="event-items">';
    current.items.forEach(function (name) {
      html += '<div class="event-item">' + '<span class="event-name" style="color:' + current.color + '">' + esc(name) + '</span>' + '<span class="event-value">$' + fmt(Math.round(ITEM_BASE[name] * SELL_MULT)) + '</span>' + '</div>';
    });
    html += '</div>';
  } else {
    html += '<div class="empty-note" style="padding:8px 4px 14px">No event is live right now. Seasonal events bring limited items and special mutations. Check back soon.</div>';
  }
  p.innerHTML = html;
}
function renderSettingsPanel() {
  var p = $('dashPanel');
  p.classList.remove('hidden');
  p.innerHTML = '<h3 style="margin:0 0 10px;color:#9aa2cc;letter-spacing:2px;font-size:13px">SETTINGS</h3>' + '<div style="font-size:13px;color:#8b93bd">No settings available at this time.</div>';
}
function renderCustomizePanel() {
  var p = $('dashPanel');
  p.classList.remove('hidden');
  var money = Number(state.money || 0);
  p.innerHTML = '<h3 style="margin:0 0 10px;color:#9aa2cc;letter-spacing:2px;font-size:13px">CHARACTER COLOR</h3>' + '<div class="customize-grid" id="colorGrid"></div>' + '<h3 style="margin:20px 0 10px;color:#9aa2cc;letter-spacing:2px;font-size:13px">TRAIL EFFECT</h3>' + '<div class="customize-grid" id="trailGrid"></div>' + '<h3 style="margin:20px 0 10px;color:#9aa2cc;letter-spacing:2px;font-size:13px">GLOW EFFECT</h3>' + '<div class="customize-grid" id="glowGrid"></div>';
  var colors = [{
    id: '47',
    name: 'Default',
    price: 0
  }, {
    id: '0',
    name: 'Red',
    price: 5000
  }, {
    id: '120',
    name: 'Green',
    price: 5000
  }, {
    id: '200',
    name: 'Blue',
    price: 5000
  }, {
    id: '280',
    name: 'Purple',
    price: 10000
  }, {
    id: '60',
    name: 'Gold',
    price: 25000
  }, {
    id: '180',
    name: 'Cyan',
    price: 50000
  }, {
    id: '300',
    name: 'Magenta',
    price: 100000
  }];
  var trails = [{
    id: 'none',
    name: 'None',
    price: 0
  }, {
    id: 'sparkle',
    name: 'Sparkle',
    price: 25000
  }, {
    id: 'fire',
    name: 'Fire',
    price: 100000
  }, {
    id: 'rainbow',
    name: 'Rainbow',
    price: 500000
  }, {
    id: 'golden',
    name: 'Golden Sparkle',
    price: 0,
    store: true
  }];
  var glows = [{
    id: 'none',
    name: 'None',
    price: 0
  }, {
    id: 'soft',
    name: 'Soft Glow',
    price: 50000
  }, {
    id: 'bright',
    name: 'Bright Glow',
    price: 250000
  }, {
    id: 'pulsing',
    name: 'Pulsing Glow',
    price: 1000000
  }];
  function renderOption(type, options, containerId, current) {
    var container = $(containerId);
    container.innerHTML = '';
    options.forEach(function (opt) {
      var storeOwned = opt.store ? ownedProducts.indexOf('golden-sparkle') !== -1 : false;
      var owned = opt.price === 0 && !opt.store || current === opt.id || storeOwned;
      var canAfford = money >= opt.price;
      var selected = current === opt.id;
      var btn = document.createElement('button');
      btn.className = 'customize-option' + (selected ? ' selected' : '');
      btn.style.backgroundColor = type === 'color' ? 'hsl(' + opt.id + ', 70%, 50%)' : '#2a2d3e';
      btn.innerHTML = '<div class="co-name">' + opt.name + '</div>' + '<div class="co-price">' + (owned ? 'OWNED' : opt.store ? '$2.99' : '$' + fmt(opt.price)) + '</div>';
      if (!owned && opt.store) {
        btn.classList.add('disabled');
        btn.title = 'Available in the Store';
        btn.addEventListener('click', function () {
          return openDashPanel('store');
        });
      } else if (!owned && !canAfford) {
        btn.classList.add('disabled');
      } else if (!selected) {
        btn.addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee2() {
          var r, _t2;
          return _regenerator().w(function (_context2) {
            while (1) switch (_context2.p = _context2.n) {
              case 0:
                _context2.p = 0;
                btn.classList.add('loading');
                _context2.n = 1;
                return api('/customize', {
                  method: 'POST',
                  body: JSON.stringify({
                    type: type,
                    id: opt.id
                  })
                });
              case 1:
                r = _context2.v;
                state = r.state;
                renderCustomizePanel();
                toast('CUSTOMIZED', opt.name + ' applied!', null, '#7bdc78');
                _context2.n = 3;
                break;
              case 2:
                _context2.p = 2;
                _t2 = _context2.v;
                toast('OOPS', _t2.message, null, '#ff6b8a');
                btn.classList.remove('loading');
              case 3:
                return _context2.a(2);
            }
          }, _callee2, null, [[0, 2]]);
        })));
      }
      container.appendChild(btn);
    });
  }
  renderOption('color', colors, 'colorGrid', state.customColor || '47');
  renderOption('trail', trails, 'trailGrid', state.customTrail || 'none');
  renderOption('glow', glows, 'glowGrid', state.customGlow || 'none');
}
function renderStorePanel() {
  return _renderStorePanel.apply(this, arguments);
}
function _renderStorePanel() {
  _renderStorePanel = _asyncToGenerator(_regenerator().m(function _callee24() {
    var p, r, html, _iterator13, _step13, prod, _t21;
    return _regenerator().w(function (_context24) {
      while (1) switch (_context24.p = _context24.n) {
        case 0:
          p = $('dashPanel');
          p.classList.remove('hidden');
          p.innerHTML = '<div class="spinner">Loading store...</div>';
          _context24.p = 1;
          _context24.n = 2;
          return api('/store');
        case 2:
          r = _context24.v;
          if (r.stripeReady) {
            _context24.n = 3;
            break;
          }
          p.innerHTML = '<h3>Store</h3><div class="empty-note" style="padding:8px 4px 14px">The store is not configured on the server yet.</div>';
          return _context24.a(2);
        case 3:
          html = '<h3>Store</h3><div style="width:100%;display:flex;flex-direction:column;gap:12px">';
          _iterator13 = _createForOfIteratorHelper(r.products);
          try {
            for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
              prod = _step13.value;
              html += '<div class="quest" style="display:flex;flex-direction:column;gap:8px">' + '<div style="display:flex;justify-content:space-between;align-items:center;gap:10px">' + '<div><div style="font-weight:800;font-size:15px;color:#ffd76a">&#10024; ' + esc(prod.name) + '</div>' + '<div style="font-size:12px;color:#8b93bd;margin-top:3px">' + esc(prod.description) + '</div></div>' + '<div style="font-weight:800;font-size:18px;color:#7bdc78;white-space:nowrap">$' + (prod.priceCents / 100).toFixed(2) + '</div>' + '</div>' + '<div class="inline-form" style="margin:0">' + '<input id="promoInput" maxlength="24" autocomplete="off" placeholder="Promo code (optional)" style="flex:1;min-width:140px">' + (prod.owned ? '<button class="btn green" data-equip="' + prod.id + '" type="button">EQUIP</button>' : '<button class="btn" data-buy="' + prod.id + '" type="button">BUY</button>') + '</div>' + (prod.owned ? '<div style="font-size:11px;color:#7bdc78;font-weight:700;letter-spacing:1px">OWNED</div>' : '') + '</div>';
            }
          } catch (err) {
            _iterator13.e(err);
          } finally {
            _iterator13.f();
          }
          html += '</div><div class="empty-note" style="padding:10px 4px 0">Secure checkout by Stripe. Promo code <b>FRIENDSAREW</b> makes it free!</div>';
          p.innerHTML = html;
          p.querySelectorAll('[data-buy]').forEach(function (btn) {
            return btn.addEventListener('click', function () {
              return buyProduct(btn.dataset.buy);
            });
          });
          p.querySelectorAll('[data-equip]').forEach(function (btn) {
            return btn.addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee23() {
              var r2, _t20;
              return _regenerator().w(function (_context23) {
                while (1) switch (_context23.p = _context23.n) {
                  case 0:
                    _context23.p = 0;
                    _context23.n = 1;
                    return api('/customize', {
                      method: 'POST',
                      body: JSON.stringify({
                        type: 'trail',
                        id: 'golden'
                      })
                    });
                  case 1:
                    r2 = _context23.v;
                    state = r2.state;
                    toast('EQUIPPED', 'Golden Sparkle is now active', null, '#ffd76a');
                    renderStorePanel();
                    _context23.n = 3;
                    break;
                  case 2:
                    _context23.p = 2;
                    _t20 = _context23.v;
                    toast('OOPS', _t20.message, null, '#ff6b8a');
                  case 3:
                    return _context23.a(2);
                }
              }, _callee23, null, [[0, 2]]);
            })));
          });
          _context24.n = 5;
          break;
        case 4:
          _context24.p = 4;
          _t21 = _context24.v;
          p.innerHTML = '<h3>Store</h3><div class="empty-note" style="padding:8px 4px 14px">' + esc(_t21.message || 'Could not load store') + '</div>';
        case 5:
          return _context24.a(2);
      }
    }, _callee24, null, [[1, 4]]);
  }));
  return _renderStorePanel.apply(this, arguments);
}
function buyProduct(_x5) {
  return _buyProduct.apply(this, arguments);
}
function _buyProduct() {
  _buyProduct = _asyncToGenerator(_regenerator().m(function _callee25(productId) {
    var promoInput, promoCode, r, _t22;
    return _regenerator().w(function (_context25) {
      while (1) switch (_context25.p = _context25.n) {
        case 0:
          promoInput = $('promoInput');
          promoCode = promoInput ? promoInput.value.trim() : '';
          _context25.p = 1;
          _context25.n = 2;
          return api('/store/checkout', {
            method: 'POST',
            body: JSON.stringify({
              productId: productId,
              promoCode: promoCode
            })
          });
        case 2:
          r = _context25.v;
          if (r.url) window.location.href = r.url;
          _context25.n = 4;
          break;
        case 3:
          _context25.p = 3;
          _t22 = _context25.v;
          toast('OOPS', _t22.message, null, '#ff6b8a');
        case 4:
          return _context25.a(2);
      }
    }, _callee25, null, [[1, 3]]);
  }));
  return _buyProduct.apply(this, arguments);
}
function checkPurchaseReturn() {
  return _checkPurchaseReturn.apply(this, arguments);
}
function _checkPurchaseReturn() {
  _checkPurchaseReturn = _asyncToGenerator(_regenerator().m(function _callee26() {
    var params, sessionId, qs, r, _t23;
    return _regenerator().w(function (_context26) {
      while (1) switch (_context26.p = _context26.n) {
        case 0:
          params = new URLSearchParams(window.location.search);
          if (!(params.get('purchase') !== 'success')) {
            _context26.n = 1;
            break;
          }
          return _context26.a(2);
        case 1:
          sessionId = params.get('session_id');
          params.delete('purchase');
          params.delete('session_id');
          qs = params.toString();
          history.replaceState(null, '', window.location.pathname + (qs ? '?' + qs : ''));
          if (sessionId) {
            _context26.n = 2;
            break;
          }
          return _context26.a(2);
        case 2:
          _context26.p = 2;
          _context26.n = 3;
          return api('/store/verify?session_id=' + encodeURIComponent(sessionId));
        case 3:
          r = _context26.v;
          state = r.state;
          ownedProducts = r.ownedProducts || ownedProducts;
          renderDash();
          toast('PURCHASE COMPLETE', "Golden Sparkle unlocked \u2014 check Customize to equip it", null, '#ffd76a');
          _context26.n = 5;
          break;
        case 4:
          _context26.p = 4;
          _t23 = _context26.v;
          toast('OOPS', _t23.message || 'Could not verify purchase', null, '#ff6b8a');
        case 5:
          return _context26.a(2);
      }
    }, _callee26, null, [[2, 4]]);
  }));
  return _checkPurchaseReturn.apply(this, arguments);
}
function play() {
  return _play.apply(this, arguments);
}
function _play() {
  _play = _asyncToGenerator(_regenerator().m(function _callee27() {
    var p, _yield$api, servers, target, created, _t24;
    return _regenerator().w(function (_context27) {
      while (1) switch (_context27.p = _context27.n) {
        case 0:
          _context27.p = 0;
          p = $('dashPanel');
          p.classList.remove('hidden');
          p.innerHTML = '<div class="spinner">Finding an open world...</div>';
          _context27.n = 1;
          return api('/servers');
        case 1:
          _yield$api = _context27.v;
          servers = _yield$api.servers;
          target = servers.find(function (s) {
            return s.members < s.capacity;
          });
          if (!target && servers.length) target = servers[0];
          if (target) {
            _context27.n = 3;
            break;
          }
          _context27.n = 2;
          return api('/servers', {
            method: 'POST',
            body: JSON.stringify({
              name: 'Keepers World'
            })
          });
        case 2:
          created = _context27.v;
          target = created.server;
        case 3:
          _context27.n = 4;
          return enterServer(target.id, 'World ' + target.id);
        case 4:
          refreshEvent();
          _context27.n = 6;
          break;
        case 5:
          _context27.p = 5;
          _t24 = _context27.v;
          toast('OOPS', _t24.message, null, '#ff6b8a');
        case 6:
          return _context27.a(2);
      }
    }, _callee27, null, [[0, 5]]);
  }));
  return _play.apply(this, arguments);
}
function renderServersPanel() {
  return _renderServersPanel.apply(this, arguments);
}
function _renderServersPanel() {
  _renderServersPanel = _asyncToGenerator(_regenerator().m(function _callee29() {
    var p, _yield$api2, servers, html, _iterator14, _step14, s, full, _t26;
    return _regenerator().w(function (_context29) {
      while (1) switch (_context29.p = _context29.n) {
        case 0:
          p = $('dashPanel');
          _context29.p = 1;
          _context29.n = 2;
          return api('/servers');
        case 2:
          _yield$api2 = _context29.v;
          servers = _yield$api2.servers;
          html = '<h3>Open Servers</h3>' + '<div class="inline-form"><input id="newServerName" maxlength="40" placeholder="New world name"><button class="btn green" id="createServerBtn" type="button">Create World</button></div>';
          if (!servers.length) html += '<div class="empty-note">No open servers yet. Create one!</div>';
          _iterator14 = _createForOfIteratorHelper(servers);
          try {
            for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
              s = _step14.value;
              full = s.members >= s.capacity;
              html += '<div class="row"><div><div class="name">World ' + s.id + '</div>' + '<div class="meta">' + s.members + ' / ' + s.capacity + ' keepers</div></div>' + '<button class="btn ' + (full ? 'ghost' : 'green') + '" data-join="' + s.id + '" ' + (full ? 'disabled' : '') + '>' + (full ? 'Full' : 'Join') + '</button></div>';
            }
          } catch (err) {
            _iterator14.e(err);
          } finally {
            _iterator14.f();
          }
          p.innerHTML = html;
          p.querySelector('#createServerBtn').addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee28() {
            var name, _t25;
            return _regenerator().w(function (_context28) {
              while (1) switch (_context28.p = _context28.n) {
                case 0:
                  name = (p.querySelector('#newServerName').value || '').trim() || 'My World';
                  _context28.p = 1;
                  _context28.n = 2;
                  return api('/servers', {
                    method: 'POST',
                    body: JSON.stringify({
                      name: name
                    })
                  });
                case 2:
                  renderServersPanel();
                  _context28.n = 4;
                  break;
                case 3:
                  _context28.p = 3;
                  _t25 = _context28.v;
                  toast('OOPS', _t25.message, null, '#ff6b8a');
                case 4:
                  return _context28.a(2);
              }
            }, _callee28, null, [[1, 3]]);
          })));
          p.querySelectorAll('[data-join]').forEach(function (b) {
            return b.addEventListener('click', function () {
              enterServer(parseInt(b.dataset.join, 10), 'World ' + b.dataset.join);
            });
          });
          _context29.n = 4;
          break;
        case 3:
          _context29.p = 3;
          _t26 = _context29.v;
          p.innerHTML = '<div class="empty-note">' + esc(_t26.message) + '</div>';
        case 4:
          return _context29.a(2);
      }
    }, _callee29, null, [[1, 3]]);
  }));
  return _renderServersPanel.apply(this, arguments);
}
function renderFriendsPanel() {
  return _renderFriendsPanel.apply(this, arguments);
}
function _renderFriendsPanel() {
  _renderFriendsPanel = _asyncToGenerator(_regenerator().m(function _callee33() {
    var p, data, html, _iterator15, _step15, f, _iterator16, _step16, _f, _iterator17, _step17, _f2, _t30;
    return _regenerator().w(function (_context33) {
      while (1) switch (_context33.p = _context33.n) {
        case 0:
          p = $('dashPanel');
          _context33.p = 1;
          _context33.n = 2;
          return api('/friends');
        case 2:
          data = _context33.v;
          html = '<h3>Friends</h3>' + '<div class="inline-form"><input id="friendName" maxlength="20" placeholder="Add by username"><button class="btn" id="addFriendBtn" type="button">Send Request</button></div>';
          if (data.incoming.length) {
            html += '<h3 style="margin-top:18px">Requests to you</h3>';
            _iterator15 = _createForOfIteratorHelper(data.incoming);
            try {
              for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
                f = _step15.value;
                html += '<div class="row"><div><div class="name">' + esc(f.username) + '</div><div class="meta">wants to be friends</div></div>' + '<span><button class="btn green" data-accept="' + f.id + '" type="button">Accept</button> <button class="btn ghost" data-remove="' + f.id + '" type="button">Decline</button></span></div>';
              }
            } catch (err) {
              _iterator15.e(err);
            } finally {
              _iterator15.f();
            }
          }
          if (data.outgoing.length) {
            html += '<h3 style="margin-top:18px">Sent</h3>';
            _iterator16 = _createForOfIteratorHelper(data.outgoing);
            try {
              for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
                _f = _step16.value;
                html += '<div class="row"><div class="name">' + esc(_f.username) + '</div><span class="pill off">pending</span></div>';
              }
            } catch (err) {
              _iterator16.e(err);
            } finally {
              _iterator16.f();
            }
          }
          html += '<h3 style="margin-top:18px">Your Friends</h3>';
          if (!data.friends.length) html += '<div class="empty-note">No friends yet. Add someone above.</div>';
          _iterator17 = _createForOfIteratorHelper(data.friends);
          try {
            for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
              _f2 = _step17.value;
              html += '<div class="row"><div><div class="name">' + esc(_f2.username) + '</div>' + '<div class="meta"><span class="status-dot ' + (_f2.online ? 'on' : 'off') + '"></span>' + (_f2.online ? 'Online now' : 'Offline') + '</div></div>' + '<span><span class="pill on">friend</span> <button class="btn ghost" data-remove="' + _f2.id + '" type="button">Remove</button></span></div>';
            }
          } catch (err) {
            _iterator17.e(err);
          } finally {
            _iterator17.f();
          }
          p.innerHTML = html;
          p.querySelector('#addFriendBtn').addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee30() {
            var username, _t27;
            return _regenerator().w(function (_context30) {
              while (1) switch (_context30.p = _context30.n) {
                case 0:
                  username = (p.querySelector('#friendName').value || '').trim();
                  _context30.p = 1;
                  _context30.n = 2;
                  return api('/friends/request', {
                    method: 'POST',
                    body: JSON.stringify({
                      username: username
                    })
                  });
                case 2:
                  toast('REQUEST SENT', username, null, '#4fd1ff');
                  renderFriendsPanel();
                  _context30.n = 4;
                  break;
                case 3:
                  _context30.p = 3;
                  _t27 = _context30.v;
                  toast('OOPS', _t27.message, null, '#ff6b8a');
                case 4:
                  return _context30.a(2);
              }
            }, _callee30, null, [[1, 3]]);
          })));
          p.querySelectorAll('[data-accept]').forEach(function (b) {
            return b.addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee31() {
              var _t28;
              return _regenerator().w(function (_context31) {
                while (1) switch (_context31.p = _context31.n) {
                  case 0:
                    _context31.p = 0;
                    _context31.n = 1;
                    return api('/friends/' + b.dataset.accept + '/accept', {
                      method: 'POST'
                    });
                  case 1:
                    renderFriendsPanel();
                    _context31.n = 3;
                    break;
                  case 2:
                    _context31.p = 2;
                    _t28 = _context31.v;
                  case 3:
                    return _context31.a(2);
                }
              }, _callee31, null, [[0, 2]]);
            })));
          });
          p.querySelectorAll('[data-remove]').forEach(function (b) {
            return b.addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee32() {
              var _t29;
              return _regenerator().w(function (_context32) {
                while (1) switch (_context32.p = _context32.n) {
                  case 0:
                    _context32.p = 0;
                    _context32.n = 1;
                    return api('/friends/' + b.dataset.remove, {
                      method: 'DELETE'
                    });
                  case 1:
                    renderFriendsPanel();
                    _context32.n = 3;
                    break;
                  case 2:
                    _context32.p = 2;
                    _t29 = _context32.v;
                  case 3:
                    return _context32.a(2);
                }
              }, _callee32, null, [[0, 2]]);
            })));
          });
          _context33.n = 4;
          break;
        case 3:
          _context33.p = 3;
          _t30 = _context33.v;
          p.innerHTML = '<div class="empty-note">' + esc(_t30.message) + '</div>';
        case 4:
          return _context33.a(2);
      }
    }, _callee33, null, [[1, 3]]);
  }));
  return _renderFriendsPanel.apply(this, arguments);
}
function esc(s) {
  return String(s).replace(/[&<>"']/g, function (c) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c];
  });
}
function enterServer(_x6, _x7) {
  return _enterServer.apply(this, arguments);
}
function _enterServer() {
  _enterServer = _asyncToGenerator(_regenerator().m(function _callee34(sid, name) {
    var r, savedOk, b, _t31, _t32;
    return _regenerator().w(function (_context34) {
      while (1) switch (_context34.p = _context34.n) {
        case 0:
          _context34.p = 0;
          _context34.n = 1;
          return api('/servers/' + sid + '/join', {
            method: 'POST'
          });
        case 1:
          r = _context34.v;
          mySlot = r.slot;
          currentServer = {
            id: sid
          };
          state.tutorialDone = tutorialDone;
          savedOk = state.px > WALL && state.px < WORLD_W - WALL && state.py > WALL && state.py < WORLD_H - WALL;
          if (!savedOk || !tutorialDone) {
            player.x = SPAWN.x;
            player.y = SPAWN.y;
          } else {
            player.x = state.px;
            player.y = state.py;
          }
          showScreen('game');
          resize();
          transitionTo('World ' + currentServer.id);
          $('hint').textContent = "WASD / Arrows to walk \xB7 E to open your vault";
          connectWS();
          refreshTutorial();
          renderVault();
          addChat('sys', 'You joined World ' + currentServer.id + ' (slot ' + (mySlot + 1) + '/8).');
          refreshEvent();
          _context34.p = 2;
          _context34.n = 3;
          return api('/boss');
        case 3:
          b = _context34.v;
          if (b) {
            if (b.boss) onBoss(b.boss);
            setBossYou(b.you);
          }
          _context34.n = 5;
          break;
        case 4:
          _context34.p = 4;
          _t31 = _context34.v;
        case 5:
          _context34.n = 7;
          break;
        case 6:
          _context34.p = 6;
          _t32 = _context34.v;
          toast('OOPS', _t32.message, null, '#ff6b8a');
        case 7:
          return _context34.a(2);
      }
    }, _callee34, null, [[2, 4], [0, 6]]);
  }));
  return _enterServer.apply(this, arguments);
}
function connectWS() {
  disconnectWS();
  var proto = location.protocol === 'https:' ? 'wss' : 'ws';
  var sock = new WebSocket(proto + '://' + location.host + '/ws?token=' + encodeURIComponent(token));
  ws = sock;
  sock.addEventListener('open', function () {
    if (sock !== ws || !currentServer) return;
    sock.send(JSON.stringify({
      type: 'join',
      serverId: currentServer.id,
      x: player.x,
      y: player.y
    }));
  });
  sock.addEventListener('message', function (ev) {
    if (sock !== ws) return;
    var msg;
    try {
      msg = JSON.parse(ev.data);
    } catch (e) {
      return;
    }
    if (msg.type === 'members') onMembers(msg.members);else if (msg.type === 'move') onRemoteMove(msg);else if (msg.type === 'say') addChat('chat', msg.name, msg.text);else if (msg.type === 'boss') onBoss(msg.boss);else if (msg.type === 'bossDefeated') onBossDefeated(msg.boss);else if (msg.type === 'breached') onBreached(msg);else if (msg.type === 'tradeRequest') onTradeRequest(msg);else if (msg.type === 'tradeOpened') onTradeOpened(msg);else if (msg.type === 'tradeDone') onTradeDone(msg);else if (msg.type === 'tradeCancelled') onTradeCancelled(msg);else if (msg.type === 'tradeDeclined') onTradeDeclined(msg);else if (msg.type === 'tradeUpdate') pollTrade();else if (msg.type === 'electric' || msg.type === 'electricNotice') onElectricMsg(msg);else if (msg.type === 'wheel') onWheelMsg(msg);else if (msg.type === 'restart') onRestart();else if (msg.type === 'reload') location.reload();else if (msg.type === 'announce') announce(msg.text);else if (msg.type === 'adminGift') {
      toast('GIFT', msg.text || 'An admin gave you an item', null, '#4fd1ff');
      if (state) refreshState().catch(function () {});
    } else if (msg.type === 'sayDenied') {
      toast('CHAT', msg.reason, null, '#ff6b8a');
    }
  });
  sock.addEventListener('close', function () {
    var _ref3 = _asyncToGenerator(_regenerator().m(function _callee3(ev) {
      var _t3, _t4;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.p = _context3.n) {
          case 0:
            if (!(sock !== ws)) {
              _context3.n = 1;
              break;
            }
            return _context3.a(2);
          case 1:
            if (!(ev.code === 4003)) {
              _context3.n = 2;
              break;
            }
            toast('BANNED', 'You have been banned by an admin.', null, '#ff6b8a');
            token = null;
            localStorage.removeItem('vaultoria_token');
            setTimeout(function () {
              return location.reload();
            }, 1200);
            return _context3.a(2);
          case 2:
            if (!(ev.code === 4004)) {
              _context3.n = 7;
              break;
            }
            toast('REMOVED', 'An admin kicked you from the world.', null, '#ff6b8a');
            currentServer = null;
            mySlot = -1;
            _context3.p = 3;
            _context3.n = 4;
            return loadMe();
          case 4:
            _context3.n = 6;
            break;
          case 5:
            _context3.p = 5;
            _t3 = _context3.v;
          case 6:
            showScreen('dash');
            return _context3.a(2);
          case 7:
            if (!(inGame && token && currentServer)) {
              _context3.n = 12;
              break;
            }
            _context3.p = 8;
            _context3.n = 9;
            return api('/servers/' + currentServer.id + '/join', {
              method: 'POST'
            });
          case 9:
            _context3.n = 11;
            break;
          case 10:
            _context3.p = 10;
            _t4 = _context3.v;
          case 11:
            if (inGame && currentServer && ws === sock) {
              clearTimeout(wsTimer);
              wsTimer = setTimeout(connectWS, 1200);
            }
          case 12:
            return _context3.a(2);
        }
      }, _callee3, null, [[8, 10], [3, 5]]);
    }));
    return function (_x8) {
      return _ref3.apply(this, arguments);
    };
  }());
  sock.addEventListener('error', function () {});
}
function disconnectWS() {
  clearTimeout(wsTimer);
  if (ws) {
    var old = ws;
    ws = null;
    try {
      old.close();
    } catch (e) {}
  }
  for (var k in others) {
    delete others[k];
    trailClear(k);
  }
  trailClear('me');
  members = [];
}
function wsSend(obj) {
  if (ws && ws.readyState === 1) ws.send(JSON.stringify(obj));
}
function onMembers(list) {
  members = list;
  var seen = {};
  var _iterator2 = _createForOfIteratorHelper(list),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var m = _step2.value;
      seen[m.id] = true;
      if (m.id === me.id) continue;
      if (!m.online) continue;
      if (!others[m.id]) {
        var vp = VAULT_POS[m.slot] || SPAWN;
        others[m.id] = {
          id: m.id,
          username: m.username,
          slot: m.slot,
          x: m.x == null ? vp.x : m.x,
          y: m.y == null ? vp.y : m.y,
          tx: m.x == null ? vp.x : m.x,
          ty: m.y == null ? vp.y : m.y,
          online: m.online,
          moving: false,
          facing: {
            x: 1,
            y: 0
          },
          walk: 0,
          hue: (m.slot * 47 + 180) % 360,
          customColor: m.customColor || null,
          customTrail: m.customTrail || 'none'
        };
      } else {
        others[m.id].online = m.online;
        others[m.id].customColor = m.customColor || null;
        others[m.id].customTrail = m.customTrail || 'none';
        if (m.x != null) {
          others[m.id].tx = m.x;
          others[m.id].ty = m.y;
        }
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  for (var id in others) if (!seen[id]) {
    delete others[id];
    trailClear(id);
  }
  updateHudMeta();
}
function onRemoteMove(msg) {
  var o = others[msg.id];
  if (!o) return;
  o.tx = msg.x;
  o.ty = msg.y;
  o.moving = msg.moving;
  o.facing = msg.facing || o.facing;
  o.zone = msg.zone || 'world';
}
function renderBossUi() {
  var bar = $('bossBar');
  var nameEl = $('bossName');
  var hpEl = $('bossHp');
  var maxEl = $('bossMaxHp');
  var fillEl = $('bossFill');
  var poolEl = $('bossPool');
  var payoutEl = $('bossPayout');
  if (!bar || !bossState) {
    if (bar) bar.classList.add('hidden');
    return;
  }
  var hp = Math.max(0, Number(bossState.hp) || 0);
  var maxHp = Math.max(1, Number(bossState.maxHp) || Number(bossState.max_hp) || hp);
  if (nameEl) nameEl.textContent = bossState.name || 'World Boss';
  if (hpEl) hpEl.textContent = fmt(hp);
  if (maxEl) maxEl.textContent = fmt(maxHp);
  if (fillEl) fillEl.style.width = Math.max(0, Math.min(100, hp / maxHp * 100)) + '%';
  if (poolEl) poolEl.textContent = fmt(bossState.poolValue || 0);
  if (payoutEl) payoutEl.textContent = fmt(bossState.youPayout || 0);
  bar.classList.remove('hidden');
}
function updateHudMeta() {
  var online = members.filter(function (m) {
    return m.online;
  }).length || (inGame ? 1 : 0);
  $('hudServer').textContent = currentServer ? 'World ' + currentServer.id : 'World';
  $('hudOnline').textContent = online + ' / ' + SERVER_CAPACITY + ' online';
  renderBossUi();
}
var canvas = $('game');
var ctx = canvas.getContext('2d');
var viewW = 0,
  viewH = 0,
  dpr = 1;
var camX = 0,
  camY = 0,
  camSet = false;
var lastStep = 0,
  lastSent = 0;
var player = {
  x: SPAWN.x,
  y: SPAWN.y,
  w: 40,
  h: 58,
  facing: {
    x: 1,
    y: 0
  },
  walk: 0,
  moving: false
};
var solidList = [];
var MOTES = [];
(function () {
  var cols = ['#4fd1ff', '#b14dff', '#ffb648', '#7bdc78', '#ffffff'];
  for (var i = 0; i < 52; i++) {
    MOTES.push({
      x: Math.random() * WORLD_W,
      y: Math.random() * WORLD_H,
      r: 0.8 + Math.random() * 1.8,
      a: 0.15 + Math.random() * 0.35,
      p: Math.random() * Math.PI * 2,
      sp: 1200 + Math.random() * 2600,
      sp2: 1500 + Math.random() * 3000,
      tw: 800 + Math.random() * 1800,
      rise: 4 + Math.random() * 14,
      color: cols[i % cols.length]
    });
  }
})();
function addSolid(x, y, w, h) {
  solidList.push({
    x: x,
    y: y,
    w: w,
    h: h
  });
}
function buildSolids() {
  solidList.length = 0;
  addSolid(0, 0, WORLD_W, WALL);
  addSolid(0, WORLD_H - WALL, WORLD_W, WALL);
  addSolid(0, 0, WALL, WORLD_H);
  addSolid(WORLD_W - WALL, 0, WALL, WORLD_H);
  addSolid(1350, 140, 100, 100);
  addSolid(1350, 1460, 100, 100);
  addSolid(660, 800, 100, 100);
  addSolid(2040, 800, 100, 100);
}
function aabb(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function solidAt(body) {
  var _iterator3 = _createForOfIteratorHelper(solidList),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var s = _step3.value;
      if (aabb(body, s)) return true;
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  return false;
}
function movePlayer(dx, dy) {
  var nx = {
    x: player.x + dx,
    y: player.y,
    w: player.w,
    h: player.h
  };
  if (nx.x >= WALL && nx.x + nx.w <= WORLD_W - WALL && !solidAt(nx)) player.x = nx.x;
  var ny = {
    x: player.x,
    y: player.y + dy,
    w: player.w,
    h: player.h
  };
  if (ny.y >= WALL && ny.y + ny.h <= WORLD_H - WALL && !solidAt(ny)) player.y = ny.y;
}
var keys = {};
window.addEventListener('keydown', function (e) {
  var k = e.key.toLowerCase();
  if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' '].indexOf(k) !== -1) {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
    e.preventDefault();
  }
  if (document.activeElement && document.activeElement.tagName === 'INPUT' && k !== 'escape') return;
  if (k === 'e' && !e.repeat) {
    triggerInteract();
    return;
  }
  if (k === 'escape') {
    closeAllModals();
    return;
  }
  keys[k] = true;
  ac();
});
window.addEventListener('keyup', function (e) {
  keys[e.key.toLowerCase()] = false;
});
window.addEventListener('blur', function () {
  for (var k in keys) keys[k] = false;
});
function triggerInteract() {
  if (!inGame || anyModalOpen()) return;
  ac();
  if (eventActive() && nearWheel()) openWheel();else toggleVault();
}
(function initMobileControls() {
  if (!isMobile) return;
  var stick = $('joystick');
  var knob = $('joystickKnob');
  var eBtn = $('mobileEBtn');
  if (!stick || !knob) return;
  var active = false,
    pid = null;
  function apply(ev) {
    var rect = stick.getBoundingClientRect();
    var max = rect.width / 2;
    var dx = ev.clientX - (rect.left + rect.width / 2);
    var dy = ev.clientY - (rect.top + rect.height / 2);
    var dist = Math.hypot(dx, dy);
    if (dist > max) {
      dx = dx / dist * max;
      dy = dy / dist * max;
    }
    knob.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
    var dead = max * 0.28;
    keys.d = dx > dead;
    keys.a = dx < -dead;
    keys.s = dy > dead;
    keys.w = dy < -dead;
  }
  function reset() {
    active = false;
    pid = null;
    knob.style.transform = 'translate(0px,0px)';
    keys.d = keys.a = keys.s = keys.w = false;
  }
  if (window.PointerEvent) {
    stick.addEventListener('pointerdown', function (e) {
      if (!inGame) return;
      active = true;
      pid = e.pointerId;
      try {
        stick.setPointerCapture(e.pointerId);
      } catch (err) {}
      ac();
      apply(e);
      e.preventDefault();
    });
    stick.addEventListener('pointermove', function (e) {
      if (!active || e.pointerId !== pid) return;
      apply(e);
      e.preventDefault();
    });
    stick.addEventListener('pointerup', function (e) {
      if (e.pointerId === pid) reset();
    });
    stick.addEventListener('pointercancel', function (e) {
      if (e.pointerId === pid) reset();
    });
    if (eBtn) eBtn.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      triggerInteract();
    });
  } else {
    var firstTouch = function firstTouch(e) {
      return e.touches[0] || e.changedTouches[0];
    };
    stick.addEventListener('touchstart', function (e) {
      if (!inGame) return;
      var t = firstTouch(e);
      if (!t) return;
      active = true;
      ac();
      apply(t);
      e.preventDefault();
    }, false);
    stick.addEventListener('touchmove', function (e) {
      if (!active) return;
      var t = firstTouch(e);
      if (!t) return;
      apply(t);
      e.preventDefault();
    }, false);
    stick.addEventListener('touchend', reset, false);
    stick.addEventListener('touchcancel', reset, false);
    if (eBtn) eBtn.addEventListener('touchstart', function (e) {
      e.preventDefault();
      triggerInteract();
    }, false);
  }
})();
function resize() {
  dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  viewW = window.innerWidth;
  viewH = window.innerHeight;
}
window.addEventListener('resize', resize);
function nearMyVault() {
  if (mySlot < 0) return false;
  var p = VAULT_POS[mySlot];
  var cx = player.x + player.w / 2,
    cy = player.y + player.h / 2;
  return Math.hypot(cx - p.x, cy - p.y) < 96;
}
function vaultAtPosition(slot) {
  return members.find(function (m) {
    return m.slot === slot;
  }) || null;
}
function rr(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function drawFloor() {
  var g = ctx.createLinearGradient(0, 0, 0, WORLD_H);
  g.addColorStop(0, '#111634');
  g.addColorStop(0.5, '#0d1027');
  g.addColorStop(1, '#080a18');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, WORLD_W, WORLD_H);
  var tile = 160;
  ctx.fillStyle = 'rgba(124,92,255,0.028)';
  for (var x = 0; x < WORLD_W; x += tile) {
    for (var y = 0; y < WORLD_H; y += tile) {
      if ((x / tile + y / tile) % 2 === 0) ctx.fillRect(x, y, tile, tile);
    }
  }
  ctx.strokeStyle = 'rgba(124,92,255,0.06)';
  ctx.lineWidth = 1;
  for (var _x9 = 0; _x9 <= WORLD_W; _x9 += 80) {
    ctx.beginPath();
    ctx.moveTo(_x9, 0);
    ctx.lineTo(_x9, WORLD_H);
    ctx.stroke();
  }
  for (var _y = 0; _y <= WORLD_H; _y += 80) {
    ctx.beginPath();
    ctx.moveTo(0, _y);
    ctx.lineTo(WORLD_W, _y);
    ctx.stroke();
  }
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = "800 90px 'Segoe UI', sans-serif";
  ctx.fillStyle = 'rgba(124,92,255,0.07)';
  ctx.shadowColor = 'rgba(124,92,255,0.5)';
  ctx.shadowBlur = 40;
  ctx.fillText('VAULTORIA', WORLD_W / 2, WORLD_H / 2 - 20);
  ctx.font = "800 30px 'Segoe UI', sans-serif";
  ctx.fillStyle = 'rgba(79,209,255,0.08)';
  ctx.fillText('THE SHARED WORLD', WORLD_W / 2, WORLD_H / 2 + 40);
  ctx.restore();
  ctx.save();
  ctx.translate(WORLD_W / 2, WORLD_H / 2 - 20);
  ctx.strokeStyle = 'rgba(79,209,255,0.06)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 230, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 300, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}
function drawMotes(now) {
  ctx.save();
  var _iterator4 = _createForOfIteratorHelper(MOTES),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var m = _step4.value;
      var dx = Math.sin(now / m.sp + m.p) * 26;
      var dy = Math.cos(now / m.sp2 + m.p) * 20 - now / 1000 * m.rise % (WORLD_H + 200);
      var y = ((m.y + dy) % (WORLD_H + 80) + WORLD_H + 80) % (WORLD_H + 80) - 40;
      var x = ((m.x + dx) % (WORLD_W + 80) + WORLD_W + 80) % (WORLD_W + 80) - 40;
      var tw = 0.35 + 0.65 * Math.abs(Math.sin(now / m.tw + m.p));
      ctx.globalAlpha = m.a * tw;
      ctx.fillStyle = m.color;
      ctx.shadowColor = m.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, y, m.r, 0, Math.PI * 2);
      ctx.fill();
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  ctx.restore();
  ctx.globalAlpha = 1;
}
function drawWall(s) {
  var g = ctx.createLinearGradient(s.x, s.y, s.x, s.y + s.h);
  g.addColorStop(0, '#262a48');
  g.addColorStop(1, '#14172b');
  ctx.fillStyle = g;
  ctx.fillRect(s.x, s.y, s.w, s.h);
  var hl = ctx.createLinearGradient(s.x, s.y, s.x, s.y + Math.min(8, s.h));
  hl.addColorStop(0, 'rgba(150,160,220,0.35)');
  hl.addColorStop(1, 'rgba(150,160,220,0)');
  ctx.fillStyle = hl;
  ctx.fillRect(s.x, s.y, s.w, Math.min(8, s.h));
  if (s.w > 30 && s.h > 30) {
    ctx.strokeStyle = 'rgba(124,92,255,0.10)';
    ctx.lineWidth = 1;
    ctx.strokeRect(s.x + 6, s.y + 6, s.w - 12, s.h - 12);
  }
  ctx.strokeStyle = 'rgba(124,92,255,0.35)';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(124,92,255,0.5)';
  ctx.shadowBlur = 10;
  ctx.strokeRect(s.x, s.y, s.w, s.h);
  ctx.shadowBlur = 0;
}
function drawVaultPad(slot) {
  var pos = VAULT_POS[slot];
  var member = vaultAtPosition(slot);
  var owner = member && member.online ? member : null;
  var mine = slot === mySlot;
  var t = performance.now() / 1000;
  var isMine = !!owner && owner.id === me.id;
  var base = isMine ? '#4fd1ff' : SLOT_COLORS[slot % SLOT_COLORS.length];
  var cx = pos.x,
    cy = pos.y;
  var pulse = 1 + Math.sin(t * 2.2 + slot) * 0.06;
  var glowR = 108 * pulse;
  var grad = ctx.createRadialGradient(cx, cy, 8, cx, cy, glowR);
  grad.addColorStop(0, hexA(base, owner ? 0.45 : 0.16));
  grad.addColorStop(0.55, hexA(base, owner ? 0.14 : 0.05));
  grad.addColorStop(1, hexA(base, 0));
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, glowR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 46, 66, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(t * (isMine ? 0.5 : 0.2));
  ctx.strokeStyle = hexA(base, owner ? 0.75 : 0.35);
  ctx.lineWidth = 3;
  ctx.setLineDash([26, 20]);
  ctx.beginPath();
  ctx.arc(0, 0, 84, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
  ctx.fillStyle = '#0b0d1d';
  ctx.beginPath();
  ctx.arc(cx, cy, 64, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = base;
  ctx.lineWidth = isMine ? 4 : 2.5;
  ctx.shadowColor = base;
  ctx.shadowBlur = isMine ? 22 : 12;
  ctx.setLineDash(owner ? [] : [6, 8]);
  ctx.beginPath();
  ctx.arc(cx, cy, 64, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = base;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 15, 0, Math.PI * 2);
  ctx.stroke();
  for (var i = 0; i < 6; i++) {
    var a = i * Math.PI / 3 + t * (isMine ? 0.6 : 0.15);
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 15, Math.sin(a) * 15);
    ctx.lineTo(Math.cos(a) * 30, Math.sin(a) * 30);
    ctx.stroke();
  }
  ctx.fillStyle = base;
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.textAlign = 'center';
  if (owner) {
    ctx.font = "800 16px 'Segoe UI', sans-serif";
    ctx.fillStyle = isMine ? '#4fd1ff' : '#e8eaf2';
    ctx.shadowColor = base;
    ctx.shadowBlur = 12;
    ctx.fillText(owner.username + (isMine ? ' (you)' : ''), cx, cy - 84);
    ctx.shadowBlur = 0;
    var online = owner.online && owner.id !== me.id;
    var rookie = !isMine && owner.level != null && owner.level <= NEWBIE_LEVEL;
    ctx.font = "700 12px 'Segoe UI', sans-serif";
    if (isMine) {
      ctx.fillStyle = '#7bdc78';
      ctx.fillText('YOUR VAULT', cx, cy + 92);
    } else if (rookie) {
      ctx.fillStyle = '#8bd48b';
      ctx.fillText("ROOKIE \xB7 PROTECTED", cx, cy + 92);
    } else if (online) {
      ctx.fillStyle = '#7bdc78';
      ctx.fillText("LOCKED \xB7 ONLINE", cx, cy + 92);
    } else {
      ctx.fillStyle = '#8b93bd';
      ctx.fillText("LOCKED \xB7 OFFLINE", cx, cy + 92);
    }
    if (!isMine && owner.shieldUntil && owner.shieldUntil > Date.now() && owner.shielded) {
      var remain = Math.max(0, owner.shieldUntil - Date.now());
      var mm = Math.floor(remain / 60000);
      var ss = Math.floor(remain % 60000 / 1000);
      var clock = mm + ':' + (ss < 10 ? '0' : '') + ss;
      ctx.font = "800 12px 'Segoe UI', sans-serif";
      ctx.fillStyle = '#7be0ff';
      ctx.shadowColor = '#7be0ff';
      ctx.shadowBlur = 10;
      ctx.fillText('UNLOCKED IN ' + clock, cx, cy + 110);
      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(127,220,255,0.16)';
      ctx.beginPath();
      ctx.arc(cx, cy, 66, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(127,220,255,0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 66, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else {
    ctx.font = "700 12px 'Segoe UI', sans-serif";
    ctx.fillStyle = 'rgba(139,147,189,0.5)';
    ctx.fillText('EMPTY SLOT ' + (slot + 1), cx, cy + 92);
  }
}
function hexA(hex, a) {
  var n = parseInt(hex.slice(1), 16);
  return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')';
}
function drawCharacter(x, y, color, facing, moving, walkPhase) {
  var w = 40,
    h = 58;
  var cx = x + w / 2;
  var bob = moving ? Math.abs(Math.sin(walkPhase)) * 2.5 : 0;
  var feet = y + h;
  var step = moving ? Math.sin(walkPhase) * 5 : 0;
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.ellipse(cx, feet - 2, moving ? 21 : 18, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#22263f';
  rr(cx - 11, feet - 15 + step * 0.35, 9, 14 - step * 0.35, 3);
  ctx.fill();
  rr(cx + 2, feet - 15 - step * 0.35, 9, 14 + step * 0.35, 3);
  ctx.fill();
  var top = y + 14 - bob;
  var bg = ctx.createLinearGradient(cx - 14, top, cx + 14, top + (h - 28));
  bg.addColorStop(0, color);
  bg.addColorStop(1, shade(color, -0.35));
  ctx.fillStyle = bg;
  ctx.shadowColor = color;
  ctx.shadowBlur = 14;
  rr(cx - 14, top, 28, h - 28, 8);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  rr(cx - 14, top + 8, 28, 8, 4);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fillRect(cx - 14, top + (h - 28) * 0.55, 28, 2);
  var armSwing = moving ? Math.sin(walkPhase) * 3 : 0;
  ctx.fillStyle = shade(color, -0.45);
  rr(cx - 19, top + 2, 6, 22 + armSwing, 3);
  ctx.fill();
  rr(cx + 13, top + 2, 6, 22 - armSwing, 3);
  ctx.fill();
  var hy = top - 3;
  ctx.fillStyle = '#e8c39e';
  ctx.beginPath();
  ctx.arc(cx, hy, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.beginPath();
  ctx.arc(cx + 3, hy + 2, 12, -0.6, 1.2);
  ctx.fill();
  ctx.fillStyle = '#1b1e33';
  ctx.beginPath();
  ctx.arc(cx, hy - 4, 12, Math.PI, 0);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, hy - 4, 12, Math.PI * 1.05, Math.PI * 1.95);
  ctx.fill();
  var eo = (facing ? facing.x : 1) * 4;
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(cx - 5 + eo, hy - 2, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 5 + eo, hy - 2, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#101222';
  ctx.beginPath();
  ctx.arc(cx - 5 + eo * 1.4, hy - 2, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 5 + eo * 1.4, hy - 2, 1.5, 0, Math.PI * 2);
  ctx.fill();
}
function shade(color, amt) {
  if (color[0] === '#') {
    var n = parseInt(color.slice(1), 16);
    var c = [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (v) {
      return Math.max(0, Math.min(255, Math.round(v + v * amt)));
    });
    return 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
  }
  var m = color.match(/hsl\(([\d.]+),\s*([\d.]+)%,\s*([\d.]+)%\)/);
  if (m) {
    var l = Math.max(0, Math.min(100, parseFloat(m[3]) * (1 + amt)));
    return 'hsl(' + m[1] + ',' + m[2] + '%,' + l + '%)';
  }
  return color;
}
function drawNameTag(x, y, text, color) {
  ctx.textAlign = 'center';
  ctx.font = "700 12px 'Segoe UI', sans-serif";
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  var w = ctx.measureText(text).width + 14;
  rr(x - w / 2, y - 14, w, 18, 9);
  ctx.fill();
  ctx.fillStyle = color || '#e8eaf2';
  ctx.fillText(text, x, y);
}
var TRAIL_LIFE = 1100;
var trailHist = {};
function trailPush(id, x, y, now) {
  var arr = trailHist[id];
  if (!arr) arr = trailHist[id] = [];
  var last = arr[arr.length - 1];
  if (last && Math.hypot(x - last.x, y - last.y) < 9) return;
  arr.push({
    x: x,
    y: y,
    t: now
  });
  while (arr.length > 70 || arr.length && now - arr[0].t > TRAIL_LIFE) arr.shift();
}
function trailClear(id) {
  delete trailHist[id];
}
function drawTrail(id, kind, now) {
  if (!kind || kind === 'none') return;
  var arr = trailHist[id];
  if (!arr || !arr.length) return;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (var i = 0; i < arr.length; i++) {
    var p = arr[i];
    var age = (now - p.t) / TRAIL_LIFE;
    if (age >= 1) continue;
    var a = (1 - age) * (0.25 + 0.55 * (i / arr.length));
    var sz = kind === 'golden' ? 7 + i / arr.length * 5 : 5 + i / arr.length * 4;
    if (kind === 'golden') {
      var g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz * 2.4);
      g.addColorStop(0, 'rgba(255,224,120,' + (a * 0.9).toFixed(3) + ')');
      g.addColorStop(0.45, 'rgba(255,190,60,' + (a * 0.45).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(255,170,30,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, sz * 2.4, 0, Math.PI * 2);
      ctx.fill();
      if (i > arr.length * 0.45) {
        var tw = 0.5 + 0.5 * Math.sin(now / 130 + i);
        ctx.strokeStyle = 'rgba(255,246,200,' + (a * (0.5 + tw * 0.5)).toFixed(3) + ')';
        ctx.lineWidth = 1.6;
        var r = sz * (0.9 + tw * 0.5);
        ctx.beginPath();
        ctx.moveTo(p.x - r, p.y);
        ctx.lineTo(p.x + r, p.y);
        ctx.moveTo(p.x, p.y - r);
        ctx.lineTo(p.x, p.y + r);
        ctx.stroke();
      }
    } else {
      var hue = kind === 'rainbow' ? (now / 12 + i * 14) % 360 : kind === 'fire' ? 18 + i / arr.length * 26 : 265;
      var _g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, sz * 2);
      _g.addColorStop(0, 'hsla(' + hue + ',95%,72%,' + a.toFixed(3) + ')');
      _g.addColorStop(1, 'hsla(' + hue + ',95%,60%,0)');
      ctx.fillStyle = _g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, sz * 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}
function drawAurora(now) {
  var blobs = [{
    x: 760 + Math.sin(now / 7000) * 320,
    y: 900 + Math.cos(now / 9000) * 260,
    r: 620,
    c: '124,92,255'
  }, {
    x: 2400 + Math.cos(now / 11000) * 320,
    y: 1800 + Math.sin(now / 13000) * 300,
    r: 620,
    c: '79,209,255'
  }, {
    x: 1500 + Math.sin(now / 15000) * 400,
    y: 2500 + Math.cos(now / 12000) * 260,
    r: 520,
    c: '255,92,138'
  }];
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (var _i = 0, _blobs = blobs; _i < _blobs.length; _i++) {
    var g = _blobs[_i];
    var grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
    grad.addColorStop(0, 'rgba(' + g.c + ',0.05)');
    grad.addColorStop(1, 'rgba(' + g.c + ',0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
function drawWorld(now) {
  drawFloor();
  drawAurora(now);
  drawMotes(now);
  drawWheel(now);
  drawWarzone(now);
  for (var i = 0; i < 8; i++) drawVaultPad(i);
  var _iterator5 = _createForOfIteratorHelper(solidList),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var s = _step5.value;
      drawWall(s);
    }
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
  if (inGame) {
    var px = player.x + player.w / 2,
      py = player.y + player.h / 2;
    var lg = ctx.createRadialGradient(px, py, 10, px, py, 220);
    lg.addColorStop(0, 'rgba(124,92,255,0.18)');
    lg.addColorStop(1, 'rgba(124,92,255,0)');
    ctx.fillStyle = lg;
    ctx.beginPath();
    ctx.arc(px, py, 220, 0, Math.PI * 2);
    ctx.fill();
  }
  var _loop2 = function _loop2(id) {
      var o = others[id];
      if (!o.online) return 0;
      var member = members.find(function (m) {
        return m.id === id;
      });
      var color = member && member.customColor ? 'hsl(' + member.customColor + ', 65%, 58%)' : 'hsl(' + o.hue + ', 65%, 58%)';
      if (o.zone === 'vault') return 0;
      drawTrail(o.id, o.customTrail, now);
      drawCharacter(o.x, o.y, color, o.facing, o.moving, o.walk);
      drawNameTag(o.x + 20, o.y - 6, o.username, color);
    },
    _ret;
  for (var id in others) {
    _ret = _loop2(id);
    if (_ret === 0) continue;
  }
  if (inGame) {
    var myTrail = state && state.customTrail ? state.customTrail : 'none';
    drawTrail('me', myTrail, now);
    var myColor = state && state.customColor ? 'hsl(' + state.customColor + ', 65%, 58%)' : '#7c5cff';
    drawCharacter(player.x, player.y, myColor, player.facing, player.moving, player.walk);
    if (shieldActive()) {
      var spx = player.x + player.w / 2,
        spy = player.y + player.h / 2;
      var ph = now / 900 % 1;
      ctx.save();
      ctx.strokeStyle = 'rgba(127,220,255,0.75)';
      ctx.lineWidth = 3;
      ctx.shadowColor = 'rgba(127,220,255,0.8)';
      ctx.shadowBlur = 14;
      ctx.beginPath();
      ctx.arc(spx, spy + 18, 40 + ph * 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    drawNameTag(player.x + 20, player.y - 6, me.username, myColor);
  }
  drawGuideArrow(now);
}
function drawWarzone(now) {
  var wx = EL.x + 180,
    wy = EL.y - 50;
  var pulse = 0.5 + 0.5 * Math.sin(now / 400);
  ctx.save();
  ctx.translate(wx, wy);
  var glowR = 50 + pulse * 8;
  var gg = ctx.createRadialGradient(0, 0, 6, 0, 0, glowR);
  gg.addColorStop(0, 'rgba(255,92,138,0.35)');
  gg.addColorStop(0.6, 'rgba(255,92,138,0.08)');
  gg.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gg;
  ctx.beginPath();
  ctx.arc(0, 0, glowR, 0, Math.PI * 2);
  ctx.fill();
  var beam = ctx.createLinearGradient(0, -200, 0, 0);
  beam.addColorStop(0, 'rgba(255,92,138,0)');
  beam.addColorStop(1, 'rgba(255,92,138,' + (0.08 + pulse * 0.06).toFixed(3) + ')');
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(-20, -200);
  ctx.lineTo(20, -200);
  ctx.lineTo(35, 0);
  ctx.lineTo(-35, 0);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(20,10,15,0.9)';
  ctx.strokeStyle = 'rgba(255,92,138,0.7)';
  ctx.lineWidth = 2;
  ctx.shadowColor = 'rgba(255,92,138,0.8)';
  ctx.shadowBlur = 18;
  rr(-40, -20, 80, 60, 12);
  ctx.fill();
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.save();
  ctx.clip();
  ctx.fillStyle = 'rgba(255,92,138,0.3)';
  for (var i = -2; i < 4; i++) {
    var offset = now / 200 % 40 - 20;
    ctx.beginPath();
    ctx.moveTo(-40 + i * 20 + offset, -20);
    ctx.lineTo(-30 + i * 20 + offset, -20);
    ctx.lineTo(-45 + i * 20 + offset, 40);
    ctx.lineTo(-55 + i * 20 + offset, 40);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
  ctx.font = "800 11px 'Segoe UI', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ff5c8a';
  ctx.shadowColor = 'rgba(255,92,138,0.9)';
  ctx.shadowBlur = 12;
  ctx.fillText('WARZONE', 0, 50);
  ctx.font = "700 9px 'Segoe UI', sans-serif";
  ctx.fillStyle = 'rgba(255,92,138,0.7)';
  ctx.shadowBlur = 0;
  ctx.fillText('COMING SOON', 0, 65);
  ctx.restore();
}
function drawWheel(now) {
  var cx = EL.x,
    cy = EL.y;
  var active = eventActive();
  var R = EL.r;
  var pulse = 0.5 + 0.5 * Math.sin(now / 300);
  ctx.save();
  ctx.translate(cx, cy);
  var glowR = R + (active ? 34 : 22) + pulse * 10;
  var gg = ctx.createRadialGradient(0, 0, 6, 0, 0, glowR);
  gg.addColorStop(0, active ? 'rgba(138,255,216,0.45)' : 'rgba(124,92,255,0.30)');
  gg.addColorStop(0.6, active ? 'rgba(79,209,255,0.12)' : 'rgba(124,92,255,0.09)');
  gg.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gg;
  ctx.beginPath();
  ctx.arc(0, 0, glowR, 0, Math.PI * 2);
  ctx.fill();
  if (!active) {
    var beam = ctx.createLinearGradient(0, -260, 0, 0);
    beam.addColorStop(0, 'rgba(124,92,255,0)');
    beam.addColorStop(1, 'rgba(124,92,255,' + (0.10 + pulse * 0.08).toFixed(3) + ')');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(-26, -260);
    ctx.lineTo(26, -260);
    ctx.lineTo(R * 0.7, 0);
    ctx.lineTo(-R * 0.7, 0);
    ctx.closePath();
    ctx.fill();
  }
  if (active) drawWheelBolts(now);
  ctx.save();
  ctx.rotate(now / (active ? 850 : 4200));
  for (var i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, R, i * Math.PI / 4, (i + 1) * Math.PI / 4);
    ctx.closePath();
    if (active) ctx.fillStyle = i % 2 ? '#5a7bff' : '#ff4fd8';else ctx.fillStyle = i % 2 ? 'rgba(124,92,255,0.22)' : 'rgba(90,123,255,0.15)';
    ctx.fill();
  }
  ctx.restore();
  var rimColor = active ? 'rgba(138,255,216,0.9)' : 'rgba(150,120,255,0.7)';
  ctx.strokeStyle = rimColor;
  ctx.lineWidth = active ? 3.5 : 3;
  ctx.shadowColor = rimColor;
  ctx.shadowBlur = active ? 22 : 12;
  ctx.beginPath();
  ctx.arc(0, 0, R, 0, Math.PI * 2);
  ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#0b0f1e';
  ctx.strokeStyle = active ? 'rgba(138,255,216,0.6)' : 'rgba(150,120,255,0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, R * 0.42, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = active ? '#8affd8' : '#c8b8ff';
  ctx.font = "800 12px 'Segoe UI', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(active ? 'SPIN' : "\u26A1", 0, 0);
  ctx.font = "800 12px 'Segoe UI', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (active) {
    ctx.fillStyle = '#8affd8';
    ctx.shadowColor = 'rgba(138,255,216,0.9)';
    ctx.shadowBlur = 14;
    ctx.fillText("ELECTRIC \xB7 LIVE \xB7 " + Math.max(0, Math.ceil((ev ? ev.endsAt - now : 0) / 1000)) + 's', 0, R + 24);
  } else {
    ctx.fillStyle = 'rgba(200,184,255,0.85)';
    ctx.shadowColor = 'rgba(124,92,255,0.7)';
    ctx.shadowBlur = 10;
    var nextIn = ev && ev.startsAt ? Math.max(0, Math.ceil((ev.startsAt - now) / 1000)) : 0;
    ctx.fillText('NEXT EVENT IN ' + nextIn + 's', 0, R + 24);
  }
  ctx.shadowBlur = 0;
  ctx.restore();
  if (active && inGame && nearWheel()) {
    var _prompt = "E \u2014 SPIN THE WHEEL";
    ctx.save();
    ctx.font = "800 13px 'Segoe UI', sans-serif";
    var tw = ctx.measureText(_prompt).width;
    ctx.fillStyle = 'rgba(8,16,24,0.85)';
    ctx.strokeStyle = 'rgba(138,255,216,0.55)';
    ctx.beginPath();
    ctx.rect(cx - tw / 2 - 8, cy - EL.r - 56, tw + 16, 28);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#8affd8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(_prompt, cx, cy - EL.r - 42);
    ctx.restore();
  }
}
function drawWheelBolts(now) {
  var R = EL.r;
  ctx.save();
  for (var b = 0; b < 7; b++) {
    var flick = 0.5 + 0.5 * Math.sin(now / 55 + b * 2.3);
    if (flick < 0.4) continue;
    var baseAng = b / 7 * Math.PI * 2 + now / 1700;
    var r0 = R + 4;
    var r1 = R + 26 + flick * 34;
    var steps = 6;
    var color = ['#8affd8', '#7fd0ff', '#c77bff'][b % 3];
    ctx.strokeStyle = color;
    ctx.globalAlpha = 0.35 + flick * 0.6;
    ctx.lineWidth = 1.6 + flick * 1.8;
    ctx.shadowColor = color;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    for (var s = 0; s <= steps; s++) {
      var t = s / steps;
      var _rr = R + 4 + (R + 26 + flick * 34 - (R + 4)) * t;
      var seed = Math.sin((b + 1) * 12.9898 + s * 78.233 + Math.floor(now / 45) * 37.719) * 43758.5453;
      var jitter = (seed - Math.floor(seed) - 0.5) * 0.5;
      var a = baseAng + jitter * (0.4 + t);
      var x = Math.cos(a) * _rr,
        y = Math.sin(a) * _rr;
      if (s === 0) ctx.moveTo(x, y);else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}
function guideTarget() {
  if (tutorialDone || mySlot < 0) return null;
  if (tutIdx !== 1 && tutIdx !== 2) return null;
  return VAULT_POS[mySlot];
}
function drawGuideArrow(now) {
  var tgt = guideTarget();
  if (!tgt) return;
  var px = player.x + player.w / 2,
    py = player.y + player.h / 2;
  var ang = Math.atan2(tgt.y - py, tgt.x - px);
  var dist = Math.hypot(tgt.x - px, tgt.y - py);
  var gap = 62;
  var march = now / 240 % 1;
  ctx.save();
  for (var i = 0; i < 12; i++) {
    var d = 76 + i * gap + march * gap;
    if (d > dist - 96) break;
    var x = px + Math.cos(ang) * d;
    var y = py + Math.sin(ang) * d;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(ang);
    ctx.globalAlpha = Math.max(0.12, 0.9 - i * 0.07);
    ctx.fillStyle = '#4fd1ff';
    ctx.shadowColor = '#4fd1ff';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(15, 0);
    ctx.lineTo(-9, -12);
    ctx.lineTo(-3, 0);
    ctx.lineTo(-9, 12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
  ctx.globalAlpha = 1;
  var bob = Math.sin(now / 300) * 7;
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = "800 40px 'Segoe UI', sans-serif";
  ctx.fillStyle = '#4fd1ff';
  ctx.shadowColor = '#4fd1ff';
  ctx.shadowBlur = 18;
  ctx.fillText("\u25BC", tgt.x, tgt.y - 118 + bob);
  ctx.restore();
}
function drawGuideHud(now) {
  var tgt = guideTarget();
  if (!tgt) return;
  var sx = tgt.x - camX,
    sy = tgt.y - camY;
  var m = 96;
  if (sx > m && sx < viewW - m && sy > m && sy < viewH - m) return;
  var cx = viewW / 2,
    cy = viewH / 2;
  var ang = Math.atan2(sy - cy, sx - cx);
  var ex = cx + Math.cos(ang) * (viewW / 2 - 70);
  var ey = cy + Math.sin(ang) * (viewH / 2 - 90);
  var pulse = 1 + Math.sin(now / 220) * 0.12;
  ctx.save();
  ctx.translate(ex, ey);
  ctx.rotate(ang);
  ctx.scale(pulse, pulse);
  ctx.fillStyle = 'rgba(5,6,15,0.85)';
  ctx.beginPath();
  ctx.arc(0, 0, 26, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(79,209,255,0.6)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#4fd1ff';
  ctx.shadowColor = '#4fd1ff';
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.moveTo(20, 0);
  ctx.lineTo(-10, -13);
  ctx.lineTo(-10, 13);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}
function drawVignette() {
  var g = ctx.createRadialGradient(viewW / 2, viewH / 2, Math.min(viewW, viewH) * 0.35, viewW / 2, viewH / 2, Math.max(viewW, viewH) * 0.72);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(2,3,9,0.75)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, viewW, viewH);
}
var lastFrame = performance.now();
function frame(now) {
  var dt = Math.min(64, now - lastFrame) / 1000;
  lastFrame = now;
  if (inGame) {
    refreshTutorial();
    var blocked = anyModalOpen();
    var ix = (keys.d || keys.arrowright ? 1 : 0) - (keys.a || keys.arrowleft ? 1 : 0);
    var iy = (keys.s || keys.arrowdown ? 1 : 0) - (keys.w || keys.arrowup ? 1 : 0);
    var moving = !blocked && (ix !== 0 || iy !== 0);
    if (moving) {
      player.moving = true;
      if (ix) {
        player.facing.x = ix;
        player.facing.y = 0;
      } else {
        player.facing.y = iy;
        player.facing.x = 0;
      }
      var mag = Math.hypot(ix, iy);
      player.walk += dt * 11 * mag;
      movePlayer(ix / mag * 260 * dt, iy / mag * 260 * dt);
      if (now - lastStep > 460) {
        lastStep = now;
        sfxStep();
      }
    } else {
      player.moving = false;
    }
    if (now - lastSent > 70) {
      lastSent = now;
      wsSend({
        type: 'move',
        x: player.x,
        y: player.y,
        zone: vaultOpen ? 'vault' : 'world',
        moving: player.moving,
        facing: player.facing
      });
    }
    var myTrailKind = state && state.customTrail ? state.customTrail : 'none';
    if (myTrailKind !== 'none' && player.moving) {
      trailPush('me', player.x + player.w / 2, player.y + player.h, now);
    }
    for (var id in others) {
      var o = others[id];
      if (!o.online) continue;
      var k = Math.min(1, dt * 8);
      o.x += (o.tx - o.x) * k;
      o.y += (o.ty - o.y) * k;
      if (o.moving) {
        o.walk = (o.walk || 0) + dt * 11;
        if (o.customTrail && o.customTrail !== 'none') {
          trailPush(o.id, o.x + 20, o.y + 58, now);
        }
      }
    }
    updateHudMeta();
    updateHint();
    var viewWz = viewW / CAM_ZOOM,
      viewHz = viewH / CAM_ZOOM;
    var maxCamX = Math.max(0, WORLD_W - viewWz),
      maxCamY = Math.max(0, WORLD_H - viewHz);
    var tx = Math.max(0, Math.min(maxCamX, player.x + player.w / 2 - viewWz / 2));
    var ty = Math.max(0, Math.min(maxCamY, player.y + player.h / 2 - viewHz / 2));
    if (!camSet) {
      camX = tx;
      camY = ty;
      camSet = true;
    } else {
      var _k = Math.min(1, dt * 6);
      camX += (tx - camX) * _k;
      camY += (ty - camY) * _k;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, viewW, viewH);
    ctx.save();
    ctx.scale(CAM_ZOOM, CAM_ZOOM);
    ctx.translate(-camX, -camY);
    drawWorld(now);
    ctx.restore();
    drawVignette();
    drawGuideHud(now);
  }
  requestAnimationFrame(frame);
}
function updateHint() {
  var h = $('hint');
  if (nearMyVault()) {
    h.textContent = isMobile ? 'Tap E to open your vault' : 'Press E to open your vault';
    $('zone').textContent = 'YOUR VAULT';
  } else {
    h.textContent = isMobile ? "Joystick to walk \xB7 E opens your vault" : "WASD / Arrows to walk \xB7 E opens your vault at your pad";
    $('zone').textContent = currentServer ? 'World ' + currentServer.id : 'WORLD';
  }
  var vb = $('vaultBtn');
  vb.textContent = nearMyVault() ? 'Open Vault' : 'Vault';
}
var MODAL_IDS = ['vaultModal', 'bazaarModal', 'marketModal', 'leaderModal', 'wheelModal', 'bossModal', 'tradeModal'];
function anyModalOpen() {
  return MODAL_IDS.some(function (id) {
    return !$(id).classList.contains('hidden');
  });
}
function closeAllModals() {
  MODAL_IDS.forEach(function (id) {
    return $(id).classList.add('hidden');
  });
  vaultOpen = false;
}
document.querySelectorAll('[data-close]').forEach(function (b) {
  return b.addEventListener('click', function () {
    $(b.dataset.close).classList.add('hidden');
    if (b.dataset.close === 'vaultModal') vaultOpen = false;
    saveNow();
  });
});
$('vaultBtn').addEventListener('click', function () {
  ac();
  toggleVault();
});
function toggleVault() {
  if (!inGame) return;
  if (vaultOpen) {
    closeAllModals();
    return;
  }
  if (!nearMyVault()) {
    toast('FIND YOUR VAULT', 'Walk onto your glowing pad, then press E.', null, '#4fd1ff');
    return;
  }
  $('bazaarModal').classList.add('hidden');
  $('vaultModal').classList.remove('hidden');
  vaultOpen = true;
  sfxDoor();
  renderVault();
  refreshTutorial();
}
document.querySelectorAll('.tab[data-tab]').forEach(function (tab) {
  return tab.addEventListener('click', function () {
    ac();
    document.querySelectorAll('.tab[data-tab]').forEach(function (t) {
      return t.classList.remove('active');
    });
    document.querySelectorAll('#vaultModal .panel').forEach(function (p) {
      return p.classList.remove('active');
    });
    tab.classList.add('active');
    $('panel-' + tab.dataset.tab).classList.add('active');
    if (tab.dataset.tab === 'quests') renderQuests();
    if (tab.dataset.tab === 'rebirth') renderRebirth();
    if (tab.dataset.tab === 'offline') renderOffline();
    if (tab.dataset.tab === 'codex') renderCodex();
  });
});
function renderVault() {
  if (!state) return;
  $('money').textContent = '$' + fmt(state.money);
  $('bMoney').textContent = '$' + fmt(state.money);
  $('mMoney').textContent = '$' + fmt(state.money);
  $('hudMoney').textContent = fmt(state.money);
  if (lastMoneyShown != null && state.money > lastMoneyShown) {
    var hm = $('hudMoney');
    hm.classList.remove('pulse');
    void hm.offsetWidth;
    hm.classList.add('pulse');
  }
  lastMoneyShown = state.money;
  $('hudLevel').textContent = state.level;
  $('genLevel').textContent = state.level;
  $('luckDisplay').textContent = '+' + Math.round((state.luckBonus || 0) * 100) + '%';
  $('badgeLevel').textContent = state.level;
  var gb = $('genBuy');
  if (state.level >= MAX_LEVEL) {
    gb.textContent = 'MAX LEVEL REACHED';
    gb.className = 'buy maxed';
    gb.disabled = true;
    $('progressFill').style.width = '100%';
    $('progressLabel').textContent = 'Maximum generator power achieved';
  } else {
    var c = genCost();
    $('progressFill').style.width = Math.min(100, state.money / c * 100) + '%';
    $('progressLabel').textContent = '$' + fmt(Math.min(state.money, c)) + ' / $' + fmt(c) + ' to Level ' + (state.level + 1);
    gb.className = 'buy';
    gb.textContent = 'Upgrade to Level ' + (state.level + 1) + " \u2014 $" + fmt(c);
    gb.disabled = upgradeBusy || state.money < c;
  }
  var total = 0,
    worth = 0;
  for (var it in state.counts) {
    total += state.counts[it];
    worth += itemValueKey(it) * state.counts[it];
  }
  var used = state.used != null ? state.used : total;
  $('invCap').textContent = 'Items: ' + fmt(used) + ' / ' + fmt(state.capacity || 0);
  if (used >= (state.capacity || 0)) {
    $('invCap').style.color = '#ff6b8a';
  } else {
    $('invCap').style.color = '';
  }
  $('sellAll').disabled = total === 0;
  $('invWorth').textContent = 'Worth: $' + fmt(worth);
  renderShieldBtn();
  renderRebirth();
  var list = $('items');
  if (total === 0) {
    list.innerHTML = '<li class="empty">Nothing yet...<br>Generate items and sell them here.</li>';
  } else {
    list.innerHTML = '';
    var entries = Object.entries(state.counts).sort(function (a, b) {
      return itemValueKey(b[0]) - itemValueKey(a[0]);
    });
    var _iterator6 = _createForOfIteratorHelper(entries),
      _step6;
    try {
      var _loop3 = function _loop3() {
        var _step6$value = _slicedToArray(_step6.value, 2),
          it = _step6$value[0],
          count = _step6$value[1];
        var rar = rarityFor(baseName(it));
        var mut = mutationOf(it);
        var baseValue = ITEM_BASE[baseName(it)] || 0;
        var mult = mut ? mut.mult : 1;
        var li = document.createElement('li');
        li.innerHTML = '<span class="item-left"><span class="item-name" data-item="' + it + '">' + itemDisplayName(it) + '</span>' + mutBadge(it) + '<span class="rarity" style="color:' + rar.color + ';background:' + rar.color + '1f;border:1px solid ' + rar.color + '59">' + rar.name + '</span></span>' + '<span class="item-right"><span class="item-count">x' + count + '</span>' + '<span class="item-value">$' + fmt(itemValueKey(it) * count) + '</span>' + '<button class="sell-btn">SELL</button></span>';
        li.querySelector('.sell-btn').addEventListener('click', function (e) {
          return sellItem(it, e);
        });
        li.querySelector('.item-name').addEventListener('mouseenter', function (e) {
          return showItemTooltip(e, it, rar, mut, baseValue, mult);
        });
        li.querySelector('.item-name').addEventListener('mouseleave', hideItemTooltip);
        list.appendChild(li);
      };
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        _loop3();
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
  }
  renderAch();
  renderDash();
  if ($('panel-codex') && $('panel-codex').classList.contains('active')) renderCodex();
  if (!$('bazaarModal').classList.contains('hidden')) renderSellList();
}
function renderCodex() {
  if (!state) return;
  var list = $('codexList');
  if (!list) return;
  var seen = state.stats && Array.isArray(state.stats.seen) ? state.stats.seen : [];
  var owned = {};
  for (var key in state.counts || {}) {
    var base = baseName(key);
    owned[base] = (owned[base] || 0) + Math.max(0, Number(state.counts[key]) || 0);
  }
  var currentEvent = activeEvent();
  var shownRarities = RARITIES.filter(function (rar) {
    return !rar.eventKey || currentEvent && rar.eventKey === currentEvent.key;
  });
  var discoveredTotal = 0;
  var totalItems = 0;
  list.innerHTML = '';
  shownRarities.forEach(function (rar) {
    var names = ITEMS_BY_RARITY[rar.key] || [];
    var found = 0;
    var header = document.createElement('li');
    header.className = 'codex-rarity-title';
    header.style.color = rar.color;
    list.appendChild(header);
    names.forEach(function (name) {
      var isKnown = seen.indexOf(name) !== -1 || owned[name] > 0;
      if (isKnown) found++;
      var li = document.createElement('li');
      li.className = 'row codex-row';
      var left = document.createElement('span');
      left.className = 'item-left';
      var nameEl = document.createElement('span');
      nameEl.className = 'item-name codex-item';
      nameEl.setAttribute('data-codex', '1');
      nameEl.textContent = isKnown ? name : '???';
      nameEl.style.color = isKnown ? rar.color : '#5a6188';
      if (isKnown) {
        nameEl.addEventListener('click', function (e) {
          e.preventDefault();
          var base = baseName(name);
          var mut = mutationOf(name);
          var baseValue = ITEM_BASE[base] || 0;
          showItemTooltip(e, name, rarityFor(base), mut, baseValue, mut ? mut.mult : 1);
        });
      } else {
        nameEl.style.cursor = 'default';
        nameEl.removeAttribute('data-codex');
      }
      left.appendChild(nameEl);
      var badge = document.createElement('span');
      badge.className = 'rarity';
      badge.style.color = rar.color;
      badge.textContent = isKnown ? owned[name] > 0 ? 'OWNED' : 'SEEN' : 'UNDISCOVERED';
      left.appendChild(badge);
      var right = document.createElement('span');
      right.className = 'item-right';
      var count = document.createElement('span');
      count.className = 'item-count';
      count.textContent = isKnown ? 'x' + fmt(owned[name] || 0) : "\u2014";
      right.appendChild(count);
      li.appendChild(left);
      li.appendChild(right);
      list.appendChild(li);
    });
    header.textContent = rar.name + '  ' + found + ' / ' + names.length;
    discoveredTotal += found;
    totalItems += names.length;
  });
  $('codexInfo').textContent = 'Discovered ' + discoveredTotal + ' / ' + totalItems;
  $('codexSummary').textContent = currentEvent ? 'Tap a discovered item to see its value. ' + currentEvent.name + ' items can drop from the generator during the event.' : 'Tap a discovered item to see its value. Unknown items unlock when you generate or own them.';
}
$('gen').addEventListener('click', function () {
  ac();
  if (generating || genBusy) {
    closeAllModals();
    return;
  }
  beginGen();
});
function beginGen() {
  if (generating || genBusy || !vaultOpen) return;
  generating = true;
  genEnd = performance.now() + (state.genTime || 7000);
  $('gen').disabled = true;
  $('generator').classList.add('charging');
  $('last').classList.remove('show');
}
function finishGen() {
  return _finishGen.apply(this, arguments);
}
function _finishGen() {
  _finishGen = _asyncToGenerator(_regenerator().m(function _callee35() {
    var r, rar, mut, color, idx, el, _t33;
    return _regenerator().w(function (_context35) {
      while (1) switch (_context35.p = _context35.n) {
        case 0:
          if (!genBusy) {
            _context35.n = 1;
            break;
          }
          return _context35.a(2);
        case 1:
          genBusy = true;
          generating = false;
          $('generator').classList.remove('charging');
          $('gen').disabled = true;
          _context35.p = 2;
          _context35.n = 3;
          return api('/generate', {
            method: 'POST'
          });
        case 3:
          r = _context35.v;
          state = r.state;
          rar = RARITIES.find(function (x) {
            return x.key === r.rarity;
          }) || RARITIES[0];
          mut = r.mutation ? MUT_BY_ID[r.mutation] : null;
          color = mut ? mut.color : rar.color;
          idx = RARITIES.indexOf(rar);
          el = $('last');
          el.textContent = (mut ? mut.name.toUpperCase() + ' ' : '') + rar.name + ': ' + r.item;
          el.style.color = color;
          el.style.textShadow = '0 0 24px ' + color;
          el.classList.remove('show');
          void el.offsetWidth;
          el.classList.add('show');
          sfxGen(idx);
          float(window.innerWidth / 2, window.innerHeight * 0.42, (mut ? mut.name.toUpperCase() + ' ' : '') + rar.name + '!', color);
          if (idx >= 3 || mut) burst(window.innerWidth / 2, window.innerHeight * 0.4, rar);
          if (idx >= 3) shock(color);
          if (idx >= 4 || mut && mut.mult >= 5) {
            screenFlash(color);
            shakeScreen();
          }
          if (idx >= 4 || mut && mut.mult >= 5) toast((mut ? mut.name.toUpperCase() : rar.name.toUpperCase()) + ' ITEM!', r.item, null, color);
          if (r.newAch && r.newAch.length) showNewAch(r.newAch);
          if (r.daily) dailyData = Object.assign({}, dailyData, r.daily);
          if (r.boss) onBoss(r.boss);
          if (r.bossDefeated) onBossDefeated(r.bossDefeated);
          renderVault();
          refreshTutorial();
          _context35.n = 5;
          break;
        case 4:
          _context35.p = 4;
          _t33 = _context35.v;
          toast('OOPS', _t33.message, null, '#ff6b8a');
        case 5:
          _context35.p = 5;
          genBusy = false;
          $('gen').disabled = false;
          return _context35.f(5);
        case 6:
          return _context35.a(2);
      }
    }, _callee35, null, [[2, 4, 5, 6]]);
  }));
  return _finishGen.apply(this, arguments);
}
setInterval(function () {
  if (!generating) return;
  var remain = genEnd - performance.now();
  if (remain <= 0) finishGen();else {
    var el = $('countdown');
    var val = Math.max(1, Math.ceil(remain / 1000));
    if (el.textContent != val) {
      el.textContent = val;
      el.style.animation = 'none';
      void el.offsetWidth;
      el.style.animation = 'pop 0.8s ease';
    }
  }
}, 100);
function sellItem(_x0, _x1) {
  return _sellItem.apply(this, arguments);
}
function _sellItem() {
  _sellItem = _asyncToGenerator(_regenerator().m(function _callee36(item, ev) {
    var box, _r, _t34;
    return _regenerator().w(function (_context36) {
      while (1) switch (_context36.p = _context36.n) {
        case 0:
          if (state.counts[item]) {
            _context36.n = 1;
            break;
          }
          return _context36.a(2);
        case 1:
          box = (ev && (ev.currentTarget || ev.target)).getBoundingClientRect();
          _context36.p = 2;
          _context36.n = 3;
          return api('/sell', {
            method: 'POST',
            body: JSON.stringify({
              item: item
            })
          });
        case 3:
          _r = _context36.v;
          state = _r.state;
          salesCount++;
          sfxSell();
          float(box.left + box.width / 2, box.top, '+' + fmt(_r.gain), '#7bdc78');
          if (_r.newAch && _r.newAch.length) showNewAch(_r.newAch);
          if (_r.daily) dailyData = Object.assign({}, dailyData, _r.daily);
          renderVault();
          _context36.n = 5;
          break;
        case 4:
          _context36.p = 4;
          _t34 = _context36.v;
          toast('OOPS', _t34.message, null, '#ff6b8a');
        case 5:
          return _context36.a(2);
      }
    }, _callee36, null, [[2, 4]]);
  }));
  return _sellItem.apply(this, arguments);
}
function sellAllItems(_x10) {
  return _sellAllItems.apply(this, arguments);
}
function _sellAllItems() {
  _sellAllItems = _asyncToGenerator(_regenerator().m(function _callee37(srcEl) {
    var src, box, _r2, _t35;
    return _regenerator().w(function (_context37) {
      while (1) switch (_context37.p = _context37.n) {
        case 0:
          if (!(!state || !Object.keys(state.counts || {}).length)) {
            _context37.n = 1;
            break;
          }
          return _context37.a(2);
        case 1:
          src = srcEl || $('sellAll');
          box = src.getBoundingClientRect();
          _context37.p = 2;
          _context37.n = 3;
          return api('/sell', {
            method: 'POST',
            body: JSON.stringify({
              all: true
            })
          });
        case 3:
          _r2 = _context37.v;
          state = _r2.state;
          salesCount++;
          sfxSell();
          float(box.left + box.width / 2, box.top, '+' + fmt(_r2.gain), '#7bdc78');
          if (_r2.gain >= 1e6) {
            burst(box.left, box.top, RARITIES[4]);
            toast('MASSIVE PAYOUT!', null, '$' + fmt(_r2.gain), '#ffb648');
          }
          if (_r2.newAch && _r2.newAch.length) showNewAch(_r2.newAch);
          if (_r2.daily) dailyData = Object.assign({}, dailyData, _r2.daily);
          renderVault();
          _context37.n = 5;
          break;
        case 4:
          _context37.p = 4;
          _t35 = _context37.v;
          toast('OOPS', _t35.message, null, '#ff6b8a');
        case 5:
          return _context37.a(2);
      }
    }, _callee37, null, [[2, 4]]);
  }));
  return _sellAllItems.apply(this, arguments);
}
$('sellAll').addEventListener('click', function (e) {
  return sellAllItems(e.currentTarget);
});
$('genBuy').addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee4() {
  var r, _t5;
  return _regenerator().w(function (_context4) {
    while (1) switch (_context4.p = _context4.n) {
      case 0:
        if (!(upgradeBusy || state.level >= MAX_LEVEL)) {
          _context4.n = 1;
          break;
        }
        return _context4.a(2);
      case 1:
        upgradeBusy = true;
        $('genBuy').disabled = true;
        _context4.p = 2;
        _context4.n = 3;
        return api('/upgrade', {
          method: 'POST'
        });
      case 3:
        r = _context4.v;
        state = r.state;
        sfxBuy();
        if (r.newAch && r.newAch.length) showNewAch(r.newAch);
        renderVault();
        refreshTutorial();
        _context4.n = 5;
        break;
      case 4:
        _context4.p = 4;
        _t5 = _context4.v;
        toast('OOPS', _t5.message, null, '#ff6b8a');
      case 5:
        _context4.p = 5;
        upgradeBusy = false;
        renderVault();
        return _context4.f(5);
      case 6:
        return _context4.a(2);
    }
  }, _callee4, null, [[2, 4, 5, 6]]);
})));
function renderShieldBtn() {
  var sb = $('shieldBtn');
  if (shieldActive()) {
    var rem = Math.max(0, state.shieldUntil - Date.now());
    var m = Math.floor(rem / 60000),
      s = Math.floor(rem % 60000 / 1000);
    sb.textContent = 'SHIELD ' + m + ':' + String(s).padStart(2, '0') + " \u2714";
    sb.classList.add('on');
    sb.title = 'Vault is shielded - you cannot be breached';
  } else {
    sb.textContent = 'ACTIVATE SHIELD (' + Math.floor(shieldSeconds() / 60) + 'm)';
    sb.classList.remove('on');
    sb.title = '';
  }
}
$('shieldBtn').addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee5() {
  var r, _t6;
  return _regenerator().w(function (_context5) {
    while (1) switch (_context5.p = _context5.n) {
      case 0:
        if (!(!state || genBusy)) {
          _context5.n = 1;
          break;
        }
        return _context5.a(2);
      case 1:
        _context5.p = 1;
        _context5.n = 2;
        return api('/shield', {
          method: 'POST'
        });
      case 2:
        r = _context5.v;
        state = r.state;
        sfxToast();
        toast('SHIELD', 'Vault shielded for ' + Math.floor(r.seconds / 60) + ' min', null, '#7bdcf0');
        renderVault();
        _context5.n = 4;
        break;
      case 3:
        _context5.p = 3;
        _t6 = _context5.v;
        toast('OOPS', _t6.message, null, '#ff6b8a');
      case 4:
        return _context5.a(2);
    }
  }, _callee5, null, [[1, 3]]);
})));
setInterval(function () {
  if (!inGame || !state) return;
  if (vaultOpen || shieldActive()) renderShieldBtn();
  renderEventTag();
}, 1000);
function renderRebirth() {
  var list = $('rebirthList');
  if (!list) return;
  var rb = state.rebirths || 0;
  $('rebirthInfo').textContent = 'Rebirth ' + rb + ' / ' + REBIRTHS.length;
  list.innerHTML = '';
  REBIRTHS.forEach(function (t, i) {
    var have = countRarity(t.rarity);
    var rar = RARITIES[t.rarity];
    var done = i < rb;
    var next = i === rb;
    var affordable = state.money >= t.cost && have >= t.count;
    var capAfter = 1000 + (i + 1) * 1000;
    var shieldAfter = 5 + (i + 1);
    var li = document.createElement('li');
    li.className = 'ach' + (done ? ' done' : '');
    li.innerHTML = '<div class="ach-name">' + t.name + (done ? " \u2713" : '') + (next ? ' <span class="next-tag">NEXT</span>' : '') + '</div>' + '<div class="ach-desc" style="color:' + rar.color + '">Sacrifice ' + t.count + ' ' + rar.name + ' items</div>' + '<div class="ach-desc">Have ' + have + ' / ' + t.count + " \xB7 $" + fmt(state.money) + ' / $' + fmt(t.cost) + '</div>' + '<div class="ach-reward">After: ' + fmt(capAfter) + " capacity \xB7 " + shieldAfter + 'm shield</div>';
    if (next) {
      var btn = document.createElement('button');
      btn.className = 'buy' + (affordable ? '' : ' disabled');
      btn.textContent = affordable ? 'REBIRTH NOW' : 'UNAVAILABLE';
      btn.disabled = !affordable;
      btn.addEventListener('click', doRebirth);
      li.appendChild(btn);
    }
    list.appendChild(li);
  });
}
function doRebirth() {
  return _doRebirth.apply(this, arguments);
}
function _doRebirth() {
  _doRebirth = _asyncToGenerator(_regenerator().m(function _callee38() {
    var _r3, _t36;
    return _regenerator().w(function (_context38) {
      while (1) switch (_context38.p = _context38.n) {
        case 0:
          _context38.p = 0;
          _context38.n = 1;
          return api('/rebirth', {
            method: 'POST'
          });
        case 1:
          _r3 = _context38.v;
          state = _r3.state;
          sfxBuy();
          toast('REBIRTH', 'Rebirth ' + _r3.rebirths + " \u2014 the vault resets but grows", null, '#8affd8');
          burst(window.innerWidth / 2, window.innerHeight * 0.3, RARITIES[5]);
          if (_r3.newAch && _r3.newAch.length) showNewAch(_r3.newAch);
          renderVault();
          refreshTutorial();
          _context38.n = 3;
          break;
        case 2:
          _context38.p = 2;
          _t36 = _context38.v;
          toast('OOPS', _t36.message, null, '#ff6b8a');
        case 3:
          return _context38.a(2);
      }
    }, _callee38, null, [[0, 2]]);
  }));
  return _doRebirth.apply(this, arguments);
}
function renderOffline() {
  return _renderOffline.apply(this, arguments);
}
function _renderOffline() {
  _renderOffline = _asyncToGenerator(_regenerator().m(function _callee39() {
    var list, _r4, ol, claimLi, claimBtn, _t37;
    return _regenerator().w(function (_context39) {
      while (1) switch (_context39.p = _context39.n) {
        case 0:
          list = $('offlineList');
          if (list) {
            _context39.n = 1;
            break;
          }
          return _context39.a(2);
        case 1:
          _context39.p = 1;
          _context39.n = 2;
          return api('/offline');
        case 2:
          _r4 = _context39.v;
          ol = _r4.offlineLevel || 0;
          $('offlineInfo').textContent = 'Offline Level ' + ol + ' / ' + _r4.available.length;
          list.innerHTML = '';
          _r4.available.forEach(function (item) {
            var li = document.createElement('li');
            var isCurrent = item.level === ol;
            var isNext = item.level === ol + 1;
            var affordable = state.money >= item.cost;
            li.className = 'ach' + (isCurrent ? ' done' : '');
            li.innerHTML = '<div class="ach-name">' + item.name + (isCurrent ? " \u2713" : '') + (isNext ? ' <span class="next-tag">NEXT</span>' : '') + '</div>' + '<div class="ach-desc">Earns $' + fmt(item.rate) + ' per hour while offline</div>' + '<div class="ach-desc">Requires rebirth ' + item.minRebirth + " \xB7 $" + fmt(item.cost) + '</div>';
            if (isNext) {
              var btn = document.createElement('button');
              btn.className = 'buy' + (affordable ? '' : ' disabled');
              btn.textContent = affordable ? 'UPGRADE' : 'UNAVAILABLE';
              btn.disabled = !affordable;
              btn.addEventListener('click', function () {
                return doOfflineUpgrade(item.level);
              });
              li.appendChild(btn);
            }
            list.appendChild(li);
          });
          if (ol > 0) {
            claimLi = document.createElement('li');
            claimLi.className = 'ach';
            claimLi.innerHTML = '<div class="ach-name">Claim Offline Earnings</div>' + '<div class="ach-desc">Collect passive income from time spent offline</div>';
            claimBtn = document.createElement('button');
            claimBtn.className = 'buy';
            claimBtn.textContent = 'CLAIM EARNINGS';
            claimBtn.addEventListener('click', doOfflineClaim);
            claimLi.appendChild(claimBtn);
            list.appendChild(claimLi);
          }
          _context39.n = 4;
          break;
        case 3:
          _context39.p = 3;
          _t37 = _context39.v;
          toast('OOPS', _t37.message, null, '#ff6b8a');
        case 4:
          return _context39.a(2);
      }
    }, _callee39, null, [[1, 3]]);
  }));
  return _renderOffline.apply(this, arguments);
}
function doOfflineUpgrade(_x11) {
  return _doOfflineUpgrade.apply(this, arguments);
}
function _doOfflineUpgrade() {
  _doOfflineUpgrade = _asyncToGenerator(_regenerator().m(function _callee40(level) {
    var _r5, _t38;
    return _regenerator().w(function (_context40) {
      while (1) switch (_context40.p = _context40.n) {
        case 0:
          _context40.p = 0;
          _context40.n = 1;
          return api('/offline/upgrade', {
            method: 'POST'
          });
        case 1:
          _r5 = _context40.v;
          state = _r5.state;
          sfxBuy();
          toast('UPGRADED', 'Offline rewards upgraded to level ' + _r5.level, null, '#8affd8');
          renderOffline();
          _context40.n = 3;
          break;
        case 2:
          _context40.p = 2;
          _t38 = _context40.v;
          toast('OOPS', _t38.message, null, '#ff6b8a');
        case 3:
          return _context40.a(2);
      }
    }, _callee40, null, [[0, 2]]);
  }));
  return _doOfflineUpgrade.apply(this, arguments);
}
function doOfflineClaim() {
  return _doOfflineClaim.apply(this, arguments);
}
function _doOfflineClaim() {
  _doOfflineClaim = _asyncToGenerator(_regenerator().m(function _callee41() {
    var _r6, _t39;
    return _regenerator().w(function (_context41) {
      while (1) switch (_context41.p = _context41.n) {
        case 0:
          _context41.p = 0;
          _context41.n = 1;
          return api('/offline/claim', {
            method: 'POST'
          });
        case 1:
          _r6 = _context41.v;
          state = _r6.state;
          sfxBuy();
          toast('EARNINGS', 'Claimed $' + fmt(_r6.earnings) + ' from ' + _r6.hours.toFixed(1) + ' hours offline', null, '#7bdc78');
          renderOffline();
          _context41.n = 3;
          break;
        case 2:
          _context41.p = 2;
          _t39 = _context41.v;
          toast('OOPS', _t39.message, null, '#ff6b8a');
        case 3:
          return _context41.a(2);
      }
    }, _callee41, null, [[0, 2]]);
  }));
  return _doOfflineClaim.apply(this, arguments);
}
var ACH = [{
  id: 'first',
  name: 'Item Dealer',
  desc: 'Generate your first item',
  reward: 50,
  check: function check() {
    return state.stats.ig >= 1;
  }
}, {
  id: 'c100',
  name: 'Rookie Collector',
  desc: 'Generate 100 items',
  reward: 250,
  check: function check() {
    return state.stats.ig >= 100;
  }
}, {
  id: 'c500',
  name: 'Item Magnate',
  desc: 'Generate 500 items',
  reward: 2000,
  check: function check() {
    return state.stats.ig >= 500;
  }
}, {
  id: 's10k',
  name: 'Pocket Change',
  desc: 'Earn $10K total',
  reward: 1000,
  check: function check() {
    return state.stats.earned >= 1e4;
  }
}, {
  id: 's1m',
  name: 'Millionaire',
  desc: 'Earn $1M total',
  reward: 10000,
  check: function check() {
    return state.stats.earned >= 1e6;
  }
}, {
  id: 's10m',
  name: 'Vault Tycoon',
  desc: 'Earn $10M total',
  reward: 1000000,
  check: function check() {
    return state.stats.earned >= 1e7;
  }
}, {
  id: 'l10',
  name: 'Powered Up',
  desc: 'Reach Level 10',
  reward: 2000,
  check: function check() {
    return state.level >= 10;
  }
}, {
  id: 'l25',
  name: 'Well Oiled',
  desc: 'Reach Level 25',
  reward: 10000,
  check: function check() {
    return state.level >= 25;
  }
}, {
  id: 'l100',
  name: 'VAULTORIA',
  desc: 'Reach Level 100',
  reward: 10000000,
  check: function check() {
    return state.level >= 100;
  }
}, {
  id: 'r1',
  name: 'Shiny Trash',
  desc: 'Get a Rare item',
  reward: 1000,
  check: function check() {
    return state.stats.best >= 2;
  }
}, {
  id: 'e1',
  name: 'Glamour Trash',
  desc: 'Get an Epic item',
  reward: 5000,
  check: function check() {
    return state.stats.best >= 3;
  }
}, {
  id: 'l1',
  name: 'Blessed Trash',
  desc: 'Get a Legendary item',
  reward: 50000,
  check: function check() {
    return state.stats.best >= 4;
  }
}, {
  id: 'm1',
  name: 'VAULT GOD',
  desc: 'Get a Mythic item',
  reward: 1000000,
  check: function check() {
    return state.stats.best >= 5;
  }
}, {
  id: 'd1',
  name: 'Ascended',
  desc: 'Get a Divine item',
  reward: 5000000,
  check: function check() {
    return state.stats.best >= 6;
  }
}, {
  id: 'ce1',
  name: 'Starforged',
  desc: 'Get a Celestial item',
  reward: 25000000,
  check: function check() {
    return state.stats.best >= 7;
  }
}, {
  id: 'et1',
  name: 'Timeless',
  desc: 'Get an Eternal item',
  reward: 100000000,
  check: function check() {
    return state.stats.best >= 8;
  }
}, {
  id: 'om1',
  name: 'OMNIVERSAL',
  desc: 'Get an Omniversal item',
  reward: 500000000,
  check: function check() {
    return state.stats.best >= 9;
  }
}, {
  id: 'col10',
  name: 'Getting Closer',
  desc: 'Collect 10 item types',
  reward: 1000,
  check: function check() {
    return (state.stats.seen || []).length >= 10;
  }
}, {
  id: 'col50',
  name: 'Hoarding Fever',
  desc: 'Collect 50 item types',
  reward: 50000,
  check: function check() {
    return (state.stats.seen || []).length >= 50;
  }
}];
function checkAch() {
  if (!state.achievements) state.achievements = [];
  for (var _i2 = 0, _ACH = ACH; _i2 < _ACH.length; _i2++) {
    var a = _ACH[_i2];
    if (state.achievements.indexOf(a.id) !== -1) continue;
    if (a.check()) {
      state.achievements.push(a.id);
      state.money += a.reward;
      state.stats.earned = (state.stats.earned || 0) + a.reward;
      toast('ACHIEVEMENT', a.name, '$' + fmt(a.reward), '#ffb648');
      sfxToast();
      burst(window.innerWidth / 2, window.innerHeight * 0.3, RARITIES[3]);
    }
  }
}
function showNewAch(ids) {
  var shown = 0;
  var _iterator7 = _createForOfIteratorHelper(ids),
    _step7;
  try {
    var _loop4 = function _loop4() {
      var id = _step7.value;
      var a = ACH.find(function (x) {
        return x.id === id;
      });
      if (!a) return 1;
      setTimeout(function () {
        toast('ACHIEVEMENT', a.name, '$' + fmt(a.reward), '#ffb648');
        sfxToast();
      }, shown * 350);
      shown++;
    };
    for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
      if (_loop4()) continue;
    }
  } catch (err) {
    _iterator7.e(err);
  } finally {
    _iterator7.f();
  }
  if (shown) burst(window.innerWidth / 2, window.innerHeight * 0.3, RARITIES[3]);
}
function renderAch() {
  var list = $('achList');
  list.innerHTML = '';
  var _iterator8 = _createForOfIteratorHelper(ACH),
    _step8;
  try {
    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
      var a = _step8.value;
      var done = (state.achievements || []).indexOf(a.id) !== -1;
      var li = document.createElement('li');
      li.className = 'ach' + (done ? ' done' : '');
      li.innerHTML = '<div class="ach-name">' + a.name + (done ? " \u2713" : '') + '</div>' + '<div class="ach-desc">' + a.desc + '</div>' + '<div class="ach-reward">Reward: $' + fmt(a.reward) + '</div>';
      list.appendChild(li);
    }
  } catch (err) {
    _iterator8.e(err);
  } finally {
    _iterator8.f();
  }
}
$('bazaarBtn').addEventListener('click', function () {
  ac();
  openBazaar();
});
$('tradeBtn').addEventListener('click', function () {
  ac();
  openTrade();
});
function openBazaar() {
  if (!inGame) return;
  closeAllModals();
  $('bazaarModal').classList.remove('hidden');
  bazaarOpened = true;
  renderSellList();
  loadBazaar();
  refreshTutorial();
}
$('marketBtn').addEventListener('click', function () {
  ac();
  openMarket();
});
$('mActionsVault').addEventListener('click', function (e) {
  e.preventDefault();
  ac();
  toggleVault();
});
$('mActionsSell').addEventListener('click', function (e) {
  e.preventDefault();
  ac();
  sellAllItems(e.currentTarget);
});
$('mActionsMarket').addEventListener('click', function (e) {
  e.preventDefault();
  ac();
  openMarket();
});
$('mActionsBoss').addEventListener('click', function (e) {
  e.preventDefault();
  ac();
  openBossModal();
});
function openMarket() {
  if (!inGame) return;
  closeAllModals();
  $('mMoney').textContent = '$' + fmt(state.money);
  $('marketModal').classList.remove('hidden');
  renderMarket();
  renderBreachTargets();
}
document.querySelectorAll('.tab[data-mtab]').forEach(function (tab) {
  return tab.addEventListener('click', function () {
    ac();
    document.querySelectorAll('.tab[data-mtab]').forEach(function (t) {
      return t.classList.remove('active');
    });
    document.querySelectorAll('#marketModal .panel').forEach(function (p) {
      return p.classList.remove('active');
    });
    tab.classList.add('active');
    $('mpanel-' + tab.dataset.mtab).classList.add('active');
    if (tab.dataset.mtab === 'shop') renderMarket();else renderBreachTargets();
  });
});
var marketData = null;
function renderMarket() {
  return _renderMarket.apply(this, arguments);
}
function _renderMarket() {
  _renderMarket = _asyncToGenerator(_regenerator().m(function _callee42() {
    var list, _iterator18, _step18, _loop0, _t40, _t41;
    return _regenerator().w(function (_context43) {
      while (1) switch (_context43.p = _context43.n) {
        case 0:
          list = $('marketList');
          if (state) {
            _context43.n = 1;
            break;
          }
          return _context43.a(2);
        case 1:
          $('mMoney').textContent = '$' + fmt(state.money);
          list.innerHTML = '<li class="empty">Loading Market...</li>';
          _context43.p = 2;
          _context43.n = 3;
          return api('/market');
        case 3:
          marketData = _context43.v;
          list.innerHTML = '';
          _iterator18 = _createForOfIteratorHelper(marketData.items || []);
          _context43.p = 4;
          _loop0 = _regenerator().m(function _loop0() {
            var it, li, extra, btn;
            return _regenerator().w(function (_context42) {
              while (1) switch (_context42.n) {
                case 0:
                  it = _step18.value;
                  li = document.createElement('li');
                  li.className = 'ach';
                  extra = '';
                  if (it.id === 'breach' && it.cooldown > 0) extra = " \xB7 Breach ready in " + Math.ceil(it.cooldown / 1000) + 's';
                  li.innerHTML = '<span class="item-left"><span class="item-name">' + esc(it.name) + '</span>' + '<span style="font-size:12px;color:#8b93bd">' + esc(it.desc) + '</span>' + '<div class="ach-reward">Owned: ' + it.owned + extra + '</div></span>' + '<span class="item-right"><button class="mini-btn" data-buy="' + esc(it.id) + '">$' + fmt(it.price) + '</button></span>';
                  btn = li.querySelector('[data-buy]');
                  btn.disabled = state.money < it.price;
                  btn.addEventListener('click', function () {
                    return buyMarketItem(it.id);
                  });
                  list.appendChild(li);
                case 1:
                  return _context42.a(2);
              }
            }, _loop0);
          });
          _iterator18.s();
        case 5:
          if ((_step18 = _iterator18.n()).done) {
            _context43.n = 7;
            break;
          }
          return _context43.d(_regeneratorValues(_loop0()), 6);
        case 6:
          _context43.n = 5;
          break;
        case 7:
          _context43.n = 9;
          break;
        case 8:
          _context43.p = 8;
          _t40 = _context43.v;
          _iterator18.e(_t40);
        case 9:
          _context43.p = 9;
          _iterator18.f();
          return _context43.f(9);
        case 10:
          _context43.n = 12;
          break;
        case 11:
          _context43.p = 11;
          _t41 = _context43.v;
          list.innerHTML = '<li class="empty">' + esc(_t41.message) + '</li>';
        case 12:
          return _context43.a(2);
      }
    }, _callee42, null, [[4, 8, 9, 10], [2, 11]]);
  }));
  return _renderMarket.apply(this, arguments);
}
function buyMarketItem(_x12) {
  return _buyMarketItem.apply(this, arguments);
}
function _buyMarketItem() {
  _buyMarketItem = _asyncToGenerator(_regenerator().m(function _callee43(id) {
    var _r7, _t42;
    return _regenerator().w(function (_context44) {
      while (1) switch (_context44.p = _context44.n) {
        case 0:
          _context44.p = 0;
          _context44.n = 1;
          return api('/market/buy', {
            method: 'POST',
            body: JSON.stringify({
              item: id
            })
          });
        case 1:
          _r7 = _context44.v;
          state = _r7.state;
          sfxBuy();
          toast('PURCHASED', 'Breach added to your arsenal', '$' + fmt(_r7.price), '#ffb648');
          renderVault();
          renderMarket();
          renderBreachTargets();
          _context44.n = 3;
          break;
        case 2:
          _context44.p = 2;
          _t42 = _context44.v;
          toast('OOPS', _t42.message, null, '#ff6b8a');
        case 3:
          return _context44.a(2);
      }
    }, _callee43, null, [[0, 2]]);
  }));
  return _buyMarketItem.apply(this, arguments);
}
function renderBreachTargets() {
  var list = $('breachTargets');
  if (!state) return;
  var owned = state.breaches || 0;
  $('breachStats').textContent = 'You hold ' + owned + ' Breach' + (owned === 1 ? '' : 'es') + '. Pick an online member of this world to raid. Shielded keepers, and rookies (Level ' + NEWBIE_LEVEL + " and below), are protected \u2014 everyone else can be raided.";
  list.innerHTML = '';
  var targets = (members || []).filter(function (m) {
    return m.id !== me.id && m.online;
  });
  if (!targets.length) {
    list.innerHTML = '<li class="empty">No other players online in this world.</li>';
    return;
  }
  var _iterator9 = _createForOfIteratorHelper(targets),
    _step9;
  try {
    var _loop5 = function _loop5() {
      var m = _step9.value;
      var rookie = m.level <= NEWBIE_LEVEL;
      var blocked = !!m.shielded || rookie;
      var note = '';
      if (m.shielded) note = " \xB7 SHIELDED";else if (rookie) note = " \xB7 ROOKIE \xB7 PROTECTED";
      var li = document.createElement('li');
      li.innerHTML = '<span class="item-left"><span class="item-name" style="color:' + (m.shielded ? '#7bdcf0' : rookie ? '#8bd48b' : '#fff') + '">' + esc(m.username) + (m.shielded ? " \u26E8" : '') + '</span>' + '<span style="font-size:12px;color:#8b93bd">Lv ' + m.level + " \xB7 $" + fmt(m.money) + note + '</span></span>' + '<span class="item-right"><button class="mini-btn" data-breach="' + m.id + '">BREACH</button></span>';
      var btn = li.querySelector('[data-breach]');
      btn.disabled = owned <= 0 || blocked;
      if (m.shielded) {
        btn.className = 'mini-btn ghost';
        btn.textContent = 'SHIELDED';
      } else if (rookie) {
        btn.className = 'mini-btn ghost';
        btn.textContent = 'PROTECTED';
      }
      btn.addEventListener('click', function () {
        return useBreach(m.id, m.username);
      });
      list.appendChild(li);
    };
    for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
      _loop5();
    }
  } catch (err) {
    _iterator9.e(err);
  } finally {
    _iterator9.f();
  }
}
function useBreach(_x13, _x14) {
  return _useBreach.apply(this, arguments);
}
function _useBreach() {
  _useBreach = _asyncToGenerator(_regenerator().m(function _callee44(userId, name) {
    var _r8, got, _t43;
    return _regenerator().w(function (_context45) {
      while (1) switch (_context45.p = _context45.n) {
        case 0:
          _context45.p = 0;
          _context45.n = 1;
          return api('/breach', {
            method: 'POST',
            body: JSON.stringify({
              userId: userId
            })
          });
        case 1:
          _r8 = _context45.v;
          state = _r8.state;
          got = [];
          if (_r8.stolen.item) got.push(itemDisplayName(makeKey(_r8.stolen.item.name, _r8.stolen.item.mutation ? MUT_BY_ID[_r8.stolen.item.mutation] || null : null)) + ' x' + _r8.stolen.item.qty);
          if (_r8.stolen.money > 0) got.push('$' + fmt(_r8.stolen.money));
          sfxSell();
          toast('BREACH SUCCESS', 'Raided ' + name + (got.length ? " \u2014 took " + got.join(' + ') : " \u2014 they were flat broke"), null, '#ff6b8a');
          renderVault();
          renderBreachTargets();
          _context45.n = 3;
          break;
        case 2:
          _context45.p = 2;
          _t43 = _context45.v;
          toast('OOPS', _t43.message, null, '#ff6b8a');
        case 3:
          return _context45.a(2);
      }
    }, _callee44, null, [[0, 2]]);
  }));
  return _useBreach.apply(this, arguments);
}
$('leadBtn').addEventListener('click', function () {
  ac();
  openLeaders();
});
function openLeaders() {
  if (!inGame) return;
  closeAllModals();
  var inp = $('leaderSearch');
  if (inp) inp.value = '';
  $('leaderCount').textContent = '';
  $('leaderModal').classList.remove('hidden');
  loadLeaders();
}
function loadLeaders() {
  return _loadLeaders.apply(this, arguments);
}
function _loadLeaders() {
  _loadLeaders = _asyncToGenerator(_regenerator().m(function _callee45() {
    var list, _yield$api3, leaders, total, _t44;
    return _regenerator().w(function (_context46) {
      while (1) switch (_context46.p = _context46.n) {
        case 0:
          list = $('leaderList');
          list.innerHTML = '<li class="empty">Loading leaderboard...</li>';
          _context46.p = 1;
          _context46.n = 2;
          return api('/leaderboard');
        case 2:
          _yield$api3 = _context46.v;
          leaders = _yield$api3.leaders;
          total = _yield$api3.total;
          renderLeaders(leaders, total);
          _context46.n = 4;
          break;
        case 3:
          _context46.p = 3;
          _t44 = _context46.v;
          list.innerHTML = '<li class="empty">' + esc(_t44.message) + '</li>';
        case 4:
          return _context46.a(2);
      }
    }, _callee45, null, [[1, 3]]);
  }));
  return _loadLeaders.apply(this, arguments);
}
var leadersAll = [];
var leadersTotal = 0;
function renderLeaders(leaders, total) {
  leadersAll = leaders || [];
  leadersTotal = Number(total || leadersAll.length);
  applyLeaderSearch();
}
function applyLeaderSearch() {
  var list = $('leaderList');
  var cnt = $('leaderCount');
  var inp = $('leaderSearch');
  var q = '';
  if (inp) q = inp.value.trim().toLowerCase();
  var rows = leadersAll.slice();
  if (q) rows = rows.filter(function (p) {
    return String(p.username || '').toLowerCase().indexOf(q) !== -1 || String(p.rank || '').indexOf(q) !== -1;
  });
  if (cnt) cnt.textContent = q ? rows.length + ' match' + (rows.length === 1 ? '' : 'es') + ' of ' + leadersTotal + ' registered keepers' : 'Top ' + rows.length + ' of ' + leadersTotal + ' registered keepers';
  if (!rows.length) {
    list.innerHTML = '<li class="empty">No keepers match.</li>';
    return;
  }
  list.innerHTML = '';
  var _iterator0 = _createForOfIteratorHelper(rows),
    _step0;
  try {
    for (_iterator0.s(); !(_step0 = _iterator0.n()).done;) {
      var p = _step0.value;
      var li = document.createElement('li');
      li.innerHTML = '<span class="item-left"><span class="item-name"' + (p.me ? ' style="color:#4fd1ff"' : '') + '>#' + p.rank + ' ' + esc(p.username) + (p.me ? ' (you)' : '') + '</span>' + '<span style="font-size:12px;color:#8b93bd">Level ' + p.level + '</span></span>' + '<span class="item-right"><span class="item-value">$' + fmt(p.money) + '</span></span>';
      list.appendChild(li);
    }
  } catch (err) {
    _iterator0.e(err);
  } finally {
    _iterator0.f();
  }
}
document.querySelectorAll('.tab[data-btab]').forEach(function (tab) {
  return tab.addEventListener('click', function () {
    document.querySelectorAll('.tab[data-btab]').forEach(function (t) {
      return t.classList.remove('active');
    });
    document.querySelectorAll('#bazaarModal .panel').forEach(function (p) {
      return p.classList.remove('active');
    });
    tab.classList.add('active');
    $('bpanel-' + tab.dataset.btab).classList.add('active');
    if (tab.dataset.btab === 'browse') loadBazaar();else renderSellList();
  });
});
var bazaarQuery = '',
  bazaarRarity = '',
  bazaarMutation = '';
function initBazaarFilters() {
  var rsel = $('bazaarRarity');
  if (rsel && !rsel.options.length) {
    rsel.innerHTML = '<option value="">All rarities</option>' + RARITIES.map(function (r) {
      return '<option value="' + r.key + '">' + r.name + '</option>';
    }).join('');
    $('bazaarMutation').innerHTML = '<option value="">All mutations</option><option value="none">Unmutated</option>' + MUTATIONS.map(function (m) {
      return '<option value="' + m.id + '">' + m.name + '</option>';
    }).join('');
  }
}
function bazaarFiltered(listings) {
  return listings.filter(function (l) {
    if (bazaarRarity && rarityFor(l.itemName).key !== bazaarRarity) return false;
    if (bazaarMutation) {
      if (bazaarMutation === 'none') {
        if (l.mutation) return false;
      } else if (l.mutation !== bazaarMutation) return false;
    }
    return true;
  });
}
function loadBazaar() {
  return _loadBazaar.apply(this, arguments);
}
function _loadBazaar() {
  _loadBazaar = _asyncToGenerator(_regenerator().m(function _callee46() {
    var list, _yield$api4, listings, filtered, _iterator19, _step19, _loop1, _t45, _t46;
    return _regenerator().w(function (_context48) {
      while (1) switch (_context48.p = _context48.n) {
        case 0:
          list = $('browseList');
          initBazaarFilters();
          list.innerHTML = '<li class="empty">Loading bazaar...</li>';
          _context48.p = 1;
          _context48.n = 2;
          return api('/bazaar' + (bazaarQuery ? '?q=' + encodeURIComponent(bazaarQuery) : ''));
        case 2:
          _yield$api4 = _context48.v;
          listings = _yield$api4.listings;
          filtered = bazaarFiltered(listings);
          if (filtered.length) {
            _context48.n = 3;
            break;
          }
          list.innerHTML = '<li class="empty">No listings match. Try a different search.</li>';
          return _context48.a(2);
        case 3:
          list.innerHTML = '';
          _iterator19 = _createForOfIteratorHelper(filtered);
          _context48.p = 4;
          _loop1 = _regenerator().m(function _loop1() {
            var l, rar, mut, nameHtml, li;
            return _regenerator().w(function (_context47) {
              while (1) switch (_context47.n) {
                case 0:
                  l = _step19.value;
                  rar = rarityFor(l.itemName);
                  mut = MUT_BY_ID[l.mutation];
                  nameHtml = mut ? '<span style="color:' + mut.color + '">' + esc(mut.name) + '</span> <span style="color:' + rar.color + '">' + esc(l.itemName) + '</span>' : '<span style="color:' + rar.color + '">' + esc(l.itemName) + '</span>';
                  li = document.createElement('li');
                  li.innerHTML = '<span class="item-left"><span class="item-name">' + nameHtml + ' x' + l.quantity + '</span>' + '<span class="rarity" style="color:' + rar.color + ';background:' + rar.color + '1f;border:1px solid ' + rar.color + '59">' + rar.name + (mut ? " \xB7 " + mut.name : '') + '</span>' + '<span style="font-size:11px;color:#8b93bd">Seller: ' + esc(l.seller) + '</span></span>' + '<span class="item-right"><span class="item-value">$' + fmt(l.price) + '</span>' + (l.mine ? '<button class="mini-btn ghost" data-cancel="' + l.id + '">Cancel</button>' : '<button class="mini-btn" data-buy="' + l.id + '">Buy</button>') + '</span>';
                  li.querySelector('[data-buy]') && li.querySelector('[data-buy]').addEventListener('click', function () {
                    return buyListing(l.id);
                  });
                  li.querySelector('[data-cancel]') && li.querySelector('[data-cancel]').addEventListener('click', function () {
                    return cancelListing(l.id);
                  });
                  list.appendChild(li);
                case 1:
                  return _context47.a(2);
              }
            }, _loop1);
          });
          _iterator19.s();
        case 5:
          if ((_step19 = _iterator19.n()).done) {
            _context48.n = 7;
            break;
          }
          return _context48.d(_regeneratorValues(_loop1()), 6);
        case 6:
          _context48.n = 5;
          break;
        case 7:
          _context48.n = 9;
          break;
        case 8:
          _context48.p = 8;
          _t45 = _context48.v;
          _iterator19.e(_t45);
        case 9:
          _context48.p = 9;
          _iterator19.f();
          return _context48.f(9);
        case 10:
          _context48.n = 12;
          break;
        case 11:
          _context48.p = 11;
          _t46 = _context48.v;
          list.innerHTML = '<li class="empty">' + esc(_t46.message) + '</li>';
        case 12:
          return _context48.a(2);
      }
    }, _callee46, null, [[4, 8, 9, 10], [1, 11]]);
  }));
  return _loadBazaar.apply(this, arguments);
}
function buyListing(_x15) {
  return _buyListing.apply(this, arguments);
}
function _buyListing() {
  _buyListing = _asyncToGenerator(_regenerator().m(function _callee47(id) {
    var _r9, _t47;
    return _regenerator().w(function (_context49) {
      while (1) switch (_context49.p = _context49.n) {
        case 0:
          _context49.p = 0;
          _context49.n = 1;
          return api('/bazaar/' + id + '/buy', {
            method: 'POST'
          });
        case 1:
          _r9 = _context49.v;
          state = _r9.state;
          sfxBuy();
          toast('PURCHASE', 'Item added to your vault', null, '#7bdc78');
          if (_r9.newAch && _r9.newAch.length) showNewAch(_r9.newAch);
          renderVault();
          loadBazaar();
          _context49.n = 3;
          break;
        case 2:
          _context49.p = 2;
          _t47 = _context49.v;
          toast('OOPS', _t47.message, null, '#ff6b8a');
        case 3:
          return _context49.a(2);
      }
    }, _callee47, null, [[0, 2]]);
  }));
  return _buyListing.apply(this, arguments);
}
function cancelListing(_x16) {
  return _cancelListing.apply(this, arguments);
}
function _cancelListing() {
  _cancelListing = _asyncToGenerator(_regenerator().m(function _callee48(id) {
    var _r0, _t48;
    return _regenerator().w(function (_context50) {
      while (1) switch (_context50.p = _context50.n) {
        case 0:
          _context50.p = 0;
          _context50.n = 1;
          return api('/bazaar/' + id, {
            method: 'DELETE'
          });
        case 1:
          _r0 = _context50.v;
          state = _r0.state;
          toast('CANCELLED', 'Item returned to your vault', null, '#ffb648');
          renderVault();
          loadBazaar();
          _context50.n = 3;
          break;
        case 2:
          _context50.p = 2;
          _t48 = _context50.v;
          toast('OOPS', _t48.message, null, '#ff6b8a');
        case 3:
          return _context50.a(2);
      }
    }, _callee48, null, [[0, 2]]);
  }));
  return _cancelListing.apply(this, arguments);
}
function renderSellList() {
  var list = $('sellList');
  var entries = Object.entries(state.counts || {});
  if (!entries.length) {
    list.innerHTML = '<li class="empty">You have no items to sell. Generate some first!</li>';
    return;
  }
  list.innerHTML = '';
  entries.sort(function (a, b) {
    return itemValueKey(b[0]) - itemValueKey(a[0]);
  });
  var _loop6 = function _loop6() {
    var _entries$_i = _slicedToArray(_entries[_i3], 2),
      it = _entries$_i[0],
      count = _entries$_i[1];
    var rar = rarityFor(baseName(it));
    var li = document.createElement('li');
    li.className = 'sell-row';
    li.innerHTML = '<span class="item-left"><span class="item-name">' + itemDisplayName(it) + '</span>' + mutBadge(it) + '<span class="rarity" style="color:' + rar.color + ';background:' + rar.color + '1f;border:1px solid ' + rar.color + '59">' + rar.name + '</span></span>' + '<span class="sell-field"><label>Qty</label><input type="number" min="1" max="' + count + '" value="1" data-qty></span>' + '<span class="sell-field"><label>Price ($)</label><input type="number" min="1" value="' + Math.max(1, Math.floor(itemValueKey(it))) + '" data-price></span>' + '<button class="mini-btn orange" data-list>List</button>';
    var qtyInp = li.querySelector('[data-qty]');
    var priceInp = li.querySelector('[data-price]');
    qtyInp.addEventListener('input', function () {
      var q = Math.max(1, Math.min(count, parseInt(qtyInp.value, 10) || 1));
      priceInp.value = Math.max(1, Math.floor(itemValueKey(it) * q));
    });
    li.querySelector('[data-list]').addEventListener('click', function () {
      var qty = Math.max(1, Math.min(count, parseInt(qtyInp.value, 10) || 1));
      var price = Math.max(1, parseInt(priceInp.value, 10) || 1);
      listItem(it, rar, qty, price);
    });
    list.appendChild(li);
  };
  for (var _i3 = 0, _entries = entries; _i3 < _entries.length; _i3++) {
    _loop6();
  }
}
function listItem(_x17, _x18, _x19, _x20) {
  return _listItem.apply(this, arguments);
}
function _listItem() {
  _listItem = _asyncToGenerator(_regenerator().m(function _callee49(itemKey, rar, quantity, price) {
    var _r1, _t49;
    return _regenerator().w(function (_context51) {
      while (1) switch (_context51.p = _context51.n) {
        case 0:
          _context51.p = 0;
          _context51.n = 1;
          return api('/bazaar', {
            method: 'POST',
            body: JSON.stringify({
              itemName: itemKey,
              rarity: rar.key,
              quantity: quantity,
              price: price
            })
          });
        case 1:
          _r1 = _context51.v;
          state = _r1.state;
          sfxBuy();
          toast('LISTED', baseName(itemKey) + ' x' + quantity + ' for $' + fmt(price), null, '#ffb648');
          renderVault();
          loadBazaar();
          document.querySelector('.tab[data-btab="browse"]').click();
          _context51.n = 3;
          break;
        case 2:
          _context51.p = 2;
          _t49 = _context51.v;
          toast('OOPS', _t49.message, null, '#ff6b8a');
        case 3:
          return _context51.a(2);
      }
    }, _callee49, null, [[0, 2]]);
  }));
  return _listItem.apply(this, arguments);
}
$('bazaarSearch').addEventListener('input', function () {
  bazaarQuery = $('bazaarSearch').value.trim();
  loadBazaar();
});
$('leaderSearch').addEventListener('input', applyLeaderSearch);
$('bazaarRarity').addEventListener('change', function () {
  bazaarRarity = $('bazaarRarity').value;
  loadBazaar();
});
$('bazaarMutation').addEventListener('change', function () {
  bazaarMutation = $('bazaarMutation').value;
  loadBazaar();
});
var pendingTradeReqs = [];
var activeTrade = null;
var tradeDraft = {
  items: {},
  money: 0
};
var tradeDraftDirty = false;
function openTrade() {
  if (!inGame) return;
  closeAllModals();
  $('tradeModal').classList.remove('hidden');
  $('tMoney').textContent = '$' + fmt(state.money);
  if (activeTrade) {
    $('tradeStart').classList.add('hidden');
    $('tradeBuilder').classList.remove('hidden');
    renderTrade();
    return;
  }
  $('tradeStart').classList.remove('hidden');
  $('tradeBuilder').classList.add('hidden');
  renderPendingReqs();
  loadOnline();
}
function renderTradeInventory() {
  var list = $('tradeInventory');
  if (!list) return;
  list.innerHTML = '';
  var counts = state.counts || {};
  var entries = Object.entries(counts).sort(function (a, b) {
    return itemValueKey(b[0]) - itemValueKey(a[0]);
  });
  if (entries.length === 0) {
    list.innerHTML = '<li class="empty">No items in inventory</li>';
    return;
  }
  var _iterator1 = _createForOfIteratorHelper(entries),
    _step1;
  try {
    var _loop7 = function _loop7() {
      var _step1$value = _slicedToArray(_step1.value, 2),
        it = _step1$value[0],
        count = _step1$value[1];
      var rar = rarityFor(baseName(it));
      var inDraft = tradeDraft.items[it] || 0;
      var li = document.createElement('li');
      li.className = 'offer-row';
      li.innerHTML = '<span class="item-left"><span class="item-name">' + itemDisplayName(it) + '</span>' + mutBadge(it) + '<span class="rarity" style="color:' + rar.color + ';background:' + rar.color + '1f;border:1px solid ' + rar.color + '59">' + rar.name + '</span></span>' + '<span class="item-value">x' + count + '</span>' + '<div style="display:flex;align-items:center;gap:4px">' + '<button class="mini-btn" data-add="' + it + '" style="padding:4px 8px;font-size:11px">+</button>' + '<span style="font-size:12px;font-weight:700;min-width:20px;text-align:center">' + inDraft + '</span>' + '<button class="mini-btn ghost" data-remove="' + it + '" style="padding:4px 8px;font-size:11px">-</button>' + '</div>';
      li.querySelector('[data-add]').addEventListener('click', function () {
        if (inDraft < count) {
          tradeDraft.items[it] = inDraft + 1;
          tradeDraftDirty = true;
          renderTradeInventory();
        }
      });
      li.querySelector('[data-remove]').addEventListener('click', function () {
        if (inDraft > 0) {
          tradeDraft.items[it] = inDraft - 1;
          if (tradeDraft.items[it] === 0) delete tradeDraft.items[it];
          tradeDraftDirty = true;
          renderTradeInventory();
        }
      });
      list.appendChild(li);
    };
    for (_iterator1.s(); !(_step1 = _iterator1.n()).done;) {
      _loop7();
    }
  } catch (err) {
    _iterator1.e(err);
  } finally {
    _iterator1.f();
  }
}
function loadOnline() {
  return _loadOnline.apply(this, arguments);
}
function _loadOnline() {
  _loadOnline = _asyncToGenerator(_regenerator().m(function _callee51() {
    var _r10, _list, _iterator20, _step20, u, li, _list2, _t51, _t52;
    return _regenerator().w(function (_context53) {
      while (1) switch (_context53.p = _context53.n) {
        case 0:
          _context53.p = 0;
          _context53.n = 1;
          return api('/online');
        case 1:
          _r10 = _context53.v;
          _list = $('onlineList');
          if (_list) {
            _context53.n = 2;
            break;
          }
          return _context53.a(2);
        case 2:
          if (!(!_r10 || !_r10.online)) {
            _context53.n = 3;
            break;
          }
          _list.innerHTML = '<li class="empty">No online keepers</li>';
          return _context53.a(2);
        case 3:
          _list.innerHTML = '';
          _iterator20 = _createForOfIteratorHelper(_r10.online);
          _context53.p = 4;
          _iterator20.s();
        case 5:
          if ((_step20 = _iterator20.n()).done) {
            _context53.n = 8;
            break;
          }
          u = _step20.value;
          if (!(u.id === me.id)) {
            _context53.n = 6;
            break;
          }
          return _context53.a(3, 7);
        case 6:
          li = document.createElement('li');
          li.innerHTML = '<span class="name">' + esc(u.username) + '</span>' + '<button class="mini-btn" data-trade-user="' + u.id + '" data-trade-name="' + esc(u.username) + '">Request Trade</button>';
          li.querySelector('[data-trade-user]').addEventListener('click', function () {
            var _ref19 = _asyncToGenerator(_regenerator().m(function _callee50(e) {
              var userId, username, _t50;
              return _regenerator().w(function (_context52) {
                while (1) switch (_context52.p = _context52.n) {
                  case 0:
                    userId = parseInt(e.target.dataset.tradeUser, 10);
                    username = e.target.dataset.tradeName;
                    _context52.p = 1;
                    _context52.n = 2;
                    return api('/trade/request', {
                      method: 'POST',
                      body: JSON.stringify({
                        toUserId: userId
                      })
                    });
                  case 2:
                    toast('REQUEST SENT', 'Waiting for ' + username + ' to accept', null, '#4fd1ff');
                    _context52.n = 4;
                    break;
                  case 3:
                    _context52.p = 3;
                    _t50 = _context52.v;
                    toast('OOPS', _t50.message, null, '#ff6b8a');
                  case 4:
                    return _context52.a(2);
                }
              }, _callee50, null, [[1, 3]]);
            }));
            return function (_x37) {
              return _ref19.apply(this, arguments);
            };
          }());
          _list.appendChild(li);
        case 7:
          _context53.n = 5;
          break;
        case 8:
          _context53.n = 10;
          break;
        case 9:
          _context53.p = 9;
          _t51 = _context53.v;
          _iterator20.e(_t51);
        case 10:
          _context53.p = 10;
          _iterator20.f();
          return _context53.f(10);
        case 11:
          _context53.n = 13;
          break;
        case 12:
          _context53.p = 12;
          _t52 = _context53.v;
          _list2 = $('onlineList');
          if (_list2) _list2.innerHTML = '<li class="empty">Could not load online keepers</li>';
        case 13:
          return _context53.a(2);
      }
    }, _callee51, null, [[4, 9, 10, 11], [0, 12]]);
  }));
  return _loadOnline.apply(this, arguments);
}
function renderPendingReqs() {
  var div = $('tradeRequests');
  if (!div) return;
  div.innerHTML = '';
  if (!pendingTradeReqs.length) return;
  var _iterator10 = _createForOfIteratorHelper(pendingTradeReqs),
    _step10;
  try {
    var _loop8 = function _loop8() {
      var req = _step10.value;
      var p = document.createElement('div');
      p.className = 'row';
      p.innerHTML = '<span class="name">' + esc(req.fromName) + '</span>' + '<button class="mini-btn" data-accept="' + req.id + '">Accept</button>' + '<button class="mini-btn ghost" data-decline="' + req.id + '">Decline</button>';
      p.querySelector('[data-accept]').addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee6() {
        var r, _t7;
        return _regenerator().w(function (_context6) {
          while (1) switch (_context6.p = _context6.n) {
            case 0:
              _context6.p = 0;
              _context6.n = 1;
              return api('/trade/request/' + req.id + '/accept', {
                method: 'POST'
              });
            case 1:
              r = _context6.v;
              activeTrade = r.trade;
              pendingTradeReqs = pendingTradeReqs.filter(function (x) {
                return x.id !== req.id;
              });
              $('tradeStart').classList.add('hidden');
              $('tradeBuilder').classList.remove('hidden');
              renderTrade();
              _context6.n = 3;
              break;
            case 2:
              _context6.p = 2;
              _t7 = _context6.v;
              toast('OOPS', _t7.message, null, '#ff6b8a');
            case 3:
              return _context6.a(2);
          }
        }, _callee6, null, [[0, 2]]);
      })));
      p.querySelector('[data-decline]').addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee7() {
        var _t8;
        return _regenerator().w(function (_context7) {
          while (1) switch (_context7.p = _context7.n) {
            case 0:
              _context7.p = 0;
              _context7.n = 1;
              return api('/trade/request/' + req.id + '/decline', {
                method: 'POST'
              });
            case 1:
              pendingTradeReqs = pendingTradeReqs.filter(function (x) {
                return x.id !== req.id;
              });
              renderPendingReqs();
              _context7.n = 3;
              break;
            case 2:
              _context7.p = 2;
              _t8 = _context7.v;
            case 3:
              return _context7.a(2);
          }
        }, _callee7, null, [[0, 2]]);
      })));
      div.appendChild(p);
    };
    for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
      _loop8();
    }
  } catch (err) {
    _iterator10.e(err);
  } finally {
    _iterator10.f();
  }
}
$('tradeSend').addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee8() {
  var inp, username, r, _t9;
  return _regenerator().w(function (_context8) {
    while (1) switch (_context8.p = _context8.n) {
      case 0:
        inp = $('tradeUser');
        username = (inp.value || '').trim();
        if (username) {
          _context8.n = 1;
          break;
        }
        return _context8.a(2);
      case 1:
        _context8.p = 1;
        _context8.n = 2;
        return api('/trade/request', {
          method: 'POST',
          body: JSON.stringify({
            toUsername: username
          })
        });
      case 2:
        r = _context8.v;
        toast('REQUEST SENT', 'Waiting for ' + username + ' to accept', null, '#4fd1ff');
        inp.value = '';
        _context8.n = 4;
        break;
      case 3:
        _context8.p = 3;
        _t9 = _context8.v;
        toast('OOPS', _t9.message, null, '#ff6b8a');
      case 4:
        return _context8.a(2);
    }
  }, _callee8, null, [[1, 3]]);
})));
function renderTrade() {
  if (!activeTrade || !activeTrade.you) return;
  var you = activeTrade.you;
  var other = activeTrade.other || {};
  var mine = $('tradeMine');
  var theirs = $('tradeTheirs');
  var draft = $('tradeDraft');
  if (!mine || !theirs) return;
  var html = '';
  for (var _i4 = 0, _Object$entries = Object.entries(you.items || {}); _i4 < _Object$entries.length; _i4++) {
    var _Object$entries$_i = _slicedToArray(_Object$entries[_i4], 2),
      key = _Object$entries$_i[0],
      qty = _Object$entries$_i[1];
    var rar = rarityFor(baseName(key));
    html += '<li class="row"><span class="item-left"><span class="item-name">' + itemDisplayName(key) + '</span>' + mutBadge(key) + '</span><span class="item-count">x' + qty + '</span></li>';
  }
  if (you.money > 0) html += '<li class="row"><span class="name">Money</span><span class="item-count">$' + fmt(you.money) + '</span></li>';
  mine.innerHTML = html || '<li class="empty">Nothing offered</li>';
  html = '';
  for (var _i5 = 0, _Object$entries2 = Object.entries(other.items || {}); _i5 < _Object$entries2.length; _i5++) {
    var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i5], 2),
      _key = _Object$entries2$_i[0],
      _qty = _Object$entries2$_i[1];
    var _rar = rarityFor(baseName(_key));
    html += '<li class="row"><span class="item-left"><span class="item-name">' + itemDisplayName(_key) + '</span>' + mutBadge(_key) + '</span><span class="item-count">x' + _qty + '</span></li>';
  }
  if (other.money > 0) html += '<li class="row"><span class="name">Money</span><span class="item-count">$' + fmt(other.money) + '</span></li>';
  theirs.innerHTML = html || '<li class="empty">Nothing offered</li>';
  var status = $('tradeStatus');
  if (status) {
    var s = '';
    if (you.locked && other.locked) s = "Both offers locked \u2014 confirm to complete";else if (you.locked) s = 'Your offer is locked. Waiting for them...';else if (other.locked) s = 'Their offer is locked. Lock yours to continue.';else s = 'Add items or money, then lock your offer.';
    status.textContent = s;
  }
  var lockBtn = $('tradeLock');
  var confirmBtn = $('tradeConfirm');
  var moneyInput = $('tradeMoneyInput');
  var updateBtn = $('tradeUpdateOffer');
  if (lockBtn) {
    lockBtn.textContent = you.locked ? 'UNLOCK OFFER' : 'LOCK OFFER';
    lockBtn.disabled = false;
  }
  if (confirmBtn) {
    confirmBtn.disabled = !(you.locked && other.locked);
  }
  if (draft) {
    if (you.locked) {
      draft.classList.add('hidden');
    } else {
      draft.classList.remove('hidden');
      if (moneyInput) {
        moneyInput.value = you.money || 0;
        moneyInput.disabled = false;
      }
      if (updateBtn) {
        updateBtn.disabled = false;
      }
      tradeDraft = {
        items: Object.assign({}, you.items || {}),
        money: you.money || 0
      };
      renderTradeInventory();
    }
  }
}
$('tradeUpdateOffer').addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee9() {
  var moneyInput, money, r, _t0;
  return _regenerator().w(function (_context9) {
    while (1) switch (_context9.p = _context9.n) {
      case 0:
        if (activeTrade) {
          _context9.n = 1;
          break;
        }
        return _context9.a(2);
      case 1:
        _context9.p = 1;
        moneyInput = $('tradeMoneyInput');
        money = Math.max(0, Math.floor(Number(moneyInput ? moneyInput.value : 0) || 0));
        _context9.n = 2;
        return api('/trade/' + activeTrade.id + '/offer', {
          method: 'POST',
          body: JSON.stringify({
            items: tradeDraft.items,
            money: money
          })
        });
      case 2:
        r = _context9.v;
        activeTrade = r.trade;
        tradeDraftDirty = false;
        renderTrade();
        toast('OFFER UPDATED', 'Your offer has been sent', null, '#4fd1ff');
        _context9.n = 4;
        break;
      case 3:
        _context9.p = 3;
        _t0 = _context9.v;
        toast('OOPS', _t0.message, null, '#ff6b8a');
      case 4:
        return _context9.a(2);
    }
  }, _callee9, null, [[1, 3]]);
})));
$('tradeLock').addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee0() {
  var locked, r, _t1;
  return _regenerator().w(function (_context0) {
    while (1) switch (_context0.p = _context0.n) {
      case 0:
        if (activeTrade) {
          _context0.n = 1;
          break;
        }
        return _context0.a(2);
      case 1:
        _context0.p = 1;
        locked = !!(activeTrade.you || {}).locked;
        _context0.n = 2;
        return api('/trade/' + activeTrade.id + (locked ? '/unlock' : '/lock'), {
          method: 'POST',
          body: JSON.stringify({
            items: (activeTrade.you || {}).items || {},
            money: (activeTrade.you || {}).money || 0
          })
        });
      case 2:
        r = _context0.v;
        activeTrade = r.trade;
        renderTrade();
        _context0.n = 4;
        break;
      case 3:
        _context0.p = 3;
        _t1 = _context0.v;
        toast('OOPS', _t1.message, null, '#ff6b8a');
      case 4:
        return _context0.a(2);
    }
  }, _callee0, null, [[1, 3]]);
})));
$('tradeConfirm').addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee1() {
  var r, _t10;
  return _regenerator().w(function (_context1) {
    while (1) switch (_context1.p = _context1.n) {
      case 0:
        if (activeTrade) {
          _context1.n = 1;
          break;
        }
        return _context1.a(2);
      case 1:
        _context1.p = 1;
        _context1.n = 2;
        return api('/trade/' + activeTrade.id + '/confirm', {
          method: 'POST'
        });
      case 2:
        r = _context1.v;
        state = r.state;
        activeTrade = null;
        toast('TRADE COMPLETE', 'Your trade was successful', null, '#7bdc78');
        closeAllModals();
        renderVault();
        _context1.n = 4;
        break;
      case 3:
        _context1.p = 3;
        _t10 = _context1.v;
        toast('OOPS', _t10.message, null, '#ff6b8a');
      case 4:
        return _context1.a(2);
    }
  }, _callee1, null, [[1, 3]]);
})));
$('tradeCancel').addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee10() {
  var _t11;
  return _regenerator().w(function (_context10) {
    while (1) switch (_context10.p = _context10.n) {
      case 0:
        if (activeTrade) {
          _context10.n = 1;
          break;
        }
        return _context10.a(2);
      case 1:
        _context10.p = 1;
        _context10.n = 2;
        return api('/trade/' + activeTrade.id + '/cancel', {
          method: 'POST'
        });
      case 2:
        activeTrade = null;
        $('tradeStart').classList.remove('hidden');
        $('tradeBuilder').classList.add('hidden');
        renderPendingReqs();
        loadOnline();
        _context10.n = 4;
        break;
      case 3:
        _context10.p = 3;
        _t11 = _context10.v;
        toast('OOPS', _t11.message, null, '#ff6b8a');
      case 4:
        return _context10.a(2);
    }
  }, _callee10, null, [[1, 3]]);
})));
function renderQuests() {
  return _renderQuests.apply(this, arguments);
}
function _renderQuests() {
  _renderQuests = _asyncToGenerator(_regenerator().m(function _callee52() {
    var list, data, _iterator21, _step21, _loop10, _t53, _t54;
    return _regenerator().w(function (_context55) {
      while (1) switch (_context55.p = _context55.n) {
        case 0:
          list = $('questList');
          if (list) {
            _context55.n = 1;
            break;
          }
          return _context55.a(2);
        case 1:
          list.innerHTML = '<li class="empty">Loading quests...</li>';
          data = null;
          _context55.p = 2;
          _context55.n = 3;
          return api('/daily');
        case 3:
          data = _context55.v;
          _context55.n = 5;
          break;
        case 4:
          _context55.p = 4;
          _t53 = _context55.v;
          data = dailyData;
        case 5:
          if (data) {
            _context55.n = 6;
            break;
          }
          list.innerHTML = '<li class="empty">Could not load quests.</li>';
          return _context55.a(2);
        case 6:
          dailyData = data;
          $('questInfo').textContent = (data.claimed || []).length + ' / ' + (data.quests || []).length + ' claimed';
          list.innerHTML = '';
          _iterator21 = _createForOfIteratorHelper(data.quests || []);
          _context55.p = 7;
          _loop10 = _regenerator().m(function _loop10() {
            var q, prog, done, claimed, pct, li, btn;
            return _regenerator().w(function (_context54) {
              while (1) switch (_context54.n) {
                case 0:
                  q = _step21.value;
                  prog = Number((data.prog || {})[q.id] || 0);
                  done = prog >= q.target;
                  claimed = (data.claimed || []).indexOf(q.id) !== -1;
                  pct = Math.min(100, prog / q.target * 100);
                  li = document.createElement('li');
                  li.className = 'quest' + (claimed ? ' done' : '');
                  li.innerHTML = '<div class="quest-head"><span class="quest-name">' + esc(q.name) + '</span>' + '<span class="quest-reward">$' + fmt(q.reward) + '</span></div>' + '<div class="quest-desc">' + esc(q.desc) + " \xB7 " + fmt(Math.min(prog, q.target)) + ' / ' + fmt(q.target) + '</div>' + '<div class="progress"><div class="progress-fill" style="width:' + pct + '%"></div></div>';
                  btn = document.createElement('button');
                  btn.className = 'mini-btn' + (claimed || !done ? ' ghost' : '');
                  btn.textContent = claimed ? 'Claimed' : done ? 'Claim' : 'In progress';
                  btn.disabled = claimed || !done;
                  if (!claimed && done) btn.addEventListener('click', function () {
                    return claimQuest(q.id);
                  });
                  li.appendChild(btn);
                  list.appendChild(li);
                case 1:
                  return _context54.a(2);
              }
            }, _loop10);
          });
          _iterator21.s();
        case 8:
          if ((_step21 = _iterator21.n()).done) {
            _context55.n = 10;
            break;
          }
          return _context55.d(_regeneratorValues(_loop10()), 9);
        case 9:
          _context55.n = 8;
          break;
        case 10:
          _context55.n = 12;
          break;
        case 11:
          _context55.p = 11;
          _t54 = _context55.v;
          _iterator21.e(_t54);
        case 12:
          _context55.p = 12;
          _iterator21.f();
          return _context55.f(12);
        case 13:
          return _context55.a(2);
      }
    }, _callee52, null, [[7, 11, 12, 13], [2, 4]]);
  }));
  return _renderQuests.apply(this, arguments);
}
function claimQuest(_x21) {
  return _claimQuest.apply(this, arguments);
}
function _claimQuest() {
  _claimQuest = _asyncToGenerator(_regenerator().m(function _callee53(id) {
    var _r11, _t55;
    return _regenerator().w(function (_context56) {
      while (1) switch (_context56.p = _context56.n) {
        case 0:
          _context56.p = 0;
          _context56.n = 1;
          return api('/daily/claim', {
            method: 'POST',
            body: JSON.stringify({
              id: id
            })
          });
        case 1:
          _r11 = _context56.v;
          state = _r11.state;
          dailyData = _r11.daily;
          toast('QUEST COMPLETE', 'Reward claimed', '$' + fmt(_r11.reward), '#7bdc78');
          sfxToast();
          renderVault();
          renderQuests();
          _context56.n = 3;
          break;
        case 2:
          _context56.p = 2;
          _t55 = _context56.v;
          toast('OOPS', _t55.message, null, '#ff6b8a');
        case 3:
          return _context56.a(2);
      }
    }, _callee53, null, [[0, 2]]);
  }));
  return _claimQuest.apply(this, arguments);
}
function onBoss(boss) {
  if (!boss) return;
  bossState = Object.assign({}, bossState || {}, boss);
  renderBossUi();
}
function setBossYou(you) {
  if (!you) return;
  bossState = Object.assign({}, bossState || {}, {
    youPayout: Number(you.payout) || 0,
    youShare: Number(you.share) || 0,
    youDamage: Number(you.damage) || 0
  });
  renderBossUi();
}
function refreshBossPayout() {
  return _refreshBossPayout.apply(this, arguments);
}
function _refreshBossPayout() {
  _refreshBossPayout = _asyncToGenerator(_regenerator().m(function _callee54() {
    var b, _t56;
    return _regenerator().w(function (_context57) {
      while (1) switch (_context57.p = _context57.n) {
        case 0:
          if (!(!inGame || !token)) {
            _context57.n = 1;
            break;
          }
          return _context57.a(2);
        case 1:
          _context57.p = 1;
          _context57.n = 2;
          return api('/boss');
        case 2:
          b = _context57.v;
          if (b) {
            _context57.n = 3;
            break;
          }
          return _context57.a(2);
        case 3:
          if (b.boss) onBoss(b.boss);
          setBossYou(b.you);
          _context57.n = 5;
          break;
        case 4:
          _context57.p = 4;
          _t56 = _context57.v;
        case 5:
          return _context57.a(2);
      }
    }, _callee54, null, [[1, 4]]);
  }));
  return _refreshBossPayout.apply(this, arguments);
}
function onBossDefeated(info) {
  if (bossState && info && bossState.id === info.id) {
    bossState.hp = 0;
    bossState.youPayout = 0;
    bossState.youShare = 0;
  }
  renderBossUi();
  toast('BOSS DEFEATED!', info.name + ' has fallen', '$' + fmt(info.pool) + ' pool', '#ff5c8a');
  burst(window.innerWidth / 2, window.innerHeight * 0.35, RARITIES[5]);
}
setInterval(refreshBossPayout, 6000);
var TUTORIAL = [{
  info: true,
  title: 'WELCOME TO VAULTORIA',
  text: 'You are a keeper in a shared world. Move around with W A S D or the ARROW KEYS.',
  delay: 4200,
  check: function check() {
    return keys.a || keys.d || keys.w || keys.s || keys.arrowup || keys.arrowdown || keys.arrowleft || keys.arrowright;
  }
}, {
  title: 'FIND YOUR VAULT',
  text: 'Each keeper has their own vault. Walk onto the glowing blue pad marked (you).',
  check: function check() {
    return nearMyVault();
  }
}, {
  title: 'OPEN YOUR VAULT',
  text: "Press E to open your vault menu. Other keepers\u2019 vaults stay locked.",
  check: function check() {
    return vaultOpen;
  }
}, {
  title: 'GENERATE ITEMS',
  text: 'Click GENERATE ITEM. Rarer items are worth far more money.',
  check: function check() {
    return (state.stats.ig || 0) >= 1;
  }
}, {
  title: 'SELL YOUR ITEMS',
  text: 'Open the INVENTORY tab and press SELL ALL to cash in.',
  check: function check() {
    return (state.stats.earned || 0) > 0 || salesCount > 0;
  }
}, {
  title: 'UPGRADE',
  text: 'Spend money in the UPGRADES tab to raise your generator level.',
  check: function check() {
    return state.level > 1;
  }
}, {
  title: 'THE BAZAAR',
  text: 'Use the BAZAAR button on your HUD to buy and sell items with other keepers.',
  check: function check() {
    return bazaarOpened;
  }
}, {
  info: true,
  title: "YOU\u2019RE READY, KEEPER",
  text: 'Hoard and keep leveling up. Rule the item empire.',
  delay: 4600
}];
function showTutStep() {
  if (lastTutRender === tutIdx) return;
  lastTutRender = tutIdx;
  var s = TUTORIAL[tutIdx];
  if (!s) return;
  $('tutorial').classList.remove('hidden');
  $('tutTitle').textContent = s.title;
  $('tutText').textContent = s.text;
  var d = $('tutDots');
  d.innerHTML = '';
  TUTORIAL.forEach(function (_, i) {
    var b = document.createElement('i');
    if (i === tutIdx) b.className = 'on';
    d.appendChild(b);
  });
  clearTimeout(tutTimer);
  clearTimeout(spotTimer);
  $('spotlight').classList.add('on');
  spotTimer = setTimeout(function () {
    return $('spotlight').classList.remove('on');
  }, 3200);
  if (s.info) tutTimer = setTimeout(function () {
    tutIdx++;
    lastTutRender = -1;
    refreshTutorial();
  }, s.delay || 4000);
}
function refreshTutorial() {
  if (tutorialDone || !inGame) return;
  var guard = 0;
  while (guard++ < TUTORIAL.length + 2) {
    var s = TUTORIAL[tutIdx];
    if (s && s.check && s.check()) {
      tutIdx++;
      clearTimeout(tutTimer);
      continue;
    }
    break;
  }
  if (tutIdx >= TUTORIAL.length) {
    tutorialDone = true;
    clearTimeout(tutTimer);
    clearTimeout(spotTimer);
    $('spotlight').classList.remove('on');
    $('tutorial').classList.add('hidden');
    state.tutorialDone = true;
    queueSave();
    return;
  }
  showTutStep();
}
function addChat(kind, name, text) {
  var log = $('chatLog');
  var el = document.createElement('div');
  el.className = 'chat-line' + (kind === 'sys' ? ' sys' : '');
  if (kind === 'sys') el.textContent = text;else el.innerHTML = '<b>' + esc(name) + '</b> ' + esc(text);
  log.appendChild(el);
  while (log.children.length > 30) log.removeChild(log.firstChild);
  log.scrollTop = log.scrollHeight;
}
$('chatForm').addEventListener('submit', function (e) {
  e.preventDefault();
  var inp = $('chatInput');
  var text = inp.value.trim();
  if (text) {
    wsSend({
      type: 'say',
      text: text
    });
  }
  inp.value = '';
});
function queueSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 1200);
}
function payload() {
  return {
    money: state.money,
    level: state.level,
    counts: state.counts,
    stats: state.stats,
    achievements: state.achievements,
    tutorialDone: tutorialDone,
    px: player.x,
    py: player.y
  };
}
function saveNow() {
  return _saveNow.apply(this, arguments);
}
function _saveNow() {
  _saveNow = _asyncToGenerator(_regenerator().m(function _callee55() {
    var body, _t57;
    return _regenerator().w(function (_context58) {
      while (1) switch (_context58.p = _context58.n) {
        case 0:
          if (!(!token || !state)) {
            _context58.n = 1;
            break;
          }
          return _context58.a(2);
        case 1:
          _context58.p = 1;
          body = JSON.stringify(payload());
          _context58.n = 2;
          return fetch('/api/save', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + token
            },
            body: body,
            keepalive: true
          });
        case 2:
          _context58.n = 4;
          break;
        case 3:
          _context58.p = 3;
          _t57 = _context58.v;
        case 4:
          return _context58.a(2);
      }
    }, _callee55, null, [[1, 3]]);
  }));
  return _saveNow.apply(this, arguments);
}
setInterval(saveNow, 8000);
window.addEventListener('beforeunload', function () {
  if (!token || !state) return;
  try {
    var blob = new Blob([JSON.stringify(payload())], {
      type: 'application/json'
    });
    navigator.sendBeacon && navigator.sendBeacon('/api/save?token=' + encodeURIComponent(token), blob);
  } catch (e) {}
});
$('leaveBtn').addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee11() {
  var _t12;
  return _regenerator().w(function (_context11) {
    while (1) switch (_context11.p = _context11.n) {
      case 0:
        _context11.n = 1;
        return saveNow();
      case 1:
        disconnectWS();
        closeAllModals();
        if (!(currentServer && token)) {
          _context11.n = 5;
          break;
        }
        _context11.p = 2;
        _context11.n = 3;
        return api('/servers/' + currentServer.id + '/leave', {
          method: 'POST'
        });
      case 3:
        _context11.n = 5;
        break;
      case 4:
        _context11.p = 4;
        _t12 = _context11.v;
      case 5:
        currentServer = null;
        mySlot = -1;
        _context11.n = 6;
        return loadMe();
      case 6:
        return _context11.a(2);
    }
  }, _callee11, null, [[2, 4]]);
})));
var bossBarEl = $('bossBar');
if (bossBarEl) {
  bossBarEl.addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee12() {
    return _regenerator().w(function (_context12) {
      while (1) switch (_context12.n) {
        case 0:
          if (inGame) {
            _context12.n = 1;
            break;
          }
          return _context12.a(2);
        case 1:
          _context12.n = 2;
          return openBossModal();
        case 2:
          return _context12.a(2);
      }
    }, _callee12);
  })));
  bossBarEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      bossBarEl.click();
    }
  });
}
function bindBossTabs() {
  document.querySelectorAll('[data-boss-tab]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('[data-boss-tab]').forEach(function (b) {
        return b.classList.remove('active');
      });
      document.querySelectorAll('#bossContent .panel').forEach(function (p) {
        return p.classList.remove('active');
      });
      btn.classList.add('active');
      var panel = $('bossPanel-' + btn.getAttribute('data-boss-tab'));
      if (panel) panel.classList.add('active');
    });
  });
}
function loadBossLive() {
  return _loadBossLive.apply(this, arguments);
}
function _loadBossLive() {
  _loadBossLive = _asyncToGenerator(_regenerator().m(function _callee56() {
    var panel, b, boss, html, i, c, _t58;
    return _regenerator().w(function (_context59) {
      while (1) switch (_context59.p = _context59.n) {
        case 0:
          panel = $('bossPanel-live');
          if (panel) {
            _context59.n = 1;
            break;
          }
          return _context59.a(2);
        case 1:
          panel.innerHTML = '<div class="empty-note">Loading boss information...</div>';
          _context59.p = 2;
          _context59.n = 3;
          return api('/boss');
        case 3:
          b = _context59.v;
          if (b) {
            _context59.n = 4;
            break;
          }
          panel.innerHTML = '<div class="empty-note">No boss information available.</div>';
          return _context59.a(2);
        case 4:
          boss = b.boss || null;
          if (boss) onBoss(boss);
          html = '<div class="boss-info">';
          html += '<div class="boss-header">';
          html += '<h2 style="color:#ff5c8a; font-weight:800; letter-spacing:3px; text-transform:uppercase; text-shadow:0 0 30px rgba(255,92,138,0.5); margin:0 0 12px;">' + esc(boss && boss.name || 'World Boss') + '</h2>';
          html += '<div class="boss-hp-display" style="font-size:14px; font-weight:700; color:#c3c8e6; margin-bottom:16px;">';
          html += 'HP: ' + fmt(boss && boss.hp || 0) + ' / ' + fmt(boss && boss.maxHp || boss && boss.max_hp || 0);
          html += '</div></div>';
          if (b.contributions && b.contributions.length) {
            html += '<h3 style="font-size:13px; letter-spacing:2px; text-transform:uppercase; color:#9aa2cc; margin:16px 0 12px;">Top Contributors</h3>';
            html += '<ul class="list" style="margin:0;">';
            for (i = 0; i < Math.min(10, b.contributions.length); i++) {
              c = b.contributions[i];
              html += '<li class="row">';
              html += '<span class="name">#' + (i + 1) + ' ' + esc(c.username || 'Unknown') + '</span>';
              html += '<span class="meta">' + fmt(c.damage) + ' dmg (' + (c.share * 100).toFixed(1) + '%)</span>';
              html += '</li>';
            }
            html += '</ul>';
          }
          if (b.you) {
            html += '<div style="margin-top:16px; padding:12px; background:rgba(124,92,255,0.1); border-radius:12px; border:1px solid rgba(124,92,255,0.3);">';
            html += '<span style="font-weight:700; color:#b98bff;">Your Damage:</span> ';
            html += '<span style="color:#fff;">' + fmt(b.you.damage) + ' (' + (b.you.share * 100).toFixed(1) + '%)</span>';
            html += '</div>';
            html += '<div style="margin-top:12px; padding:12px; background:rgba(123,220,120,0.1); border-radius:12px; border:1px solid rgba(123,220,120,0.3);">';
            html += '<span style="font-weight:700; color:#7bdc78;">Estimated Payout:</span> ';
            html += '<span style="color:#fff;">$' + fmt(b.you.payout || 0) + '</span>';
            html += '</div>';
          }
          html += '</div>';
          panel.innerHTML = html;
          _context59.n = 6;
          break;
        case 5:
          _context59.p = 5;
          _t58 = _context59.v;
          panel.innerHTML = '<div class="empty-note" style="color:#ff6b8a;">' + esc(_t58.message || 'Could not load boss info') + '</div>';
        case 6:
          return _context59.a(2);
      }
    }, _callee56, null, [[2, 5]]);
  }));
  return _loadBossLive.apply(this, arguments);
}
function loadBossHistory() {
  return _loadBossHistory.apply(this, arguments);
}
function _loadBossHistory() {
  _loadBossHistory = _asyncToGenerator(_regenerator().m(function _callee57() {
    var panel, h, rows, html, _t59;
    return _regenerator().w(function (_context60) {
      while (1) switch (_context60.p = _context60.n) {
        case 0:
          panel = $('bossPanel-history');
          if (panel) {
            _context60.n = 1;
            break;
          }
          return _context60.a(2);
        case 1:
          panel.innerHTML = '<div class="empty-note">Loading boss history...</div>';
          _context60.p = 2;
          _context60.n = 3;
          return api('/boss/history');
        case 3:
          h = _context60.v;
          rows = h && h.history ? h.history : [];
          if (rows.length) {
            _context60.n = 4;
            break;
          }
          panel.innerHTML = '<div class="empty-note">No defeated bosses yet.</div>';
          return _context60.a(2);
        case 4:
          html = '<div class="boss-info">';
          html += '<h3 style="font-size:13px; letter-spacing:2px; text-transform:uppercase; color:#9aa2cc; margin:4px 0 12px;">Last 20 Bosses</h3>';
          html += '<ul class="list" style="margin:0;">';
          rows.forEach(function (row) {
            html += '<li class="row">';
            html += '<span class="name">' + esc(row.name || 'World Boss') + '<span class="meta"> ' + esc(row.defeatedDate || '') + '</span></span>';
            html += '<span class="meta">DMG ' + fmt(row.damage) + ' &middot; POOL $' + fmt(row.poolValue) + ' &middot; PAYOUT $' + fmt(row.payout) + '</span>';
            html += '</li>';
          });
          html += '</ul></div>';
          panel.innerHTML = html;
          _context60.n = 6;
          break;
        case 5:
          _context60.p = 5;
          _t59 = _context60.v;
          panel.innerHTML = '<div class="empty-note" style="color:#ff6b8a;">' + esc(_t59.message || 'Could not load boss history') + '</div>';
        case 6:
          return _context60.a(2);
      }
    }, _callee57, null, [[2, 5]]);
  }));
  return _loadBossHistory.apply(this, arguments);
}
function openBossModal() {
  return _openBossModal.apply(this, arguments);
}
function _openBossModal() {
  _openBossModal = _asyncToGenerator(_regenerator().m(function _callee58() {
    var content;
    return _regenerator().w(function (_context61) {
      while (1) switch (_context61.n) {
        case 0:
          closeAllModals();
          content = $('bossContent');
          if (content) {
            _context61.n = 1;
            break;
          }
          return _context61.a(2);
        case 1:
          content.innerHTML = '<div class="tabs">' + '<button class="tab active" data-boss-tab="live" type="button">Live</button>' + '<button class="tab" data-boss-tab="history" type="button">History</button>' + '</div>' + '<div id="bossPanel-live" class="panel active"><div class="empty-note">Loading boss information...</div></div>' + '<div id="bossPanel-history" class="panel"><div class="empty-note">Loading boss history...</div></div>';
          $('bossModal').classList.remove('hidden');
          bindBossTabs();
          _context61.n = 2;
          return Promise.all([loadBossLive(), loadBossHistory()]);
        case 2:
          return _context61.a(2);
      }
    }, _callee58);
  }));
  return _openBossModal.apply(this, arguments);
}
$('adminBtn').addEventListener('click', openAdminModal);
function openAdminModal() {
  return _openAdminModal.apply(this, arguments);
}
function _openAdminModal() {
  _openAdminModal = _asyncToGenerator(_regenerator().m(function _callee59() {
    return _regenerator().w(function (_context62) {
      while (1) switch (_context62.n) {
        case 0:
          closeAllModals();
          $('adminModal').classList.remove('hidden');
          _context62.n = 1;
          return Promise.all([loadAdminStats(), loadAdminUsers()]);
        case 1:
          return _context62.a(2);
      }
    }, _callee59);
  }));
  return _openAdminModal.apply(this, arguments);
}
var adminUsersCache = [];
function loadAdminStats() {
  return _loadAdminStats.apply(this, arguments);
}
function _loadAdminStats() {
  _loadAdminStats = _asyncToGenerator(_regenerator().m(function _callee60() {
    var totalEl, onlineEl, _yield$api5, users, _t60;
    return _regenerator().w(function (_context63) {
      while (1) switch (_context63.p = _context63.n) {
        case 0:
          totalEl = $('adminTotalUsers');
          onlineEl = $('adminOnlineUsers');
          _context63.p = 1;
          _context63.n = 2;
          return api('/admin/users');
        case 2:
          _yield$api5 = _context63.v;
          users = _yield$api5.users;
          if (totalEl) totalEl.textContent = users.length;
          if (onlineEl) onlineEl.textContent = users.filter(function (u) {
            return u.online;
          }).length;
          _context63.n = 4;
          break;
        case 3:
          _context63.p = 3;
          _t60 = _context63.v;
          console.error('[admin stats]', _t60.message);
        case 4:
          return _context63.a(2);
      }
    }, _callee60, null, [[1, 3]]);
  }));
  return _loadAdminStats.apply(this, arguments);
}
function loadAdminUsers() {
  return _loadAdminUsers.apply(this, arguments);
}
function _loadAdminUsers() {
  _loadAdminUsers = _asyncToGenerator(_regenerator().m(function _callee61() {
    var list, _yield$api6, users, _t61;
    return _regenerator().w(function (_context64) {
      while (1) switch (_context64.p = _context64.n) {
        case 0:
          list = $('adminUsers');
          if (list) {
            _context64.n = 1;
            break;
          }
          return _context64.a(2);
        case 1:
          list.innerHTML = '<li class="empty">Loading...</li>';
          _context64.p = 2;
          _context64.n = 3;
          return api('/admin/users');
        case 3:
          _yield$api6 = _context64.v;
          users = _yield$api6.users;
          adminUsersCache = users;
          if (users.length) {
            _context64.n = 4;
            break;
          }
          list.innerHTML = '<li class="empty">No users found</li>';
          return _context64.a(2);
        case 4:
          renderAdminUsers(users);
          _context64.n = 6;
          break;
        case 5:
          _context64.p = 5;
          _t61 = _context64.v;
          list.innerHTML = '<li class="empty">' + esc(_t61.message) + '</li>';
        case 6:
          return _context64.a(2);
      }
    }, _callee61, null, [[2, 5]]);
  }));
  return _loadAdminUsers.apply(this, arguments);
}
function renderAdminUsers(users) {
  var list = $('adminUsers');
  if (!list) return;
  list.innerHTML = '';
  var _iterator11 = _createForOfIteratorHelper(users),
    _step11;
  try {
    var _loop9 = function _loop9() {
      var u = _step11.value;
      var banned = u.bannedUntil && u.bannedUntil > Date.now();
      var muted = u.mutedUntil && u.mutedUntil > Date.now();
      var status = (banned ? '<span class="mod-ban">BANNED</span> ' : '') + (muted ? '<span class="mod-mute">MUTED</span>' : '');
      var li = document.createElement('li');
      li.innerHTML = '<div class="admin-user-info"><span class="admin-user-name">' + esc(u.username) + (u.isAdmin ? ' <span style="color:#b98bff;">[ADMIN]</span>' : '') + ' ' + status + '</span><span class="admin-user-meta">Lv ' + u.level + " \xB7 $" + fmt(u.money) + (u.online ? " \xB7 <span style=\"color:#7bdc78;\">Online</span>" : " \xB7 Offline") + '</span></div>' + '<div class="admin-user-actions">' + '<button class="mini-btn" data-admin-kick="' + esc(u.username) + '">Kick</button> ' + '<button class="mini-btn' + (muted ? ' warn' : '') + '" data-admin-mute="' + esc(u.username) + '">' + (muted ? 'Unmute' : 'Mute') + '</button> ' + '<button class="mini-btn' + (banned ? ' warn' : '') + '" data-admin-ban="' + esc(u.username) + '">' + (banned ? 'Unban' : 'Ban') + '</button> ' + '<button class="mini-btn" data-admin-gm="' + esc(u.username) + '">Give $</button> ' + '<button class="mini-btn" data-admin-sm="' + esc(u.username) + '">Set $</button> ' + '<button class="mini-btn" data-admin-lv="' + esc(u.username) + '">Lv+1</button> ' + '<button class="mini-btn" data-admin-give="' + esc(u.username) + '">Give</button> ' + '<button class="mini-btn" data-admin-rem="' + esc(u.username) + '">Remove</button> ' + '<button class="mini-btn" data-admin-rmm="' + esc(u.username) + '">Rem Mut</button> ' + '<button class="mini-btn ghost" data-admin-clr="' + esc(u.username) + '">Clear</button> ' + '<button class="mini-btn ghost" data-admin-rst="' + esc(u.username) + '">Reset</button></div>';
      li.querySelector('[data-admin-kick]').addEventListener('click', function () {
        return adminKick(u.username);
      });
      li.querySelector('[data-admin-mute]').addEventListener('click', function () {
        return adminMute(u.username);
      });
      li.querySelector('[data-admin-ban]').addEventListener('click', function () {
        return adminBan(u.username);
      });
      li.querySelector('[data-admin-gm]').addEventListener('click', function () {
        return adminGiveMoneyPrompt(u.username);
      });
      li.querySelector('[data-admin-sm]').addEventListener('click', function () {
        return adminSetMoneyPrompt(u.username);
      });
      li.querySelector('[data-admin-lv]').addEventListener('click', function () {
        return adminSetLevel(u.username, u.level + 1);
      });
      li.querySelector('[data-admin-give]').addEventListener('click', function () {
        return adminGiveItemPrompt(u.username);
      });
      li.querySelector('[data-admin-rem]').addEventListener('click', function () {
        return adminRemoveItemPrompt(u.username);
      });
      li.querySelector('[data-admin-rmm]').addEventListener('click', function () {
        return adminRemoveMutationPrompt(u.username);
      });
      li.querySelector('[data-admin-clr]').addEventListener('click', function () {
        return adminClearItems(u.username);
      });
      li.querySelector('[data-admin-rst]').addEventListener('click', function () {
        return adminResetProgress(u.username);
      });
      list.appendChild(li);
    };
    for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
      _loop9();
    }
  } catch (err) {
    _iterator11.e(err);
  } finally {
    _iterator11.f();
  }
}
if ($('adminUserSearch')) $('adminUserSearch').addEventListener('input', function (e) {
  var query = e.target.value.toLowerCase().trim();
  if (!query) {
    renderAdminUsers(adminUsersCache);
    return;
  }
  renderAdminUsers(adminUsersCache.filter(function (u) {
    return u.username.toLowerCase().includes(query);
  }));
});
function adminDuration(selId) {
  var sel = $(selId);
  if (!sel) return {
    minutes: 10,
    permanent: false,
    label: 'for 10 minutes'
  };
  var minutes = parseInt(sel.value, 10) || 0;
  if (minutes === 0) return {
    minutes: 0,
    permanent: true,
    label: 'permanently'
  };
  return {
    minutes: minutes,
    permanent: false,
    label: 'for ' + (sel.options[sel.selectedIndex] ? sel.options[sel.selectedIndex].textContent.toLowerCase() : minutes + ' minutes')
  };
}
if ($('adminGiveMoneyBtn')) $('adminGiveMoneyBtn').addEventListener('click', _asyncToGenerator(_regenerator().m(function _callee13() {
  var username, amount, _t13;
  return _regenerator().w(function (_context13) {
    while (1) switch (_context13.p = _context13.n) {
      case 0:
        username = $('adminGiveMoneyUser').value.trim();
        amount = parseInt($('adminGiveMoneyAmount').value, 10);
        if (username) {
          _context13.n = 1;
          break;
        }
        return _context13.a(2, toast('OOPS', 'Username required', null, '#ff6b8a'));
      case 1:
        if (!(isNaN(amount) || amount === 0)) {
          _context13.n = 2;
          break;
        }
        return _context13.a(2, toast('OOPS', 'Invalid amount', null, '#ff6b8a'));
      case 2:
        _context13.p = 2;
        _context13.n = 3;
        return api('/admin/set-money', {
          method: 'POST',
          body: JSON.stringify({
            username: username,
            amount: amount
          })
        });
      case 3:
        toast('ADMIN', (amount > 0 ? 'Gave $' + fmt(amount) + ' to ' : 'Removed $' + fmt(-amount) + ' from ') + username, null, '#4fd1ff');
        $('adminGiveMoneyUser').value = '';
        $('adminGiveMoneyAmount').value = '';
        loadAdminUsers();
        _context13.n = 5;
        break;
      case 4:
        _context13.p = 4;
        _t13 = _context13.v;
        toast('OOPS', _t13.message, null, '#ff6b8a');
      case 5:
        return _context13.a(2);
    }
  }, _callee13, null, [[2, 4]]);
})));
function adminGiveAll(_x22) {
  return _adminGiveAll.apply(this, arguments);
}
function _adminGiveAll() {
  _adminGiveAll = _asyncToGenerator(_regenerator().m(function _callee62(scope) {
    var item, quantity, mutation, _r12, _t62;
    return _regenerator().w(function (_context65) {
      while (1) switch (_context65.p = _context65.n) {
        case 0:
          item = $('adminGiveAllItem').value.trim();
          quantity = parseInt($('adminGiveAllQty').value, 10) || 1;
          mutation = $('adminGiveAllMutation').value.trim() || null;
          if (item) {
            _context65.n = 1;
            break;
          }
          return _context65.a(2, toast('OOPS', 'Item name required', null, '#ff6b8a'));
        case 1:
          if (!(mutation && !MUT_BY_ID[mutation])) {
            _context65.n = 2;
            break;
          }
          return _context65.a(2, toast('OOPS', 'Invalid mutation', null, '#ff6b8a'));
        case 2:
          _context65.p = 2;
          _context65.n = 3;
          return api('/admin/give-all', {
            method: 'POST',
            body: JSON.stringify({
              item: item,
              quantity: quantity,
              mutation: mutation,
              scope: scope
            })
          });
        case 3:
          _r12 = _context65.v;
          toast('ADMIN', 'Gave ' + quantity + 'x ' + item + (mutation ? ' (' + mutation + ')' : '') + ' to ' + _r12.updated + ' ' + (scope === 'online' ? 'online player' : 'player') + (_r12.updated === 1 ? '' : 's'), null, '#4fd1ff');
          $('adminGiveAllItem').value = '';
          $('adminGiveAllQty').value = '1';
          $('adminGiveAllMutation').value = '';
          _context65.n = 5;
          break;
        case 4:
          _context65.p = 4;
          _t62 = _context65.v;
          toast('OOPS', _t62.message, null, '#ff6b8a');
        case 5:
          return _context65.a(2);
      }
    }, _callee62, null, [[2, 4]]);
  }));
  return _adminGiveAll.apply(this, arguments);
}
if ($('adminGiveAllBtn')) $('adminGiveAllBtn').addEventListener('click', function () {
  return adminGiveAll('all');
});
if ($('adminGiveAllOnlineBtn')) $('adminGiveAllOnlineBtn').addEventListener('click', function () {
  return adminGiveAll('online');
});
function adminSetMoney(_x23, _x24) {
  return _adminSetMoney.apply(this, arguments);
}
function _adminSetMoney() {
  _adminSetMoney = _asyncToGenerator(_regenerator().m(function _callee63(username, amt) {
    var _t63;
    return _regenerator().w(function (_context66) {
      while (1) switch (_context66.p = _context66.n) {
        case 0:
          _context66.p = 0;
          _context66.n = 1;
          return api('/admin/set-money', {
            method: 'POST',
            body: JSON.stringify({
              username: username,
              amount: amt
            })
          });
        case 1:
          toast('ADMIN', username + "\u2019s money updated", null, '#4fd1ff');
          loadAdminUsers();
          _context66.n = 3;
          break;
        case 2:
          _context66.p = 2;
          _t63 = _context66.v;
          toast('OOPS', _t63.message, null, '#ff6b8a');
        case 3:
          return _context66.a(2);
      }
    }, _callee63, null, [[0, 2]]);
  }));
  return _adminSetMoney.apply(this, arguments);
}
function adminGiveMoneyPrompt(_x25) {
  return _adminGiveMoneyPrompt.apply(this, arguments);
}
function _adminGiveMoneyPrompt() {
  _adminGiveMoneyPrompt = _asyncToGenerator(_regenerator().m(function _callee64(username) {
    var amount, amt;
    return _regenerator().w(function (_context67) {
      while (1) switch (_context67.n) {
        case 0:
          amount = prompt('Enter amount to give to ' + username + ' (negative to remove):', '1000');
          if (!(amount == null)) {
            _context67.n = 1;
            break;
          }
          return _context67.a(2);
        case 1:
          amt = parseInt(amount, 10);
          if (!(isNaN(amt) || amt === 0)) {
            _context67.n = 2;
            break;
          }
          return _context67.a(2, toast('OOPS', 'Invalid amount', null, '#ff6b8a'));
        case 2:
          _context67.n = 3;
          return adminSetMoney(username, amt);
        case 3:
          return _context67.a(2);
      }
    }, _callee64);
  }));
  return _adminGiveMoneyPrompt.apply(this, arguments);
}
function adminSetMoneyPrompt(_x26) {
  return _adminSetMoneyPrompt.apply(this, arguments);
}
function _adminSetMoneyPrompt() {
  _adminSetMoneyPrompt = _asyncToGenerator(_regenerator().m(function _callee65(username) {
    var amount, amt, _t64;
    return _regenerator().w(function (_context68) {
      while (1) switch (_context68.p = _context68.n) {
        case 0:
          amount = prompt('Set ' + username + "\u2019s money to:", '0');
          if (!(amount == null)) {
            _context68.n = 1;
            break;
          }
          return _context68.a(2);
        case 1:
          amt = parseInt(amount, 10);
          if (!(isNaN(amt) || amt < 0)) {
            _context68.n = 2;
            break;
          }
          return _context68.a(2, toast('OOPS', 'Invalid amount', null, '#ff6b8a'));
        case 2:
          _context68.p = 2;
          _context68.n = 3;
          return api('/admin/set-money', {
            method: 'POST',
            body: JSON.stringify({
              username: username,
              amount: amt
            })
          });
        case 3:
          toast('ADMIN', username + ' money set', null, '#4fd1ff');
          loadAdminUsers();
          _context68.n = 5;
          break;
        case 4:
          _context68.p = 4;
          _t64 = _context68.v;
          toast('OOPS', _t64.message, null, '#ff6b8a');
        case 5:
          return _context68.a(2);
      }
    }, _callee65, null, [[2, 4]]);
  }));
  return _adminSetMoneyPrompt.apply(this, arguments);
}
function allItemNames() {
  var allNames = [];
  var _iterator12 = _createForOfIteratorHelper(RARITIES),
    _step12;
  try {
    for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
      var r = _step12.value;
      (ITEMS_BY_RARITY[r.key] || []).forEach(function (it) {
        if (allNames.indexOf(it) === -1) allNames.push(it);
      });
    }
  } catch (err) {
    _iterator12.e(err);
  } finally {
    _iterator12.f();
  }
  allNames.sort();
  return allNames;
}
function adminGiveItemPrompt(_x27) {
  return _adminGiveItemPrompt.apply(this, arguments);
}
function _adminGiveItemPrompt() {
  _adminGiveItemPrompt = _asyncToGenerator(_regenerator().m(function _callee66(username) {
    var allNames, itemSel, item, mutId, qty, _t65;
    return _regenerator().w(function (_context69) {
      while (1) switch (_context69.p = _context69.n) {
        case 0:
          allNames = allItemNames();
          itemSel = prompt('Give item to ' + username + ' (enter exact item name):\n\n' + allNames.slice(0, 200).join(', ') + (allNames.length > 200 ? '\n...+' + (allNames.length - 200) + ' more' : ''), allNames[0] || '');
          if (!(itemSel == null)) {
            _context69.n = 1;
            break;
          }
          return _context69.a(2);
        case 1:
          item = itemSel.trim();
          if (item) {
            _context69.n = 2;
            break;
          }
          return _context69.a(2, toast('OOPS', 'Item name required', null, '#ff6b8a'));
        case 2:
          mutId = prompt('Mutation (blank for none; valid: gold, diamond, electric)', '');
          if (!(mutId == null)) {
            _context69.n = 3;
            break;
          }
          return _context69.a(2);
        case 3:
          qty = parseInt(prompt('Quantity', '1') || '1', 10);
          if (!(isNaN(qty) || qty <= 0 || qty > 1000000)) {
            _context69.n = 4;
            break;
          }
          return _context69.a(2, toast('OOPS', 'Invalid quantity', null, '#ff6b8a'));
        case 4:
          _context69.p = 4;
          _context69.n = 5;
          return api('/admin/give-item', {
            method: 'POST',
            body: JSON.stringify({
              username: username,
              item: item,
              mutation: mutId.trim().toLowerCase() || null,
              quantity: qty
            })
          });
        case 5:
          toast('ADMIN', 'Gave ' + qty + 'x ' + item + ' to ' + username, null, '#4fd1ff');
          _context69.n = 7;
          break;
        case 6:
          _context69.p = 6;
          _t65 = _context69.v;
          toast('OOPS', _t65.message, null, '#ff6b8a');
        case 7:
          return _context69.a(2);
      }
    }, _callee66, null, [[4, 6]]);
  }));
  return _adminGiveItemPrompt.apply(this, arguments);
}
function adminRemoveItemPrompt(_x28) {
  return _adminRemoveItemPrompt.apply(this, arguments);
}
function _adminRemoveItemPrompt() {
  _adminRemoveItemPrompt = _asyncToGenerator(_regenerator().m(function _callee67(username) {
    var allNames, itemSel, item, qty, _t66;
    return _regenerator().w(function (_context70) {
      while (1) switch (_context70.p = _context70.n) {
        case 0:
          allNames = allItemNames();
          itemSel = prompt('Remove item from ' + username + ' (enter exact item name):\n\n' + allNames.slice(0, 200).join(', ') + (allNames.length > 200 ? '\n...+' + (allNames.length - 200) + ' more' : ''), allNames[0] || '');
          if (!(itemSel == null)) {
            _context70.n = 1;
            break;
          }
          return _context70.a(2);
        case 1:
          item = itemSel.trim();
          if (item) {
            _context70.n = 2;
            break;
          }
          return _context70.a(2, toast('OOPS', 'Item name required', null, '#ff6b8a'));
        case 2:
          qty = parseInt(prompt('Quantity to remove', '1') || '1', 10);
          if (!(isNaN(qty) || qty <= 0 || qty > 1000000)) {
            _context70.n = 3;
            break;
          }
          return _context70.a(2, toast('OOPS', 'Invalid quantity', null, '#ff6b8a'));
        case 3:
          _context70.p = 3;
          _context70.n = 4;
          return api('/admin/remove-item', {
            method: 'POST',
            body: JSON.stringify({
              username: username,
              item: item,
              quantity: qty
            })
          });
        case 4:
          toast('ADMIN', 'Removed ' + qty + 'x ' + item + ' from ' + username, null, '#4fd1ff');
          _context70.n = 6;
          break;
        case 5:
          _context70.p = 5;
          _t66 = _context70.v;
          toast('OOPS', _t66.message, null, '#ff6b8a');
        case 6:
          return _context70.a(2);
      }
    }, _callee67, null, [[3, 5]]);
  }));
  return _adminRemoveItemPrompt.apply(this, arguments);
}
function adminRemoveMutationPrompt(_x29) {
  return _adminRemoveMutationPrompt.apply(this, arguments);
}
function _adminRemoveMutationPrompt() {
  _adminRemoveMutationPrompt = _asyncToGenerator(_regenerator().m(function _callee68(username) {
    var allNames, itemSel, item, mutId, qty, _t67;
    return _regenerator().w(function (_context71) {
      while (1) switch (_context71.p = _context71.n) {
        case 0:
          allNames = allItemNames();
          itemSel = prompt('Remove mutation from item for ' + username + ' (enter exact item name):\n\n' + allNames.slice(0, 200).join(', ') + (allNames.length > 200 ? '\n...+' + (allNames.length - 200) + ' more' : ''), allNames[0] || '');
          if (!(itemSel == null)) {
            _context71.n = 1;
            break;
          }
          return _context71.a(2);
        case 1:
          item = itemSel.trim();
          if (item) {
            _context71.n = 2;
            break;
          }
          return _context71.a(2, toast('OOPS', 'Item name required', null, '#ff6b8a'));
        case 2:
          mutId = prompt('Mutation to remove (valid: gold, diamond, electric)', '');
          if (!(mutId == null)) {
            _context71.n = 3;
            break;
          }
          return _context71.a(2);
        case 3:
          qty = parseInt(prompt('Quantity', '1') || '1', 10);
          if (!(isNaN(qty) || qty <= 0 || qty > 1000000)) {
            _context71.n = 4;
            break;
          }
          return _context71.a(2, toast('OOPS', 'Invalid quantity', null, '#ff6b8a'));
        case 4:
          _context71.p = 4;
          _context71.n = 5;
          return api('/admin/remove-mutation', {
            method: 'POST',
            body: JSON.stringify({
              username: username,
              item: item,
              mutation: mutId.trim().toLowerCase() || null,
              quantity: qty
            })
          });
        case 5:
          toast('ADMIN', 'Removed mutation from ' + qty + 'x ' + item + ' for ' + username, null, '#4fd1ff');
          _context71.n = 7;
          break;
        case 6:
          _context71.p = 6;
          _t67 = _context71.v;
          toast('OOPS', _t67.message, null, '#ff6b8a');
        case 7:
          return _context71.a(2);
      }
    }, _callee68, null, [[4, 6]]);
  }));
  return _adminRemoveMutationPrompt.apply(this, arguments);
}
function adminSetLevel(_x30, _x31) {
  return _adminSetLevel.apply(this, arguments);
}
function _adminSetLevel() {
  _adminSetLevel = _asyncToGenerator(_regenerator().m(function _callee69(username, level) {
    var _t68;
    return _regenerator().w(function (_context72) {
      while (1) switch (_context72.p = _context72.n) {
        case 0:
          _context72.p = 0;
          _context72.n = 1;
          return api('/admin/set-level', {
            method: 'POST',
            body: JSON.stringify({
              username: username,
              level: level
            })
          });
        case 1:
          toast('ADMIN', username + ' is now level ' + level, null, '#4fd1ff');
          loadAdminUsers();
          _context72.n = 3;
          break;
        case 2:
          _context72.p = 2;
          _t68 = _context72.v;
          toast('OOPS', _t68.message, null, '#ff6b8a');
        case 3:
          return _context72.a(2);
      }
    }, _callee69, null, [[0, 2]]);
  }));
  return _adminSetLevel.apply(this, arguments);
}
function adminClearItems(_x32) {
  return _adminClearItems.apply(this, arguments);
}
function _adminClearItems() {
  _adminClearItems = _asyncToGenerator(_regenerator().m(function _callee70(username) {
    var _t69;
    return _regenerator().w(function (_context73) {
      while (1) switch (_context73.p = _context73.n) {
        case 0:
          if (confirm('Clear all items for ' + username + '?')) {
            _context73.n = 1;
            break;
          }
          return _context73.a(2);
        case 1:
          _context73.p = 1;
          _context73.n = 2;
          return api('/admin/clear-items', {
            method: 'POST',
            body: JSON.stringify({
              username: username
            })
          });
        case 2:
          toast('ADMIN', username + "\u2019s items cleared", null, '#4fd1ff');
          loadAdminUsers();
          _context73.n = 4;
          break;
        case 3:
          _context73.p = 3;
          _t69 = _context73.v;
          toast('OOPS', _t69.message, null, '#ff6b8a');
        case 4:
          return _context73.a(2);
      }
    }, _callee70, null, [[1, 3]]);
  }));
  return _adminClearItems.apply(this, arguments);
}
function adminResetProgress(_x33) {
  return _adminResetProgress.apply(this, arguments);
}
function _adminResetProgress() {
  _adminResetProgress = _asyncToGenerator(_regenerator().m(function _callee71(username) {
    var _t70;
    return _regenerator().w(function (_context74) {
      while (1) switch (_context74.p = _context74.n) {
        case 0:
          if (confirm('Reset ALL progress for ' + username + '? This cannot be undone.')) {
            _context74.n = 1;
            break;
          }
          return _context74.a(2);
        case 1:
          _context74.p = 1;
          _context74.n = 2;
          return api('/admin/reset-progress', {
            method: 'POST',
            body: JSON.stringify({
              username: username
            })
          });
        case 2:
          toast('ADMIN', username + ' reset', null, '#4fd1ff');
          loadAdminUsers();
          _context74.n = 4;
          break;
        case 3:
          _context74.p = 3;
          _t70 = _context74.v;
          toast('OOPS', _t70.message, null, '#ff6b8a');
        case 4:
          return _context74.a(2);
      }
    }, _callee71, null, [[1, 3]]);
  }));
  return _adminResetProgress.apply(this, arguments);
}
function adminKick(_x34) {
  return _adminKick.apply(this, arguments);
}
function _adminKick() {
  _adminKick = _asyncToGenerator(_regenerator().m(function _callee72(username) {
    var _t71;
    return _regenerator().w(function (_context75) {
      while (1) switch (_context75.p = _context75.n) {
        case 0:
          if (confirm('Kick ' + username + ' out of their world?')) {
            _context75.n = 1;
            break;
          }
          return _context75.a(2);
        case 1:
          _context75.p = 1;
          _context75.n = 2;
          return api('/admin/kick', {
            method: 'POST',
            body: JSON.stringify({
              username: username
            })
          });
        case 2:
          toast('ADMIN', username + ' kicked', null, '#ffb648');
          loadAdminUsers();
          _context75.n = 4;
          break;
        case 3:
          _context75.p = 3;
          _t71 = _context75.v;
          toast('OOPS', _t71.message, null, '#ff6b8a');
        case 4:
          return _context75.a(2);
      }
    }, _callee72, null, [[1, 3]]);
  }));
  return _adminKick.apply(this, arguments);
}
function adminMute(_x35) {
  return _adminMute.apply(this, arguments);
}
function _adminMute() {
  _adminMute = _asyncToGenerator(_regenerator().m(function _callee73(username) {
    var d, _r13, _t72;
    return _regenerator().w(function (_context76) {
      while (1) switch (_context76.p = _context76.n) {
        case 0:
          d = adminDuration('adminMuteDur');
          _context76.p = 1;
          _context76.n = 2;
          return api('/admin/mute', {
            method: 'POST',
            body: JSON.stringify({
              username: username,
              minutes: d.minutes,
              permanent: d.permanent
            })
          });
        case 2:
          _r13 = _context76.v;
          toast('ADMIN', username + (_r13.muted ? ' muted ' + d.label : ' unmuted'), null, '#ffb648');
          loadAdminUsers();
          _context76.n = 4;
          break;
        case 3:
          _context76.p = 3;
          _t72 = _context76.v;
          toast('OOPS', _t72.message, null, '#ff6b8a');
        case 4:
          return _context76.a(2);
      }
    }, _callee73, null, [[1, 3]]);
  }));
  return _adminMute.apply(this, arguments);
}
function adminBan(_x36) {
  return _adminBan.apply(this, arguments);
}
function _adminBan() {
  _adminBan = _asyncToGenerator(_regenerator().m(function _callee74(username) {
    var d, _r14, _t73;
    return _regenerator().w(function (_context77) {
      while (1) switch (_context77.p = _context77.n) {
        case 0:
          d = adminDuration('adminBanDur');
          _context77.p = 1;
          _context77.n = 2;
          return api('/admin/ban', {
            method: 'POST',
            body: JSON.stringify({
              username: username,
              minutes: d.minutes,
              permanent: d.permanent
            })
          });
        case 2:
          _r14 = _context77.v;
          toast('ADMIN', username + (_r14.banned ? ' banned ' + d.label : ' unbanned'), null, _r14.banned ? '#ff5c8a' : '#7bdc78');
          loadAdminUsers();
          _context77.n = 4;
          break;
        case 3:
          _context77.p = 3;
          _t73 = _context77.v;
          toast('OOPS', _t73.message, null, '#ff6b8a');
        case 4:
          return _context77.a(2);
      }
    }, _callee74, null, [[1, 3]]);
  }));
  return _adminBan.apply(this, arguments);
}
function adminAnnounce() {
  return _adminAnnounce.apply(this, arguments);
}
function _adminAnnounce() {
  _adminAnnounce = _asyncToGenerator(_regenerator().m(function _callee75() {
    var inp, text, _t74;
    return _regenerator().w(function (_context78) {
      while (1) switch (_context78.p = _context78.n) {
        case 0:
          inp = $('adminAnnounceInp');
          text = inp.value.trim();
          if (text) {
            _context78.n = 1;
            break;
          }
          return _context78.a(2);
        case 1:
          _context78.p = 1;
          _context78.n = 2;
          return api('/admin/announce', {
            method: 'POST',
            body: JSON.stringify({
              text: text
            })
          });
        case 2:
          inp.value = '';
          toast('ADMIN', 'Announcement sent', null, '#4fd1ff');
          _context78.n = 4;
          break;
        case 3:
          _context78.p = 3;
          _t74 = _context78.v;
          toast('OOPS', _t74.message, null, '#ff6b8a');
        case 4:
          return _context78.a(2);
      }
    }, _callee75, null, [[1, 3]]);
  }));
  return _adminAnnounce.apply(this, arguments);
}
function onRestart() {
  toast('SERVER RESTART', "The admin restarted the game \u2014 reloading...", null, '#ffb648');
  setTimeout(function () {
    try {
      disconnectWS();
    } catch (e) {}
    location.reload();
  }, 600);
}
if ($('adminRestartBtn')) $('adminRestartBtn').addEventListener('click', function () {
  if (!confirm('Kick everyone and force their pages to reload? The browser reloads for you too.')) return;
  toast('ADMIN', "Restart issued \u2014 everyone reloads in a moment", null, '#ffb648');
  api('/admin/restart', {
    method: 'POST'
  }).catch(function (e) {
    return toast('OOPS', e.message, null, '#ff6b8a');
  });
});
if ($('adminAnnounceBtn')) $('adminAnnounceBtn').addEventListener('click', adminAnnounce);
if ($('adminAnnounceInp')) $('adminAnnounceInp').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    adminAnnounce();
  }
});
function transitionTo(text) {
  var t = $('transition');
  t.textContent = text;
  t.classList.add('on');
  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(function () {
    return t.classList.remove('on');
  }, 650);
}
buildSolids();
resize();
setAuthMode('login');
requestAnimationFrame(frame);
(function () {
  var _boot = _asyncToGenerator(_regenerator().m(function _callee14() {
    var _t14;
    return _regenerator().w(function (_context14) {
      while (1) switch (_context14.p = _context14.n) {
        case 0:
          if (token) {
            _context14.n = 1;
            break;
          }
          showScreen('auth');
          return _context14.a(2);
        case 1:
          _context14.p = 1;
          _context14.n = 2;
          return loadMe();
        case 2:
          _context14.n = 4;
          break;
        case 3:
          _context14.p = 3;
          _t14 = _context14.v;
          token = null;
          localStorage.removeItem('vaultoria_token');
          showScreen('auth');
        case 4:
          return _context14.a(2);
      }
    }, _callee14, null, [[1, 3]]);
  }));
  function boot() {
    return _boot.apply(this, arguments);
  }
  return boot;
})()();
