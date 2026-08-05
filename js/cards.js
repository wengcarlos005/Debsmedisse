/* ============================================================
   BARALHO COMPLETO: 78 cartas (22 Arcanos Maiores + 56 Menores).

   A ARTE das cartas é o baralho Rider-Waite-Smith (1909),
   ilustrado por Pamela Colman Smith — obra em DOMÍNIO PÚBLICO,
   obtida do Wikimedia Commons e otimizada em assets/cartas/.
   Uso livre, inclusive comercial. Nada é gerado por IA aqui.

   O site apenas emoldura essa arte com a identidade da Debs
   (moldura navy + dourada e fita com o nome em português).
   ============================================================ */

const ARCANOS = [
  {
    n: 0, romano: '0', nome: 'O Louco',
    palavras: ['recomeço', 'fé', 'salto'],
    mensagem: 'Um caminho novo se abre e você ainda não vê onde ele termina. Vá assim mesmo.',
  },
  {
    n: 1, romano: 'I', nome: 'O Mago',
    palavras: ['poder', 'ação', 'foco'],
    mensagem: 'Você já tem em mãos tudo de que precisa. A peça que você está esperando nunca faltou.',
  },
  {
    n: 2, romano: 'II', nome: 'A Sacerdotisa',
    palavras: ['intuição', 'silêncio', 'mistério'],
    mensagem: 'Hoje a resposta não vem de fora. Baixe o volume do mundo e escute o que você já sabe.',
  },
  {
    n: 3, romano: 'III', nome: 'A Imperatriz',
    palavras: ['abundância', 'cuidado', 'criação'],
    mensagem: 'Algo que você plantou está pronto para colher. Aceite sem achar que precisa merecer antes.',
  },
  {
    n: 4, romano: 'IV', nome: 'O Imperador',
    palavras: ['estrutura', 'limite', 'autoridade'],
    mensagem: 'Sem base firme nada se sustenta. Hoje é dia de colocar regra e prazo, inclusive em você.',
  },
  {
    n: 5, romano: 'V', nome: 'O Hierofante',
    palavras: ['tradição', 'guia', 'aprendizado'],
    mensagem: 'Você não precisa descobrir tudo sozinha. Alguém já andou esse caminho. Pergunte.',
  },
  {
    n: 6, romano: 'VI', nome: 'Os Amantes',
    palavras: ['escolha', 'união', 'valores'],
    mensagem: 'Existe uma escolha que você vem adiando. Repare em qual das opções te deixa maior.',
  },
  {
    n: 7, romano: 'VII', nome: 'O Carro',
    palavras: ['avanço', 'controle', 'vitória'],
    mensagem: 'Duas forças puxam você para lados opostos. Segure as rédeas das duas.',
  },
  {
    n: 8, romano: 'VIII', nome: 'A Força',
    palavras: ['coragem', 'paciência', 'domínio'],
    mensagem: 'Firmeza com doçura resolve o que a bruteza não resolve. Respire fundo e insista.',
  },
  {
    n: 9, romano: 'IX', nome: 'O Eremita',
    palavras: ['pausa', 'busca', 'clareza'],
    mensagem: 'Se recolher agora vale mais que forçar. A luz que você procura é pequena e só aparece no escuro.',
  },
  {
    n: 10, romano: 'X', nome: 'A Roda da Fortuna',
    palavras: ['ciclo', 'virada', 'destino'],
    mensagem: 'O que está travado começa a girar. Roda parada não existe.',
  },
  {
    n: 11, romano: 'XI', nome: 'A Justiça',
    palavras: ['verdade', 'equilíbrio', 'consequência'],
    mensagem: 'Toda escolha cobra o seu preço. Encare os fatos como eles são.',
  },
  {
    n: 12, romano: 'XII', nome: 'O Enforcado',
    palavras: ['pausa', 'entrega', 'outro ângulo'],
    mensagem: 'Forçar não vai funcionar hoje. A saída está no ângulo que você vem recusando olhar.',
  },
  {
    n: 13, romano: 'XIII', nome: 'A Morte',
    palavras: ['fim', 'transformação', 'renascer'],
    mensagem: 'Algo precisa acabar para o resto respirar. Deixe ir o que já não te cabe.',
  },
  {
    n: 14, romano: 'XIV', nome: 'A Temperança',
    palavras: ['medida', 'calma', 'mistura'],
    mensagem: 'Nem tanto, nem tão pouco. Pressa aqui estraga o que já ia bem.',
  },
  {
    n: 15, romano: 'XV', nome: 'O Diabo',
    palavras: ['apego', 'padrão', 'lucidez'],
    mensagem: 'O que você chama de impossível de largar é uma corrente com folga. Olhe de perto.',
  },
  {
    n: 16, romano: 'XVI', nome: 'A Torre',
    palavras: ['ruptura', 'verdade', 'liberdade'],
    mensagem: 'O que cai hoje estava construído em terreno falso. Dói, e te devolve o chão.',
  },
  {
    n: 17, romano: 'XVII', nome: 'A Estrela',
    palavras: ['esperança', 'cura', 'fé'],
    mensagem: 'Depois do estrago vem o silêncio bom. Você está sendo recomposta aos poucos.',
  },
  {
    n: 18, romano: 'XVIII', nome: 'A Lua',
    palavras: ['ilusão', 'medo', 'sonho'],
    mensagem: 'Nem tudo que você está vendo é o que parece, inclusive o medo. Espere clarear antes de decidir.',
  },
  {
    n: 19, romano: 'XIX', nome: 'O Sol',
    palavras: ['alegria', 'clareza', 'sucesso'],
    mensagem: 'A névoa levantou. Desconfie menos da própria felicidade.',
  },
  {
    n: 20, romano: 'XX', nome: 'O Julgamento',
    palavras: ['chamado', 'perdão', 'despertar'],
    mensagem: 'Um capítulo antigo pede fechamento. Olhe para trás uma última vez e se perdoe.',
  },
  {
    n: 21, romano: 'XXI', nome: 'O Mundo',
    palavras: ['conclusão', 'inteireza', 'conquista'],
    mensagem: 'Um ciclo se completa e você chega inteira do outro lado. Comemore antes do próximo.',
  },
];

