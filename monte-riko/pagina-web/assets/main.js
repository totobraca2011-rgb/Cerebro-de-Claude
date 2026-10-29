(() => {
  /* la clase .js la pone este archivo al final de una inicialización completa: si no carga
     o falla a mitad de camino, la página queda en su versión sin JS (armador oculto, botón
     directo a WhatsApp, nada escondido por animaciones) */
  const root = document.documentElement;
  try {
    const WA = 'https://wa.me/5492236188694';
    const UNIDAD = { marplatense: 2800, patagonico: 3000 };
    const SIZES = {
      media: { n: 6, price: 16500, one: 'media docena', many: 'medias docenas' },
      docena: { n: 12, price: 32000, one: 'docena', many: 'docenas' }
    };
    const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    const money = (n) => '$' + fmt(n);
    const pl = (n, one, many) => (n === 1 ? one : many);
    const flavor = (s, n) => (s === 'marplatense' ? pl(n, 'marplatense', 'marplatenses') : pl(n, 'patagónico', 'patagónicos'));
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* precio en Rubik Mono One: el punto de miles va en un span que cierra la celda.
       Si el valor no cambió no se toca: es una región viva y se volvería a anunciar. */
    function setMoney(el, n) {
      if (el.dataset.v === String(n)) return;
      el.dataset.v = n;
      el.textContent = '';
      const parts = ('$' + fmt(n)).split('.');
      parts.forEach((part, i) => {
        if (i) { const s = document.createElement('span'); s.className = 'p'; s.textContent = '.'; el.append(s); }
        el.append(part);
      });
    }

    /* movimientos chicos del armador con la Web Animations API: no tocan el DOM ni el texto, así
       las regiones vivas no se vuelven a anunciar. Con reduce no se mueve nada */
    const EASE = 'cubic-bezier(.2, .7, .2, 1)';   /* --ease-out */
    const play = (el, frames, opts) => { if (!reduced && el.animate) el.animate(frames, { easing: EASE, ...opts }); };
    /* el total da un saltito cuando cambia */
    const bump = (el) => play(el, [
      { transform: 'none' }, { transform: 'translateY(-4px) scale(1.03)', offset: .4 }, { transform: 'none' }
    ], { duration: 260 });
    /* un circulito que cambia de sabor se aprieta y vuelve; uno nuevo aparece desde chico */
    const popDot = (d, delay, fresh) => play(d, fresh
      ? [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'none' }]
      : [{ transform: 'scale(.6)' }, { transform: 'scale(1.12)', offset: .6 }, { transform: 'none' }],
    { duration: 340, delay, fill: 'backwards' });

    /* ---------- armador de pedido ---------- */
    const form = document.getElementById('builder');
    const boxesEl = document.getElementById('boxes');
    const addBtn = document.getElementById('add-box');
    const nombreEl = document.getElementById('nombre');
    /* dos bloques, cada uno con su entrega, su total, su mensaje y su botón de WhatsApp */
    const out = (key) => ({
      line: document.getElementById('total-line-' + key),
      total: document.getElementById('total-' + key),
      label: document.getElementById('total-label-' + key),
      note: document.getElementById('note-' + key),
      empty: document.getElementById('empty-' + key),
      preview: document.getElementById('preview-' + key),
      send: document.getElementById('send-' + key)
    });
    const OUT = { cajas: out('cajas'), sueltos: out('sueltos') };

    /* escribe solo si cambia: evita reanunciar regiones vivas y repintar */
    const setText = (el, t) => { t = String(t); if (el.textContent !== t) el.textContent = t; };
    /* límite alcanzado: aria-disabled en vez de disabled, así el foco no se pierde ni salta */
    const setOff = (btn, off) => {
      if (off) btn.setAttribute('aria-disabled', 'true'); else btn.removeAttribute('aria-disabled');
    };
    const isOff = (btn) => btn.getAttribute('aria-disabled') === 'true';

    let uid = 0;
    /* ratio: proporción de marplatenses que eligió la persona; sobrevive a los cambios de tamaño */
    const newBox = (size, mdp) => ({ id: 'c' + (uid++), size, mdp, count: 1, ratio: mdp / SIZES[size].n });

    /* reescala a otro tamaño respetando la proporción guardada; si un sabor estaba, queda al menos 1 */
    function resize(b, size) {
      const to = SIZES[size].n;
      let m = Math.round(b.ratio * to);
      if (b.ratio > 0) m = Math.max(1, m);
      if (b.ratio < 1) m = Math.min(to - 1, m);
      b.size = size; b.mdp = Math.max(0, Math.min(to, m));
    }
    const boxes = [newBox('docena', 6)];
    const loose = { marplatense: 0, patagonico: 0 };

    function boxMarkup(b) {
      const id = b.id;
      const stepper = (key, label) => `
        <div class="row">
          <span class="row__label" id="${id}-${key}">${label}</span>
          <div class="qty" role="group" aria-labelledby="${id}-${key}">
            <button type="button" data-act="${key}" data-d="-1">−</button>
            <span class="qty__n" data-n="${key}"></span>
            <button type="button" data-act="${key}" data-d="1">+</button>
          </div>
        </div>`;
      return `
        <div class="box__head">
          <h4 class="box__title" id="${id}-t"></h4>
          <button type="button" class="box__remove" data-act="remove">Quitar<span class="sr-only" data-label="remove"></span></button>
        </div>
        <fieldset>
          <legend>Tamaño</legend>
          <div class="seg">
            <label><input type="radio" name="${id}-size" value="media"><span>Media docena</span></label>
            <label><input type="radio" name="${id}-size" value="docena"><span>Docena</span></label>
          </div>
        </fieldset>
        <div class="box__mix">
          <p class="box__dots" aria-hidden="true"></p>
          <div class="box__rows">${stepper('mdp', 'Marplatense')}${stepper('pat', 'Patagónico')}</div>
          <p class="box__sum" aria-live="polite"></p>
        </div>
        <div class="row">
          <span class="row__label" id="${id}-count">Cajas así</span>
          <div class="qty" role="group" aria-labelledby="${id}-count">
            <button type="button" data-act="count" data-d="-1">−</button>
            <output aria-labelledby="${id}-count"></output>
            <button type="button" data-act="count" data-d="1">+</button>
          </div>
        </div>`;
    }

    function sumText(b) {
      const n = SIZES[b.size].n; const pat = n - b.mdp;
      let t;
      if (pat === 0) t = 'Toda de marplatense';
      else if (b.mdp === 0) t = 'Toda de patagónico';
      else t = `Surtida: ${b.mdp} ${flavor('marplatense', b.mdp)} y ${pat} ${flavor('patagonico', pat)}`;
      return b.count > 1 ? t + ', cada caja.' : t + '.';
    }

    /* sincroniza una caja ya dibujada: solo textContent, atributos y estados */
    function syncBox(el, b, i) {
      const n = SIZES[b.size].n; const pat = n - b.mdp; const k = i + 1;
      setText(el.querySelector('.box__title'), `Caja ${k}`);
      setText(el.querySelector('[data-label="remove"]'), ` caja ${k}`);
      el.querySelector('.box__remove').hidden = boxes.length < 2;   /* siempre queda una caja */
      el.querySelectorAll('input[type="radio"]').forEach((r) => { r.checked = r.value === b.size; });
      setText(el.querySelector('[data-n="mdp"]'), b.mdp);
      setText(el.querySelector('[data-n="pat"]'), pat);
      setText(el.querySelector('output'), b.count);
      const [mMinus, mPlus] = el.querySelectorAll('[data-act="mdp"]');
      const [pMinus, pPlus] = el.querySelectorAll('[data-act="pat"]');
      const [cMinus, cPlus] = el.querySelectorAll('[data-act="count"]');
      mMinus.setAttribute('aria-label', `Quitar un marplatense de la caja ${k}`);
      mPlus.setAttribute('aria-label', `Sumar un marplatense a la caja ${k}`);
      pMinus.setAttribute('aria-label', `Quitar un patagónico de la caja ${k}`);
      pPlus.setAttribute('aria-label', `Sumar un patagónico a la caja ${k}`);
      cMinus.setAttribute('aria-label', `Una caja menos como la caja ${k}`);
      cPlus.setAttribute('aria-label', `Una caja más como la caja ${k}`);
      setOff(mMinus, b.mdp <= 0); setOff(pPlus, b.mdp <= 0);
      setOff(mPlus, pat <= 0); setOff(pMinus, pat <= 0);
      setOff(cMinus, b.count <= 1); setOff(cPlus, b.count >= 20);
      /* los circulitos no se regeneran: se cambia de clase solo el que cambió de sabor y se
         agregan o quitan los del final. En una caja recién dibujada no se anima nada */
      const dots = el.querySelector('.box__dots');
      const had = dots.childElementCount;
      let step = 0;
      for (let j = 0; j < n; j++) {
        const cls = j < b.mdp ? 'd-mdp' : 'd-pat';
        let d = dots.children[j];
        const fresh = !d;
        if (fresh) { d = document.createElement('span'); dots.append(d); }
        if (d.className === cls) continue;
        d.className = cls;
        if (had) popDot(d, (step++) * 30, fresh);
      }
      while (dots.childElementCount > n) dots.lastElementChild.remove();
      setText(el.querySelector('.box__sum'), sumText(b));
    }

    /* estructura: solo cuando se agregan o quitan cajas */
    function build() {
      const existing = new Map([...boxesEl.children].map((el) => [el.dataset.id, el]));
      const keep = new Set(boxes.map((b) => b.id));
      existing.forEach((el, id) => { if (!keep.has(id)) el.remove(); });
      boxes.forEach((b) => {
        if (existing.has(b.id)) return;
        const el = document.createElement('div');
        el.className = 'box'; el.dataset.id = b.id;
        el.setAttribute('role', 'group'); el.setAttribute('aria-labelledby', b.id + '-t');
        el.innerHTML = boxMarkup(b);
        boxesEl.append(el);
      });
      updateCajas();
    }

    function describeBox(b) {
      const s = SIZES[b.size]; const pat = s.n - b.mdp;
      const fmtName = b.count + ' ' + pl(b.count, s.one, s.many);
      if (pat === 0) return `${fmtName} de marplatenses`;
      if (b.mdp === 0) return `${fmtName} de patagónicos`;
      const mix = `${b.mdp} ${flavor('marplatense', b.mdp)} y ${pat} ${flavor('patagonico', pat)}`;
      return b.count > 1 ? `${fmtName} surtidas, cada una con ${mix}` : `${fmtName} surtida: ${mix}`;
    }

    const entregaOf = (key) => document.querySelector(`input[name="entrega-${key}"]:checked`).value;
    const isEnvio = (entrega) => entrega.startsWith('Envío');
    /* con envío el total es sin envío (se arregla por WhatsApp); con retiro, es el precio final */
    const totalLine = (total, entrega) => 'Total: ' + money(total) + (isEnvio(entrega) ? ' (sin envío)' : '');
    const firma = () => { const n = nombreEl.value.trim(); return n ? ['Soy ' + n + '.'] : []; };

    function messageCajas() {
      const entrega = entregaOf('cajas');
      const total = boxes.reduce((t, b) => t + SIZES[b.size].price * b.count, 0);
      const items = boxes.map((b) => '• ' + describeBox(b));
      const parts = ['¡Hola Monte Riko! Quiero hacer un pedido de cajas:', ...items, 'Entrega: ' + entrega, totalLine(total, entrega), ...firma()];
      return { text: parts.join('\n'), total, entrega };
    }

    function messageSueltos() {
      const entrega = entregaOf('sueltos');
      const total = loose.marplatense * UNIDAD.marplatense + loose.patagonico * UNIDAD.patagonico;
      const items = [];
      if (loose.marplatense) items.push(`• ${loose.marplatense} ${flavor('marplatense', loose.marplatense)}`);
      if (loose.patagonico) items.push(`• ${loose.patagonico} ${flavor('patagonico', loose.patagonico)}`);
      /* sin alfajores no se inventa un pedido: el mensaje solo dice qué quiere y cómo le llega */
      const parts = items.length
        ? ['¡Hola Monte Riko! Quiero hacer un pedido de alfajores sueltos:', ...items, 'Entrega: ' + entrega, totalLine(total, entrega), ...firma()]
        : ['¡Hola Monte Riko! Quiero pedir alfajores sueltos.', 'Entrega: ' + entrega, ...firma()];
      return { text: parts.join('\n'), total, entrega };
    }
    const MESSAGE = { cajas: messageCajas, sueltos: messageSueltos };

    /* total, rótulo, aviso y mensaje de un bloque. El total salta solo si cambió el número */
    function render(key) {
      const o = OUT[key]; const m = MESSAGE[key]();
      const before = o.total.dataset.v;
      setMoney(o.total, m.total);
      if (before !== undefined && before !== o.total.dataset.v) bump(o.total);
      const envio = isEnvio(m.entrega);
      setText(o.label, envio ? 'Total sin envío' : 'Total');
      /* sueltos vacío: sin total ni nota, solo el aviso. hidden se escribe solo si cambia */
      const vacio = m.total === 0;
      const show = (el, on) => { if (el && el.hidden === on) el.hidden = !on; };
      show(o.line, !vacio);
      show(o.note, envio && !vacio);
      show(o.empty, vacio);
      setText(o.preview, m.text);
      const href = WA + '?text=' + encodeURIComponent(m.text);
      if (o.send.getAttribute('href') !== href) o.send.href = href;
    }

    function updateCajas() {
      setOff(addBtn, boxes.length >= 10);
      [...boxesEl.children].forEach((el, i) => syncBox(el, boxes[i], i));
      render('cajas');
    }

    function updateSueltos() {
      ['marplatense', 'patagonico'].forEach((s) => {
        const key = s === 'marplatense' ? 'mdp' : 'pat';
        setText(document.getElementById(`loose-${key}-n`), loose[s]);
        const [minus, plus] = document.querySelectorAll(`[data-loose="${s}"]`);
        setOff(minus, loose[s] <= 0); setOff(plus, loose[s] >= 40);
      });
      render('sueltos');
    }

    if (form && boxesEl) {
      form.addEventListener('submit', (e) => e.preventDefault());

      boxesEl.addEventListener('change', (e) => {
        const el = e.target.closest('.box'); if (!el || e.target.type !== 'radio') return;
        const b = boxes.find((x) => x.id === el.dataset.id);
        resize(b, e.target.value);
        updateCajas();
      });

      boxesEl.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-act]'); if (!btn || isOff(btn)) return;
        const el = btn.closest('.box');
        const i = boxes.findIndex((x) => x.id === el.dataset.id);
        const b = boxes[i]; const n = SIZES[b.size].n; const d = +btn.dataset.d;
        if (btn.dataset.act === 'remove') { boxes.splice(i, 1); build(); addBtn.focus(); return; }
        if (btn.dataset.act === 'mdp' || btn.dataset.act === 'pat') {
          b.mdp = Math.max(0, Math.min(n, b.mdp + (btn.dataset.act === 'mdp' ? d : -d)));
          b.ratio = b.mdp / n;
        }
        if (btn.dataset.act === 'count') b.count = Math.max(1, Math.min(20, b.count + d));
        updateCajas();
      });

      addBtn.addEventListener('click', () => {
        if (isOff(addBtn)) return;
        const b = newBox('media', 3);
        boxes.push(b);
        build();
        const first = boxesEl.querySelector(`.box[data-id="${b.id}"] input:checked`);
        if (first) first.focus();
      });

      document.querySelectorAll('[data-loose]').forEach((btn) => btn.addEventListener('click', () => {
        if (isOff(btn)) return;
        const s = btn.dataset.loose;
        loose[s] = Math.max(0, Math.min(40, loose[s] + +btn.dataset.d));
        updateSueltos();
      }));

      /* la entrega cambia el rótulo del total y el mensaje de su bloque; el nombre va en los dos */
      Object.keys(OUT).forEach((key) => document.querySelectorAll(`input[name="entrega-${key}"]`)
        .forEach((r) => r.addEventListener('change', () => render(key))));
      nombreEl.addEventListener('input', () => { render('cajas'); render('sueltos'); });
      build();
      updateSueltos();

      /* los botones de precios cargan el formato elegido. Sin JS apuntan a #pedido (el armador
         está oculto); con JS, a su bloque */
      document.querySelectorAll('[data-formato]').forEach((a) => {
        a.href = a.dataset.formato === 'unidad' ? '#pedido-sueltos' : '#pedido-cajas';
      });
      document.querySelectorAll('[data-formato]').forEach((a) => a.addEventListener('click', () => {
        const f = a.dataset.formato;
        if (f === 'unidad') {
          if (loose.marplatense + loose.patagonico === 0) loose.marplatense = 1;
          updateSueltos(); return;
        }
        const b = boxes[0];
        if (b.size !== f) resize(b, f);
        updateCajas();
      }));
    }

    /* ---------- acordeón ---------- */
    const acc = document.getElementById('acc');
    if (acc) {
      const items = [...acc.querySelectorAll('.acc__item')];
      const columns = window.matchMedia('(min-width: 761px)');
      /* en celular, cuando se pliega un panel que está arriba del tocado, todo lo de abajo sube
         (hasta 400px) y el botón se escapa de debajo del dedo. Mientras dura el pliegue (420ms y
         --ease-in-out en el CSS) se corrige el scroll cuadro a cuadro, antes de pintar:
         - si el panel que se abre entra debajo del botón, el botón queda donde estaba;
         - si no entra (se tocó un título cerca del borde de abajo), el botón sube con la misma
           curva hasta donde el panel entra entero, sin pasar de 16px del borde de arriba.
         Con reduce el cambio es instantáneo y alcanza con una corrección. Si la persona toca,
         desliza, hace clic, usa el teclado o el foco se mueve, se le deja el scroll */
      const DUR = 420;
      /* cubic-bezier(.65, 0, .35, 1), la de --ease-in-out: se busca el t de la x y se da la y */
      const easeInOut = (x) => {
        const bz = (t, p1, p2) => 3 * (1 - t) * (1 - t) * t * p1 + 3 * (1 - t) * t * t * p2 + t * t * t;
        let lo = 0, hi = 1, t = x;
        for (let i = 0; i < 20; i++) { t = (lo + hi) / 2; if (bz(t, .65, .35) < x) lo = t; else hi = t; }
        return bz(t, 0, 1);
      };
      const STOPS = ['touchstart', 'wheel', 'keydown', 'mousedown', 'focusin'];
      let pin = 0;
      let release = () => {};
      const hold = (b, y0, panel) => {
        release();
        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const vh = document.documentElement.clientHeight;
        const head = b.offsetHeight;
        const body = panel ? panel.querySelector('.acc__inner').scrollHeight : 0;
        const yEnd = y0 + head + body <= vh - 24 ? y0 : Math.min(y0, Math.max(16, vh - 24 - head - body));
        const t0 = performance.now();
        const progress = () => (still ? 1 : Math.min(1, (performance.now() - t0) / DUR));
        const fix = () => {
          const dy = b.getBoundingClientRect().top - (y0 + (yEnd - y0) * easeInOut(progress()));
          if (Math.abs(dy) >= 0.5) window.scrollBy({ top: dy, behavior: 'instant' });
        };
        const stop = () => {
          cancelAnimationFrame(pin);
          STOPS.forEach((e) => window.removeEventListener(e, stop, true));
          release = () => {};
        };
        release = stop;
        STOPS.forEach((e) => window.addEventListener(e, stop, { capture: true, passive: true }));
        fix();
        /* sigue mientras el acordeón se esté moviendo (las accIn terminadas quedan con both y no
           cuentan), con un tope para no quedarse con el scroll de nadie */
        const busy = () => progress() < 1 || (acc.getAnimations && acc.getAnimations({ subtree: true }).some((x) => x.playState === 'running' || x.playState === 'pending'));
        const tick = () => { fix(); if (busy() && performance.now() - t0 < 700) pin = requestAnimationFrame(tick); else stop(); };
        if (still) stop(); else pin = requestAnimationFrame(tick);
      };
      /* sin JS todos los paneles se ven abiertos (aria-expanded="true" en el HTML);
         con JS queda abierto solo el que tiene .is-open */
      items.forEach((item) => {
        const b = item.querySelector('.acc__head button');
        b.setAttribute('aria-expanded', String(item.classList.contains('is-open')));
        b.addEventListener('click', () => {
          /* si main.js falló más abajo, la página quedó en su versión sin JS: no se toca nada */
          if (!root.classList.contains('js')) return;
          acc.classList.add('is-live');
          const opening = !item.classList.contains('is-open');
          const wide = columns.matches;
          if (!opening && wide) return;
          const y0 = b.getBoundingClientRect().top;
          items.forEach((o) => { o.classList.remove('is-open'); o.querySelector('.acc__head button').setAttribute('aria-expanded', 'false'); });
          if (opening) { item.classList.add('is-open'); b.setAttribute('aria-expanded', 'true'); }
          if (!wide) hold(b, y0, opening ? item.querySelector('.acc__panel') : null);
        });
      });
    }

    /* ---------- entradas ---------- */
    const shutter = document.querySelector('.shutter');
    if (shutter) requestAnimationFrame(() => setTimeout(() => shutter.classList.add('is-in'), 120));

    const reveal = [...document.querySelectorAll('[data-reveal]')];
    const groups = new Map();
    reveal.forEach((el) => {
      /* cada alfajor escalona sus textos por su cuenta */
      const sec = el.closest('article, section, footer') || document.body;
      const n = groups.get(sec) || 0; groups.set(sec, n + 1);
      el.style.setProperty('--d', Math.min(n, 5) * 80 + 'ms');
    });
    if (reduced || !('IntersectionObserver' in window)) {
      reveal.forEach((el) => el.classList.add('is-in'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
      reveal.forEach((el) => io.observe(el));
    }

    /* los circulitos de cada caja de precios entran de a uno: el CSS los escalona con --i */
    document.querySelectorAll('.tile__dots').forEach((p) => [...p.children].forEach((d, i) => d.style.setProperty('--i', i)));

    /* fotos con persiana (los alfajores, la playa y la historia): se abren como la del hero cuando
       entran. Tienen su propio observer y su propia clase (.is-open), aparte de data-reveal; sin
       observer o con reduce, abiertas. Se observa siempre la figura, que no se recorta: un
       elemento recortado del todo no cuenta como visible */
    const photos = [...document.querySelectorAll('.treat__photo, .band__photo, .story__photo')];
    if (reduced || !('IntersectionObserver' in window)) {
      photos.forEach((el) => el.classList.add('is-open'));
    } else {
      const po = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-open'); po.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
      photos.forEach((el) => po.observe(el));
    }

    /* un solo listener de resize, con espera, para todo lo que mide */
    const onResize = [];
    let rt;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => onResize.forEach((f) => f()), 150); });

    /* hero con el scroll: un listener pasivo que solo lee scrollY y pide un cuadro; el cuadro
       escribe --hero-p (0 a 1) en el hero. Solo escucha mientras el hero está en pantalla */
    const hero = document.querySelector('.hero');
    if (hero && !reduced && 'IntersectionObserver' in window) {
      let heroH = hero.offsetHeight;
      let y = 0; let queued = false; let listening = false;
      const paint = () => {
        queued = false;
        hero.style.setProperty('--hero-p', Math.min(1, Math.max(0, y / heroH)).toFixed(4));
      };
      const onScroll = () => { y = window.scrollY; if (!queued) { queued = true; requestAnimationFrame(paint); } };
      new IntersectionObserver((entries) => {
        const on = entries[entries.length - 1].isIntersecting;
        if (on && !listening) { heroH = hero.offsetHeight || 1; window.addEventListener('scroll', onScroll, { passive: true }); listening = true; onScroll(); }
        if (!on && listening) { window.removeEventListener('scroll', onScroll); listening = false; }
      }).observe(hero);
      onResize.push(() => { heroH = hero.offsetHeight || 1; });
    }

    /* ---------- burbujas ---------- */
    const fabs = document.getElementById('fabs');
    const main = document.getElementById('contenido');
    if (fabs && hero && 'IntersectionObserver' in window) {
      /* la flecha aparece cuando el hero salió entero de la pantalla; vale la última entrada del lote */
      new IntersectionObserver((entries) => {
        fabs.classList.toggle('is-past', !entries[entries.length - 1].isIntersecting);
      }).observe(hero);

      /* la zona es el rectángulo que ocupan las burbujas abajo a la derecha (más un margen para el
         anillo de foco), medido en píxeles: un rootMargin en % queda corto en pantallas bajas.
         Lo que entra en ese rectángulo prende una clase en .fabs y el CSS decide qué se esconde.
         Los stickers redondos no hace falta mirarlos: en cada ancho van lejos de esa esquina. */
      const $ = (sel) => [...document.querySelectorAll(sel)];
      const desktop = window.matchMedia('(min-width: 1025px)');    /* armador en dos columnas */
      const accColumns = window.matchMedia('(min-width: 761px)');  /* acordeón en columnas */
      const toTopEl = fabs.querySelector('.fab--top');
      const PAD = 16;
      let observers = [];
      let lastKey = '';
      const watch = (els, cls, margin) => {
        if (!els.length) return;
        const on = new Set();
        const io = new IntersectionObserver((entries) => {
          entries.forEach((en) => { if (en.isIntersecting) on.add(en.target); else on.delete(en.target); });
          fabs.classList.toggle(cls, on.size > 0);
        }, { rootMargin: margin });
        els.forEach((el) => io.observe(el));
        observers.push({ io, cls });
      };
      /* rootMargin que deja como raíz solo el rectángulo r (más un margen) */
      const vw = () => document.documentElement.clientWidth;   /* sin la barra de scroll clásica */
      const vh = () => document.documentElement.clientHeight;
      const around = (r, pad) => `-${Math.max(0, Math.round(r.top - pad))}px -${Math.max(0, Math.round(vw() - r.right - pad))}px -${Math.max(0, Math.round(vh() - r.bottom - pad))}px -${Math.max(0, Math.round(r.left - pad))}px`;
      const setup = () => {
        const r = fabs.getBoundingClientRect();
        /* el rectángulo de la flecha sin sus transformaciones (al aparecer está achicada) */
        const a = { top: r.top + toTopEl.offsetTop, left: r.left + toTopEl.offsetLeft };
        a.right = a.left + toTopEl.offsetWidth; a.bottom = a.top + toTopEl.offsetHeight;
        /* si no cambió nada de lo que se mide, no se rearma. En celular la barra de direcciones
           cambia el alto al scrollear y el rearmado igual ocurre: lo que evita el parpadeo es que
           solo se borran las clases que dejan de observarse (abajo) */
        const key = [vw(), vh(), r.top, r.left, a.top, a.left, desktop.matches, accColumns.matches].map(Math.round).join();
        if (key === lastKey) return;
        lastKey = key;
        const before = observers.map((o) => o.cls);
        observers.forEach((o) => o.io.disconnect());
        observers = [];
        const top = Math.max(0, Math.round(r.top - PAD));
        const left = Math.max(0, Math.round(r.left - PAD));
        const box = `-${top}px 0px 0px -${left}px`;   /* solo la esquina de las burbujas */
        const band = `-${top}px 0px 0px 0px`;         /* toda la franja de abajo, a lo ancho */
        /* desde 761 el acordeón es de columnas y el título vertical de la última ("Subilo a tu
           historia") baja hasta el borde derecho, justo donde están las burbujas */
        if (accColumns.matches) watch($('.acc__item:last-child .acc__head span'), 'is-acc', box);
        watch($('.foot'), 'is-end', box);
        /* "Pedir ahora" del pie: solo contra el rectángulo de la flecha. Al final de la página el
           relleno del pie lo deja arriba de ella y la flecha vuelve */
        watch($('.foot__end .button'), 'is-cta', around(a, 4));
        if (desktop.matches) {
          /* en escritorio la tarjeta del armador no llega a las burbujas: WhatsApp se va solo
             cuando alguno de los dos envíos por WhatsApp del armador está abajo, a la vista */
          watch($('#send-cajas, #send-sueltos, .order__direct'), 'is-send', band);
        } else {
          watch($('.order__tile'), 'is-busy', box);
        }
        /* solo se borran las clases que dejaron de mirarse; las demás las corrige su observer */
        const now = observers.map((o) => o.cls);
        before.filter((c) => !now.includes(c)).forEach((c) => fabs.classList.remove(c));
      };
      /* se mide en el próximo cuadro: recién ahí está la clase .js y la flecha ocupa su lugar */
      requestAnimationFrame(setup);
      onResize.push(setup);
    } else if (fabs) {
      /* sin IntersectionObserver la flecha queda siempre visible */
      fabs.classList.add('is-past');
    }
    const toTop = document.querySelector('.fab--top');
    if (toTop && main) toTop.addEventListener('click', (e) => {
      /* sube hasta arriba de todo sin sumar #contenido a la dirección, y deja el foco en el
         principio del contenido: el próximo Tab sigue desde el hero */
      e.preventDefault();
      main.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });

    root.classList.add('js');
  } catch (err) {
    /* algo falló: se vuelve a la versión sin JS, con todo visible */
    root.classList.remove('js');
    document.querySelectorAll('.acc__head button').forEach((b) => b.setAttribute('aria-expanded', 'true'));
    if (window.console) console.error(err);
  }
})();
