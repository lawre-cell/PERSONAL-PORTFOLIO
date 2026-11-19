/**
 * LAWRENCE PORTFOLIO // MAIN APPLICATION
 * Inspired by haoqi.design — Retro-Futurist Datasheet & Studio Notebook Architecture
 */

// Project Database (Clean placeholders ready for Lawrence to fill)
const PROJECTS_DATA = [
  {
    code: 'PROJ-01',
    title: '[ Project 01 Title ]',
    category: 'all',
    domain: '[ Project Domain / Field ]',
    stack: ['[ Stack 1 ]', '[ Stack 2 ]', '[ Stack 3 ]'],
    year: '2026',
    status: 'prod',
    statusLabel: 'Production',
    summary: '[ Enter your project summary and description here. Ready for your own text. ]',
    github: 'https://github.com/Lawrence-cell',
    features: [
      '[ Key feature or achievement 01 ]',
      '[ Key feature or achievement 02 ]',
      '[ Key feature or achievement 03 ]'
    ],
    architecture: '[ Architecture and implementation details here. ]',
    metrics: '[ Key performance metrics or benchmarks here. ]'
  },
  {
    code: 'PROJ-02',
    title: '[ Project 02 Title ]',
    category: 'all',
    domain: '[ Project Domain / Field ]',
    stack: ['[ Stack 1 ]', '[ Stack 2 ]', '[ Stack 3 ]'],
    year: '2026',
    status: 'oss',
    statusLabel: 'Open Source',
    summary: '[ Enter your project summary and description here. Ready for your own text. ]',
    github: 'https://github.com/Lawrence-cell',
    features: [
      '[ Key feature or achievement 01 ]',
      '[ Key feature or achievement 02 ]'
    ],
    architecture: '[ Architecture and implementation details here. ]',
    metrics: '[ Key performance metrics or benchmarks here. ]'
  },
  {
    code: 'PROJ-03',
    title: '[ Project 03 Title ]',
    category: 'all',
    domain: '[ Project Domain / Field ]',
    stack: ['[ Stack 1 ]', '[ Stack 2 ]'],
    year: '2025',
    status: 'prod',
    statusLabel: 'Production',
    summary: '[ Enter your project summary and description here. Ready for your own text. ]',
    github: 'https://github.com/Lawrence-cell',
    features: [
      '[ Key feature or achievement 01 ]',
      '[ Key feature or achievement 02 ]'
    ],
    architecture: '[ Architecture and implementation details here. ]',
    metrics: '[ Key performance metrics or benchmarks here. ]'
  },
  {
    code: 'PROJ-04',
    title: '[ Project 04 Title ]',
    category: 'all',
    domain: '[ Project Domain / Field ]',
    stack: ['[ Stack 1 ]', '[ Stack 2 ]'],
    year: '2025',
    status: 'exp',
    statusLabel: 'Experimental',
    summary: '[ Enter your project summary and description here. Ready for your own text. ]',
    github: 'https://github.com/Lawrence-cell',
    features: [
      '[ Key feature or achievement 01 ]',
      '[ Key feature or achievement 02 ]'
    ],
    architecture: '[ Architecture and implementation details here. ]',
    metrics: '[ Key performance metrics or benchmarks here. ]'
  }
];

class PortfolioApp {
  constructor() {
    this.currentView = 'table'; // 'table' or 'grid'
    this.currentFilter = 'all';
    this.isMuted = false;

    this.initClock();
    this.initTheme();
    this.initProjector();
    this.initAudioToggle();
    this.initBackgroundMusic();
    this.initCustomCursor();
    this.initViewToggles();
    this.initFilters();
    this.renderProjects();
    this.initHoverPreview();
    this.initProjectModal();
    this.initTerminal();
    this.initContactActions();
    this.initMobileNav();
    this.initTabNavigation();
  }

  /* ========================================================================
     1. LIVE CLOCK & TELEMETRY
     ======================================================================== */
  initClock() {
    const clockEl = document.getElementById('liveClock');
    const updateTime = () => {
      const now = new Date();
      // Format: ACCRA / UTC+0 HH:MM:SS
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      if (clockEl) {
        clockEl.textContent = `UTC+0 ${hours}:${mins}:${secs}`;
      }
    };
    updateTime();
    setInterval(updateTime, 1000);
  }

