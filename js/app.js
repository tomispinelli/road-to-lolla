/* Road to Lolla · lógica del prototipo */
(function () {
  'use strict';
  const { ICONS, FACTIONS, ORDER, QUESTIONS, ZONES, TIMELINE, GOAL, CLIPS } = window.RTL;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const fmt = n => Number(n).toLocaleString('es-AR');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const icon = (name, cls = '') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  const fVars = f => `--fc:${f.color};--fon:${f.on}`;

  /* ---------- Sprite de íconos ---------- */
  const sprite = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  sprite.setAttribute('aria-hidden', 'true'); sprite.style.display = 'none';
  sprite.innerHTML = Object.entries(ICONS).map(([k, paths]) =>
    `<symbol id="i-${k}" viewBox="0 0 48 48">${paths.map(d => `<path d="${d}"/>`).join('')}</symbol>`).join('');
  document.body.prepend(sprite);

  /* ---------- Estado (se guarda solo en este navegador) ---------- */
  const KEY = 'rtl-prototipo-v1';
  const blank = () => ({ faction: null, changes: 1, answers: [], subscribed: false, t: 0 });
  let state = blank();
  try { state = Object.assign(blank(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { /* sin almacenamiento */ }
  if (!FACTIONS[state.faction]) state.faction = null;
  if (!(state.t >= 0 && state.t < TIMELINE.length)) state.t = 0;
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* modo privado */ } };
  const T = () => TIMELINE[state.t];
  const mine = () => (state.faction ? FACTIONS[state.faction] : null);

  /* ---------- Avisos ---------- */
  let toastTimer;
  function toast(msg) {
    const el = $('#toast'); el.textContent = msg; el.classList.add('is-on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('is-on'), 3600);
  }

  /* ---------- Papel rasgado ---------- */
  $$('[data-tear]').forEach(el => { el.innerHTML = RTL.tearSVG(+el.dataset.tear, el.dataset.fill || '#D9D4CA'); });

  /* =========================================================
     FACCIONES
     ========================================================= */
  function renderCards() {
    $('#factionCards').innerHTML = ORDER.map(id => {
      const f = FACTIONS[id], isMine = state.faction === id;
      return `<a class="card ${isMine ? 'is-mine' : ''}" href="#/barrio/${id}" style="${fVars(f)}" aria-label="${f.name}: ${f.tagline} Entrar al barrio">
        <img class="card__art" src="${f.img || RTL.crowdArt(f.seed, id, 640, 800)}" alt="" loading="lazy">
        ${isMine ? '<span class="card__mine">Tu bandera</span>' : ''}
        ${icon(f.icon, 'card__icon')}
        <span class="card__pre">${f.pre}</span>
        <span class="card__name">${f.short}</span>
        <span class="card__genres">${f.genres}</span>
        <p class="card__tag">${f.tagline}</p>
        <span class="btn btn--ghost btn--sm">Entrá al barrio ${icon('chevron')}</span>
      </a>`;
    }).join('');
  }

  /* =========================================================
     EL PREDIO (mapa)
     ========================================================= */
  const MAP = {
    indie: { x: 240, y: 142 }, perrys: { x: 540, y: 142 },
    rock: { x: 240, y: 348 }, urban: { x: 540, y: 348 }
  };
  const ZPOS = {
    tribuna: { x: 390, y: 4, w: 220, h: 32, lx: 500, ly: 26 },
    paddock: { x: 108, y: 255, w: 112, h: 100, lx: 164, ly: 312 },
    largada: { x: 780, y: 255, w: 112, h: 100, lx: 836, ly: 312 },
    disco: { x: 468, y: 516, w: 64, h: 54, lx: 500, ly: 604 }
  };
  let selected = null;

  function buildMap() {
    const defs = $('#mapSvg defs');
    ORDER.forEach(id => {
      const f = FACTIONS[id];
      defs.insertAdjacentHTML('beforeend', `<radialGradient id="g-${id}"><stop offset="0" stop-color="${f.color}" stop-opacity=".95"/><stop offset="1" stop-color="${f.color}" stop-opacity="0"/></radialGradient>`);
    });
    $('#mapBarrios').innerHTML = ORDER.map(id => {
      const f = FACTIONS[id], p = MAP[id], w = 220, h = 120;
      const tents = [0, 1, 2, 3].map(i => {
        const tx = p.x + 22 + i * 40, ty = p.y + h - 16;
        return `<path d="M${tx} ${ty}l17-32 17 32z" fill="${f.color}" fill-opacity="${0.55 + i * 0.1}"/><path d="M${tx + 13} ${ty}l4-9 4 9z" fill="#0B0A0C"/>`;
      }).join('');
      const px = p.x + w - 34;
      return `<g class="mb" data-id="${id}" tabindex="0" role="button" aria-label="Barrio ${f.name}">
        <circle class="mb__glow" cx="${p.x + w / 2}" cy="${p.y + h / 2}" r="150" fill="url(#g-${id})" opacity=".4"/>
        <g class="mb__shape">
          <rect class="mb__ring" x="${p.x}" y="${p.y}" width="${w}" height="${h}" rx="22" fill="${f.color}" fill-opacity=".18" stroke="${f.color}" stroke-width="3"/>
          ${tents}
          <path d="M${px} ${p.y + h - 14}V${p.y + 18}" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
          <path class="mb__flag" d="M${px} ${p.y + 19}c10-6 18 4 28-1v20c-10 5-18-5-28 1z" fill="${f.color}" stroke="#fff" stroke-width="1.5"/>
          <text class="map-label" x="${p.x + 18}" y="${p.y + 40}">${f.short}</text>
        </g>
      </g>`;
    }).join('');
    $('#mapZones').innerHTML = Object.entries(ZONES).map(([k, z]) => {
      const p = ZPOS[k];
      const fill = k === 'disco' ? 'url(#checks)' : '#2A2630';
      return `<g class="mz" data-zone="${k}" tabindex="0" role="button" aria-label="${z.name}">
        <rect class="mz__ring" x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="10" fill="${fill}" stroke="#D6A53A" stroke-opacity=".7" stroke-width="2" stroke-dasharray="${k === 'disco' ? '0' : '6 5'}"/>
        <g class="mz__body">
          <text class="map-mini" x="${p.lx}" y="${p.ly}" text-anchor="middle" style="fill:#f4f1ea">${z.name}</text>
        </g>
        <g class="mz__lock" transform="translate(${k === 'tribuna' ? p.x + 8 : p.lx - 11} ${k === 'tribuna' ? p.y + 5 : k === 'disco' ? p.y + 14 : p.y + 16}) scale(.46)">
          <rect x="0" y="0" width="48" height="48" rx="12" fill="#0B0A0C" opacity=".85"/>
          ${ICONS.lock.map(d => `<path d="${d}" fill="none" stroke="#D6A53A" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}
        </g>
      </g>`;
    }).join('');

    const onPick = el => { const id = el.dataset.id || el.dataset.zone; selectMap(id, !!el.dataset.zone); };
    $$('.mb, .mz', $('#mapSvg')).forEach(el => {
      el.addEventListener('click', () => onPick(el));
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(el); } });
    });
  }

  function ranking() {
    const e = T().energy;
    return ORDER.slice().sort((a, b) => e[b] - e[a]);
  }

  function renderMap() {
    const t = T(), e = t.energy, max = Math.max(...Object.values(e));
    $$('.mb').forEach(g => {
      const id = g.dataset.id, f = FACTIONS[id];
      $('.mb__glow', g).setAttribute('opacity', (0.15 + 0.65 * (e[id] / max)).toFixed(2));
      g.setAttribute('aria-label', `Barrio ${f.name}: ${fmt(e[id])} de energía${state.faction === id ? ', tu barrio' : ''}`);
    });
    $$('.mz').forEach(g => {
      const z = ZONES[g.dataset.zone], open = z.unlock <= t.step;
      g.classList.toggle('is-locked', !open);
      $('.mz__lock', g).style.display = open ? 'none' : '';
      g.setAttribute('aria-label', `${z.name}: ${open ? 'abierta' : 'se desbloquea el ' + z.when}`);
    });
    // lista accesible (y cómoda en el celular)
    const items = ORDER.map(id => ({ id, zone: false, label: FACTIONS[id].short, f: FACTIONS[id] }))
      .concat(Object.keys(ZONES).map(k => ({ id: k, zone: true, label: ZONES[k].name, locked: ZONES[k].unlock > t.step })));
    $('#zoneList').innerHTML = items.map(it => `<button type="button" class="zchip ${it.locked ? 'is-locked' : ''}" role="listitem" data-pick="${it.id}" data-zone="${it.zone ? 1 : ''}" aria-pressed="${selected === it.id}" ${it.f ? `style="${fVars(it.f)}"` : ''}>
      ${it.zone ? icon(it.locked ? 'lock' : 'pin') : '<i></i>'}${it.label}</button>`).join('');
    $$('#zoneList .zchip').forEach(b => b.addEventListener('click', () => selectMap(b.dataset.pick, !!b.dataset.zone)));
    if (selected) selectMap(selected, !!ZONES[selected], true);
  }

  function selectMap(id, isZone, silent) {
    selected = id;
    $$('.mb, .mz').forEach(g => g.classList.toggle('is-selected', (g.dataset.id || g.dataset.zone) === id));
    $$('#zoneList .zchip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.pick === id)));
    const panel = $('#mapPanel'), t = T();
    if (isZone) {
      const z = ZONES[id], open = z.unlock <= t.step;
      panel.style.cssText = '';
      panel.innerHTML = `<p class="kicker">Zona del Predio</p><h3 class="panel__title">${z.name}</h3>
        ${open ? `<p>${z.text}</p><p class="panel__lock" style="color:#7CF0A6">${icon('check')} Abierta</p>`
               : `<p class="panel__lock">${icon('lock')} Se desbloquea el ${z.when}</p><p>Cada miércoles se abre una zona nueva. Seguí el Diario para enterarte primero.</p>`}`;
    } else {
      const f = FACTIONS[id], e = t.energy, max = Math.max(...Object.values(e)), rank = ranking().indexOf(id) + 1;
      panel.style.cssText = fVars(f);
      panel.innerHTML = `<p class="kicker">Barrio${state.faction === id ? ' · tu bandera' : ''}</p>
        <h3 class="panel__title">${f.short}</h3>
        <p>${f.barrio}</p>
        <p class="kicker" style="margin-top:6px">Energía · ${t.label}</p>
        <div class="panel__meter"><span style="width:${Math.round(e[id] / max * 100)}%"></span></div>
        <p><b>${fmt(e[id])}</b> puntos · ${rank}.º puesto${t.final && t.winner === id ? ' · ganó la previa' : ''}</p>
        <div class="panel__actions"><a class="btn btn--faction" href="#/barrio/${id}">Entrá al barrio ${icon('chevron')}</a></div>`;
    }
    if (!silent && window.innerWidth < 900) panel.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
  }

  /* =========================================================
     MARCADOR
     ========================================================= */
  let scoreSeen = reduced;
  function renderScore() {
    const t = T(), e = t.energy, order = ranking(), max = Math.max(...Object.values(e));
    $('#scoreBars').innerHTML = order.map((id, i) => {
      const f = FACTIONS[id];
      return `<li class="bar ${i === 0 ? 'is-leader' : ''} ${state.faction === id ? 'is-mine' : ''}" style="${fVars(f)}">
        <span class="bar__ic">${icon(f.icon)}</span>
        <span class="bar__name">${f.short}${i === 0 ? icon('crown') : ''}</span>
        <span class="bar__val">${fmt(e[id])}</span>
        <span class="bar__track"><span data-w="${Math.round(e[id] / max * 100)}"></span></span>
      </li>`;
    }).join('');
    const pct = Math.min(100, t.tests / GOAL * 100);
    $('#goalBar').setAttribute('aria-valuenow', t.tests);
    $('#goalText').textContent = t.tests >= GOAL
      ? '¡Meta cumplida! Entre las cuatro Facciones pasaron las 40.000 banderas y la sorpresa quedó desbloqueada para todas.'
      : `Faltan ${fmt(GOAL - t.tests)} banderas. Si entre las cuatro Facciones llegan a 40.000, se abre una sorpresa para todas. Ninguna gana sola.`;
    if (scoreSeen) paintScore(pct, t.tests); else { $('#goalNum').textContent = '0'; }
  }
  function paintScore(pct, tests) {
    $$('#scoreBars [data-w]').forEach(s => { s.style.width = s.dataset.w + '%'; });
    $('#goalBar span').style.width = pct + '%';
    countTo($('#goalNum'), tests);
  }
  function countTo(el, to) {
    const from = parseInt((el.textContent || '0').replace(/\D/g, ''), 10) || 0;
    if (reduced) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), d = 1100;
    const step = now => {
      const k = Math.min(1, (now - t0) / d), v = Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      el.textContent = fmt(v); if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* =========================================================
     DESAFÍOS
     ========================================================= */
  function renderReto() {
    const r = T().reto;
    $('#retoKicker').textContent = r.n ? `Reto de la semana ${r.n > 4 ? 'final' : r.n} · ${r.range}` : `Epílogo · ${r.range}`;
    $('#reto-title').textContent = r.title;
    $('#retoBases').innerHTML = `<dt>Qué</dt><dd>${r.what}</dd><dt>Con qué</dt><dd>${r.with}</dd><dt>Hasta</dt><dd>${r.until}</dd><dt>Suma</dt><dd>${r.how}</dd>`;
    const btn = $('[data-action="tiktok"]');
    btn.querySelector('span').textContent = T().final ? 'Ver la galería' : 'Sumá energía en TikTok';
  }
  function renderClips() {
    $('#clips').innerHTML = CLIPS.map((c, i) => {
      const f = FACTIONS[c.f];
      return `<figure class="clip" style="${fVars(f)}">
        <img src="${RTL.crowdArt(f.seed + 100 + i, c.f, 360, 640)}" alt="" loading="lazy">
        <div class="clip__top"><span>TikTok</span><span class="clip__chip">${f.short}</span></div>
        <span class="clip__play">${icon('play')}</span>
        <span class="clip__likes"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-8-5.3-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.7-8 11-8 11z"/></svg>${c.likes}</span>
        <figcaption class="clip__bottom"><b>${c.user}</b>${c.text} <span>#RoadToLolla ${f.tag}</span></figcaption>
      </figure>`;
    }).join('');
  }

  /* =========================================================
     CUENTA REGRESIVA, DIARIO, PROTOTIPO
     ========================================================= */
  function renderCountdown() {
    const t = T();
    if (t.final) { $('#cdPre').textContent = 'Nos vemos en'; $('#cdNum').textContent = '2028'; $('#cdUnit').textContent = ''; return; }
    $('#cdPre').textContent = t.days === 1 ? 'Queda' : 'Quedan';
    $('#cdNum').textContent = t.days;
    $('#cdUnit').textContent = t.days === 1 ? 'día' : 'días';
  }
  function renderDiario() {
    const t = T(), d = t.diario, f = mine() || FACTIONS[ORDER[t.step % 4]];
    $('#dEd').textContent = `Edición N.º ${d.ed}${mine() ? ' · ' + mine().short : ''}`;
    $('#dFecha').textContent = d.fecha;
    $('#dTitle').textContent = d.title;
    $('#dBajada').textContent = d.bajada;
    $('#dCartaKicker').textContent = mine() ? 'Carta de tu referente' : `Carta de la semana · ${f.short}`;
    $('#dCarta').textContent = `“${f.carta}”`;
    $('#dFirma').textContent = `— ${f.referente}, ${f.name}`;
  }
  function renderTimelineUI() {
    const t = T();
    $('#weekPill').textContent = t.step < 4 ? `Semana ${t.step + 1} de 4` : t.final ? 'Epílogo' : 'Víspera del festival';
    $('#demoLabel').textContent = t.label;
    $('#demoSteps').innerHTML = TIMELINE.map((s, i) => `<button type="button" class="demo__step" role="radio" aria-checked="${i === state.t}" data-t="${i}"><b>${s.label}</b><small>${s.date}</small></button>`).join('');
    $$('#demoSteps .demo__step').forEach(b => b.addEventListener('click', () => setTime(+b.dataset.t)));
    const ep = $('#heroEpilogo');
    if (t.final) { ep.hidden = false; ep.textContent = `Epílogo · Ganó ${FACTIONS[t.winner].name} · Las Facciones vuelven en 2028`; } else ep.hidden = true;
  }
  function renderAll() {
    renderCards(); renderMap(); renderScore(); renderReto(); renderCountdown(); renderDiario(); renderTimelineUI(); renderIdentity();
  }
  function setTime(i) {
    state.t = i; save(); renderAll();
    toast(`Simulando: ${T().label} (${T().date})`);
  }

  /* ---------- Identidad del usuario: header, CTAs ---------- */
  function renderIdentity() {
    const f = mine(), badge = $('#myBadge');
    if (f) {
      badge.hidden = false; badge.style.cssText = fVars(f); badge.href = `#/barrio/${f.id}`;
      $('#myBadgeName').textContent = f.short;
      $('.mybadge__dot', badge).innerHTML = icon(f.icon);
    } else badge.hidden = true;
    $$('[data-primary-cta]').forEach(a => {
      a.href = f ? `#/barrio/${f.id}` : '#/test';
      $('[data-cta-label]', a).textContent = f ? 'Entrá a tu barrio' : 'Descubrí tu Facción';
    });
    $('#heroHint').textContent = f ? `Tu bandera: ${f.name}` : '5 preguntas · menos de un minuto';
  }

  /* =========================================================
     CAPAS: test, barrio y modales
     ========================================================= */
  let lenis = null, openLayer = null, lastFocus = null, cameFromInside = false;
  const testLayer = $('#testLayer'), barrioLayer = $('#barrioLayer'), modal = $('#modal');
  [testLayer, barrioLayer, modal, $('#demoPanel'), $('#mobileMenu')].forEach(el => el.setAttribute('data-lenis-prevent', ''));

  function lock(on) {
    document.body.classList.toggle('is-locked', on);
    if (lenis) on ? lenis.stop() : lenis.start();
    updateSticky();
  }
  function showLayer(layer) {
    if (openLayer && openLayer !== layer) openLayer.hidden = true;
    if (!openLayer) lastFocus = document.activeElement;
    openLayer = layer; layer.hidden = false; layer.scrollTop = 0;
    layer.classList.remove('is-in'); void layer.offsetWidth; layer.classList.add('is-in');
    lock(true);
  }
  function hideLayers() {
    if (!openLayer) return;
    openLayer.hidden = true; openLayer = null; lock(false);
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }
  function closeLayer() {
    if (cameFromInside) { cameFromInside = false; history.back(); }
    else { history.replaceState(null, '', location.pathname + location.search); route(); }
  }
  function goto(hash) { history.replaceState(null, '', hash); route(); }

  /* ---------- Router ---------- */
  function route() {
    const h = location.hash;
    if (h === '#/test') return openTest();
    if (h.startsWith('#/barrio')) {
      let id = h.split('/')[2];
      if (!FACTIONS[id]) id = state.faction;
      if (!id) return goto('#/test');
      return openBarrio(id);
    }
    hideLayers();
  }
  window.addEventListener('hashchange', () => { cameFromInside = true; route(); });

  /* ---------- Test ---------- */
  let test = null;
  function shuffle(a) { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; }
  function openTest() {
    showLayer(testLayer);
    if (state.faction) return showResult(state.faction, false);
    test = { i: 0, picks: [], orders: QUESTIONS.map(() => shuffle(ORDER)) };
    renderQuestion();
  }
  function setProgress(text, pct, back) {
    $('#testCount').textContent = text; $('#testFill').style.width = pct + '%';
    $('#testBack').style.visibility = back ? 'visible' : 'hidden';
    $('#testBack').disabled = !back;
  }
  function renderQuestion() {
    const q = QUESTIONS[test.i], order = test.orders[test.i], picked = test.picks[test.i];
    setProgress(`Pregunta ${test.i + 1} de ${QUESTIONS.length}`, (test.i + 1) / QUESTIONS.length * 100, test.i > 0);
    $('#testBody').innerHTML = `<h2 class="q" id="testQ" tabindex="-1">${q.q}</h2>
      <div class="answers" role="group" aria-labelledby="testQ">
        ${order.map((k, n) => `<button type="button" class="answer ${picked === k ? 'is-picked' : ''}" data-k="${k}"><kbd>${n + 1}</kbd><span>${q.a[k]}</span></button>`).join('')}
      </div>
      <p class="test__hint">Elegí la que más se parezca a vos. En la compu podés usar las teclas 1 a 4.</p>`;
    $$('.answer', testLayer).forEach(b => b.addEventListener('click', () => pick(b.dataset.k)));
    if (window.gsap && !reduced) {
      gsap.from('#testQ', { y: 24, opacity: 0, duration: .45, ease: 'power3.out' });
      gsap.from('.answer', { y: 30, opacity: 0, duration: .45, stagger: .06, ease: 'power3.out', delay: .05 });
    }
    $('#testQ').focus({ preventScroll: true });
  }
  function pick(k) {
    if (!test || test.busy) return;
    test.picks[test.i] = k; test.busy = true;
    $$('.answer', testLayer).forEach(b => b.classList.toggle('is-picked', b.dataset.k === k));
    setTimeout(() => {
      test.busy = false;
      if (test.i < QUESTIONS.length - 1) { test.i++; renderQuestion(); } else finishTest();
    }, 320);
  }
  function finishTest() {
    setProgress('Listo', 100, false);
    $('#testBody').innerHTML = `<div class="loading" role="status">
      <div class="loading__flags">${ORDER.map(id => `<span style="--fc:${FACTIONS[id].color}"></span>`).join('')}</div>
      <p>Calculando tu bandera…</p></div>`;
    const picks = test.picks.slice();
    setTimeout(() => {
      const count = {}; ORDER.forEach(id => { count[id] = 0; }); picks.forEach(k => count[k]++);
      const top = Math.max(...Object.values(count));
      const tied = ORDER.filter(id => count[id] === top);
      let win = tied[0];
      if (tied.length > 1) { // desempate: la respuesta de música (pregunta 2) y después la última elegida
        if (tied.includes(picks[1])) win = picks[1];
        else for (let i = picks.length - 1; i >= 0; i--) if (tied.includes(picks[i])) { win = picks[i]; break; }
      }
      state.faction = win; state.changes = 1; state.answers = picks; save();
      renderAll(); showResult(win, true);
    }, reduced ? 300 : 1500);
  }
  function showResult(id, fresh) {
    const f = FACTIONS[id], picks = state.answers || [];
    setProgress(fresh ? 'Tu resultado' : 'Tu bandera', 100, false);
    const matched = picks.map((k, i) => (k === id ? QUESTIONS[i].a[k] : null)).filter(Boolean).slice(0, 2);
    const why = matched.length
      ? `Elegiste «${matched[0]}»${matched[1] ? ` y «${matched[1]}»` : ''}. Eso suena a ${f.call}.`
      : `Tus respuestas se repartieron, pero la música te llevó a ${f.call}.`;
    const aff = picks.length === QUESTIONS.length ? `<ul class="affinity" aria-label="Afinidad con cada Facción">${ORDER.map(k => {
      const p = Math.round(picks.filter(x => x === k).length / picks.length * 100);
      return `<li><em>${FACTIONS[k].short}</em><span><i style="--c:${FACTIONS[k].color};width:${p}%"></i></span><b>${p}%</b></li>`;
    }).join('')}</ul>` : '';
    const changeTxt = state.changes > 0
      ? `<button type="button" class="linkbtn" data-action="switch">¿No te representa? Cambiá de bandera (te queda 1 cambio)</button>`
      : `<span class="fineprint">Ya usaste tu único cambio de bandera.</span>`;
    $('#testBody').innerHTML = `<div class="result" style="${fVars(f)}">
      <div class="result__burst">${icon(f.icon)}</div>
      <p class="result__kicker">${fresh ? 'Tu corazón suena a' : 'Ya tenés bandera'}</p>
      <h2 class="result__name" id="testQ" tabindex="-1">${f.name}</h2>
      <p class="result__line">${f.result}</p>
      <p class="result__why">${why}</p>
      ${aff}
      <div class="result__actions">
        <a class="btn btn--primary btn--lg" href="#/barrio/${id}" data-go-barrio="${id}">Entrá a tu barrio ${icon('chevron')}</a>
        <div class="result__secondary">
          <button type="button" class="linkbtn" data-action="share">Compartí tu bandera</button>
          ${changeTxt}
        </div>
      </div>
    </div>`;
    if (window.gsap && !reduced) {
      gsap.from('.result__burst', { scale: .3, rotate: -25, opacity: 0, duration: .9, ease: 'back.out(1.7)' });
      gsap.from('.result > *:not(.result__burst)', { y: 24, opacity: 0, duration: .5, stagger: .06, delay: .25, ease: 'power3.out' });
    }
    $('#testQ').focus({ preventScroll: true });
  }
  $('#testBack').addEventListener('click', () => { if (test && test.i > 0) { test.i--; renderQuestion(); } });

  /* ---------- Barrio ---------- */
  function openBarrio(id) {
    showLayer(barrioLayer);
    const f = FACTIONS[id], t = T(), e = t.energy, max = Math.max(...Object.values(e));
    const rank = ranking().indexOf(id) + 1, me = mine(), isMine = state.faction === id;
    let cta;
    if (isMine) cta = `<div><h3>${icon('ticket')}¿Ya tenés tu entrada?</h3><p>Abono de 3 días o entrada por día, en cuotas. Te mostramos todo antes de salir a la ticketera.</p></div>
      <button class="btn btn--primary" type="button" data-action="tickets">${icon('ticket')}Comprá tu entrada</button>`;
    else if (!me) cta = `<div><h3>${icon('test')}¿Este es tu barrio?</h3><p>Hacé el test y descubrí a qué Facción pertenecés.</p></div>
      <a class="btn btn--primary" href="#/test">Descubrí tu Facción ${icon('chevron')}</a>`;
    else cta = `<div><h3>${icon('flag')}Tu bandera es ${me.short}</h3><p>Podés visitar los otros barrios, pero tu energía suma para tu Facción.</p></div>
      <a class="btn btn--faction" style="${fVars(me)}" href="#/barrio/${me.id}">Volvé a tu barrio ${icon('chevron')}</a>`;

    $('#barrio').style.cssText = fVars(f);
    $('#barrio').innerHTML = `
      <div class="barrio__hero">
        <img src="${f.img || RTL.crowdArt(f.seed + 7, id, 1280, 720)}" alt="">
        <div class="barrio__top">
          <button class="btn btn--ghost btn--sm" type="button" data-close>${icon('back')}Volvé al Predio</button>
          ${isMine ? '<span class="barrio__visit">Tu barrio</span>' : me ? `<span class="barrio__visit">De visita · tu bandera es ${me.short}</span>` : ''}
        </div>
        <div class="barrio__head">
          <div class="barrio__emblem">${icon(f.icon)}</div>
          <div><p class="barrio__pre">${f.pre}</p><h2 class="barrio__name" id="barrioName" tabindex="-1">${f.short}</h2>
          <p class="barrio__tag">${f.tagline} · ${f.genres}</p></div>
        </div>
      </div>
      <div class="barrio__body">
        <section class="bcard"><h3>${icon('pin')}El barrio</h3><p>${f.barrio}</p><p class="fineprint">Referente: ${f.referente} (personaje de ficción).</p></section>
        <section class="bcard"><h3>${icon('bolt')}Energía · ${t.label}</h3>
          <p class="big-energy">${fmt(e[id])} <small>puntos</small></p>
          <div class="panel__meter"><span style="width:${Math.round(e[id] / max * 100)}%"></span></div>
          <p style="margin-top:10px">${rank}.º puesto del marcador${t.final && t.winner === id ? '. ¡Ganó la previa y su bandera flameó en el ingreso!' : ''}</p></section>
        <section class="bcard"><h3>${icon('flag')}Reto: ${t.reto.title}</h3><p>${t.reto.what}</p><p class="fineprint">${t.reto.with} Hasta: ${t.reto.until}</p>
          <button class="btn btn--ghost btn--sm" type="button" data-action="tiktok">${icon('bolt')}Sumá en TikTok</button></section>
        <section class="bcard"><h3>${icon('mail')}Carta de ${f.referente}</h3><p class="carta">“${f.carta}”</p><p class="fineprint">Sale cada miércoles en el Diario de las Facciones.</p></section>
        <section class="bcard bcard--wide"><h3>${icon('music')}Esta semana suena en el barrio</h3>
          <ul class="artists">${f.artists.map(a => `<li><span>${icon('play')}</span>${a}</li>`).join('')}</ul>
          <p class="fineprint" style="margin-top:10px">Artistas del lineup 2027. En la campaña, cada barrio tiene su playlist oficial en Spotify.</p></section>
        <section class="bcard bcard--wide bcard--cta">${cta}</section>
      </div>`;
    if (window.gsap && !reduced) {
      gsap.from('.barrio__head > *', { y: 40, opacity: 0, duration: .7, stagger: .08, ease: 'power3.out' });
      gsap.from('.bcard', { y: 30, opacity: 0, duration: .55, stagger: .06, delay: .2, ease: 'power3.out' });
    }
    $('#barrioName').focus({ preventScroll: true });
  }

  /* ---------- Modales ---------- */
  let modalLast = null;
  function openModal(html) {
    modalLast = document.activeElement;
    $('#modalBody').innerHTML = html; modal.hidden = false;
    document.body.classList.add('is-locked'); if (lenis) lenis.stop();
    const first = $('#modalBody [autofocus], #modalBody button, #modalBody a', modal);
    (first || $('.modal__x', modal)).focus();
  }
  function closeModal() {
    modal.hidden = true;
    if (!openLayer) { document.body.classList.remove('is-locked'); if (lenis) lenis.start(); }
    if (modalLast && document.contains(modalLast)) modalLast.focus({ preventScroll: true });
  }
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  const MODALS = {
    tickets: () => `<h2 id="modalTitle">Antes de salir</h2>
      <p>Te llevamos a la ticketera oficial de Lollapalooza Argentina. Esto es lo que vas a encontrar:</p>
      <ul class="ticket-list">
        <li><b>Abono 3 días</b><span>12, 13 y 14 de marzo</span></li>
        <li><b>Entrada por día</b><span>Viernes, sábado o domingo</span></li>
        <li><b>Cuotas</b><span>Hasta 6, con bancos adheridos</span></li>
        <li><b>Lolla FAM</b><span>Si fuiste a 5 ediciones o más</span></li>
      </ul>
      <p class="fineprint">El precio final, con el cargo por servicio, lo ves en la ticketera antes de pagar. Road to Lolla no cobra ni guarda datos de pago.</p>
      <div class="modal__actions"><button class="btn btn--primary" type="button" data-action="tickets-go">${icon('ticket')}Ir a la ticketera oficial</button><button class="btn btn--ghost" type="button" data-close>Seguir en el Predio</button></div>`,
    ticketsGo: () => `<h2 id="modalTitle">Fin del recorrido</h2>
      <p>En la campaña real, este botón abre la ticketera oficial con el código de seguimiento de Road to Lolla. Así se miden los clics a «Comprá tu entrada», uno de los KPI del proyecto.</p>
      <p>Gracias por probar el prototipo.</p>
      <div class="modal__actions"><button class="btn btn--primary" type="button" data-close>Volvé al Predio</button></div>`,
    hinchada: () => `<h2 id="modalTitle">Código de la Hinchada</h2>
      <ol>
        <li>Se provoca a favor de tu Facción, nunca contra las personas.</li>
        <li>Cero insultos, discriminación o acoso: ese aporte no suma y se baja.</li>
        <li>La energía se gana creando, nunca atacando.</li>
        <li>Los aportes destacados se eligen con criterios públicos: creatividad, humor y espíritu de hinchada.</li>
        <li>Pedimos lo mínimo: tu mail para el Diario. Si tenés menos de 18, participás con el permiso de una persona adulta.</li>
      </ol>
      <p class="fineprint">Los Capitanes de Facción y el equipo de comunidad moderan con estos criterios todos los días.</p>
      <div class="modal__actions"><button class="btn btn--primary" type="button" data-close>Entendido</button></div>`,
    ia: () => `<h2 id="modalTitle">Uso de IA en este prototipo</h2>
      <ul>
        <li><b>Referencia visual de la landing:</b> mockup generado con ChatGPT (no cuenta como una de las IAs nuevas de la consigna).</li>
        <li><b>Foto principal:</b> recorte provisorio de ese mockup. Las imágenes finales se generan con Adobe Firefly y se rotulan como IA.</li>
        <li><b>Fondos de las Facciones, del barrio y de TikTok:</b> ilustraciones generadas con código en el navegador, provisorias.</li>
        <li><b>Referentes, cartas y usuarios de TikTok:</b> personajes de ficción.</li>
      </ul>
      <div class="modal__actions"><button class="btn btn--primary" type="button" data-close>Cerrar</button></div>`,
    reset: () => `<h2 id="modalTitle">¿Reiniciar el prototipo?</h2>
      <p>Se borran tu Facción, tu cambio de bandera y la suscripción al Diario en este navegador, y la campaña vuelve a la semana 1. Sirve para hacer la prueba con otra persona.</p>
      <div class="modal__actions"><button class="btn btn--primary" type="button" data-action="reset-go">Sí, reiniciar</button><button class="btn btn--ghost" type="button" data-close>Cancelar</button></div>`,
    social: net => `<h2 id="modalTitle">${net}</h2><p>En la campaña real, este enlace lleva a la cuenta oficial de Lollapalooza Argentina en ${net}, donde vive la parte de Road to Lolla que cuenta esa plataforma.</p>
      <div class="modal__actions"><button class="btn btn--primary" type="button" data-close>Entendido</button></div>`
  };

  function openSwitch() {
    const cur = mine(); if (!cur || state.changes < 1) return;
    openModal(`<h2 id="modalTitle">Cambiar de bandera</h2>
      <p>Tenés un solo cambio. Hoy tu bandera es <b>${cur.name}</b>. Elegí la nueva:</p>
      <div class="switch-list">${ORDER.filter(id => id !== cur.id).map(id => `<button type="button" data-switch="${id}" style="${fVars(FACTIONS[id])}"><span>${icon(FACTIONS[id].icon)}</span>${FACTIONS[id].name}</button>`).join('')}</div>`);
    $$('[data-switch]', modal).forEach(b => b.addEventListener('click', () => confirmSwitch(b.dataset.switch)));
  }
  function confirmSwitch(id) {
    const cur = mine(), nf = FACTIONS[id];
    $('#modalBody').innerHTML = `<h2 id="modalTitle">¿Seguro?</h2>
      <p>Vas a pasar de <b>${cur.name}</b> a <b>${nf.name}</b>. Es tu único cambio de bandera: después no se puede volver atrás.</p>
      <div class="modal__actions"><button class="btn btn--faction" style="${fVars(nf)}" type="button" data-do-switch="${id}">Sí, cambiar a ${nf.short}</button><button class="btn btn--ghost" type="button" data-close>Mejor no</button></div>`;
    $('[data-do-switch]', modal).focus();
    $('[data-do-switch]', modal).addEventListener('click', () => {
      state.faction = id; state.changes = 0; save(); renderAll(); closeModal();
      if (openLayer === testLayer) showResult(id, false);
      if (openLayer === barrioLayer) openBarrio(id);
      toast(`Listo: ahora tu bandera es ${nf.name}.`);
    });
  }

  async function openShare() {
    const f = mine(); if (!f) return;
    openModal(`<h2 id="modalTitle">Compartí tu bandera</h2>
      <div class="share-prev"><div id="sharePrev" class="loading"><p style="font-size:20px">Armando tu tarjeta…</p></div>
      <div><p>Una imagen vertical lista para TikTok o historias. Si la subís con <b>#RoadToLolla</b> y <b>${f.tag}</b>, suma energía a tu Facción.</p>
      <div class="modal__actions" id="shareActions"></div></div></div>`);
    const canvas = await RTL.shareCard(f);
    const url = canvas.toDataURL('image/png');
    $('#sharePrev').outerHTML = `<img src="${url}" alt="Tarjeta vertical con la bandera de ${f.name} y el lema Mi música es mi bandera">`;
    const acts = $('#shareActions');
    acts.innerHTML = `<a class="btn btn--primary btn--sm" href="${url}" download="mi-bandera-${f.id}.png">${icon('download')}Descargar</a>
      <button class="btn btn--ghost btn--sm" type="button" data-share-native hidden>${icon('share')}Compartir</button>
      <button class="btn btn--ghost btn--sm" type="button" data-copy>${icon('copy')}Copiar link</button>`;
    canvas.toBlob(blob => {
      if (!blob) return;
      const file = new File([blob], `mi-bandera-${f.id}.png`, { type: 'image/png' });
      const btn = $('[data-share-native]', acts);
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        btn.hidden = false;
        btn.addEventListener('click', () => navigator.share({ files: [file], title: 'Mi bandera en Road to Lolla', text: `Mi música es mi bandera: ${f.name}. #RoadToLolla ${f.tag}` }).catch(() => {}));
      }
    });
    $('[data-copy]', acts).addEventListener('click', async () => {
      const link = location.origin + location.pathname + '#/test';
      try { await navigator.clipboard.writeText(link); toast('Link copiado. Pasáselo a tu grupo.'); }
      catch (e) { toast(link); }
    });
  }

  /* ---------- Acciones por delegación ---------- */
  document.addEventListener('click', e => {
    const closer = e.target.closest('[data-close]');
    if (closer) { e.preventDefault(); if (!modal.hidden && modal.contains(closer)) closeModal(); else closeLayer(); return; }
    // dentro de una capa, pasar a otra capa reemplaza la entrada del historial (el botón "atrás" vuelve a la página)
    const route_ = e.target.closest('a[href^="#/"]');
    if (route_ && openLayer) {
      e.preventDefault();
      if (!modal.hidden) closeModal();
      goto(route_.getAttribute('href'));
      return;
    }
    const el = e.target.closest('[data-action]'); if (!el) return;
    const a = el.dataset.action;
    e.preventDefault();
    if (a === 'tickets') openModal(MODALS.tickets());
    else if (a === 'tickets-go') { $('#modalBody').innerHTML = MODALS.ticketsGo(); $('#modalBody button').focus(); }
    else if (a === 'hinchada') openModal(MODALS.hinchada());
    else if (a === 'ia') openModal(MODALS.ia());
    else if (a === 'reset') openModal(MODALS.reset());
    else if (a === 'reset-go') {
      try { localStorage.removeItem(KEY); } catch (err) { /* nada */ }
      state = blank(); closeModal(); renderAll(); resetForm(); $('#demoPanel').hidden = true; $('#demoBtn').setAttribute('aria-expanded', 'false');
      toast('Prototipo reiniciado. Listo para la próxima persona.');
    }
    else if (a === 'social') openModal(MODALS.social(el.dataset.net));
    else if (a === 'switch') openSwitch();
    else if (a === 'share') openShare();
    else if (a === 'tiktok') toast(T().final ? 'Prototipo: acá se abriría la galería de aportes en TikTok.' : `Prototipo: acá se abriría TikTok con el filtro de ${mine() ? mine().short : 'tu Facción'} y #RoadToLolla.`);
  });

  /* ---------- Teclado ---------- */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!modal.hidden) return closeModal();
      if (openLayer) return closeLayer();
      if (!$('#demoPanel').hidden) { $('#demoPanel').hidden = true; $('#demoBtn').setAttribute('aria-expanded', 'false'); $('#demoBtn').focus(); return; }
      if (!$('#mobileMenu').hidden) return toggleMenu(false);
    }
    if (openLayer === testLayer && modal.hidden && /^[1-4]$/.test(e.key) && test && !state.faction) {
      const b = $$('.answer', testLayer)[+e.key - 1]; if (b) b.click();
    }
    if (e.key === 'Tab') { // foco atrapado en la capa abierta
      const scope = !modal.hidden ? modal : openLayer; if (!scope) return;
      const f = $$('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])', scope).filter(x => x.offsetParent !== null || x === document.activeElement);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* =========================================================
     DIARIO: suscripción (sin enviar datos)
     ========================================================= */
  const form = $('#subForm'), mail = $('#subMail'), msg = $('#subMsg');
  function resetForm() { form.classList.remove('is-done'); mail.value = ''; mail.removeAttribute('aria-invalid'); msg.textContent = ''; msg.className = 'form__msg'; }
  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = mail.value.trim(), btn = $('button', form);
    msg.className = 'form__msg';
    if (!v) { mail.setAttribute('aria-invalid', 'true'); msg.classList.add('is-error'); msg.textContent = 'Escribí tu mail para sumarte.'; mail.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { mail.setAttribute('aria-invalid', 'true'); msg.classList.add('is-error'); msg.textContent = 'Revisá el mail: parece que le falta algo (por ejemplo, el @ o el .com).'; mail.focus(); return; }
    mail.removeAttribute('aria-invalid'); btn.disabled = true; $('span', btn).textContent = 'Sumando…';
    setTimeout(() => {
      btn.disabled = false; $('span', btn).textContent = 'Sumarme';
      state.subscribed = true; save(); form.classList.add('is-done'); msg.classList.add('is-ok');
      msg.textContent = mine() ? `¡Listo! El miércoles te llega el Diario de ${mine().short}.` : '¡Listo! El miércoles te llega el primer Diario. Hacé el test para recibir la edición de tu Facción.';
    }, 900);
  });
  if (state.subscribed) { form.classList.add('is-done'); msg.className = 'form__msg is-ok'; msg.textContent = 'Ya estás en el Diario. Nos vemos el miércoles.'; }

  /* =========================================================
     ENCABEZADO, MENÚ, CTA FIJO, PROTOTIPO
     ========================================================= */
  const topbar = $('#topbar');
  const onScroll = () => topbar.classList.toggle('is-solid', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  function toggleMenu(on) {
    const m = $('#mobileMenu'), b = $('#menuBtn');
    m.hidden = !on; b.setAttribute('aria-expanded', String(on)); b.setAttribute('aria-label', on ? 'Cerrar menú' : 'Abrir menú');
    $('use', b).setAttribute('href', on ? '#i-close' : '#i-menu');
    document.body.classList.toggle('is-locked', on); if (lenis) on ? lenis.stop() : lenis.start();
  }
  $('#menuBtn').addEventListener('click', () => toggleMenu($('#mobileMenu').hidden));

  // anclas internas con desplazamiento suave
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a) return;
    const href = a.getAttribute('href'); if (href.startsWith('#/') || href === '#') return;
    const target = $(href); if (!target) return;
    e.preventDefault();
    if (!$('#mobileMenu').hidden) toggleMenu(false);
    if (openLayer) hideLayers();
    if (lenis) lenis.scrollTo(target, { offset: href === '#inicio' ? 0 : -8, duration: 1.2 });
    else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
  });

  // sección activa en el menú
  const navLinks = $$('[data-nav]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) navLinks.forEach(l => l.classList.toggle('is-active', l.dataset.nav === en.target.id)); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['facciones', 'predio', 'desafios', 'diario', 'festival'].forEach(id => { const s = document.getElementById(id); if (s) io.observe(s); });

  // marcador: anima cuando entra en pantalla
  new IntersectionObserver((entries, obs) => {
    if (entries.some(en => en.isIntersecting)) { scoreSeen = true; const t = T(); paintScore(Math.min(100, t.tests / GOAL * 100), t.tests); obs.disconnect(); }
  }, { threshold: .3 }).observe($('#marcador'));

  // CTA fijo en el celular cuando el del hero sale de pantalla
  let heroCtaVisible = true;
  const sticky = $('#stickyCta');
  function updateSticky() {
    const on = !heroCtaVisible && !openLayer && modal.hidden;
    sticky.classList.toggle('is-on', on); sticky.setAttribute('aria-hidden', String(!on));
    $('a', sticky).tabIndex = on ? 0 : -1;
  }
  new IntersectionObserver(([en]) => { heroCtaVisible = en.isIntersecting; updateSticky(); }).observe($('#heroCta'));

  // control del prototipo
  $('#demoBtn').addEventListener('click', () => {
    const p = $('#demoPanel'), on = p.hidden; p.hidden = !on; $('#demoBtn').setAttribute('aria-expanded', String(on));
  });
  document.addEventListener('click', e => {
    if (!$('#demoPanel').hidden && !e.target.closest('#demo')) { $('#demoPanel').hidden = true; $('#demoBtn').setAttribute('aria-expanded', 'false'); }
  });

  /* =========================================================
     MOVIMIENTO (GSAP + Lenis, si cargaron y si la persona no pidió menos movimiento)
     ========================================================= */
  function motion() {
    if (reduced || !window.gsap) return;
    if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    if (window.Lenis) {
      lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
      if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
      if (openLayer || !modal.hidden) lenis.stop();
    }
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.shard', { scale: 0, rotate: -25, opacity: 0, duration: .8, stagger: .05 }, 0)
      .fromTo('[data-hero-photo]', { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power4.inOut', clearProps: 'clipPath' }, 0.05)
      .from('.wordmark > span', { y: 60, opacity: 0, duration: .9, stagger: .09 }, 0.2)
      .from('.wordmark__star', { scale: 0, rotate: -180, duration: .8, ease: 'back.out(2)' }, 0.6)
      .fromTo('.brush', { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .7, ease: 'power2.inOut', clearProps: 'clipPath' }, 0.7)
      .from('.hero__lead, .hero__cta', { y: 24, opacity: 0, duration: .7, stagger: .1 }, 0.9)
      .from('.ticker', { yPercent: 120, duration: .8 }, 0.9);
    if (!window.ScrollTrigger) return;
    gsap.to('.hero__photo img', { yPercent: 7, scale: 1.05, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.shard', { y: i => (i % 2 ? -90 : -40), ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    $$('[data-reveal]').forEach(el => {
      const isTape = el.dataset.reveal === 'tape';
      gsap.from(el, { y: isTape ? 10 : 40, rotate: isTape ? -9 : 0, scale: isTape ? .85 : 1, opacity: 0, duration: isTape ? .7 : .8, ease: isTape ? 'back.out(2)' : 'power3.out', scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
    });
    ScrollTrigger.batch('.card', { start: 'top 88%', once: true, onEnter: els => gsap.from(els, { y: 90, rotate: i => [-4, 3, -2, 4][i % 4], opacity: 0, duration: .9, stagger: .1, ease: 'power3.out' }) });
    ScrollTrigger.batch('.clip', { start: 'top 90%', once: true, onEnter: els => gsap.from(els, { y: 70, opacity: 0, duration: .8, stagger: .12, ease: 'power3.out' }) });
    gsap.from('.mb', { opacity: 0, scale: .8, transformOrigin: 'center', duration: .7, stagger: .1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '#mapSvg', start: 'top 80%', once: true } });
  }

  /* ---------- Arranque ---------- */
  buildMap();
  const mapBox = $('.predio__map'); if (mapBox.scrollWidth > mapBox.clientWidth) mapBox.scrollLeft = (mapBox.scrollWidth - mapBox.clientWidth) / 2;
  renderAll(); renderClips();
  route();
  window.addEventListener('load', motion);
})();
