/**
 * РОЗДІЛ 3. ГРАФІКА ТА МУЛЬТИМЕДІА ДЛЯ ВЕБСЕРЕДОВИЩА
 * Оптимізований функціонал та інтерактивні стенди
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. НАВІГАЦІЯ ТА МОБІЛЬНЕ МЕНЮ
     ========================================================================== */
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-item');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ScrollSpy для активних пунктів меню
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  const onScroll = () => {
    const scrollPos = window.pageYOffset + 120;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });

    // Кнопка прокрутки нагору
    const toTopBtn = document.getElementById('toTopBtn');
    if (toTopBtn) {
      if (window.scrollY > 350) {
        toTopBtn.classList.add('visible');
      } else {
        toTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  const toTopBtn = document.getElementById('toTopBtn');
  if (toTopBtn) {
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     2. 3.1 ГРАФІКА: КОМПАРАТОР МАСШТАБУВАННЯ
     ========================================================================== */
  const zoomSlider = document.getElementById('zoomSlider');
  const zoomDisplay = document.getElementById('zoomDisplay');
  const rasterView = document.getElementById('rasterView');
  const vectorView = document.getElementById('vectorView');
  const zoomReset = document.getElementById('zoomReset');

  const setZoom = (val) => {
    const scale = val / 100;
    zoomDisplay.textContent = `${val}%`;

    if (rasterView && vectorView) {
      rasterView.style.transform = `scale(${scale})`;
      vectorView.style.transform = `scale(${scale})`;

      if (val > 150) {
        rasterView.classList.add('zoomed');
      } else {
        rasterView.classList.remove('zoomed');
      }
    }
  };

  if (zoomSlider) {
    zoomSlider.addEventListener('input', (e) => setZoom(e.target.value));
  }

  if (zoomReset && zoomSlider) {
    zoomReset.addEventListener('click', () => {
      zoomSlider.value = 100;
      setZoom(100);
    });
  }

  /* ==========================================================================
     3. АНІМАЦІЇ: ІНТЕРАКТИВНИЙ МАЙДАНЧИК
     ========================================================================== */
  const choiceBtns = document.querySelectorAll('.choice-btn');
  const targetElement = document.getElementById('targetElement');
  const animSpeed = document.getElementById('animSpeed');
  const speedValue = document.getElementById('speedValue');
  const timingSelect = document.getElementById('timingSelect');
  const cssCodeSnippet = document.getElementById('cssCodeSnippet');
  const copyCssBtn = document.getElementById('copyCssBtn');
  const restartAnim = document.getElementById('restartAnim');

  const kfMap = {
    'rotate': `@keyframes rotateAnim {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`,
    'scale': `@keyframes scaleAnim {
  0% { transform: scale(0.8); }
  100% { transform: scale(1.2); }
}`,
    'translate': `@keyframes translateAnim {
  0% { transform: translateX(-40px); }
  100% { transform: translateX(40px); }
}`,
    'fade': `@keyframes fadeAnim {
  0% { opacity: 0.2; }
  100% { opacity: 1; }
}`,
    'skew': `@keyframes skewAnim {
  0% { transform: skewX(-15deg); }
  100% { transform: skewX(15deg); }
}`
  };

  let activeAnim = 'rotate';

  const updatePlayground = () => {
    if (!targetElement) return;

    const speed = animSpeed.value;
    const ease = timingSelect.value;
    speedValue.textContent = `${speed}s`;

    targetElement.style.setProperty('--speed', `${speed}s`);
    targetElement.style.setProperty('--ease', ease);

    targetElement.className = 'target-element';
    void targetElement.offsetWidth;
    targetElement.classList.add(`anim-${activeAnim}`);

    const cssText = `.element {
  animation: ${activeAnim}Anim ${speed}s ${ease} infinite;
}

${kfMap[activeAnim]}`;

    if (cssCodeSnippet) cssCodeSnippet.textContent = cssText;
  };

  choiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      choiceBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeAnim = btn.dataset.anim;
      updatePlayground();
    });
  });

  if (animSpeed) animSpeed.addEventListener('input', updatePlayground);
  if (timingSelect) timingSelect.addEventListener('change', updatePlayground);

  if (restartAnim) {
    restartAnim.addEventListener('click', () => {
      updatePlayground();
      showToast('Анімацію перезапущено');
    });
  }

  if (copyCssBtn && cssCodeSnippet) {
    copyCssBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(cssCodeSnippet.textContent).then(() => {
        showToast('CSS код скопійовано');
      });
    });
  }

  /* ==========================================================================
     4. МУЛЬТИМЕДІА: АУДІОСИНТЕЗАТОР (WEB AUDIO API)
     ========================================================================== */
  const toggleAudioBtn = document.getElementById('toggleAudioBtn');
  const audioVolume = document.getElementById('audioVolume');
  const audioMeter = document.getElementById('audioMeter');

  let audioCtx = null;
  let isAudioPlaying = false;
  let stepTimer = null;
  let gainNode = null;

  const startAudio = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(parseFloat(audioVolume.value), audioCtx.currentTime);
    gainNode.connect(audioCtx.destination);

    const freqs = [220, 277.18, 329.63, 440, 329.63, 277.18];
    let idx = 0;

    const tick = () => {
      if (!isAudioPlaying) return;

      const osc = audioCtx.createOscillator();
      const env = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freqs[idx], audioCtx.currentTime);

      env.gain.setValueAtTime(0, audioCtx.currentTime);
      env.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.04);
      env.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);

      osc.connect(env);
      env.connect(gainNode);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.32);

      idx = (idx + 1) % freqs.length;
      stepTimer = setTimeout(tick, 260);
    };

    isAudioPlaying = true;
    audioMeter.classList.add('active');
    toggleAudioBtn.textContent = 'Зупинити звук';
    tick();
  };

  const stopAudio = () => {
    isAudioPlaying = false;
    clearTimeout(stepTimer);
    if (audioMeter) audioMeter.classList.remove('active');
    if (toggleAudioBtn) toggleAudioBtn.textContent = 'Увімкнути звук';
  };

  if (toggleAudioBtn) {
    toggleAudioBtn.addEventListener('click', () => {
      if (isAudioPlaying) {
        stopAudio();
      } else {
        startAudio();
      }
    });
  }

  if (audioVolume) {
    audioVolume.addEventListener('input', (e) => {
      if (gainNode && audioCtx) {
        gainNode.gain.setValueAtTime(parseFloat(e.target.value), audioCtx.currentTime);
      }
    });
  }

  /* ==========================================================================
     5. МУЛЬТИМЕДІА: CANVAS ВІДЕОПЛЕЄР
     ========================================================================== */
  const canvas = document.getElementById('videoCanvas');
  const vidPlayBtn = document.getElementById('vidPlayBtn');
  const vidResetBtn = document.getElementById('vidResetBtn');
  const vidTimer = document.getElementById('vidTimer');
  const vidFill = document.getElementById('vidFill');
  const vidTrack = document.getElementById('vidTrack');
  const videoHud = document.getElementById('videoHud');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    const DURATION = 10;
    let time = 0;
    let isPlaying = false;
    let lastTime = 0;
    let rafId = null;

    const render = (t) => {
      const w = canvas.width;
      const h = canvas.height;

      // Фон
      ctx.fillStyle = '#060911';
      ctx.fillRect(0, 0, w, h);

      // Сітка
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.lineWidth = 1;
      const step = 30;
      for (let x = 0; x < w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Рухомий графічний елемент
      const cx = (w / 2) + Math.cos(t * 2) * 80;
      const cy = (h / 2) + Math.sin(t * 2.5) * 35;

      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Текстова інформація кадру
      ctx.fillStyle = '#94a3b8';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText(`STREAM: H.264 / VP9 • TC: ${t.toFixed(1)}s`, 16, 28);
    };

    const loop = (now) => {
      if (!isPlaying) return;

      if (!lastTime) lastTime = now;
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      time += delta;
      if (time >= DURATION) {
        time = DURATION;
        pause();
      }

      const pct = (time / DURATION) * 100;
      if (vidFill) vidFill.style.width = `${pct}%`;

      const s = Math.floor(time).toString().padStart(2, '0');
      if (vidTimer) vidTimer.textContent = `00:${s} / 00:10`;

      render(time);

      if (isPlaying) {
        rafId = requestAnimationFrame(loop);
      }
    };

    const play = () => {
      if (time >= DURATION) time = 0;
      isPlaying = true;
      lastTime = performance.now();
      if (vidPlayBtn) vidPlayBtn.textContent = 'Пауза';
      if (videoHud) videoHud.textContent = 'Відтворення';
      rafId = requestAnimationFrame(loop);
    };

    const pause = () => {
      isPlaying = false;
      if (vidPlayBtn) vidPlayBtn.textContent = 'Старт';
      if (videoHud) videoHud.textContent = time >= DURATION ? 'Кінець' : 'Пауза';
      if (rafId) cancelAnimationFrame(rafId);
    };

    if (vidPlayBtn) {
      vidPlayBtn.addEventListener('click', () => {
        if (isPlaying) pause(); else play();
      });
    }

    if (vidResetBtn) {
      vidResetBtn.addEventListener('click', () => {
        time = 0;
        if (vidFill) vidFill.style.width = '0%';
        if (vidTimer) vidTimer.textContent = '00:00 / 00:10';
        render(0);
        play();
      });
    }

    if (vidTrack) {
      vidTrack.addEventListener('click', (e) => {
        const rect = vidTrack.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        time = pos * DURATION;
        if (vidFill) vidFill.style.width = `${pos * 100}%`;
        render(time);
      });
    }

    render(0);
  }

  /* ==========================================================================
     6. ТОАСТ
     ========================================================================== */
  const toast = document.getElementById('toast');
  let tTimer = null;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(tTimer);
    tTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

});
