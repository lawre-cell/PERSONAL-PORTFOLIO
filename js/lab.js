/**
 * LAWRENCE PORTFOLIO // CREATIVE LAB EXPERIMENTS
 * Interactive Signal Spectrum & Optical Refraction Simulators
 */

class CreativeLab {
  constructor() {
    this.initSpectrumAnalyzer();
    this.initRefractionShader();
    this.initScrambleSandbox();
  }

  /* ========================================================================
     EXPERIMENT 1: RF SPECTRUM & DSP OSCILLOSCOPE
     ======================================================================== */
  initSpectrumAnalyzer() {
    const canvas = document.getElementById('spectrumCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let waveType = 'sine';
    let freq = 440;
    let harmonics = 3;
    let isPlayingAudio = false;
    let osc = null;
    let gainNode = null;

    const freqInput = document.getElementById('specFreq');
    const freqValDisplay = document.getElementById('specFreqVal');
    const harmInput = document.getElementById('specHarm');
    const harmValDisplay = document.getElementById('specHarmVal');
    const waveBtns = document.querySelectorAll('[data-wave]');
    const audioBtn = document.getElementById('toggleAudioBtn');

    if (freqInput) {
      freqInput.addEventListener('input', (e) => {
        freq = parseFloat(e.target.value);
        if (freqValDisplay) freqValDisplay.textContent = `${freq} Hz`;
        if (osc && window.soundEngine && window.soundEngine.ctx) {
          osc.frequency.setValueAtTime(freq, window.soundEngine.ctx.currentTime);
        }
      });
    }

    if (harmInput) {
      harmInput.addEventListener('input', (e) => {
        harmonics = parseInt(e.target.value);
        if (harmValDisplay) harmValDisplay.textContent = harmonics;
      });
    }

    waveBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        waveBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        waveType = btn.getAttribute('data-wave');
        if (osc) osc.type = waveType === 'noise' ? 'sawtooth' : waveType;
        if (window.soundEngine) window.soundEngine.playClick();
      });
    });

    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        if (!window.soundEngine) return;
        window.soundEngine.init();
        const actx = window.soundEngine.ctx;
        if (!actx) return;

        if (!isPlayingAudio) {
          osc = actx.createOscillator();
          gainNode = actx.createGain();
          osc.type = waveType === 'noise' ? 'sawtooth' : waveType;
          osc.frequency.setValueAtTime(freq, actx.currentTime);
          gainNode.gain.setValueAtTime(0.04, actx.currentTime);

          osc.connect(gainNode);
          gainNode.connect(actx.destination);
          osc.start();

          isPlayingAudio = true;
          audioBtn.classList.add('active');
          audioBtn.textContent = 'MUTE TONE';
        } else {
          if (osc) {
            osc.stop();
            osc.disconnect();
            osc = null;
          }
          isPlayingAudio = false;
          audioBtn.classList.remove('active');
          audioBtn.textContent = 'AUDITION TONE';
        }
      });
    }

    let time = 0;
    function renderSpectrum() {
      const w = canvas.width = canvas.parentElement.clientWidth;
      const h = canvas.height = canvas.parentElement.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // Draw engineering grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridStep = 32;
      for (let x = 0; x < w; x += gridStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Center Baseline
      const centerY = h / 2;
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(w, centerY);
      ctx.stroke();

      // Draw Waveform Oscilloscope
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#00f0ff';
      ctx.beginPath();

      const points = 180;
      const baseFreqFactor = (freq / 440) * 0.05;

      for (let i = 0; i <= points; i++) {
        const x = (i / points) * w;
        let sample = 0;

        for (let k = 1; k <= harmonics; k++) {
          const amp = 1 / k;
          const phase = time * baseFreqFactor * k + (i * 0.08 * k);
          if (waveType === 'sine') {
            sample += Math.sin(phase) * amp;
          } else if (waveType === 'square') {
            sample += Math.sign(Math.sin(phase)) * amp;
          } else if (waveType === 'saw') {
            sample += (((phase / Math.PI) % 2) - 1) * amp;
          } else if (waveType === 'noise') {
            sample += (Math.random() * 2 - 1) * 0.6;
          }
        }

        const y = centerY + sample * (h * 0.32);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw Frequency Spectrum Bars (FFT simulation at the bottom)
      const numBars = 32;
      const barW = (w / numBars) - 2;
      for (let b = 0; b < numBars; b++) {
        const barX = b * (barW + 2);
        const distFromCenter = Math.abs(b - (freq / 1200) * numBars);
        let barH = Math.max(4, 70 * Math.exp(-distFromCenter * 0.3) + Math.sin(time * 0.1 + b) * 8);
        if (waveType === 'noise') barH = Math.random() * 50 + 10;

        const barY = h - barH;
        ctx.fillStyle = distFromCenter < 3 ? 'rgba(0, 240, 255, 0.85)' : 'rgba(99, 102, 241, 0.4)';
        ctx.fillRect(barX, barY, barW, barH);
      }

      time += 1;
      requestAnimationFrame(renderSpectrum);
    }

    renderSpectrum();
  }

  /* ========================================================================
     EXPERIMENT 2: OPTICAL GLASS REFRACTION SHADER
     ======================================================================== */
  initRefractionShader() {
    const canvas = document.getElementById('shaderCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let ior = 1.45;
    let dispersion = 8;
    let mouse = { x: 160, y: 110, targetX: 160, targetY: 110 };

    const iorInput = document.getElementById('shaderIOR');
    const iorVal = document.getElementById('shaderIORVal');
    const dispInput = document.getElementById('shaderDisp');
    const dispVal = document.getElementById('shaderDispVal');

    if (iorInput) {
      iorInput.addEventListener('input', (e) => {
        ior = parseFloat(e.target.value);
        if (iorVal) iorVal.textContent = ior.toFixed(2);
      });
    }

    if (dispInput) {
      dispInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        dispersion = val;
        if (dispVal) dispVal.textContent = `${val}px`;
      });
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    });

    let angle = 0;
    function renderRefraction() {
      const w = canvas.width = canvas.parentElement.clientWidth;
      const h = canvas.height = canvas.parentElement.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // 1. Background high-contrast test pattern (typography & stripes)
      ctx.fillStyle = '#06090e';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.font = '700 24px Syne, sans-serif';
      ctx.fillText('HAOQI.DESIGN / REFRACTION // LAWRENCE', 20, 60);
      ctx.fillText('C++ / GNU RADIO / LOW-LEVEL ARCHITECTURE', 20, 110);
      ctx.fillText('CHROMA SPLIT // RETRO-FUTURIST OPTICS', 20, 160);

      // Geometric diagonal stripes
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.18)';
      ctx.lineWidth = 4;
      for (let i = -w; i < w * 2; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + h, h);
        ctx.stroke();
      }

      // 2. Translucent Glass Lens at mouse position
      const lensR = 64;
      const cx = mouse.x;
      const cy = mouse.y;

      // Outer Lens Rim
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, lensR, 0, Math.PI * 2);
      ctx.clip();

      // Magnified / Refracted inner content with Chromatic Aberration
      // Red Channel
      ctx.save();
      ctx.translate(cx + dispersion, cy);
      ctx.scale(ior, ior);
      ctx.fillStyle = 'rgba(255, 60, 90, 0.55)';
      ctx.font = '700 24px Syne, sans-serif';
      ctx.fillText('HAOQI.DESIGN', -lensR, -10);
      ctx.fillText('DISPERSION', -lensR, 20);
      ctx.restore();

      // Blue / Cyan Channel
      ctx.save();
      ctx.translate(cx - dispersion, cy);
      ctx.scale(ior, ior);
      ctx.fillStyle = 'rgba(0, 240, 255, 0.65)';
      ctx.font = '700 24px Syne, sans-serif';
      ctx.fillText('HAOQI.DESIGN', -lensR, -10);
      ctx.fillText('DISPERSION', -lensR, 20);
      ctx.restore();

      // Sharp Crisp Primary
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(ior, ior);
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 24px Syne, sans-serif';
      ctx.fillText('HAOQI.DESIGN', -lensR, -10);
      ctx.fillText('DISPERSION', -lensR, 20);
      ctx.restore();

      ctx.restore();

      // Lens Glass Specular Glint & Border
      ctx.beginPath();
      ctx.arc(cx, cy, lensR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Star-6 Highlight on Lens Edge
      const starX = cx + Math.cos(angle) * (lensR - 4);
      const starY = cy + Math.sin(angle) * (lensR - 4);
      if (window.HeroArtifact) {
        // Draw glint
        ctx.fillStyle = '#00f0ff';
        ctx.fillRect(starX - 2, starY - 2, 4, 4);
      }

      angle += 0.02;
      requestAnimationFrame(renderRefraction);
    }

    renderRefraction();
  }

  /* ========================================================================
     EXPERIMENT 3: CHARACTER SCRAMBLE SANDBOX
     ======================================================================== */
  initScrambleSandbox() {
    const input = document.getElementById('scrambleInput');
    const output = document.getElementById('scrambleOutput');
    const runBtn = document.getElementById('runScrambleBtn');

    if (!input || !output || !runBtn) return;

    runBtn.addEventListener('click', () => {
      const text = input.value.trim() || 'TACTILE RETRO-FUTURIST COMPUTING';
      const fx = new TextScramble(output);
      fx.setText(text);
      if (window.soundEngine) window.soundEngine.playClick();
    });
  }
}

window.CreativeLab = CreativeLab;
