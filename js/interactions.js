(function () {
  function ready(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  ready(function () {
    document.body.classList.add('interactive-ready');

    createProgressBar();
    setupRevealAnimations();
    setupButtonFeedback();
    setupInteractiveCards();
    setupServiceHighlights();
    setupNavState();
  });

  function createProgressBar() {
    var bar = document.createElement('div');
    bar.className = 'scroll-progress-bar';
    document.body.appendChild(bar);

    function updateProgress() {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop || 0;
      var docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      ) - window.innerHeight;
      var progress = docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0;
      bar.style.transform = 'scaleX(' + progress + ')';
    }

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
  }

  function setupRevealAnimations() {
    var selectors = [
      '.hero-item',
      '.intro-text',
      '.section-title',
      '.content-wrap',
      '.box-item',
      '.team-box',
      '.serv-item',
      '.contact-details-wrap',
      '.footer-inner',
      '.social-wrap'
    ];

    var elements = document.querySelectorAll(selectors.join(','));
    for (var i = 0; i < elements.length; i += 1) {
      elements[i].classList.add('reveal-fade');
      elements[i].style.transitionDelay = ((i % 4) * 90) + 'ms';
    }

    if (!('IntersectionObserver' in window)) {
      for (var j = 0; j < elements.length; j += 1) {
        elements[j].classList.add('is-visible');
      }
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      for (var k = 0; k < entries.length; k += 1) {
        if (entries[k].isIntersecting) {
          entries[k].target.classList.add('is-visible');
          obs.unobserve(entries[k].target);
        }
      }
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    for (var m = 0; m < elements.length; m += 1) {
      observer.observe(elements[m]);
    }
  }

  function setupButtonFeedback() {
    var triggers = document.querySelectorAll('.btn, #submit, .to-top, .show-share, .show-search, .nav-button');
    for (var i = 0; i < triggers.length; i += 1) {
      triggers[i].classList.add('interactive-trigger');
      triggers[i].addEventListener('pointerdown', function () {
        this.classList.remove('is-pressed');
        void this.offsetWidth;
        this.classList.add('is-pressed');
      });
    }
  }

  function setupInteractiveCards() {
    var cards = document.querySelectorAll('.team-box, .box-item');
    for (var i = 0; i < cards.length; i += 1) {
      attachTilt(cards[i]);
    }
  }

  function attachTilt(card) {
    card.addEventListener('mousemove', function (event) {
      if (window.innerWidth < 768) return;
      var rect = card.getBoundingClientRect();
      var x = ((event.clientX - rect.left) / rect.width) - 0.5;
      var y = ((event.clientY - rect.top) / rect.height) - 0.5;
      card.style.setProperty('--tilt-x', (x * 10).toFixed(2) + 'deg');
      card.style.setProperty('--tilt-y', (y * -10).toFixed(2) + 'deg');
      card.classList.add('is-tilting');
    });

    card.addEventListener('mouseleave', function () {
      card.classList.remove('is-tilting');
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    });
  }

  function setupServiceHighlights() {
    var items = document.querySelectorAll('.serv-item');
    if (!items.length) return;

    function activate(item) {
      for (var i = 0; i < items.length; i += 1) {
        items[i].classList.remove('is-active');
      }
      item.classList.add('is-active');
    }

    activate(items[0]);

    for (var i = 0; i < items.length; i += 1) {
      (function (item) {
        item.addEventListener('mouseenter', function () {
          activate(item);
        });
        item.addEventListener('click', function () {
          activate(item);
        });
      })(items[i]);
    }
  }

  function setupNavState() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-holder a[href^="#"]');
    if (!sections.length || !navLinks.length || !('IntersectionObserver' in window)) return;

    var linkMap = {};
    for (var i = 0; i < navLinks.length; i += 1) {
      var href = navLinks[i].getAttribute('href');
      if (href) linkMap[href.slice(1)] = navLinks[i];
    }

    var observer = new IntersectionObserver(function (entries) {
      for (var j = 0; j < entries.length; j += 1) {
        if (!entries[j].isIntersecting) continue;
        for (var id in linkMap) {
          if (Object.prototype.hasOwnProperty.call(linkMap, id)) {
            linkMap[id].classList.remove('is-current');
          }
        }
        if (linkMap[entries[j].target.id]) {
          linkMap[entries[j].target.id].classList.add('is-current');
        }
      }
    }, {
      threshold: 0.45,
      rootMargin: '-20% 0px -35% 0px'
    });

    for (var key = 0; key < sections.length; key += 1) {
      observer.observe(sections[key]);
    }
  }
})();
