/* ============================================================
   ANIMAÇÕES — starfield, scroll-reveal, parallax, tilt,
   cursor, botões magnéticos, contadores e timeline.

   REGRA DE OURO deste arquivo:
   nenhum loop de requestAnimationFrame roda "para sempre".
   Todo loop pausa quando a aba está oculta E quando o elemento
   sai da viewport. Sem isso o preview/screenshot trava.
   ============================================================ */

const Anim = (() => {

  /* Usuário pediu menos movimento? Então quase nada aqui roda. */
  const menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const temMouse       = window.matchMedia('(pointer: fine)').matches;

  /* ---------------------------------------------------------
     1. STARFIELD — céu estrelado no hero
     --------------------------------------------------------- */
  function starfield() {
    const cv = document.getElementById('starfield');
    if (!cv || menosMovimento) return;

    const ctx = cv.getContext('2d', { alpha: true });
    let estrelas = [];
    let cadente = null;
    let raf = null;
    let visivel = true;
    let w = 0, h = 0, dpr = 1;
    let scrollY = 0;

    function dimensionar() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width  = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      semear();
    }

    function semear() {
      // menos estrelas no celular — economiza bateria e CPU
      const densidade = w < 640 ? 9000 : 5200;
      const qtd = Math.min(200, Math.max(45, Math.round((w * h) / densidade)));
      estrelas = Array.from({ length: qtd }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.25 + 0.35,
        base: Math.random() * 0.5 + 0.25,
        vel: Math.random() * 0.018 + 0.005,   // velocidade do cintilar
        fase: Math.random() * Math.PI * 2,
        prof: Math.random() * 0.55 + 0.12,    // profundidade → parallax
        cor: Math.random() > 0.86
          ? (Math.random() > 0.5 ? '232,180,196' : '185,167,218')   // rosa / lavanda
          : '244,237,228',                                          // creme
      }));
    }

    function novaCadente() {
      if (Math.random() > 0.0016 || cadente) return;
      cadente = {
        x: Math.random() * w * 0.65,
        y: Math.random() * h * 0.4,
        len: 90 + Math.random() * 80,
        vida: 1,
      };
    }

    function desenhar(t) {
      ctx.clearRect(0, 0, w, h);

      for (const e of estrelas) {
        const brilho = e.base + Math.sin(t * e.vel + e.fase) * 0.4;
        const y = e.y - scrollY * e.prof * 0.35;
        // recicla a estrela quando ela sai por cima
        const yy = ((y % h) + h) % h;
        ctx.beginPath();
        ctx.arc(e.x, yy, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${e.cor},${Math.max(0, Math.min(1, brilho))})`;
        ctx.fill();
      }

      novaCadente();
      if (cadente) {
        const c = cadente;
        const grad = ctx.createLinearGradient(c.x, c.y, c.x + c.len, c.y + c.len * 0.42);
        grad.addColorStop(0, `rgba(240,217,140,${c.vida * 0.85})`);
        grad.addColorStop(1, 'rgba(240,217,140,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x + c.len, c.y + c.len * 0.42);
        ctx.stroke();

        c.x += 7; c.y += 3; c.vida -= 0.018;
        if (c.vida <= 0) cadente = null;
      }
    }

    function loop(t) {
      desenhar(t);
      raf = requestAnimationFrame(loop);
    }

    function ligar() {
      if (raf === null && visivel && !document.hidden) raf = requestAnimationFrame(loop);
    }
    function desligar() {
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
    }

    // Pausa quando o hero sai da tela
    new IntersectionObserver(([e]) => {
      visivel = e.isIntersecting;
      visivel ? ligar() : desligar();
    }, { threshold: 0 }).observe(cv);

    // Pausa quando a aba perde o foco
    document.addEventListener('visibilitychange', () => {
      document.hidden ? desligar() : ligar();
    });

    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });
    window.addEventListener('resize', debounce(dimensionar, 200));

    dimensionar();
    ligar();
  }

  /* ---------------------------------------------------------
     2. SCROLL REVEAL — um observer para a página inteira
     --------------------------------------------------------- */
  function reveal() {
    const alvos = document.querySelectorAll('[data-reveal], [data-desenha], .svc');
    if (!alvos.length) return;

    if (menosMovimento) {
      alvos.forEach((el) => el.classList.add('visivel'));
      return;
    }

    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const atraso = el.dataset.delay;
        if (atraso) el.style.setProperty('--delay', `${atraso}ms`);
        el.classList.add('visivel');
        obs.unobserve(el); // anima uma vez só
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    alvos.forEach((el) => obs.observe(el));
  }

  /* Observa elementos criados depois (cards, FAQ, depoimentos…) */
  function observarNovos(raiz) {
    const alvos = raiz.querySelectorAll('[data-reveal], [data-desenha], .svc');
    if (menosMovimento) { alvos.forEach((el) => el.classList.add('visivel')); return; }

    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        const atraso = e.target.dataset.delay;
        if (atraso) e.target.style.setProperty('--delay', `${atraso}ms`);
        e.target.classList.add('visivel');
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    alvos.forEach((el) => obs.observe(el));
  }

  /* ---------------------------------------------------------
     3. TÍTULO DO HERO — revelação palavra a palavra
     --------------------------------------------------------- */
  function tituloHero(el, html) {
    if (!el) return;

    if (menosMovimento) { el.innerHTML = html; return; }

    // Quebra em palavras preservando as tags <em> e <br>
    const partes = html.split(/(<br\s*\/?>|<\/?em>)/gi);
    let dentroEm = false;
    let i = 0;
    let saida = '';

    partes.forEach((p) => {
      if (/^<br/i.test(p)) { saida += '<br>'; return; }
      if (/^<em>/i.test(p))  { dentroEm = true;  return; }
      if (/^<\/em>/i.test(p)) { dentroEm = false; return; }

      p.split(/\s+/).filter(Boolean).forEach((palavra) => {
        const atraso = 120 + i * 95;
        saida += dentroEm
          ? `<em class="palavra" style="animation-delay:${atraso}ms">${palavra}</em> `
          : `<span class="palavra" style="animation-delay:${atraso}ms">${palavra}</span> `;
        i++;
      });
    });

    el.innerHTML = saida;
  }

  /* ---------------------------------------------------------
     4. PARALLAX — [data-parallax="0.3"]
     --------------------------------------------------------- */
  function parallax() {
    const els = [...document.querySelectorAll('[data-parallax]')];
    if (!els.length || menosMovimento) return;

    let rodando = false;
    function aplicar() {
      const y = window.scrollY;
      els.forEach((el) => {
        const f = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = `translate3d(0, ${y * f * -1}px, 0)`;
      });
      rodando = false;
    }
    window.addEventListener('scroll', () => {
      if (!rodando) { rodando = true; requestAnimationFrame(aplicar); }
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     5. TILT 3D — cards reagem ao mouse (desktop apenas)
     --------------------------------------------------------- */
  function tilt(seletor = '[data-tilt]') {
    if (!temMouse || menosMovimento) return;

    document.querySelectorAll(seletor).forEach((el) => {
      el.classList.add('tilt');

      el.addEventListener('mousemove', (ev) => {
        const r = el.getBoundingClientRect();
        const px = (ev.clientX - r.left) / r.width  - 0.5;
        const py = (ev.clientY - r.top)  / r.height - 0.5;
        el.style.setProperty('--ry', `${px * 7}deg`);
        el.style.setProperty('--rx', `${py * -7}deg`);
        el.style.setProperty('--ty', '-6px');
      });

      el.addEventListener('mouseleave', () => {
        el.style.setProperty('--ry', '0deg');
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ty', '0px');
      });
    });
  }

  /* ---------------------------------------------------------
     6. BOTÕES MAGNÉTICOS
     --------------------------------------------------------- */
  function magneticos() {
    if (!temMouse || menosMovimento) return;

    document.querySelectorAll('[data-magnetico]').forEach((el) => {
      el.addEventListener('mousemove', (ev) => {
        const r = el.getBoundingClientRect();
        const x = (ev.clientX - r.left - r.width / 2) * 0.22;
        const y = (ev.clientY - r.top - r.height / 2) * 0.32;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------------------------------------------------------
     7. AURA DO CURSOR
     --------------------------------------------------------- */
  function cursorAura() {
    const aura = document.getElementById('cursorAura');
    if (!aura || !temMouse || menosMovimento) return;

    let ax = 0, ay = 0, mx = 0, my = 0, ativo = false, raf = null;

    function loop() {
      ax += (mx - ax) * 0.09;
      ay += (my - ay) * 0.09;
      aura.style.transform = `translate3d(${ax - 190}px, ${ay - 190}px, 0)`;
      // para o loop quando já alcançou o cursor (evita rAF eterno)
      if (Math.abs(mx - ax) < 0.4 && Math.abs(my - ay) < 0.4) { raf = null; return; }
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener('mousemove', (ev) => {
      mx = ev.clientX; my = ev.clientY;
      if (!ativo) { ativo = true; aura.style.opacity = '1'; }
      if (raf === null && !document.hidden) raf = requestAnimationFrame(loop);
    }, { passive: true });

    document.addEventListener('mouseleave', () => { aura.style.opacity = '0'; ativo = false; });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && raf !== null) { cancelAnimationFrame(raf); raf = null; }
    });
  }

  /* ---------------------------------------------------------
     8. CONTADORES — [data-contador="22"]
     --------------------------------------------------------- */
  function contadores() {
    const els = document.querySelectorAll('[data-contador]');
    if (!els.length) return;

    if (menosMovimento) {
      els.forEach((el) => { el.textContent = el.dataset.contador; });
      return;
    }

    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const alvo = parseInt(el.dataset.contador, 10) || 0;
        const dur = 1500;
        const t0 = performance.now();

        (function passo(t) {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
          el.textContent = Math.round(alvo * eased);
          if (p < 1 && !document.hidden) requestAnimationFrame(passo);
          else el.textContent = alvo;
        })(t0);

        obs.unobserve(el);
      });
    }, { threshold: 0.5 });

    els.forEach((el) => obs.observe(el));
  }

  /* ---------------------------------------------------------
     9. TIMELINE — linha dourada que preenche com o scroll
     --------------------------------------------------------- */
  function timeline() {
    const tl     = document.getElementById('timeline');
    const fill   = document.getElementById('timelineFill');
    if (!tl || !fill) return;

    const passos = [...tl.querySelectorAll('.passo')];
    if (menosMovimento) {
      fill.style.height = '100%';
      passos.forEach((p) => p.classList.add('ativo'));
      return;
    }

    let rodando = false;
    function atualizar() {
      const r = tl.getBoundingClientRect();
      const alvo = window.innerHeight * 0.55;
      const prog = Math.max(0, Math.min(1, (alvo - r.top) / r.height));
      fill.style.height = `${prog * 100}%`;

      passos.forEach((p) => {
        const pr = p.getBoundingClientRect();
        p.classList.toggle('ativo', pr.top < alvo);
      });
      rodando = false;
    }

    window.addEventListener('scroll', () => {
      if (!rodando) { rodando = true; requestAnimationFrame(atualizar); }
    }, { passive: true });
    window.addEventListener('resize', debounce(atualizar, 150));
    atualizar();
  }

  /* ---------------------------------------------------------
     10. NAVBAR + progresso + botão de topo + link ativo
     --------------------------------------------------------- */
  function navScroll() {
    const nav   = document.getElementById('nav');
    const barra = document.getElementById('progresso');
    const topo  = document.getElementById('topoBtn');
    const links = [...document.querySelectorAll('.nav-links a')];
    const secoes = links
      .map((a) => document.querySelector(a.getAttribute('href')))
      .filter(Boolean);

    let rodando = false;
    function atualizar() {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      nav?.classList.toggle('rolou', y > 30);
      topo?.classList.toggle('visivel', y > 620);
      if (barra) barra.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

      // marca o link da seção visível
      let atual = '';
      secoes.forEach((s) => {
        if (s.getBoundingClientRect().top <= window.innerHeight * 0.35) atual = s.id;
      });
      links.forEach((a) => a.classList.toggle('ativo', a.getAttribute('href') === `#${atual}`));

      rodando = false;
    }

    window.addEventListener('scroll', () => {
      if (!rodando) { rodando = true; requestAnimationFrame(atualizar); }
    }, { passive: true });

    topo?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: menosMovimento ? 'auto' : 'smooth' });
    });

    atualizar();
  }

  /* ---------------------------------------------------------
     11. PARTÍCULAS — explosão ao revelar a carta
     --------------------------------------------------------- */
  function particulas(container, qtd = 22) {
    if (!container || menosMovimento) return;
    container.innerHTML = '';

    for (let i = 0; i < qtd; i++) {
      const p = document.createElement('span');
      p.className = 'particula';
      const ang = (Math.PI * 2 * i) / qtd + Math.random() * 0.5;
      const dist = 90 + Math.random() * 120;
      p.style.setProperty('--px', `${Math.cos(ang) * dist}px`);
      p.style.setProperty('--py', `${Math.sin(ang) * dist}px`);
      p.style.animationDelay = `${Math.random() * 0.18}s`;
      if (i % 4 === 0) p.style.background = 'var(--rosa)';
      if (i % 5 === 0) p.style.background = 'var(--lavanda)';
      container.appendChild(p);
    }
    setTimeout(() => { container.innerHTML = ''; }, 1600);
  }

  /* ---------------------------------------------------------
     Utilitário
     --------------------------------------------------------- */
  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  /* ---------------------------------------------------------
     API pública
     --------------------------------------------------------- */
  return {
    menosMovimento,
    temMouse,
    starfield,
    reveal,
    observarNovos,
    tituloHero,
    parallax,
    tilt,
    magneticos,
    cursorAura,
    contadores,
    timeline,
    navScroll,
    particulas,
    debounce,
  };
})();
