/**
 * LAWRENCE PORTFOLIO // MAIN APPLICATION
 * Inspired by haoqi.design — Retro-Futurist Datasheet & Studio Notebook Architecture
 */

// Project Database
const PROJECTS_DATA = [
  {
    code: 'SYS-01',
    title: 'SpectrumVision RF Surveillance Engine',
    category: 'systems',
    domain: 'Radio Frequency / SDR',
    stack: ['C++20', 'FFTW3', 'SDRplay', 'Qt6'],
    year: '2026',
    status: 'prod',
    statusLabel: 'Production',
    summary: 'High-throughput wideband spectrum search and signal acquisition pipeline capable of processing 40 MSPS with real-time FFT waterfall visualization and automated carrier detection.',
    github: 'https://github.com/Lawrence-cell/receiver_search_spectrum_project',
    features: [
      'Multi-threaded DSP pipeline utilizing lock-free circular ring buffers',
      'SIMD-accelerated FFT processing with sub-millisecond peak detection',
      'Configurable SNR thresholding and automatic carrier frequency tagging',
      'Low-latency OpenGL spectral waterfall and density heatmaps'
    ],
    architecture: 'Modular pipeline separating hardware I/Q capture, windowing/FFT analysis, and GUI rendering across dedicated pinned CPU cores.',
    metrics: 'Sustained 40 MSPS ingestion @ < 4% frame loss on commodity multi-core hardware.'
  },
  {
    code: 'DSP-02',
    title: 'GNU Radio Symbol Synchronizer',
    category: 'signal',
    domain: 'Digital Signal Processing',
    stack: ['Python', 'C++', 'GNU Radio', 'NumPy'],
    year: '2025',
    status: 'oss',
    statusLabel: 'Open Source',
    summary: 'Software implementation of timing recovery and symbol synchronization algorithms modeling GNU Radio native modules for digital modulation schemes (BPSK, QPSK, 16-QAM).',
    github: 'https://github.com/Lawrence-cell/symbol_sync_py',
    features: [
      'Gardner and Mueller & Müller timing error detector (TED) implementations',
      'Polyphase filterbank interpolator for arbitrary fractional sample delays',
      'I/Q constellation diagram rendering and EVM (Error Vector Magnitude) calculation',
      'Complete test harness verifying loop bandwidth and damping factor convergence'
    ],
    architecture: 'Discrete-time feedback control loop combining phase detector, loop filter, and numerically controlled oscillator (NCO).',
    metrics: 'Locked symbol timing down to 2 dB SNR in AWGN channel simulations.'
  },
  {
    code: 'UTL-03',
    title: 'WinSpotlight Dual-Monitor Sync',
    category: 'utilities',
    domain: 'Systems Utility',
    stack: ['C++', 'Win32 API', 'GDI+', 'PowerShell'],
    year: '2025',
    status: 'prod',
    statusLabel: 'Production',
    summary: 'Lightweight Windows background daemon that monitors, extracts, and synchronizes 4K Windows Spotlight lock screen photography across multi-display setups.',
    github: 'https://github.com/Lawrence-cell/Wallpaper_Sync_WithWinSpotlight',
    features: [
      'Zero-CPU event-driven file system watcher on Windows AppData assets',
      'Per-monitor aspect ratio cropping and multi-monitor virtual canvas stitching',
      'Metadata filtering to discard non-photographic icon and thumbnail cache files',
      'Native Win32 system tray integration with minimal RAM footprint (< 12MB)'
    ],
    architecture: 'Background worker service utilizing Win32 IActiveDesktop COM interfaces and shell change notifications.',
    metrics: '< 0.1% background CPU utilization, zero battery drain.'
  },
  {
    code: 'SIM-04',
    title: 'ChickRace Concurrency Simulation',
    category: 'systems',
    domain: 'Multi-threaded Simulation',
    stack: ['C++17', 'POSIX Threads', 'Atomic', 'CMake'],
    year: '2025',
    status: 'oss',
    statusLabel: 'Open Source',
    summary: 'High-performance concurrent simulation engine demonstrating synchronized thread execution, deterministic state machines, and real-time race telemetry output.',
    github: 'https://github.com/Lawrence-cell/CHICKRACE',
    features: [
      'Lock-free atomic state tracking minimizing mutex contention across threads',
      'Deterministic pseudo-random velocity generators based on PCG algorithm',
      'Real-time ASCII/ANSI terminal telemetry visualizer with millisecond precision',
      'Race condition testing suite with ThreadSanitizer (TSan) validation'
    ],
    architecture: 'Master coordinator orchestrating N worker threads with condition variables and barrier synchronization.',
    metrics: 'Deterministic multi-thread convergence verified with 0 data races.'
  },
  {
    code: 'IOT-05',
    title: 'BlackBird Remote Telemetry Bus',
    category: 'utilities',
    domain: 'Remote Control & IoT',
    stack: ['Python', 'AsyncIO', 'Protobuf', 'ZeroMQ'],
    year: '2025',
    status: 'exp',
    statusLabel: 'Experimental',
    summary: 'Asynchronous remote control server and command dispatcher engineered for telemetry gathering, heartbeat monitoring, and device control over constrained network links.',
    github: 'https://github.com/Lawrence-cell/Black_bird_remoter',
    features: [
      'Compact Protocol Buffers serialization for bandwidth-efficient transmission',
      'Heartbeat timeout detection and graceful reconnection backoff strategy',
      'Cross-platform remote command dispatcher with safety sandboxing',
      'Real-time terminal telemetry monitor with tabular latency statistics'
    ],
    architecture: 'Pub/Sub telemetry broadcast coupled with Req/Rep command channels over non-blocking sockets.',
    metrics: '< 15ms round-trip latency on local mesh networks.'
  },
  {
    code: 'WEB-06',
    title: 'Aura Retro-Futurist WebGL Stage',
    category: 'web',
    domain: 'Creative Engineering',
    stack: ['JavaScript ES6', 'WebGL', 'Canvas2D', 'Web Audio'],
    year: '2026',
    status: 'prod',
    statusLabel: 'Production',
    summary: 'High-fidelity design engineering showcase featuring interactive 3D refraction shaders, chromatic dispersion, procedural sound synthesis, and tactile physics stickers.',
    github: 'https://github.com/Lawrence-cell/PERSONAL-PORTFOLIO',
    features: [
      'Hybrid DOM and WebGL canvas stage synchronized with inertial scrolling',
      'Real-time chromatic dispersion (RGB offset) and glass refraction shaders',
      'Web Audio API procedural sound synthesizer for tactile UI micro-interactions',
      'Inertial draggable physics stickers and retro-futurist character scramble decoder'
    ],
    architecture: 'Zero-framework vanilla modern web architecture delivering 60 FPS performance and instant zero-dependency load times.',
    metrics: '100/100 Lighthouse performance score with zero external library bloat.'
  }
];

