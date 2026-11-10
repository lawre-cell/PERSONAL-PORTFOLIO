/**
 * LAWRENCE PORTFOLIO // 3D HERO CANVAS
 * High-performance interactive 3D glass polyhedron with chromatic dispersion
 * and depth particle field, inspired by haoqi.design
 */

class HeroArtifact {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.width = 0;
    this.height = 0;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    // Rotation and interaction state
    this.rotX = 0.4;
    this.rotY = 0.6;
    this.targetRotX = 0.4;
    this.targetRotY = 0.6;
    this.autoSpinSpeed = 0.004;

    this.mouse = { x: 0, y: 0, active: false };
    this.particles = [];
    this.stars = [];

    // 3D Polyhedron geometry: Truncated Icosahedron / Dual Prism
    this.initGeometry();
    this.initParticles();
    this.resize();

    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = this.width * this.pixelRatio;
    this.canvas.height = this.height * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }

  initGeometry() {
    // 3D Icosahedron Vertices
    const phi = (1 + Math.sqrt(5)) / 2;
    const rawVertices = [
      [-1,  phi, 0], [ 1,  phi, 0], [-1, -phi, 0], [ 1, -phi, 0],
      [ 0, -1,  phi], [ 0,  1,  phi], [ 0, -1, -phi], [ 0,  1, -phi],
      [ phi, 0, -1], [ phi, 0,  1], [-phi, 0, -1], [-phi, 0,  1]
    ];

    // Normalize and scale vertices
    const scale = 140;
    this.outerVertices = rawVertices.map(v => {
      const len = Math.hypot(v[0], v[1], v[2]);
      return [v[0] / len * scale, v[1] / len * scale, v[2] / len * scale];
    });

    this.innerVertices = rawVertices.map(v => {
      const len = Math.hypot(v[0], v[1], v[2]);
      return [v[0] / len * (scale * 0.58), v[1] / len * (scale * 0.58), v[2] / len * (scale * 0.58)];
    });

    // Outer & Inner edges
    this.edges = [
      [0, 11], [0, 5], [0, 1], [0, 7], [0, 10],
      [1, 5], [1, 7], [1, 9], [1, 8],
      [2, 11], [2, 10], [2, 4], [2, 6], [2, 3],
      [3, 4], [3, 6], [3, 9], [3, 8],
      [4, 5], [4, 9], [4, 11],
      [5, 9], [5, 11],
      [6, 7], [6, 8], [6, 10],
      [7, 8], [7, 10],
      [8, 9],
      [10, 11]
    ];

    // Faces for transparent glass shading
    this.faces = [
      [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
      [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
      [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
      [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];
  }

  initParticles() {
    this.particles = [];
    const count = 55;
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 600,
        z: (Math.random() - 0.5) * 400,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        speedZ: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Optical flare stars (Star 6 glints like on haoqi.design)
    this.stars = [
      { x: -180, y: -120, size: 14, rot: 0 },
      { x: 190, y: 130, size: 18, rot: 0.3 },
      { x: 210, y: -160, size: 10, rot: 0.8 }
    ];
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / this.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / this.height) * 2 - 1;

    this.mouse.x = nx;
    this.mouse.y = ny;
    this.mouse.active = true;

    this.targetRotY = nx * 1.2;
    this.targetRotX = -ny * 0.9;
  }

  rotatePoint(p, rx, ry) {
    // Rotate Y
    const cosY = Math.cos(ry);
    const sinY = Math.sin(ry);
    const x1 = p[0] * cosY + p[2] * sinY;
    const z1 = -p[0] * sinY + p[2] * cosY;

    // Rotate X
    const cosX = Math.cos(rx);
    const sinX = Math.sin(rx);
    const y2 = p[1] * cosX - z1 * sinX;
    const z2 = p[1] * sinX + z1 * cosX;

    return [x1, y2, z2];
  }

  project(p) {
    const fov = 420;
    const distance = 460;
    const z = p[2] + distance;
    const scale = fov / (z <= 0 ? 1 : z);
    const x2d = p[0] * scale + this.width / 2;
    const y2d = p[1] * scale + this.height / 2;
    return { x: x2d, y: y2d, scale, z: p[2] };
  }

  drawStar6(ctx, cx, cy, size, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.2;
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI) / 3;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      ctx.beginPath();
      ctx.moveTo(cx - cos * size, cy - sin * size);
      ctx.lineTo(cx + cos * size, cy + sin * size);
      ctx.stroke();
    }
    // Center glow point
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(cx, cy, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Smooth inertia lerp
    this.rotY += (this.targetRotY - this.rotY) * 0.05 + this.autoSpinSpeed;
    this.rotX += (this.targetRotX - this.rotX) * 0.05;

    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const cyan = isDark ? '#00f0ff' : '#0077b6';
    const indigo = isDark ? '#6366f1' : '#4338ca';
    const white = isDark ? '#ffffff' : '#0a0f1d';

    // 1. Draw floating ambient particles
    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.z += p.speedZ;
      if (p.x > 300) p.x = -300;
      if (p.x < -300) p.x = 300;
      if (p.y > 300) p.y = -300;
      if (p.y < -300) p.y = 300;

      const proj = this.project([p.x, p.y, p.z]);
      const alpha = Math.max(0.1, (p.z + 200) / 400 * 0.45);
      this.ctx.fillStyle = isDark ? `rgba(0, 240, 255, ${alpha})` : `rgba(0, 119, 182, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // 2. Transform vertices
    const rotatedOuter = this.outerVertices.map(v => this.rotatePoint(v, this.rotX, this.rotY));
    const projectedOuter = rotatedOuter.map(v => this.project(v));

    const rotatedInner = this.innerVertices.map(v => this.rotatePoint(v, -this.rotX * 0.7, -this.rotY * 0.8));
    const projectedInner = rotatedInner.map(v => this.project(v));

    // 3. Render Inner Core (Holographic core wireframe)
    this.ctx.lineWidth = 1;
    this.edges.forEach(([i, j]) => {
      const p1 = projectedInner[i];
      const p2 = projectedInner[j];
      const avgZ = (p1.z + p2.z) / 2;
      const alpha = Math.max(0.15, (avgZ + 150) / 300 * 0.5);

      this.ctx.strokeStyle = isDark ? `rgba(99, 102, 241, ${alpha})` : `rgba(67, 56, 202, ${alpha})`;
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.stroke();
    });

    // 4. Render Translucent Glass Faces
    // Sort faces by average depth for painter's algorithm
    const sortedFaces = this.faces.map(face => {
      const p0 = rotatedOuter[face[0]];
      const p1 = rotatedOuter[face[1]];
      const p2 = rotatedOuter[face[2]];
      const avgZ = (p0[2] + p1[2] + p2[2]) / 3;

      // Normal vector calculation for lighting
      const ax = p1[0] - p0[0], ay = p1[1] - p0[1], az = p1[2] - p0[2];
      const bx = p2[0] - p0[0], by = p2[1] - p0[1], bz = p2[2] - p0[2];
      const nx = ay * bz - az * by;
      const ny = az * bx - ax * bz;
      const nz = ax * by - ay * bx;
      const nLen = Math.hypot(nx, ny, nz) || 1;
      const lightDot = (nz / nLen); // Light along viewing Z

      return { face, avgZ, lightDot };
    }).sort((a, b) => a.avgZ - b.avgZ);

    sortedFaces.forEach(({ face, lightDot }) => {
      const p0 = projectedOuter[face[0]];
      const p1 = projectedOuter[face[1]];
      const p2 = projectedOuter[face[2]];

      const facing = (p1.x - p0.x) * (p2.y - p0.y) - (p1.y - p0.y) * (p2.x - p0.x);
      const isFront = facing > 0;

      this.ctx.beginPath();
      this.ctx.moveTo(p0.x, p0.y);
      this.ctx.lineTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.closePath();

      if (isFront) {
        // Translucent refractive glass fill
        const alpha = Math.max(0.04, Math.min(0.24, 0.08 + Math.abs(lightDot) * 0.16));
        this.ctx.fillStyle = isDark
          ? `rgba(0, 240, 255, ${alpha})`
          : `rgba(0, 119, 182, ${alpha * 0.7})`;
        this.ctx.fill();

        // Subtle specular sheen on high-angle reflection
        if (lightDot > 0.45) {
          this.ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${0.12 * lightDot})` : `rgba(255, 255, 255, 0.4)`;
          this.ctx.fill();
        }
      } else {
        // Back-facing glass facet
        this.ctx.fillStyle = isDark ? 'rgba(99, 102, 241, 0.03)' : 'rgba(0, 0, 0, 0.02)';
        this.ctx.fill();
      }
    });

    // 5. Chromatic Dispersion Edges (RGB Split on Outer Wireframe)
    // Blue pass (offset slightly left)
    this.ctx.lineWidth = 1.2;
    this.ctx.strokeStyle = isDark ? 'rgba(0, 240, 255, 0.45)' : 'rgba(0, 119, 182, 0.35)';
    this.edges.forEach(([i, j]) => {
      const p1 = projectedOuter[i];
      const p2 = projectedOuter[j];
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x - 1, p1.y);
      this.ctx.lineTo(p2.x - 1, p2.y);
      this.ctx.stroke();
    });

    // Red/Amber pass (offset slightly right)
    this.ctx.strokeStyle = isDark ? 'rgba(244, 63, 94, 0.35)' : 'rgba(217, 70, 239, 0.25)';
    this.edges.forEach(([i, j]) => {
      const p1 = projectedOuter[i];
      const p2 = projectedOuter[j];
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x + 1, p1.y);
      this.ctx.lineTo(p2.x + 1, p2.y);
      this.ctx.stroke();
    });

    // Main Crisp Center Line
    this.ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.75)' : 'rgba(10, 15, 29, 0.8)';
    this.ctx.lineWidth = 1.4;
    this.edges.forEach(([i, j]) => {
      const p1 = projectedOuter[i];
      const p2 = projectedOuter[j];
      this.ctx.beginPath();
      this.ctx.moveTo(p1.x, p1.y);
      this.ctx.lineTo(p2.x, p2.y);
      this.ctx.stroke();
    });

    // 6. Draw Vertices Nodes (Diamond/Square Data Anchors)
    projectedOuter.forEach((p, idx) => {
      const s = 3;
      this.ctx.fillStyle = isDark ? '#00f0ff' : '#0a0f1d';
      this.ctx.fillRect(p.x - s/2, p.y - s/2, s, s);
    });

    // 7. Render Star 6 Optical Flares
    this.stars.forEach(s => {
      const cx = this.width / 2 + s.x;
      const cy = this.height / 2 + s.y;
      this.drawStar6(this.ctx, cx, cy, s.size, isDark ? 'rgba(0, 240, 255, 0.7)' : 'rgba(0, 119, 182, 0.6)');
    });

    requestAnimationFrame(this.animate);
  }
}

window.HeroArtifact = HeroArtifact;