  /* ========================================================================
     2. THEME SWITCHER
     ======================================================================== */
  initTheme() {
    const themeBtn = document.getElementById('themeToggleBtn');
    const savedTheme = localStorage.getItem('lawrence_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateThemeButtonLabel(savedTheme);

    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('lawrence_theme', next);
        this.updateThemeButtonLabel(next);

        if (window.soundEngine) {
          window.soundEngine.playChirp(next === 'dark' ? 600 : 900, next === 'dark' ? 300 : 1200, 0.08);
        }
      });
    }
  }

  updateThemeButtonLabel(theme) {
    const themeBtn = document.getElementById('themeToggleBtn');
    if (!themeBtn) return;
    themeBtn.innerHTML = theme === 'light' 
      ? '<span class="pulse-dot" style="background:#0077b6;"></span> LIGHT' 
      : '<span class="pulse-dot"></span> DARK';
  }

  /* ========================================================================
     2.5. PROJECTED SCREEN BACKGROUND SYSTEM
     ======================================================================== */
  initProjector() {
    const layer = document.getElementById('projectorLayer');
    const video = document.getElementById('bgVideoPlayer');
    const toggleBtn = document.getElementById('projectorToggleBtn');
    const switchBtn = document.getElementById('switchFeedBtn');

    if (!layer || !video) return;

    // Available feeds
    this.projectorFeeds = [
      'assets/videos/background-feed.mp4',
      'assets/videos/feed-alt.mp4'
    ];
    this.currentFeedIndex = 0;

    // Modes: 'ambient' -> 'vivid' -> 'off'
    this.projectorModes = ['ambient', 'vivid', 'off'];
    const savedMode = localStorage.getItem('lawrence_projector_mode') || 'ambient';
    this.currentProjectorMode = savedMode;
    this.applyProjectorMode(this.currentProjectorMode);

    // Auto-play safety
    const startPlay = () => {
      video.play().catch(() => {
        const resumeOnTouch = () => {
          video.play();
          window.removeEventListener('click', resumeOnTouch);
          window.removeEventListener('keydown', resumeOnTouch);
        };
        window.addEventListener('click', resumeOnTouch);
        window.addEventListener('keydown', resumeOnTouch);
      });
    };
    startPlay();

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const nextIdx = (this.projectorModes.indexOf(this.currentProjectorMode) + 1) % this.projectorModes.length;
        this.currentProjectorMode = this.projectorModes[nextIdx];
        localStorage.setItem('lawrence_projector_mode', this.currentProjectorMode);
        this.applyProjectorMode(this.currentProjectorMode);

        if (window.soundEngine) {
          window.soundEngine.playChirp(700, 1100, 0.07);
        }
      });
    }

    if (switchBtn) {
      switchBtn.addEventListener('click', () => {
        this.switchProjectorFeed();
      });
    }
  }

  applyProjectorMode(mode) {
    const layer = document.getElementById('projectorLayer');
    const toggleBtn = document.getElementById('projectorToggleBtn');
    if (!layer) return;

    layer.classList.remove('mode-vivid', 'mode-subtle', 'mode-off');

    if (mode === 'vivid') {
      layer.classList.add('mode-vivid');
      if (toggleBtn) toggleBtn.innerHTML = '<span class="pulse-dot" style="background:var(--accent-amber);"></span> PROJ: VIVID';
    } else if (mode === 'off') {
      layer.classList.add('mode-off');
      if (toggleBtn) toggleBtn.innerHTML = '<span style="color:var(--text-muted);">○</span> PROJ: OFF';
    } else {
      // ambient / standard
      if (toggleBtn) toggleBtn.innerHTML = '<span class="pulse-dot" style="background:var(--accent-cyan);"></span> PROJ: ON';
    }
  }

  switchProjectorFeed() {
    const video = document.getElementById('bgVideoPlayer');
    const switchLabel = document.getElementById('switchFeedLabel');
    if (!video) return;

    this.currentFeedIndex = (this.currentFeedIndex + 1) % this.projectorFeeds.length;
    const newSrc = this.projectorFeeds[this.currentFeedIndex];

    video.src = newSrc;
    video.play().catch(() => {});

    const labelText = `FEED: 0${this.currentFeedIndex + 1}`;
    if (switchLabel) switchLabel.textContent = labelText;

    this.showToast(`PROJECTION SOURCE UPDATED // ${labelText}`);

    if (window.soundEngine) {
      window.soundEngine.playChirp(520, 960, 0.08);
    }
  }

  /* ========================================================================
     3. AUDIO SFX TOGGLE
     ======================================================================== */
  initAudioToggle() {
    const sfxBtn = document.getElementById('sfxToggleBtn');
    if (!sfxBtn) return;

    const updateLabel = (enabled) => {
      sfxBtn.innerHTML = enabled
        ? '<span style="color:var(--accent-cyan);">●</span> SFX: ON'
        : '<span style="color:var(--text-muted);">○</span> SFX: OFF';
      if (enabled) sfxBtn.classList.add('active');
      else sfxBtn.classList.remove('active');
    };

    updateLabel(window.soundEngine.enabled);

    sfxBtn.addEventListener('click', () => {
      const enabled = window.soundEngine.toggle();
      updateLabel(enabled);
    });
  }

  /* ========================================================================
     3.5. BACKGROUND INSTRUMENTAL MUSIC (AUTOMATIC PLAYBACK AT MAX LOUDNESS)
     ======================================================================== */
  initBackgroundMusic() {
    const audio = document.getElementById('bgMusicPlayer');
    const visualizer = document.getElementById('bgmVisualizer');
    const btnLabel = document.getElementById('bgmBtnLabel');
    if (!audio) return;

    // Restore saved playback position for seamless cross-page playback
    try {
      const savedTime = parseFloat(sessionStorage.getItem('bgm_playback_time'));
      if (savedTime && !isNaN(savedTime) && isFinite(savedTime)) {
        audio.currentTime = savedTime;
      }
    } catch (e) {}

    // Initialize Web Audio graph for maximum loudness
    window.soundEngine.initBgm(audio);

    const updateUI = () => {
      const isPlaying = window.soundEngine.isBgmPlaying();
      if (isPlaying) {
        if (visualizer) visualizer.classList.remove('paused');
        if (btnLabel) btnLabel.textContent = 'AUDIO: LIVE [100%]';
      }
      try {
        if (!audio.paused && audio.currentTime > 0) {
          sessionStorage.setItem('bgm_playback_time', audio.currentTime.toString());
        }
      } catch (e) {}
    };

    audio.addEventListener('play', updateUI);
    audio.addEventListener('playing', updateUI);

    // Initial check and periodic position save
    setInterval(updateUI, 500);
  }

  /* ========================================================================
     4. CUSTOM CURSOR
     ======================================================================== */
  initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    const cursorLabel = document.getElementById('cursorLabel');
    if (!cursor) return;

    let mouseX = -100, mouseY = -100;
    let currX = -100, currY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const renderCursor = () => {
      currX += (mouseX - currX) * 0.22;
      currY += (mouseY - currY) * 0.22;
      cursor.style.transform = `translate3d(${currX}px, ${currY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    // Contextual hover states
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('[data-cursor]');
      if (target) {
        const label = target.getAttribute('data-cursor') || 'VIEW';
        cursor.classList.add('hovering');
        if (cursorLabel) cursorLabel.textContent = label;
      } else if (e.target.closest('button, a, .interactive-sticker, .datasheet-row')) {
        cursor.classList.add('hovering');
        if (cursorLabel) cursorLabel.textContent = 'INTERACT';
      } else {
        cursor.classList.remove('hovering');
      }
    });
  }

  /* ========================================================================
     5. VIEW TOGGLES (DATASHEET vs SPECIMEN GRID)
     ======================================================================== */
  initViewToggles() {
    const tableBtn = document.getElementById('viewTableBtn');
    const gridBtn = document.getElementById('viewGridBtn');
    const tableContainer = document.getElementById('datasheetContainer');
    const gridContainer = document.getElementById('specimenGridContainer');

    if (!tableBtn || !gridBtn) return;

    tableBtn.addEventListener('click', () => {
      if (this.currentView === 'table') return;
      this.currentView = 'table';
      tableBtn.classList.add('active');
      gridBtn.classList.remove('active');
      tableContainer.style.display = 'block';
      gridContainer.style.display = 'none';
      if (window.soundEngine) window.soundEngine.playClick();
    });

    gridBtn.addEventListener('click', () => {
      if (this.currentView === 'grid') return;
      this.currentView = 'grid';
      gridBtn.classList.add('active');
      tableBtn.classList.remove('active');
      tableContainer.style.display = 'none';
      gridContainer.style.display = 'grid';
      if (window.soundEngine) window.soundEngine.playClick();
    });
  }

  /* ========================================================================
     6. CATEGORY FILTERS
     ======================================================================== */
  initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentFilter = btn.getAttribute('data-filter');
        this.renderProjects();
        if (window.soundEngine) window.soundEngine.playClick();
      });
    });
  }

  /* ========================================================================
     7. RENDER PROJECTS (TABLE + GRID)
     ======================================================================== */
  renderProjects() {
    const filtered = PROJECTS_DATA.filter(p => {
      if (this.currentFilter === 'all') return true;
      return p.category === this.currentFilter;
    });

    // Render Table Rows
    const tbody = document.getElementById('datasheetTableBody');
    if (tbody) {
      tbody.innerHTML = filtered.map(p => `
        <tr class="datasheet-row" data-code="${p.code}" data-cursor="DOSSIER">
          <td class="datasheet-code">${p.code}</td>
          <td class="datasheet-title">
            <span class="scramble-hover" data-scramble>${p.title}</span>
          </td>
          <td class="datasheet-domain font-mono">${p.domain}</td>
          <td class="datasheet-stack">
            ${p.stack.map(s => `<span class="tag-pill">${s}</span>`).join('')}
          </td>
          <td class="datasheet-year">${p.year}</td>
          <td>
            <span class="datasheet-status status-${p.status}">● ${p.statusLabel}</span>
          </td>
          <td class="datasheet-action">
            <span class="action-link">VIEW SPEC →</span>
          </td>
        </tr>
      `).join('');
    }

    // Render Grid Cards
    const gridContainer = document.getElementById('specimenGridContainer');
    if (gridContainer) {
      gridContainer.innerHTML = filtered.map(p => `
        <div class="specimen-card" data-code="${p.code}" data-cursor="EXPLORE">
          <div class="specimen-header">
            <span class="datasheet-code">${p.code}</span>
            <span class="datasheet-status status-${p.status}">● ${p.statusLabel}</span>
          </div>
          <div class="specimen-canvas-wrap">
            <canvas class="card-mini-canvas" data-canvas-code="${p.code}"></canvas>
          </div>
          <div class="specimen-body">
            <h3 class="specimen-title">${p.title}</h3>
            <p class="specimen-desc">${p.summary}</p>
            <div class="specimen-tags">
              ${p.stack.map(s => `<span class="tag-pill">${s}</span>`).join('')}
            </div>
            <div class="specimen-footer">
              <span class="font-mono" style="font-size:11px; color:var(--text-muted);">${p.year} // ${p.domain}</span>
              <span class="action-link">DETAILS →</span>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Re-initialize scramble and mini canvases
    if (window.initScrambleEffects) window.initScrambleEffects();
    this.renderMiniCanvases();
  }

  renderMiniCanvases() {
    const canvases = document.querySelectorAll('.card-mini-canvas');
    canvases.forEach(canvas => {
      const ctx = canvas.getContext('2d');
      const w = canvas.width = canvas.parentElement.clientWidth;
      const h = canvas.height = canvas.parentElement.clientHeight;

      ctx.fillStyle = '#070b12';
      ctx.fillRect(0, 0, w, h);

      // Draw high-tech wireframe schematic preview
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
      ctx.lineWidth = 1;

      for (let x = 0; x < w; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Draw central wave / technical glyph
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < w; i += 4) {
        const y = h/2 + Math.sin(i * 0.05) * 24 * Math.cos(i * 0.01);
        if (i === 0) ctx.moveTo(i, y);
        else ctx.lineTo(i, y);
      }
      ctx.stroke();

      // Corner technical markers
      ctx.fillStyle = '#6366f1';
      ctx.fillRect(12, 12, 6, 6);
      ctx.fillRect(w - 18, h - 18, 6, 6);
    });
  }

  /* ========================================================================
     8. FLOATING HOVER PREVIEW CARD
     ======================================================================== */
  initHoverPreview() {
    const card = document.getElementById('hoverPreviewCard');
    const previewTitle = document.getElementById('hoverPreviewTitle');
    const previewDesc = document.getElementById('hoverPreviewDesc');
    const previewCanvas = document.getElementById('hoverPreviewCanvas');
    if (!card) return;

    let targetX = 0, targetY = 0;
    let currX = 0, currY = 0;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    const updatePosition = () => {
      currX += (targetX - currX) * 0.2;
      currY += (targetY - currY) * 0.2;

      // Keep within viewport boundaries
      const cardW = 280;
      const cardH = 220;
      let posX = currX + 20;
      let posY = currY + 20;

      if (posX + cardW > window.innerWidth) posX = currX - cardW - 20;
      if (posY + cardH > window.innerHeight) posY = currY - cardH - 20;

      card.style.left = `${posX}px`;
      card.style.top = `${posY}px`;

      requestAnimationFrame(updatePosition);
    };
    updatePosition();

    document.addEventListener('mouseover', (e) => {
      const row = e.target.closest('.datasheet-row');
      if (row && this.currentView === 'table') {
        const code = row.getAttribute('data-code');
        const project = PROJECTS_DATA.find(p => p.code === code);
        if (project) {
          if (previewTitle) previewTitle.textContent = `${project.code}: ${project.title}`;
          if (previewDesc) previewDesc.textContent = project.summary;
          card.classList.add('visible');
          this.drawHoverCardCanvas(previewCanvas, project);
        }
      } else if (!e.target.closest('#hoverPreviewCard')) {
        card.classList.remove('visible');
      }
    });
  }

  drawHoverCardCanvas(canvas, project) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.parentElement.clientWidth;
    const h = canvas.height = canvas.parentElement.clientHeight;

    ctx.fillStyle = '#06090e';
    ctx.fillRect(0, 0, w, h);

    // Dynamic grid & technical telemetry
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.stroke();
    }

    // Animated RF pulse
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < w; x++) {
      const y = h/2 + Math.sin(x * 0.08) * 16 * Math.sin(x * 0.02);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px JetBrains Mono';
    ctx.fillText(`ID: ${project.code} // DOMAIN: ${project.domain}`, 12, 24);
    ctx.fillText(`STATUS: ONLINE`, 12, h - 16);
  }

  /* ========================================================================
     9. PROJECT DOSSIER MODAL DRAWER
     ======================================================================== */
  initProjectModal() {
    const backdrop = document.getElementById('dossierModal');
    const closeBtn = document.getElementById('drawerCloseBtn');
    if (!backdrop) return;

    // Open on clicking any row or grid card
    document.addEventListener('click', (e) => {
      const target = e.target.closest('[data-code]');
      if (target) {
        const code = target.getAttribute('data-code');
        const project = PROJECTS_DATA.find(p => p.code === code);
        if (project) {
          this.openDossier(project);
        }
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeDossier());
    }

    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) this.closeDossier();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeDossier();
    });
  }

  openDossier(p) {
    const backdrop = document.getElementById('dossierModal');
    if (!backdrop) return;

    document.getElementById('drawerCode').textContent = p.code;
    document.getElementById('drawerTitle').textContent = p.title;
    document.getElementById('drawerDomain').textContent = p.domain;
    document.getElementById('drawerYear').textContent = p.year;
    document.getElementById('drawerStatus').textContent = p.statusLabel;
    document.getElementById('drawerSummary').textContent = p.summary;
    document.getElementById('drawerArchitecture').textContent = p.architecture;
    document.getElementById('drawerMetrics').textContent = p.metrics;
    document.getElementById('drawerGithub').href = p.github;

    const featContainer = document.getElementById('drawerFeatures');
    if (featContainer) {
      featContainer.innerHTML = p.features.map(f => `<li>${f}</li>`).join('');
    }

    const tagsContainer = document.getElementById('drawerStack');
    if (tagsContainer) {
      tagsContainer.innerHTML = p.stack.map(s => `<span class="tag-pill">${s}</span>`).join('');
    }

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';

    if (window.soundEngine) window.soundEngine.playClick();
  }

  closeDossier() {
    const backdrop = document.getElementById('dossierModal');
    if (!backdrop) return;
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    if (window.soundEngine) window.soundEngine.playClick();
  }

  /* ========================================================================
     10. EMBEDDED RETRO TERMINAL CONSOLE
     ======================================================================== */
  initTerminal() {
    const input = document.getElementById('terminalInput');
    const body = document.getElementById('terminalBody');
    if (!input || !body) return;

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = input.value.trim().toLowerCase();
        input.value = '';
        this.handleTerminalCommand(cmd, body);
        if (window.soundEngine) window.soundEngine.playClick();
      }
    });
  }

  handleTerminalCommand(cmd, body) {
    // Append user input line
    const userLine = document.createElement('div');
    userLine.className = 'terminal-line';
    userLine.innerHTML = `<span class="terminal-prompt">lawrence@sys:~$</span> ${cmd}`;
    body.appendChild(userLine);

    const outLine = document.createElement('div');
    outLine.className = 'terminal-line';

    switch (cmd) {
      case 'help':
        outLine.className += ' out-cyan';
        outLine.innerHTML = `
          AVAILABLE COMMANDS:<br>
          &nbsp;&nbsp;<strong>about</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Identity, biography & education<br>
          &nbsp;&nbsp;<strong>projects</strong>&nbsp;&nbsp;&nbsp;List registered engineering builds<br>
          &nbsp;&nbsp;<strong>team</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Collective mission & team roster<br>
          &nbsp;&nbsp;<strong>art</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Poetry anthology & visual gallery<br>
          &nbsp;&nbsp;<strong>skills</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Technical core matrix & disciplines<br>
          &nbsp;&nbsp;<strong>music</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Toggle background instrumental music<br>
          &nbsp;&nbsp;<strong>boost</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Maximize BGM loudness & dynamic gain<br>
          &nbsp;&nbsp;<strong>projector</strong>&nbsp;&nbsp;Toggle projected background video<br>
          &nbsp;&nbsp;<strong>feed</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Switch video projection feed<br>
          &nbsp;&nbsp;<strong>contact</strong>&nbsp;&nbsp;&nbsp;&nbsp;Direct transmission coordinates<br>
          &nbsp;&nbsp;<strong>theme</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Toggle Dark / Light system mode<br>
          &nbsp;&nbsp;<strong>sfx</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Toggle Web Audio procedural sound<br>
          &nbsp;&nbsp;<strong>clear</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Flush terminal buffer
        `;
        break;

      case 'about':
        outLine.className += ' out-dim';
        outLine.innerHTML = `
          LAWRENCE // ABOUT<br>
          [ Ready for your personal biography, education, and disciplines. ]
        `;
        break;

      case 'skills':
        outLine.className += ' out-green';
        outLine.innerHTML = `
          SKILLS & CAPABILITIES<br>
          Three Pillars: Data Science • Software Systems • Poetics & Literature
        `;
        break;

      case 'projects':
        outLine.className += ' out-cyan';
        outLine.innerHTML = PROJECTS_DATA.map(p => 
          `[${p.code}] ${p.title} (${p.year}) - ${p.statusLabel}`
        ).join('<br>');
        break;

      case 'team':
        outLine.className += ' out-cyan';
        outLine.innerHTML = `
          TEAM // COLLECTIVE<br>
          LEAD        : LAWRENCE (Data Science • Software • Poetry)<br>
          ROSTER      : Core Engineering, Research & Creative Collaborators<br>
          STATUS      : Open for Research & Cross-Disciplinary Partnerships
        `;
        break;

      case 'art':
      case 'poetry':
        outLine.className += ' out-cyan';
        outLine.innerHTML = `
          ART // POETICS & VISUAL ANTHOLOGY<br>
          DISCIPLINES : Poetry, Verse Stanzas, Photography & Digital Exhibits<br>
          THEMES      : Rhythmic Expression, Philosophy & Computational Mind
        `;
        break;

      case 'contact':
        outLine.className += ' out-green';
        outLine.innerHTML = `
          EMAIL   : lheklah@st.ug.edu.gh<br>
          GITHUB  : https://github.com/Lawrence-cell<br>
          STATUS  : OPEN FOR CONTRACTS / ROLES 2026
        `;
        break;

      case 'theme':
        document.getElementById('themeToggleBtn')?.click();
        outLine.innerHTML = `THEME TOGGLED`;
        break;

      case 'sfx':
        document.getElementById('sfxToggleBtn')?.click();
        outLine.innerHTML = `SFX TOGGLED`;
        break;

      case 'bgm':
      case 'music':
        document.getElementById('bgmToggleBtn')?.click();
        outLine.innerHTML = `BGM: ${window.soundEngine.isBgmPlaying() ? 'PLAYING AT MAXIMUM VOLUME' : 'PAUSED'}`;
        break;

      case 'boost':
      case 'loud':
        window.soundEngine.setBgmVolume(1.0);
        window.soundEngine.playBgm().catch(() => {});
        outLine.innerHTML = `BGM BOOST: 180% AMPLIFICATION WITH DYNAMICS COMPRESSION ACTIVE`;
        break;

      case 'projector':
        document.getElementById('projectorToggleBtn')?.click();
        outLine.innerHTML = `PROJECTOR MODE: ${this.currentProjectorMode.toUpperCase()}`;
        break;

      case 'feed':
        this.switchProjectorFeed();
        outLine.innerHTML = `PROJECTOR FEED SWITCHED TO 0${this.currentFeedIndex + 1}`;
        break;

      case 'clear':
        body.innerHTML = `
          <div class="terminal-line out-dim">// LAWRENCE DEV TRANSMISSION SYSTEM [v2.6]</div>
          <div class="terminal-line out-dim">// Type 'help' for available diagnostic commands.</div>
        `;
        return;

      case '':
        return;

      default:
        outLine.className += ' out-warn';
        outLine.textContent = `Command not recognized: "${cmd}". Type 'help' for command list.`;
        break;
    }

    body.appendChild(outLine);
    body.scrollTop = body.scrollHeight;
  }

  /* ========================================================================
     11. CONTACT & COPY TRANSMISSION ACTIONS
     ======================================================================== */
  initContactActions() {
    const copyBtn = document.getElementById('copyEmailBtn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const email = 'lheklah@st.ug.edu.gh';
      navigator.clipboard.writeText(email).then(() => {
        this.showToast('EMAIL COPIED TO CLIPBOARD // TRANSMISSION READY');
        if (window.soundEngine) window.soundEngine.playChirp(800, 1400, 0.08);
      }).catch(() => {
        this.showToast(email);
      });
    });
  }

  showToast(msg) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMsg');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  /* ========================================================================
     12. MOBILE NAVIGATION
     ======================================================================== */
  initMobileNav() {
    const toggle = document.getElementById('mobileNavToggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
      const isVisible = window.getComputedStyle(navLinks).display !== 'none';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '56px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.background = 'var(--bg-secondary)';
      navLinks.style.padding = '16px 24px';
      navLinks.style.borderBottom = '1px solid var(--border-medium)';
    });
  }

  /* ========================================================================
     13. TAB NAVIGATION CONTROLLER (MULTI-PAGE & ACTIVE LINK CONTROLLER)
     ======================================================================== */
  initTabNavigation() {
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      // If current file name matches link href (e.g. art.html), mark active
      if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
        link.classList.add('active');
      }
      link.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playClick();
      });
    });

    // Also support anchor scroll spy if multiple sessions exist on single page
    const sections = ['about', 'projects', 'team', 'art'].map(id => document.getElementById(id)).filter(Boolean);
    if ('IntersectionObserver' in window && sections.length > 1) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              const href = link.getAttribute('href');
              if (href === `#${id}`) {
                link.classList.add('active');
              } else if (!href.includes(currentPath)) {
                link.classList.remove('active');
              }
            });
          }
        });
      }, {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      });

      sections.forEach(sec => observer.observe(sec));
    }
  }
}

