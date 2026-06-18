(function () {
  // Avoid double-injecting if script runs more than once
  if (document.getElementById('ygt-dock-tab')) return;

  // Only your real recorded messages — add more here later as you record them
  const messages = [
    { id: "01", text: "Hey, you got this. Don't worry about it." },
    { id: "02", text: "Come on, one step at a time. You don't need to win the whole day, just this next minute. You got this." },
    { id: "03", text: "You've handled hard things before. This is no different. Just relax." },
    { id: "04", text: "It's okay to not have it all figured out right now." },
    { id: "05", text: "Everyone's proud of you for just trying. You're really doing good." },
    { id: "06", text: "I believe in you more than you believe in yourself right now, and that's completely fine. Let me hold that for a bit." },
    { id: "07", text: "You're closer than you think. Just keep going." }
  ];

  function audioCandidates(id) {
    return [id + ".mp3", id + ".m4a", id + ".wav"].map(
      (name) => chrome.runtime.getURL("audio/" + name)
    );
  }

  let audioCtx = null;
  function playChime() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const now = audioCtx.currentTime;
      const notes = [523.25, 659.25, 784.0];
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        const start = now + i * 0.1;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.08, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.0);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(start);
        osc.stop(start + 1.1);
      });
    } catch (e) {}
  }

  function playRealAudio(id, onDone) {
    const candidates = audioCandidates(id);
    function tryNext(list) {
      if (list.length === 0) { onDone(); return; }
      const [first, ...rest] = list;
      const audio = new Audio(first);
      let handled = false;
      audio.addEventListener('canplaythrough', () => {
        if (handled) return;
        handled = true;
        setPlaying(true);
        audio.play().catch(() => { setPlaying(false); tryNext(rest); });
      });
      audio.addEventListener('ended', () => { setPlaying(false); onDone(); });
      audio.addEventListener('error', () => {
        if (handled) return;
        handled = true;
        tryNext(rest);
      });
      audio.load();
    }
    tryNext(candidates);
  }

  // ---- Build the widget DOM ----
  const dockTab = document.createElement('button');
  dockTab.id = 'ygt-dock-tab';
  dockTab.setAttribute('aria-label', 'Need a little reassurance? Click me.');
  dockTab.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M12 21C12 21 4 16.5 4 10.5C4 7.5 6.5 5 9.5 5C10.9 5 12 5.7 12 5.7C12 5.7 13.1 5 14.5 5C17.5 5 20 7.5 20 10.5C20 16.5 12 21 12 21Z" stroke="#c98a8a" stroke-width="1.6" stroke-linejoin="round"/>' +
    '</svg>';

  const popupCard = document.createElement('div');
  popupCard.id = 'ygt-popup-card';
  popupCard.innerHTML =
    '<div id="ygt-popup-header">' +
      '<span id="ygt-popup-title">a little reminder</span>' +
      '<button id="ygt-close-btn" aria-label="Close">&#10005;</button>' +
    '</div>' +
    '<p id="ygt-msg-text">Click the heart again for a new one</p>' +
    '<div id="ygt-playing-note">' +
      '<span class="ygt-dot"></span>' +
      '<span id="ygt-playing-label"></span>' +
    '</div>';

  document.documentElement.appendChild(dockTab);
  document.documentElement.appendChild(popupCard);

  const msgTextEl = popupCard.querySelector('#ygt-msg-text');
  const closeBtn = popupCard.querySelector('#ygt-close-btn');
  const dot = popupCard.querySelector('.ygt-dot');
  const playingLabel = popupCard.querySelector('#ygt-playing-label');

  let lastIndex = -1;
  let autoCloseTimer = null;

  function setPlaying(isPlaying) {
    if (isPlaying) {
      dot.classList.add('ygt-active');
      playingLabel.textContent = 'playing...';
    } else {
      dot.classList.remove('ygt-active');
      playingLabel.textContent = '';
    }
  }

  function showMessage() {
    let idx = Math.floor(Math.random() * messages.length);
    if (idx === lastIndex && messages.length > 1) idx = (idx + 1) % messages.length;
    lastIndex = idx;
    const msg = messages[idx];

    msgTextEl.textContent = msg.text;
    popupCard.classList.add('ygt-visible');

    playChime();
    setTimeout(() => playRealAudio(msg.id, () => {}), 300);

    clearTimeout(autoCloseTimer);
    autoCloseTimer = setTimeout(() => {
      popupCard.classList.remove('ygt-visible');
    }, 9000);
  }

  dockTab.addEventListener('click', () => {
    clearTimeout(autoCloseTimer);
    showMessage();
  });

  closeBtn.addEventListener('click', () => {
    clearTimeout(autoCloseTimer);
    popupCard.classList.remove('ygt-visible');
  });
})();
