/* 7CARD Imprenta — lógica de la página (sin dependencias) */
(() => {
  'use strict';
  const { whatsapp, phoneDisplay } = window.SITE;
  const PRODUCTS = window.PRODUCTS, CATS = window.CATEGORIES;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const byId = id => PRODUCTS.find(p => p.id === id);
  const asset = p => (window.ASSETS && window.ASSETS[p]) || p;
  const money = n => n.toLocaleString('es-BO') + ' Bs';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const waLink = text => `https://wa.me/${whatsapp}` + (text ? `?text=${encodeURIComponent(text)}` : '');

  /* ---------- precios ---------- */
  const priceOf = (p, sel) => {
    let n = p.prices;
    if (n == null) return null;
    for (const i of sel) { n = n && n[i]; }
    return typeof n === 'number' ? n : null;
  };
  const flat = a => a.flat(Infinity).filter(x => typeof x === 'number');
  const minPrice = p => (p.prices ? Math.min(...flat(p.prices)) : null);
  const variantLabel = (p, sel) => p.selectors.map((s, i) => s.options[sel[i]]).join(' · ');

  /* ---------- estado ---------- */
  const state = { cat: 'todas', q: '', sort: 'rel' };
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem('7card-cart') || '[]').filter(i => byId(i.id)); } catch { cart = []; }
  const saveCart = () => { try { localStorage.setItem('7card-cart', JSON.stringify(cart)); } catch { /* modo privado */ } };

  /* ---------- enlaces de WhatsApp fijos ---------- */
  const hello = 'Hola 7CARD, quisiera información sobre sus promociones.';
  ['heroWa', 'ctaWa', 'contactWa', 'footWa', 'sideTab'].forEach(id => { const el = document.getElementById(id); if (el) el.href = waLink(hello); });
  $('#year').textContent = new Date().getFullYear();
  $('#factProducts').textContent = PRODUCTS.length;
  const statP = $('#statProducts'); statP.dataset.count = PRODUCTS.length;

  /* ---------- cinta: cuenta regresiva a Navidad ---------- */
  (() => {
    const now = new Date();
    let xmas = new Date(now.getFullYear(), 11, 25);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (today > xmas) xmas = new Date(now.getFullYear() + 1, 11, 25);
    const days = Math.round((xmas - today) / 864e5);
    $('#xmasText').textContent = days === 0 ? '¡Feliz Navidad!' : days === 1 ? 'Falta 1 día para Navidad' : `Faltan ${days} días para Navidad`;
  })();

  /* ---------- toast ---------- */
  let toastT;
  const toast = msg => {
    const t = $('#toast'); t.textContent = msg; t.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 2600);
  };

  /* ============================================================
     CATÁLOGO
     ============================================================ */
  const chips = $('#chips');
  chips.innerHTML = CATS.map(c => `<button class="chip" role="tab" data-cat="${c.id}" aria-selected="${c.id === state.cat}">${c.label}</button>`).join('');
  chips.addEventListener('click', e => { const b = e.target.closest('.chip'); if (b) setCat(b.dataset.cat); });

  function setCat(id) {
    state.cat = id;
    $$('.chip', chips).forEach(c => c.setAttribute('aria-selected', c.dataset.cat === id));
    renderGrid();
  }

  function filtered() {
    const q = state.q.trim().toLowerCase();
    let list = PRODUCTS.filter(p =>
      (state.cat === 'todas' || p.category === state.cat) &&
      (!q || [p.title, p.short, p.desc, p.badge, ...p.features].join(' ').toLowerCase().includes(q)));
    if (state.sort === 'asc' || state.sort === 'desc') {
      const key = p => minPrice(p) ?? Infinity;
      list = [...list].sort((a, b) => state.sort === 'asc' ? key(a) - key(b) : (minPrice(b) ?? -1) - (minPrice(a) ?? -1));
    } else if (state.sort === 'az') list = [...list].sort((a, b) => a.title.localeCompare(b.title, 'es'));
    return list;
  }

  function renderGrid() {
    const list = filtered();
    $('#grid').innerHTML = list.map((p, i) => {
      const mp = minPrice(p);
      const multi = p.prices && new Set(flat(p.prices)).size > 1;
      return `
      <article class="pcard" style="animation-delay:${Math.min(i, 8) * 70}ms" data-id="${p.id}">
        <button class="pcard__media" data-open="${p.id}" aria-label="Ver detalle de ${esc(p.title)}">
          <img src="${asset(p.img)}" alt="${esc(p.title)}" loading="lazy" style="object-fit:${p.fit};object-position:${p.pos}">
          <span class="pcard__tag">${esc(p.badge)}</span>
          <span class="pcard__zoom">Ver detalle</span>
        </button>
        <h3>${esc(p.title)}</h3>
        <p class="pcard__short">${esc(p.short)}</p>
        <div class="pcard__price">
          ${mp != null ? `<b>${multi ? 'Desde ' : ''}${money(mp)}</b><small>${esc(p.unit)}</small>` : `<span class="consult">Consulta tu precio</span><small>${esc(p.unit)}</small>`}
        </div>
        <div class="pcard__actions">
          <button class="btn btn--lav" data-open="${p.id}">Ver detalle</button>
          <button class="btn btn--add" data-quick="${p.id}" aria-label="Agregar ${esc(p.title)} a la cotización">+ Cotizar</button>
        </div>
      </article>`;
    }).join('');
    $('#empty').hidden = list.length > 0;
    const c = list.length;
    $('#results').textContent = `${c} ${c === 1 ? 'promoción' : 'promociones'}${state.cat !== 'todas' ? ' en ' + CATS.find(x => x.id === state.cat).label.toLowerCase() : ''}`;
  }

  $('#grid').addEventListener('click', e => {
    const open = e.target.closest('[data-open]'); if (open) return openProduct(open.dataset.open);
    const quick = e.target.closest('[data-quick]');
    if (quick) { const p = byId(quick.dataset.quick); addToCart(p.id, p.selectors.map(() => 0), 1); }
  });
  $('#search').addEventListener('input', e => { state.q = e.target.value; renderGrid(); });
  $('#sort').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });
  $('#clearFilters').addEventListener('click', () => { state.q = ''; $('#search').value = ''; setCat('todas'); });
  $$('[data-filter-link]').forEach(a => a.addEventListener('click', () => setCat(a.dataset.filterLink)));

  /* ============================================================
     MODAL DE PRODUCTO
     ============================================================ */
  const modal = $('#modal');
  const M = { p: null, sel: [], qty: 1 };

  function openProduct(id) {
    M.p = byId(id); M.sel = M.p.selectors.map(() => 0); M.qty = 1;
    const p = M.p;
    $('#modalBody').innerHTML = `
      <div class="modal__img"><img src="${asset(p.img)}" alt="${esc(p.title)}"></div>
      <div class="modal__info">
        <p class="kicker">${esc(p.badge)}</p>
        <h3 id="mTitle">${esc(p.title)}</h3>
        <p>${esc(p.desc)}</p>
        <ul class="feat">${p.features.map(f => `<li>${esc(f)}</li>`).join('')}</ul>
        ${p.selectors.map((s, i) => `
          <div class="opt"><label for="opt${i}">${esc(s.label)}</label>
            <select id="opt${i}" data-i="${i}">${s.options.map((o, j) => `<option value="${j}">${esc(o)}</option>`).join('')}</select>
          </div>`).join('')}
        <div class="mrow">
          <div>
            <label class="sr" for="mq">${esc(p.qtyLabel)}</label>
            <small style="display:block;font-weight:700;text-transform:uppercase;letter-spacing:.06em;font-size:12px;margin-bottom:6px">${esc(p.qtyLabel)}</small>
            <div class="qty"><button type="button" data-q="-1" aria-label="Menos">−</button><span id="mq" aria-live="polite">1</span><button type="button" data-q="1" aria-label="Más">+</button></div>
          </div>
          <div class="mprice" id="mPrice"></div>
        </div>
        <div class="mact">
          <button class="btn btn--red" id="mAdd" type="button">Agregar a mi cotización</button>
          <a class="btn btn--wa" id="mWa" href="#" target="_blank" rel="noopener">Pedir ahora por WhatsApp</a>
        </div>
      </div>`;
    updateModal();
    if (!modal.open) modal.showModal();
  }

  function updateModal() {
    const p = M.p, pr = priceOf(p, M.sel);
    $('#mq').textContent = M.qty;
    $('#mPrice').innerHTML = pr != null
      ? `<small>${esc(p.unit)}</small><b>${money(pr * M.qty)}</b>${M.qty > 1 ? `<small>${money(pr)} c/u</small>` : ''}`
      : `<small>${esc(p.unit)}</small><span class="consult">Cotizar</span>`;
    const msg = `Hola 7CARD, quisiera pedir:\n• ${p.title} (${variantLabel(p, M.sel)}) × ${M.qty}` + (pr != null ? ` = ${money(pr * M.qty)}` : ' — precio por confirmar');
    $('#mWa').href = waLink(msg);
  }

  modal.addEventListener('change', e => { if (e.target.matches('select[data-i]')) { M.sel[+e.target.dataset.i] = +e.target.value; updateModal(); } });
  modal.addEventListener('click', e => {
    const q = e.target.closest('[data-q]');
    if (q) { M.qty = Math.max(1, Math.min(999, M.qty + +q.dataset.q)); updateModal(); return; }
    if (e.target.closest('#mAdd')) { addToCart(M.p.id, [...M.sel], M.qty); modal.close(); }
    if (e.target === modal) modal.close(); // clic en el fondo
  });
  $('#modalClose').addEventListener('click', () => modal.close());

  /* ============================================================
     COTIZACIÓN (carrito)
     ============================================================ */
  const drawer = $('#drawer'), overlay = $('#overlay');
  let lastFocus = null;

  function addToCart(id, sel, qty) {
    const key = i => i.id === id && i.sel.join() === sel.join();
    const ex = cart.find(key);
    if (ex) ex.qty = Math.min(999, ex.qty + qty); else cart.push({ id, sel, qty });
    saveCart(); renderCart();
    const b = $('#cartCount'); b.classList.add('bump'); setTimeout(() => b.classList.remove('bump'), 250);
    toast(`Agregado: ${byId(id).title}`);
  }

  function cartTotals() {
    let total = 0, pending = 0;
    cart.forEach(i => { const pr = priceOf(byId(i.id), i.sel); if (pr == null) pending++; else total += pr * i.qty; });
    return { total, pending };
  }

  function cartMessage(extra = '') {
    const { total, pending } = cartTotals();
    const lines = cart.map(i => {
      const p = byId(i.id), pr = priceOf(p, i.sel);
      return `• ${p.title} (${variantLabel(p, i.sel)}) × ${i.qty}` + (pr != null ? ` = ${money(pr * i.qty)}` : ' — por cotizar');
    });
    return `Hola 7CARD, quisiera cotizar:\n${lines.join('\n')}\n` +
      (total ? `\nTotal referencial: ${money(total)}${pending ? ' + ítems por cotizar' : ''}` : '') + (extra ? `\n\n${extra}` : '');
  }

  function renderCart() {
    const count = cart.reduce((n, i) => n + i.qty, 0);
    $('#cartCount').textContent = count;
    const body = $('#cartBody'), foot = $('#cartFoot');
    if (!cart.length) {
      body.innerHTML = `<div class="cempty"><svg viewBox="0 0 24 24"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/></svg><p>Tu cotización está vacía.<br>Agrega promociones desde el catálogo.</p></div>`;
      foot.innerHTML = `<a class="btn btn--red btn--block" href="#promociones" data-close-drawer>Ver promociones</a>`;
    } else {
      body.innerHTML = cart.map((i, idx) => {
        const p = byId(i.id), pr = priceOf(p, i.sel);
        return `<div class="citem">
          <img src="${asset(p.img)}" alt="" style="object-fit:${p.fit}">
          <div><h4>${esc(p.title)}</h4><p>${esc(variantLabel(p, i.sel))}</p>
            <div class="qty"><button data-ci="${idx}" data-d="-1" aria-label="Menos">−</button><span>${i.qty}</span><button data-ci="${idx}" data-d="1" aria-label="Más">+</button></div></div>
          <div class="citem__side"><span>${pr != null ? money(pr * i.qty) : 'A cotizar'}</span><button class="citem__rm" data-rm="${idx}">Quitar</button></div>
        </div>`;
      }).join('');
      const { total, pending } = cartTotals();
      foot.innerHTML = `
        <div class="total"><span>Total referencial<small>${pending ? `+ ${pending} ${pending > 1 ? 'ítems' : 'ítem'} por cotizar · ` : ''}sujeto a confirmación</small></span><span>${money(total)}</span></div>
        <a class="btn btn--red btn--block" id="cartSend" href="${waLink(cartMessage())}" target="_blank" rel="noopener">Enviar cotización por WhatsApp</a>
        <a class="btn btn--lav btn--block" href="#contacto" data-close-drawer>Completar mis datos</a>
        <button class="link-btn" id="cartClear" type="button">Vaciar cotización</button>`;
    }
    renderMini(); renderProductSelect();
  }

  $('#cartBody').addEventListener('click', e => {
    const d = e.target.closest('[data-d]'), rm = e.target.closest('[data-rm]');
    if (d) { const it = cart[+d.dataset.ci]; it.qty = Math.max(1, Math.min(999, it.qty + +d.dataset.d)); }
    else if (rm) cart.splice(+rm.dataset.rm, 1);
    else return;
    saveCart(); renderCart();
  });
  $('#cartFoot').addEventListener('click', e => {
    if (e.target.closest('#cartClear')) { cart = []; saveCart(); renderCart(); toast('Cotización vaciada'); }
    if (e.target.closest('[data-close-drawer]')) closeDrawer();
  });

  function openDrawer() {
    lastFocus = document.activeElement;
    overlay.hidden = false; requestAnimationFrame(() => overlay.classList.add('is-on'));
    drawer.classList.add('is-open'); drawer.setAttribute('aria-hidden', 'false'); drawer.focus();
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    overlay.classList.remove('is-on'); setTimeout(() => (overlay.hidden = true), 300);
    drawer.classList.remove('is-open'); drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $('#cartOpen').addEventListener('click', openDrawer);
  $('#cartClose').addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  /* Resumen en la sección de contacto */
  function renderMini() {
    const m = $('#miniCart');
    if (!cart.length) { m.hidden = true; return; }
    m.hidden = false;
    m.innerHTML = `<b>Tu cotización (${cart.reduce((n, i) => n + i.qty, 0)})</b><ul>${cart.map(i => `<li>${esc(byId(i.id).title)} × ${i.qty}</li>`).join('')}</ul><button type="button" id="miniOpen">Editar cotización</button>`;
    $('#miniOpen').onclick = openDrawer;
  }

  /* ============================================================
     FORMULARIO → WhatsApp
     ============================================================ */
  const fProduct = $('#fProduct');
  function renderProductSelect() {
    const cur = fProduct.value;
    fProduct.innerHTML = `<option value="">${cart.length ? 'Lo que está en mi cotización' : 'Selecciona una promoción'}</option>` +
      PRODUCTS.map(p => `<option value="${p.id}">${esc(p.title)}</option>`).join('');
    fProduct.value = cur;
  }

  $('#contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = $('#fName').value.trim(), phone = $('#fPhone').value.trim();
    const setErr = (field, errEl, msg) => { $(errEl).textContent = msg; $(field).closest('.field').classList.toggle('has-err', !!msg); };
    setErr('#fName', '#eName', name.length < 2 ? 'Escribe tu nombre.' : '');
    setErr('#fPhone', '#ePhone', phone.replace(/\D/g, '').length < 7 ? 'Escribe un número válido.' : '');
    if (name.length < 2 || phone.replace(/\D/g, '').length < 7) return;

    const msg = $('#fMsg').value.trim(), pid = fProduct.value;
    let text = `Hola 7CARD, soy ${name} (${phone}).`;
    if (pid) text += `\nMe interesa: ${byId(pid).title}.`;
    if (cart.length) text = cartMessage(`Soy ${name} (${phone}).` + (msg ? `\n${msg}` : ''));
    else if (msg) text += `\n${msg}`;
    window.open(waLink(text), '_blank', 'noopener');
    toast('Abriendo WhatsApp…');
    e.target.reset(); renderProductSelect();
  });

  /* ============================================================
     CARRUSEL PRINCIPAL (hero)
     ============================================================ */
  (() => {
    const deck = $('#deck'), dots = $('#deckDots'), price = $('#deckPrice');
    const slides = window.HERO_SLIDES.map(byId);
    deck.innerHTML = slides.map(p => `<button class="deck__card" data-open="${p.id}" aria-label="Ver ${esc(p.title)}"><img src="${asset(p.img)}" alt="${esc(p.title)}" style="object-position:${p.pos}"></button>`).join('');
    dots.innerHTML = slides.map((p, i) => `<button role="tab" aria-label="${esc(p.title)}" aria-selected="false" data-i="${i}"></button>`).join('');
    const cards = $$('.deck__card', deck), dbtn = $$('button', dots);
    let cur = 0, timer;
    const show = i => {
      const prev = cur; cur = (i + slides.length) % slides.length;
      cards.forEach((c, k) => { c.classList.toggle('is-active', k === cur); c.classList.toggle('is-prev', k === prev && k !== cur); });
      dbtn.forEach((d, k) => d.setAttribute('aria-selected', k === cur));
      const p = slides[cur], mp = minPrice(p), multi = p.prices && new Set(flat(p.prices)).size > 1;
      price.innerHTML = mp != null ? `<small>${multi ? 'Desde' : p.unit}</small>${money(mp)}` : `<small>${esc(p.badge)}</small>Consulta tu precio`;
    };
    const play = () => { if (reduceMotion) return; clearInterval(timer); timer = setInterval(() => show(cur + 1), 4500); };
    dots.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { show(+b.dataset.i); play(); } });
    deck.addEventListener('click', e => { const b = e.target.closest('[data-open]'); if (b) openProduct(b.dataset.open); });
    $('.hero__visual').addEventListener('mouseenter', () => clearInterval(timer));
    $('.hero__visual').addEventListener('mouseleave', play);
    show(0); play();
  })();

  /* Showcase (sección Nosotros) con botón de pausa */
  (() => {
    const wrap = $('#showcase'), box = $('#showcaseSlides');
    const imgs = ['poleras-03-08', 'calendario-promo-1000', 'poleras-04-06', 'volantes', 'poleras-01-02', 'calendario-con-taco'];
    box.innerHTML = imgs.map(n => `<img src="${asset('img/' + n + '.jpg')}" alt="" loading="lazy">`).join('');
    const els = $$('img', box); let i = 0, t;
    const show = k => { i = k % els.length; els.forEach((e, j) => e.classList.toggle('is-active', j === i)); };
    const play = () => { if (!reduceMotion) t = setInterval(() => show(i + 1), 4500); };
    $('#showcasePause').addEventListener('click', e => {
      const paused = wrap.classList.toggle('is-paused');
      e.currentTarget.setAttribute('aria-label', paused ? 'Reanudar animación' : 'Pausar animación');
      clearInterval(t); if (!paused) play();
    });
    show(0); play();
  })();

  /* ============================================================
     GALERÍA + LIGHTBOX
     ============================================================ */
  const G = window.GALLERY, lb = $('#lightbox'); let gi = 0;
  $('#galleryGrid').innerHTML = G.map((g, i) => `<button class="gitem" data-g="${i}" data-title="${esc(g.title)}" aria-label="Ampliar: ${esc(g.title)}"><img src="${asset(g.img)}" alt="${esc(g.title)}" loading="lazy"></button>`).join('');
  const showG = i => { gi = (i + G.length) % G.length; $('#lbImg').src = asset(G[gi].img); $('#lbImg').alt = G[gi].title; $('#lbCap').textContent = G[gi].title; };
  $('#galleryGrid').addEventListener('click', e => { const b = e.target.closest('[data-g]'); if (b) { showG(+b.dataset.g); lb.showModal(); } });
  $('#lbPrev').addEventListener('click', () => showG(gi - 1));
  $('#lbNext').addEventListener('click', () => showG(gi + 1));
  $('#lbClose').addEventListener('click', () => lb.close());
  lb.addEventListener('click', e => { if (e.target === lb) lb.close(); });
  lb.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') showG(gi - 1); if (e.key === 'ArrowRight') showG(gi + 1); });

  /* ============================================================
     NAVEGACIÓN, SCROLL, REVEAL, CONTADORES
     ============================================================ */
  const header = $('#header'), nav = $('#nav'), burger = $('#burger');
  const closeNav = () => { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', false); };
  addEventListener('scroll', () => header.classList.toggle('is-scrolled', scrollY > 10), { passive: true });
  burger.addEventListener('click', () => {
    const o = nav.classList.toggle('is-open'); burger.setAttribute('aria-expanded', o);
  });
  nav.addEventListener('click', e => { if (e.target.closest('a')) closeNav(); });
  document.addEventListener('click', e => { if (nav.classList.contains('is-open') && !header.contains(e.target)) closeNav(); });

  const links = $$('.nav a'), map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting && map.has(en.target.id)) { links.forEach(l => l.classList.remove('is-active')); map.get(en.target.id).classList.add('is-active'); }
  }), { rootMargin: '-45% 0px -50% 0px' });
  [...map.keys()].forEach(id => { const s = document.getElementById(id); if (s) spy.observe(s); });

  const reveal = new IntersectionObserver((es, o) => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); o.unobserve(en.target); } }), { threshold: .01 });
  $$('.reveal').forEach(el => reveal.observe(el));

  const count = new IntersectionObserver((es, o) => es.forEach(en => {
    if (!en.isIntersecting) return; o.unobserve(en.target);
    const el = en.target, end = +el.dataset.count; let n = 0;
    const step = () => { n += Math.max(1, Math.ceil(end / 24)); if (n >= end) { el.textContent = end; return; } el.textContent = n; requestAnimationFrame(step); };
    reduceMotion ? (el.textContent = end) : step();
  }), { threshold: .1 });
  $$('[data-count]').forEach(el => count.observe(el));

  addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (drawer.classList.contains('is-open')) closeDrawer();
    if (nav.classList.contains('is-open')) closeNav();
  });

  /* ---------- inicio ---------- */
  renderGrid(); renderCart();
})();