/* ============================================================
   ARCANOS MENORES — 56 cartas em 4 naipes de 14.
   Copas (emoção) · Ouros (matéria) · Espadas (mente) · Paus (ação)
   O campo `selo` é o rótulo impresso no topo da carta,
   equivalente ao numeral romano dos Maiores.
   ============================================================ */
const MENORES = [

  /* ---------- COPAS ---------- */
  { n: 22, naipe: 'copas', selo: 'Copas', nome: 'Ás de Copas',
    palavras: ['afeto', 'início', 'abertura'],
    mensagem: 'Um sentimento novo bate à porta. Deixe entrar antes de perguntar se vai durar.' },
  { n: 23, naipe: 'copas', selo: 'Copas', nome: 'Dois de Copas',
    palavras: ['parceria', 'atração', 'acordo'],
    mensagem: 'Duas pessoas se encontram de verdade. Vale cuidar do que está nascendo aqui.' },
  { n: 24, naipe: 'copas', selo: 'Copas', nome: 'Três de Copas',
    palavras: ['celebração', 'amizade', 'alívio'],
    mensagem: 'Chame quem te quer bem. O que você viveu merece ser comemorado em voz alta.' },
  { n: 25, naipe: 'copas', selo: 'Copas', nome: 'Quatro de Copas',
    palavras: ['tédio', 'recusa', 'apatia'],
    mensagem: 'Tem uma oferta na sua frente que você nem olhou direito. Levante os olhos.' },
  { n: 26, naipe: 'copas', selo: 'Copas', nome: 'Cinco de Copas',
    palavras: ['luto', 'perda', 'saudade'],
    mensagem: 'Você está contando o que caiu e esquecendo o que ficou em pé. Olhe para trás de você.' },
  { n: 27, naipe: 'copas', selo: 'Copas', nome: 'Seis de Copas',
    palavras: ['memória', 'infância', 'doçura'],
    mensagem: 'Algo do passado volta com gosto bom. Aproveite sem tentar morar lá.' },
  { n: 28, naipe: 'copas', selo: 'Copas', nome: 'Sete de Copas',
    palavras: ['opções', 'ilusão', 'escolha'],
    mensagem: 'Tanta possibilidade que nenhuma vira decisão. Escolha uma e comece.' },
  { n: 29, naipe: 'copas', selo: 'Copas', nome: 'Oito de Copas',
    palavras: ['partida', 'desapego', 'busca'],
    mensagem: 'Você já tirou daqui o que tinha para tirar. Pode seguir sem culpa.' },
  { n: 30, naipe: 'copas', selo: 'Copas', nome: 'Nove de Copas',
    palavras: ['desejo', 'satisfação', 'conquista'],
    mensagem: 'O que você pediu está chegando. Receba de peito aberto.' },
  { n: 31, naipe: 'copas', selo: 'Copas', nome: 'Dez de Copas',
    palavras: ['harmonia', 'família', 'plenitude'],
    mensagem: 'A paz que você procurava está mais perto do que imagina. Provavelmente dentro de casa.' },
  { n: 32, naipe: 'copas', selo: 'Copas', nome: 'Valete de Copas',
    palavras: ['recado', 'novidade', 'ternura'],
    mensagem: 'Chega uma notícia afetuosa. Responda com o mesmo cuidado.' },
  { n: 33, naipe: 'copas', selo: 'Copas', nome: 'Cavaleiro de Copas',
    palavras: ['convite', 'romance', 'proposta'],
    mensagem: 'Alguém se aproxima com uma proposta sincera. Escute antes de julgar.' },
  { n: 34, naipe: 'copas', selo: 'Copas', nome: 'Rainha de Copas',
    palavras: ['intuição', 'acolhimento', 'empatia'],
    mensagem: 'Sua sensibilidade está afiada hoje. Confie no que você sentiu de primeira.' },
  { n: 35, naipe: 'copas', selo: 'Copas', nome: 'Rei de Copas',
    palavras: ['maturidade', 'calma', 'equilíbrio'],
    mensagem: 'Dá para sentir tudo sem se afogar. Segure o próprio leme.' },

  /* ---------- OUROS ---------- */
  { n: 36, naipe: 'ouros', selo: 'Ouros', nome: 'Ás de Ouros',
    palavras: ['oportunidade', 'semente', 'recurso'],
    mensagem: 'Uma porta material se abre. Pequena, mas real.' },
  { n: 37, naipe: 'ouros', selo: 'Ouros', nome: 'Dois de Ouros',
    palavras: ['equilíbrio', 'malabarismo', 'fluxo'],
    mensagem: 'Você está segurando muita coisa ao mesmo tempo. Está dando conta, só não force mais.' },
  { n: 38, naipe: 'ouros', selo: 'Ouros', nome: 'Três de Ouros',
    palavras: ['ofício', 'equipe', 'reconhecimento'],
    mensagem: 'Seu trabalho começa a ser notado. Aceite ajuda para ir além.' },
  { n: 39, naipe: 'ouros', selo: 'Ouros', nome: 'Quatro de Ouros',
    palavras: ['retenção', 'apego', 'segurança'],
    mensagem: 'Segurar demais também trava. Veja o que dá para soltar sem risco.' },
  { n: 40, naipe: 'ouros', selo: 'Ouros', nome: 'Cinco de Ouros',
    palavras: ['falta', 'exclusão', 'frio'],
    mensagem: 'A ajuda existe, você só ainda não pediu. Bater na porta não diminui ninguém.' },
  { n: 41, naipe: 'ouros', selo: 'Ouros', nome: 'Seis de Ouros',
    palavras: ['troca', 'generosidade', 'justiça'],
    mensagem: 'Dar e receber precisam se equilibrar. Repare de que lado você está sempre.' },
  { n: 42, naipe: 'ouros', selo: 'Ouros', nome: 'Sete de Ouros',
    palavras: ['espera', 'avaliação', 'paciência'],
    mensagem: 'A colheita ainda não chegou. Continue regando.' },
  { n: 43, naipe: 'ouros', selo: 'Ouros', nome: 'Oito de Ouros',
    palavras: ['dedicação', 'prática', 'esmero'],
    mensagem: 'Repetição vira habilidade. Insista no detalhe.' },
  { n: 44, naipe: 'ouros', selo: 'Ouros', nome: 'Nove de Ouros',
    palavras: ['autonomia', 'conforto', 'mérito'],
    mensagem: 'Você construiu o próprio chão. Pode descansar nele.' },
  { n: 45, naipe: 'ouros', selo: 'Ouros', nome: 'Dez de Ouros',
    palavras: ['patrimônio', 'legado', 'raiz'],
    mensagem: 'O que você faz hoje sustenta gente além de você.' },
  { n: 46, naipe: 'ouros', selo: 'Ouros', nome: 'Valete de Ouros',
    palavras: ['estudo', 'começo', 'curiosidade'],
    mensagem: 'Bom momento para aprender algo prático. Comece pelo básico.' },
  { n: 47, naipe: 'ouros', selo: 'Ouros', nome: 'Cavaleiro de Ouros',
    palavras: ['constância', 'método', 'firmeza'],
    mensagem: 'Devagar e sempre resolve isso. Pressa aqui só atrapalha.' },
  { n: 48, naipe: 'ouros', selo: 'Ouros', nome: 'Rainha de Ouros',
    palavras: ['cuidado', 'prosperidade', 'chão'],
    mensagem: 'Cuide do corpo e da casa. O resto se organiza a partir daí.' },
  { n: 49, naipe: 'ouros', selo: 'Ouros', nome: 'Rei de Ouros',
    palavras: ['solidez', 'domínio', 'provisão'],
    mensagem: 'Você tem mais controle da situação do que está admitindo.' },

  /* ---------- ESPADAS ---------- */
  { n: 50, naipe: 'espadas', selo: 'Espadas', nome: 'Ás de Espadas',
    palavras: ['clareza', 'verdade', 'corte'],
    mensagem: 'A confusão acaba hoje. A verdade aparece limpa, mesmo que incomode.' },
  { n: 51, naipe: 'espadas', selo: 'Espadas', nome: 'Dois de Espadas',
    palavras: ['impasse', 'recusa', 'pausa'],
    mensagem: 'Você está de olhos fechados para não ter que decidir. Abra.' },
  { n: 52, naipe: 'espadas', selo: 'Espadas', nome: 'Três de Espadas',
    palavras: ['mágoa', 'ruptura', 'dor'],
    mensagem: 'Doeu, e não adianta fingir que não. Chore o que tem que chorar.' },
  { n: 53, naipe: 'espadas', selo: 'Espadas', nome: 'Quatro de Espadas',
    palavras: ['repouso', 'recuperação', 'silêncio'],
    mensagem: 'Pare. Seu corpo está pedindo trégua há um tempo.' },
  { n: 54, naipe: 'espadas', selo: 'Espadas', nome: 'Cinco de Espadas',
    palavras: ['conflito', 'orgulho', 'custo'],
    mensagem: 'Ganhar essa discussão vai te custar caro. Pense se vale.' },
  { n: 55, naipe: 'espadas', selo: 'Espadas', nome: 'Seis de Espadas',
    palavras: ['travessia', 'mudança', 'alívio'],
    mensagem: 'Você está saindo de águas revoltas. Aguenta mais um pouco.' },
  { n: 56, naipe: 'espadas', selo: 'Espadas', nome: 'Sete de Espadas',
    palavras: ['estratégia', 'cautela', 'segredo'],
    mensagem: 'Nem todo mundo está jogando limpo. Confira antes de confiar.' },
  { n: 57, naipe: 'espadas', selo: 'Espadas', nome: 'Oito de Espadas',
    palavras: ['limitação', 'medo', 'saída'],
    mensagem: 'A amarra que te prende está mais frouxa do que parece. Tente se mexer.' },
  { n: 58, naipe: 'espadas', selo: 'Espadas', nome: 'Nove de Espadas',
    palavras: ['angústia', 'insônia', 'medo'],
    mensagem: 'O que te tira o sono é maior de madrugada. De manhã encolhe.' },
  { n: 59, naipe: 'espadas', selo: 'Espadas', nome: 'Dez de Espadas',
    palavras: ['fim', 'fundo', 'recomeço'],
    mensagem: 'Chegou ao fundo. Daqui o único caminho sobe.' },
  { n: 60, naipe: 'espadas', selo: 'Espadas', nome: 'Valete de Espadas',
    palavras: ['vigilância', 'curiosidade', 'atenção'],
    mensagem: 'Preste atenção no que estão dizendo em volta. Tem informação útil ali.' },
  { n: 61, naipe: 'espadas', selo: 'Espadas', nome: 'Cavaleiro de Espadas',
    palavras: ['pressa', 'impulso', 'ímpeto'],
    mensagem: 'Você quer resolver tudo agora. Respire antes de disparar.' },
  { n: 62, naipe: 'espadas', selo: 'Espadas', nome: 'Rainha de Espadas',
    palavras: ['lucidez', 'franqueza', 'limite'],
    mensagem: 'Fale a verdade com elegância. Dá para ser honesta sem ser dura.' },
  { n: 63, naipe: 'espadas', selo: 'Espadas', nome: 'Rei de Espadas',
    palavras: ['razão', 'julgamento', 'autoridade'],
    mensagem: 'Decida com a cabeça fria. Hoje a emoção está te enganando.' },

  /* ---------- PAUS ---------- */
  { n: 64, naipe: 'paus', selo: 'Paus', nome: 'Ás de Paus',
    palavras: ['faísca', 'impulso', 'criação'],
    mensagem: 'Uma ideia acende. Anote antes que apague.' },
  { n: 65, naipe: 'paus', selo: 'Paus', nome: 'Dois de Paus',
    palavras: ['planejamento', 'horizonte', 'escolha'],
    mensagem: 'Você já sabe para onde quer ir. Falta marcar a data.' },
  { n: 66, naipe: 'paus', selo: 'Paus', nome: 'Três de Paus',
    palavras: ['expansão', 'espera', 'visão'],
    mensagem: 'O que você lançou está a caminho de volta. Confie no prazo.' },
  { n: 67, naipe: 'paus', selo: 'Paus', nome: 'Quatro de Paus',
    palavras: ['celebração', 'casa', 'estabilidade'],
    mensagem: 'Um ciclo se firma. Comemore em casa, com quem importa.' },
  { n: 68, naipe: 'paus', selo: 'Paus', nome: 'Cinco de Paus',
    palavras: ['atrito', 'competição', 'ruído'],
    mensagem: 'Muita gente falando ao mesmo tempo. Escolha uma briga só.' },
  { n: 69, naipe: 'paus', selo: 'Paus', nome: 'Seis de Paus',
    palavras: ['vitória', 'reconhecimento', 'orgulho'],
    mensagem: 'Você venceu essa. Deixe se elogiar.' },
  { n: 70, naipe: 'paus', selo: 'Paus', nome: 'Sete de Paus',
    palavras: ['defesa', 'posição', 'coragem'],
    mensagem: 'Alguém está testando o seu limite. Segure o terreno.' },
  { n: 71, naipe: 'paus', selo: 'Paus', nome: 'Oito de Paus',
    palavras: ['velocidade', 'notícia', 'movimento'],
    mensagem: 'As coisas vão acelerar. Prepare-se para responder rápido.' },
  { n: 72, naipe: 'paus', selo: 'Paus', nome: 'Nove de Paus',
    palavras: ['resistência', 'cansaço', 'quase'],
    mensagem: 'Você está cansada e quase lá. Não largue agora.' },
  { n: 73, naipe: 'paus', selo: 'Paus', nome: 'Dez de Paus',
    palavras: ['sobrecarga', 'peso', 'delegar'],
    mensagem: 'Você pegou peso demais. Coloque alguma coisa no chão.' },
  { n: 74, naipe: 'paus', selo: 'Paus', nome: 'Valete de Paus',
    palavras: ['entusiasmo', 'novidade', 'coragem'],
    mensagem: 'Bateu vontade de mudar tudo. Comece por uma coisa.' },
  { n: 75, naipe: 'paus', selo: 'Paus', nome: 'Cavaleiro de Paus',
    palavras: ['aventura', 'ímpeto', 'partida'],
    mensagem: 'Dá vontade de sair correndo atrás disso. Vá, mas leve mapa.' },
  { n: 76, naipe: 'paus', selo: 'Paus', nome: 'Rainha de Paus',
    palavras: ['confiança', 'magnetismo', 'presença'],
    mensagem: 'Sua presença abre portas hoje. Ocupe o espaço.' },
  { n: 77, naipe: 'paus', selo: 'Paus', nome: 'Rei de Paus',
    palavras: ['liderança', 'visão', 'comando'],
    mensagem: 'Assuma o leme. Estão esperando você decidir.' },
];

