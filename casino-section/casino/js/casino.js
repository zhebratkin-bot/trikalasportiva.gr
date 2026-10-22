/* trikalasportiva.gr — Casino section scripts (no dependencies) */
(function () {
  'use strict';

  /* ---------- Burger menu ---------- */
  function initBurger() {
    var btn = document.querySelector('.burger');
    var nav = document.getElementById('main-nav');
    if (!btn || !nav) return;

    function setOpen(open) {
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού');
      nav.classList.toggle('is-open', open);
    }

    btn.addEventListener('click', function () {
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
  }

  /* ---------- Slugify: Greek → Latin, kebab-case ---------- */
  var GREEK_MAP = {
    'ου': 'ou', 'ευ': 'ev', 'αυ': 'av', 'αι': 'ai', 'ει': 'ei', 'οι': 'oi', 'μπ': 'b', 'ντ': 'nt', 'γκ': 'gk',
    'α': 'a', 'β': 'v', 'γ': 'g', 'δ': 'd', 'ε': 'e', 'ζ': 'z', 'η': 'i', 'θ': 'th',
    'ι': 'i', 'κ': 'k', 'λ': 'l', 'μ': 'm', 'ν': 'n', 'ξ': 'x', 'ο': 'o', 'π': 'p',
    'ρ': 'r', 'σ': 's', 'ς': 's', 'τ': 't', 'υ': 'y', 'φ': 'f', 'χ': 'ch', 'ψ': 'ps', 'ω': 'o'
  };
  var GREEK_RE = new RegExp(
    Object.keys(GREEK_MAP).sort(function (a, b) { return b.length - a.length; }).join('|'),
    'g'
  );

  function slugify(text) {
    return text
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // strip accents (ά → α, é → e)
      .replace(GREEK_RE, function (m) { return GREEK_MAP[m]; })
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9\s-]/g, ' ')
      .trim()
      .replace(/[\s-]+/g, '-');
  }

  /* ---------- Automated Table of Contents ---------- */
  function initToc() {
    var content = document.querySelector('[data-toc-content]');
    var list = document.querySelector('[data-toc-list]');
    var toggle = document.querySelector('.toc__toggle');
    if (!content || !list) return;

    var headings = content.querySelectorAll('h2');
    if (!headings.length) {
      var toc = list.closest('.toc');
      if (toc) toc.hidden = true;
      return;
    }

    var used = {};
    var frag = document.createDocumentFragment();

    headings.forEach(function (h) {
      var id = h.id || slugify(h.textContent) || 'section';
      if (used[id]) { used[id] += 1; id = id + '-' + used[id]; } else { used[id] = 1; }
      h.id = id;

      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + id;
      a.textContent = h.textContent.trim();
      li.appendChild(a);
      frag.appendChild(li);
    });
    list.appendChild(frag);

    // Collapsible on mobile, expanded on desktop
    if (toggle) {
      var mq = window.matchMedia('(min-width: 992px)');
      var sync = function () {
        var open = mq.matches;
        toggle.setAttribute('aria-expanded', String(open));
        list.hidden = !open;
      };
      sync();
      if (mq.addEventListener) mq.addEventListener('change', sync);
      toggle.addEventListener('click', function () {
        var open = toggle.getAttribute('aria-expanded') !== 'true';
        toggle.setAttribute('aria-expanded', String(open));
        list.hidden = !open;
      });
    }

    // Highlight the section currently in view
    if ('IntersectionObserver' in window) {
      var links = list.querySelectorAll('a');
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (l) {
            l.classList.toggle('is-active', l.getAttribute('href') === '#' + entry.target.id);
          });
        });
      }, { rootMargin: '-80px 0px -70% 0px' });
      headings.forEach(function (h) { observer.observe(h); });
    }
  }


  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Reading progress + back-to-top ---------- */
  function initScrollUi() {
    var bar = document.querySelector('.read-progress__bar');
    var toTop = document.querySelector('.to-top');
    var ticking = false;

    function update() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (bar) bar.style.transform = 'scaleX(' + p + ')';
      if (toTop) toTop.hidden = window.scrollY < 700;
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();

    if (toTop) toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Reading time ---------- */
  function initReadTime() {
    var el = document.querySelector('[data-read-time]');
    var content = document.querySelector('[data-toc-content]');
    if (!el || !content) return;
    var words = content.textContent.trim().split(/\s+/).length;
    el.textContent = Math.max(2, Math.round(words / 200));
  }

  /* ---------- Casino filters ---------- */
  function initFilters() {
    var chips = document.querySelectorAll('.filter-bar .chip');
    var cards = document.querySelectorAll('.casino-card[data-tags]');
    var empty = document.querySelector('.filter-empty');
    if (!chips.length) return;

    function apply(filter) {
      var shown = 0;
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.dataset.filter === filter)); });
      cards.forEach(function (card) {
        var match = filter === 'all' || card.dataset.tags.split(' ').indexOf(filter) !== -1;
        card.classList.toggle('is-hidden', !match);
        if (match) {
          shown++;
          card.classList.remove('is-entering'); void card.offsetWidth; card.classList.add('is-entering');
        }
      });
      if (empty) empty.hidden = shown > 0;
    }
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (btn) apply(btn.dataset.filter);
    });
  }

  /* ---------- Universal bonus calculator ----------
     Model (all values are long-run averages):
       nominal   N  = value the offer gives you before conditions
       turnover  T  = wagering multiplier × wagering base
       real      R  = T / contribution        (what you actually have to stake)
       loss      L  = R × (1 − RTP)           (house edge on that stake)
       value     EV = N − L, then limited by: what you can lose (deposit), 0 for
                     risk-free offers, and the max-cashout cap.
  */
  var GAMES = {
    slots: { contrib: 100, rtp: 96, speed: 600, name: 'φρουτάκια' },
    table: { contrib: 10, rtp: 99, speed: 120, name: 'επιτραπέζια' },
    live: { contrib: 10, rtp: 98.5, speed: 60, name: 'live καζίνο' },
    poker: { contrib: 20, rtp: 98, speed: 400, name: 'βίντεο πόκερ' }
  };

  // Mirrors the casino list. Update together with the cards.
  var PRESETS = {
    'olympia-spins': { type: 'deposit', deposit: 100, match: 100, bonusCap: 500, wager: 35, base: 'b', maxBet: 5, maxWin: 0, days: 30 },
    'meteora-casino': { type: 'deposit', deposit: 100, match: 150, bonusCap: 300, wager: 40, base: 'b', maxBet: 5, maxWin: 0, days: 30 },
    'aegean-royal': { type: 'spins', spins: 50, spinValue: 0.2, wager: 0, maxBet: 0, maxWin: 0, days: 7 },
    'pindos-play': { type: 'cashback', losses: 300, cbRate: 10, cbCap: 200, wager: 0, days: 7 },
    'lethaios-bet': { type: 'deposit', deposit: 100, match: 100, bonusCap: 200, wager: 30, base: 'b', maxBet: 5, maxWin: 0, days: 30 }
  };

  var eur = new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  var eur2 = new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var num = new Intl.NumberFormat('el-GR', { maximumFractionDigits: 0 });
  function money(v) { v = Math.round(v * 100) / 100; return Math.abs(v) < 100 && Math.round(v) !== v ? eur2.format(v) : eur.format(v); }
  function signed(v) { return (v > 0.004 ? '+' : v < -0.004 ? '−' : '') + money(Math.abs(v)); }
  function duration(h) {
    if (h < 1) return Math.max(1, Math.round(h * 60)) + ' λεπτά';
    if (h < 48) return (Math.round(h * 10) / 10).toString().replace('.', ',') + ' ώρες';
    return num.format(Math.round(h / 24 * 10) / 10) + ' ημέρες συνεχούς παιχνιδιού';
  }

  function compute(type, v) {
    var c = Math.max(0, Math.min(v.contrib, 100)) / 100;
    var rtp = Math.max(0, Math.min(v.rtp, 100)) / 100;
    var edge = 1 - rtp;
    var r = { type: type, warnings: [] };

    if (type === 'deposit') {
      var raw = v.deposit * v.match / 100;
      r.nominal = v.bonusCap > 0 ? Math.min(raw, v.bonusCap) : raw;
      if (v.bonusCap > 0 && raw > v.bonusCap) r.warnings.push('Η κατάθεση ξεπερνά το μέγιστο μπόνους: τα πρώτα ' + money(v.bonusCap / (v.match / 100)) + ' αρκούν για ολόκληρο το μπόνους.');
      r.base = v.base === 'db' ? v.deposit + r.nominal : r.nominal;
      r.bankroll = v.deposit + r.nominal;
      r.floor = -v.deposit;            // worst average case: you lose what you deposited
      r.nominalLabel = 'Μπόνους που παίρνετε';
    } else if (type === 'nodep') {
      r.nominal = v.bonus; r.base = v.bonus; r.bankroll = v.bonus; r.floor = 0;
      r.nominalLabel = 'Δωρεάν υπόλοιπο';
    } else if (type === 'spins') {
      var spinRtp = (GAMES.slots.rtp) / 100;  // spins are always played on a slot
      r.spinStake = v.spins * v.spinValue;
      r.nominal = r.spinStake * spinRtp;      // average winnings from the spins
      r.base = r.nominal; r.bankroll = r.nominal; r.floor = 0;
      r.nominalLabel = 'Μέσα κέρδη από ' + num.format(v.spins) + ' περιστροφές';
      if (v.maxBet > 0 && v.spinValue > v.maxBet) r.warnings.push('Η αξία περιστροφής ξεπερνά το μέγιστο πόνταρισμα. Ελέγξτε τους όρους.');
    } else { // cashback
      var cbRaw = v.losses * v.cbRate / 100;
      r.nominal = v.cbCap > 0 ? Math.min(cbRaw, v.cbCap) : cbRaw;
      if (v.cbCap > 0 && cbRaw > v.cbCap) r.warnings.push('Το cashback φτάνει το ανώτατο όριο. Πάνω από ' + money(v.cbCap / (v.cbRate / 100)) + ' απώλειες δεν παίρνετε τίποτα επιπλέον.');
      r.base = r.nominal; r.bankroll = r.nominal; r.floor = 0;
      r.nominalLabel = 'Cashback που επιστρέφεται';
    }

    r.turnover = v.wager * r.base;
    if (r.turnover > 0 && c === 0) {
      r.blocked = true;
      r.real = Infinity; r.loss = r.bankroll; r.ev = r.floor; r.ratio = Infinity;
      r.warnings.unshift('Αυτό το παιχνίδι δεν μετράει στον στοιχηματισμό (συνεισφορά 0%). Το μπόνους δεν μπορεί να ολοκληρωθεί.');
    } else {
      r.real = c > 0 ? r.turnover / c : 0;
      r.loss = r.real * edge;
      r.ratio = r.bankroll > 0 ? r.loss / r.bankroll : 0;
      var ev = r.nominal - r.loss;
      if (ev < r.floor) ev = r.floor;
      if (v.maxWin > 0 && type !== 'cashback' && ev > v.maxWin) {
        ev = v.maxWin;
        r.warnings.push('Το όριο ανάληψης ' + money(v.maxWin) + ' περιορίζει την αξία της προσφοράς.');
      }
      r.ev = ev;
    }

    var bet = Math.max(0.1, v.bet);
    r.bets = isFinite(r.real) ? Math.ceil(r.real / bet) : Infinity;
    r.hours = isFinite(r.real) ? r.bets / GAMES[v.game].speed : Infinity;
    r.perDay = v.days > 0 && isFinite(r.real) ? r.real / v.days : null;

    if (type !== 'cashback' && v.maxBet > 0 && bet > v.maxBet && r.turnover > 0) {
      r.warnings.push('Το μέσο πόνταρισμά σας (' + money(bet) + ') ξεπερνά το επιτρεπτό ' + money(v.maxBet) + '. Το καζίνο μπορεί να ακυρώσει μπόνους και κέρδη.');
    }
    if (r.ratio >= 1 && isFinite(r.ratio)) r.warnings.push('Η μέση απώλεια ξεπερνά το διαθέσιμο υπόλοιπο: οι περισσότεροι παίκτες θα το χάσουν πριν ολοκληρώσουν τον τζίρο.');
    if (r.perDay && r.hours / Math.max(v.days, 1) > 4) r.warnings.push('Για να προλάβετε την προθεσμία χρειάζονται πάνω από 4 ώρες παιχνιδιού την ημέρα.');
    if (c < 1 && c > 0 && r.turnover > 0) r.warnings.push('Με συνεισφορά ' + Math.round(c * 100) + '% πρέπει να ποντάρετε ' + Math.round(1 / c) + ' φορές περισσότερα για τον ίδιο τζίρο.');
    if (type === 'cashback') r.net = Math.max(0, v.losses - r.ev);

    // Difficulty
    if (r.turnover === 0) { r.diff = 'Χωρίς απαιτήσεις'; r.level = 0; }
    else if (!isFinite(r.ratio) || r.ratio >= 1) { r.diff = 'Πολύ δύσκολο'; r.level = 4; }
    else if (r.ratio >= 0.7) { r.diff = 'Δύσκολο'; r.level = 3; }
    else if (r.ratio >= 0.3) { r.diff = 'Μέτριο'; r.level = 2; }
    else { r.diff = 'Εύκολο'; r.level = 1; }

    // Verdict
    var rel = r.nominal > 0 ? r.ev / r.nominal : 0;
    if (r.ev <= -0.5) { r.verdict = 'Αρνητική αξία'; r.tone = 'bad'; }
    else if (r.ev < 0.5) { r.verdict = 'Σχεδόν μηδενική αξία'; r.tone = 'mid'; }
    else if (rel >= 0.6) { r.verdict = 'Πολύ καλή αξία'; r.tone = 'good'; }
    else { r.verdict = 'Θετική αλλά περιορισμένη αξία'; r.tone = 'ok'; }

    // Plain-language explanation
    var g = GAMES[v.game].name;
    if (type === 'cashback' && r.turnover === 0) {
      r.explain = 'Αν χάσετε ' + money(v.losses) + ', παίρνετε πίσω ' + money(r.nominal) + ' ως μετρητά. Το cashback μειώνει την απώλεια, δεν τη μετατρέπει σε κέρδος.';
    } else if (r.turnover === 0) {
      r.explain = 'Χωρίς στοιχηματισμό ό,τι κερδίσετε είναι μετρητά. Η μέση αξία είναι ' + money(Math.max(r.ev, 0)) + '.';
    } else if (r.blocked) {
      r.explain = 'Επιλέξτε παιχνίδι που μετράει στον στοιχηματισμό για να δείτε τον υπολογισμό.';
    } else {
      r.explain = 'Για ' + money(r.nominal) + ' πρέπει να ποντάρετε ' + money(r.real) + ' σε ' + g +
        '. Με RTP ' + String(v.rtp).replace('.', ',') + '% ο μέσος παίκτης χάνει ' + money(r.loss) +
        ' στη διαδρομή, άρα η αναμενόμενη αξία είναι ' + signed(r.ev) + '.';
    }
    return r;
  }

  function initBonusCalc() {
    var root = document.querySelector('[data-bcalc]');
    if (!root) return;
    var form = root.querySelector('form');
    var tabs = root.querySelectorAll('.bc-tab');
    var panel = root.querySelector('[role="tabpanel"]');
    var out = {};
    root.querySelectorAll('[data-r]').forEach(function (el) { out[el.dataset.r] = el; });
    var wagerOut = root.querySelector('[data-out="wager"]');
    var range = form.elements.wager;
    var compare = [];
    var type = 'deposit';
    var last = null;

    function val(name) {
      var el = form.elements[name];
      var n = parseFloat(String(el.value).replace(',', '.'));
      return isFinite(n) && n >= 0 ? n : 0;
    }
    function read() {
      return {
        deposit: val('deposit'), match: val('match'), bonusCap: val('bonusCap'), bonus: val('bonus'),
        spins: val('spins'), spinValue: val('spinValue'), losses: val('losses'), cbRate: val('cbRate'), cbCap: val('cbCap'),
        wager: val('wager'), base: form.querySelector('input[name="base"]:checked').value, game: form.elements.game.value,
        contrib: val('contrib'), rtp: val('rtp'), bet: val('bet'), maxBet: val('maxBet'), maxWin: val('maxWin'), days: val('days')
      };
    }
    function setType(t) {
      type = t;
      tabs.forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.type === t)); b.tabIndex = b.dataset.type === t ? 0 : -1; });
      panel.setAttribute('aria-labelledby', 'bc-tab-' + t);
      root.querySelectorAll('[data-show]').forEach(function (el) {
        var show = el.dataset.show.split(' ');
        el.hidden = show.indexOf('all') === -1 && show.indexOf(t) === -1;
      });
    }
    function render() {
      var v = read();
      wagerOut.textContent = v.wager + 'x';
      range.style.setProperty('--fill', (v.wager / range.max * 100) + '%');
      var r = compute(type, v);
      last = r;

      out.verdict.textContent = r.verdict;
      out.ev.textContent = signed(r.ev);
      root.querySelector('[data-verdict]').dataset.tone = r.tone;
      out.difficulty.textContent = r.diff;
      out.meter.style.width = [4, 25, 55, 80, 100][r.level] + '%';
      out.meter.dataset.level = r.level;
      out.nominalLabel.textContent = r.nominalLabel;
      out.nominal.textContent = money(r.nominal);
      out.turnover.textContent = r.turnover ? money(r.turnover) : 'Δεν απαιτείται';
      out.real.textContent = !isFinite(r.real) ? '∞' : r.real ? money(r.real) : '—';
      out.loss.textContent = !isFinite(r.real) ? '—' : r.loss ? '−' + money(r.loss) : '0 €';
      out.bets.textContent = !isFinite(r.bets) ? '∞' : r.bets ? '≈ ' + num.format(r.bets) + ' × ' + money(Math.max(0.1, v.bet)) : '—';
      out.time.textContent = !isFinite(r.hours) ? '—' : r.hours ? '≈ ' + duration(r.hours) : '—';
      root.querySelector('[data-row="perday"]').hidden = !(r.perDay && r.turnover);
      if (r.perDay) out.perday.textContent = money(r.perDay) + ' (' + duration(r.hours / v.days) + ' / ημέρα)';
      root.querySelector('[data-row="net"]').hidden = type !== 'cashback';
      if (type === 'cashback') out.net.textContent = '−' + money(r.net) + ' αντί για −' + money(v.losses);
      out.explain.textContent = r.explain;
      out.warnings.innerHTML = '';
      r.warnings.forEach(function (w) { var li = document.createElement('li'); li.textContent = w; out.warnings.appendChild(li); });
    }
    function applyGame(key) {
      var g = GAMES[key];
      form.elements.contrib.value = g.contrib;
      form.elements.rtp.value = g.rtp;
    }
    function applyPreset(slug) {
      var p = PRESETS[slug];
      if (!p) return;
      Object.keys(p).forEach(function (k) {
        if (k === 'type') return;
        if (k === 'base') { form.querySelector('input[name="base"][value="' + p.base + '"]').checked = true; return; }
        if (form.elements[k]) form.elements[k].value = p[k];
      });
      form.elements.game.value = 'slots'; applyGame('slots');
      setType(p.type);
    }

    tabs.forEach(function (b, i) {
      b.addEventListener('click', function () { form.elements.preset.value = ''; setType(b.dataset.type); render(); });
      b.addEventListener('keydown', function (e) {
        var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
        if (!d) return;
        var next = tabs[(i + d + tabs.length) % tabs.length];
        next.focus(); next.click();
      });
    });
    form.addEventListener('input', function (e) {
      if (e.target.name === 'preset') { applyPreset(e.target.value); }
      else if (e.target.name === 'game') { applyGame(e.target.value); }
      else if (e.target.name !== 'bet' && e.target.name !== 'game') { /* manual edits keep preset label honest */ }
      render();
    });

    // Comparison table
    var cmpWrap = root.querySelector('[data-compare]');
    var cmpBody = root.querySelector('[data-compare-body]');
    var TYPE_NAMES = { deposit: 'Κατάθεσης', nodep: 'Χωρίς κατάθεση', spins: 'Περιστροφές', cashback: 'Cashback' };
    function drawCompare() {
      cmpWrap.hidden = compare.length === 0;
      cmpBody.innerHTML = '';
      var best = compare.reduce(function (m, x) { return Math.max(m, x.ev); }, -Infinity);
      compare.forEach(function (x, i) {
        var tr = document.createElement('tr');
        if (compare.length > 1 && x.ev === best) tr.className = 'is-best';
        tr.innerHTML = '<td><strong></strong><small></small></td><td></td><td></td><td></td><td class="ev"></td><td><button type="button" class="bc-x" aria-label="Αφαίρεση">×</button></td>';
        tr.querySelector('strong').textContent = x.label;
        tr.querySelector('small').textContent = TYPE_NAMES[x.type];
        tr.children[1].textContent = money(x.nominal);
        tr.children[2].textContent = isFinite(x.real) ? money(x.real) : '∞';
        tr.children[3].textContent = x.diff;
        tr.children[4].textContent = signed(x.ev);
        tr.children[4].dataset.tone = x.tone;
        tr.querySelector('button').addEventListener('click', function () { compare.splice(i, 1); drawCompare(); });
        cmpBody.appendChild(tr);
      });
    }
    root.querySelector('[data-add]').addEventListener('click', function () {
      if (!last) return;
      var sel = form.elements.preset;
      var label = sel.value ? sel.options[sel.selectedIndex].text.split(':')[0] : 'Προσφορά ' + (compare.length + 1);
      compare.push({ label: label, type: last.type, nominal: last.nominal, real: last.real, diff: last.diff, ev: last.ev, tone: last.tone });
      if (compare.length > 5) compare.shift();
      drawCompare();
      cmpWrap.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'nearest' });
    });
    root.querySelector('[data-clear]').addEventListener('click', function () { compare = []; drawCompare(); });

    setType('deposit');
    if (root.dataset.preset) { form.elements.preset.value = root.dataset.preset; applyPreset(root.dataset.preset); }
    render();
  }

  /* ---------- One-time reveals: verdict ring/bars + hero counters ---------- */
  function initReveals() {
    var verdict = document.querySelector('.verdict');
    var counters = document.querySelectorAll('[data-count]');

    function countUp(el) {
      var target = parseInt(el.dataset.count, 10);
      if (reduceMotion) { el.textContent = target; return; }
      var start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / 1200, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      if (verdict) verdict.classList.add('is-visible');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        if (entry.target.dataset.count) countUp(entry.target);
        else entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    if (verdict) io.observe(verdict);
    counters.forEach(function (c) { c.textContent = '0'; io.observe(c); });
  }

  /* ---------- Sticky CTA (review page) ---------- */
  function initStickyCta() {
    var cta = document.querySelector('[data-sticky-cta]');
    var hero = document.querySelector('[data-review-hero]');
    var footer = document.querySelector('.site-footer');
    if (!cta || !hero || !('IntersectionObserver' in window)) return;
    document.body.classList.add('has-sticky-cta');
    var heroVisible = true, footerVisible = false;
    var link = cta.querySelector('a');

    function sync() {
      var show = !heroVisible && !footerVisible;
      cta.classList.toggle('is-visible', show);
      cta.setAttribute('aria-hidden', String(!show));
      if (link) link.tabIndex = show ? 0 : -1;
    }
    new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; sync(); }).observe(hero);
    if (footer) new IntersectionObserver(function (e) { footerVisible = e[0].isIntersecting; sync(); }).observe(footer);
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initBurger();
    initToc();
    initYear();
    initScrollUi();
    initReadTime();
    initFilters();
    initBonusCalc();
    initReveals();
    initStickyCta();
  });
})();
