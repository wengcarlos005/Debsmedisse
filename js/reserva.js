/* ============================================================
   RESERVA — agendamento + pagamento por Pix, em 4 passos:
   1. leitura  2. dia e horário  3. dados  4. Pix
   Horários usam o fuso de São Paulo (UTC-3) para todo mundo,
   mesmo que o cliente esteja em outro país.
   ============================================================ */

const Reserva = (() => {
  const TZ = '-03:00';
  const SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const MESES  = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const PASSOS = ['Leitura', 'Horário', 'Seus dados', 'Pagamento'];
  const RESERVA_MIN = 60;   // mesmo valor do SQL: horário fica segurado 60 min

  let root;
  const st = {
    etapa: 1, oraculo: null, pacote: null, dia: null, hora: null,
    ocupados: [], ocupadosOk: true, carregando: false,
    dados: { nome: '', whatsapp: '', tema: '', mensagem: '' },
    codigo: null, pix: '', erro: '',
  };

  /* ---------- utilidades ---------- */
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const brl = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const min = (h) => { const [a, b] = h.split(':').map(Number); return a * 60 + b; };
  const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  const isoSP = (dia, hora) => `${dia}T${hora}:00${TZ}`;
  const agoraSP = () => new Date(Date.now() - 3 * 3600e3);   // getters UTC = hora de SP

  function rotuloDia(k) {
    const d = new Date(`${k}T12:00:00Z`);
    return `${SEMANA[d.getUTCDay()]}, ${d.getUTCDate()} de ${MESES[d.getUTCMonth()]}`;
  }

  function novoCodigo() {
    const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let c = '';
    const r = crypto.getRandomValues(new Uint8Array(5));
    r.forEach((n) => { c += abc[n % abc.length]; });
    return `DM-${c}`;
  }

  /* ---------- agenda ---------- */
  function diasDaJanela() {
    const a = CONFIG.agenda;
    const base = agoraSP();
    const out = [];
    for (let i = 0; i <= Number(a.janelaDias || 30); i++) {
      const d = new Date(Date.UTC(base.getUTCFullYear(), base.getUTCMonth(), base.getUTCDate() + i));
      const k = d.toISOString().slice(0, 10);
      if (!(a.dias || []).map(Number).includes(d.getUTCDay())) continue;
      if ((a.folgas || []).includes(k)) continue;
      out.push(k);
    }
    return out;
  }

  function horariosDoDia(k) {
    const a = CONFIG.agenda;
    const dur = Number(st.pacote.duracao) || 30;
    const passo = Number(a.intervalo) || 30;
    const limite = Date.now() + Number(a.antecedenciaHoras || 0) * 3600e3;
    const out = [];
    for (let m = min(a.inicio); m + dur <= min(a.fim); m += passo) {
      const h = hhmm(m);
      const t0 = new Date(isoSP(k, h)).getTime();
      const t1 = t0 + dur * 60e3;
      if (t0 < limite) continue;
      const livre = !st.ocupados.some((o) =>
        t0 < new Date(o.fim).getTime() && t1 > new Date(o.inicio).getTime());
      out.push({ h, livre });
    }
    return out;
  }

  async function carregarOcupados() {
    st.carregando = true; render();
    try {
      const dias = diasDaJanela();
      if (dias.length && typeof SupaDB !== 'undefined' && SupaDB.isConfigured()) {
        st.ocupados = await SupaDB.horariosOcupados(
          isoSP(dias[0], '00:00'), isoSP(dias[dias.length - 1], '23:59'));
      }
      st.ocupadosOk = true;
    } catch (e) {
      console.warn('[Reserva] não consegui ler a agenda', e);
      st.ocupados = []; st.ocupadosOk = false;
    }
    st.carregando = false;
    if (st.dia && !horariosDoDia(st.dia).some((x) => x.livre)) st.dia = null;
    render();
  }

  /* ---------- passos ---------- */
  function htmlPassos() {
    return `<ol class="rv-passos" aria-label="Etapas do agendamento">${PASSOS.map((p, i) => `
      <li class="${i + 1 === st.etapa ? 'atual' : ''}${i + 1 < st.etapa ? ' feito' : ''}"
          ${i + 1 === st.etapa ? 'aria-current="step"' : ''}><b>${i + 1}</b><span>${p}</span></li>`).join('')}
    </ol>`;
  }

  /* agrupa "Simples · 1 pergunta" em Simples → 1 pergunta */
  function gruposPacotes() {
    const grupos = [];
    CONFIG.pacotes.forEach((p, i) => {
      const partes = String(p.nome).split(' · ');
      const nome = partes.length > 1 ? partes[0] : '';
      const rotulo = partes.length > 1 ? partes.slice(1).join(' · ') : p.nome;
      let g = grupos.find((x) => x.nome === nome);
      if (!g) grupos.push(g = { nome, itens: [] });
      g.itens.push({ p, i, rotulo });
    });
    return grupos;
  }

  function htmlEtapa1() {
    return `
      <div class="rv-bloco rv-drop">
        <p class="rv-rot" id="rvLeituraRot">Qual leitura?</p>
        <button type="button" class="rv-sel${st.dropAberto ? ' ab' : ''}" data-abrir
          aria-haspopup="listbox" aria-expanded="${!!st.dropAberto}" aria-labelledby="rvLeituraRot">
          <span class="${st.pacote ? '' : 'rv-ph'}">${st.pacote ? esc(st.pacote.nome) : 'Escolha sua leitura'}</span>
          <span class="rv-sel-dir">
            ${st.pacote ? `<span class="rv-pac-preco">${brl(st.pacote.preco)}</span>` : ''}
            <svg class="rv-ch" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </span>
        </button>
        ${st.dropAberto ? `<div class="rv-lista" role="listbox" aria-labelledby="rvLeituraRot">
          ${gruposPacotes().map((g) => `
            ${g.nome ? `<p class="rv-grp">${esc(g.nome)}</p>` : ''}
            ${g.itens.map(({ p, i, rotulo }) => `
              <button type="button" role="option" aria-selected="${st.pacote === p}"
                class="rv-op${st.pacote === p ? ' on' : ''}" data-pacote="${i}">
                <span>${esc(rotulo)}<small>${p.duracao} min · ao vivo</small></span>
                <span class="rv-pac-preco">${brl(p.preco)}</span>
              </button>`).join('')}`).join('<div class="rv-dv"></div>')}
        </div>` : ''}
      </div>
      <button type="button" class="btn btn--ouro btn--bloco" data-ir="2"
        ${st.pacote ? '' : 'disabled'}>Escolher dia e horário</button>`;
  }

  function htmlEtapa2() {
    if (st.carregando) return `<p class="rv-carregando">Consultando a agenda…</p>`;
    const dias = diasDaJanela().map((k) => ({ k, livre: horariosDoDia(k).some((x) => x.livre) }));
    if (!dias.some((d) => d.livre)) {
      return `<p class="rv-aviso">Não há horários livres nos próximos dias para essa leitura.
        <a href="${linkWhats(`Olá, ${CONFIG.marca.nome}! Queria agendar uma leitura, mas não achei horário no site.`)}"
        target="_blank" rel="noopener">Fale comigo pelo WhatsApp</a>.</p>
        <button type="button" class="btn btn--linha btn--bloco" data-ir="1">Voltar</button>`;
    }
    const horas = st.dia ? horariosDoDia(st.dia) : [];
    return `
      ${st.ocupadosOk ? '' : `<p class="rv-aviso">Não consegui confirmar a agenda agora. Ao reservar, eu confiro se o horário segue livre.</p>`}
      <div class="rv-bloco">
        <p class="rv-rot">Dia</p>
        <div class="rv-dias">
          ${dias.map(({ k, livre }) => {
            const d = new Date(`${k}T12:00:00Z`);
            return `<button type="button" class="rv-dia${st.dia === k ? ' on' : ''}" data-dia="${k}"
                ${livre ? '' : 'disabled'} aria-pressed="${st.dia === k}" aria-label="${rotuloDia(k)}${livre ? '' : ', lotado'}">
                <small>${SEMANA[d.getUTCDay()]}</small><b>${d.getUTCDate()}</b><small>${MESES[d.getUTCMonth()]}</small>
              </button>`;
          }).join('')}
        </div>
      </div>
      ${st.dia ? `
      <div class="rv-bloco">
        <p class="rv-rot">Horário <em>(horário de Brasília)</em></p>
        <div class="rv-horas">
          ${horas.map(({ h, livre }) => `<button type="button" class="rv-hora${st.hora === h ? ' on' : ''}"
              data-hora="${h}" ${livre ? '' : 'disabled'} aria-pressed="${st.hora === h}">${h}</button>`).join('')}
        </div>
      </div>` : ''}
      <div class="rv-nav">
        <button type="button" class="btn btn--linha" data-ir="1">Voltar</button>
        <button type="button" class="btn btn--ouro" data-ir="3" ${st.dia && st.hora ? '' : 'disabled'}>Continuar</button>
      </div>`;
  }

  function htmlResumo() {
    return `<div class="rv-resumo">
      <div><span>Leitura</span><b>${esc(st.pacote.nome)}</b></div>
      <div><span>Quando</span><b>${rotuloDia(st.dia)} às ${st.hora}</b></div>
      <div><span>Valor</span><b class="rv-valor">${brl(st.pacote.preco)}</b></div>
    </div>`;
  }

  function htmlEtapa3() {
    const d = st.dados;
    const temas = (CONFIG.agendamento && CONFIG.agendamento.temas) || [];
    return `
      ${htmlResumo()}
      <form class="rv-form" novalidate>
        <div class="form-grid">
          <div class="campo">
            <label for="rvNome">Seu nome <span class="req" aria-hidden="true">*</span></label>
            <input id="rvNome" name="nome" type="text" autocomplete="name" autocapitalize="words"
              maxlength="80" value="${esc(d.nome)}" placeholder="Como posso te chamar?" required>
            <span class="erro" data-erro="nome"></span>
          </div>
          <div class="campo">
            <label for="rvZap">Seu WhatsApp <span class="req" aria-hidden="true">*</span></label>
            <input id="rvZap" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel"
              maxlength="20" value="${esc(d.whatsapp)}" placeholder="(11) 99999-9999" required>
            <span class="erro" data-erro="whatsapp"></span>
          </div>
          ${temas.length ? `<div class="campo campo--full">
            <label for="rvTema">Tema</label>
            <select id="rvTema" name="tema">${temas.map((t) =>
              `<option${t === d.tema ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select>
          </div>` : ''}
          <div class="campo campo--full">
            <label for="rvMsg">Quer adiantar algo? <em>(opcional)</em></label>
            <textarea id="rvMsg" name="mensagem" rows="3" maxlength="1000"
              placeholder="Em poucas linhas, o que te traz até as cartas.">${esc(d.mensagem)}</textarea>
          </div>
          <label class="rv-check campo--full">
            <input type="checkbox" name="maior" required>
            <span>Tenho 16 anos ou mais e entendo que a leitura é para autoconhecimento.</span>
          </label>
          <span class="erro rv-erro-maior" data-erro="maior"></span>
        </div>
        ${st.erro ? `<p class="rv-aviso" role="alert">${st.erro}</p>` : ''}
        <div class="rv-nav">
          <button type="button" class="btn btn--linha" data-ir="2">Voltar</button>
          <button type="submit" class="btn btn--ouro" ${st.carregando ? 'disabled' : ''}>
            ${st.carregando ? 'Reservando…' : 'Reservar e pagar'}</button>
        </div>
      </form>`;
  }

  function msgComprovante() {
    return [
      `Olá, ${CONFIG.marca.nome}! Acabei de agendar pelo site.`, '',
      `*Pedido:* ${st.codigo}`,
      `*Nome:* ${st.dados.nome}`,
      `*Leitura:* ${st.pacote.nome}`,
      `*Quando:* ${rotuloDia(st.dia)} às ${st.hora}`,
      `*Valor:* ${brl(st.pacote.preco)}`, '',
      CONFIG.agenda.pixChave ? 'Segue o comprovante do Pix 👇' : 'Pode me mandar a chave Pix?',
    ].join('\n');
  }

  function msgFalha() {
    return [
      `Olá, ${CONFIG.marca.nome}! Tentei agendar pelo site e não consegui.`, '',
      `*Nome:* ${st.dados.nome}`,
      `*Leitura:* ${st.pacote.nome}`,
      `*Quando:* ${rotuloDia(st.dia)} às ${st.hora}`,
    ].join('\n');
  }

  function htmlEtapa4() {
    const temPix = !!(CONFIG.agenda.pixChave || '').trim();
    return `
      <div class="rv-ok" role="status">
        <p class="rv-rot">Horário reservado</p>
        <p class="rv-codigo">Pedido <b>${st.codigo}</b></p>
      </div>
      ${htmlResumo()}
      ${temPix ? `
      <div class="rv-pix">
        <div class="rv-qr" id="rvQr" aria-label="QR Code do Pix"></div>
        <div class="rv-pix-txt">
          <p class="rv-rot">Pague com Pix</p>
          <p>Abra o app do seu banco, escolha <b>Pix → Ler QR Code</b> ou use o código copia e cola:</p>
          <div class="rv-copia">
            <input type="text" readonly value="${esc(st.pix)}" aria-label="Código Pix copia e cola" id="rvPixTxt">
            <button type="button" class="btn btn--linha btn--sm" data-copiar>Copiar</button>
          </div>
        </div>
      </div>` : `
      <p class="rv-aviso">Te mando a chave Pix pelo WhatsApp para garantir o horário.</p>`}
      <p class="nota">Seu horário fica segurado por ${RESERVA_MIN} minutos. Depois de pagar, envie o comprovante e eu confirmo.</p>
      <a class="btn btn--zap btn--bloco" target="_blank" rel="noopener" href="${linkWhats(msgComprovante())}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><use href="#ico-zap"/></svg>
        ${temPix ? 'Enviar comprovante pelo WhatsApp' : 'Falar com a Debs no WhatsApp'}
      </a>
      <button type="button" class="rv-link" data-reiniciar>Fazer outro agendamento</button>`;
  }

  /* ---------- render ---------- */
  function render() {
    if (!root) return;
    const corpo = [null, htmlEtapa1, htmlEtapa2, htmlEtapa3, htmlEtapa4][st.etapa]();
    root.innerHTML = `${htmlPassos()}<div class="rv-corpo">${corpo}</div>`;
    if (st.etapa === 4 && st.pix && typeof QRCode !== 'undefined') {
      new QRCode(document.getElementById('rvQr'), {
        text: st.pix, width: 200, height: 200,
        colorDark: '#0B1120', colorLight: '#F4EDE4', correctLevel: QRCode.CorrectLevel.M,
      });
    }
  }

  function irPara(n, rolar = true) {
    st.etapa = n; st.erro = '';
    if (n === 2) carregarOcupados(); else render();
    if (rolar) root.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  /* ---------- envio ---------- */
  function lerForm(form) {
    const f = new FormData(form);
    st.dados = {
      nome: String(f.get('nome') || '').trim(),
      whatsapp: String(f.get('whatsapp') || '').trim(),
      tema: String(f.get('tema') || ''),
      mensagem: String(f.get('mensagem') || '').trim(),
    };
    const erros = {};
    if (!st.dados.nome) erros.nome = 'Preciso saber como te chamar.';
    const dig = st.dados.whatsapp.replace(/\D/g, '');
    if (dig.length < 10 || dig.length > 13) erros.whatsapp = 'Confira o número com DDD.';
    if (!f.get('maior')) erros.maior = 'Confirme para continuar.';
    form.querySelectorAll('[data-erro]').forEach((el) => { el.textContent = erros[el.dataset.erro] || ''; });
    form.querySelectorAll('input[name], select[name]').forEach((el) =>
      el.classList.toggle('invalido', !!erros[el.name]));
    const primeiro = Object.keys(erros)[0];
    if (primeiro) form.querySelector(`[name="${primeiro}"]`)?.focus();
    return !primeiro;
  }

  async function reservar(form) {
    if (!lerForm(form)) return;
    st.carregando = true; st.erro = ''; render();

    const dur = Number(st.pacote.duracao) || 30;
    const inicio = new Date(isoSP(st.dia, st.hora));
    const fim = new Date(inicio.getTime() + dur * 60e3);
    st.codigo = novoCodigo();
    let dig = st.dados.whatsapp.replace(/\D/g, '');
    if (dig.length <= 11) dig = '55' + dig;

    const ag = {
      id: st.codigo, nome: st.dados.nome, whatsapp: dig,
      oraculo: '', pacote: st.pacote.nome, valor: Number(st.pacote.preco),
      inicio: inicio.toISOString(), fim: fim.toISOString(),
      tema: st.dados.tema || null, mensagem: st.dados.mensagem || null,
    };

    let res = { ok: false };
    try { res = await SupaDB.criarAgendamento(ag); } catch (e) { res = { ok: false, erro: String(e) }; }
    st.carregando = false;

    if (res.ok) {
      const a = CONFIG.agenda;
      st.pix = (a.pixChave || '').trim() ? Pix.gerar({
        tipo: a.pixTipo, chave: a.pixChave, nome: a.pixNome, cidade: a.pixCidade,
        valor: st.pacote.preco, txid: st.codigo,
      }) : '';
      irPara(4);
      return;
    }
    if (res.ocupado) {
      st.hora = null;
      st.erro = '';
      irPara(2);
      setTimeout(() => {
        const aviso = document.createElement('p');
        aviso.className = 'rv-aviso'; aviso.setAttribute('role', 'alert');
        aviso.textContent = 'Esse horário acabou de ser reservado por outra pessoa. Escolha outro, por favor.';
        root.querySelector('.rv-corpo')?.prepend(aviso);
      }, 400);
      return;
    }
    console.warn('[Reserva] erro', res.erro);
    st.erro = `Não consegui concluir a reserva agora.
      <a href="${linkWhats(msgFalha())}" target="_blank" rel="noopener">Me chama no WhatsApp</a>
      que eu agendo para você.`;
    render();
  }

  /* ---------- eventos ---------- */
  function ligar() {
    root.addEventListener('click', (e) => {
      const b = e.target.closest('button, [data-ir]');
      if (!b || b.disabled) return;

      if ('abrir' in b.dataset) {
        st.dropAberto = !st.dropAberto; render();
        if (st.dropAberto) root.querySelector('.rv-op.on, .rv-op')?.focus();
        return;
      }
      if (b.dataset.pacote) {
        const p = CONFIG.pacotes[Number(b.dataset.pacote)];
        if (p !== st.pacote) { st.pacote = p; st.hora = null; }
        st.dropAberto = false; render();
        root.querySelector('[data-abrir]')?.focus();
        return;
      }
      if (b.dataset.dia) { st.dia = b.dataset.dia; st.hora = null; render();
        root.querySelector('.rv-horas')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); return; }
      if (b.dataset.hora) { st.hora = b.dataset.hora; render(); return; }
      if (b.dataset.ir) {
        if (st.etapa === 3) {   // guarda o que já foi digitado ao voltar
          const form = root.querySelector('.rv-form');
          if (form) { const f = new FormData(form);
            st.dados = { nome: f.get('nome') || '', whatsapp: f.get('whatsapp') || '',
              tema: f.get('tema') || '', mensagem: f.get('mensagem') || '' }; }
        }
        irPara(Number(b.dataset.ir)); return;
      }
      if ('copiar' in b.dataset) {
        const inp = root.querySelector('#rvPixTxt');
        const ok = () => { b.textContent = 'Copiado!'; setTimeout(() => { b.textContent = 'Copiar'; }, 2000); };
        if (navigator.clipboard) navigator.clipboard.writeText(inp.value).then(ok, () => { inp.select(); });
        else { inp.select(); document.execCommand('copy'); ok(); }
        return;
      }
      if ('reiniciar' in b.dataset) {
        Object.assign(st, { etapa: 1, dropAberto: false, pacote: null, dia: null, hora: null, codigo: null, pix: '' });
        irPara(1); return;
      }
    });

    /* fecha a lista ao clicar fora ou apertar Esc; setas navegam */
    document.addEventListener('click', (e) => {
      if (st.dropAberto && !e.target.closest('.rv-drop')) { st.dropAberto = false; render(); }
    });
    root.addEventListener('keydown', (e) => {
      if (!st.dropAberto) return;
      const ops = [...root.querySelectorAll('.rv-op')];
      const i = ops.indexOf(document.activeElement);
      if (e.key === 'Escape') { st.dropAberto = false; render(); root.querySelector('[data-abrir]')?.focus(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); ops[Math.min(i + 1, ops.length - 1)]?.focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); ops[Math.max(i - 1, 0)]?.focus(); }
    });

    root.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!st.carregando) reservar(e.target);
    });
  }

  function montar(el) {
    if (!el) return;
    root = el;
    ligar();
    render();
  }

  return { montar };
})();
