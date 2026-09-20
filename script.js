/* HF Software Services — progressive enhancement only.
   Every piece of content renders without this file. */
(function () {
  'use strict';

  // ── Fill these in when available ───────────────────────────
  var CONFIG = {
    // Cal.com or Calendly booking page. Leave empty to show the email fallback.
    SCHEDULER_URL: '',
    // Formspree / Basin / your own endpoint. Leave empty to send the brief by email.
    FORM_ENDPOINT: ''
  };

  // Footer year
  var y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());

  // Scheduler embed
  var sched = document.getElementById('scheduler');
  if (sched && CONFIG.SCHEDULER_URL) {
    var url = CONFIG.SCHEDULER_URL;
    if (/calendly\.com/.test(url)) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + 'embed_domain=' + location.host + '&embed_type=Inline&hide_gdpr_banner=1';
    } else if (/cal\.com/.test(url)) {
      url += (url.indexOf('?') === -1 ? '?' : '&') + 'embed=true&theme=light';
    }
    var f = document.createElement('iframe');
    f.src = url;
    f.title = 'Book a 30-minute reliability audit';
    f.loading = 'lazy';
    f.setAttribute('allow', 'payment');
    sched.appendChild(f);
    sched.classList.add('scheduler--live');
    document.querySelectorAll('a[data-scheduler]').forEach(function (a) { a.href = CONFIG.SCHEDULER_URL; a.target = '_blank'; a.rel = 'noopener'; });
  }

  // Brief form: POST to an endpoint if configured, else open a prefilled email
  var form = document.getElementById('brief');
  if (form) {
    var status = form.querySelector('.brief__status');
    form.addEventListener('submit', function (e) {
      var data = new FormData(form);
      var lines = [
        'What\'s breaking: ' + (data.get('problem') || ''),
        'Budget range: ' + (data.get('budget') || 'not specified'),
        'Timeline: ' + (data.get('timeline') || 'not specified'),
        'Reply to: ' + (data.get('email') || '')
      ];
      if (CONFIG.FORM_ENDPOINT) {
        e.preventDefault();
        status.textContent = 'Sending…';
        fetch(CONFIG.FORM_ENDPOINT, { method: 'POST', headers: { 'Accept': 'application/json' }, body: data })
          .then(function (r) { if (!r.ok) throw new Error(r.status); status.dataset.ok = 'true'; status.textContent = 'Sent. You\'ll hear back within one business day.'; form.reset(); })
          .catch(function () { status.textContent = 'Could not send. Email me instead: ' + form.dataset.email; });
        return;
      }
      // No endpoint: hand off to the mail client with the brief prefilled.
      e.preventDefault();
      var subject = encodeURIComponent('Reliability audit — brief');
      var body = encodeURIComponent(lines.join('\n'));
      location.href = 'mailto:' + form.dataset.email + '?subject=' + subject + '&body=' + body;
      status.textContent = 'Opening your email client with the brief filled in.';
    });
  }
})();
