/**
 * LAWRENCE PORTFOLIO // INTERACTIVE PHYSICS STICKERS
 * Draggable, tactile badges inspired by haoqi.design
 */

class StickerSystem {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.stickers = [];
    this.activeDrag = null;
    this.startX = 0;
    this.startY = 0;
    this.origX = 0;
    this.origY = 0;

    this.initStickers();
  }

  initStickers() {
    const stickerElements = this.container.querySelectorAll('.interactive-sticker');
    const containerRect = this.container.getBoundingClientRect();
    const w = containerRect.width || window.innerWidth;
    const h = containerRect.height || window.innerHeight;

    // Preset natural placement across the hero viewport
    const initialPositions = [
      { top: 120, left: w * 0.52, rot: -6 },
      { top: 220, left: w * 0.78, rot: 8 },
      { top: 380, left: w * 0.48, rot: -4 },
      { top: 480, left: w * 0.72, rot: 5 },
      { top: 180, left: w * 0.38, rot: 12 }
    ];

    stickerElements.forEach((el, i) => {
      const pos = initialPositions[i % initialPositions.length];
      const sticker = {
        el,
        x: pos.left,
        y: pos.top,
        rot: pos.rot,
        origX: pos.left,
        origY: pos.top,
        origRot: pos.rot
      };

      this.updateStickerPosition(sticker);
      this.stickers.push(sticker);

      el.addEventListener('pointerdown', (e) => this.onPointerDown(e, sticker));
      el.addEventListener('dblclick', () => this.resetSticker(sticker));
    });

    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
    window.addEventListener('pointerup', (e) => this.onPointerUp(e));
  }

  updateStickerPosition(s) {
    s.el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) rotate(${s.rot}deg)`;
  }

  onPointerDown(e, sticker) {
    e.preventDefault();
    this.activeDrag = sticker;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.origX = sticker.x;
    this.origY = sticker.y;

    // Bring dragged sticker to top
    this.container.appendChild(sticker.el);
    sticker.el.style.zIndex = '50';

    if (window.soundEngine) {
      window.soundEngine.playClick();
    }
  }

  onPointerMove(e) {
    if (!this.activeDrag) return;
    const dx = e.clientX - this.startX;
    const dy = e.clientY - this.startY;

    this.activeDrag.x = this.origX + dx;
    this.activeDrag.y = this.origY + dy;

    // Slight tilt tilt while dragging
    const tilt = Math.max(-15, Math.min(15, this.activeDrag.rot + dx * 0.05));
    this.activeDrag.el.style.transform = `translate3d(${this.activeDrag.x}px, ${this.activeDrag.y}px, 0) rotate(${tilt}deg) scale(1.06)`;
  }

  onPointerUp(e) {
    if (!this.activeDrag) return;
    const s = this.activeDrag;
    s.rot = Math.floor(Math.random() * 16 - 8);
    this.updateStickerPosition(s);
    s.el.style.zIndex = '10';

    if (window.soundEngine) {
      window.soundEngine.playStickerDrop();
    }

    this.activeDrag = null;
  }

  resetSticker(s) {
    s.x = s.origX;
    s.y = s.origY;
    s.rot = s.origRot;
    s.el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    this.updateStickerPosition(s);
    setTimeout(() => {
      s.el.style.transition = '';
    }, 400);

    if (window.soundEngine) {
      window.soundEngine.playChirp(600, 1000, 0.06);
    }
  }

  resetAll() {
    this.stickers.forEach(s => this.resetSticker(s));
  }
}

window.StickerSystem = StickerSystem;

