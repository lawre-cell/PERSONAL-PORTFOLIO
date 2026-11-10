/**
 * LAWRENCE PORTFOLIO // AUDIO SYNTHESIZER
 * Procedural UI Sound Generator via Web Audio API
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = localStorage.getItem('lawrence_sfx') !== 'false';
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('lawrence_sfx', this.enabled);
    if (this.enabled) {
      this.init();
      this.playChirp(880, 1320, 0.08);
    }
    return this.enabled;
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.025);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.025);
  }

  playHover() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(640, now);
    osc.frequency.linearRampToValueAtTime(720, now + 0.03);

    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  playScramble() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    const now = this.ctx.currentTime;
    const randomFreq = 900 + Math.random() * 600;
    osc.frequency.setValueAtTime(randomFreq, now);

    gain.gain.setValueAtTime(0.012, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.015);
  }

  playChirp(startFreq = 440, endFreq = 880, duration = 0.1) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  playStickerDrop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  /* ========================================================================
     BACKGROUND MUSIC (MAX VOLUME & DYNAMICS COMPRESSION BOOST)
     ======================================================================== */
  initBgm(audioElement) {
    if (!audioElement) return;
    this.bgmAudio = audioElement;
    this.bgmAudio.volume = 1.0; // Max volume for HTML5 audio element
    this.bgmAudio.loop = true;

    this.init();
    if (this.ctx && !this.bgmSourceNode) {
      try {
        this.bgmSourceNode = this.ctx.createMediaElementSource(audioElement);
        this.bgmGainNode = this.ctx.createGain();
        // Set gain to 1.8 (180% amplification boost for maximum loudness)
        this.bgmGainNode.gain.setValueAtTime(1.8, this.ctx.currentTime);

        // Dynamics Compressor to maximize loudness and punch without clipping
        this.compressor = this.ctx.createDynamicsCompressor();
        this.compressor.threshold.setValueAtTime(-10, this.ctx.currentTime);
        this.compressor.knee.setValueAtTime(12, this.ctx.currentTime);
        this.compressor.ratio.setValueAtTime(8, this.ctx.currentTime);
        this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
        this.compressor.release.setValueAtTime(0.2, this.ctx.currentTime);

        this.bgmSourceNode.connect(this.bgmGainNode);
        this.bgmGainNode.connect(this.compressor);
        this.compressor.connect(this.ctx.destination);
      } catch (err) {
        console.warn('Web Audio gain routing notice:', err);
      }
    }

    // Force play immediately without waiting for permission
    const forceStart = () => {
      this.playBgm().catch(() => {});
    };
    forceStart();

    // Trigger on any micro-gesture across the viewport
    const omniEvents = ['pointerdown', 'pointermove', 'mousemove', 'wheel', 'scroll', 'touchstart', 'keydown', 'mouseenter', 'focus'];
    const onGesture = () => {
      forceStart();
      if (this.isBgmPlaying()) {
        omniEvents.forEach(e => window.removeEventListener(e, onGesture, true));
      }
    };
    omniEvents.forEach(e => window.addEventListener(e, onGesture, { capture: true, passive: true }));

    // Continuous auto-retry every 250ms until playing
    const retryInterval = setInterval(() => {
      if (this.isBgmPlaying()) {
        clearInterval(retryInterval);
      } else {
        forceStart();
      }
    }, 250);
  }

  playBgm() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.bgmAudio) {
      this.bgmAudio.volume = 1.0;
      return this.bgmAudio.play();
    }
    return Promise.reject();
  }

  pauseBgm() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
  }

  isBgmPlaying() {
    return this.bgmAudio && !this.bgmAudio.paused && !this.bgmAudio.ended;
  }

  setBgmVolume(val = 1.0) {
    if (this.bgmAudio) {
      this.bgmAudio.volume = Math.max(0, Math.min(1.0, val));
    }
    if (this.bgmGainNode && this.ctx) {
      this.bgmGainNode.gain.setValueAtTime(val * 1.8, this.ctx.currentTime);
    }
  }
}

window.soundEngine = new SoundEngine();

