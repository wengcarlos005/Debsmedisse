/* ============================================================
   APP — router de telas + montagem do conteúdo a partir do CONFIG
   ============================================================ */

(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const setTexto = (sel, txt) => $$(sel).forEach((el) => { el.textContent = txt; });
  const ICO = (id, cls = '') =>
    `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><use href="#${id}"/></svg>`;


  /* ============================================================
     ROUTER — cada tela é uma "janela"
     ============================================================ */
  const Router = (() => {
    const IDS = CONFIG.telas.map((t) => t.id);
    let atual = null;

    function alvo() {
      const id = (location.hash.replace(/^#\/?/, '') || 'inicio').split('?')[0];
      return IDS.includes(id) ? id : 'inicio';
    }

    function marcarAbas(id) {
      $$('.abas a, .abas-mob a').forEach((a) => {
        const ativo = a.dataset.tela === id;
        a.classList.toggle('ativa', ativo);
        a.setAttribute('aria-current', ativo ? 'page' : 'false');
      });
      posicionarMarca();
    }

    // pílula deslizante das abas do desktop
    function posicionarMarca() {
      const marca = $('#abasMarca');
      const ativa = $('.abas a.ativa');
      if (!marca || !ativa) return;
      marca.style.width = `${ativa.offsetWidth}px`;
      marca.style.transform = `translateX(${ativa.offsetLeft}px)`;
    }

    function ir(id, primeira = false) {
      if (id === atual) return;

      const nova = $(`.tela[data-tela="${id}"]`);
      if (!nova) return;

      const velha = atual ? $(`.tela[data-tela="${atual}"]`) : null;

      const mostrar = () => {
        $$('.tela').forEach((t) => t.classList.remove('ativa', 'entrando', 'saindo'));
        nova.classList.add('ativa');
        if (!Anim.menosMovimento) {
          nova.classList.add('entrando');
          setTimeout(() => nova.classList.remove('entrando'), 700);
        }
        atual = id;
        marcarAbas(id);
        Anim.reobservar(nova);
        if (!primeira) window.scrollTo({ top: 0, behavior: 'auto' });
        // foco no título da tela (acessibilidade)
        if (!primeira) nova.querySelector('h1, h2')?.setAttribute('tabindex', '-1');
      };

      if (velha && !Anim.menosMovimento) {
        velha.classList.add('saindo');
        setTimeout(mostrar, 220);
      } else {
        mostrar();
      }
    }

    function iniciar() {
      window.addEventListener('hashchange', () => ir(alvo()));
      window.addEventListener('resize', Anim.debounce(posicionarMarca, 120));
      ir(alvo(), true);
    }

    return { iniciar, ir, alvo, posicionarMarca };
  })();


  /* ============================================================
     ABAS
     ============================================================ */
  function renderAbas() {
    const linksDesk = CONFIG.telas
      .map((t) => `<a href="#/${t.id}" data-tela="${t.id}">${t.label}</a>`).join('');

    const abas = $('#abas');
    if (abas) abas.insertAdjacentHTML('afterbegin', linksDesk);

    const mob = $('#abasMob');
    if (mob) {
      mob.innerHTML = CONFIG.telas.map((t) => `
        <a href="#/${t.id}" data-tela="${t.id}">
          ${ICO(t.icone)}
          <span>${t.label}</span>
        </a>`).join('');
    }
  }


  /* ============================================================
     MARCA E RODAPÉ
     ============================================================ */
  function renderMarca() {
    const m = CONFIG.marca;
    setTexto('[data-marca-nome]', m.nome);
    setTexto('[data-marca-titulo]', m.titulo);
    document.title = `${m.nome} | ${m.titulo} — Leituras de Tarô Online`;
    const ano = $('#ano');
    if (ano) ano.textContent = new Date().getFullYear();
  }

  function renderRodape() {
    setTexto('[data-rodape-frase]', CONFIG.rodape.frase);
    setTexto('[data-rodape-aviso]', CONFIG.rodape.avisoLegal);

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
     TELA: INÍCIO
     ============================================================ */
  function renderInicio() {
    const h = CONFIG.hero;
    setTexto('[data-hero-eyebrow]', h.eyebrow);
    setTexto('[data-hero-sub]', h.subtitulo);
    setTexto('[data-hero-cta1]', h.ctaPrimario);
    setTexto('[data-hero-cta2]', h.ctaSecundario);

    Anim.tituloHero($('#t-inicio'), h.titulo);

    const marcas = $('#heroMarcas');
    if (marcas) {
      marcas.innerHTML = h.marcas.map((m) => `
        <li><div class="num">${m.num}</div><div class="lbl">${m.lbl}</div></li>`).join('');
    }

    const leque = $('#leque');
    if (leque) {
      leque.innerHTML = Array.from({ length: 3 },
        (_, i) => `<div class="leque-carta${i === 1 ? ' anim-flutua' : ''}">${VERSO_SVG}</div>`).join('');
    }
  }


  /* ============================================================
     TELA: SOBRE
     ============================================================ */
  function renderSobre() {
    const s = CONFIG.sobre;
    setTexto('[data-sobre-eyebrow]', s.eyebrow);
    setTexto('[data-sobre-titulo]', s.titulo);
    setTexto('[data-sobre-assinatura]', `— ${CONFIG.marca.nome}`);

    const txt = $('#sobreTexto');
    if (txt) txt.innerHTML = s.paragrafos.map((p) => `<p>${p}</p>`).join('');

    const foto = $('#retratoFoto');
    if (foto) {
      foto.innerHTML = s.foto
        ? `<img src="${s.foto}" alt="${s.fotoAlt}" loading="lazy">`
        : `<div class="retrato-vazio">${ICO('ico-camera')}
             <span>Espaço para a foto</span>
             <span style="font-size:.56rem;opacity:.7;text-transform:none;letter-spacing:0">
               defina <code>sobre.foto</code> em js/config.js</span>
           </div>`;
    }

    const pil = $('#pilares');
    if (pil) {
      pil.innerHTML = s.pilares.map((p, i) => `
        <li class="pilar" data-reveal="zoom" data-delay="${i * 80}">
          ${ICO('ico-' + p.icone)}
          <h4>${p.titulo}</h4>
          <p>${p.texto}</p>
        </li>`).join('');
    }
  }


  /* ============================================================
     TELA: LEITURAS
     ============================================================ */
  const ICONE_SVC = { simples: 'ico-carta-simples', completas: 'ico-carta-completa', hora: 'ico-relogio' };
  const COR_SVC   = { rosa: 'var(--rosa)', ouro: 'var(--ouro)', lavanda: 'var(--lavanda)', salvia: 'var(--salvia)' };

  function renderLeituras() {
    const s = CONFIG.servicos;
    setTexto('[data-servicos-eyebrow]', s.eyebrow);
    setTexto('[data-servicos-titulo]', s.titulo);
    setTexto('[data-servicos-sub]', s.subtitulo);
    setTexto('[data-jornada-titulo]', CONFIG.jornada.titulo);

    const grid = $('#servicosGrid');
    if (grid) {
      grid.innerHTML = s.itens.map((it, i) => {
        const linhas = it.linhas.map((l) => {
          const msg = `Olá, ${CONFIG.marca.nome}! Vim pelo site. Gostaria de uma leitura *${it.nome}* — ${l.label.toLowerCase()} (${l.valor}). Podemos conversar?`;
          return `<div class="svc-linha">
              <span class="lbl">${l.label}</span>
              <span class="val">${l.valor}</span>
              <a class="zap-mini" href="${linkWhats(msg)}" target="_blank" rel="noopener"
                 aria-label="Pedir ${it.nome}, ${l.label}, ${l.valor}">${ICO('ico-zap')}</a>
            </div>`;
        }).join('');

        const msgCard = `Olá, ${CONFIG.marca.nome}! Vim pelo site e gostaria de agendar uma leitura *${it.nome}*.`;

        return `<article class="svc ${it.destaque ? 'svc--destaque' : ''}"
                     style="--acento:${COR_SVC[it.acento] || 'var(--ouro)'}"
                     data-reveal data-delay="${i * 110}">
            ${it.selo ? `<span class="svc-selo">${it.selo}</span>` : ''}
            <div class="svc-topo">
              ${ICO(ICONE_SVC[it.id] || 'ico-carta-simples')}
              <div><h3>${it.nome}</h3><p class="svc-dur">${it.duracao}</p></div>
            </div>
            <p class="svc-desc">${it.descricao}</p>
            <div class="svc-tabela">${linhas}</div>
            ${it.obs ? `<p class="svc-obs">${ICO('ico-info')} ${it.obs}</p>` : ''}
            <a class="btn ${it.destaque ? 'btn--ouro' : 'btn--linha'} btn--bloco"
               href="${linkWhats(msgCard)}" target="_blank" rel="noopener">Agendar</a>
          </article>`;
      }).join('');
    }

    const passos = $('#passos');
    if (passos) {
      passos.innerHTML = CONFIG.jornada.passos.map((p, i) => `
        <li class="passo" data-reveal data-delay="${i * 90}">
          <span class="passo-num">${p.n}</span>
          <div><h4>${p.titulo}</h4><p>${p.texto}</p></div>
        </li>`).join('');
    }

    renderDepoimentos();
  }


  /* ---------- depoimentos (carrossel) ---------- */
  function renderDepoimentos() {
    const d = CONFIG.depoimentos;
    const bloco = $('#depoBloco');
    if (!bloco) return;

    if (!d.lista || d.lista.length === 0) { bloco.remove(); return; }
    bloco.hidden = false;

    const aviso = $('#avisoExemplo');
    if (aviso) aviso.hidden = !d.exemplo;
    if (d.exemplo) {
      console.warn('[Tarô da Debs] Os depoimentos são EXEMPLOS FICTÍCIOS. Troque por reais em js/config.js antes de publicar.');
    }

    const trilho = $('#carrosselTrilho');
    const dots   = $('#depoDots');
    if (!trilho) return;

    trilho.innerHTML = d.lista.map((dep, i) => `
      <div class="depo" role="group" aria-label="${i + 1} de ${d.lista.length}">
        <figure class="depo-card">
          <blockquote class="depo-texto">“${dep.texto}”</blockquote>
          <figcaption class="depo-rodape">
            <span class="depo-inicial" aria-hidden="true">${dep.autor.charAt(0)}</span>
            <div><div class="depo-autor">${dep.autor}</div><div class="depo-ctx">${dep.contexto}</div></div>
          </figcaption>
        </figure>
      </div>`).join('');

    if (dots) {
      dots.innerHTML = d.lista.map((_, i) =>
        `<button class="dot${i === 0 ? ' ativo' : ''}" role="tab"
                 aria-label="Depoimento ${i + 1}" aria-selected="${i === 0}"></button>`).join('');
    }

    let idx = 0, timer = null;
    const total = d.lista.length;

    const ir = (n) => {
      idx = (n + total) % total;
      trilho.style.transform = `translateX(-${idx * 100}%)`;
      $$('.dot', dots).forEach((b, i) => {
        b.classList.toggle('ativo', i === idx);
        b.setAttribute('aria-selected', String(i === idx));
      });
    };
    const parar = () => { if (timer) { clearInterval(timer); timer = null; } };
    const auto  = () => { parar(); if (!Anim.menosMovimento && total > 1) timer = setInterval(() => ir(idx + 1), 6500); };

    $('#depoProx')?.addEventListener('click', () => { ir(idx + 1); auto(); });
    $('#depoAnt') ?.addEventListener('click', () => { ir(idx - 1); auto(); });
    $$('.dot', dots).forEach((b, i) => b.addEventListener('click', () => { ir(i); auto(); }));

    const car = $('#carrossel');
    car?.addEventListener('mouseenter', parar);
    car?.addEventListener('mouseleave', auto);
    document.addEventListener('visibilitychange', () => (document.hidden ? parar() : auto()));
    new IntersectionObserver(([e]) => (e.isIntersecting ? auto() : parar()), { threshold: .2 }).observe(bloco);

    let x0 = null;
    car?.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; parar(); }, { passive: true });
    car?.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 45) ir(idx + (dx < 0 ? 1 : -1));
      x0 = null; auto();
    }, { passive: true });
  }


  /* ============================================================
     TELA: CARTA DO DIA
     ============================================================ */
  const CHAVE = 'taro.debs.cartaDoDia';
  const hojeISO = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  function lerSalvo() {
    try {
      const dado = JSON.parse(localStorage.getItem(CHAVE) || 'null');
      return dado && dado.data === hojeISO() ? dado : null;
    } catch { return null; }
  }
  function salvar(n) {
    try { localStorage.setItem(CHAVE, JSON.stringify({ data: hojeISO(), n })); } catch { /* storage bloqueado */ }
  }

  function renderCarta() {
    const carta = $('#carta');
    if (!carta) return;

    setTexto('[data-carta-eyebrow]', CONFIG.carta.eyebrow);
    $('#cartaVerso').innerHTML = VERSO_SVG;

    const frente = $('#cartaFrente');
    const rotulo = $('#cartaRotulo');
    const titulo = $('#cartaTitulo');
    const msg    = $('#cartaMsg');
    const chaves = $('#cartaChaves');
    const dica   = $('#cartaDica');
    let revelada = false;

    // estado inicial
    titulo.textContent = CONFIG.carta.titulo;
    msg.textContent    = CONFIG.carta.subtitulo;

    function revelar(arc, comAnimacao) {
      frente.innerHTML = cartaSVG(arc);
      revelada = true;

      const mostrar = () => {
        rotulo.textContent = `Arcano ${arc.romano}`;
        titulo.textContent = arc.nome;
        msg.textContent    = arc.mensagem;
        chaves.innerHTML   = arc.palavras.map((p) => `<span>${p}</span>`).join('');
        $('#cartaRodape').hidden = false;
        $('#cartaAcoes').hidden  = false;
        if (dica) dica.style.opacity = '0';
        carta.classList.add('revelada');
        carta.setAttribute('aria-pressed', 'true');
        carta.setAttribute('aria-label', `Carta do dia: ${arc.nome}`);
      };

      if (!comAnimacao || Anim.menosMovimento) {
        carta.classList.add('virada');
        mostrar();
        return;
      }
      carta.classList.add('embaralhando');
      setTimeout(() => {
        carta.classList.remove('embaralhando');
        carta.classList.add('virada');
        Anim.particulas($('#particulas'));
        setTimeout(mostrar, 420);
      }, 760);
    }

    function tirar() {
      if (revelada) return;
      const salvo = lerSalvo();
      const arc = salvo ? (ARCANOS.find((a) => a.n === salvo.n) || ARCANOS[0])
                        : ARCANOS[Math.floor(Math.random() * ARCANOS.length)];
      if (!salvo) salvar(arc.n);
      revelar(arc, true);
    }

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
     TELA: AGENDAR
     ============================================================ */
  function renderAgendar() {
    const a = CONFIG.agendamento;
    setTexto('[data-agenda-eyebrow]', a.eyebrow);
    setTexto('[data-agenda-titulo]', a.titulo);
    setTexto('[data-agenda-sub]', a.subtitulo);
    setTexto('[data-faq-titulo]', CONFIG.faq.titulo);

    const fFormato = $('#fFormato');
    if (fFormato) {
      fFormato.innerHTML =
        `<option value="" disabled selected>Escolha…</option>` +
        CONFIG.servicos.itens.map((it) => `<option>${it.nome}</option>`).join('') +
        `<option>Ainda não sei</option>`;
    }
    if ($('#fTema'))    $('#fTema').innerHTML    = a.temas.map((t) => `<option>${t}</option>`).join('');
    if ($('#fHorario')) $('#fHorario').innerHTML = a.horarios.map((h) => `<option${h === 'Tanto faz' ? ' selected' : ''}>${h}</option>`).join('');

    // "Por Hora" não tem limite de perguntas
    fFormato?.addEventListener('change', () => {
      const campo = $('#campoQtd');
      if (campo) campo.style.display = /hora/i.test(fFormato.value) ? 'none' : '';
    });

    $('#formAgenda')?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validar()) return;

      const formato = $('#fFormato').value;
      const porHora = /hora/i.test(formato);
      const linhas = [
        `Olá, ${CONFIG.marca.nome}! Vim pelo site e gostaria de agendar uma leitura.`, '',
        `*Nome:* ${$('#fNome').value.trim()}`,
        `*Formato:* ${formato}`,
      ];
      if (!porHora) linhas.push(`*Perguntas:* ${$('#fQtd').value}`);
      linhas.push(`*Tema:* ${$('#fTema').value}`, `*Melhor horário:* ${$('#fHorario').value}`);
      const extra = $('#fMsg').value.trim();
      if (extra) linhas.push('', `*Contexto:* ${extra}`);

      window.open(linkWhats(linhas.join('\n')), '_blank', 'noopener');
    });

    renderFaq();
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
    };
    checar('#fNome', 'Preciso saber como te chamar.');
    checar('#fFormato', 'Escolha um formato.');
    return ok;
  }

  function renderFaq() {
    const lista = $('#faqLista');
    if (!lista) return;

    lista.innerHTML = CONFIG.faq.itens.map((it, i) => `
      <div class="faq-item" data-reveal data-delay="${i * 55}">
        <button class="faq-p" aria-expanded="false" aria-controls="faq-r-${i}" id="faq-p-${i}">
          <span>${it.p}</span><span class="faq-mais" aria-hidden="true"></span>
        </button>
        <div class="faq-r" id="faq-r-${i}" role="region" aria-labelledby="faq-p-${i}"><p>${it.r}</p></div>
      </div>`).join('');

    lista.addEventListener('click', (e) => {
      const btn = e.target.closest('.faq-p');
      if (!btn) return;
      const item = btn.parentElement;
      const abrir = !item.classList.contains('aberto');

      $$('.faq-item.aberto', lista).forEach((o) => {
        o.classList.remove('aberto');
        o.querySelector('.faq-r').style.maxHeight = '';
        o.querySelector('.faq-p').setAttribute('aria-expanded', 'false');
      });

      if (abrir) {
        item.classList.add('aberto');
        item.querySelector('.faq-r').style.maxHeight = `${item.querySelector('.faq-r').scrollHeight}px`;
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  }


  /* ============================================================
     LINKS DE WHATSAPP DECLARATIVOS
     ============================================================ */
  function ligarZap() {
    const msgs = {
      padrao: CONFIG.whatsapp.msgPadrao,
      hero:   CONFIG.whatsapp.msgHero,
      carta:  CONFIG.whatsapp.msgCartaDoDia,
    };
    $$('[data-zap]').forEach((el) => {
      el.setAttribute('href', linkWhats(msgs[el.dataset.zap] || msgs.padrao));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });
  }


  /* ============================================================
     BOOT
     ============================================================ */
  function init() {
    renderAbas();
    renderMarca();
    renderInicio();
    renderSobre();
    renderLeituras();
    renderCarta();
    renderAgendar();
    renderRodape();
    ligarZap();

    Anim.starfield();
    Anim.magneticos();
    Anim.reveal();

    Router.iniciar();
    document.body.classList.add('pronto');
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', init)
    : init();
})();