/* Baralho completo usado pela Carta do Dia */
const BARALHO = ARCANOS.concat(MENORES);

/* Caminho da arte de cada arcano (00.jpg … 21.jpg) */
ARCANOS.forEach((a) => {
  a.img = `assets/cartas/${String(a.n).padStart(2, '0')}.jpg`;
});

// menores: copas-01.jpg … paus-14.jpg
MENORES.forEach((c, i) => {
  const posicao = (i % 14) + 1;
  c.img = `assets/cartas/${c.naipe}-${String(posicao).padStart(2, '0')}.jpg`;
});

/* Proporção da carta: 300 × 520 (a arte RWS é 440×758) */
const CARTA_W = 300;
const CARTA_H = 520;

/* ============================================================
   FRENTE — arte real emoldurada na identidade da Debs
   ============================================================ */
function cartaSVG(arc) {
  return `
<svg viewBox="0 0 ${CARTA_W} ${CARTA_H}" class="carta-svg" role="img"
     aria-label="${arc.nome}">
  <defs>
    <linearGradient id="fFundo${arc.n}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#242A5E"/><stop offset="55%" stop-color="#171C42"/>
      <stop offset="100%" stop-color="#101534"/>
    </linearGradient>
    <linearGradient id="fOuro${arc.n}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F0D98C"/><stop offset="45%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#9C801F"/>
    </linearGradient>
    <clipPath id="fArte${arc.n}"><rect x="24" y="56" width="252" height="434" rx="3"/></clipPath>
  </defs>

  <rect width="${CARTA_W}" height="${CARTA_H}" rx="14" fill="url(#fFundo${arc.n})"/>
  <rect x="8" y="8" width="284" height="504" rx="9" fill="none" stroke="url(#fOuro${arc.n})" stroke-width="2"/>
  <rect x="15" y="15" width="270" height="490" rx="6" fill="none" stroke="#D4AF37" stroke-width=".6" opacity=".5"/>

  <!-- arte do baralho Rider-Waite-Smith (domínio público) -->
  <image href="${arc.img}" x="24" y="56" width="252" height="434"
         preserveAspectRatio="xMidYMid slice" clip-path="url(#fArte${arc.n})"
         loading="lazy" decoding="async"/>
  <rect x="24" y="56" width="252" height="434" rx="3" fill="none" stroke="#D4AF37" stroke-width="1.2" opacity=".9"/>

  <!-- numeral romano no topo -->
  <text x="150" y="42" text-anchor="middle" fill="#F0D98C"
        font-family="Cinzel, Georgia, serif" font-size="15" letter-spacing="4">${arc.selo || arc.romano}</text>
  <g stroke="#D4AF37" stroke-width=".9" opacity=".6" stroke-linecap="round">
    <path d="M40 37h58M202 37h58"/>
    <path d="M104 37l5-5 5 5-5 5zM186 37l5-5 5 5-5 5z" fill="none"/>
  </g>

  <!-- fita com o nome, sobreposta ao pé da arte -->
  <g>
    <path d="M40 458h220l-13 16 13 16H40l13-16z" fill="#FBF7F2" stroke="#D4AF37" stroke-width="1.1"/>
    <path d="M40 458l-15 9 15 7zM260 458l15 9-15 7z" fill="#E4DACB" stroke="#D4AF37" stroke-width="1"/>
    <text x="150" y="479" text-anchor="middle" fill="#232A55"
          font-family="Cinzel, Georgia, serif" font-size="${arc.nome.length > 16 ? 11 : 13.5}" letter-spacing="${arc.nome.length > 16 ? 1.2 : 2}">${arc.nome.toUpperCase()}</text>
  </g>

  <!-- cantos ornamentados -->
  <g stroke="#D4AF37" fill="none" stroke-width="1" opacity=".8">
    <path d="M23 38c9 0 15-6 15-15M277 38c-9 0-15-6-15-15M23 482c9 0 15 6 15 15M277 482c-9 0-15 6-15 15"/>
  </g>
</svg>`;
}

