/* ============================================================
   APP — monta a página a partir do CONFIG e liga as interações.
   Fonte única da verdade do conteúdo: js/config.js
   ============================================================ */

(() => {
  'use strict';

  /* ---------- atalhos ---------- */
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const setTexto = (sel, txt) => $$(sel).forEach((el) => { el.textContent = txt; });

  const ICO = (id, cls = '') =>
    `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#${id}"/></svg>`;


  /* ============================================================
     MARCA
     ============================================================ */
  function renderMarca() {
    const m = CONFIG.marca;
    setTexto('[data-marca-nome]', m.nome);
    setTexto('[data-marca-titulo]', m.titulo);
    setTexto('[data-marca-tagline]', m.tagline);
    document.title = `${m.nome} | ${m.titulo} — Leituras de Tarô Online`;
    const ano = $('#ano');
    if (ano) ano.textContent = new Date().getFullYear();
  }


  /* ============================================================
     NAVEGAÇÃO (desktop + menu mobile)
     ============================================================ */
  function renderNav() {
    const links = CONFIG.nav.map((l) => `<a href="${l.href}">${l.label}</a>`).join('');

    const navLinks = $('#navLinks');
    if (navLinks) navLinks.innerHTML = links;

    const menu = $('#menuMob');
    if (menu) {
      menu.innerHTML =
        CONFIG.nav.map((l, i) =>
          `<a href="${l.href}" style="animation-delay:${80 + i * 65}ms">${l.label}</a>`
        ).join('') +
        `<a class="btn btn--ouro" href="#agendamento">Agendar Consulta</a>`;
    }

    // Abrir/fechar
    const burger = $('#burger');
    const fechar = () => {
      menu?.classList.remove('aberto');
      burger?.setAttribute('aria-expanded', 'false');
      burger?.setAttribute('aria-label', 'Abrir menu');
      document.body.style.overflow = '';
    };

    burger?.addEventListener('click', () => {
      const aberto = menu.classList.toggle('aberto');
      burger.setAttribute('aria-expanded', String(aberto));
      burger.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      document.body.style.overflow = aberto ? 'hidden' : '';
    });

    menu?.addEventListener('click', (e) => { if (e.target.closest('a')) fechar(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar(); });
    // fecha ao passar para desktop
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => { if (e.matches) fechar(); });
  }


  /* ============================================================
     HERO
     ============================================================ */
  function renderHero() {
    const h = CONFIG.hero;
    setTexto('[data-hero-eyebrow]', h.eyebrow);
    setTexto('[data-hero-sub]', h.subtitulo);
    setTexto('[data-hero-cta1]', h.ctaPrimario);
    setTexto('[data-hero-cta2]', h.ctaSecundario);

    Anim.tituloHero($('#heroTitulo'), h.titulo);

    // Leque de 3 versos de carta
    const leque = $('#leque');
    if (leque) {
      leque.innerHTML = Array.from({ length: 3 },
        (_, i) => `<div class="leque-carta${i === 1 ? ' anim-flutua' : ''}">${VERSO_SVG}</div>`
      ).join('');
    }
  }


  /* ============================================================
     SOBRE
     ============================================================ */
  function renderSobre() {
    const s = CONFIG.sobre;
    setTexto('[data-sobre-eyebrow]', s.eyebrow);
    setTexto('[data-sobre-titulo]', s.titulo);
    setTexto('[data-sobre-assinatura]', `— ${CONFIG.marca.nome}`);

    const txt = $('#sobreTexto');
    if (txt) txt.innerHTML = s.paragrafos.map((p) => `<p>${p}</p>`).join('');

    // Foto real, ou placeholder elegante
    const foto = $('#retratoFoto');
    if (foto) {
      foto.innerHTML = s.foto
        ? `<img src="${s.foto}" alt="${s.fotoAlt}" loading="lazy">`
        : `<div class="retrato-vazio">
             ${ICO('ico-camera')}
             <span>Espaço para a foto</span>
             <span style="font-size:.6rem;opacity:.7;letter-spacing:.06em;text-transform:none">
               defina <code>sobre.foto</code> em js/config.js
             </span>
           </div>`;
    }

    const pilares = $('#pilares');
    if (pilares) {
      pilares.innerHTML = s.pilares.map((p, i) => `
        <article class="pilar" data-reveal="zoom" data-delay="${i * 90}">
          ${ICO('ico-' + p.icone, 'pilar-ico')}
          <h4>${p.titulo}</h4>
          <p>${p.texto}</p>
        </article>`).join('');
      Anim.observarNovos(pilares);
    }
  }


  /* ============================================================
     JORNADA
     ============================================================ */
  function renderJornada() {
    const j = CONFIG.jornada;
    setTexto('[data-jornada-eyebrow]', j.eyebrow);
    setTexto('[data-jornada-titulo]', j.titulo);
    setTexto('[data-jornada-sub]', j.subtitulo);

    const tl = $('#timeline');
    if (!tl) return;

    // preserva a barra de preenchimento e injeta os passos depois dela
    tl.insertAdjacentHTML('beforeend', j.passos.map((p, i) => `
      <article class="passo" data-reveal="esquerda" data-delay="${i * 110}">
        <span class="passo-num">${p.n}</span>
        <div>
          <h3>${p.titulo}</h3>
          <p>${p.texto}</p>
        </div>
      </article>`).join(''));

    Anim.observarNovos(tl);
    Anim.timeline();
  }


  /* ============================================================
     SERVIÇOS E PREÇOS
     ============================================================ */
  const ICONE_SVC = {
    simples:   'ico-carta-simples',
    completas: 'ico-carta-completa',
    hora:      'ico-relogio',
  };
  const COR_SVC = {
    rosa:    'var(--rosa)',
    ouro:    'var(--ouro)',
    lavanda: 'var(--lavanda)',
    salvia:  'var(--salvia)',
  };

  function renderServicos() {
    const s = CONFIG.servicos;
    setTexto('[data-servicos-eyebrow]', s.eyebrow);
    setTexto('[data-servicos-titulo]', s.titulo);
    setTexto('[data-servicos-sub]', s.subtitulo);

    const grid = $('#servicosGrid');
    if (!grid) return;

    grid.innerHTML = s.itens.map((it, i) => {
      const acento = COR_SVC[it.acento] || 'var(--ouro)';

      const linhas = it.linhas.map((l) => {
        const msg = `Olá, ${CONFIG.marca.nome}! Vim pelo site. Gostaria de agendar uma leitura *${it.nome}* — ${l.label.toLowerCase()} (${l.valor}). Podemos conversar?`;
        return `
          <div class="svc-linha">
            <span class="lbl">${l.label}</span>
            <span class="val">${l.valor}</span>
            <a class="zap-mini" href="${linkWhats(msg)}" target="_blank" rel="noopener"
               aria-label="Pedir ${it.nome} — ${l.label} por ${l.valor} no WhatsApp">
              ${ICO('ico-zap')}
            </a>
          </div>`;
      }).join('');

      const msgCard = `Olá, ${CONFIG.marca.nome}! Vim pelo site e gostaria de agendar uma leitura *${it.nome}*. Pode me passar os detalhes?`;

      return `
        <article class="svc ${it.destaque ? 'svc--destaque' : ''}"
                 style="--acento:${acento}"
                 data-tilt data-reveal data-delay="${i * 130}">
          ${it.selo ? `<span class="svc-selo">${it.selo}</span>` : ''}
          ${ICO(ICONE_SVC[it.id] || 'ico-carta-simples', 'svc-ico')}
          <h3>${it.nome}</h3>
          <p class="svc-dur">${it.duracao}</p>
          <p class="svc-desc">${it.descricao}</p>

          <div class="svc-tabela">${linhas}</div>

          ${it.obs ? `<p class="svc-obs">${ICO('ico-info')} ${it.obs}</p>` : ''}

          <div class="svc-rodape">
            <a class="btn ${it.destaque ? 'btn--ouro' : 'btn--linha'} btn--bloco"
               href="${linkWhats(msgCard)}" target="_blank" rel="noopener">
              ${ICO('ico-zap')} Agendar ${it.nome}
            </a>
          </div>
        </article>`;
    }).join('');

    Anim.observarNovos(grid);
    Anim.tilt('#servicosGrid [data-tilt]');
  }


  /* ============================================================
     DEPOIMENTOS (carrossel)
     ============================================================ */
  function renderDepoimentos() {
    const d = CONFIG.depoimentos;
    const secao = $('#depoimentos');
    if (!secao) return;

    // Sem depoimentos → a seção some do site e do menu
    if (!d.lista || d.lista.length === 0) {
      secao.remove();
      $$('a[href="#depoimentos"]').forEach((a) => a.remove());
      return;
    }
    secao.hidden = false;

    setTexto('[data-depo-eyebrow]', d.eyebrow);
    setTexto('[data-depo-titulo]', d.titulo);

    // Aviso enquanto forem exemplos fictícios
    const aviso = $('#avisoExemplo');
    if (aviso) aviso.hidden = !d.exemplo;

    const trilho = $('#carrosselTrilho');
    const dots   = $('#depoDots');
    if (!trilho) return;

    trilho.innerHTML = d.lista.map((dep, i) => `
      <div class="depo" role="group" aria-roledescription="depoimento"
           aria-label="${i + 1} de ${d.lista.length}">
        <figure class="depo-card">
          <span class="depo-aspas" aria-hidden="true">&ldquo;</span>
          <blockquote class="depo-texto">${dep.texto}</blockquote>
          <figcaption class="depo-rodape">
            <span class="depo-inicial" aria-hidden="true">${dep.autor.charAt(0)}</span>
            <div>
              <div class="depo-autor">${dep.autor}</div>
              <div class="depo-ctx">${dep.contexto}</div>
            </div>
          </figcaption>
        </figure>
      </div>`).join('');

    if (dots) {
      dots.innerHTML = d.lista.map((_, i) =>
        `<button class="dot${i === 0 ? ' ativo' : ''}" role="tab"
                 aria-label="Depoimento ${i + 1}" aria-selected="${i === 0}"></button>`
      ).join('');
    }

    /* --- controle do carrossel --- */
    let idx = 0;
    let timer = null;
    const total = d.lista.length;

    function ir(n) {
      idx = (n + total) % total;
      trilho.style.transform = `translateX(-${idx * 100}%)`;
      $$('.dot', dots).forEach((b, i) => {
        b.classList.toggle('ativo', i === idx);
        b.setAttribute('aria-selected', String(i === idx));
      });
    }

    function auto() {
      parar();
      if (Anim.menosMovimento || total < 2) return;
      timer = setInterval(() => ir(idx + 1), 6500);
    }
    function parar() { if (timer) { clearInterval(timer); timer = null; } }

    $('#depoProx')?.addEventListener('click', () => { ir(idx + 1); auto(); });
    $('#depoAnt') ?.addEventListener('click', () => { ir(idx - 1); auto(); });
    $$('.dot', dots).forEach((b, i) => b.addEventListener('click', () => { ir(i); auto(); }));

    const car = $('#carrossel');
    car?.addEventListener('mouseenter', parar);
    car?.addEventListener('mouseleave', auto);

    // pausa quando a aba está oculta ou a seção sai da tela
    document.addEventListener('visibilitychange', () => (document.hidden ? parar() : auto()));
    new IntersectionObserver(([e]) => (e.isIntersecting ? auto() : parar()),
      { threshold: 0.2 }).observe(secao);

    // swipe no touch
    let x0 = null;
    car?.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; parar(); }, { passive: true });
    car?.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) ir(idx + (dx < 0 ? 1 : -1));
      x0 = null;
      auto();
    }, { passive: true });

    Anim.observarNovos(secao);
  }


  /* ============================================================
     AGENDAMENTO
     ============================================================ */
  function renderAgendamento() {
    const a = CONFIG.agendamento;
    setTexto('[data-agenda-eyebrow]', a.eyebrow);
    setTexto('[data-agenda-titulo]', a.titulo);
    setTexto('[data-agenda-sub]', a.subtitulo);

    const opt = (v, sel = false) => `<option value="${v}"${sel ? ' selected' : ''}>${v}</option>`;

    // Formato = os serviços reais
    const fFormato = $('#fFormato');
    if (fFormato) {
      fFormato.innerHTML =
        `<option value="" disabled selected>Escolha um formato…</option>` +
        CONFIG.servicos.itens.map((it) => `<option value="${it.nome}">${it.nome}</option>`).join('') +
        `<option value="Ainda não sei">Ainda não sei — me ajuda a escolher</option>`;
    }

    $('#fTema')    && ($('#fTema').innerHTML    = a.temas.map((t, i) => opt(t, i === 0)).join(''));
    $('#fHorario') && ($('#fHorario').innerHTML = a.horarios.map((h) => opt(h, h === 'Tanto faz')).join(''));

    // "Por Hora" não tem limite de perguntas → esconde o campo
    const campoQtd = $('#campoQtd');
    fFormato?.addEventListener('change', () => {
      const porHora = /hora/i.test(fFormato.value);
      if (campoQtd) campoQtd.style.display = porHora ? 'none' : '';
    });

    // Envio → monta a mensagem e abre o WhatsApp
    $('#formAgenda')?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validar()) return;

      const nome    = $('#fNome').value.trim();
      const formato = $('#fFormato').value;
      const porHora = /hora/i.test(formato);
      const qtd     = $('#fQtd').value;
      const tema    = $('#fTema').value;
      const horario = $('#fHorario').value;
      const extra   = $('#fMsg').value.trim();

      const linhas = [
        `Olá, ${CONFIG.marca.nome}! Vim pelo site e gostaria de agendar uma leitura. ✨`,
        '',
        `*Nome:* ${nome}`,
        `*Formato:* ${formato}`,
      ];
      if (!porHora) linhas.push(`*Perguntas:* ${qtd}`);
      linhas.push(`*Tema:* ${tema}`, `*Melhor horário:* ${horario}`);
      if (extra) linhas.push('', `*Contexto:* ${extra}`);

      window.open(linkWhats(linhas.join('\n')), '_blank', 'noopener');
    });
  }

  function validar() {
    let ok = true;

    const checar = (id, msg) => {
      const campo = $(id);
      const erro  = $(`[data-erro="${id.slice(1)}"]`);
      const vazio = !campo.value.trim();
      campo.classList.toggle('invalido', vazio);
      if (erro) erro.textContent = vazio ? msg : '';
      if (vazio && ok) { campo.focus(); ok = false; }
      return !vazio;
    };

    checar('#fNome', 'Preciso saber como te chamar.');
    checar('#fFormato', 'Escolha um formato de leitura.');
    return ok;
  }


  /* ============================================================
     FAQ (accordion)
     ============================================================ */
  function renderFaq() {
    const f = CONFIG.faq;
    setTexto('[data-faq-eyebrow]', f.eyebrow);
    setTexto('[data-faq-titulo]', f.titulo);

    const lista = $('#faqLista');
    if (!lista) return;

    lista.innerHTML = f.itens.map((it, i) => `
      <div class="faq-item" data-reveal data-delay="${i * 60}">
        <button class="faq-p" aria-expanded="false" aria-controls="faq-r-${i}" id="faq-p-${i}">
          <span>${it.p}</span>
          <span class="faq-mais" aria-hidden="true"></span>
        </button>
        <div class="faq-r" id="faq-r-${i}" role="region" aria-labelledby="faq-p-${i}">
          <p>${it.r}</p>
        </div>
      </div>`).join('');

    lista.addEventListener('click', (e) => {
      const btn = e.target.closest('.faq-p');
      if (!btn) return;

      const item = btn.parentElement;
      const resp = item.querySelector('.faq-r');
      const abrir = !item.classList.contains('aberto');

      // fecha os outros (comportamento de acordeão)
      $$('.faq-item.aberto', lista).forEach((o) => {
        o.classList.remove('aberto');
        o.querySelector('.faq-r').style.maxHeight = '';
        o.querySelector('.faq-p').setAttribute('aria-expanded', 'false');
      });

      if (abrir) {
        item.classList.add('aberto');
        resp.style.maxHeight = `${resp.scrollHeight}px`;
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    Anim.observarNovos(lista);
  }


  /* ============================================================
     RODAPÉ
     ============================================================ */
  function renderRodape() {
    const r = CONFIG.rodape;
    setTexto('[data-rodape-frase]', r.frase);
    setTexto('[data-rodape-aviso]', r.avisoLegal);

    const links = $('#rodapeLinks');
    if (links) links.innerHTML = r.links.map((l) => `<a href="${l.href}">${l.label}</a>`).join('');

    const soc = $('#sociais');
    if (soc) {
      soc.innerHTML = `
        <a class="social" href="${linkWhats(CONFIG.whatsapp.msgPadrao)}" target="_blank" rel="noopener">
          ${ICO('ico-zap')} ${CONFIG.whatsapp.exibicao}
        </a>
        <a class="social" href="${CONFIG.marca.instagramUrl}" target="_blank" rel="noopener">
          ${ICO('ico-insta')} @${CONFIG.marca.instagram}
        </a>`;
    }
  }


  /* ============================================================
     LINKS DE WHATSAPP DECLARATIVOS — [data-zap="chave"]
     ============================================================ */
  function ligarZap() {
    const msgs = {
      padrao: CONFIG.whatsapp.msgPadrao,
      hero:   CONFIG.whatsapp.msgHero,
      carta:  CONFIG.whatsapp.msgCartaDoDia,
    };
    $$('[data-zap]').forEach((el) => {
      const msg = msgs[el.dataset.zap] || CONFIG.whatsapp.msgPadrao;
      // o CTA do topo aponta para o formulário; os demais vão direto pro chat
      if (el.getAttribute('href') === '#agendamento') return;
      el.setAttribute('href', linkWhats(msg));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });
  }


  /* ============================================================
     CARTA DO DIA
     ============================================================ */
  const CHAVE = 'taro.debs.cartaDoDia';

  const hojeISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  function lerSalvo() {
    try {
      const bruto = localStorage.getItem(CHAVE);
      if (!bruto) return null;
      const dado = JSON.parse(bruto);
      return dado && dado.data === hojeISO() ? dado : null;
    } catch { return null; }
  }

  function salvar(n) {
    try { localStorage.setItem(CHAVE, JSON.stringify({ data: hojeISO(), n })); }
    catch { /* modo privado / storage bloqueado — segue sem persistir */ }
  }

  function cartaDoDia() {
    const carta = $('#carta');
    if (!carta) return;

    $('#cartaVerso').innerHTML = VERSO_SVG;

    const frente  = $('#cartaFrente');
    const rotulo  = $('#cartaRotulo');
    const titulo  = $('#cartaTitulo');
    const msg     = $('#cartaMsg');
    const rodape  = $('#cartaRodape');
    const acoes   = $('#cartaAcoes');
    let revelada  = false;

    function preencher(arc) {
      // a frente inteira é a carta ilustrada (moldura + miolo perolado + arte)
      frente.innerHTML = cartaSVG(arc);
    }

    function revelar(arc, comAnimacao = true) {
      preencher(arc);
      revelada = true;

      const mostrarTexto = () => {
        rotulo.textContent = `Arcano ${arc.romano} · A carta de hoje`;
        titulo.textContent = arc.nome;
        msg.textContent    = arc.mensagem;
        const chaves = $('#cartaChaves');
        if (chaves) chaves.innerHTML = arc.palavras.map((p) => `<span>${p}</span>`).join('');
        rodape.hidden = false;
        acoes.hidden  = false;
        carta.classList.add('revelada');
        carta.setAttribute('aria-pressed', 'true');
        carta.setAttribute('aria-label', `Carta do dia: ${arc.nome}`);
      };

      if (!comAnimacao || Anim.menosMovimento) {
        carta.classList.add('virada');
        mostrarTexto();
        return;
      }

      carta.classList.add('embaralhando');
      setTimeout(() => {
        carta.classList.remove('embaralhando');
        carta.classList.add('virada');
        Anim.particulas($('#particulas'));
        setTimeout(mostrarTexto, 420);
      }, 760);
    }

    function tirar() {
      if (revelada) return;
      const salvo = lerSalvo();
      const arc = salvo
        ? ARCANOS.find((a) => a.n === salvo.n) || ARCANOS[0]
        : ARCANOS[Math.floor(Math.random() * ARCANOS.length)];
      if (!salvo) salvar(arc.n);
      revelar(arc, true);
    }

    // Já tirou hoje? Mostra a mesma carta, sem animação de embaralhar.
    const salvo = lerSalvo();
    if (salvo) {
      const arc = ARCANOS.find((a) => a.n === salvo.n);
      if (arc) revelar(arc, false);
    }

    carta.addEventListener('click', tirar);
    carta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tirar(); }
    });
  }


  /* ============================================================
     BOOT
     ============================================================ */
  function init() {
    // Conteúdo
    renderMarca();
    renderNav();
    renderHero();
    renderSobre();
    renderJornada();
    renderServicos();
    renderDepoimentos();
    renderAgendamento();
    renderFaq();
    renderRodape();
    ligarZap();
    cartaDoDia();

    // Animações
    Anim.starfield();
    Anim.reveal();
    Anim.parallax();
    Anim.magneticos();
    Anim.cursorAura();
    Anim.contadores();
    Anim.navScroll();

    document.body.classList.add('pronto');
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
