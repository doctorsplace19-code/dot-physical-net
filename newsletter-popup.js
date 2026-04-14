/**
 * DOT Physical — Newsletter Popup
 * Shows after 30 seconds on first visit (cookie-based, won't re-show for 30 days).
 * Include this script at the bottom of any page: <script src="newsletter-popup.js"></script>
 */
(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────────────────────────────
  var DELAY_MS   = 30000;   // Show after 30 seconds
  var COOKIE_KEY = 'dp_nl_seen';
  var COOKIE_DAYS = 30;     // Don't show again for 30 days after dismiss
  var NL_PAGE    = 'newsletter.html'; // Where the full signup page lives
  // ────────────────────────────────────────────────────────────────────────────

  function getCookie(name) {
    var v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
  }

  function setCookie(name, value, days) {
    var d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + value + ';expires=' + d.toUTCString() + ';path=/';
  }

  function dismiss() {
    setCookie(COOKIE_KEY, '1', COOKIE_DAYS);
    var popup = document.getElementById('dp-nl-popup');
    if (popup) {
      popup.style.opacity = '0';
      popup.style.transform = 'translateY(20px)';
      setTimeout(function () { popup.remove(); }, 350);
    }
  }

  function createPopup() {
    var style = document.createElement('style');
    style.textContent = [
      '#dp-nl-popup{position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;width:340px;background:#fff;border:1px solid rgba(26,86,219,0.18);border-radius:16px;box-shadow:0 12px 48px rgba(26,86,219,0.18);padding:1.75rem;font-family:"DM Sans",sans-serif;transition:opacity 0.35s,transform 0.35s;opacity:0;transform:translateY(20px)}',
      '#dp-nl-popup.dp-show{opacity:1;transform:translateY(0)}',
      '#dp-nl-popup .dp-close{position:absolute;top:0.75rem;right:0.75rem;background:none;border:none;font-size:1.1rem;color:#7A8FB8;cursor:pointer;line-height:1;padding:0.2rem}',
      '#dp-nl-popup .dp-close:hover{color:#0C1B3A}',
      '#dp-nl-popup .dp-icon{font-size:2rem;margin-bottom:0.6rem}',
      '#dp-nl-popup h4{font-family:"Syne",sans-serif;font-weight:800;font-size:1.05rem;color:#0C1B3A;margin-bottom:0.35rem;padding-right:1rem}',
      '#dp-nl-popup p{color:#3D5280;font-size:0.82rem;line-height:1.6;margin-bottom:1.1rem;font-weight:300}',
      '#dp-nl-popup .dp-form{display:flex;flex-direction:column;gap:0.5rem}',
      '#dp-nl-popup .dp-input{background:#F4F7FF;border:1.5px solid rgba(26,86,219,0.18);border-radius:8px;padding:0.65rem 0.9rem;font-family:"DM Sans",sans-serif;font-size:0.875rem;color:#0C1B3A;outline:none;transition:border-color 0.2s}',
      '#dp-nl-popup .dp-input:focus{border-color:#1A56DB}',
      '#dp-nl-popup .dp-btn{background:#1A56DB;color:#fff;border:none;border-radius:100px;padding:0.7rem;font-weight:700;font-size:0.875rem;cursor:pointer;transition:background 0.2s;font-family:"DM Sans",sans-serif}',
      '#dp-nl-popup .dp-btn:hover{background:#1447C0}',
      '#dp-nl-popup .dp-skip{text-align:center;color:#7A8FB8;font-size:0.75rem;cursor:pointer;transition:color 0.2s;background:none;border:none;font-family:"DM Sans",sans-serif;width:100%;margin-top:0.25rem}',
      '#dp-nl-popup .dp-skip:hover{color:#1A56DB}',
      '#dp-nl-popup .dp-success{display:none;text-align:center;padding:0.5rem 0}',
      '#dp-nl-popup .dp-success p{margin:0;font-size:0.9rem;color:#0694A2;font-weight:500}',
      '@media(max-width:480px){#dp-nl-popup{width:calc(100vw - 2rem);right:1rem;bottom:1rem}}'
    ].join('');
    document.head.appendChild(style);

    var popup = document.createElement('div');
    popup.id = 'dp-nl-popup';
    popup.innerHTML = [
      '<button class="dp-close" id="dp-close-btn" aria-label="Close">✕</button>',
      '<div class="dp-icon">📬</div>',
      '<h4>Get weekly DOT compliance news</h4>',
      '<p>FMCSA updates, driver tips &amp; compliance guides — every Monday. Free.</p>',
      '<div class="dp-form" id="dp-form">',
        '<input class="dp-input" type="email" id="dp-email" placeholder="your@email.com" required>',
        '<button class="dp-btn" id="dp-submit-btn">Subscribe Free →</button>',
        '<button class="dp-skip" id="dp-skip-btn">No thanks</button>',
      '</div>',
      '<div class="dp-success" id="dp-success">',
        '<p>✓ You\'re in! See you Monday. 🎉</p>',
      '</div>'
    ].join('');

    document.body.appendChild(popup);

    document.getElementById('dp-close-btn').addEventListener('click', dismiss);
    document.getElementById('dp-skip-btn').addEventListener('click', dismiss);

    document.getElementById('dp-submit-btn').addEventListener('click', function (e) {
      e.preventDefault();
      var email = document.getElementById('dp-email').value;
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        document.getElementById('dp-email').focus();
        return;
      }
      // ── Send to your email service here ──────────────────────────────────
      // Example Mailchimp: fetch('/mailchimp-subscribe', { method:'POST', body:JSON.stringify({email}) })
      // Example ConvertKit: use their JS API
      // For now: show success and dismiss after 3s
      // ────────────────────────────────────────────────────────────────────
      document.getElementById('dp-form').style.display = 'none';
      document.getElementById('dp-success').style.display = 'block';
      setCookie(COOKIE_KEY, '1', 365); // subscribed — don't show again for a year
      setTimeout(dismiss, 3000);
    });

    // Animate in
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        popup.classList.add('dp-show');
      });
    });
  }

  function init() {
    // Don't show on the newsletter page itself
    if (window.location.pathname.indexOf('newsletter') !== -1) return;
    // Don't show if already seen/subscribed
    if (getCookie(COOKIE_KEY)) return;

    setTimeout(createPopup, DELAY_MS);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
