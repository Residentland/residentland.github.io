// Hero effect: plasma, copper bars and a wobbling logo
(() => {
  const canvas = document.getElementById('fx');
  const logoCanvas = document.getElementById('fx-logo');
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const lctx = logoCanvas.getContext('2d');
  const hero = canvas.parentElement;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sine table
  const TAU = Math.PI * 2;
  const SIN = new Float32Array(1024);
  for (let i = 0; i < 1024; i++) SIN[i] = Math.sin((i / 1024) * TAU);
  const sin = (x) => SIN[(x * 162.974661) & 1023];

  // Plasma palette, packed as little-endian RGBA
  const pal = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    const a = (i / 256) * TAU;
    const r = 18 + 92 * (0.5 + 0.5 * Math.sin(a));
    const g = 6 + 36 * (0.5 + 0.5 * Math.sin(a * 2 + 1.5));
    const b = 28 + 74 * (0.5 + 0.5 * Math.sin(a + 2.6));
    pal[i] = 0xff000000 | (b << 16) | (g << 8) | r;
  }

  // Bar and logo settings
  const BARS = [[255, 164, 0], [255, 61, 129], [56, 232, 255]];
  const PAD = 14;

  let W = 0, H = 0, px = 4, img, buf, dist, colA, rowA, logo = null;
  let running = false, raf = 0;
  const start = performance.now();
  const time = () => (still ? 14 : (performance.now() - start) / 1000);

  function resize() {
    const cw = hero.clientWidth;
    const ch = hero.clientHeight;
    px = cw < 700 ? 2 : cw < 1400 ? 3 : 4;
    W = Math.ceil(cw / px);
    H = Math.ceil(ch / px);
    canvas.width = W;
    canvas.height = H;

    // Buffers
    img = ctx.createImageData(W, H);
    buf = new Uint32Array(img.data.buffer);
    colA = new Float32Array(W);
    rowA = new Float32Array(H);

    // Distance from centre
    dist = new Float32Array(W * H);
    const cx = W / 2, cy = H * 0.42;
    for (let y = 0, i = 0; y < H; y++) {
      for (let x = 0; x < W; x++, i++) dist[i] = Math.hypot(x - cx, y - cy);
    }
  }

  function plasma(t) {
    const s = px / 4;
    const shift = t * 26;

    // Separable terms
    for (let x = 0; x < W; x++) colA[x] = sin(x * s * 0.045 + t * 0.9) + sin(x * s * 0.021 - t * 0.6);
    for (let y = 0; y < H; y++) rowA[y] = sin(y * s * 0.05 - t * 0.7);

    for (let y = 0, i = 0; y < H; y++) {
      const ry = rowA[y];
      for (let x = 0; x < W; x++, i++) {
        const v = colA[x] + ry + sin(dist[i] * s * 0.07 - t * 1.4) + sin((x + y) * s * 0.018 + t * 0.4);
        buf[i] = pal[((v + 4) * 32 + shift) & 255];
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  function copper(t) {
    const bh = Math.max(8, Math.round(H * 0.045));
    ctx.globalCompositeOperation = 'lighter';

    BARS.forEach(([r, g, b], k) => {
      const y = H * 0.42 + sin(t * 1.3 + k * 2.1) * H * 0.3;
      const c = `${r},${g},${b}`;
      const grad = ctx.createLinearGradient(0, y - bh, 0, y + bh);
      grad.addColorStop(0, `rgba(${c},0)`);
      grad.addColorStop(0.42, `rgba(${c},0.55)`);
      grad.addColorStop(0.5, 'rgba(255,255,255,0.75)');
      grad.addColorStop(0.58, `rgba(${c},0.55)`);
      grad.addColorStop(1, `rgba(${c},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, y - bh, W, bh * 2);
    });

    ctx.globalCompositeOperation = 'source-over';
  }

  function loadLogo() {
    const im = new Image();
    im.onload = () => {
      const off = document.createElement('canvas');
      off.width = im.width;
      off.height = im.height;
      const o = off.getContext('2d');
      o.drawImage(im, 0, 0);

      // Key out the black background
      const d = o.getImageData(0, 0, off.width, off.height);
      for (let i = 0; i < d.data.length; i += 4) {
        const m = Math.max(d.data[i], d.data[i + 1], d.data[i + 2]);
        if (m < 40) d.data[i + 3] = m < 16 ? 0 : (m - 16) * 10;
      }
      o.putImageData(d, 0, 0);

      logo = off;
      logoCanvas.width = im.width + PAD * 2;
      logoCanvas.height = im.height;
      if (!running) drawLogo(time());
    };
    im.src = logoCanvas.dataset.src;
  }

  function drawLogo(t) {
    if (!logo) return;
    lctx.clearRect(0, 0, logoCanvas.width, logoCanvas.height);
    for (let y = 0; y < logo.height; y++) {
      const dx = Math.round(PAD + sin(t * 2.2 + y * 0.07) * PAD * 0.8);
      lctx.drawImage(logo, 0, y, logo.width, 1, dx, y, logo.width, 1);
    }
  }

  function frame() {
    const t = time();
    plasma(t);
    copper(t);
    drawLogo(t);
    if (running) raf = requestAnimationFrame(frame);
  }

  const play = () => {
    if (running || still) return;
    running = true;
    raf = requestAnimationFrame(frame);
  };
  const pause = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  // Start, pause while off screen
  resize();
  loadLogo();
  frame();
  new IntersectionObserver(([e]) => (e.isIntersecting ? play() : pause())).observe(hero);
  new ResizeObserver(() => {
    resize();
    if (!running) frame();
  }).observe(hero);
})();
