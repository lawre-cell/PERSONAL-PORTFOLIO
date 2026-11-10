# LAWRENCE // DESIGN ENGINEER & SYSTEMS PORTFOLIO

> Inspired by the craft, retro-futurist aesthetics, and interactive systems of [haoqi.design](https://haoqi.design/).

A bespoke, high-performance portfolio tailored for **Lawrence** ([@Lawrence-cell](https://github.com/Lawrence-cell)), celebrating the intersection of **low-level systems engineering (C++, DSP, GNU Radio)** and **tactile creative computing (WebGL, procedural sound, physics badges)**.

---

## ✦ Key Design & Engineering Features

### 1. Retro-Futurist Studio Notebook & Datasheet Aesthetic
- **Projected Screen Video Background**:
  - Full-screen ambient video projection layer integrated seamlessly behind all content and 3D glass artifacts.
  - Optical beam vignette, CRT phosphor scanlines, and theme-adaptive color grading.
  - Interactive controls: `[PROJ: ON / VIVID / OFF]` and `[FEED: 01 / 02]` toggle to switch between video recordings.
- **Dual Visual Modes**:
  - **Dark Mode (Default)**: Deep obsidian abyss, glowing cyan/indigo telemetry lights, frosted acrylic refraction.
  - **Light Mode**: High-precision clinical silver-grey parchment with electric ultramarine accents.
- **Hairline Telemetry & Grid**:
  - Live UTC/Local clock with second counter (`ACCRA / UTC+0 00:00:00`).
  - Active status beacon (`SYS: ONLINE // OPEN FOR NEW COLLABORATIONS`).
  - Optical corner marks (`+`) and technical coordinate badges.

### 2. Interactive Hybrid Canvas Stage & Physics Badges
- **3D Translucent Glass Polyhedron**:
  - Interactive 3D artifact with dynamic mouse tracking, inertia lerp, and refractive facet shading.
  - Chromatic dispersion (red/cyan RGB split on outer wireframe edges).
  - Ambient particle constellation and Star-6 optical flares.
- **Draggable Physics Stickers**:
  - Tactile interactive badges that can be freely dragged, tossed, and dropped across the hero viewport.
  - Procedural sound feedback on grab and drop.
  - Double-click or reset button to snap back to default layout.

### 3. Dual-Mode Project Showcase
- **View A: Datasheet Table**:
  - Dense engineering specification rows with Code (`SYS-01`, `DSP-02`), Title, Domain, Tech Stack, Year, and Deployment Status.
  - **Floating Cursor Preview**: Moving the mouse over table rows reveals a floating glass preview card that follows the pointer.
- **View B: Specimen Card Grid**:
  - High-craft cards with real-time animated technical schematic canvases.
- **Category Filtering**: `ALL`, `SYSTEMS & C++`, `SIGNAL & RF`, `UTILITIES`, `WEB & GL`.
- **Sliding Dossier Drawer**: Deep-dive engineering drawer with system specifications, architectural blueprints, benchmarks, and direct GitHub links.

### 4. Interactive Creative Lab (Live Micro-Experiments)
- **EXP-01: RF & Audio DSP Oscilloscope**: Real-time waveform generator (Sine, Square, Sawtooth, Noise), frequency slider (80Hz - 1800Hz), harmonic tuning, and live Web Audio audition tone.
- **EXP-02: Optical Refraction Shader**: Interactive refraction canvas testing index of refraction (IOR) and chromatic aberration across test patterns.
- **EXP-03: Cyber Glyph Matrix Decoder**: Type custom text and watch characters resolve through a procedural scramble decoding animation.

### 5. Web Audio API Procedural Sound Synthesis
- Zero external MP3/WAV files required.
- Synthesizes mechanical tactile clicks, frequency chirps, and decode ticks directly via `AudioContext` oscillators.
- User-controllable `SFX: ON / OFF` toggle with state persistence.

### 6. Interactive Command Terminal
- Embedded retro terminal console supporting interactive commands:
  - `help`: View available commands
  - `about`: Operator background & biography
  - `skills`: Audited technical proficiencies
  - `projects`: Registered production specs
  - `contact`: Transmission coordinates
  - `theme`: Toggle dark/light system mode
  - `clear`: Flush terminal buffer

---

## ✦ Getting Started

### Method 1: Instant Direct Launch (No Build Step Required)
Simply double-click `index.html` or open it in any modern browser (Chrome, Edge, Firefox, Safari).

### Method 2: Local HTTP Server
```bash
npm start
# Or using Python:
python -m http.server 3000
```

### Method 3: Deploy to GitHub Pages
1. Push your code to your repository:
   ```bash
   git add .
   git commit -m "feat: complete haoqi-inspired portfolio"
   git push origin main
   ```
2. In your GitHub repository (`github.com/lawre-cell/PERSONAL-PORTFOLIO`), go to **Settings > Pages**.
3. Under **Build and deployment**, select **Source: Deploy from a branch** -> branch **`main`** / folder **`/(root)`**.
4. Your portfolio will be live at `https://lawre-cell.github.io/PERSONAL-PORTFOLIO/`!

