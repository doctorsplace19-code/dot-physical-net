/**
 * DOT Physical — Mailchimp JSONP Integration
 * Audience: doctors-place (us18)
 * Works on static HTML — no server required.
 *
 * Usage:
 *   MC.subscribe('email@example.com', onSuccess, onError);
 *   MC.subscribeForm(formEl, emailInputEl, successEl, errorEl);
 */
var MC = (function () {
  'use strict';

  var BASE_URL = 'https://doctors-place.us18.list-manage.com/subscribe/post-json';
  var U        = 'bc51f7e5413c7ad7189f72854';
  var ID       = 'b79e889588';
  var F_ID     = '0010ade6f0';
  var HONEYPOT = 'b_bc51f7e5413c7ad7189f72854_b79e889588';

  var callbackIndex = 0;

  /**
   * Subscribe an email address with optional merge fields.
   * @param {string}   email
   * @param {Function} onSuccess  called with Mailchimp result object
   * @param {Function} onError    called with error message string
   * @param {object}   merges     optional merge fields e.g. { FNAME:'Jane', LNAME:'Smith' }
   */
  function subscribe(email, onSuccess, onError, merges) {
    var cbName = '__mc_cb_' + (++callbackIndex);

    var url = BASE_URL +
      '?u='      + U +
      '&id='     + ID +
      '&f_id='   + F_ID +
      '&EMAIL='  + encodeURIComponent(email) +
      '&'        + HONEYPOT + '=' +   // honeypot must be empty
      '&c='      + cbName;

    // Append any additional merge fields (FNAME, LNAME, MMERGE tags, etc.)
    if (merges && typeof merges === 'object') {
      Object.keys(merges).forEach(function (key) {
        if (merges[key]) url += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(merges[key]);
      });
    }

    window[cbName] = function (data) {
      delete window[cbName];
      if (script.parentNode) script.parentNode.removeChild(script);

      if (data && data.result === 'success') {
        if (onSuccess) onSuccess(data);
      } else {
        var msg = (data && data.msg) ? data.msg : 'Something went wrong. Please try again.';
        // Strip Mailchimp's HTML links from error messages
        msg = msg.replace(/<[^>]+>/g, '').replace(/^\d+\s*-\s*/, '');
        if (onError) onError(msg);
      }
    };

    var script = document.createElement('script');
    script.src = url;
    script.onerror = function () {
      delete window[cbName];
      if (onError) onError('Network error. Please check your connection and try again.');
    };
    document.head.appendChild(script);
  }

  /**
   * Wire up a styled form with a single email input.
   * Automatically handles loading state, success message, and error display.
   *
   * @param {object} opts
   *   opts.formEl      — <form> element
   *   opts.emailEl     — <input type="email"> element
   *   opts.submitEl    — submit <button> element
   *   opts.successEl   — element to show on success (gets .dp-visible class)
   *   opts.errorEl     — element to show errors in (optional)
   *   opts.hideOnSuccess — array of elements to hide on success (optional)
   *   opts.successMsg  — override success message text (optional)
   */
  function subscribeForm(opts) {
    if (!opts.formEl || !opts.emailEl || !opts.submitEl) return;

    opts.formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = opts.emailEl.value.trim();
      if (!email) return;

      // Loading state
      opts.submitEl.disabled = true;
      opts.submitEl.textContent = 'Subscribing…';
      if (opts.errorEl) opts.errorEl.style.display = 'none';

      subscribe(
        email,
        function (data) {
          // SUCCESS
          if (opts.hideOnSuccess) {
            opts.hideOnSuccess.forEach(function (el) {
              if (el) el.style.display = 'none';
            });
          }
          if (opts.successEl) {
            if (opts.successMsg) opts.successEl.textContent = opts.successMsg;
            opts.successEl.style.display = 'block';
          }
          opts.submitEl.disabled = false;
          opts.submitEl.textContent = '✓ Subscribed!';
        },
        function (msg) {
          // ERROR
          opts.submitEl.disabled = false;
          opts.submitEl.textContent = opts.submitEl.dataset.label || 'Subscribe Free →';
          if (opts.errorEl) {
            opts.errorEl.textContent = msg;
            opts.errorEl.style.display = 'block';
          } else {
            alert(msg);
          }
        }
      );
    });

    // Store original label for error recovery
    if (!opts.submitEl.dataset.label) {
      opts.submitEl.dataset.label = opts.submitEl.textContent;
    }
  }

  return { subscribe: subscribe, subscribeForm: subscribeForm };
})();
