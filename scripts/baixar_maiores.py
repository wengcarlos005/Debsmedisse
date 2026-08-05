"""Baixa os 22 Arcanos Maiores do Rider-Waite-Smith (1909, domínio público)
do Wikimedia Commons, redimensiona e salva otimizado em assets/cartas/."""

import io
import json
import os
import time
import urllib.error
import urllib.parse
import urllib.request

from PIL import Image

DESTINO = r"C:\Users\wengc\taro-debs\assets\cartas"
LARGURA = 440          # largura final de cada carta
QUALIDADE = 84

NOMES = [
    "RWS_Tarot_00_Fool.jpg",
    "RWS_Tarot_01_Magician.jpg",
    "RWS_Tarot_02_High_Priestess.jpg",
    "RWS_Tarot_03_Empress.jpg",
    "RWS_Tarot_04_Emperor.jpg",
    "RWS_Tarot_05_Hierophant.jpg",
    "RWS_Tarot_06_Lovers.jpg",
    "RWS_Tarot_07_Chariot.jpg",
    "RWS_Tarot_08_Strength.jpg",
    "RWS_Tarot_09_Hermit.jpg",
    "RWS_Tarot_10_Wheel_of_Fortune.jpg",
    "RWS_Tarot_11_Justice.jpg",
    "RWS_Tarot_12_Hanged_Man.jpg",
    "RWS_Tarot_13_Death.jpg",
    "RWS_Tarot_14_Temperance.jpg",
    "RWS_Tarot_15_Devil.jpg",
    "RWS_Tarot_16_Tower.jpg",
    "RWS_Tarot_17_Star.jpg",
    "RWS_Tarot_18_Moon.jpg",
    "RWS_Tarot_19_Sun.jpg",
    "RWS_Tarot_20_Judgement.jpg",
    "RWS_Tarot_21_World.jpg",
]

UA = {"User-Agent": "TaroDebs/1.0 (site pessoal; contato via github.com/wengcarlos005)"}


def urls_dos_thumbs():
    titles = "|".join("File:" + n for n in NOMES)
    api = (
        "https://commons.wikimedia.org/w/api.php?action=query&format=json"
        "&prop=imageinfo&iiprop=url&iiurlwidth=900&titles="
        + urllib.parse.quote(titles)
    )
    req = urllib.request.Request(api, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        dados = json.load(r)

    mapa = {}
    for pag in dados["query"]["pages"].values():
        arquivo = pag["title"].replace("File:", "").replace(" ", "_")
        mapa[arquivo] = pag["imageinfo"][0]["thumburl"].split("?")[0]
    return mapa


def baixar(url, tentativas=6):
    """Baixa respeitando o rate limit do Wikimedia (429 = espera e tenta de novo)."""
    espera = 4
    for tentativa in range(tentativas):
        try:
            req = urllib.request.Request(url, headers=UA)
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code != 429 or tentativa == tentativas - 1:
                raise
            print(f"    429 — aguardando {espera}s…")
            time.sleep(espera)
            espera *= 2
    raise RuntimeError("nao baixou")


def main():
    os.makedirs(DESTINO, exist_ok=True)
    mapa = urls_dos_thumbs()

    total_kb = 0
    for i, nome in enumerate(NOMES):
        saida = os.path.join(DESTINO, f"{i:02d}.jpg")

        # retoma de onde parou
        if os.path.exists(saida) and os.path.getsize(saida) > 10_000:
            kb = os.path.getsize(saida) / 1024
            total_kb += kb
            print(f"{i:02d}  ja existe    {kb:6.1f}KB")
            continue

        bruto = baixar(mapa[nome])
        time.sleep(1.5)  # gentileza com o servidor

        img = Image.open(io.BytesIO(bruto)).convert("RGB")
        alt = round(img.height * LARGURA / img.width)
        img = img.resize((LARGURA, alt), Image.LANCZOS)

        img.save(saida, "JPEG", quality=QUALIDADE, optimize=True, progressive=True)

        kb = os.path.getsize(saida) / 1024
        total_kb += kb
        print(f"{i:02d}  {LARGURA}x{alt}  {kb:6.1f}KB  {nome}")

    print(f"\nTotal: {total_kb/1024:.2f} MB em {DESTINO}")


if __name__ == "__main__":
    main()
