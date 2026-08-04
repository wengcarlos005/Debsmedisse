# Debs | Cartomante — site de leituras de Tarô

Site institucional e de agendamento da [@debsmedisse](https://instagram.com/debsmedisse).
HTML/CSS/JavaScript puro, sem build e sem backend — o agendamento é montado no navegador
e entregue direto no WhatsApp.

---

## ⚠️ Antes de publicar — leia isto

**Os depoimentos que estão no site são EXEMPLOS FICTÍCIOS.**
Eles existem só para demonstrar o layout e estão marcados com um aviso na própria página.

Publicar avaliação inventada como se fosse de cliente real é propaganda enganosa
(Código de Defesa do Consumidor, art. 37) e derruba a confiança que esse trabalho exige.

Antes de divulgar o site, faça **uma** destas duas coisas em [`js/config.js`](js/config.js):

```js
// Opção A — colocar depoimentos reais:
depoimentos: {
  exemplo: false,           // ← remove o aviso da página
  lista: [ /* depoimentos verdadeiros aqui */ ]
}

// Opção B — não tenho depoimentos ainda:
depoimentos: {
  lista: []                 // ← a seção some sozinha do site
}
```

Além disso: a foto da seção "Sobre" é um **placeholder**. Coloque uma imagem em `assets/`
e aponte `sobre.foto` no config.

---

## Rodar localmente

```bash
python -m http.server 8150
```

Depois abra <http://localhost:8150>.

Qualquer servidor estático serve — não há etapa de build.

## Publicar na Vercel

O projeto é estático puro. Na Vercel:

- **Framework Preset:** Other
- **Build Command:** deixe vazio
- **Output Directory:** deixe vazio (raiz)

É só conectar o repositório e dar deploy.

---

## Editar o conteúdo

Praticamente tudo que se lê no site está em **[`js/config.js`](js/config.js)** — um arquivo só:

| O que | Onde |
|---|---|
| Nome, tagline, Instagram | `CONFIG.marca` |
| Telefone e mensagens prontas do WhatsApp | `CONFIG.whatsapp` |
| Textos da capa | `CONFIG.hero` |
| Bio, foto e pilares | `CONFIG.sobre` |
| Passos do "como funciona" | `CONFIG.jornada` |
| **Preços e formatos de leitura** | `CONFIG.servicos` |
| Depoimentos | `CONFIG.depoimentos` |
| Temas e horários do formulário | `CONFIG.agendamento` |
| Perguntas frequentes | `CONFIG.faq` |
| Aviso legal e links do rodapé | `CONFIG.rodape` |

O número do WhatsApp usa o formato internacional só com dígitos:
`55` (Brasil) + `11` (DDD) + número.

## Estrutura

```
index.html            Marcação e sprite de ícones
css/style.css         Tokens, componentes, layout responsivo
css/animations.css    Keyframes e prefers-reduced-motion
js/config.js          ← TODO O CONTEÚDO EDITÁVEL
js/cards.js           Os 22 Arcanos Maiores da carta do dia
js/ornamentos.js      Biblioteca de ornamentos SVG (molduras, florais, fitas)
js/animations.js      Starfield, scroll-reveal, parallax, tilt
js/app.js             Monta a página e liga as interações
```

### Cache

Os arquivos são carregados com `?v=1` no `index.html`.
**Sempre que editar um CSS ou JS, aumente esse número** (`?v=2`, `?v=3`…),
senão o navegador continua servindo a versão antiga em cache.

---

## Créditos das imagens

As 22 cartas em `assets/cartas/` são do baralho **Rider-Waite-Smith (1909)**,
ilustrado por **Pamela Colman Smith**, publicado originalmente pela William Rider & Son.

A obra está em **domínio público** — o direito autoral expirou. Uso livre, inclusive
comercial, sem necessidade de licença ou pagamento.
Os arquivos vieram do [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Rider-Waite_tarot_deck)
e foram redimensionados para 440px de largura.

A moldura dourada, o verso da carta e todos os demais ornamentos do site são vetores
próprios do projeto.

> Se um dia quiser trocar por um baralho autoral, basta substituir os arquivos
> `assets/cartas/00.jpg` … `21.jpg` mantendo os nomes. Nada no código muda.

## Acessibilidade

- Respeita `prefers-reduced-motion` — com essa opção ligada no sistema,
  **todas as animações são desligadas** e o conteúdo aparece estático.
- Navegação por teclado com foco visível.
- Campos de formulário com `font-size: 16px` para não dar zoom automático no iOS.

## Aviso

As leituras de Tarô têm finalidade de autoconhecimento e reflexão. Não substituem
acompanhamento médico, psicológico, jurídico ou financeiro. Atendimento para maiores de 18 anos.
