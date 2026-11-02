/* Road to Lolla · arte generado en el navegador
   - Multitudes de festival en escala de grises (el color lo pone el CSS, como duotono).
     Son provisorias: cuando estén las fotos de Firefly, se cargan en data.js (campo img).
   - Bordes de papel rasgado.
   - Tarjeta para compartir la bandera (1080 x 1920, formato historia/TikTok). */

window.RTL = window.RTL || {};

(function () {
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---------- Multitud de festival ---------- */
  function drawCrowd(ctx, w, h, seed, kind) {
    const r = rng(seed);
    const R = (a, b) => a + r() * (b - a);

    // cielo y resplandor del escenario
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, '#8d8d8d'); sky.addColorStop(0.5, '#3b3b3b'); sky.addColorStop(1, '#0c0c0c');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
    const gx = w * R(0.3, 0.7);
    const glow = ctx.createRadialGradient(gx, h * 0.2, 0, gx, h * 0.2, w * 0.75);
    glow.addColorStop(0, 'rgba(255,255,255,.75)'); glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h);

    // haces de luz
    ctx.globalCompositeOperation = 'lighter';
    const beams = kind === 'perrys' ? 9 : 6;
    for (let i = 0; i < beams; i++) {
      const x0 = gx + R(-w * 0.25, w * 0.25), y0 = h * R(0.05, 0.2);
      const dx = R(-w * 0.9, w * 0.9), spread = R(w * 0.04, w * 0.14);
      ctx.fillStyle = `rgba(255,255,255,${R(0.05, 0.13).toFixed(3)})`;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + dx - spread, h); ctx.lineTo(x0 + dx + spread, h); ctx.closePath(); ctx.fill();
    }
    if (kind === 'perrys') { // láseres
      ctx.lineWidth = Math.max(1, w * 0.002);
      for (let i = 0; i < 14; i++) {
        ctx.strokeStyle = `rgba(255,255,255,${R(0.25, 0.6).toFixed(2)})`;
        ctx.beginPath(); ctx.moveTo(gx, h * 0.15); ctx.lineTo(R(-w * 0.2, w * 1.2), h * R(0.2, 0.7)); ctx.stroke();
      }
    }
    // bokeh
    for (let i = 0; i < 70; i++) {
      ctx.fillStyle = `rgba(255,255,255,${R(0.15, 0.7).toFixed(2)})`;
      ctx.beginPath(); ctx.arc(R(0, w), R(0, h * 0.58), R(1, w * 0.01), 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    if (kind === 'indie') { // guirnaldas de luces
      for (let k = 0; k < 2; k++) {
        const y = h * (0.12 + k * 0.14), sag = h * 0.08;
        ctx.strokeStyle = 'rgba(20,20,20,.8)'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-10, y); ctx.quadraticCurveTo(w / 2, y + sag * 2, w + 10, y); ctx.stroke();
        for (let t = 0.02; t < 1; t += 0.06) {
          const x = t * w, yy = (1 - t) * (1 - t) * y + 2 * (1 - t) * t * (y + sag * 2) + t * t * y;
          ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.beginPath(); ctx.arc(x, yy + 6, w * 0.007, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,.18)'; ctx.beginPath(); ctx.arc(x, yy + 6, w * 0.02, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
    if (kind === 'rock') { // llamaradas del escenario
      for (let i = 0; i < 5; i++) {
        const x = w * (0.12 + i * 0.19), base = h * 0.56, fh = h * R(0.18, 0.3);
        const g = ctx.createLinearGradient(0, base - fh, 0, base);
        g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,.85)');
        ctx.fillStyle = g; ctx.beginPath();
        ctx.moveTo(x - w * 0.03, base);
        ctx.quadraticCurveTo(x - w * 0.04, base - fh * 0.5, x, base - fh);
        ctx.quadraticCurveTo(x + w * 0.04, base - fh * 0.5, x + w * 0.03, base); ctx.fill();
      }
    }
    if (kind === 'urban') { // humo
      for (let i = 0; i < 9; i++) {
        const sx = R(0, w), sy = h * R(0.3, 0.6), sr = w * R(0.12, 0.3);
        const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
        g.addColorStop(0, 'rgba(255,255,255,.16)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.fillRect(sx - sr, sy - sr, sr * 2, sr * 2);
      }
    }

    // filas de público
    const rows = [
      { y: 0.6, s: 0.016, c: '#2d2d2d', n: 34, rim: 0.12 },
      { y: 0.72, s: 0.028, c: '#171717', n: 20, rim: 0.22 },
      { y: 0.88, s: 0.05, c: '#060606', n: 11, rim: 0.3 }
    ];
    const phones = kind === 'urban' ? 0.35 : 0.14;
    rows.forEach(row => {
      for (let i = 0; i < row.n; i++) {
        const x = (i + R(-0.4, 0.4)) * (w / (row.n - 1));
        const s = w * row.s * R(0.85, 1.2), y = h * row.y + R(-s, s);
        ctx.fillStyle = row.c; ctx.strokeStyle = row.c; ctx.lineCap = 'round';
        // cuerpo
        ctx.beginPath();
        ctx.moveTo(x - s * 1.9, h + 2);
        ctx.quadraticCurveTo(x - s * 2, y + s * 0.4, x - s * 0.7, y + s * 0.1);
        ctx.lineTo(x + s * 0.7, y + s * 0.1);
        ctx.quadraticCurveTo(x + s * 2, y + s * 0.4, x + s * 1.9, h + 2);
        ctx.closePath(); ctx.fill();
        // cabeza
        ctx.beginPath(); ctx.arc(x, y - s * 0.9, s, 0, Math.PI * 2); ctx.fill();
        // luz de contorno
        ctx.strokeStyle = `rgba(255,255,255,${row.rim})`; ctx.lineWidth = Math.max(1, s * 0.12);
        ctx.beginPath(); ctx.arc(x, y - s * 0.9, s, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
        ctx.strokeStyle = row.c;
        // brazos arriba
        const arms = r();
        if (arms < 0.45) {
          const sides = arms < 0.2 ? [-1, 1] : [r() < 0.5 ? -1 : 1];
          sides.forEach(sd => {
            const hx = x + sd * s * R(1.4, 3.2), hy = y - s * R(3.2, 5.2);
            ctx.lineWidth = s * 0.7;
            ctx.beginPath(); ctx.moveTo(x + sd * s * 1.1, y + s * 0.4);
            ctx.quadraticCurveTo(x + sd * s * 1.6, y - s * 1.6, hx, hy); ctx.stroke();
            ctx.beginPath(); ctx.arc(hx, hy, s * 0.45, 0, Math.PI * 2); ctx.fill();
            if (r() < phones && row.s > 0.02) {
              ctx.fillStyle = 'rgba(235,235,235,.95)';
              ctx.fillRect(hx - s * 0.32, hy - s * 1.15, s * 0.64, s * 1.0);
              ctx.fillStyle = row.c;
            }
            if (kind === 'rock' && r() < 0.5) { // cuernos
              ctx.lineWidth = s * 0.22;
              ctx.beginPath(); ctx.moveTo(hx - s * 0.25, hy); ctx.lineTo(hx - s * 0.35, hy - s * 0.9);
              ctx.moveTo(hx + s * 0.25, hy); ctx.lineTo(hx + s * 0.35, hy - s * 0.9); ctx.stroke();
            }
          });
        }
        // visera o gorra
        if ((kind === 'perrys' || kind === 'urban') && r() < 0.3) {
          ctx.beginPath(); ctx.ellipse(x + s * 0.5, y - s * 1.35, s * 0.9, s * 0.22, -0.1, 0, Math.PI * 2); ctx.fill();
        }
      }
    });
    // una bandera en la multitud
    const fx = w * R(0.2, 0.8), fy = h * 0.55;
    ctx.strokeStyle = '#0a0a0a'; ctx.lineWidth = w * 0.006;
    ctx.beginPath(); ctx.moveTo(fx, h * 0.9); ctx.lineTo(fx, fy - h * 0.12); ctx.stroke();
    ctx.fillStyle = '#1a1a1a'; ctx.beginPath();
    ctx.moveTo(fx, fy - h * 0.12);
    ctx.quadraticCurveTo(fx + w * 0.1, fy - h * 0.16, fx + w * 0.2, fy - h * 0.11);
    ctx.lineTo(fx + w * 0.19, fy - h * 0.02);
    ctx.quadraticCurveTo(fx + w * 0.1, fy - h * 0.06, fx, fy - h * 0.02); ctx.closePath(); ctx.fill();

    // grano
    const img = ctx.getImageData(0, 0, w, h), d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (r() - 0.5) * 34;
      d[i] = d[i + 1] = d[i + 2] = Math.max(0, Math.min(255, d[i] + n));
    }
    ctx.putImageData(img, 0, 0);
  }

  const cache = {};
  RTL.crowdArt = function (seed, kind, w, h) {
    w = w || 640; h = h || 640;
    const key = [seed, kind, w, h].join('-');
    if (cache[key]) return cache[key];
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    drawCrowd(c.getContext('2d'), w, h, seed, kind);
    cache[key] = c.toDataURL('image/jpeg', 0.84);
    return cache[key];
  };

  /* ---------- Papel rasgado ---------- */
  RTL.tearSVG = function (seed, fill) {
    const r = rng(seed), W = 1440, H = 54;
    let top = 'M0 ' + (10 + r() * 10), bottom = '';
    for (let x = 0; x <= W; x += 8 + r() * 22) top += ` L${x.toFixed(1)} ${(4 + r() * 16).toFixed(1)}`;
    top += ` L${W} ${(6 + r() * 10).toFixed(1)}`;
    const pts = [];
    for (let x = W; x >= 0; x -= 8 + r() * 22) pts.push(`L${x.toFixed(1)} ${(30 + r() * 18).toFixed(1)}`);
    bottom = pts.join(' ') + ' L0 40 Z';
    const d = top + ' ' + bottom;
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="${d}" fill="#000" opacity=".55" transform="translate(0 4)"/>
      <path d="${d}" fill="${fill}"/>
      <path d="${d}" fill="none" stroke="#8f897f" stroke-width="1.2" opacity=".7"/>
    </svg>`;
  };

  /* ---------- Tarjeta para compartir ---------- */
  function wrap(ctx, text, maxW) {
    const words = text.split(' '), lines = []; let line = '';
    words.forEach(wd => {
      const t = line ? line + ' ' + wd : wd;
      if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = wd; } else line = t;
    });
    if (line) lines.push(line);
    return lines;
  }
  RTL.shareCard = async function (f) {
    try { await Promise.all([document.fonts.load('120px "Permanent Marker"'), document.fonts.load('700 60px "Barlow Condensed"')]); } catch (e) { /* sigue con la fuente de respaldo */ }
    const W = 1080, H = 1920, c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    ctx.fillStyle = f.color; ctx.fillRect(0, 0, W, H);
    const art = new Image(); art.src = f.img || RTL.crowdArt(f.seed, f.id, 900, 1100);
    await new Promise(res => { art.onload = res; art.onerror = res; });
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(art, 0, H - 1320, W, 1320);
    ctx.globalCompositeOperation = 'source-over';
    const fade = ctx.createLinearGradient(0, 0, 0, H);
    fade.addColorStop(0, 'rgba(11,10,12,.85)'); fade.addColorStop(0.35, 'rgba(11,10,12,0)'); fade.addColorStop(0.75, 'rgba(11,10,12,0)'); fade.addColorStop(1, 'rgba(11,10,12,.9)');
    ctx.fillStyle = fade; ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = '#fff'; ctx.textBaseline = 'alphabetic';
    ctx.font = '72px "Permanent Marker", sans-serif'; ctx.fillText('Road to', 90, 200);
    ctx.font = '150px "Permanent Marker", sans-serif'; ctx.fillText('Lolla', 90, 340);

    // ícono de la Facción
    ctx.save(); ctx.translate(W / 2 - 190, 520); ctx.scale(380 / 48, 380 / 48);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    (RTL.ICONS[f.icon] || []).forEach(p => ctx.stroke(new Path2D(p)));
    ctx.restore();

    // franja rosa
    ctx.save(); ctx.translate(W / 2, 1040); ctx.rotate(-0.035);
    ctx.fillStyle = '#FF2E7E'; ctx.fillRect(-430, -64, 860, 118);
    ctx.fillStyle = '#16000A'; ctx.font = '62px "Permanent Marker", sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Mi música es mi bandera', 0, 16); ctx.restore();

    ctx.textAlign = 'center'; ctx.fillStyle = '#fff';
    ctx.font = '64px "Permanent Marker", sans-serif'; ctx.fillText(f.pre, W / 2, 1240);
    ctx.font = '150px "Permanent Marker", sans-serif';
    wrap(ctx, f.short.toUpperCase(), 900).forEach((ln, i) => ctx.fillText(ln, W / 2, 1400 + i * 150));

    ctx.font = '700 58px "Barlow Condensed", sans-serif';
    ctx.fillText(`#RoadToLolla   ${f.tag}`, W / 2, 1720);
    ctx.font = '600 36px "Barlow Condensed", sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.85)';
    ctx.fillText('Descubrí tu Facción · 12, 13 y 14 de marzo · Hipódromo de San Isidro', W / 2, 1790);
    ctx.font = '500 26px "Barlow Condensed", sans-serif'; ctx.fillStyle = 'rgba(255,255,255,.6)';
    ctx.fillText('Prototipo académico · imagen generada', W / 2, 1850);
    return c;
  };
})();
