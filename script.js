/**
 * РОЗДІЛ 3. ГРАФІКА ТА МУЛЬТИМЕДІА ДЛЯ ВЕБСЕРЕДОВИЩА
 * Головний скрипт інтерактивності (Vanilla JavaScript ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. НАВІГАЦІЯ ТА МОБІЛЬНЕ МЕНЮ (DRAWER)
     ========================================================================== */
  const mobileToggle = document.getElementById('mobileToggle');
  const drawerClose = document.getElementById('drawerClose');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerBackdrop = document.getElementById('drawerBackdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  const openDrawer = () => {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Підсвічування активних посилань при прокручуванні (ScrollSpy)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

  /* ==========================================================================
     2. КНОПКА ПРОКРУТКИ НАВЕРХ ТА ПЛАВНИЙ СКРОЛ
     ========================================================================== */
  const scrollTopBtn = document.getElementById('scrollTopBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Обробка кнопки "На головну"
  const homeButtons = document.querySelectorAll('.btn-to-home');
  homeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  });

  /* ==========================================================================
     3. ТЕМА 3.1: ІНТЕРАКТИВНИЙ КОМПАРАТОР РАСТР VS ВЕКТОР (SVG)
     ========================================================================== */
  const zoomRange = document.getElementById('zoomRange');
  const zoomVal = document.getElementById('zoomVal');
  const rasterSample = document.getElementById('rasterSample');
  const vectorSample = document.getElementById('vectorSample');
  const resetZoomBtn = document.getElementById('resetZoomBtn');

  const updateZoom = (value) => {
    const scale = value / 100;
    zoomVal.textContent = `${value}%`;

    if (rasterSample && vectorSample) {
      rasterSample.style.transform = `scale(${scale})`;
      vectorSample.style.transform = `scale(${scale})`;

      if (value > 150) {
        rasterSample.classList.add('zoomed');
      } else {
        rasterSample.classList.remove('zoomed');
      }
    }
  };

  if (zoomRange) {
    zoomRange.addEventListener('input', (e) => {
      updateZoom(e.target.value);
    });
  }

  if (resetZoomBtn && zoomRange) {
    resetZoomBtn.addEventListener('click', () => {
      zoomRange.value = 100;
      updateZoom(100);
    });
  }

  /* ==========================================================================
     4. ПРАКТИЧНА РОБОТА №7: ІНТЕРАКТИВНИЙ SVG-ГЕНЕРАТОР
     ========================================================================== */
  const svgColorPicker = document.getElementById('svgColorPicker');
  const svgRadiusSlider = document.getElementById('svgRadiusSlider');
  const svgStrokeSlider = document.getElementById('svgStrokeSlider');
  const svgDynamicRect = document.getElementById('svgDynamicRect');
  const svgCodeOutput = document.getElementById('svgCodeOutput');

  const updateSvgPreview = () => {
    if (!svgDynamicRect || !svgCodeOutput) return;

    const color = svgColorPicker.value;
    const radius = svgRadiusSlider.value;
    const strokeWidth = svgStrokeSlider.value;

    svgDynamicRect.setAttribute('fill', color);
    svgDynamicRect.setAttribute('rx', radius);
    svgDynamicRect.setAttribute('stroke-width', strokeWidth);

    const generatedSnippet = `<rect x="15" y="15" width="70" height="70" rx="${radius}" fill="${color}" stroke="#ffffff" stroke-width="${strokeWidth}" />`;
    svgCodeOutput.textContent = generatedSnippet;
  };

  if (svgColorPicker) svgColorPicker.addEventListener('input', updateSvgPreview);
  if (svgRadiusSlider) svgRadiusSlider.addEventListener('input', updateSvgPreview);
  if (svgStrokeSlider) svgStrokeSlider.addEventListener('input', updateSvgPreview);

  /* ==========================================================================
     5. СЕКЦІЯ АНІМАЦІЙ: ІНТЕРАКТИВНИЙ МАЙДАНЧИК ТА CSS ГЕНЕРАТОР
     ========================================================================== */
  const animButtons = document.querySelectorAll('.anim-btn');
  const animatedActor = document.getElementById('animatedActor');
  const animDuration = document.getElementById('animDuration');
  const durationVal = document.getElementById('durationVal');
  const animTiming = document.getElementById('animTiming');
  const animCssCode = document.getElementById('animCssCode');
  const copyAnimCss = document.getElementById('copyAnimCss');
  const replayAnimBtn = document.getElementById('replayAnimBtn');

  // Описи ключових кадрів для генератора коду
  const keyframeDescriptions = {
    'rotate': `@keyframes rotateAnim {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`,
    'fade-slide': `@keyframes fadeSlideAnim {
  0% { opacity: 0.15; transform: translateY(30px) scale(0.85); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}`,
    'translate': `@keyframes translateAnim {
  0% { transform: translateX(-60px); }
  100% { transform: translateX(60px); }
}`,
    'scale': `@keyframes scalePulseAnim {
  0% { transform: scale(0.8); }
  100% { transform: scale(1.25); box-shadow: 0 0 50px rgba(6,182,212,0.4); }
}`,
    'color-shift': `@keyframes colorShiftAnim {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(280deg); }
}`,
    'bounce': `@keyframes bounceAnim {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-40px); }
}`,
    'hover-3d': `@keyframes tilt3dAnim {
  0% { transform: rotateX(25deg) rotateY(-25deg); }
  100% { transform: rotateX(-25deg) rotateY(25deg); }
}`
  };

  let currentAnimType = 'rotate';

  const updateAnimationState = () => {
    if (!animatedActor) return;

    const duration = animDuration.value;
    const timing = animTiming.value;
    durationVal.textContent = `${duration}s`;

    animatedActor.style.setProperty('--anim-dur', `${duration}s`);
    animatedActor.style.setProperty('--anim-ease', timing);

    // Оновлюємо клас анімації
    animatedActor.className = 'animated-actor';
    // Невеликий трюк для перезапуску reflow
    void animatedActor.offsetWidth;
    animatedActor.classList.add(`anim-${currentAnimType}`);

    // Оновлюємо згенерований CSS код
    const kf = keyframeDescriptions[currentAnimType] || '';
    const generatedCSS = `.animated-actor {
  animation: ${currentAnimType}Anim ${duration}s ${timing} infinite;
}

${kf}`;
    if (animCssCode) animCssCode.textContent = generatedCSS;
  };

  animButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      animButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentAnimType = btn.dataset.anim;
      updateAnimationState();
    });
  });

  if (animDuration) {
    animDuration.addEventListener('input', updateAnimationState);
  }

  if (animTiming) {
    animTiming.addEventListener('change', updateAnimationState);
  }

  if (replayAnimBtn) {
    replayAnimBtn.addEventListener('click', () => {
      updateAnimationState();
      showToast('Анімацію перезапущено!');
    });
  }

  if (copyAnimCss) {
    copyAnimCss.addEventListener('click', () => {
      if (animCssCode) {
        navigator.clipboard.writeText(animCssCode.textContent).then(() => {
          showToast('CSS код анімації скопійовано!');
        });
      }
    });
  }

  /* ==========================================================================
     6. СЕКЦІЯ МУЛЬТИМЕДІА: ЖИВИЙ АУДІОСИНТЕЗАТОР (WEB AUDIO API)
     ========================================================================== */
  const playAudioBtn = document.getElementById('playAudioBtn');
  const audioPlayIcon = document.getElementById('audioPlayIcon');
  const audioVolumeSlider = document.getElementById('audioVolumeSlider');
  const audioVisualizer = document.getElementById('audioVisualizer');

  let audioCtx = null;
  let isPlayingAudio = false;
  let audioTimer = null;
  let masterGain = null;

  const startAudioSynth = () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(parseFloat(audioVolumeSlider.value), audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);

    // Мелодійна арпеджіо-послідовність (ноти в Гц)
    const notes = [261.63, 329.63, 392.00, 523.25, 440.00, 392.00, 329.63];
    let noteIndex = 0;

    const playNextNote = () => {
      if (!isPlayingAudio) return;

      const osc = audioCtx.createOscillator();
      const noteGain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[noteIndex], audioCtx.currentTime);

      noteGain.gain.setValueAtTime(0, audioCtx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

      osc.connect(noteGain);
      noteGain.connect(masterGain);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.38);

      noteIndex = (noteIndex + 1) % notes.length;
      audioTimer = setTimeout(playNextNote, 280);
    };

    isPlayingAudio = true;
    audioVisualizer.classList.add('playing');
    audioPlayIcon.textContent = '⏸ Зупинити звук';
    playNextNote();
  };

  const stopAudioSynth = () => {
    isPlayingAudio = false;
    clearTimeout(audioTimer);
    audioVisualizer.classList.remove('playing');
    audioPlayIcon.textContent = '▶ Відтворити звук';
  };

  if (playAudioBtn) {
    playAudioBtn.addEventListener('click', () => {
      if (isPlayingAudio) {
        stopAudioSynth();
      } else {
        startAudioSynth();
      }
    });
  }

  if (audioVolumeSlider) {
    audioVolumeSlider.addEventListener('input', (e) => {
      if (masterGain && audioCtx) {
        masterGain.gain.setValueAtTime(parseFloat(e.target.value), audioCtx.currentTime);
      }
    });
  }

  /* ==========================================================================
     7. СЕКЦІЯ МУЛЬТИМЕДІА: CANVAS-ВІДЕОПЛЕЄР З КЕРУВАННЯМ
     ========================================================================== */
  const canvas = document.getElementById('videoSimCanvas');
  const toggleVideoBtn = document.getElementById('toggleVideoBtn');
  const restartVideoBtn = document.getElementById('restartVideoBtn');
  const videoProgressBar = document.getElementById('videoProgressBar');
  const videoProgressContainer = document.getElementById('videoProgressContainer');
  const videoTimeDisplay = document.getElementById('videoTimeDisplay');
  const videoStatusBadge = document.getElementById('videoStatusBadge');

  if (canvas) {
    const ctx = canvas.getContext('2d');
    const TOTAL_DURATION = 15; // 15 секунд відео
    let currentTime = 0;
    let isVideoPlaying = false;
    let animFrameId = null;
    let lastTimestamp = 0;

    // Рендер кадрів симуляції відео
    const drawVideoFrame = (time) => {
      const w = canvas.width;
      const h = canvas.height;

      // 1. Космічний кіберпанк фон
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, '#040714');
      bgGrad.addColorStop(1, '#0c162d');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Анімована цифрова сітка перспективи
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1;
      const gridOffset = (time * 40) % 40;

      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = gridOffset; y < h; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 3. Рухома енергетична сфера
      const sphereX = (w / 2) + Math.cos(time * 1.5) * 100;
      const sphereY = (h / 2) + Math.sin(time * 2) * 40;
      const sphereRadius = 35 + Math.sin(time * 3) * 8;

      const sphereGrad = ctx.createRadialGradient(sphereX, sphereY, 5, sphereX, sphereY, sphereRadius);
      sphereGrad.addColorStop(0, '#ffffff');
      sphereGrad.addColorStop(0.3, '#38bdf8');
      sphereGrad.addColorStop(0.7, '#8b5cf6');
      sphereGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(sphereX, sphereY, sphereRadius, 0, Math.PI * 2);
      ctx.fill();

      // 4. Текстова інформаційна графіка кадру
      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 15px "JetBrains Mono", monospace';
      ctx.fillText('HTML5 VIDEO STREAM SIMULATOR', 24, 35);

      ctx.fillStyle = 'rgba(148, 163, 184, 0.9)';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText(`FRAME TIMECODE: ${time.toFixed(2)}s / ${TOTAL_DURATION}.00s`, 24, 58);
      ctx.fillText('RESOLUTION: 1080p FHD • CODEC: H.264 / AV1', 24, 78);

      // 5. Пульсуючий маркер запису
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(w - 35, 30, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '11px sans-serif';
      ctx.fillText('REC', w - 65, 34);
    };

    const updateVideoLoop = (timestamp) => {
      if (!isVideoPlaying) return;

      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      currentTime += delta;
      if (currentTime >= TOTAL_DURATION) {
        currentTime = TOTAL_DURATION;
        pauseVideo();
      }

      // Оновлюємо UI
      const progressPercent = (currentTime / TOTAL_DURATION) * 100;
      videoProgressBar.style.width = `${progressPercent}%`;

      const curSec = Math.floor(currentTime).toString().padStart(2, '0');
      const totSec = TOTAL_DURATION.toString().padStart(2, '0');
      videoTimeDisplay.textContent = `00:${curSec} / 00:${totSec}`;

      drawVideoFrame(currentTime);

      if (isVideoPlaying) {
        animFrameId = requestAnimationFrame(updateVideoLoop);
      }
    };

    const playVideo = () => {
      if (currentTime >= TOTAL_DURATION) currentTime = 0;
      isVideoPlaying = true;
      lastTimestamp = performance.now();
      toggleVideoBtn.textContent = '⏸ Пауза';
      videoStatusBadge.textContent = 'Відтворення...';
      animFrameId = requestAnimationFrame(updateVideoLoop);
    };

    const pauseVideo = () => {
      isVideoPlaying = false;
      toggleVideoBtn.textContent = '▶ Відтворити';
      videoStatusBadge.textContent = currentTime >= TOTAL_DURATION ? 'Завершено' : 'Пауза';
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };

    if (toggleVideoBtn) {
      toggleVideoBtn.addEventListener('click', () => {
        if (isVideoPlaying) {
          pauseVideo();
        } else {
          playVideo();
        }
      });
    }

    if (restartVideoBtn) {
      restartVideoBtn.addEventListener('click', () => {
        currentTime = 0;
        videoProgressBar.style.width = '0%';
        videoTimeDisplay.textContent = `00:00 / 00:${TOTAL_DURATION.toString().padStart(2, '0')}`;
        drawVideoFrame(0);
        playVideo();
      });
    }

    if (videoProgressContainer) {
      videoProgressContainer.addEventListener('click', (e) => {
        const rect = videoProgressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        currentTime = (clickX / width) * TOTAL_DURATION;
        const progressPercent = (currentTime / TOTAL_DURATION) * 100;
        videoProgressBar.style.width = `${progressPercent}%`;
        const curSec = Math.floor(currentTime).toString().padStart(2, '0');
        videoTimeDisplay.textContent = `00:${curSec} / 00:${TOTAL_DURATION.toString().padStart(2, '0')}`;
        drawVideoFrame(currentTime);
      });
    }

    // Початковий перший кадр
    drawVideoFrame(0);
  }

  /* ==========================================================================
     8. МОДАЛЬНЕ ВІКНО «ВИКОНАТИ ЗАВДАННЯ» (ПРАКТИЧНІ 7, 8, 9)
     ========================================================================== */
  const taskModal = document.getElementById('taskModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalDismissBtn = document.getElementById('modalDismissBtn');
  const modalConfirmBtn = document.getElementById('modalConfirmBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalChecklist = document.getElementById('modalChecklist');
  const gradePill = document.getElementById('gradePill');
  const executeBtns = document.querySelectorAll('.btn-execute');

  const practicalData = {
    '7': {
      title: 'Практична робота №7: Графіка для вебсередовища',
      desc: 'Звіт про виконання практичного завдання з адаптивної та векторної графіки.',
      criteria: [
        'Створено та підключено інлайновий SVG-код геометричної фігури',
        'Сформовано адаптивний контейнер <picture> з різними джерелами WebP та JPG',
        'Додано коректний атрибут alt для доступності скрінрідерів',
        'Налаштовано відкладене завантаження за допомогою loading="lazy"'
      ],
      grade: '12 / 12 балів (Відмінно)'
    },
    '8': {
      title: 'Практична робота №8: Анімаційні ефекти',
      desc: 'Звіт про виконання практичного завдання зі створення інтерактивних CSS-анімацій.',
      criteria: [
        'Реалізовано плавний перехід властивостей transition (:hover ефекти)',
        'Застосовано трансформації transform (translate, scale, rotate) для GPU-акселерації',
        'Розроблено сценарій @keyframes для безперервної пульсації та спінера',
        'Перевірено відсутність перевантаження процесора (smooth 60 FPS)'
      ],
      grade: '12 / 12 балів (Відмінно)'
    },
    '9': {
      title: 'Практична робота №9: Мультимедіа на вебсторінках',
      desc: 'Звіт про виконання практичного завдання з інтеграції аудіо, відео та віджетів.',
      criteria: [
        'Вбудовано тег <audio> з панеллю елементів керування controls',
        'Розгорнуто блок <video> з початковою заставкою poster та субтитрами',
        'Забезпечено кросбраузерне відтворення за допомогою декількох <source>',
        'Інтегровано безпечний віджет через <iframe> з атрибутом sandbox'
      ],
      grade: '12 / 12 балів (Відмінно)'
    }
  };

  const openTaskModal = (workId) => {
    const data = practicalData[workId] || practicalData['7'];

    modalTitle.textContent = data.title;
    modalDescription.textContent = data.desc;
    gradePill.textContent = data.grade;

    modalChecklist.innerHTML = '';
    data.criteria.forEach(item => {
      const row = document.createElement('div');
      row.className = 'modal-check-item';
      row.innerHTML = `<span class="check-icon-ok">✓</span> <span>${item}</span>`;
      modalChecklist.appendChild(row);
    });

    taskModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeTaskModal = () => {
    taskModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  executeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const workId = btn.dataset.work;
      openTaskModal(workId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeTaskModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener('click', closeTaskModal);
  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', () => {
      closeTaskModal();
      showToast('🎉 Звіт збережено! Роботу зараховано на відмінно!');
    });
  }

  // Закриття модалки по кліку на оверлей
  if (taskModal) {
    taskModal.addEventListener('click', (e) => {
      if (e.target === taskModal) {
        closeTaskModal();
      }
    });
  }

  /* ==========================================================================
     9. КОПІЮВАННЯ ПРИКЛАДІВ КОДУ ТА СИСТЕМА СПОВІЩЕНЬ (TOAST)
     ========================================================================== */
  const toast = document.getElementById('toastNotification');
  let toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  const copyButtons = document.querySelectorAll('.copy-code-btn');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.dataset.copy;
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy.replace(/\\n/g, '\n')).then(() => {
          showToast('Код успішно скопійовано в буфер обміну!');
        }).catch(() => {
          showToast('Не вдалося скопіювати код');
        });
      }
    });
  });

});
