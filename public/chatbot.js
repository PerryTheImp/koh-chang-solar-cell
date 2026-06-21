/**
 * JJ Com Solar Cell - Chatbot Widget
 * Fully functional Q&A chatbot with LINE integration for Thai market
 */
(function() {
  var PHONE = '094 050 9623';
  var LINE_ID = 'jjcomsolar';
  var EMAIL = 'jjcomandsolarcell@gmail.com';

  // Inject CSS
  var styles = document.createElement('style');
  styles.textContent = [
    '#chat-toggle{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;background:#2d7a3e;color:white;border:none;box-shadow:0 4px 12px rgba(0,0,0,0.3);cursor:pointer;z-index:999;font-size:24px;transition:transform .2s;display:flex;align-items:center;justify-content:center;}',
    '#chat-toggle:hover{transform:scale(1.1);}',
    '#chat-panel{position:fixed;bottom:90px;right:24px;width:340px;height:480px;background:white;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,0.2);z-index:998;display:none;overflow:hidden;border:1px solid #e5e7eb;font-family:system-ui,-apple-system,sans-serif;}',
    '#chat-header{background:#2d7a3e;color:white;padding:16px;font-weight:600;display:flex;justify-content:space-between;align-items:center;}',
    '#chat-header .info{display:flex;align-items:center;gap:10px;}',
    '#chat-header .avatar{width:36px;height:36px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;}',
    '#chat-header .status{font-size:11px;opacity:0.9;}',
    '#chat-close{background:none;border:none;color:white;font-size:20px;cursor:pointer;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background .2s;}',
    '#chat-close:hover{background:rgba(255,255,255,0.2);}',
    '#chat-messages{padding:16px;height:310px;overflow-y:auto;background:#f9fafb;display:flex;flex-direction:column;gap:10px;}',
    '.msg-bot{background:white;padding:12px 14px;border-radius:14px 14px 14px 2px;box-shadow:0 1px 3px rgba(0,0,0,0.08);max-width:85%;font-size:13px;line-height:1.5;color:#374151;}',
    '.msg-user{background:#2d7a3e;color:white;padding:12px 14px;border-radius:14px 14px 2px 14px;align-self:flex-end;max-width:85%;font-size:13px;line-height:1.5;box-shadow:0 1px 3px rgba(0,0,0,0.1);}',
    '.msg-bot a{color:#2d7a3e;text-decoration:underline;}',
    '.msg-bot strong{color:#111;font-weight:600;}',
    '#chat-options{display:flex;flex-direction:column;gap:8px;margin-top:4px;}',
    '.chat-opt{text-align:left;padding:10px 14px;border:1px solid #e5e7eb;border-radius:10px;background:white;cursor:pointer;font-size:13px;color:#374151;transition:all .2s;}',
    '.chat-opt:hover{border-color:#2d7a3e;background:#f0fdf4;}',
    '#chat-footer{padding:12px;border-top:1px solid #e5e7eb;background:white;display:flex;gap:8px;}',
    '#chat-input{flex:1;padding:10px 14px;border:1px solid #e5e7eb;border-radius:10px;font-size:14px;outline:none;transition:border-color .2s;}',
    '#chat-input:focus{border-color:#2d7a3e;}',
    '#chat-send{padding:10px 14px;background:#2d7a3e;color:white;border:none;border-radius:10px;cursor:pointer;font-size:14px;transition:background .2s;}',
    '#chat-send:hover{background:#236b32;}',
    '.typing{display:flex;gap:4px;padding:12px 14px;background:white;border-radius:14px 14px 14px 2px;box-shadow:0 1px 3px rgba(0,0,0,0.08);max-width:60px;}',
    '.typing span{width:6px;height:6px;background:#9ca3af;border-radius:50%;animation:chatBounce 1.4s infinite ease-in-out;}',
    '.typing span:nth-child(2){animation-delay:.2s;}',
    '.typing span:nth-child(3){animation-delay:.4s;}',
    '@keyframes chatBounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}'
  ].join('\n');
  document.head.appendChild(styles);

  // Create toggle button
  var toggle = document.createElement('button');
  toggle.id = 'chat-toggle';
  toggle.innerHTML = '💬';
  document.body.appendChild(toggle);

  // Create chat panel
  var panel = document.createElement('div');
  panel.id = 'chat-panel';
  panel.innerHTML = [
    '<div id="chat-header">',
      '<div class="info">',
        '<div class="avatar">🌞</div>',
        '<div>JJ Com Solar<div class="status">Online now • Replies fast</div></div>',
      '</div>',
      '<button id="chat-close">×</button>',
    '</div>',
    '<div id="chat-messages">',
      '<div class="msg-bot">👋 Hi! I\'m your solar assistant. Ask me anything about solar panels, pricing, or installation in Thailand.</div>',
      '<div id="chat-options">',
        '<button class="chat-opt" data-action="how-solar">💡 How do solar panels work?</button>',
        '<button class="chat-opt" data-action="quote">💰 Get a free quote</button>',
        '<button class="chat-opt" data-action="maintenance">🔧 Maintenance and cleaning</button>',
        '<button class="chat-opt" data-action="human">📞 Speak to a human</button>',
      '</div>',
    '</div>',
    '<div id="chat-footer">',
      '<input id="chat-input" type="text" placeholder="Type your message..." />',
      '<button id="chat-send">Send</button>',
    '</div>'
  ].join('');
  document.body.appendChild(panel);

  var messages = document.getElementById('chat-messages');
  var input = document.getElementById('chat-input');

  // Toggle panel visibility
  toggle.onclick = function() {
    var showing = panel.style.display === 'block';
    panel.style.display = showing ? 'none' : 'block';
    if (!showing) setTimeout(function() { input.focus(); }, 100);
  };

  document.getElementById('chat-close').onclick = function() {
    panel.style.display = 'none';
  };

  // Add message to chat
  function addMessage(text, isUser) {
    var div = document.createElement('div');
    div.className = isUser ? 'msg-user' : 'msg-bot';
    div.innerHTML = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  // Show typing indicator
  function showTyping(callback) {
    var div = document.createElement('div');
    div.className = 'typing';
    div.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    setTimeout(function() {
      div.remove();
      callback();
    }, 1200);
  }

  // Handle button clicks
  messages.addEventListener('click', function(e) {
    var btn = e.target.closest('.chat-opt');
    if (!btn) return;

    var action = btn.dataset.action;
    var text = btn.textContent;

    addMessage(text, true);

    var opts = document.getElementById('chat-options');
    if (opts) opts.style.display = 'none';

    showTyping(function() {
      switch(action) {
        case 'how-solar':
          addMessage('💡 Solar panels convert sunlight into electricity using photovoltaic cells. In Thailand\'s climate, a typical 5kW system generates 20-25 kWh per day — enough for most homes and can reduce your electricity bill by 70-90%.');
          setTimeout(function() {
            showTyping(function() {
              addMessage('Want to know what size system fits your home? Just tell me your average monthly electricity bill.');
            });
          }, 600);
          break;

        case 'quote':
          addMessage('💰 Great! For an accurate quote, we need:');
          setTimeout(function() {
            showTyping(function() {
              addMessage('• Average monthly electricity bill<br>• Your location in Thailand<br>• Roof type and available space<br><br>You can <a href="#contact" onclick="document.getElementById(\'chat-panel\').style.display=\'none\';">fill out our quick form here</a> or just tell me your details in this chat.');
            });
          }, 400);
          break;

        case 'maintenance':
          addMessage('🔧 Our maintenance services:');
          setTimeout(function() {
            showTyping(function() {
              addMessage('• <strong>Panel cleaning:</strong> 300 THB per panel + travel<br>• <strong>Annual check:</strong> FREE for existing customers<br>• <strong>Inverter service:</strong> Firmware updates and inspection<br>• <strong>Performance monitoring:</strong> Via smartphone app<br><br>Regular cleaning improves efficiency by 10-20%!');
            });
          }, 400);
          break;

        case 'human':
          addMessage('📞 Reach us directly:');
          setTimeout(function() {
            showTyping(function() {
              addMessage('📱 <strong>Phone:</strong> <a href="tel:+66940509623">' + PHONE + '</a><br>📧 <strong>Email:</strong> ' + EMAIL + '<br>💬 <strong>LINE:</strong> <a href="https://line.me/ti/p/~' + LINE_ID + '" target="_blank">Click to chat on LINE</a><br><br>We typically respond within 1 hour during business hours (8 AM – 6 PM).');
            });
          }, 400);
          break;
      }
    });
  });

  // Send text message
  function sendMessage() {
    var text = input.value.trim();
    if (!text) return;

    addMessage(text, true);
    input.value = '';

    var opts = document.getElementById('chat-options');
    if (opts) opts.style.display = 'none';

    showTyping(function() {
      var lower = text.toLowerCase();

      if (lower.match(/price|cost|baht|expensive|cheap|quote|how much/)) {
        addMessage('💰 A typical 5kW residential system costs 150,000–200,000 THB installed. Larger homes (10kW+) range from 300,000–400,000 THB. We offer flexible payment and can design a system to match your budget. Want a detailed quote?');
      } else if (lower.match(/install|setup|process|how long|time|when/)) {
        addMessage('⚡ Installation takes 1–3 days depending on system size. We handle everything — permits, mounting, wiring, and grid connection. Most systems are fully operational within one week of site approval.');
      } else if (lower.match(/battery|storage|backup|night|evening/)) {
        addMessage('🔋 Battery storage lets you use solar power at night or during outages. We install lithium-ion and LiFePO4 batteries. Popular sizes: 5kWh, 10kWh, 15kWh. Battery payback is typically 5–7 years in Thailand. Want to know if it makes sense for your usage?');
      } else if (lower.match(/maintain|clean|service|warranty|repair|fix/)) {
        addMessage('🔧 Every installation includes 1 year of free maintenance. After that, panel cleaning is 300 THB per panel plus travel. Solar panels have 10–25 year warranties, inverters 5 years. We also offer affordable annual service contracts.');
      } else if (lower.match(/location|where|area|serve|region|province|travel/)) {
        addMessage('📍 We\'re based on Koh Chang, Trat, and serve all of Thailand. Strong experience in Northeast and Eastern regions. Travel fees apply for distant areas (North, South, Central) — typically 3,000–8,000 THB depending on distance.');
      } else if (lower.match(/hello|hi|hey|greeting|sawadee/)) {
        addMessage('👋 Sawadee krub! How can I help you with solar today? Ask about pricing, installation, or anything else.');
      } else {
        addMessage('😊 Thanks for your message! That\'s a great question. I\'ll pass it to our team and we\'ll get back to you with a detailed answer.<br><br>Or click <a href="https://line.me/ti/p/~' + LINE_ID + '" target="_blank">here to chat with us on LINE</a> for faster replies.');
      }
    });
  }

  document.getElementById('chat-send').onclick = sendMessage;
  input.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
  });
})();