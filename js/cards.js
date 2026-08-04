/* ============================================================
   ARCANOS MAIORES — 22 cartas da "Carta do Dia".

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
    mensagem: 'Um caminho novo se abre e você ainda não vê o fim dele. Hoje a coragem vale mais que o mapa.',
  },
  {
    n: 1, romano: 'I', nome: 'O Mago',
    palavras: ['poder', 'ação', 'foco'],
    mensagem: 'Você já tem em mãos tudo de que precisa. Pare de esperar a peça que falta — ela nunca faltou.',
  },
  {
    n: 2, romano: 'II', nome: 'A Sacerdotisa',
    palavras: ['intuição', 'silêncio', 'mistério'],
    mensagem: 'A resposta não vem de fora hoje. Baixe o volume do mundo e escute o que você já sabe.',
  },
  {
    n: 3, romano: 'III', nome: 'A Imperatriz',
    palavras: ['abundância', 'cuidado', 'criação'],
    mensagem: 'Algo que você plantou está pronto para colher. Permita-se receber sem achar que precisa merecer.',
  },
  {
    n: 4, romano: 'IV', nome: 'O Imperador',
    palavras: ['estrutura', 'limite', 'autoridade'],
    mensagem: 'Sem base firme nada se sustenta. Hoje é dia de colocar regra, prazo e limite — inclusive em você.',
  },
  {
    n: 5, romano: 'V', nome: 'O Hierofante',
    palavras: ['tradição', 'guia', 'aprendizado'],
    mensagem: 'Você não precisa descobrir tudo sozinha. Alguém já andou esse caminho — procure quem sabe.',
  },
  {
    n: 6, romano: 'VI', nome: 'Os Amantes',
    palavras: ['escolha', 'união', 'valores'],
    mensagem: 'Existe uma escolha que você vem adiando. Não é entre certo e errado — é entre o que te encolhe e o que te expande.',
  },
  {
    n: 7, romano: 'VII', nome: 'O Carro',
    palavras: ['avanço', 'controle', 'vitória'],
    mensagem: 'Duas forças puxam você para lados diferentes. Não precisa matar nenhuma — precisa segurar as rédeas das duas.',
  },
  {
    n: 8, romano: 'VIII', nome: 'A Força',
    palavras: ['coragem', 'paciência', 'domínio'],
    mensagem: 'A força que resolve isso não é a que grita — é a que respira fundo e insiste. Firmeza com doçura.',
  },
  {
    n: 9, romano: 'IX', nome: 'O Eremita',
    palavras: ['pausa', 'busca', 'clareza'],
    mensagem: 'Recolher-se agora não é fuga. Apague o barulho: a luz que você procura é pequena e só aparece no escuro.',
  },
  {
    n: 10, romano: 'X', nome: 'A Roda da Fortuna',
    palavras: ['ciclo', 'virada', 'destino'],
    mensagem: 'O que está travado começa a girar. Fase boa, aproveite sem se agarrar; fase dura, roda parada não existe.',
  },
  {
    n: 11, romano: 'XI', nome: 'A Justiça',
    palavras: ['verdade', 'equilíbrio', 'consequência'],
    mensagem: 'Toda escolha cobra seu preço. Encare os fatos como são, não como você gostaria que fossem.',
  },
  {
    n: 12, romano: 'XII', nome: 'O Enforcado',
    palavras: ['pausa', 'entrega', 'outro ângulo'],
    mensagem: 'Forçar não vai funcionar hoje. Solte o controle e olhe de cabeça para baixo — a saída está no ângulo que você recusa.',
  },
  {
    n: 13, romano: 'XIII', nome: 'A Morte',
    palavras: ['fim', 'transformação', 'renascer'],
    mensagem: 'Algo precisa acabar para o resto respirar. Não é castigo, é limpeza. Deixe ir o que já não te cabe.',
  },
  {
    n: 14, romano: 'XIV', nome: 'A Temperança',
    palavras: ['medida', 'calma', 'mistura'],
    mensagem: 'Nem tanto, nem tão pouco. Você precisa de dose certa e tempo certo — pressa aqui estraga o que ia bem.',
  },
  {
    n: 15, romano: 'XV', nome: 'O Diabo',
    palavras: ['apego', 'padrão', 'lucidez'],
    mensagem: 'O que você chama de impossível de largar é uma corrente com folga. Olhe de perto: nunca esteve trancada.',
  },
  {
    n: 16, romano: 'XVI', nome: 'A Torre',
    palavras: ['ruptura', 'verdade', 'liberdade'],
    mensagem: 'O que cai hoje estava construído em terreno falso. Dói, mas te devolve o chão. Não remonte do mesmo jeito.',
  },
  {
    n: 17, romano: 'XVII', nome: 'A Estrela',
    palavras: ['esperança', 'cura', 'fé'],
    mensagem: 'Depois do estrago vem o silêncio bom. Você está sendo recomposta aos poucos — confie no que ainda não se vê.',
  },
  {
    n: 18, romano: 'XVIII', nome: 'A Lua',
    palavras: ['ilusão', 'medo', 'sonho'],
    mensagem: 'Nem tudo que você vê é o que parece — inclusive o medo. Não decida nada grande hoje; espere clarear.',
  },
  {
    n: 19, romano: 'XIX', nome: 'O Sol',
    palavras: ['alegria', 'clareza', 'sucesso'],
    mensagem: 'A névoa levantou. Aproveite o dia em que as coisas fazem sentido — e desconfie menos da própria felicidade.',
  },
  {
    n: 20, romano: 'XX', nome: 'O Julgamento',
    palavras: ['chamado', 'perdão', 'despertar'],
    mensagem: 'Um capítulo antigo pede fechamento. Olhe para trás uma última vez — não para se punir, mas para se perdoar.',
  },
  {
    n: 21, romano: 'XXI', nome: 'O Mundo',
    palavras: ['conclusão', 'inteireza', 'conquista'],
    mensagem: 'Um ciclo se completa e você chega inteira do outro lado. Comemore antes de correr para o próximo.',
  },
];

/* Caminho da arte de cada arcano (00.jpg … 21.jpg) */
ARCANOS.forEach((a) => {
  a.img = `assets/cartas/${String(a.n).padStart(2, '0')}.jpg`;
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
     aria-label="Carta ${arc.romano} — ${arc.nome}">
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
         preserveAspectRatio="xMidYMid slice" clip-path="url(#fArte${arc.n})"/>
  <rect x="24" y="56" width="252" height="434" rx="3" fill="none" stroke="#D4AF37" stroke-width="1.2" opacity=".9"/>

  <!-- numeral romano no topo -->
  <text x="150" y="42" text-anchor="middle" fill="#F0D98C"
        font-family="Cinzel, Georgia, serif" font-size="15" letter-spacing="4">${arc.romano}</text>
  <g stroke="#D4AF37" stroke-width=".9" opacity=".6" stroke-linecap="round">
    <path d="M40 37h58M202 37h58"/>
    <path d="M104 37l5-5 5 5-5 5zM186 37l5-5 5 5-5 5z" fill="none"/>
  </g>

  <!-- fita com o nome, sobreposta ao pé da arte -->
  <g>
    <path d="M40 458h220l-13 16 13 16H40l13-16z" fill="#FBF7F2" stroke="#D4AF37" stroke-width="1.1"/>
    <path d="M40 458l-15 9 15 7zM260 458l15 9-15 7z" fill="#E4DACB" stroke="#D4AF37" stroke-width="1"/>
    <text x="150" y="479" text-anchor="middle" fill="#232A55"
          font-family="Cinzel, Georgia, serif" font-size="13.5" letter-spacing="2">${arc.nome.toUpperCase()}</text>
  </g>

  <!-- cantos ornamentados -->
  <g stroke="#D4AF37" fill="none" stroke-width="1" opacity=".8">
    <path d="M23 38c9 0 15-6 15-15M277 38c-9 0-15-6-15-15M23 482c9 0 15 6 15 15M277 482c-9 0-15 6-15 15"/>
  </g>
</svg>`;
}

/* ============================================================
   VERSO — ornamento próprio da Debs (igual para todas)
   ============================================================ */
const VERSO_SVG = `
<svg viewBox="0 0 ${CARTA_W} ${CARTA_H}" class="carta-svg" aria-hidden="true">
  <defs>
    <linearGradient id="vFundo" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#262C64"/><stop offset="50%" stop-color="#181D46"/>
      <stop offset="100%" stop-color="#0F1432"/>
    </linearGradient>
    <linearGradient id="vOuro" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F0D98C"/><stop offset="45%" stop-color="#D4AF37"/>
      <stop offset="100%" stop-color="#9C801F"/>
    </linearGradient>
  </defs>

  <rect width="${CARTA_W}" height="${CARTA_H}" rx="14" fill="url(#vFundo)"/>
  <rect x="8" y="8" width="284" height="504" rx="9" fill="none" stroke="url(#vOuro)" stroke-width="2"/>
  <rect x="17" y="17" width="266" height="486" rx="6" fill="none" stroke="#D4AF37" stroke-width=".6" opacity=".45"/>

  <ellipse cx="150" cy="260" rx="106" ry="204" fill="none" stroke="#D4AF37" stroke-width="1.2" opacity=".7"/>
  <ellipse cx="150" cy="260" rx="98" ry="196" fill="none" stroke="#D4AF37" stroke-width=".5" opacity=".35"/>

  <!-- sol e lua -->
  <g fill="none" stroke="#D4AF37">
    <circle cx="150" cy="164" r="30" stroke-width="1.1"/>
    <path d="M164 146a24 24 0 1 0 0 36 28 28 0 0 1 0-36z" stroke-width="1.1"/>
    <g stroke-width=".8" opacity=".7">
      <path d="M150 122v-12M150 206v12M108 164h-12M192 164h12M120 134l-8-8M180 194l8 8M120 194l-8 8M180 134l8-8"/>
    </g>
  </g>

  <!-- losango central -->
  <g fill="none" stroke-width="1">
    <path d="M150 248l14 22-14 22-14-22z" stroke="#E8B4C4" opacity=".7"/>
    <path d="M150 234v-14M150 306v14" stroke="#D4AF37" opacity=".55"/>
    <path d="M126 270h-14M188 270h14" stroke="#D4AF37" opacity=".55"/>
  </g>

  <!-- ramo inferior -->
  <g fill="none" stroke-width="1">
    <path d="M136 356c-8-8-8-18 0-22 6 6 6 16 0 22zM164 356c8-8 8-18 0-22-6 6-6 16 0 22z" stroke="#B9A7DA" opacity=".6"/>
    <path d="M150 386v-24" stroke="#9DB89E" opacity=".55"/>
    <path d="M150 374c-6-3-8-8-6-12 4 1 7 6 6 12zM150 374c6-3 8-8 6-12-4 1-7 6-6 12z" stroke="#9DB89E" opacity=".55"/>
    <path d="M150 384c-6-3-8-8-6-12 4 1 7 6 6 12zM150 384c6-3 8-8 6-12-4 1-7 6-6 12z" stroke="#9DB89E" opacity=".55"/>
  </g>

  <!-- cantos -->
  <g stroke="#D4AF37" fill="none" stroke-width="1" opacity=".8">
    <path d="M25 46c12 0 21-9 21-21M275 46c-12 0-21-9-21-21M25 474c12 0 21 9 21 21M275 474c-12 0-21 9-21 21"/>
    <path d="M33 33c6 0 10-4 10-10M267 33c-6 0-10-4-10-10M33 487c6 0 10 4 10 10M267 487c-6 0-10 4-10 10"/>
  </g>

  <g fill="#F0D98C" opacity=".8">
    <circle cx="44" cy="130" r="1.8"/><circle cx="256" cy="130" r="1.8"/>
    <circle cx="36" cy="260" r="1.3"/><circle cx="264" cy="260" r="1.3"/>
    <circle cx="44" cy="390" r="1.8"/><circle cx="256" cy="390" r="1.8"/>
    <circle cx="150" cy="434" r="1.4"/><circle cx="150" cy="86" r="1.4"/>
  </g>
</svg>`;
