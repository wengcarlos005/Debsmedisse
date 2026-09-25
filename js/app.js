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
    document.title = `${m.nome} | ${m.titulo} · Leituras de Tarô Online`;
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

    // Leque da capa: cartas ILUSTRADAS de verdade (não versos vazios)
    const leque = $('#leque');
    if (leque) {
      const escolhidas = (CONFIG.lequeCapa || [18, 17, 19])
        .map((n) => ARCANOS.find((a) => a.n === n))
        .filter(Boolean);

      leque.innerHTML = escolhidas.map((arc, i) =>
        `<div class="leque-carta${i === 1 ? ' anim-flutua' : ''}">${cartaSVG(arc)}</div>`
      ).join('');
    }
  }


  const placeholderFoto = () => `
    <div class="retrato-vazio">${ICO('ico-camera')}
      <span>Espaço para a foto</span>
      <span style="font-size:.56rem;opacity:.7;text-transform:none;letter-spacing:0">
        defina <code>sobre.foto</code> em js/config.js</span>
    </div>`;

  /* ============================================================
     TELA: SOBRE
     ============================================================ */
  function renderSobre() {
    const s = CONFIG.sobre;
    setTexto('[data-sobre-eyebrow]', s.eyebrow);
    setTexto('[data-sobre-titulo]', s.titulo);
    setTexto('[data-sobre-assinatura]', CONFIG.marca.nome);

    const txt = $('#sobreTexto');
    if (txt) txt.innerHTML = s.paragrafos.map((p) => `<p>${p}</p>`).join('');

    const foto = $('#retratoFoto');
    if (foto) {
      if (s.foto) {
        // webp quando o navegador suporta, jpg como reserva; mini no celular
        foto.innerHTML = `
          <picture>
            ${s.fotoWebp ? `<source type="image/webp" srcset="${s.fotoWebp}">` : ''}
            <img src="${s.foto}" alt="${s.fotoAlt}" loading="lazy" decoding="async">
          </picture>`;
        // se o arquivo sumir, cai no placeholder em vez de mostrar ícone quebrado
        foto.querySelector('img').addEventListener('error', () => {
          foto.innerHTML = placeholderFoto();
        });
      } else {
        foto.innerHTML = placeholderFoto();
      }
    }

    // Princípios como lista editorial (não como grade de cards)
    const ROMANOS = ['i', 'ii', 'iii', 'iv', 'v', 'vi'];
    const pil = $('#pilares');
    if (pil) {
      pil.innerHTML = s.pilares.map((p, i) => `
        <li data-reveal="esquerda" data-delay="${i * 90}">
          <span class="p-num">${ROMANOS[i] || i + 1}</span>
          <span class="p-nome">${p.titulo}</span>
          <span class="p-txt">${p.texto}</span>
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
          const msg = `Olá, ${CONFIG.marca.nome}! Vim pelo site. Gostaria de uma leitura *${it.nome}*, ${l.label.toLowerCase()} (${l.valor}). Podemos conversar?`;
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
            <p class="svc-quem">${it.paraQuem || ''}</p>
            <div class="svc-tabela">${linhas}</div>
            <p class="svc-obs">${it.obs ? ICO('ico-info') + ' ' + it.obs : ''}</p>
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

    // Sem banner na página: o alerta vai só para quem abre o console
    if (d.exemplo) {
      console.warn(
        '[Tarô da Debs] Os depoimentos em js/config.js ainda são EXEMPLOS FICTÍCIOS.\n' +
        'Troque por depoimentos reais (ou use lista: []) antes de divulgar o site.'
      );
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
    const ritual = $('#cartaRitual');
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
        if (ritual) ritual.hidden = true;      // some o passo-a-passo
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
      const arc = salvo ? (BARALHO.find((a) => a.n === salvo.n) || BARALHO[0])
                        : BARALHO[Math.floor(Math.random() * BARALHO.length)];
      if (!salvo) salvar(arc.n);
      revelar(arc, true);
    }

    const salvo = lerSalvo();
    if (salvo) {
      const arc = BARALHO.find((a) => a.n === salvo.n);
      if (arc) revelar(arc, false);
    }

    carta.addEventListener('click', tirar);
    carta.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tirar(); }
    });
    $('#btnVirar')?.addEventListener('click', tirar);

    /* Compartilhar a carta: é o gancho de divulgação orgânica.
       Usa a folha nativa do celular; no desktop copia o texto. */
    $('#btnCompartilhar')?.addEventListener('click', async (e) => {
      const salvoAgora = lerSalvo();
      const arc = salvoAgora && BARALHO.find((a) => a.n === salvoAgora.n);
      if (!arc) return;

      const texto = `Minha carta de hoje: ${arc.nome}.\n"${arc.mensagem}"`;
      const btn = e.currentTarget;
      const rotulo = btn.querySelector('span');

      /* Cada carta tem sua própria página em /c/<slug>.html, com a
         og:image daquela carta. Compartilhar a raiz do site mostraria
         sempre a mesma capa genérica no WhatsApp. */
      const slug = (typeof SLUGS !== 'undefined') && SLUGS[arc.nome];
      const base = location.origin + location.pathname.replace(/index\.html$/, '');
      const url = slug ? `${base}c/${slug}.html` : base;

      try {
        // 1ª escolha: mandar a IMAGEM da carta (vira story de Instagram)
        if (navigator.canShare) {
          try {
            const resp = await fetch(`assets/og/${slug}.jpg`);
            const blob = await resp.blob();
            const arquivo = new File([blob], `carta-${slug}.jpg`, { type: 'image/jpeg' });
            if (navigator.canShare({ files: [arquivo] })) {
              await navigator.share({ files: [arquivo], text: `${texto}\n${url}` });
              return;
            }
          } catch { /* sem suporte a arquivo: cai para o link */ }
        }

        if (navigator.share) {
          await navigator.share({ title: 'Carta do dia', text: texto, url });
          return;
        }

        await navigator.clipboard.writeText(`${texto}\n${url}`);
        rotulo.textContent = 'Copiado!';
        setTimeout(() => { rotulo.textContent = 'Compartilhar'; }, 2200);
      } catch {
        // usuário cancelou a folha de compartilhamento, ou clipboard negado
      }
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

      const url = linkWhats(linhas.join('\n'));
      const aba = window.open(url, '_blank', 'noopener');

      // confirma na página; se o popup foi bloqueado, oferece o link manual
      const ok = $('#formSucesso');
      if (ok) {
        $('#linkManual').href = url;
        ok.hidden = false;
        ok.classList.toggle('bloqueado', !aba);
        ok.querySelector('strong').textContent = aba
          ? 'Pronto, o WhatsApp foi aberto.'
          : 'Seu navegador bloqueou a janela.';
        ok.scrollIntoView({ block: 'nearest', behavior: Anim.menosMovimento ? 'auto' : 'smooth' });
      }
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

  /* Carrega config do Supabase (se disponível) e aplica sobre o CONFIG estático */
  async function loadRemoteConfig() {
    if (typeof SupaDB === 'undefined' || !SupaDB.isConfigured()) return;
    try {
      const d = await SupaDB.loadConfig();
      if (!d) return;
      if (d.marca) Object.assign(CONFIG.marca, d.marca);
      if (d.whatsapp) Object.assign(CONFIG.whatsapp, d.whatsapp);
      if (d.hero) {
        CONFIG.hero.eyebrow = d.hero.eyebrow || CONFIG.hero.eyebrow;
        CONFIG.hero.titulo = d.hero.titulo || CONFIG.hero.titulo;
        CONFIG.hero.subtitulo = d.hero.subtitulo || CONFIG.hero.subtitulo;
        CONFIG.hero.ctaPrimario = d.hero.ctaPrimario || CONFIG.hero.ctaPrimario;
        CONFIG.hero.ctaSecundario = d.hero.ctaSecundario || CONFIG.hero.ctaSecundario;
      }
      if (d.sobre) {
        CONFIG.sobre.eyebrow = d.sobre.eyebrow || CONFIG.sobre.eyebrow;
        CONFIG.sobre.titulo = d.sobre.titulo || CONFIG.sobre.titulo;
        if (d.sobre.par1 || d.sobre.par2) CONFIG.sobre.paragrafos = [d.sobre.par1||'', d.sobre.par2||''];
      }
      if (d.pilares) CONFIG.sobre.pilares = d.pilares.map((p,i) => ({
        titulo: p.titulo, texto: p.texto,
        icone: p.icone || (CONFIG.sobre.pilares[i]||{}).icone || 'estrela',
      }));
      if (d.servicos) {
        const acentos = ['rosa','ouro','lavanda'];
        const ids = ['simples','completas','hora'];
        CONFIG.servicos.itens = d.servicos.map((s,i) => ({
          id: ids[i]||'extra', nome: s.nome, acento: acentos[i]||'ouro',
          destaque: i===1, selo: i===1?'Mais procurada':'',
          descricao: s.descricao, paraQuem: s.paraQuem, duracao: s.duracao,
          obs: i===2?'Sem limite de perguntas':'',
          linhas: s.linhas,
        }));
      }
      if (d.jornada) CONFIG.jornada.passos = d.jornada.map((j,i) => ({
        n: String(i+1).padStart(2,'0'), titulo: j.titulo, texto: j.texto,
      }));
      if (d.faq) CONFIG.faq.itens = d.faq;
      if (d.depoimentos) {
        CONFIG.depoimentos.lista = d.depoimentos;
        CONFIG.depoimentos.exemplo = false;
      }
      if (d.rodape) Object.assign(CONFIG.rodape, d.rodape);
    } catch(e) { console.warn('[Debs] Config remoto indisponível, usando estático.', e); }
  }

  async function boot() {
    await loadRemoteConfig();
    init();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();
})();
