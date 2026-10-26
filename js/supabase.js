/* ============================================================
   SUPABASE — conexão com o banco para config editável.
   Se o Supabase não estiver configurado ou offline,
   o site funciona normalmente com o config.js estático.
   ============================================================ */

const SUPABASE_CONFIG = {
  url: 'https://rkmndimsgqwjhsejpszl.supabase.co',
  key: 'sb_publishable_umPlxsx7GPFjc8ypzCwzHQ_cefg7L6t',
};

const SupaDB = (() => {
  function headers() {
    return {
      'apikey': SUPABASE_CONFIG.key,
      'Content-Type': 'application/json',
    };
  }

  function authHeaders(token) {
    return {
      ...headers(),
      'Authorization': 'Bearer ' + token,
    };
  }

  function api(path) {
    return SUPABASE_CONFIG.url + '/rest/v1/' + path;
  }

  function authApi(path) {
    return SUPABASE_CONFIG.url + '/auth/v1/' + path;
  }

  function isConfigured() {
    return SUPABASE_CONFIG.url.length > 0 && SUPABASE_CONFIG.key.length > 0;
  }

  /* Carrega o config salvo no Supabase (tabela site_config, row id=1) */
  async function loadConfig() {
    if (!isConfigured()) return null;
    try {
      const r = await fetch(api('site_config?id=eq.1&select=data'), { headers: headers() });
      if (!r.ok) return null;
      const rows = await r.json();
      return rows.length ? rows[0].data : null;
    } catch { return null; }
  }

  /* Salva o config no Supabase (upsert na row id=1) */
  async function saveConfig(data, token) {
    const r = await fetch(api('site_config'), {
      method: 'POST',
      headers: {
        ...authHeaders(token),
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({ id: 1, data }),
    });
    return r.ok;
  }

  /* Login com email+senha */
  async function login(email, senha) {
    const r = await fetch(authApi('token?grant_type=password'), {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password: senha }),
    });
    if (!r.ok) return null;
    return r.json();
  }

  /* Verifica sessão salva */
  async function getSession() {
    const token = localStorage.getItem('sb_token');
    if (!token) return null;
    const r = await fetch(authApi('user'), {
      headers: authHeaders(token),
    });
    if (!r.ok) { localStorage.removeItem('sb_token'); return null; }
    return { token, user: await r.json() };
  }

  /* ---------- AGENDAMENTOS ---------- */

  /* Cliente cria a reserva (fica aguardando o Pix). Não lê nada de volta. */
  async function criarAgendamento(ag) {
    const r = await fetch(api('agendamentos'), {
      method: 'POST',
      headers: { ...headers(), 'Prefer': 'return=minimal' },
      body: JSON.stringify(ag),
    });
    if (r.ok) return { ok: true };
    const txt = await r.text();
    return { ok: false, ocupado: /horario_indisponivel/.test(txt), erro: txt };
  }

  /* Horários já tomados num intervalo — só início/fim, sem dados pessoais. */
  async function horariosOcupados(deISO, ateISO) {
    const r = await fetch(api('rpc/horarios_ocupados'), {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ de: deISO, ate: ateISO }),
    });
    if (!r.ok) throw new Error('ocupados ' + r.status);
    return r.json();
  }

  /* Admin: lista os agendamentos */
  async function listarAgendamentos(token) {
    const r = await fetch(api('agendamentos?select=*&order=inicio.asc'), { headers: authHeaders(token) });
    if (!r.ok) return null;
    return r.json();
  }

  /* Admin: muda o status de um agendamento */
  async function atualizarStatus(id, status, token) {
    const r = await fetch(api('agendamentos?id=eq.' + encodeURIComponent(id)), {
      method: 'PATCH',
      headers: { ...authHeaders(token), 'Prefer': 'return=minimal' },
      body: JSON.stringify({ status }),
    });
    return r.ok;
  }

  return {
    isConfigured, loadConfig, saveConfig, login, getSession,
    criarAgendamento, horariosOcupados, listarAgendamentos, atualizarStatus,
  };
})();
