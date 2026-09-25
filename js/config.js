/* ============================================================
   CONFIG — Tudo que a Debs precisa editar está NESTE arquivo.
   Nome, telefone, preços, textos, depoimentos e FAQ.
   ============================================================ */

const CONFIG = {

  /* ---------- MARCA ---------- */
  marca: {
    nome: 'Debs',
    titulo: 'Cartomante',
    tagline: 'Os guias falam. Eu traduzo. Tarô e Baralho Cigano.',
    instagram: 'debsmedisse',
    instagramUrl: 'https://instagram.com/debsmedisse',
  },

  /* ---------- CONTATO ----------
     WhatsApp: código do país + DDD + número, só dígitos. */
  whatsapp: {
    numero: '5511941723682',
    exibicao: '+55 (11) 94172-3682',
    msgPadrao: 'Olá, Debs! Vim pelo site e gostaria de saber mais sobre as leituras.',
    msgHero: 'Olá, Debs! Vim pelo site e gostaria de agendar uma leitura ao vivo.',
    msgCartaDoDia: 'Olá, Debs! Tirei minha carta do dia no site e gostaria de uma leitura completa.',
  },

  /* ---------- TELAS (abas) ----------
     "inicio" reúne capa + sobre + carta do dia numa tela só.
     Leituras e Agendar continuam em telas separadas. */
  telas: [
    { id: 'inicio',   label: 'Início',   icone: 'ico-lua' },
    { id: 'leituras', label: 'Leituras', icone: 'ico-carta-completa' },
    { id: 'agendar',  label: 'Agendar',  icone: 'ico-zap' },
  ],

  /* Cartas mostradas no leque da capa (índice do arcano) */
  lequeCapa: [18, 17, 19],   // A Lua · A Estrela · O Sol

  /* ---------- INÍCIO ---------- */
  hero: {
    eyebrow: 'Tarô e Baralho Cigano · Ao Vivo',
    titulo: 'Os guias falam.<br>Eu <em>traduzo</em>.',
    subtitulo: 'Leituras em tempo real. Você traz a pergunta, as cartas fazem o resto.',
    ctaPrimario: 'Ver as leituras',
    ctaSecundario: 'Agendar',
    marcas: [
      { num: '78',   lbl: 'Cartas' },
      { num: '24h',  lbl: 'Resposta' },
      { num: '100%', lbl: 'Sigiloso' },
    ],
  },

  /* ---------- SOBRE ---------- */
  sobre: {
    eyebrow: 'Quem lê as cartas',
    titulo: 'Prazer, eu sou a Debs',
    paragrafos: [
      'Não leio futuro fechado. Abro o baralho com você, em tempo real, e mostro o que está em jogo agora: os movimentos, os medos, as portas que você ainda não viu.',
      'Trabalho com Tarô e Baralho Cigano. Atendo online, ao vivo, com hora marcada. A decisão continua sendo sua.',
    ],
    // Foto tratada a partir de assets/debora-original.jpg
    // (recorte 3:4, nitidez e gradação para a paleta do site)
    foto:      'assets/debora.jpg',
    fotoWebp:  'assets/debora.webp',
    fotoMini:  'assets/debora@450.jpg',
    fotoAlt:   'Debs, cartomante — Tarô e Baralho Cigano',
    pilares: [
      { titulo: 'Ética',         texto: 'Não leio terceiros sem consentimento.',      icone: 'balanca' },
      { titulo: 'Sigilo',        texto: 'O que é dito na leitura fica na leitura.',   icone: 'cadeado' },
      { titulo: 'Acolhimento',   texto: 'Chegue como estiver.',    icone: 'coracao' },
      { titulo: 'Livre-arbítrio',texto: 'As cartas mostram caminhos. A escolha é sua.', icone: 'chave' },
    ],
  },

  /* ---------- LEITURAS: preços + jornada ---------- */
  servicos: {
    eyebrow: 'Tabela de preços',
    titulo: 'Escolha o seu oráculo',
    subtitulo: 'Todas as leituras são feitas em tempo real. Pagamento via Pix antes da tiragem.',
    itens: [
      {
        id: 'simples', nome: 'Simples', acento: 'rosa', destaque: false,
        descricao: 'Respostas diretas, ao vivo.',
        paraQuem: 'Para uma dúvida pontual e direta.',
        duracao: 'Em tempo real',
        linhas: [
          { label: '1 pergunta',           valor: 'R$ 15,00' },
          { label: '3 perguntas',          valor: 'R$ 35,00' },
          { label: 'Acima de 5 perguntas', valor: 'R$ 10,00 cada' },
        ],
      },
      {
        id: 'completas', nome: 'Completas', acento: 'ouro', destaque: true, selo: 'Mais procurada',
        descricao: 'Leitura aprofundada ao vivo, com Tarô ou Baralho Cigano.',
        paraQuem: 'Para decisão importante, quando o porquê pesa.',
        duracao: 'Em tempo real',
        linhas: [
          { label: '1 pergunta',           valor: 'R$ 30,00' },
          { label: '3 perguntas',          valor: 'R$ 75,00' },
          { label: 'Acima de 5 perguntas', valor: 'R$ 25,00 cada' },
        ],
      },
      {
        id: 'hora', nome: 'Por Hora', acento: 'lavanda', destaque: false,
        descricao: 'Consulta ao vivo, conversa aberta — Tarô ou Baralho Cigano.',
        paraQuem: 'Quando uma pergunta puxa a outra.',
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
      { n: '01', titulo: 'Escolha o formato',   texto: 'Simples, Completas ou por hora. Tarô ou Baralho Cigano.' },
      { n: '02', titulo: 'Agende pelo WhatsApp', texto: 'Marcamos o horário que funcione pra você.' },
      { n: '03', titulo: 'Eu abro as cartas ao vivo', texto: 'Tiragem em tempo real, com a sua energia presente.' },
      { n: '04', titulo: 'Você acompanha tudo',  texto: 'Conversa ao vivo com a foto da tiragem.' },
    ],
  },

  /* ---------- CARTA DO DIA ---------- */
  carta: {
    eyebrow: 'Mini-oráculo · Grátis',
    titulo: 'Sua carta de hoje',
    subtitulo: 'Uma carta por dia. A sua vale até a meia-noite.',
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
      { p: 'E se vier uma resposta ruim?', r: 'Eu conto o que a carta mostra, com cuidado no jeito de falar. Nunca uso o Tarô para assustar ninguém. E carta difícil quase sempre vem junto com um caminho de saída.' },
      { p: 'Nunca fiz leitura. Como começo?', r: 'Me chama no WhatsApp e conversa comigo antes. Ajudo você a formular a pergunta, que é metade do trabalho. Se preferir testar, uma pergunta Simples custa R$ 15,00.' },
      { p: 'As leituras são ao vivo mesmo?', r: 'Sim! Todas as leituras são feitas em tempo real. Marcamos um horário e eu abro as cartas com você presente.' },
      { p: 'Qual a diferença entre Tarô e Baralho Cigano?', r: 'O Tarô trabalha com 78 cartas e traz camadas mais profundas. O Baralho Cigano tem 36 cartas e é mais direto, prático. Posso te ajudar a escolher.' },
      { p: 'Como funciona a leitura?', r: 'Pelo WhatsApp, ao vivo. Eu abro as cartas, mando a foto da tiragem e vamos conversando sobre o que apareceu.' },
      { p: 'Formas de pagamento?', r: 'Pix, antes da tiragem.' },
      { p: 'Posso perguntar sobre outra pessoa?', r: 'Posso ler a sua relação com ela. A vida íntima de quem não pediu leitura eu não abro.' },
      { p: 'O Tarô prevê doença ou morte?', r: 'Não faço esse tipo de leitura. Para saúde, procure um médico.' },
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
