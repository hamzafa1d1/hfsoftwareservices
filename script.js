(function () {
  'use strict';
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  // Active step in the Method chapter: highlight the card and the matching dot on the mini loop.
  var steps = document.querySelectorAll('.step[data-step]');
  var dots = document.querySelectorAll('.mini-loop__dots circle');
  var count = document.getElementById('mini-loop-count');
  function setStep(n) {
    steps.forEach(function (s) { s.classList.toggle('is-active', s.getAttribute('data-step') === n); });
    dots.forEach(function (d) { d.classList.toggle('is-active', d.getAttribute('data-step') === n); });
    if (count) count.textContent = n + ' / 9';
  }
  if (hasIO && steps.length) {
    var stepIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setStep(e.target.getAttribute('data-step')); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    steps.forEach(function (s) { stepIO.observe(s); });
  }

  if (reduce) return;

  // Pointer tilt for the 3D loop (±6°), paused while the hero is off-screen.
  var loop = document.querySelector('.loop3d');
  if (loop && window.matchMedia('(pointer: fine)').matches) {
    var visible = true, frame = 0, px = 0, py = 0;
    if (hasIO) new IntersectionObserver(function (e) { visible = e[0].isIntersecting; }).observe(loop);
    window.addEventListener('pointermove', function (e) {
      if (!visible) return;
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
      if (!frame) frame = requestAnimationFrame(function () {
        frame = 0;
        loop.style.setProperty('--tx', (60 - py * 12).toFixed(2) + 'deg');
        loop.style.setProperty('--ty', (px * 12).toFixed(2) + 'deg');
      });
    }, { passive: true });
  }

  // Count-up for headline numbers. The final value is already in the HTML.
  var nums = document.querySelectorAll('[data-count]');
  if (hasIO && nums.length) {
    var numIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        numIO.unobserve(e.target);
        var el = e.target, end = +el.getAttribute('data-count'), t0 = performance.now();
        (function tick(t) {
          var p = Math.min((t - t0) / 1100, 1);
          el.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { numIO.observe(n); });
  }
})();
