/* iakimlabs — site scripts (no dependencies besides Bootstrap) */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ── Header shadow on scroll ───────────────────────────── */
  var header = $('.site-header');
  var onScroll = function () { if (header) header.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── Theme toggle ──────────────────────────────────────── */
  $$('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var root = document.documentElement;
      var next = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-bs-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  });

  /* ── Language (Google Translate) ───────────────────────── */
  var PAGE_LANG = 'en';

  function getLang() {
    var m = document.cookie.match(/(?:^|;\s*)googtrans=\/[^/]*\/([^;]+)/);
    return m ? decodeURIComponent(m[1]) : PAGE_LANG;
  }

  function setCookie(value, maxAge) {
    var host = location.hostname;
    var parts = ['googtrans=' + value, 'path=/', 'max-age=' + maxAge, 'SameSite=Lax'];
    document.cookie = parts.join('; ');
    if (host.indexOf('.') > 0 && !/^\d+\.\d+\.\d+\.\d+$/.test(host)) {
      // Google Translate also reads the cookie on the parent domain
      var base = host.replace(/^www\./, '');
      document.cookie = parts.concat('domain=.' + base).join('; ');
    }
  }

  function setLang(code) {
    if (code === PAGE_LANG) {
      setCookie('', 0);
    } else {
      setCookie('/' + PAGE_LANG + '/' + code, 60 * 60 * 24 * 365);
    }
    location.reload();
  }

  var current = getLang();
  $$('[data-lang]').forEach(function (item) {
    var code = item.getAttribute('data-lang');
    if (code === current) item.classList.add('active');
    item.addEventListener('click', function () { if (code !== getLang()) setLang(code); });
  });
  $$('[data-lang-current]').forEach(function (el) {
    el.textContent = current.split('-')[0].toUpperCase();
  });

  // Load Google Translate only when another language is selected
  if (current !== PAGE_LANG) {
    window.googleTranslateElementInit = function () {
      /* global google */
      new google.translate.TranslateElement({ pageLanguage: PAGE_LANG, autoDisplay: false }, 'google_translate_element');
      // Fallback: drive the hidden selector if the cookie alone didn't trigger translation
      var tries = 0;
      var timer = setInterval(function () {
        var combo = $('.goog-te-combo');
        if (combo || ++tries > 40) {
          clearInterval(timer);
          if (combo && combo.value !== current) {
            combo.value = current;
            combo.dispatchEvent(new Event('change'));
          }
        }
      }, 150);
    };
    var s = document.createElement('script');
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.body.appendChild(s);
    if (current === 'ar') document.documentElement.setAttribute('dir', 'rtl');
  }

  /* ── Catalog filters & search ──────────────────────────── */
  var catalog = $('[data-catalog]');
  if (catalog) {
    var cards = $$('[data-app-grid] [data-app-card]');
    var empty = $('[data-empty]');
    var input = $('[data-search]', catalog);
    var filter = 'all';

    var apply = function () {
      var q = (input.value || '').trim().toLowerCase();
      var shown = 0;
      cards.forEach(function (c) {
        var okFilter = filter === 'all' || c.dataset.type === filter || c.dataset.status === filter;
        var okSearch = !q || c.dataset.search.indexOf(q) !== -1;
        var show = okFilter && okSearch;
        c.hidden = !show;
        if (show) shown++;
      });
      if (empty) empty.classList.toggle('d-none', shown > 0);
    };

    $$('[data-filter]', catalog).forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('[data-filter]', catalog).forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        filter = btn.getAttribute('data-filter');
        apply();
      });
    });
    input.addEventListener('input', apply);
  }

  /* ── Screenshot carousel buttons ───────────────────────── */
  $$('[data-shots]').forEach(function (box) {
    var track = $('.shots__track', box);
    var step = function (dir) { track.scrollBy({ left: dir * track.clientWidth * 0.8, behavior: 'smooth' }); };
    var prev = $('[data-shots-prev]', box), next = $('[data-shots-next]', box);
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
  });

  /* ── Contact form → opens the visitor's email app ──────── */
  var form = $('[data-mail-form]');
  if (form) {
    var params = new URLSearchParams(location.search);
    var subj = params.get('subject');
    if (subj) {
      form.subject.value = subj;
      var topic = /tester/i.test(subj) ? 'Become a tester' : /testing/i.test(subj) ? 'Closed testing request' : null;
      if (topic) form.topic.value = topic;
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var subject = '[' + form.topic.value + '] ' + (form.subject.value || form.topic.value);
      var body = form.message.value + '\n\n— ' + form.name.value;
      location.href = 'mailto:' + form.getAttribute('data-mail-to') +
        '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }
})();
