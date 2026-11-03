/* Language switch for privacy.html and support.html: ?lang=, then the game's saved language, then the browser language. */
(function () {
  var LANGS = ['de', 'en', 'es'];
  var BACK = { de: 'Zum Spiel', en: 'Back to the game', es: 'Volver al juego' };
  var sections = document.querySelectorAll('section[data-lang]');
  if (!sections.length) return;
  document.documentElement.className += ' js';

  function pick() {
    var lang = null;
    try { lang = new URLSearchParams(location.search).get('lang'); } catch (e) {}
    if (LANGS.indexOf(lang) < 0) {
      try { lang = (JSON.parse(localStorage.getItem('night-shift-academy-v2') || '{}') || {}).lang; } catch (e) { lang = null; }
    }
    if (LANGS.indexOf(lang) < 0) lang = String(navigator.language || 'en').slice(0, 2).toLowerCase();
    return LANGS.indexOf(lang) < 0 ? 'en' : lang;
  }

  function show(lang) {
    Array.prototype.forEach.call(sections, function (s) { s.classList.toggle('on', s.getAttribute('data-lang') === lang); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-set]'), function (b) {
      var on = b.getAttribute('data-set') === lang;
      b.classList.toggle('on', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    var back = document.querySelector('[data-t=back]');
    if (back) back.textContent = BACK[lang];
    document.documentElement.lang = lang;
    var h1 = document.querySelector('section.on h1');
    if (h1) document.title = h1.textContent + ' – Residency Game';
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-set]'), function (b) {
    b.addEventListener('click', function () { show(b.getAttribute('data-set')); });
  });
  // Inside the game, "back" returns to the page the player came from. The public copy on GitHub Pages has no game.
  var link = document.querySelector('[data-back]');
  if (link && /\.github\.io$/i.test(location.hostname)) link.hidden = true;
  if (link) link.addEventListener('click', function (e) {
    if (history.length > 1 && document.referrer && document.referrer.indexOf(location.host) >= 0) { e.preventDefault(); history.back(); }
  });
  // A link to a section (e.g. #impressum-de) picks that section's language and scrolls to it once the others are hidden.
  var target = location.hash ? document.getElementById(location.hash.slice(1)) : null;
  var section = target && target.closest ? target.closest('section[data-lang]') : null;
  show(section ? section.getAttribute('data-lang') : pick());
  if (target) target.scrollIntoView();
})();
