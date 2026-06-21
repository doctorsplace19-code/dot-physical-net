(function () {
  'use strict';

  const API_URL = 'https://portal.dot-physical.net/api/chat';
  const BOOKING_URL = 'https://portal.dot-physical.net/order';

  const STYLES = `
    #dp-chat-btn {
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      width: 60px; height: 60px; border-radius: 50%;
      background: #1A56DB; color: #fff; border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(26,86,219,0.45);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
      font-family: 'DM Sans', sans-serif;
    }
    #dp-chat-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 28px rgba(26,86,219,0.55); }
    #dp-chat-btn svg { width: 26px; height: 26px; }
    #dp-chat-btn .dp-close { display: none; }
    #dp-chat-btn.open .dp-open { display: none; }
    #dp-chat-btn.open .dp-close { display: block; }

    #dp-chat-window {
      position: fixed; bottom: 96px; right: 24px; z-index: 9998;
      width: 360px; max-height: 520px;
      background: #fff; border-radius: 20px;
      box-shadow: 0 8px 40px rgba(12,27,58,0.18);
      display: none; flex-direction: column; overflow: hidden;
      font-family: 'DM Sans', Arial, sans-serif;
      border: 1px solid rgba(26,86,219,0.1);
    }
    #dp-chat-window.open { display: flex; }

    #dp-chat-header {
      background: #0C1B3A; padding: 16px 18px;
      display: flex; align-items: center; gap: 12px;
    }
    .dp-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: #1A56DB; display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 13px; color: #fff; flex-shrink: 0;
    }
    .dp-header-text { flex: 1; }
    .dp-header-name { color: #fff; font-weight: 700; font-size: 14px; line-height: 1.2; }
    .dp-header-status { color: rgba(255,255,255,0.55); font-size: 11px; display: flex; align-items: center; gap: 5px; }
    .dp-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #10b981; display: inline-block; }

    #dp-chat-messages {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 10px;
      background: #f8fafc; min-height: 240px; max-height: 340px;
    }
    .dp-msg { max-width: 82%; display: flex; flex-direction: column; }
    .dp-msg.bot { align-self: flex-start; }
    .dp-msg.user { align-self: flex-end; }
    .dp-bubble {
      padding: 10px 14px; border-radius: 16px;
      font-size: 13.5px; line-height: 1.55; word-break: break-word;
    }
    .dp-msg.bot .dp-bubble {
      background: #fff; color: #0C1B3A;
      border: 1px solid rgba(26,86,219,0.1);
      border-bottom-left-radius: 4px;
    }
    .dp-msg.user .dp-bubble {
      background: #1A56DB; color: #fff;
      border-bottom-right-radius: 4px;
    }
    .dp-typing { display: flex; align-items: center; gap: 4px; padding: 10px 14px; }
    .dp-typing span {
      width: 7px; height: 7px; border-radius: 50%; background: #94a3b8;
      animation: dp-bounce 1.2s infinite;
    }
    .dp-typing span:nth-child(2) { animation-delay: 0.2s; }
    .dp-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes dp-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }

    #dp-chat-quick { padding: 8px 12px; display: flex; gap: 6px; flex-wrap: wrap; background: #fff; border-top: 1px solid rgba(26,86,219,0.08); }
    .dp-quick-btn {
      background: #EBF0FF; color: #1A56DB; border: none; cursor: pointer;
      padding: 5px 11px; border-radius: 100px; font-size: 11.5px; font-weight: 500;
      white-space: nowrap; transition: background 0.15s;
      font-family: inherit;
    }
    .dp-quick-btn:hover { background: #d4e0ff; }

    #dp-chat-form {
      display: flex; gap: 8px; padding: 12px; background: #fff;
      border-top: 1px solid rgba(26,86,219,0.08);
    }
    #dp-chat-input {
      flex: 1; border: 1px solid rgba(26,86,219,0.2); border-radius: 100px;
      padding: 9px 15px; font-size: 13px; outline: none;
      font-family: inherit; color: #0C1B3A;
      transition: border-color 0.2s;
    }
    #dp-chat-input:focus { border-color: #1A56DB; }
    #dp-chat-send {
      width: 38px; height: 38px; border-radius: 50%; background: #1A56DB;
      border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.2s;
    }
    #dp-chat-send:hover { background: #1447C0; }
    #dp-chat-send svg { width: 16px; height: 16px; color: #fff; }

    #dp-chat-book {
      margin: 0 16px 12px; padding: 10px; background: #EBF0FF;
      border-radius: 10px; text-align: center; display: none;
    }
    #dp-chat-book a {
      color: #1A56DB; font-weight: 700; font-size: 13px; text-decoration: none;
    }
    #dp-chat-book a:hover { text-decoration: underline; }

    @media (max-width: 400px) {
      #dp-chat-window { width: calc(100vw - 20px); right: 10px; bottom: 86px; }
    }
  `;

  const QUICK_REPLIES = [
    { label: 'Cost?', text: 'How much does a DOT physical cost?' },
    { label: 'Blood pressure?', text: 'What blood pressure do I need to pass?' },
    { label: 'How to order?', text: 'How do I order a DOT physical?' },
    { label: 'What to bring?', text: 'What do I need to bring?' },
  ];

  let messages = [];
  let isOpen = false;
  let isLoading = false;

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = STYLES;
    document.head.appendChild(style);
  }

  function buildUI() {
    // Button
    const btn = document.createElement('button');
    btn.id = 'dp-chat-btn';
    btn.setAttribute('aria-label', 'Chat with us');
    btn.innerHTML = `
      <svg class="dp-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
      <svg class="dp-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    `;
    btn.addEventListener('click', toggleChat);

    // Window
    const win = document.createElement('div');
    win.id = 'dp-chat-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'DOT Physical Assistant');
    win.innerHTML = `
      <div id="dp-chat-header">
        <div class="dp-avatar">DP</div>
        <div class="dp-header-text">
          <div class="dp-header-name">DOT Physical Assistant</div>
          <div class="dp-header-status"><span class="dp-status-dot"></span> Online now</div>
        </div>
      </div>
      <div id="dp-chat-messages"></div>
      <div id="dp-chat-quick"></div>
      <div id="dp-chat-book">
        <a href="${BOOKING_URL}" target="_blank">Order Your DOT Physical — $110 &rarr;</a>
      </div>
      <form id="dp-chat-form">
        <input id="dp-chat-input" type="text" placeholder="Ask a question..." autocomplete="off" maxlength="300"/>
        <button type="submit" id="dp-chat-send" aria-label="Send">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </form>
    `;

    document.body.appendChild(btn);
    document.body.appendChild(win);

    // Quick replies
    const quickDiv = win.querySelector('#dp-chat-quick');
    QUICK_REPLIES.forEach(qr => {
      const b = document.createElement('button');
      b.className = 'dp-quick-btn';
      b.textContent = qr.label;
      b.addEventListener('click', () => sendMessage(qr.text));
      quickDiv.appendChild(b);
    });

    // Form submit
    win.querySelector('#dp-chat-form').addEventListener('submit', e => {
      e.preventDefault();
      const input = document.getElementById('dp-chat-input');
      const text = input.value.trim();
      if (text) { input.value = ''; sendMessage(text); }
    });

    // Welcome message
    appendMessage('bot', 'Hi! I\'m the Doctors Place assistant. I can answer questions about DOT physicals, drug tests, blood pressure requirements, and help you get ordered. What can I help you with?');
  }

  function toggleChat() {
    isOpen = !isOpen;
    document.getElementById('dp-chat-btn').classList.toggle('open', isOpen);
    document.getElementById('dp-chat-window').classList.toggle('open', isOpen);
    if (isOpen) document.getElementById('dp-chat-input').focus();
  }

  function appendMessage(role, text) {
    const container = document.getElementById('dp-chat-messages');
    const msg = document.createElement('div');
    msg.className = `dp-msg ${role}`;
    const bubble = document.createElement('div');
    bubble.className = 'dp-bubble';
    bubble.textContent = text;
    msg.appendChild(bubble);
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;

    // Show booking prompt after bot mentions price or ordering
    if (role === 'bot' && (text.includes('$110') || text.includes('order') || text.includes('portal'))) {
      document.getElementById('dp-chat-book').style.display = 'block';
    }

    return msg;
  }

  function showTyping() {
    const container = document.getElementById('dp-chat-messages');
    const msg = document.createElement('div');
    msg.className = 'dp-msg bot';
    msg.id = 'dp-typing';
    msg.innerHTML = '<div class="dp-bubble dp-typing"><span></span><span></span><span></span></div>';
    container.appendChild(msg);
    container.scrollTop = container.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('dp-typing');
    if (t) t.remove();
  }

  async function sendMessage(text) {
    if (isLoading) return;
    isLoading = true;

    appendMessage('user', text);
    messages.push({ role: 'user', content: text });

    // Hide quick replies after first message
    document.getElementById('dp-chat-quick').style.display = 'none';

    showTyping();

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });
      const data = await res.json();
      removeTyping();

      const reply = data.message || 'Sorry, something went wrong. Please call (888) 233-4567.';
      appendMessage('bot', reply);
      messages.push({ role: 'assistant', content: reply });

      // Keep conversation history to last 10 messages to control costs
      if (messages.length > 10) messages = messages.slice(-10);
    } catch {
      removeTyping();
      appendMessage('bot', 'Sorry, I\'m having trouble connecting. Please call us at (888) 233-4567 or visit portal.dot-physical.net/order.');
    }

    isLoading = false;
  }

  function init() {
    injectStyles();
    buildUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
