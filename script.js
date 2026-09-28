/* ===== Petal & Twine — bouquet customizer ===== */
(() => {
  'use strict';

  // ---------- Catalogue ----------
  const TYPES = [
    { id: 'rose', name: 'Rose hand-tied', stems: 12, price: 899, blurb: 'Long-stem roses tied with eucalyptus.', colors: ['red', 'blush', 'white', 'peach', 'yellow', 'lavender'] },
    { id: 'tulip', name: 'Tulip posy', stems: 10, price: 1199, blurb: 'Dutch tulips, loose and springy.', colors: ['red', 'blush', 'white', 'yellow', 'orange', 'lavender'] },
    { id: 'sunflower', name: 'Sunflower bunch', stems: 6, price: 749, blurb: 'Big-faced sunflowers with ruscus.', colors: ['yellow', 'orange'] },
    { id: 'lily', name: 'Lily cascade', stems: 8, price: 1349, blurb: 'Oriental lilies, tall and fragrant.', colors: ['white', 'blush', 'peach', 'yellow'] },
    { id: 'gerbera', name: 'Gerbera dome', stems: 15, price: 649, blurb: 'Cheerful gerberas in a round dome.', colors: ['red', 'blush', 'orange', 'yellow', 'white', 'lavender'] },
  ];
  const COLORS = {
    red: { name: 'Crimson', hex: '#B3223F' },
    blush: { name: 'Blush pink', hex: '#F2A7BB' },
    white: { name: 'Ivory', hex: '#F7F3EA' },
    peach: { name: 'Peach', hex: '#F6B38A' },
    yellow: { name: 'Sun yellow', hex: '#F2C230' },
    orange: { name: 'Marigold', hex: '#E97A22' },
    lavender: { name: 'Lavender', hex: '#B79AD9' },
  };
  const WRAPS = [
    { id: 'kraft', name: 'Kraft paper', price: 0, hex: '#C49A6C' },
    { id: 'black', name: 'Matte black', price: 99, hex: '#2B2B2E' },
    { id: 'tissue', name: 'Blush tissue', price: 79, hex: '#F3C4D0' },
    { id: 'cello', name: 'Clear cellophane', price: 49, hex: '#CFE6EC', clear: true },
    { id: 'jute', name: 'Jute & burlap', price: 129, hex: '#A98B5D', texture: true },
    { id: 'box', name: 'Hat box', price: 399, hex: '#24453A', box: true },
  ];
  const RIBBONS = {
    ivory: { name: 'Ivory', hex: '#F4EBDD' },
    red: { name: 'Satin red', hex: '#B3223F' },
    gold: { name: 'Gold', hex: '#C9973A' },
    sage: { name: 'Sage', hex: '#8FAF94' },
  };
  const ADDONS = [
    { id: 'card', name: 'Message card', price: 49, desc: 'Handwritten by our florist' },
    { id: 'choc', name: 'Dark chocolate box', price: 349, desc: '16 pieces, 200 g' },
    { id: 'teddy', name: 'Teddy bear', price: 449, desc: '25 cm soft plush' },
    { id: 'vase', name: 'Glass vase', price: 299, desc: 'Clear, 22 cm tall' },
    { id: 'candle', name: 'Scented candle', price: 249, desc: 'Jasmine, 30-hour burn' },
    { id: 'balloon', name: 'Foil balloon', price: 199, desc: '"Happy Birthday" heart' },
  ];
  const SLOTS = [
    { id: 'morning', name: 'Morning', time: '9 am – 12 pm', fee: 0, cutoff: 9 },
    { id: 'afternoon', name: 'Afternoon', time: '12 – 4 pm', fee: 0, cutoff: 12 },
    { id: 'evening', name: 'Evening', time: '4 – 8 pm', fee: 0, cutoff: 16 },
    { id: 'midnight', name: 'Midnight surprise', time: '11:30 pm – 12 am', fee: 249, cutoff: 20 },
  ];
  const MAX_QTY = 20, MAX_COLORS = 3;
  const FREE_DELIVERY = 1499, DELIVERY_FEE = 99;
  const COUPONS = { BLOOM10: { pct: 10, label: '10% off' }, FIRSTBUNCH: { pct: 15, label: '15% off your first order' } };

  // Falls back to the drawn illustrations if a photo can't load (offline, or a blocked host).
  const UNSPLASH = (id, w = 600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
  const PHOTOS = {
    rose: '1548094967-e25a127d1f6d', tulip: '1586968295564-92fd7572718b', sunflower: '1601884928885-92a922f7962f',
    lily: '1486102515046-44130769cb25', gerbera: '1569731030828-ba3bb70923ff', card: '1566125882500-87e10f726cdc',
    choc: '1548741487-18d363dc4469', teddy: '1556012018-50c5c0da73bf', vase: '1712245833868-752590cb07e1',
    candle: '1612293905607-b003de9e54fb', balloon: '1592090859069-ca2d4381b422',
  };
  let photosOk = true; // flips to false the first time a photo fails
  const photo = (key, w, cls, alt) => `<img class="${cls}" src="${UNSPLASH(PHOTOS[key], w)}" alt="${alt}" loading="lazy" decoding="async" data-photo>`;

  const REVIEWS_SEED = [
    { id: 's1', name: 'Simran K.', rating: 5, type: 'rose', date: '2026-08-14', text: 'Ordered the rose hand-tied for our anniversary — exactly the colours I picked, delivered right on time.' },
    { id: 's2', name: 'Arjun M.', rating: 5, type: 'sunflower', date: '2026-07-30', text: 'Sunflowers were fresh and full. The hat box wrap made it feel like a proper gift.' },
    { id: 's3', name: 'Neha T.', rating: 4, type: 'lily', date: '2026-07-02', text: 'Beautiful lilies, lovely scent. Delivery ran about 40 minutes past the slot.' },
    { id: 's4', name: 'Rohit S.', rating: 5, type: 'tulip', date: '2026-06-19', text: 'Second time ordering. The tulip posy was perfect for my mother’s birthday.' },
  ];
  const stars = n => `<span class="stars" aria-hidden="true">${'★'.repeat(n)}${'☆'.repeat(5 - n)}</span>`;

  const byId = (list, id) => list.find(x => x.id === id);
  const INR = n => '₹' + Math.round(n).toLocaleString('en-IN');
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Storage helpers (per-browser convenience; app works without it)
  const store = {
    get: (k, fallback) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; } catch { return fallback; } },
    set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
  };

  // ---------- State ----------
  const freshBuild = () => ({ type: 'rose', colors: ['red', 'blush'], wrap: 'kraft', ribbon: 'ivory', addons: ['card'], card: 'Happy anniversary! Here’s to many more.', qty: 1 });
  let build = freshBuild();
  let editingId = null;
  let cart = store.get('pt-cart', []);
  let coupon = store.get('pt-coupon', null);
  let slot = 'evening';
  let view = 'home';
  let lastOrder = null;
  let reviewRating = 5;


  // ---------- Pricing ----------
  const unitPrice = b => byId(TYPES, b.type).price + byId(WRAPS, b.wrap).price + b.addons.reduce((s, a) => s + byId(ADDONS, a).price, 0);
  function totals() {
    const subtotal = cart.reduce((s, it) => s + unitPrice(it) * it.qty, 0);
    const discount = coupon && COUPONS[coupon] ? Math.round(subtotal * COUPONS[coupon].pct / 100) : 0;
    const after = subtotal - discount;
    const delivery = subtotal === 0 || after >= FREE_DELIVERY ? 0 : DELIVERY_FEE;
    const slotFee = byId(SLOTS, slot).fee;
    return { subtotal, discount, delivery, slotFee, total: after + delivery };
  }

  // ---------- Colour utils ----------
  function shade(hex, pct) {
    const n = parseInt(hex.slice(1), 16);
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const t = pct < 0 ? 0 : 255, p = Math.abs(pct) / 100;
    r = Math.round((t - r) * p + r); g = Math.round((t - g) * p + g); b = Math.round((t - b) * p + b);
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  // ---------- Bouquet drawing (SVG) ----------
  const SLOTS_XY = [[150, 100], [108, 86], [192, 86], [150, 58], [96, 130], [204, 130], [150, 138], [66, 104], [234, 104], [124, 118], [176, 118]];
  const HEAD = { rose: { r: 24, n: 11 }, tulip: { r: 21, n: 10 }, sunflower: { r: 33, n: 6 }, lily: { r: 30, n: 7 }, gerbera: { r: 25, n: 11 } };
  let uid = 0;

  function flower(type, x, y, r, c, i, animate) {
    const s = shade(c, -22), d = shade(c, -38);
    const cls = animate ? ` class="head" style="animation-delay:${i * 35}ms"` : '';
    let g = '';
    if (type === 'rose') {
      g = `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${s}" stroke-width="1.2"/>
        <circle cx="${x}" cy="${y}" r="${r * .7}" fill="${shade(c, -8)}"/>
        <path d="M${x - r * .55} ${y + r * .1} A${r * .55} ${r * .55} 0 1 1 ${x + r * .35} ${y + r * .45}" fill="none" stroke="${s}" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M${x - r * .25} ${y - r * .05} A${r * .28} ${r * .28} 0 1 1 ${x + r * .15} ${y + r * .25}" fill="none" stroke="${d}" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="${x}" cy="${y}" r="${r * .12}" fill="${d}"/>`;
    } else if (type === 'tulip') {
      g = `<path d="M${x - r} ${y - r * .45} Q${x - r} ${y + r} ${x} ${y + r} Q${x + r} ${y + r} ${x + r} ${y - r * .45} L${x + r * .5} ${y - r * .05} L${x} ${y - r * .7} L${x - r * .5} ${y - r * .05} Z" fill="${c}" stroke="${s}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M${x} ${y - r * .7} Q${x - r * .15} ${y + r * .3} ${x} ${y + r}" fill="none" stroke="${s}" stroke-width="1.2"/>`;
    } else if (type === 'sunflower') {
      for (let k = 0; k < 16; k++) g += `<ellipse cx="${x}" cy="${y - r * .62}" rx="${r * .2}" ry="${r * .42}" fill="${k % 2 ? c : shade(c, -6)}" stroke="${s}" stroke-width=".8" transform="rotate(${k * 22.5} ${x} ${y})"/>`;
      g += `<circle cx="${x}" cy="${y}" r="${r * .44}" fill="#5B3A1C"/><circle cx="${x}" cy="${y}" r="${r * .3}" fill="#3F2812"/>`;
      for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; g += `<circle cx="${(x + Math.cos(a) * r * .22).toFixed(1)}" cy="${(y + Math.sin(a) * r * .22).toFixed(1)}" r="1.4" fill="#7A5230"/>`; }
    } else if (type === 'lily') {
      for (let k = 0; k < 6; k++) g += `<path d="M${x} ${y} Q${x - r * .32} ${y - r * .5} ${x} ${y - r} Q${x + r * .32} ${y - r * .5} ${x} ${y} Z" fill="${k % 2 ? c : shade(c, -5)}" stroke="${s}" stroke-width="1" transform="rotate(${k * 60 + 30} ${x} ${y})"/>`;
      for (let k = 0; k < 5; k++) { const a = (k * 72 - 90) * Math.PI / 180; const ex = x + Math.cos(a) * r * .4, ey = y + Math.sin(a) * r * .4; g += `<line x1="${x}" y1="${y}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="#7C9A5E" stroke-width="1"/><ellipse cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" rx="1.6" ry="3" fill="#9A3E1C"/>`; }
      g += `<circle cx="${x}" cy="${y}" r="${r * .1}" fill="#C7D47A"/>`;
    } else { // gerbera
      for (let k = 0; k < 22; k++) g += `<ellipse cx="${x}" cy="${y - r * .55}" rx="${r * .13}" ry="${r * .45}" fill="${k % 2 ? c : shade(c, -7)}" stroke="${s}" stroke-width=".6" transform="rotate(${k * 16.36} ${x} ${y})"/>`;
      g += `<circle cx="${x}" cy="${y}" r="${r * .3}" fill="${shade(c, -30)}"/><circle cx="${x}" cy="${y}" r="${r * .17}" fill="#3B2A1A"/>`;
    }
    return `<g${cls}>${g}</g>`;
  }

  function drawBouquet(b, { animate = false, title = true } = {}) {
    const id = 'b' + (++uid);
    const t = byId(TYPES, b.type), w = byId(WRAPS, b.wrap), rib = RIBBONS[b.ribbon].hex;
    const { r, n } = HEAD[b.type];
    const box = !!w.box, dy = box ? 34 : 0;
    const fill = w.texture ? `url(#${id}-jute)` : w.hex;
    const op = w.clear ? .45 : 1;
    const edge = shade(w.hex, -22);
    let svg = `<svg viewBox="0 0 300 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(t.name)} preview">`;
    if (title) svg += `<title>${esc(t.name)} in ${b.colors.map(c => COLORS[c].name).join(', ')}, ${esc(w.name)}</title>`;
    svg += `<defs><pattern id="${id}-jute" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="${w.hex}"/><path d="M0 3h6M3 0v6" stroke="${shade(w.hex, -18)}" stroke-width="1.1"/></pattern></defs>`;

    // back paper
    if (!box) svg += `<path d="M52 170 L22 76 Q150 18 278 76 L248 170 Z" fill="${fill}" opacity="${w.clear ? .3 : 1}" stroke="${edge}" stroke-width="1.2"/>
      <path d="M52 170 L22 76 Q150 18 278 76 L248 170 Z" fill="#000" opacity="${w.clear ? 0 : .12}"/>`;
    // leaves & stems
    const leaves = [[74, 150 + dy, -50], [226, 150 + dy, 50], [100, 64 + dy, -28], [200, 64 + dy, 28], [150, 38 + dy, 0], [52, 118 + dy, -70], [248, 118 + dy, 70]];
    leaves.forEach(([x, y, a], i) => { svg += `<ellipse cx="${x}" cy="${y}" rx="11" ry="30" fill="${i % 2 ? '#3E6B4A' : '#56875F'}" transform="rotate(${a} ${x} ${y})"/>`; });
    if (w.clear) for (let k = 0; k < 7; k++) svg += `<line x1="${120 + k * 10}" y1="170" x2="${140 + k * 3.3}" y2="330" stroke="#3E6B4A" stroke-width="3"/>`;
    // heads, painter's order: top first
    const pts = SLOTS_XY.slice(0, n).map((p, i) => ({ x: p[0], y: p[1] + dy, c: COLORS[b.colors[i % b.colors.length]].hex, i })).sort((a, c) => a.y - c.y);
    pts.forEach(p => { svg += flower(b.type, p.x, p.y, r, p.c, p.i, animate); });

    if (box) {
      svg += `<rect x="62" y="186" width="176" height="150" rx="8" fill="${w.hex}"/>
        <rect x="56" y="178" width="188" height="26" rx="6" fill="${shade(w.hex, -18)}"/>
        <rect x="143" y="204" width="14" height="132" fill="${rib}"/>
        <text x="150" y="276" text-anchor="middle" font-family="Georgia, serif" font-size="11" letter-spacing="2" fill="${shade(w.hex, 45)}" transform="rotate(-90 196 276)">P &amp; T</text>`;
      svg += bow(150, 192, rib);
    } else {
      svg += `<path d="M50 162 Q100 186 150 172 Q200 186 250 162 L170 332 L130 332 Z" fill="${fill}" opacity="${op}" stroke="${edge}" stroke-width="1.2" stroke-linejoin="round"/>
        <path d="M100 178 L140 330 M200 178 L160 330 M150 172 L150 330" stroke="#000" opacity="${w.clear ? .12 : .1}" stroke-width="1.2" fill="none"/>
        <path d="M130 332 L130 350 M140 332 L141 352 M150 332 L150 353 M160 332 L159 352 M170 332 L170 350" stroke="#4E7B55" stroke-width="3.2" stroke-linecap="round"/>
        <path d="M104 266 L196 266 L192 278 L108 278 Z" fill="${rib}" stroke="${shade(rib, -20)}" stroke-width=".8"/>`;
      svg += bow(150, 272, rib);
    }
    return svg + '</svg>';
  }
  function bow(x, y, c) {
    const s = shade(c, -22);
    return `<path d="M${x - 3} ${y + 4} L${x - 16} ${y + 34} L${x - 8} ${y + 30} L${x - 4} ${y + 38} Z M${x + 3} ${y + 4} L${x + 16} ${y + 34} L${x + 8} ${y + 30} L${x + 4} ${y + 38} Z" fill="${c}" stroke="${s}" stroke-width=".8"/>
      <ellipse cx="${x - 16}" cy="${y - 4}" rx="17" ry="9" fill="${c}" stroke="${s}" stroke-width="1" transform="rotate(-18 ${x - 16} ${y - 4})"/>
      <ellipse cx="${x + 16}" cy="${y - 4}" rx="17" ry="9" fill="${c}" stroke="${s}" stroke-width="1" transform="rotate(18 ${x + 16} ${y - 4})"/>
      <circle cx="${x}" cy="${y}" r="6" fill="${shade(c, -10)}" stroke="${s}" stroke-width="1"/>`;
  }

  // Small icons for type cards
  const typeIcon = t => {
    const col = COLORS[t.colors[0]].hex;
    return `<svg class="ico" viewBox="0 0 60 60" aria-hidden="true">${flower(t.id, 30, 30, t.id === 'sunflower' ? 24 : 20, col, 0, false)}</svg>`;
  };

  // ---------- Build view ----------
  function renderBuild(animate = true) {
    const t = byId(TYPES, build.type);

    $('#opt-type').innerHTML = TYPES.map(x => `
      <button type="button" class="opt type-card" role="radio" aria-checked="${x.id === build.type}" data-type="${x.id}">
        ${photosOk ? `<span class="type-photo">${photo(x.id, 400, '', '')}</span>` : typeIcon(x)}
        <strong>${x.name}</strong>
        <p>${x.blurb}</p>
        <span class="meta"><span class="stems">${x.stems} stems</span><span class="price">${INR(x.price)}</span></span>
      </button>`).join('');

    $('#opt-colors').innerHTML = Object.entries(COLORS).map(([id, c]) => {
      const allowed = t.colors.includes(id), on = build.colors.includes(id);
      return `<button type="button" class="opt swatch" aria-pressed="${on}" data-color="${id}" ${allowed ? '' : 'disabled title="Not available for ' + t.name + '"'}>
        <span class="dot" style="background:${c.hex}"></span>${c.name}</button>`;
    }).join('');
    $('#color-hint').textContent = `${build.colors.length} of ${Math.min(MAX_COLORS, t.colors.length)} picked`;

    $('#opt-wrap').innerHTML = WRAPS.map(w => `
      <button type="button" class="opt wrap-card" role="radio" aria-checked="${w.id === build.wrap}" data-wrap="${w.id}">
        <svg class="paper" viewBox="0 0 34 40" aria-hidden="true">${w.box
          ? `<rect x="3" y="10" width="28" height="28" rx="3" fill="${w.hex}"/><rect x="1" y="6" width="32" height="7" rx="2" fill="${shade(w.hex, -18)}"/>`
          : `<path d="M2 4 L32 4 L20 38 L14 38 Z" fill="${w.hex}" opacity="${w.clear ? .6 : 1}" stroke="${shade(w.hex, -25)}"/>`}</svg>
        <span><strong>${w.name}</strong><span class="price">${w.price ? '+' + INR(w.price) : 'Included'}</span></span>
      </button>`).join('');

    $('#opt-ribbon').innerHTML = Object.entries(RIBBONS).map(([id, r]) => `
      <button type="button" class="opt ribbon" role="radio" aria-checked="${id === build.ribbon}" data-ribbon="${id}"><span class="dot" style="background:${r.hex}"></span>${r.name}</button>`).join('');

    $('#opt-addons').classList.toggle('with-photos', photosOk);
    $('#opt-addons').innerHTML = ADDONS.map(a => `
      <button type="button" class="opt addon" aria-pressed="${build.addons.includes(a.id)}" data-addon="${a.id}">
        <span class="check"><svg viewBox="0 0 14 14"><path d="M2.5 7.5 L5.5 10.5 L11.5 3.5" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        ${photosOk ? photo(a.id, 160, 'addon-photo', '') : ''}
        <span class="txt"><strong>${a.name}</strong><small>${a.desc}</small></span>
        <span class="price">+${INR(a.price)}</span>
      </button>`).join('');

    $('#card-msg-wrap').hidden = !build.addons.includes('card');
    if ($('#card-msg').value !== build.card) $('#card-msg').value = build.card;
    $('#card-count').textContent = `${build.card.length} / 160`;

    $('#qty-val').textContent = build.qty;
    $('#qty-dec').disabled = build.qty <= 1;
    $('#qty-inc').disabled = build.qty >= MAX_QTY;

    renderPreview(animate);
  }

  function renderPreview(animate) {
    const t = byId(TYPES, build.type), w = byId(WRAPS, build.wrap);
    $('#stage').classList.toggle('has-photo', photosOk);
    $('#stage').innerHTML = photosOk
      ? `${photo(build.type, 800, 'stage-photo', t.name)}
         <figure class="sketch"><div>${drawBouquet(build, { animate, title: true })}</div><figcaption>Your mix</figcaption></figure>`
      : drawBouquet(build, { animate });
    $('#stage-caption').innerHTML = `${t.name}<small>${t.stems} stems · ${build.colors.map(c => COLORS[c].name).join(' + ')} · ${w.name}</small>`;
    $('#addon-chips').innerHTML = build.addons.map(a => `<span class="chip">${byId(ADDONS, a).name}</span>`).join('');

    const unit = unitPrice(build);
    let rows = `<div><dt>${t.name}</dt><dd>${INR(t.price)}</dd></div>`;
    rows += `<div><dt>${w.name}</dt><dd>${w.price ? INR(w.price) : '₹0'}</dd></div>`;
    build.addons.forEach(a => { const x = byId(ADDONS, a); rows += `<div><dt>${x.name}</dt><dd>${INR(x.price)}</dd></div>`; });
    if (build.qty > 1) rows += `<div><dt>Per bouquet × ${build.qty}</dt><dd>${INR(unit)} × ${build.qty}</dd></div>`;
    rows += `<div class="total"><dt>Total</dt><dd>${INR(unit * build.qty)}</dd></div>`;
    $('#breakdown').innerHTML = rows;

    const label = `${editingId ? 'Update bouquet' : 'Add to cart'} · ${INR(unit * build.qty)}`;
    $('#add-btn').textContent = label;
    $('#add-btn-mobile').textContent = editingId ? 'Update' : 'Add to cart';
    $('#mobile-total').textContent = INR(unit * build.qty);
  }

  // Builder interactions (event delegation)
  $('#view-build').addEventListener('click', e => {
    const el = e.target.closest('button');
    if (!el || el.disabled) return;
    const d = el.dataset;
    if (d.type && d.type !== build.type) {
      build.type = d.type;
      const allowed = byId(TYPES, d.type).colors;
      build.colors = build.colors.filter(c => allowed.includes(c));
      if (!build.colors.length) build.colors = [allowed[0]];
      renderBuild();
    } else if (d.color) {
      const i = build.colors.indexOf(d.color);
      if (i >= 0) {
        if (build.colors.length === 1) return toast('Keep at least one colour');
        build.colors.splice(i, 1);
      } else {
        if (build.colors.length >= MAX_COLORS) return toast(`Up to ${MAX_COLORS} colours per bouquet`);
        build.colors.push(d.color);
      }
      renderBuild();
    } else if (d.wrap) { build.wrap = d.wrap; renderBuild(); }
    else if (d.ribbon) { build.ribbon = d.ribbon; renderBuild(false); }
    else if (d.addon) {
      const i = build.addons.indexOf(d.addon);
      i >= 0 ? build.addons.splice(i, 1) : build.addons.push(d.addon);
      renderBuild(false);
    }
  });
  $('#card-msg').addEventListener('input', e => { build.card = e.target.value; $('#card-count').textContent = `${build.card.length} / 160`; });
  $('#qty-dec').addEventListener('click', () => { build.qty = Math.max(1, build.qty - 1); renderBuild(false); });
  $('#qty-inc').addEventListener('click', () => { build.qty = Math.min(MAX_QTY, build.qty + 1); renderBuild(false); });

  function addToCart() {
    if (build.addons.includes('card') && !build.card.trim()) {
      $('#card-msg').focus();
      return toast('Write a message for the card, or remove the card');
    }
    const item = JSON.parse(JSON.stringify(build));
    if (editingId) {
      const idx = cart.findIndex(c => c.id === editingId);
      item.id = editingId;
      if (idx >= 0) cart[idx] = item; else cart.push(item);
      editingId = null;
      toast('Bouquet updated');
    } else {
      // merge identical configurations
      const key = JSON.stringify({ ...item, qty: 0 });
      const same = cart.find(c => JSON.stringify({ ...c, id: undefined, qty: 0 }) === key);
      if (same) same.qty = Math.min(MAX_QTY, same.qty + item.qty);
      else cart.push({ ...item, id: 'i' + Date.now().toString(36) });
      toast(`Added ${item.qty > 1 ? item.qty + ' bouquets' : byId(TYPES, item.type).name} to cart`);
    }
    saveCart();
    build = freshBuild();
    go('cart');
  }
  $('#add-btn').addEventListener('click', addToCart);
  $('#add-btn-mobile').addEventListener('click', addToCart);

  // ---------- Cart ----------
  const specLine = it => {
    const w = byId(WRAPS, it.wrap);
    const extras = it.addons.map(a => byId(ADDONS, a).name);
    return `${it.colors.map(c => COLORS[c].name).join(' + ')} · ${w.name}, ${RIBBONS[it.ribbon].name.toLowerCase()} ribbon${extras.length ? '<br>With ' + extras.join(', ').toLowerCase() : ''}`;
  };

  function renderCart() {
    const empty = cart.length === 0;
    $('#cart-empty').hidden = !empty;
    $('#cart-summary').hidden = empty;
    $('#add-another').hidden = empty;
    $('#cart-list').innerHTML = cart.map(it => {
      const t = byId(TYPES, it.type), unit = unitPrice(it);
      return `<li class="cart-item" data-id="${it.id}">
        <div class="cart-thumb">${drawBouquet(it, { title: false })}</div>
        <div>
          <h3>${t.name}</h3>
          <p class="specs">${specLine(it)}</p>
          ${it.addons.includes('card') && it.card ? `<p class="card-quote">“${esc(it.card)}”</p>` : ''}
          <div class="actions">
            <div class="stepper sm" role="group" aria-label="Quantity">
              <button type="button" data-act="dec" aria-label="Decrease" ${it.qty <= 1 ? 'disabled' : ''}>−</button>
              <output>${it.qty}</output>
              <button type="button" data-act="inc" aria-label="Increase" ${it.qty >= MAX_QTY ? 'disabled' : ''}>+</button>
            </div>
            <button type="button" class="txt" data-act="edit">Edit</button>
            <button type="button" class="txt" data-act="remove">Remove</button>
          </div>
        </div>
        <div class="line"><span class="price">${INR(unit * it.qty)}</span>${it.qty > 1 ? `<small>${INR(unit)} each</small>` : ''}</div>
      </li>`;
    }).join('');
    $('#coupon').value = coupon || '';
    renderTotals('#cart-totals', false);
  }

  function renderTotals(sel, withSlot) {
    const t = totals();
    let rows = `<div><dt>Subtotal (${cart.reduce((s, i) => s + i.qty, 0)} bouquet${cart.reduce((s, i) => s + i.qty, 0) === 1 ? '' : 's'})</dt><dd>${INR(t.subtotal)}</dd></div>`;
    if (t.discount) rows += `<div class="discount"><dt>${coupon}</dt><dd>−${INR(t.discount)}</dd></div>`;
    rows += `<div><dt>Delivery</dt><dd>${t.delivery ? INR(t.delivery) : 'Free'}</dd></div>`;
    if (withSlot && t.slotFee) rows += `<div><dt>Midnight slot</dt><dd>${INR(t.slotFee)}</dd></div>`;
    const grand = t.total + (withSlot ? t.slotFee : 0);
    rows += `<div class="total"><dt>Total</dt><dd>${INR(grand)}</dd></div>`;
    if (t.delivery && t.subtotal) rows += `<div><dt style="font-size:.8rem">Add ${INR(FREE_DELIVERY - (t.subtotal - t.discount))} more for free delivery</dt><dd></dd></div>`;
    $(sel).innerHTML = rows;
    return grand;
  }

  $('#cart-list').addEventListener('click', e => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const id = btn.closest('.cart-item').dataset.id;
    const it = cart.find(c => c.id === id);
    if (!it) return;
    const act = btn.dataset.act;
    if (act === 'inc') it.qty = Math.min(MAX_QTY, it.qty + 1);
    if (act === 'dec') it.qty = Math.max(1, it.qty - 1);
    if (act === 'remove') { cart = cart.filter(c => c !== it); toast('Removed from cart'); }
    if (act === 'edit') {
      build = JSON.parse(JSON.stringify(it)); delete build.id;
      editingId = id;
      return go('build');
    }
    saveCart();
    renderCart();
  });

  $('#coupon-form').addEventListener('submit', e => {
    e.preventDefault();
    const code = $('#coupon').value.trim().toUpperCase();
    const msg = $('#coupon-msg');
    if (!code) { coupon = null; msg.textContent = ''; }
    else if (COUPONS[code]) { coupon = code; msg.textContent = `${code} applied: ${COUPONS[code].label}`; msg.className = 'field-msg ok'; }
    else { msg.textContent = `${code} isn't a valid code. Try BLOOM10.`; msg.className = 'field-msg bad'; }
    store.set('pt-coupon', coupon);
    renderCart();
  });
  $('#to-checkout').addEventListener('click', () => go('checkout'));

  // ---------- Checkout ----------
  const pad = n => String(n).padStart(2, '0');
  const isoDate = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  function setupDate() {
    const now = new Date(), input = $('#d-date');
    const first = new Date(now);
    if (now.getHours() >= 16) first.setDate(first.getDate() + 1); // regular slots closed for today
    const last = new Date(now); last.setDate(last.getDate() + 30);
    input.min = isoDate(first); input.max = isoDate(last);
    if (!input.value || input.value < input.min) input.value = input.min;
  }

  function renderSlots() {
    const today = $('#d-date').value === isoDate(new Date());
    const hour = new Date().getHours();
    const avail = SLOTS.map(s => ({ ...s, ok: !today || hour < s.cutoff }));
    if (!avail.find(s => s.id === slot && s.ok)) slot = (avail.find(s => s.ok) || avail[0]).id;
    $('#slots').innerHTML = avail.map(s => `
      <button type="button" class="opt slot" role="radio" aria-checked="${s.id === slot}" data-slot="${s.id}" ${s.ok ? '' : 'disabled'}>
        <strong>${s.name}</strong><small>${s.time}${s.fee ? ' · +' + INR(s.fee) : ''}</small>${s.ok ? '' : '<small>Closed for today</small>'}
      </button>`).join('');
  }

  function renderCheckout() {
    setupDate();
    renderSlots();
    $('#checkout-items').innerHTML = cart.map(it => `
      <li><span class="mt">${drawBouquet(it, { title: false })}</span>
        <span>${byId(TYPES, it.type).name} × ${it.qty}<small>${it.colors.map(c => COLORS[c].name).join(' + ')}</small></span>
        <span class="price">${INR(unitPrice(it) * it.qty)}</span></li>`).join('');
    const grand = renderTotals('#checkout-totals', true);
    $('#place-btn').textContent = `Place order · ${INR(grand)}`;
  }

  $('#d-date').addEventListener('change', () => { renderSlots(); renderCheckout(); });
  $('#slots').addEventListener('click', e => {
    const b = e.target.closest('button[data-slot]');
    if (!b || b.disabled) return;
    slot = b.dataset.slot;
    renderCheckout();
  });
  ['#r-phone', '#r-pin'].forEach(s => $(s).addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, ''); }));

  const RULES = {
    'r-name': v => v.trim().length >= 2 || 'Enter the recipient’s name',
    'r-phone': v => /^[6-9]\d{9}$/.test(v) || 'Enter a 10-digit mobile number',
    'r-addr': v => v.trim().length >= 8 || 'Add house number, street and area',
    'r-city': v => v.trim().length >= 2 || 'Enter a city',
    'r-pin': v => /^[1-9]\d{5}$/.test(v) || 'PIN codes have 6 digits',
    'd-date': v => (v && v >= $('#d-date').min && v <= $('#d-date').max) || 'Pick a date within the next 30 days',
    's-name': v => v.trim().length >= 2 || 'Enter your name',
    's-email': v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter an email like name@example.com',
  };
  function validate(id) {
    const el = document.getElementById(id), res = RULES[id](el.value);
    const field = el.closest('.field');
    field.classList.toggle('invalid', res !== true);
    field.querySelector('.err').textContent = res === true ? '' : res;
    return res === true;
  }
  Object.keys(RULES).forEach(id => document.getElementById(id).addEventListener('blur', () => validate(id)));

  $('#checkout-form').addEventListener('submit', e => {
    e.preventDefault();
    if (!cart.length) return go('cart');
    const bad = Object.keys(RULES).filter(id => !validate(id));
    if (bad.length) { document.getElementById(bad[0]).focus(); return toast('Check the highlighted fields'); }
    const f = e.target;
    const grand = renderTotals('#checkout-totals', true);
    const order = {
      id: 'PT-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
      items: JSON.parse(JSON.stringify(cart)),
      total: grand,
      to: f.rname.value.trim(),
      addr: `${f.addr.value.trim()}, ${f.city.value.trim()} ${f.pin.value}`,
      date: f.date.value,
      slot: byId(SLOTS, slot),
      pay: f.pay.value,
      email: f.email.value.trim(),
    };
    lastOrder = order;
    renderDone(order);
    cart = []; coupon = null; saveCart(); store.set('pt-coupon', null);
    f.reset(); $('#r-city').value = 'Jalandhar';
    go('done');
  });

  // ---------- Confirmed ----------
  function renderDone(o) {
    const d = new Date(o.date + 'T12:00:00');
    const when = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
    $('#done-stage').innerHTML = drawBouquet(o.items[0], { animate: true, title: false });
    $('#done-lede').textContent = `We'll deliver to ${o.to} on ${when}, ${o.slot.time}. A confirmation is on its way to ${o.email}.`;
    $('#receipt').innerHTML = [
      ['Order number', o.id], ['Delivery', `${when}<br>${o.slot.name}, ${o.slot.time}`],
      ['Address', esc(o.addr)], ['Payment', `${o.pay}<br>${INR(o.total)}`],
    ].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    $('#done-items').innerHTML = o.items.map(it => `
      <li><span class="mt">${drawBouquet(it, { title: false })}</span>
      <span>${byId(TYPES, it.type).name} × ${it.qty}<small>${specLine(it)}</small></span>
      <span class="price">${INR(unitPrice(it) * it.qty)}</span></li>`).join('');
  }
  $('#new-order').addEventListener('click', () => { build = freshBuild(); go('build'); });

  // ---------- Home ----------
  function renderHome() {
    $('#home-stage').innerHTML = drawBouquet({ type: 'rose', colors: ['red', 'blush'], wrap: 'kraft', ribbon: 'ivory' }, { title: false });
    $('#home-types').innerHTML = TYPES.map(t => `
      <button type="button" class="opt type-card" data-go="build" data-pick-type="${t.id}">
        ${photosOk ? photo(t.id, 300, 'type-photo-sm', t.name) : typeIcon(t)}
        <strong>${t.name}</strong><span class="price">${INR(t.price)}</span>
      </button>`).join('');
    $('#home-review-grid').innerHTML = loadReviews().slice(0, 3).map(r => `
      <div class="mini-review">
        <div class="review-head"><span class="review-name">${esc(r.name)}</span>${stars(r.rating)}</div>
        <p>${esc(r.text)}</p>
      </div>`).join('');
  }

  // ---------- Reviews ----------
  const loadReviews = () => [...store.get('pt-reviews', []), ...REVIEWS_SEED].sort((a, b) => b.date.localeCompare(a.date));

  function renderReviews() {
    const list = loadReviews();
    const avg = list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0;
    $('#reviews-summary').innerHTML = `<strong>${avg.toFixed(1)}</strong> ${stars(Math.round(avg))} <span class="muted">${list.length} review${list.length === 1 ? '' : 's'}</span>`;
    $('#reviews-list').innerHTML = list.map(r => `
      <li class="review">
        <div class="review-head"><span class="review-name">${esc(r.name)}</span>${stars(r.rating)}</div>
        <p>${esc(r.text)}</p>
        <p class="review-meta">${byId(TYPES, r.type)?.name || ''} · ${new Date(r.date + 'T12:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      </li>`).join('');
  }

  function renderStarPicker(val) {
    $('#rev-stars').innerHTML = [1, 2, 3, 4, 5].map(n => `
      <button type="button" data-star="${n}" aria-pressed="${n <= val}" aria-label="${n} star${n > 1 ? 's' : ''}">★</button>`).join('');
  }
  $('#rev-type').innerHTML = TYPES.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  renderStarPicker(reviewRating);
  $('#rev-stars').addEventListener('click', e => {
    const b = e.target.closest('button[data-star]');
    if (!b) return;
    reviewRating = Number(b.dataset.star);
    renderStarPicker(reviewRating);
  });
  $('#review-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#rev-name').value.trim(), text = $('#rev-text').value.trim();
    if (name.length < 2) { $('#rev-name').focus(); return toast('Enter your name'); }
    if (text.length < 8) { $('#rev-text').focus(); return toast('Say a little more about your bouquet'); }
    const list = store.get('pt-reviews', []);
    list.unshift({ id: 'u' + Date.now().toString(36), name, rating: reviewRating, type: $('#rev-type').value, date: isoDate(new Date()), text });
    store.set('pt-reviews', list);
    e.target.reset();
    reviewRating = 5; renderStarPicker(5);
    toast('Thanks! Your review is posted.');
    renderReviews();
  });

  // ---------- Navigation ----------
  const PAGES = ['home', 'build', 'cart', 'checkout', 'done', 'reviews', 'about'];
  const ORDER = ['build', 'cart', 'checkout', 'done'];
  function go(v) {
    if (v === 'checkout' && !cart.length) v = 'cart';
    if (v === 'done' && !lastOrder) v = 'build';
    view = v;
    PAGES.forEach(k => { $('#view-' + k).hidden = k !== v; });
    const inOrder = ORDER.includes(v);
    $('#order-progress').hidden = !inOrder;
    if (inOrder) {
      const idx = ORDER.indexOf(v);
      document.querySelectorAll('.progress button').forEach((b, i) => {
        b.classList.toggle('active', i === idx);
        b.classList.toggle('done', i < idx);
        if (i === idx) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
        const locked = (b.dataset.nav === 'checkout' && !cart.length) || (b.dataset.nav === 'done' && !lastOrder);
        b.setAttribute('aria-disabled', locked);
      });
    }
    document.querySelectorAll('.sitenav button').forEach(b => {
      b.classList.toggle('active', b.dataset.nav === v || (b.dataset.nav === 'build' && inOrder));
    });
    updateCartBadge();
    if (v === 'home') renderHome();
    if (v === 'build') renderBuild();
    if (v === 'cart') renderCart();
    if (v === 'checkout') renderCheckout();
    if (v === 'reviews') renderReviews();
    window.scrollTo(0, 0);
  }
  document.addEventListener('click', e => {
    const n = e.target.closest('[data-nav]');
    if (n) {
      e.preventDefault();
      const to = n.dataset.nav;
      if (to === 'checkout' && !cart.length) return toast('Add a bouquet to your cart first');
      if (to === 'done' && !lastOrder) return toast('Place an order to see its confirmation');
      if (to === 'build') editingId = null;
      return go(to);
    }
    const pick = e.target.closest('[data-pick-type]');
    if (pick) {
      build.type = pick.dataset.pickType;
      const allowed = byId(TYPES, build.type).colors;
      build.colors = build.colors.filter(c => allowed.includes(c));
      if (!build.colors.length) build.colors = [allowed[0]];
    }
    const g = e.target.closest('[data-go]');
    if (!g) return;
    e.preventDefault();
    go(g.dataset.go);
  });

  function updateCartBadge() { $('#cart-count').textContent = cart.reduce((s, i) => s + i.qty, 0); }

  function saveCart() {
    store.set('pt-cart', cart);
    const n = cart.reduce((s, i) => s + i.qty, 0);
    const b = $('#cart-count');
    b.textContent = n;
    b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
  }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
  }

  // If any photo can't load (offline, or a page that blocks outside images), switch to the illustrations.
  document.addEventListener('error', e => {
    if (!photosOk || !(e.target instanceof HTMLImageElement) || !e.target.hasAttribute('data-photo')) return;
    photosOk = false;
    if (view === 'build') renderBuild(false);
  }, true);

  // ---------- Boot ----------
  if (!Array.isArray(cart) || cart.some(it => !byId(TYPES, it.type))) cart = [];
  $('#cart-count').textContent = cart.reduce((s, i) => s + i.qty, 0);
  go('home');
})();
