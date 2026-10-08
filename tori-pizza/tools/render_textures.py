"""
Gera as texturas realistas usadas na animação de abertura (pizza sendo feita).

    python3 tools/render_textures.py

Saída em public/intro/: massa crua/assada, molho, queijo derretido, sprites de
queijo ralado, calabresa, cebola, azeitona, orégano, sombra e a mesa de madeira.
Tudo é procedural (ruído + iluminação), com a luz vindo do canto superior esquerdo.
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

OUT = Path(__file__).resolve().parent.parent / 'public' / 'intro'
OUT.mkdir(parents=True, exist_ok=True)

S = 1024           # tamanho das camadas da pizza
C = S / 2          # centro
R = 470            # raio da massa
LIGHT = np.array([-0.45, -0.55, 0.70])
LIGHT = LIGHT / np.linalg.norm(LIGHT)
rng = np.random.default_rng(7)


# ---------------------------------------------------------------- ruído

def noise(size, res, seed):
    """ruído suave: grade aleatória ampliada com bicúbico"""
    g = np.random.default_rng(seed).random((res, res)).astype(np.float32)
    im = Image.fromarray((g * 255).astype(np.uint8)).resize((size, size), Image.BICUBIC)
    return np.asarray(im, dtype=np.float32) / 255


def fbm(size, base=4, octaves=6, seed=0, gain=0.5):
    total = np.zeros((size, size), np.float32)
    amp, norm = 1.0, 0.0
    for o in range(octaves):
        res = min(size, base * 2 ** o)
        total += amp * noise(size, res, seed * 101 + o)
        norm += amp
        amp *= gain
    return total / norm


def smooth(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)


def shade(height, strength=6.0, spec_power=40, spec=0.0):
    gy, gx = np.gradient(height * strength)
    n = np.dstack([-gx, -gy, np.ones_like(height)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    diff = np.clip(n @ LIGHT, 0, 1)
    h = LIGHT + np.array([0, 0, 1.0])
    h /= np.linalg.norm(h)
    sp = np.clip(n @ h, 0, 1) ** spec_power * spec
    return diff, sp


def rgba(rgb, alpha):
    arr = np.dstack([np.clip(rgb, 0, 255), np.clip(alpha, 0, 1) * 255]).astype(np.uint8)
    return Image.fromarray(arr, 'RGBA')


def save(im, name, q=82):
    im.save(OUT / f'{name}.webp', 'WEBP', quality=q, method=6)
    print('ok', name, im.size)


def mix(a, b, t):
    t = t[..., None] if np.ndim(t) == 2 else t
    return a * (1 - t) + b * t


yy, xx = np.mgrid[0:S, 0:S].astype(np.float32)
dx, dy = xx - C, yy - C
rad = np.hypot(dx, dy)
ang = np.arctan2(dy, dx)


def wobble(base_r, amp, seed, freq=(3, 5, 9)):
    """raio irregular em função do ângulo (borda de massa feita à mão)"""
    g = np.random.default_rng(seed)
    w = np.zeros_like(ang)
    for f in freq:
        w += np.sin(ang * f + g.random() * 6.28) * g.random() / f
    return base_r * (1 + amp * w)


def local_grid(n):
    y, x = np.mgrid[0:n, 0:n].astype(np.float32)
    return x - n / 2 + 0.5, y - n / 2 + 0.5


def drop_shadow(alpha, off=2.0, blur=2.0, k=0.45):
    a = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(blur))
    a = np.asarray(a.transform(a.size, Image.AFFINE, (1, 0, -off, 0, 1, -off)), np.float32) / 255
    return a * k



# ---------------------------------------------------------------- massa

edge_r = wobble(R, 0.035, 1)
inside = smooth(edge_r + 1.5, edge_r - 1.5, rad)
d_edge = edge_r - rad                       # distância até a borda (px)
rim = np.exp(-((d_edge - 30) / 22) ** 2)    # bordinha alta
rim_raw = rim * 0.75
bumps = fbm(S, 6, 6, 11)
fine = fbm(S, 64, 3, 12)


def dough(baked):
    h = (rim * (1.25 if baked else 0.8) + bumps * 0.25 + fine * 0.05) * inside
    h += smooth(0, 14, d_edge) * 0.3 - 0.3
    diff, sp = shade(h, 9 if baked else 6, 30, 0.25 if baked else 0.08)
    var = fbm(S, 8, 5, 13)
    if not baked:
        base = np.array([236, 219, 184], np.float32)
        col = base[None, None] * (0.92 + 0.12 * var[..., None])
        flour = smooth(0.62, 0.78, fbm(S, 16, 5, 14)) * (0.5 + 0.5 * rim)
        col = mix(col, np.array([250, 248, 240], np.float32), flour * 0.75)
    else:
        golden = np.array([214, 152, 78], np.float32)
        pale = np.array([238, 206, 150], np.float32)
        col = mix(pale[None, None] * np.ones((S, S, 1)), golden, np.clip(rim * 1.2 + var * 0.3 - 0.1, 0, 1))
        brown = smooth(0.5, 0.72, fbm(S, 12, 5, 15)) * rim
        col = mix(col, np.array([170, 98, 42], np.float32), brown * 0.85)
        blis = smooth(0.66, 0.74, fbm(S, 30, 4, 17)) * rim
        col = mix(col, np.array([120, 64, 30], np.float32), blis * 0.7)
        char = smooth(0.74, 0.8, fbm(S, 48, 4, 16)) * smooth(0.3, 0.8, rim)
        col = mix(col, np.array([62, 36, 20], np.float32), char * 0.9)
        flour = smooth(0.7, 0.82, fbm(S, 16, 5, 14)) * rim
        col = mix(col, np.array([235, 215, 180], np.float32), flour * 0.35)
    col = col * (0.42 + 0.68 * diff[..., None]) + sp[..., None] * 255
    return rgba(col, inside)


save(dough(False), 'dough-raw')
save(dough(True), 'dough-baked')

# sombra da pizza (desenhada embaixo, um pouco deslocada)
sh = Image.fromarray((inside * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(26))
shadow = np.zeros((S, S, 4), np.uint8)
shadow[..., 3] = (np.asarray(sh) * 0.8).astype(np.uint8)
save(Image.fromarray(shadow, 'RGBA'), 'shadow', 70)

# ---------------------------------------------------------------- molho

sauce_r = wobble(R - 52, 0.03, 2, (4, 7, 13))
sauce_in = smooth(sauce_r + 2, sauce_r - 2, rad)


def sauce(baked):
    v = fbm(S, 10, 6, 21)
    h = fbm(S, 40, 4, 22) * 0.6 + v * 0.4
    diff, sp = shade(h, 4, 60, 0.0 if baked else 0.85)
    if baked:
        a, b = np.array([140, 34, 18], np.float32), np.array([196, 70, 30], np.float32)
    else:
        a, b = np.array([150, 22, 14], np.float32), np.array([212, 52, 30], np.float32)
    col = mix(a[None, None] * np.ones((S, S, 1)), b, v)
    herbs = smooth(0.8, 0.84, fbm(S, 128, 2, 23))
    col = mix(col, np.array([70, 60, 25], np.float32), herbs * 0.6)
    col = col * (0.55 + 0.55 * diff[..., None]) + sp[..., None] * 255
    # borda do molho levemente transparente, mostrando a massa
    alpha = sauce_in * (0.82 + 0.18 * smooth(0, 18, sauce_r - rad))
    return rgba(col, alpha)


save(sauce(False), 'sauce')
save(sauce(True), 'sauce-baked')

# ---------------------------------------------------------------- queijo derretido
# o queijo ralado "derrete": milhares de tirinhas carimbadas num mapa de altura e borradas

def stamp_shreds(count, seed):
    g = np.random.default_rng(seed)
    hmap = np.zeros((S, S), np.float32)
    n = 40
    x, y = local_grid(n)
    for _ in range(count):
        a = g.random() * np.pi
        u, w = x * np.cos(a) + y * np.sin(a), -x * np.sin(a) + y * np.cos(a)
        length, width = 11 + g.random() * 7, 3 + g.random() * 1.5
        d = np.hypot(np.maximum(np.abs(u) - length, 0), w) - width
        m = np.clip(-d / width, 0, 1)
        r = (R - 58) * np.sqrt(g.random())
        t = g.random() * 2 * np.pi
        cx, cy = int(C + r * np.cos(t)) - n // 2, int(C + r * np.sin(t)) - n // 2
        hmap[cy:cy + n, cx:cx + n] = np.maximum(hmap[cy:cy + n, cx:cx + n], m) + m * 0.25
    return hmap


melt = stamp_shreds(2600, 31)
melt = np.asarray(Image.fromarray(np.clip(melt * 120, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(5)), np.float32) / 255
melt = melt / max(melt.max(), 1e-3)
cheese_r = wobble(R - 46, 0.05, 3, (5, 9, 17))
cheese_in = smooth(cheese_r + 6, cheese_r - 10, rad)
coverage = smooth(0.08, 0.26, melt + fbm(S, 10, 4, 36) * 0.12) * cheese_in
v = fbm(S, 12, 6, 32)
blist = smooth(0.6, 0.9, fbm(S, 20, 4, 33))                 # bolhas
h = melt * 0.9 + blist * 0.5 + v * 0.15
diff, sp = shade(h, 10, 55, 0.75)
cream = np.array([250, 230, 178], np.float32)
yellow = np.array([238, 192, 104], np.float32)
col = mix(yellow[None, None] * np.ones((S, S, 1)), cream, smooth(0.15, 0.7, melt))
oil = smooth(0.25, 0.05, melt) * cheese_in                   # bordas finas ficam alaranjadas (óleo + molho)
col = mix(col, np.array([226, 140, 60], np.float32), oil * 0.7)
spots = smooth(0.56, 0.78, fbm(S, 26, 5, 34) * 0.6 + blist * 0.5) * smooth(0.3, 0.8, melt)
col = mix(col, np.array([196, 120, 46], np.float32), spots * 0.9)
dark = smooth(0.8, 0.9, fbm(S, 48, 4, 35) * 0.5 + spots * 0.6)
col = mix(col, np.array([128, 70, 28], np.float32), dark * 0.6)
col = col * (0.52 + 0.58 * diff[..., None]) + sp[..., None] * 255
save(rgba(col, np.clip(coverage, 0, 1)), 'cheese-melted')


# ---------------------------------------------------------------- sprites

def sprite_grid(n):
    return int(np.ceil(np.sqrt(n)))


def atlas(sprites, name, q=85):
    """junta sprites quadrados do mesmo tamanho numa folha (linhas x colunas)"""
    size = sprites[0].size[0]
    cols = sprite_grid(len(sprites))
    rows = int(np.ceil(len(sprites) / cols))
    sheet = Image.new('RGBA', (cols * size, rows * size))
    for i, sp in enumerate(sprites):
        sheet.paste(sp, ((i % cols) * size, (i // cols) * size))
    save(sheet, name, q)
    return cols


def compose(col, alpha, shadow_alpha):
    """sprite com sombra suave por baixo"""
    out_a = alpha + shadow_alpha * (1 - alpha)
    out_c = np.where(out_a[..., None] > 0, col * alpha[..., None] / np.maximum(out_a[..., None], 1e-4), 0)
    return rgba(out_c, out_a)


# queijo ralado: tirinhas curvas
def shred(seed):
    n = 48
    g = np.random.default_rng(seed)
    x, y = local_grid(n)
    a = g.random() * np.pi
    ca, sa = np.cos(a), np.sin(a)
    u, w = x * ca + y * sa, -x * sa + y * ca
    length, width = 14 + g.random() * 7, 2.6 + g.random() * 1.4
    w = w - (u / length) ** 2 * (g.random() - 0.5) * 8      # curvatura
    d = np.hypot(np.maximum(np.abs(u) - length, 0), w) - width
    alpha = smooth(0.8, -0.8, d)
    hgt = np.clip(-d / width, 0, 1)
    diff, sp = shade(hgt, 3, 20, 0.35)
    col = np.array([248, 240, 214], np.float32) * (0.62 + 0.45 * diff[..., None]) + sp[..., None] * 255
    tint = g.random() * 0.12
    col = col * (1 - tint) + np.array([255, 226, 150], np.float32) * tint
    return compose(col, alpha, drop_shadow(alpha, 1.6, 1.4, 0.35))


cols_shred = atlas([shred(100 + i) for i in range(12)], 'shreds')


# calabresa fatiada
def calabresa(seed, baked):
    n = 96
    g = np.random.default_rng(seed)
    x, y = local_grid(n)
    r0 = 36 + g.random() * 4
    sx = 1 + (g.random() - 0.5) * 0.12
    rr = np.hypot(x * sx, y / sx)
    th = np.arctan2(y, x)
    rr = rr * (1 + 0.025 * np.sin(th * 3 + g.random() * 6))
    alpha = smooth(r0 + 0.8, r0 - 0.8, rr)
    meat = fbm(n, 20, 4, seed)
    fat = smooth(0.66, 0.74, fbm(n, 40, 2, seed + 1))
    if baked:
        base = mix(np.array([150, 52, 36], np.float32)[None, None] * np.ones((n, n, 1)), np.array([104, 32, 22], np.float32), meat)
        casing = np.array([66, 22, 14], np.float32)
        curl = smooth(r0 - 10, r0 - 1, rr)                   # borda enrola e fica mais alta
        hgt = curl * 0.9 + meat * 0.25
        spec_k = 0.9
    else:
        base = mix(np.array([190, 92, 80], np.float32)[None, None] * np.ones((n, n, 1)), np.array([150, 60, 52], np.float32), meat)
        casing = np.array([112, 44, 32], np.float32)
        hgt = meat * 0.3 + smooth(r0, r0 - 6, rr) * 0.3
        spec_k = 0.45
    col = mix(base, np.array([236, 196, 176] if not baked else [206, 136, 96], np.float32), fat * 0.7)
    col = mix(col, casing, smooth(r0 - 5, r0 - 1, rr))
    diff, sp = shade(hgt, 6, 40, spec_k)
    col = col * (0.55 + 0.55 * diff[..., None]) + sp[..., None] * 255
    sprite = compose(col, alpha, drop_shadow(alpha, 2.5, 2.5, 0.5))
    if not baked:
        return sprite
    # óleo alaranjado que a calabresa solta no forno
    halo = smooth(r0 + 12, r0 - 2, rr) * 0.5
    oil = rgba(np.ones((n, n, 1), np.float32) * np.array([222, 120, 40], np.float32), halo)
    oil.alpha_composite(sprite)
    return oil


atlas([calabresa(200 + i, False) for i in range(6)], 'calabresa-raw')
atlas([calabresa(200 + i, True) for i in range(6)], 'calabresa-baked')


# anéis de cebola
def onion(seed, baked):
    n = 112
    g = np.random.default_rng(seed)
    x, y = local_grid(n)
    sx = 1 + (g.random() - 0.4) * 0.5
    rr = np.hypot(x * sx, y / sx)
    th = np.arctan2(y, x)
    r0 = 30 + g.random() * 16
    width = 4.5 + g.random() * 2
    ring = smooth(width, width - 1.4, np.abs(rr - r0))
    # algumas cebolas vêm em pedaços (arco)
    if g.random() < 0.55:
        a0, span = g.random() * 6.28, 2.2 + g.random() * 2.5
        dth = (th - a0) % (2 * np.pi)
        ring = ring * smooth(span, span - 0.3, dth)
    hgt = np.clip(1 - np.abs(rr - r0) / width, 0, 1)
    diff, sp = shade(hgt, 3, 30, 0.7)
    if baked:
        col = mix(np.array([232, 204, 160], np.float32)[None, None] * np.ones((n, n, 1)), np.array([170, 104, 50], np.float32), smooth(0.2, 1, fbm(n, 6, 3, seed)) * 0.8)
        a = ring * 0.85
    else:
        col = mix(np.array([246, 238, 244], np.float32)[None, None] * np.ones((n, n, 1)), np.array([170, 90, 150], np.float32), smooth(0.5, 1, hgt) * 0.0 + smooth(r0 + width - 1.5, r0 + width, rr) * 0.8)
        a = ring * 0.92
    col = col * (0.6 + 0.45 * diff[..., None]) + sp[..., None] * 255
    return compose(col, a, drop_shadow(a, 1.5, 1.5, 0.3))


atlas([onion(300 + i, False) for i in range(6)], 'onion-raw')
atlas([onion(300 + i, True) for i in range(6)], 'onion-baked')


# azeitonas pretas fatiadas (anel com furo)
def olive(seed):
    n = 64
    g = np.random.default_rng(seed)
    x, y = local_grid(n)
    sx = 1 + (g.random() - 0.5) * 0.3
    rr = np.hypot(x * sx, y / sx)
    r0, hole = 19 + g.random() * 3, 7 + g.random() * 2
    alpha = smooth(r0 + 0.8, r0 - 0.8, rr) * smooth(hole - 0.8, hole + 0.8, rr)
    hgt = np.clip(1 - np.abs(rr - (r0 + hole) / 2) / ((r0 - hole) / 2), 0, 1)
    diff, sp = shade(hgt, 4, 60, 1.0)
    col = np.array([52, 36, 44], np.float32) * (0.5 + 0.6 * diff[..., None]) + sp[..., None] * 255
    return compose(col, alpha, drop_shadow(alpha, 1.8, 1.8, 0.45))


atlas([olive(400 + i) for i in range(6)], 'olive')


# orégano: flocos pequenos
def oregano(seed):
    n = 16
    g = np.random.default_rng(seed)
    x, y = local_grid(n)
    a = g.random() * np.pi
    u, w = x * np.cos(a) + y * np.sin(a), -x * np.sin(a) + y * np.cos(a)
    d = np.hypot(u / (2 + g.random() * 3), w / (1 + g.random() * 1.2))
    alpha = smooth(1.15, 0.85, d)
    col = np.ones((n, n, 1), np.float32) * np.array([70 + g.random() * 30, 82 + g.random() * 25, 34], np.float32)
    return rgba(col, alpha * 0.95)


atlas([oregano(500 + i) for i in range(16)], 'oregano')


# ---------------------------------------------------------------- mesa de madeira

def table(w, h):
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    plank_h = 230
    plank = (y // plank_h).astype(int)
    off = (plank * 977) % 1000
    grain_n = np.asarray(Image.fromarray((np.random.default_rng(61).random((h // 6, 40)) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), np.float32) / 255
    rings = np.sin((y + grain_n * 60 + off) * 0.11 + np.sin((x + off * 3) * 0.004) * 4) * 0.5 + 0.5
    fibers = np.asarray(Image.fromarray((np.random.default_rng(62).random((h, w // 30)) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), np.float32) / 255
    tone = 0.75 + 0.25 * np.random.default_rng(63).random(plank.max() + 1)[plank]
    v = rings * 0.35 + fibers * 0.45 + grain_n * 0.2
    col = mix(np.array([58, 34, 20], np.float32)[None, None] * np.ones((h, w, 1)), np.array([120, 74, 42], np.float32), v)
    col = col * tone[..., None]
    gap = smooth(3, 0, np.minimum(y % plank_h, plank_h - y % plank_h))
    col = col * (1 - gap[..., None] * 0.75)
    # farinha espalhada perto do centro
    cx, cy = w / 2, h / 2
    dist = np.hypot((x - cx) / (w * 0.32), (y - cy) / (h * 0.42))
    flour_noise = np.asarray(Image.fromarray((np.random.default_rng(64).random((h // 3, w // 3)) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), np.float32) / 255
    speck = smooth(0.82, 0.95, np.random.default_rng(65).random((h, w)).astype(np.float32)) * 0.5
    fl = smooth(1.05, 0.55, dist) * (smooth(0.35, 0.75, flour_noise) * 0.55 + speck)
    col = mix(col, np.array([232, 224, 210], np.float32), np.clip(fl, 0, 0.85))
    # luz quente vinda do alto
    light = 1.05 - 0.55 * np.hypot((x - w * 0.42) / w, (y - h * 0.38) / h)
    col = col * light[..., None]
    return Image.fromarray(np.clip(col, 0, 255).astype(np.uint8), 'RGB')


tb = table(1920, 1280)
tb.save(OUT / 'table.webp', 'WEBP', quality=72, method=6)
tb.resize((960, 640), Image.LANCZOS).save(OUT / 'table-sm.webp', 'WEBP', quality=72, method=6)
print('ok table')
