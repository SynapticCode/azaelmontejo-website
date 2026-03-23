/**
 * Loads shared navbar and footer fragments into #navbar-container and #footer-container.
 */
(function () {
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  function resolveActiveKey(pathname) {
    const lower = pathname.toLowerCase();
    if (/\/about(\.|\/|$)/.test(lower) || lower.endsWith('about.html')) return 'about';
    if (lower.includes('/portfolio')) return 'projects';
    if (lower.includes('/blog')) return 'blog';
    if (lower.includes('/connect')) return 'connect';
    return null;
  }

  function highlightActiveNav() {
    const key = resolveActiveKey(window.location.pathname);
    document.querySelectorAll('[data-nav-link]').forEach(function (el) {
      var linkKey = el.getAttribute('data-nav-link');
      var isActive = key !== null && linkKey === key;
      var isMobile = el.classList.contains('nav-link-mobile');
      if (isMobile) {
        el.className = isActive
          ? 'nav-link-mobile text-2xl font-medium text-white transition-colors duration-300'
          : 'nav-link-mobile text-2xl font-medium text-gray-400 transition-colors duration-300 hover:text-white';
      } else {
        el.className = isActive
          ? 'nav-link inline-block border-b-2 border-white pb-0.5 text-sm font-medium text-white transition-colors duration-300'
          : 'nav-link inline-block text-sm font-medium text-gray-400 transition-colors duration-300 hover:text-white';
      }
    });
  }

  function initMobileMenu() {
    var btn = document.getElementById('mobile-menu-btn');
    var overlay = document.getElementById('mobile-menu-overlay');
    var closeBtn = document.getElementById('mobile-menu-close');
    if (!btn || !overlay) return;

    function openMenu() {
      overlay.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
      overlay.classList.add('opacity-100', 'visible', 'pointer-events-auto');
      overlay.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('overflow-hidden');
    }

    function closeMenu() {
      if (overlay.classList.contains('invisible')) return;
      overlay.classList.add('opacity-0', 'invisible', 'pointer-events-none');
      overlay.classList.remove('opacity-100', 'visible', 'pointer-events-auto');
      overlay.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('overflow-hidden');
    }

    function toggleMenu() {
      if (overlay.classList.contains('invisible')) openMenu();
      else closeMenu();
    }

    btn.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    overlay.querySelectorAll('a[data-nav-link]').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  async function run() {
    var navContainer = document.getElementById('navbar-container');
    var footContainer = document.getElementById('footer-container');
    if (!navContainer && !footContainer) return;

    var navPromise =
      navContainer && !navContainer.innerHTML.trim()
        ? fetch('/components/navbar.html')
            .then(function (r) {
              if (!r.ok) throw new Error('navbar ' + r.status);
              return r.text();
            })
            .catch(function (e) {
              console.warn('[components]', e);
              return null;
            })
        : Promise.resolve(null);

    var footPromise =
      footContainer && !footContainer.innerHTML.trim()
        ? fetch('/components/footer.html')
            .then(function (r) {
              if (!r.ok) throw new Error('footer ' + r.status);
              return r.text();
            })
            .catch(function (e) {
              console.warn('[components]', e);
              return null;
            })
        : Promise.resolve(null);

    var results = await Promise.all([navPromise, footPromise]);
    var navHtml = results[0];
    var footHtml = results[1];

    try {
      if (navHtml && navContainer) navContainer.innerHTML = navHtml;
      if (footHtml && footContainer) footContainer.innerHTML = footHtml;
    } catch (e) {
      console.warn('[components] inject failed', e);
      return;
    }

    if (navContainer && (navHtml || navContainer.querySelector('header'))) {
      highlightActiveNav();
      initMobileMenu();
    }
  }

  onReady(run);
})();
