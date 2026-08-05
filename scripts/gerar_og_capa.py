# -*- coding: utf-8 -*-
"""Gera a imagem de compartilhamento (og:image) 1200x630.
E o que aparece quando o link e mandado no WhatsApp."""

import os

from PIL import Image, ImageDraw, ImageFilter, ImageFont

DEST = r"C:\Users\wengc\taro-debs\assets\og.jpg"
CARTAS = r"C:\Users\wengc\taro-debs\assets\cartas"
W, H = 1200, 630

OURO = (212, 175, 55)
OURO_CLARO = (240, 217, 140)
CREME = (244, 237, 228)


def fonte(nomes, tam):
    for n in nomes:
        for caminho in (rf"C:\Windows\Fonts\{n}", n):
            try:
                return ImageFont.truetype(caminho, tam)
            except Exception:
                continue
    return ImageFont.load_default()


SERIF = ["georgiab.ttf", "georgia.ttf", "times.ttf"]
SERIF_IT = ["georgiaz.ttf", "georgiai.ttf", "timesi.ttf"]
SANS = ["seguisb.ttf", "segoeui.ttf", "arial.ttf"]


def fundo():
    """Gradiente radial navy, igual ao do site."""
    base = Image.new("RGB", (W, H), (11, 17, 32))
    d = ImageDraw.Draw(base)
    cx, cy = W * 0.42, -H * 0.15
    maxr = int((W ** 2 + H ** 2) ** 0.5)
    for i in range(60, 0, -1):
        r = maxr * i / 60
        t = i / 60
        cor = (int(11 + (34 - 11) * (1 - t)),
               int(17 + (42 - 17) * (1 - t)),
               int(32 + (94 - 32) * (1 - t)))
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=cor)
    return base.filter(ImageFilter.GaussianBlur(40))


def medalhao(tam=104):
    """Emblema da marca: aro cheio, miolo escuro, lua solida."""
    s = 4
    img = Image.new("RGBA", (tam * s, tam * s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    c, r = tam * s / 2, tam * s / 2

    d.ellipse([0, 0, r * 2, r * 2], fill=OURO)
    d.ellipse([r * 0.16, r * 0.16, r * 1.84, r * 1.84], fill=(15, 20, 50))
    # lua crescente: disco dourado menos disco escuro deslocado
    lua = Image.new("RGBA", img.size, (0, 0, 0, 0))
    dl = ImageDraw.Draw(lua)
    dl.ellipse([r * 0.30, r * 0.30, r * 1.70, r * 1.70], fill=OURO_CLARO)
    dl.ellipse([r * 0.62, r * 0.20, r * 2.02, r * 1.60], fill=(0, 0, 0, 0))
    img.alpha_composite(lua)
    return img.resize((tam, tam), Image.LANCZOS)


def leque(altura=470):
    """Tres cartas em leque, iguais as da capa."""
    tela = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ordem = [("18.jpg", -15, -150, 34), ("19.jpg", 15, 150, 34), ("17.jpg", 0, 0, 0)]
    for arq, ang, dx, dy in ordem:
        c = Image.open(os.path.join(CARTAS, arq)).convert("RGBA")
        larg = int(altura * c.width / c.height)
        c = c.resize((larg, altura), Image.LANCZOS)

        moldura = Image.new("RGBA", (c.width + 12, c.height + 12), OURO + (255,))
        moldura.paste(c, (6, 6))

        g = moldura.rotate(ang, expand=True, resample=Image.BICUBIC)

        # sombra recortada pelo alfa: retângulo sólido deixava canto preto
        sombra = Image.new("RGBA", g.size, (0, 0, 0, 0))
        sombra.paste((0, 0, 0, 155), mask=g.split()[3])
        sombra = sombra.filter(ImageFilter.GaussianBlur(16))
        x = int(W * 0.72 - g.width / 2 + dx)
        y = int(H / 2 - g.height / 2 + dy)
        tela.alpha_composite(sombra, (x + 6, y + 14))
        tela.alpha_composite(g, (x, y))
    return tela


def main():
    img = fundo().convert("RGBA")
    img.alpha_composite(leque())

    d = ImageDraw.Draw(img)

    # moldura dourada
    d.rounded_rectangle([26, 26, W - 27, H - 27], radius=18, outline=OURO, width=3)
    d.rounded_rectangle([38, 38, W - 39, H - 39], radius=12,
                        outline=OURO + (90,), width=1)

    x = 92
    img.alpha_composite(medalhao(104), (x, 132))

    d.text((x + 128, 152), "DEBS", font=fonte(SERIF, 62), fill=CREME)
    d.text((x + 132, 222), "C A R T O M A N T E", font=fonte(SANS, 21), fill=OURO)

    d.text((x, 300), "Os guias falam.", font=fonte(SERIF, 52), fill=CREME)
    d.text((x, 362), "Eu traduzo.", font=fonte(SERIF_IT, 52), fill=OURO_CLARO)

    d.line([x, 448, x + 300, 448], fill=OURO + (120,), width=1)
    d.text((x, 468), "Leituras de Tarô online", font=fonte(SANS, 24), fill=(185, 179, 174))
    d.text((x, 506), "@debsmedisse", font=fonte(SANS, 24), fill=OURO)

    img.convert("RGB").save(DEST, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"{DEST}  {W}x{H}  {os.path.getsize(DEST)/1024:.0f}KB")


if __name__ == "__main__":
    main()
