/* mandolab.com — shared interactions */
(function () {
  'use strict';

  /* ---- mobile nav ------------------------------------------------------ */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }

  /* ---- nav solidify on scroll ----------------------------------------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('solid', window.scrollY > 40); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- scroll reveal --------------------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- lightbox (project detail galleries) ----------------------------- */
  var gallery = document.querySelector('[data-gallery]');
  if (!gallery) return;

  var figures = Array.prototype.slice.call(gallery.querySelectorAll('figure'));
  var items = figures.map(function (f) {
    var img = f.querySelector('img');
    var cap = f.querySelector('figcaption');
    return { src: img.getAttribute('src'), caption: cap ? cap.textContent : '' };
  });

  var lb = document.createElement('div');
  lb.className = 'lb';
  lb.innerHTML =
    '<div class="lb-count" data-count></div>' +
    '<button class="lb-btn lb-close" aria-label="Close">✕</button>' +
    '<button class="lb-btn lb-prev" aria-label="Previous">‹</button>' +
    '<img alt="">' +
    '<button class="lb-btn lb-next" aria-label="Next">›</button>' +
    '<div class="lb-cap" data-cap></div>';
  document.body.appendChild(lb);

  var lbImg = lb.querySelector('img');
  var lbCap = lb.querySelector('[data-cap]');
  var lbCount = lb.querySelector('[data-count]');
  var idx = 0;

  function show(i) {
    idx = (i + items.length) % items.length;
    lbImg.src = items[idx].src;
    lbImg.alt = items[idx].caption;
    lbCap.textContent = items[idx].caption;
    lbCount.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(items.length).padStart(2, '0');
  }
  function open(i) { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { lb.classList.remove('open'); document.body.style.overflow = ''; }

  figures.forEach(function (f, i) { f.addEventListener('click', function () { open(i); }); });
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'ArrowRight') show(idx + 1);
  });
})();