// Bootstrap on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  window.portfolioApp = new PortfolioApp();

  // Initialize 3D Hero Artifact
  if (window.HeroArtifact) {
    window.heroArtifactInstance = new HeroArtifact('heroCanvas');
  }

  // Initialize Draggable Stickers
  if (window.StickerSystem) {
    window.stickerSystemInstance = new StickerSystem('heroStickers');
  }

  // Initialize Creative Lab
  if (window.CreativeLab) {
    window.creativeLabInstance = new CreativeLab();
  }

  // Reset stickers button
  const resetStickersBtn = document.getElementById('resetStickersBtn');
  if (resetStickersBtn && window.stickerSystemInstance) {
    resetStickersBtn.addEventListener('click', () => {
      window.stickerSystemInstance.resetAll();
    });
  }

  // Initialize Floating Tech Orbit on About session
  if (document.getElementById('floatingTechStage')) {
    initFloatingTechOrbit();
  }
});

/**
 * ZERO-GRAVITY FLOATING FRAMEWORKS & LANGUAGES
 * Interactive tactile physics badges for the About session
 */
function initFloatingTechOrbit() {
  const stage = document.getElementById('floatingTechStage');
  if (!stage) return;

  const badges = Array.from(stage.querySelectorAll('.floating-tech-badge'));
  if (!badges.length) return;

  let activeDrag = null;
  let startX = 0, startY = 0;
  let origLeft = 0, origTop = 0;

  // Preset percentage positions distributed organically across the 2D stage
  const defaultPositions = [
    { leftPercent: 0.05, topPercent: 0.18, rot: -4 }, // Next.js
    { leftPercent: 0.27, topPercent: 0.12, rot: 5 },  // TypeScript
    { leftPercent: 0.51, topPercent: 0.16, rot: -3 }, // Java
    { leftPercent: 0.74, topPercent: 0.12, rot: 4 },  // PostgreSQL
    { leftPercent: 0.08, topPercent: 0.60, rot: 3 },  // Express.js
    { leftPercent: 0.32, topPercent: 0.56, rot: -5 }, // Python
    { leftPercent: 0.56, topPercent: 0.62, rot: 2 },  // Node.js
    { leftPercent: 0.78, topPercent: 0.58, rot: -3 }, // Git & CI/CD
    { leftPercent: 0.42, topPercent: 0.36, rot: 6 },  // React
    { leftPercent: 0.66, topPercent: 0.38, rot: -4 }  // SQL & Data Architecture
  ];

  function positionBadges() {
    const stageRect = stage.getBoundingClientRect();
    const stageW = stageRect.width || stage.offsetWidth || 800;
    const stageH = stageRect.height || stage.offsetHeight || 360;

    badges.forEach((badge, idx) => {
      const cfg = defaultPositions[idx % defaultPositions.length];
      const badgeW = badge.offsetWidth || 150;
      const badgeH = badge.offsetHeight || 44;

      const maxLeft = Math.max(0, stageW - badgeW - 12);
      const maxTop = Math.max(0, stageH - badgeH - 12);

      const targetX = Math.min(maxLeft, Math.max(12, stageW * cfg.leftPercent));
      const targetY = Math.min(maxTop, Math.max(12, stageH * cfg.topPercent));

      badge.dataset.defaultX = targetX;
      badge.dataset.defaultY = targetY;
      badge.dataset.currentX = targetX;
      badge.dataset.currentY = targetY;
      badge.dataset.rot = cfg.rot;

      badge.style.left = `${targetX}px`;
      badge.style.top = `${targetY}px`;
      badge.style.transform = `rotate(${cfg.rot}deg)`;
    });
  }

  // Position on load & resize
  setTimeout(positionBadges, 80);
  window.addEventListener('resize', () => {
    if (!activeDrag) positionBadges();
  });

  // Pointer drag events
  badges.forEach((badge) => {
    badge.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      activeDrag = badge;
      startX = e.clientX;
      startY = e.clientY;
      origLeft = parseFloat(badge.style.left) || 0;
      origTop = parseFloat(badge.style.top) || 0;

      badge.classList.add('is-dragging');
      badge.style.zIndex = '50';
      badge.style.animationPlayState = 'paused';

      if (window.soundEngine && typeof window.soundEngine.playClick === 'function') {
        window.soundEngine.playClick();
      }
    });

    badge.addEventListener('dblclick', () => {
      resetBadge(badge);
    });
  });

  window.addEventListener('pointermove', (e) => {
    if (!activeDrag) return;
    const stageRect = stage.getBoundingClientRect();
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const badgeW = activeDrag.offsetWidth || 150;
    const badgeH = activeDrag.offsetHeight || 44;
    const maxLeft = stageRect.width - badgeW - 8;
    const maxTop = stageRect.height - badgeH - 8;

    const newLeft = Math.max(8, Math.min(maxLeft, origLeft + dx));
    const newTop = Math.max(8, Math.min(maxTop, origTop + dy));

    activeDrag.style.left = `${newLeft}px`;
    activeDrag.style.top = `${newTop}px`;
    const tilt = Math.max(-12, Math.min(12, dx * 0.08));
    activeDrag.style.transform = `rotate(${tilt}deg) scale(1.06)`;
  });

  window.addEventListener('pointerup', () => {
    if (!activeDrag) return;
    const badge = activeDrag;
    badge.classList.remove('is-dragging');
    badge.style.zIndex = '15';
    badge.style.animationPlayState = 'running';

    const settleRot = Math.floor(Math.random() * 10 - 5);
    badge.style.transform = `rotate(${settleRot}deg)`;

    if (window.soundEngine && typeof window.soundEngine.playStickerDrop === 'function') {
      window.soundEngine.playStickerDrop();
    }

    activeDrag = null;
  });

  function resetBadge(badge) {
    badge.style.transition = 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1), top 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    const defX = parseFloat(badge.dataset.defaultX) || 20;
    const defY = parseFloat(badge.dataset.defaultY) || 20;
    const rot = parseFloat(badge.dataset.rot) || 0;

    badge.style.left = `${defX}px`;
    badge.style.top = `${defY}px`;
    badge.style.transform = `rotate(${rot}deg)`;

    setTimeout(() => {
      badge.style.transition = '';
    }, 450);

    if (window.soundEngine && typeof window.soundEngine.playChirp === 'function') {
      window.soundEngine.playChirp(600, 1000, 0.06);
    }
  }

  const resetBtn = document.getElementById('resetFloatingTechBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      badges.forEach(b => resetBadge(b));
    });
  }
}
