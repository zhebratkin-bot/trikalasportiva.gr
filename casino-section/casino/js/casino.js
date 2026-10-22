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

  /* ---------- Bonus calculator ---------- */
  function initCalc() {
    var root = document.querySelector('[data-calc]');
    if (!root) return;
    var bonusEl = root.querySelector('[data-calc-bonus]');
    var wagerEl = root.querySelector('[data-calc-wager]');
    var wagerOut = root.querySelector('[data-calc-wager-out]');
    var rtpEl = root.querySelector('[data-calc-rtp]');
    var tEl = root.querySelector('[data-calc-turnover]');
    var lEl = root.querySelector('[data-calc-loss]');
    var vEl = root.querySelector('[data-calc-value]');
    var vBox = root.querySelector('[data-calc-value-box]');
    var fmt = new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

    function calc() {
      var bonus = Math.max(0, parseFloat(bonusEl.value) || 0);
      var wager = parseInt(wagerEl.value, 10) || 0;
      var rtp = parseFloat(rtpEl.value);
      var turnover = bonus * wager;
      var loss = turnover * (1 - rtp);
      var value = bonus - loss;
      wagerOut.textContent = wager + 'x';
      wagerEl.style.setProperty('--fill', (wager / wagerEl.max * 100) + '%');
      tEl.textContent = fmt.format(turnover);
      lEl.textContent = fmt.format(loss);
      vEl.textContent = (value >= 0 ? '+' : '−') + fmt.format(Math.abs(value));
      vBox.classList.toggle('is-good', value > 0);
      vBox.classList.toggle('is-bad', value < 0);
    }
    [bonusEl, wagerEl, rtpEl].forEach(function (el) { el.addEventListener('input', calc); });
    calc();
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
    initCalc();
    initReveals();
    initStickyCta();
  });
})();
