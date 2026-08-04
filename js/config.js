/* ============================================================
   CONFIG — Tudo que a Debs precisa editar está NESTE arquivo.
   Nome, telefone, preços, textos, depoimentos e FAQ.
   ============================================================ */

const CONFIG = {

  /* ---------- MARCA ---------- */
  marca: {
    nome: 'Debs',
    titulo: 'Cartomante',
    tagline: 'Os guias falam. Eu traduzo.',
    instagram: 'debsmedisse',
    instagramUrl: 'https://instagram.com/debsmedisse',
  },

  /* ---------- CONTATO ----------
     WhatsApp: código do país + DDD + número, só dígitos. */
  whatsapp: {
    numero: '5511941723682',
    exibicao: '+55 (11) 94172-3682',
    msgPadrao: 'Olá, Debs! Vim pelo site e gostaria de saber mais sobre as leituras.',
    msgHero: 'Olá, Debs! Vim pelo site e gostaria de agendar uma leitura de Tarô.',
    msgCartaDoDia: 'Olá, Debs! Tirei minha carta do dia no site e gostaria de uma leitura completa.',
  },

  /* ---------- TELAS (abas) ---------- */
  telas: [
    { id: 'inicio',   label: 'Início',    icone: 'ico-lua' },
    { id: 'sobre',    label: 'Sobre',     icone: 'ico-coracao' },
    { id: 'leituras', label: 'Leituras',  icone: 'ico-carta-completa' },
    { id: 'carta',    label: 'Carta',     icone: 'ico-estrela' },
    { id: 'agendar',  label: 'Agendar',   icone: 'ico-zap' },
  ],

  /* ---------- INÍCIO ---------- */
  hero: {
    eyebrow: 'Leituras de Tarô · Online',
    titulo: 'Os guias falam.<br>Eu <em>traduzo</em>.',
    subtitulo: 'Escuta, ética e zero julgamento. Você traz a pergunta — as cartas fazem o resto.',
    ctaPrimario: 'Ver as leituras',
    ctaSecundario: 'Agendar',
    marcas: [
      { num: '22',   lbl: 'Arcanos' },
      { num: '24h',  lbl: 'Resposta' },
      { num: '100%', lbl: 'Sigiloso' },
    ],
  },

  /* ---------- SOBRE ---------- */
  sobre: {
    eyebrow: 'Quem lê as cartas',
    titulo: 'Prazer, eu sou a Debs',
    paragrafos: [
      'Não prevejo um futuro fechado. Abro o baralho com você e mostro o que está em jogo agora — os movimentos, os medos, as portas que você ainda não viu.',
      'Atendo online, com hora marcada, sem enrolação. A decisão continua sendo inteiramente sua.',
    ],
    // Coloque a foto em assets/ e aponte aqui. Ex.: 'assets/debs.jpg'
    foto: null,
    fotoAlt: 'Debs, cartomante e leitora de Tarô',
    pilares: [
      { titulo: 'Ética',         texto: 'Não leio terceiros sem consentimento.',      icone: 'balanca' },
      { titulo: 'Sigilo',        texto: 'O que é dito na leitura fica na leitura.',   icone: 'cadeado' },
      { titulo: 'Acolhimento',   texto: 'Chegue como estiver. Sem se justificar.',    icone: 'coracao' },
      { titulo: 'Livre-arbítrio',texto: 'As cartas mostram caminhos, não sentenças.', icone: 'chave' },
    ],
  },

  /* ---------- LEITURAS: preços + jornada ---------- */
  servicos: {
    eyebrow: 'Tabela de preços',
    titulo: 'Escolha o seu oráculo',
    subtitulo: 'Pagamento via Pix antes da tiragem.',
    itens: [
      {
        id: 'simples', nome: 'Simples', acento: 'rosa', destaque: false,
        descricao: 'Respostas diretas ao ponto.',
        duracao: 'Até 24h',
        linhas: [
          { label: '1 pergunta',           valor: 'R$ 15,00' },
          { label: '3 perguntas',          valor: 'R$ 35,00' },
          { label: 'Acima de 5 perguntas', valor: 'R$ 10,00 cada' },
        ],
      },
      {
        id: 'completas', nome: 'Completas', acento: 'ouro', destaque: true, selo: 'Mais procurada',
        descricao: 'Contexto, obstáculos e conselho em cada pergunta.',
        duracao: 'Até 24h',
        linhas: [
          { label: '1 pergunta',           valor: 'R$ 30,00' },
          { label: '3 perguntas',          valor: 'R$ 75,00' },
          { label: 'Acima de 5 perguntas', valor: 'R$ 25,00 cada' },
        ],
      },
      {
        id: 'hora', nome: 'Por Hora', acento: 'lavanda', destaque: false,
        descricao: 'Consulta ao vivo, conversa aberta.',
        duracao: 'Hora marcada',
        obs: 'Sem limite de perguntas',
        linhas: [
          { label: '1 hora',           valor: 'R$ 100,00' },
          { label: '2 horas',          valor: 'R$ 150,00' },
          { label: 'Acima de 3 horas', valor: '+ R$ 30,00 / h' },
        ],
      },
    ],
  },

  jornada: {
    titulo: 'Como funciona',
    passos: [
      { n: '01', titulo: 'Escolha o formato',   texto: 'Simples, Completas ou por hora.' },
      { n: '02', titulo: 'Mande as perguntas',  texto: 'Pelo WhatsApp, no seu tempo.' },
      { n: '03', titulo: 'Eu abro as cartas',   texto: 'Tiragem feita com a sua energia em mente.' },
      { n: '04', titulo: 'Você recebe',         texto: 'Em áudio ou texto, com a foto da tiragem.' },
    ],
  },

  /* ---------- CARTA DO DIA ---------- */
  carta: {
    eyebrow: 'Mini-oráculo · Grátis',
    titulo: 'Sua carta de hoje',
    subtitulo: 'Uma carta, uma mensagem. A mesma acompanha você até a meia-noite.',
  },

  /* ---------- DEPOIMENTOS ----------
     ⚠️⚠️⚠️  LEIA ANTES DE PUBLICAR  ⚠️⚠️⚠️
     Os depoimentos abaixo são EXEMPLOS FICTÍCIOS, escritos só para
     demonstrar o layout. NÃO são clientes reais.

     Troque por depoimentos verdadeiros antes de divulgar o site.
     Publicar avaliação inventada como real é propaganda enganosa
     (CDC art. 37) e derruba a confiança que esse trabalho exige.

     Sem depoimentos reais ainda? Use `lista: []` — a seção some sozinha.
     ⚠️⚠️⚠️ ---------------------------- ⚠️⚠️⚠️ */
  depoimentos: {
    exemplo: true,   // ← mude para false quando forem reais
    lista: [
      { texto: 'Cheguei perdida sobre uma decisão de trabalho e saí com clareza. Ela não enfeita nem assusta.', autor: 'M. R.', contexto: 'Completa · 3 perguntas' },
      { texto: 'O que me marcou foi a escuta. Não me senti julgada em nenhum momento.', autor: 'A. L.', contexto: 'Consulta por hora' },
      { texto: 'Fiz uma pergunta simples só para testar e voltei na semana seguinte para uma completa.', autor: 'J. P.', contexto: 'Simples · 1 pergunta' },
    ],
  },

  /* ---------- AGENDAMENTO ---------- */
  agendamento: {
    eyebrow: 'Vamos abrir as cartas',
    titulo: 'Agende sua leitura',
    subtitulo: 'Preencha e eu recebo tudo organizado no WhatsApp.',
    temas: [
      'Amor e relacionamentos', 'Trabalho e carreira', 'Dinheiro e prosperidade',
      'Família', 'Espiritualidade', 'Decisão específica', 'Panorama geral', 'Outro',
    ],
    horarios: ['Manhã', 'Tarde', 'Noite', 'Tanto faz'],
  },

  /* ---------- FAQ ---------- */
  faq: {
    titulo: 'Dúvidas frequentes',
    itens: [
      { p: 'Preciso estar presente na tiragem?', r: 'Nas leituras Simples e Completas, não — você manda as perguntas e recebe o resultado. Na consulta por hora, sim: é ao vivo.' },
      { p: 'Como recebo a leitura?', r: 'Pelo WhatsApp, em áudio ou texto, com a foto da tiragem.' },
      { p: 'Formas de pagamento?', r: 'Pix, antes da tiragem.' },
      { p: 'Posso perguntar sobre outra pessoa?', r: 'Posso ler a sua relação com ela. O que não faço é ler a vida de terceiros que não pediram.' },
      { p: 'O Tarô prevê doença ou morte?', r: 'Não, e eu não faço esse tipo de leitura. Para saúde, procure um médico.' },
    ],
  },

  /* ---------- RODAPÉ ---------- */
  rodape: {
    frase: 'Que a sua próxima carta venha leve.',
    avisoLegal: 'As leituras de Tarô têm finalidade de autoconhecimento e reflexão. Não substituem acompanhamento médico, psicológico, jurídico ou financeiro. Atendimento para maiores de 18 anos.',
  },
};

/* Monta um link wa.me com a mensagem já codificada. */
function linkWhats(mensagem) {
  return `https://wa.me/${CONFIG.whatsapp.numero}?text=${encodeURIComponent(mensagem)}`;
}
