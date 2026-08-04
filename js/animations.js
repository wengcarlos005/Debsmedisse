/* ============================================================
   ANIMAÇÕES

   REGRA: nenhum loop de requestAnimationFrame roda "para sempre".
   Tudo pausa quando a aba está oculta. Sem isso o preview trava.
   ============================================================ */

const Anim = (() => {

  const menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const temMouse       = window.matchMedia('(pointer: fine)').matches;

  /* ---------------------------------------------------------
     STARFIELD — céu de fundo, discreto
     --------------------------------------------------------- */
  function starfield() {
    const cv = document.getElementById('starfield');
    if (!cv || menosMovimento) return;

    const ctx = cv.getContext('2d', { alpha: true });
    let estrelas = [], raf = null, w = 0, h = 0;

    function dimensionar() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      cv.width  = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const densidade = w < 640 ? 11000 : 7000;
      const qtd = Math.min(150, Math.max(35, Math.round((w * h) / densidade)));
      estrelas = Array.from({ length: qtd }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + .3,
        base: Math.random() * .4 + .18,
        vel: Math.random() * .015 + .004,
        fase: Math.random() * Math.PI * 2,
        cor: Math.random() > .88
          ? (Math.random() > .5 ? '232,180,196' : '185,167,218')
          : '244,237,228',
      }));
    }

    function loop(t) {
      ctx.clearRect(0, 0, w, h);
      for (const e of estrelas) {
        const b = e.base + Math.sin(t * e.vel + e.fase) * .32;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${e.cor},${Math.max(0, Math.min(1, b))})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    }

    const ligar    = () => { if (raf === null && !document.hidden) raf = requestAnimationFrame(loop); };
    const desligar = () => { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } };

    document.addEventListener('visibilitychange', () => (document.hidden ? desligar() : ligar()));
    window.addEventListener('resize', debounce(dimensionar, 200));

    dimensionar();
    ligar();
  }

  /* ---------------------------------------------------------
     SCROLL REVEAL
     --------------------------------------------------------- */
  let obs = null;

  function criarObserver() {
    return new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        const atraso = e.target.dataset.delay;
        if (atraso) e.target.style.setProperty('--delay', `${atraso}ms`);
        e.target.classList.add('visivel');
        obs.unobserve(e.target);
      });
    }, { threshold: .1, rootMargin: '0px 0px -6% 0px' });
  }

  function reveal() {
    if (menosMovimento) {
      document.querySelectorAll('[data-reveal], [data-desenha]')
        .forEach((el) => el.classList.add('visivel'));
      return;
    }
    obs = criarObserver();
    document.querySelectorAll('[data-reveal], [data-desenha]').forEach((el) => obs.observe(el));
  }

  /* Reanima os elementos de uma tela toda vez que ela entra em cena. */
  function reobservar(raiz) {
    const alvos = raiz.querySelectorAll('[data-reveal], [data-desenha]');
    if (menosMovimento) { alvos.forEach((el) => el.classList.add('visivel')); return; }
    if (!obs) obs = criarObserver();
    alvos.forEach((el) => {
      el.classList.remove('visivel');
      obs.observe(el);
    });
  }

  /* ---------------------------------------------------------
     TÍTULO DO HERO — palavra a palavra
     --------------------------------------------------------- */
  function tituloHero(el, html) {
    if (!el) return;
    if (menosMovimento) { el.innerHTML = html; return; }

    const partes = html.split(/(<br\s*\/?>|<\/?em>)/gi);
    let dentroEm = false, i = 0, saida = '';

    partes.forEach((p) => {
      if (/^<br/i.test(p))    { saida += '<br>'; return; }
      if (/^<em>/i.test(p))   { dentroEm = true;  return; }
      if (/^<\/em>/i.test(p)) { dentroEm = false; return; }

      p.split(/\s+/).filter(Boolean).forEach((palavra) => {
        const atraso = 140 + i * 90;
        const tag = dentroEm ? 'em' : 'span';
        saida += `<${tag} class="palavra" style="animation-delay:${atraso}ms">${palavra}</${tag}> `;
        i++;
      });
    });
    el.innerHTML = saida;
  }

  /* ---------------------------------------------------------
     BOTÕES MAGNÉTICOS
     --------------------------------------------------------- */
  function magneticos() {
    if (!temMouse || menosMovimento) return;
    document.querySelectorAll('[data-magnetico]').forEach((el) => {
      el.addEventListener('mousemove', (ev) => {
        const r = el.getBoundingClientRect();
        const x = (ev.clientX - r.left - r.width / 2) * .18;
        const y = (ev.clientY - r.top - r.height / 2) * .26;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------
     PARTÍCULAS ao revelar a carta
     --------------------------------------------------------- */
  function particulas(container, qtd = 20) {
    if (!container || menosMovimento) return;
    container.innerHTML = '';
    for (let i = 0; i < qtd; i++) {
      const p = document.createElement('span');
      p.className = 'particula';
      const ang = (Math.PI * 2 * i) / qtd + Math.random() * .5;
      const dist = 80 + Math.random() * 110;
      p.style.setProperty('--px', `${Math.cos(ang) * dist}px`);
      p.style.setProperty('--py', `${Math.sin(ang) * dist}px`);
      p.style.animationDelay = `${Math.random() * .18}s`;
      if (i % 4 === 0) p.style.background = 'var(--rosa)';
      if (i % 5 === 0) p.style.background = 'var(--lavanda)';
      container.appendChild(p);
    }
    setTimeout(() => { container.innerHTML = ''; }, 1600);
  }

  /* ---------------------------------------------------------
     Util
     --------------------------------------------------------- */
  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  return {
    menosMovimento, temMouse,
    starfield, reveal, reobservar, tituloHero,
    magneticos, particulas, debounce,
  };
})();
