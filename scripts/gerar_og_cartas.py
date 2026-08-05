# -*- coding: utf-8 -*-
"""Gera uma imagem de compartilhamento (1200x630) para CADA uma das 78
cartas, mais a paginazinha HTML que carrega a meta tag correspondente.

Sem isso o WhatsApp mostra sempre a mesma capa generica, porque og:image
e uma meta tag estatica: para variar a imagem, precisa variar a URL.
"""

import io
import json
import os
import re
import unicodedata

from PIL import Image, ImageDraw, ImageFilter, ImageFont

RAIZ = r"C:\Users\wengc\taro-debs"
CARTAS = os.path.join(RAIZ, "assets", "cartas")
OG = os.path.join(RAIZ, "assets", "og")
PAGINAS = os.path.join(RAIZ, "c")
SITE = "https://debsmedisse.vercel.app"

W, H = 1200, 630
OURO = (212, 175, 55)
OURO_CLARO = (240, 217, 140)
CREME = (244, 237, 228)
SUAVE = (185, 179, 174)


def fonte(nomes, tam):
    for n in nomes:
        try:
            return ImageFont.truetype(rf"C:\Windows\Fonts\{n}", tam)
        except Exception:
            continue
    return ImageFont.load_default()


SERIF = ["georgiab.ttf", "georgia.ttf", "times.ttf"]
SERIF_IT = ["georgiaz.ttf", "georgiai.ttf", "timesi.ttf"]
SANS = ["seguisb.ttf", "segoeui.ttf", "arial.ttf"]


def slug(txt):
    txt = unicodedata.normalize("NFKD", txt).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", txt.lower()).strip("-")


def quebrar(d, texto, fnt, largura):
    linhas, atual = [], ""
    for p in texto.split():
        teste = (atual + " " + p).strip()
        if d.textlength(teste, font=fnt) <= largura:
            atual = teste
        else:
            if atual:
                linhas.append(atual)
            atual = p
    if atual:
        linhas.append(atual)
    return linhas


def fundo():
    base = Image.new("RGB", (W, H), (11, 17, 32))
    d = ImageDraw.Draw(base)
    cx, cy = W * 0.40, -H * 0.12
    maxr = int((W ** 2 + H ** 2) ** 0.5)
    for i in range(50, 0, -1):
        r = maxr * i / 50
        t = i / 50
        d.ellipse([cx - r, cy - r, cx + r, cy + r],
                  fill=(int(11 + 23 * (1 - t)), int(17 + 25 * (1 - t)), int(32 + 62 * (1 - t))))
    return base.filter(ImageFilter.GaussianBlur(38))


