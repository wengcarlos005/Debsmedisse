/* ============================================================
   CONFIG — Tudo que a Debs precisa editar está NESTE arquivo.
   Nome, telefone, preços, textos, depoimentos e FAQ.
   Nenhum outro arquivo precisa ser tocado para trocar conteúdo.
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
     Formato do WhatsApp: código do país + DDD + número, só dígitos. */
  whatsapp: {
    numero: '5511941723682',
    exibicao: '+55 (11) 94172-3682',
    // Mensagem do botão flutuante
    msgPadrao: 'Olá, Debs! Vim pelo site e gostaria de saber mais sobre as leituras. ✨',
    // Mensagem do CTA do hero
    msgHero: 'Olá, Debs! Vim pelo site e gostaria de agendar uma leitura de Tarô.',
    // Mensagem do CTA da carta do dia
    msgCartaDoDia: 'Olá, Debs! Tirei minha carta do dia no site e gostaria de uma leitura completa.',
  },

  /* ---------- HERO ---------- */
  hero: {
    eyebrow: 'Leituras de Tarô · Consultas online',
    titulo: 'Os guias falam.<br>Eu <em>traduzo</em>.',
    subtitulo:
      'Um espaço seguro para você ouvir o que já sabe por dentro. Leituras de Tarô feitas com escuta, ética e zero julgamento — no seu tempo, de onde você estiver.',
    ctaPrimario: 'Conheça os Oráculos',
    ctaSecundario: 'Agendar Leitura',
  },

  /* ---------- SOBRE ---------- */
  sobre: {
    eyebrow: 'Quem conduz a leitura',
    titulo: 'Prazer, eu sou a Debs',
    paragrafos: [
      'Sou cartomante e leitora de Tarô. Meu trabalho não é prever um futuro fechado — é abrir o baralho junto com você e mostrar o que está em jogo agora: os movimentos, os medos, as portas que você ainda não viu.',
      'Atendo online, com hora marcada, em conversa direta e sem enrolação. Você traz a pergunta, eu trago a leitura — e a decisão continua sendo inteiramente sua.',
    ],
    // Troque por uma foto real: coloque o arquivo em assets/ e aponte aqui.
    // Ex.: foto: 'assets/debs.jpg'
    foto: null,
    fotoAlt: 'Debs, cartomante e leitora de Tarô',
    pilares: [
      {
        titulo: 'Ética',
        texto: 'Não leio terceiros sem consentimento, não faço previsão de morte, doença ou gravidez.',
        icone: 'balanca',
      },
      {
        titulo: 'Sigilo',
        texto: 'O que é dito na leitura fica na leitura. Sempre. Sem exceção.',
        icone: 'cadeado',
      },
      {
        titulo: 'Acolhimento',
        texto: 'Você não precisa se explicar nem se justificar. Chegue como estiver.',
        icone: 'coracao',
      },
      {
        titulo: 'Livre-arbítrio',
        texto: 'As cartas mostram caminhos, não sentenças. A escolha final é sempre sua.',
        icone: 'chave',
      },
    ],
  },

  /* ---------- JORNADA / COMO FUNCIONA ---------- */
  jornada: {
    eyebrow: 'Como funciona',
    titulo: 'A jornada da sua leitura',
    subtitulo: 'Do primeiro "oi" até a resposta na sua mão — quatro passos, sem mistério.',
    passos: [
      {
        n: '01',
        titulo: 'Escolha o formato',
        texto: 'Perguntas Simples, Completas ou consulta por hora. Se não souber qual, me chama que eu te ajudo a decidir.',
      },
      {
        n: '02',
        titulo: 'Envie suas perguntas',
        texto: 'Pelo WhatsApp, no seu tempo. Quanto mais específica a pergunta, mais precisa a leitura.',
      },
      {
        n: '03',
        titulo: 'Eu abro as cartas',
        texto: 'Faço a tiragem em silêncio, com sua energia em mente, e interpreto carta por carta.',
      },
      {
        n: '04',
        titulo: 'Você recebe a leitura',
        texto: 'Em áudio ou texto, com a foto da tiragem. Dúvidas sobre o que veio? Pode perguntar.',
      },
    ],
  },

  /* ---------- SERVIÇOS E PREÇOS ----------
     Tabela real da @debsmedisse (destaque de stories "Tabela de Preços"). */
  servicos: {
    eyebrow: 'Tabela de preços',
    titulo: 'Escolha o seu oráculo',
    subtitulo: 'Três formatos de leitura. Pagamento via Pix antes da tiragem.',
    itens: [
      {
        id: 'simples',
        nome: 'Simples',
        descricao: 'Respostas objetivas e diretas ao ponto. Ideal para dúvidas pontuais do dia a dia.',
        duracao: 'Resposta em até 24h',
        destaque: false,
        acento: 'rosa',
        linhas: [
          { label: '1 pergunta',            valor: 'R$ 15,00' },
          { label: '3 perguntas',           valor: 'R$ 35,00' },
          { label: 'Acima de 5 perguntas',  valor: 'R$ 10,00 cada' },
        ],
      },
      {
        id: 'completas',
        nome: 'Completas',
        descricao: 'Leitura aprofundada de cada pergunta: contexto, obstáculos, conselho e desdobramentos.',
        duracao: 'Resposta em até 24h',
        destaque: true,
        selo: 'Mais procurada',
        acento: 'ouro',
        linhas: [
          { label: '1 pergunta',            valor: 'R$ 30,00' },
          { label: '3 perguntas',           valor: 'R$ 75,00' },
          { label: 'Acima de 5 perguntas',  valor: 'R$ 25,00 cada' },
        ],
      },
      {
        id: 'hora',
        nome: 'Por Hora',
        descricao: 'Consulta ao vivo, em conversa aberta. Você pergunta à vontade enquanto a mesa estiver posta.',
        duracao: 'Ao vivo, com hora marcada',
        destaque: false,
        acento: 'lavanda',
        obs: 'Sem limite de perguntas',
        linhas: [
          { label: '1 hora',           valor: 'R$ 100,00' },
          { label: '2 horas',          valor: 'R$ 150,00' },
          { label: 'Acima de 3 horas', valor: '+ R$ 30,00 / hora' },
        ],
      },
    ],
  },

  /* ---------- DEPOIMENTOS ----------
     ⚠️⚠️⚠️  ATENÇÃO — LEIA ANTES DE PUBLICAR  ⚠️⚠️⚠️
     Os depoimentos abaixo são EXEMPLOS FICTÍCIOS, escritos apenas para
     você ver como a seção fica montada. Eles NÃO são clientes reais.

     TROQUE TODOS por depoimentos verdadeiros antes de colocar o site no ar.
     Publicar avaliação inventada como se fosse real é propaganda enganosa
     (CDC art. 37) e destrói a confiança que esse trabalho depende.

     Se ainda não tiver depoimentos, o mais honesto é APAGAR a lista
     (deixe `lista: []`) — a seção some sozinha do site.
     ⚠️⚠️⚠️ ------------------------------------ ⚠️⚠️⚠️ */
  depoimentos: {
    eyebrow: 'Quem já sentou à mesa',
    titulo: 'Palavras de quem consultou',
    exemplo: true, // ← deixe `true` enquanto forem exemplos; mude para `false` com os reais
    lista: [
      {
        texto: 'Cheguei perdida sobre uma decisão de trabalho e saí com clareza. A Debs não enfeita nem assusta: fala o que a carta mostra, com cuidado.',
        autor: 'M. R.',
        contexto: 'Leitura Completa · 3 perguntas',
      },
      {
        texto: 'O que mais me marcou foi a escuta. Não me senti julgada em nenhum momento, e isso fez toda diferença para eu conseguir perguntar de verdade.',
        autor: 'A. L.',
        contexto: 'Consulta por hora',
      },
      {
        texto: 'Fiz uma pergunta simples só para testar e a resposta foi tão certeira que voltei na semana seguinte para uma leitura completa.',
        autor: 'J. P.',
        contexto: 'Leitura Simples · 1 pergunta',
      },
      {
        texto: 'Ela explica o significado de cada carta, então você entende de onde veio a leitura. Não é achismo, tem método.',
        autor: 'C. S.',
        contexto: 'Leitura Completa · 5 perguntas',
      },
    ],
  },

  /* ---------- AGENDAMENTO ---------- */
  agendamento: {
    eyebrow: 'Vamos abrir as cartas',
    titulo: 'Agende sua leitura',
    subtitulo:
      'Preencha abaixo e eu recebo tudo organizado no WhatsApp. Leva menos de um minuto.',
    temas: [
      'Amor e relacionamentos',
      'Trabalho e carreira',
      'Dinheiro e prosperidade',
      'Família',
      'Espiritualidade',
      'Decisão específica',
      'Panorama geral do momento',
      'Outro',
    ],
    horarios: ['Manhã', 'Tarde', 'Noite', 'Tanto faz'],
  },

  /* ---------- FAQ ---------- */
  faq: {
    eyebrow: 'Antes de perguntar',
    titulo: 'Dúvidas frequentes',
    itens: [
      {
        p: 'Preciso estar presente durante a tiragem?',
        r: 'Nas leituras Simples e Completas, não. Você manda as perguntas, eu faço a tiragem e te envio o resultado. Na consulta por hora sim: é ao vivo, em conversa.',
      },
      {
        p: 'Como eu recebo a leitura?',
        r: 'Pelo WhatsApp, em áudio ou texto (você escolhe), sempre acompanhada da foto da tiragem para você ver as cartas que saíram.',
      },
      {
        p: 'Quais as formas de pagamento?',
        r: 'Pix, antes da tiragem. Depois de confirmado, entro na leitura e te retorno dentro do prazo combinado.',
      },
      {
        p: 'Posso perguntar sobre outra pessoa?',
        r: 'Posso ler a sua relação com essa pessoa e o que ela move em você. O que não faço é ler a vida íntima de terceiros que não pediram — isso é invasão, não leitura.',
      },
      {
        p: 'O Tarô prevê doença, morte ou gravidez?',
        r: 'Não, e eu não faço esse tipo de leitura. Para saúde, procure um médico; para questões jurídicas, um advogado. O Tarô é ferramenta de autoconhecimento, não de diagnóstico.',
      },
      {
        p: 'E se a resposta não for a que eu queria?',
        r: 'Ela vem do mesmo jeito, com cuidado. Meu compromisso é com a verdade da tiragem, não com o que é confortável — mas nunca com crueldade.',
      },
      {
        p: 'Atende menor de idade?',
        r: 'Não. Atendimento exclusivo para maiores de 18 anos.',
      },
    ],
  },

  /* ---------- RODAPÉ ---------- */
  rodape: {
    frase: 'Que a sua próxima carta venha leve.',
    avisoLegal:
      'As leituras de Tarô têm finalidade de autoconhecimento, reflexão e orientação pessoal. Não constituem e não substituem acompanhamento médico, psicológico, jurídico ou financeiro. As decisões e seus resultados são de responsabilidade exclusiva do consulente. Atendimento para maiores de 18 anos.',
    links: [
      { label: 'Sobre mim',    href: '#sobre' },
      { label: 'Jornada',      href: '#jornada' },
      { label: 'Serviços',     href: '#servicos' },
      { label: 'Depoimentos',  href: '#depoimentos' },
      { label: 'Dúvidas',      href: '#faq' },
      { label: 'Agendamento',  href: '#agendamento' },
    ],
  },

  /* ---------- NAVEGAÇÃO ---------- */
  nav: [
    { label: 'Sobre Mim',   href: '#sobre' },
    { label: 'Jornada',     href: '#jornada' },
    { label: 'Serviços',    href: '#servicos' },
    { label: 'Depoimentos', href: '#depoimentos' },
    { label: 'Dúvidas',     href: '#faq' },
  ],
};

/* Monta um link wa.me com a mensagem já codificada. */
function linkWhats(mensagem) {
  return `https://wa.me/${CONFIG.whatsapp.numero}?text=${encodeURIComponent(mensagem)}`;
}
