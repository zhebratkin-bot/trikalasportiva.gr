/* trikalasportiva.gr — Casino section scripts (no dependencies) */
(function () {
  'use strict';

  /* ---------- Navigation: burger drawer + dropdown (mega) menus ---------- */
  function initNav() {
    var header = document.querySelector('.site-header');
    var burger = document.querySelector('.burger');
    var nav = document.getElementById('main-nav');
    if (!header || !nav) return;
    var triggers = nav.querySelectorAll('.nav-trigger');
    var desktop = window.matchMedia('(min-width: 992px)');
    var canHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    var closeTimer = null;

    function setDrawer(open) {
      if (!burger) return;
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Κλείσιμο μενού' : 'Άνοιγμα μενού');
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      if (!open) closeAll();
    }
    function closeAll(except) {
      triggers.forEach(function (t) { if (t !== except) t.setAttribute('aria-expanded', 'false'); });
      header.classList.toggle('has-open', !!except && desktop.matches);
    }
    function open(t) {
      clearTimeout(closeTimer);
      if (t.getAttribute('aria-expanded') !== 'true') t._openedAt = Date.now();
      closeAll(t);
      t.setAttribute('aria-expanded', 'true');
    }
    function toggle(t) {
      if (t.getAttribute('aria-expanded') === 'true') { t.setAttribute('aria-expanded', 'false'); header.classList.remove('has-open'); }
      else open(t);
    }

    if (burger) burger.addEventListener('click', function () { setDrawer(burger.getAttribute('aria-expanded') !== 'true'); });

    triggers.forEach(function (t) {
      var item = t.parentElement;
      t.addEventListener('click', function () {
        // A click right after hover-open should not immediately close the panel
        if (t.getAttribute('aria-expanded') === 'true' && Date.now() - (t._openedAt || 0) < 500) return;
        toggle(t);
      });
      // Hover-intent on desktop mice only; touch and keyboard use click
      item.addEventListener('mouseenter', function () { if (desktop.matches && canHover.matches) open(t); });
      item.addEventListener('mouseleave', function () {
        if (!desktop.matches || !canHover.matches) return;
        closeTimer = setTimeout(function () { t.setAttribute('aria-expanded', 'false'); header.classList.remove('has-open'); }, 180);
      });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown' && desktop.matches) {
          e.preventDefault(); open(t);
          var first = item.querySelector('.mega a'); if (first) first.focus();
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var opened = nav.querySelector('.nav-trigger[aria-expanded="true"]');
      if (opened) { opened.setAttribute('aria-expanded', 'false'); header.classList.remove('has-open'); opened.focus(); }
      else if (nav.classList.contains('is-open')) { setDrawer(false); burger.focus(); }
    });
    document.addEventListener('click', function (e) {
      if (desktop.matches && !e.target.closest('.main-nav')) closeAll();
    });
    // Close desktop dropdown when focus leaves it
    nav.addEventListener('focusout', function (e) {
      if (desktop.matches && !nav.contains(e.relatedTarget)) closeAll();
    });
    nav.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a && a.getAttribute('href').indexOf('#') !== -1) setDrawer(false);
    });
    var syncMq = function () { setDrawer(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', syncMq);

    // Compact header after scrolling
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 24); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
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


  /* ---------- Glossary tooltips (first mention of each term in the article) ---------- */
  var GLOSSARY = [
    { re: /\bRTP\b/, title: 'RTP (Return to Player)', text: 'Το ποσοστό των πονταρισμάτων που επιστρέφει ένα παιχνίδι μακροπρόθεσμα. RTP 96% σημαίνει μέση απώλεια 4 € ανά 100 € πονταρίσματος.' },
    { re: /στοιχηματισμ[^\s.,:;!?)]*/i, title: 'Στοιχηματισμός', text: 'Πόσες φορές πρέπει να ποντάρετε ένα μπόνους πριν μπορέσετε να κάνετε ανάληψη. Για παράδειγμα, 35x σε μπόνους 100 € σημαίνει 3.500 € τζίρο.' },
    { re: /ΕΕΕΠ/, title: 'ΕΕΕΠ', text: 'Η Επιτροπή Εποπτείας και Ελέγχου Παιγνίων, η ελληνική αρχή που αδειοδοτεί και ελέγχει τα online καζίνο.' },
    { re: /\bKYC\b/, title: 'KYC (Know Your Customer)', text: 'Η ταυτοποίηση με έγγραφα που ζητά κάθε αδειοδοτημένο καζίνο πριν από την πρώτη ανάληψη.' },
    { re: /\bcashback\b/i, title: 'Cashback', text: 'Επιστροφή ενός ποσοστού των καθαρών απωλειών σας για μια περίοδο, ως μετρητά ή ως μπόνους.' },
    { re: /e-wallets?/i, title: 'E-wallet', text: 'Ηλεκτρονικό πορτοφόλι όπως Skrill ή Neteller. Συνήθως η ταχύτερη μέθοδος ανάληψης.' },
    { re: /συνεισφορά/i, title: 'Συνεισφορά παιχνιδιού', text: 'Το ποσοστό κάθε πονταρίσματος που μετράει στον στοιχηματισμό. Τα φρουτάκια μετράνε συνήθως 100%, τα επιτραπέζια 10%.' }
  ];

  function initGlossary() {
    var root = document.querySelector('[data-toc-content]');
    if (!root) return;
    var pop = document.createElement('div');
    pop.className = 'term-pop'; pop.id = 'term-pop'; pop.setAttribute('role', 'tooltip'); pop.hidden = true;
    document.body.appendChild(pop);
    var hideTimer = null;

    function textNodes() {
      var out = [];
      var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          return n.parentElement.closest('h2, h3, a, button, .author-box, .prose-meta, thead') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
        }
      });
      while (w.nextNode()) out.push(w.currentNode);
      return out;
    }
    GLOSSARY.forEach(function (term) {
      var nodes = textNodes();
      for (var i = 0; i < nodes.length; i++) {
        var m = term.re.exec(nodes[i].nodeValue);
        if (!m) continue;
        var node = nodes[i];
        var after = node.splitText(m.index);
        after.splitText(m[0].length);
        var btn = document.createElement('button');
        btn.type = 'button'; btn.className = 'term'; btn.textContent = m[0];
        btn.setAttribute('aria-describedby', 'term-pop');
        btn._term = term;
        after.parentNode.replaceChild(btn, after);
        break;
      }
    });

    function place(btn) {
      clearTimeout(hideTimer);
      pop.innerHTML = '';
      var t = document.createElement('strong'); t.textContent = btn._term.title;
      pop.appendChild(t); pop.append(btn._term.text);
      pop.hidden = false;
      var r = btn.getBoundingClientRect();
      var w = pop.offsetWidth;
      var left = Math.min(Math.max(8, r.left + r.width / 2 - w / 2), document.documentElement.clientWidth - w - 8);
      var top = r.bottom + 8;
      if (top + pop.offsetHeight > window.innerHeight - 8) top = r.top - pop.offsetHeight - 8;
      pop.style.left = (left + window.scrollX) + 'px';
      pop.style.top = (top + window.scrollY) + 'px';
    }
    function hide() { hideTimer = setTimeout(function () { pop.hidden = true; }, 120); }
    root.querySelectorAll('.term').forEach(function (b) {
      b.addEventListener('mouseenter', function () { place(b); });
      b.addEventListener('focus', function () { place(b); });
      b.addEventListener('click', function () { if (pop.hidden) place(b); else pop.hidden = true; });
      b.addEventListener('mouseleave', hide);
      b.addEventListener('blur', hide);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') pop.hidden = true; });
    window.addEventListener('scroll', function () { if (!pop.hidden && !document.activeElement.classList.contains('term')) pop.hidden = true; }, { passive: true });
  }


  /* ---------- Footer year ---------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNav();
    initToc();
    initYear();
    initScrollUi();
    initReadTime();
    initFilters();
    initReveals();
    initStickyCta();
    initGlossary();
  });
})();