def medalhao(tam=64):
    s = 4
    img = Image.new("RGBA", (tam * s, tam * s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    r = tam * s / 2
    d.ellipse([0, 0, r * 2, r * 2], fill=OURO)
    d.ellipse([r * 0.17, r * 0.17, r * 1.83, r * 1.83], fill=(15, 20, 50))
    lua = Image.new("RGBA", img.size, (0, 0, 0, 0))
    dl = ImageDraw.Draw(lua)
    dl.ellipse([r * 0.32, r * 0.32, r * 1.68, r * 1.68], fill=OURO_CLARO)
    dl.ellipse([r * 0.64, r * 0.22, r * 2.04, r * 1.62], fill=(0, 0, 0, 0))
    img.alpha_composite(lua)
    return img.resize((tam, tam), Image.LANCZOS)


MED = medalhao(58)


def gerar(carta):
    img = fundo().convert("RGBA")

    # carta à direita, com moldura dourada e sombra
    alt = 470
    c = Image.open(os.path.join(CARTAS, os.path.basename(carta["img"]))).convert("RGBA")
    larg = int(alt * c.width / c.height)
    c = c.resize((larg, alt), Image.LANCZOS)
    moldura = Image.new("RGBA", (c.width + 12, c.height + 12), OURO + (255,))
    moldura.paste(c, (6, 6))
    g = moldura.rotate(-4, expand=True, resample=Image.BICUBIC)

    # sombra recortada pelo alfa da carta; um retângulo sólido deixava
    # cantos pretos aparecendo por trás da rotação
    sombra = Image.new("RGBA", g.size, (0, 0, 0, 0))
    sombra.paste((0, 0, 0, 170), mask=g.split()[3])
    sombra = sombra.filter(ImageFilter.GaussianBlur(18))
    px = W - g.width - 90
    py = (H - g.height) // 2
    img.alpha_composite(sombra, (px + 8, py + 16))
    img.alpha_composite(g, (px, py))

    d = ImageDraw.Draw(img)
    d.rounded_rectangle([24, 24, W - 25, H - 25], radius=18, outline=OURO, width=3)

    x, limite = 84, px - 84 - 46

    img.alpha_composite(MED, (x, 62))
    d.text((x + 76, 72), "DEBS", font=fonte(SERIF, 34), fill=CREME)
    d.text((x + 78, 112), "C A R T O M A N T E", font=fonte(SANS, 14), fill=OURO)

    d.text((x, 186), "MINHA CARTA DE HOJE", font=fonte(SANS, 17), fill=OURO)

    fnome = fonte(SERIF, 58)
    linhas_nome = quebrar(d, carta["nome"], fnome, limite)
    y = 222
    for ln in linhas_nome:
        d.text((x, y), ln, font=fnome, fill=OURO_CLARO)
        y += 66

    y += 14
    d.line([x, y, x + 190, y], fill=OURO + (130,), width=1)
    y += 26

    fmsg = fonte(SERIF_IT, 25)
    for ln in quebrar(d, carta["mensagem"], fmsg, limite)[:4]:
        d.text((x, y), ln, font=fmsg, fill=SUAVE)
        y += 36

    d.text((x, H - 82), "debsmedisse.vercel.app", font=fonte(SANS, 19), fill=OURO)

    saida = os.path.join(OG, f"{carta['slug']}.jpg")
    img.convert("RGB").save(saida, "JPEG", quality=80, optimize=True, progressive=True)
    return os.path.getsize(saida)


PAGINA = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<title>{nome} · Carta do dia de Debs | Cartomante</title>
<meta name="description" content="{mensagem}">
<link rel="canonical" href="{site}/">

<meta property="og:type" content="article">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="Debs | Cartomante">
<meta property="og:url" content="{site}/c/{slug}.html">
<meta property="og:title" content="Minha carta de hoje: {nome}">
<meta property="og:description" content="{mensagem}">
<meta property="og:image" content="{site}/assets/og/{slug}.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Carta de Tarô: {nome}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="{site}/assets/og/{slug}.jpg">

<!-- quem clica vai para o site; o robô do WhatsApp fica com as meta tags -->
<meta http-equiv="refresh" content="0; url=/#/inicio">
<link rel="icon" href="data:,">
<style>
  body {{ margin:0; min-height:100vh; display:grid; place-items:center;
         background:#0B1120; color:#F4EDE4;
         font-family:Georgia,serif; text-align:center; padding:2rem; }}
  a {{ color:#F0D98C; }}
</style>
</head>
<body>
  <div>
    <p>Minha carta de hoje: <strong>{nome}</strong></p>
    <p><a href="/#/inicio">Abrir o site de Debs | Cartomante</a></p>
  </div>
  <script>location.replace('/#/inicio');</script>
</body>
</html>
"""


def main():
    os.makedirs(OG, exist_ok=True)
    os.makedirs(PAGINAS, exist_ok=True)

    with io.open(os.path.join(RAIZ, "js", "cards.js"), encoding="utf-8") as f:
        js = f.read()

    # extrai nome, mensagem e caminho da arte direto do cards.js
    cartas = []
    for m in re.finditer(r"nome:\s*'([^']+)',\s*\n\s*palavras:[^\]]+\],\s*\n\s*mensagem:\s*'([^']+)'", js):
        cartas.append({"nome": m.group(1), "mensagem": m.group(2)})

    maiores = [f"{i:02d}.jpg" for i in range(22)]
    menores = [f"{n}-{i:02d}.jpg" for n in ("copas", "ouros", "espadas", "paus") for i in range(1, 15)]
    arquivos = maiores + menores

    if len(cartas) != 78:
        raise SystemExit(f"esperava 78 cartas, achei {len(cartas)}")

    total = 0
    mapa = {}
    for carta, arq in zip(cartas, arquivos):
        carta["img"] = arq
        carta["slug"] = slug(carta["nome"])
        total += gerar(carta)
        mapa[carta["nome"]] = carta["slug"]

        with io.open(os.path.join(PAGINAS, f"{carta['slug']}.html"), "w",
                     encoding="utf-8", newline="\n") as f:
            f.write(PAGINA.format(site=SITE, **carta))

    with io.open(os.path.join(RAIZ, "js", "slugs.js"), "w", encoding="utf-8", newline="\n") as f:
        f.write("/* Gerado por scripts/og_cartas.py. Nome da carta -> pagina de\n"
                "   compartilhamento com a imagem certa no preview. */\n")
        f.write("const SLUGS = " + json.dumps(mapa, ensure_ascii=False, indent=2) + ";\n")

    print(f"78 imagens + 78 paginas geradas")
    print(f"peso das imagens: {total/1024/1024:.2f} MB (media {total/78/1024:.0f}KB)")


if __name__ == "__main__":
    main()