/* ============================================================
   VERSO — medalhão da marca (mesmo emblema da logo), em massa.
   Nada de fio de cabelo: formas cheias e trama de fundo para o
   miolo não ficar vazio.
   ============================================================ */
const VERSO_SVG = `
<svg viewBox="0 0 ${CARTA_W} ${CARTA_H}" class="carta-svg" aria-hidden="true">
  <defs>
    <linearGradient id="vBg" x1="0" y1="0" x2=".6" y2="1">
      <stop offset="0%"   stop-color="#2A3070"/>
      <stop offset="48%"  stop-color="#181D46"/>
      <stop offset="100%" stop-color="#0D1230"/>
    </linearGradient>
    <linearGradient id="vAu" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#F6E4A6"/>
      <stop offset="42%"  stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#8A6E18"/>
    </linearGradient>
    <radialGradient id="vHalo" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#D4AF37" stop-opacity=".28"/>
      <stop offset="100%" stop-color="#D4AF37" stop-opacity="0"/>
    </radialGradient>

    <!-- trama de losangos: preenche o miolo sem pesar -->
    <pattern id="vTrama" width="26" height="26" patternUnits="userSpaceOnUse">
      <path d="M13 1l12 12-12 12L1 13z" fill="none" stroke="#D4AF37"
            stroke-width=".55" opacity=".17"/>
      <circle cx="13" cy="13" r="1.1" fill="#D4AF37" opacity=".2"/>
    </pattern>
  </defs>

  <rect width="${CARTA_W}" height="${CARTA_H}" rx="14" fill="url(#vBg)"/>
  <rect x="20" y="20" width="260" height="480" rx="6" fill="url(#vTrama)"/>

  <!-- moldura: aro grosso + filete -->
  <rect x="9" y="9" width="282" height="502" rx="10" fill="none" stroke="url(#vAu)" stroke-width="2.6"/>
  <rect x="19" y="19" width="262" height="482" rx="5" fill="none" stroke="#D4AF37" stroke-width=".8" opacity=".45"/>

  <!-- halo atrás do medalhão -->
  <circle cx="150" cy="260" r="104" fill="url(#vHalo)"/>

  <!-- raios sólidos -->
  <g fill="url(#vAu)" opacity=".55">
    ${Array.from({ length: 16 }, (_, i) => {
      const a = (i * 360) / 16;
      return `<rect x="148.6" y="150" width="2.8" height="18" rx="1.4"
                    transform="rotate(${a} 150 260)"/>`;
    }).join('')}
  </g>

  <!-- MEDALHÃO (mesmo emblema da logo) -->
  <circle cx="150" cy="260" r="76" fill="url(#vAu)"/>
  <circle cx="150" cy="260" r="66" fill="#0F1432"/>
  <circle cx="150" cy="260" r="59" fill="none" stroke="#D4AF37" stroke-width="1" opacity=".5"/>

  <!-- lua crescente sólida -->
  <path d="M171 219a47 47 0 1 0 0 82 56 56 0 0 1 0-82z" fill="url(#vAu)"/>
  <circle cx="135" cy="245" r="4.6" fill="#0F1432" opacity=".5"/>
  <circle cx="126" cy="269" r="3.4" fill="#0F1432" opacity=".42"/>
  <circle cx="140" cy="285" r="3"   fill="#0F1432" opacity=".36"/>

  <!-- estrela do emblema -->
  <path d="M150 172l4.4 9.4 9.4 4.4-9.4 4.4-4.4 9.4-4.4-9.4-9.4-4.4 9.4-4.4z" fill="#F6E4A6"/>

  <!-- cantos com peso -->
  <g fill="url(#vAu)">
    <path d="M30 30h34v4.6H34.6V64H30z"/>
    <path d="M270 30h-34v4.6h29.4V64H270z"/>
    <path d="M30 490h34v-4.6H34.6V456H30z"/>
    <path d="M270 490h-34v-4.6h29.4V456H270z"/>
  </g>
  <g fill="#D4AF37" opacity=".65">
    <path d="M47 44l3.4 6.6L57 54l-6.6 3.4L47 64l-3.4-6.6L37 54l6.6-3.4z"/>
    <path d="M253 44l3.4 6.6L263 54l-6.6 3.4L253 64l-3.4-6.6L243 54l6.6-3.4z"/>
    <path d="M47 456l3.4 6.6L57 466l-6.6 3.4L47 476l-3.4-6.6L37 466l6.6-3.4z"/>
    <path d="M253 456l3.4 6.6L263 466l-6.6 3.4L253 476l-3.4-6.6L243 466l6.6-3.4z"/>
  </g>

  <!-- losangos sólidos no topo e no pé -->
  <g fill="url(#vAu)">
    <path d="M150 106l9 13-9 13-9-13z"/>
    <path d="M150 388l9 13-9 13-9-13z"/>
  </g>
  <g fill="#D4AF37" opacity=".5">
    <path d="M124 119l5.4 7.8-5.4 7.8-5.4-7.8zM176 119l5.4 7.8-5.4 7.8-5.4-7.8z"/>
    <path d="M124 401l5.4 7.8-5.4 7.8-5.4-7.8zM176 401l5.4 7.8-5.4 7.8-5.4-7.8z"/>
  </g>
</svg>`;
