"""Baixa os 56 Arcanos Menores do Rider-Waite-Smith (1909, dominio publico)
do Wikimedia Commons e salva otimizados em assets/cartas/."""

import io
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request

from PIL import Image

DESTINO = r"C:\Users\wengc\taro-debs\assets\cartas"
LARGURA = 440
QUALIDADE = 84

NAIPES = [("Cups", "copas"), ("Pents", "ouros"), ("Swords", "espadas"), ("Wands", "paus")]
UA = {"User-Agent": "TaroDebs/1.0 (site pessoal; github.com/wengcarlos005)"}


def mapa_urls():
    todos = {}
    titulos = []
    for eng, _pt in NAIPES:
        titulos += [f"File:{eng}{i:02d}.jpg" for i in range(1, 15)]

    for i in range(0, len(titulos), 25):
        lote = titulos[i:i + 25]
        api = ("https://commons.wikimedia.org/w/api.php?action=query&format=json"
               "&prop=imageinfo&iiprop=url&iiurlwidth=900&titles="
               + urllib.parse.quote("|".join(lote)))
        req = urllib.request.Request(api, headers=UA)
        with urllib.request.urlopen(req, timeout=60) as r:
            dados = json.load(r)
        for pag in dados["query"]["pages"].values():
            nome = pag["title"].replace("File:", "").replace(" ", "_")
            todos[nome] = pag["imageinfo"][0]["thumburl"].split("?")[0]
        time.sleep(0.5)
    return todos


def baixar(url, tentativas=6):
    espera = 4
    for t in range(tentativas):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code != 429 or t == tentativas - 1:
                raise
            print(f"    429, aguardando {espera}s...")
            time.sleep(espera)
            espera *= 2
    raise RuntimeError("nao baixou")


def main():
    os.makedirs(DESTINO, exist_ok=True)
    urls = mapa_urls()

    total_kb = 0
    for eng, pt in NAIPES:
        for i in range(1, 15):
            saida = os.path.join(DESTINO, f"{pt}-{i:02d}.jpg")
            if os.path.exists(saida) and os.path.getsize(saida) > 10_000:
                total_kb += os.path.getsize(saida) / 1024
                continue

            bruto = baixar(urls[f"{eng}{i:02d}.jpg"])
            time.sleep(1.2)

            img = Image.open(io.BytesIO(bruto)).convert("RGB")
            alt = round(img.height * LARGURA / img.width)
            img = img.resize((LARGURA, alt), Image.LANCZOS)
            img.save(saida, "JPEG", quality=QUALIDADE, optimize=True, progressive=True)

            kb = os.path.getsize(saida) / 1024
            total_kb += kb
            print(f"  {pt}-{i:02d}  {LARGURA}x{alt}  {kb:6.1f}KB")

        print(f"-- {pt} completo")

    print(f"\nTotal dos menores: {total_kb/1024:.2f} MB")


if __name__ == "__main__":
    main()