class PortfolioApp {
  constructor() {
    this.currentView = 'table'; // 'table' or 'grid'
    this.currentFilter = 'all';
    this.isMuted = false;

    this.initClock();
    this.initTheme();
    this.initAudioToggle();
    this.initCustomCursor();
    this.initViewToggles();
    this.initFilters();
    this.renderProjects();
    this.initHoverPreview();
    this.initProjectModal();
    this.initTerminal();
    this.initContactActions();
    this.initMobileNav();
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
          &nbsp;&nbsp;<strong>about</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Engineering background & biography<br>
          &nbsp;&nbsp;<strong>skills</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Technical core matrix & stack<br>
          &nbsp;&nbsp;<strong>projects</strong>&nbsp;&nbsp;&nbsp;List all registered production specs<br>
          &nbsp;&nbsp;<strong>contact</strong>&nbsp;&nbsp;&nbsp;&nbsp;Direct transmission coordinates<br>
          &nbsp;&nbsp;<strong>theme</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Toggle Dark / Light system mode<br>
          &nbsp;&nbsp;<strong>sfx</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Toggle Web Audio procedural sound<br>
          &nbsp;&nbsp;<strong>clear</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Flush terminal buffer
        `;
        break;

      case 'about':
        outLine.className += ' out-dim';
        outLine.innerHTML = `
          LAWRENCE // SYSTEMS ENGINEER & DESIGN TECHNOLOGIST<br>
          Specializing in C++, Digital Signal Processing (DSP), RF telemetry,<br>
          and tactile modern web interfaces. Passionate about retro-futurist<br>
          datasheet aesthetics, low-level efficiency, and human-crafted interfaces.
        `;
        break;

      case 'skills':
        outLine.className += ' out-green';
        outLine.innerHTML = `
          SYSTEMS & ARCHITECTURE : C++20, C, Multithreading, Posix, Win32 API<br>
          SIGNAL & RF             : GNU Radio, FFTW3, SDR, Modulation, DSP<br>
          FRONTEND & CREATIVE     : WebGL, Three.js, Canvas, ES6, Web Audio<br>
          INFRASTRUCTURE          : Git/GitHub, CMake, Linux, Python AsyncIO
        `;
        break;

      case 'projects':
        outLine.className += ' out-cyan';
        outLine.innerHTML = PROJECTS_DATA.map(p => 
          `[${p.code}] ${p.title} (${p.year}) - ${p.statusLabel}`
        ).join('<br>');
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
});
