from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630

img = Image.new('RGB', (W, H))
px = img.load()
for y in range(H):
    t = y / H
    r = int(0x0f + t * (0x16 - 0x0f))
    g = int(0x19 + t * (0x21 - 0x19))
    b = int(0x23 + t * (0x3e - 0x23))
    for x in range(W):
        px[x, y] = (r, g, b)

draw = ImageDraw.Draw(img, 'RGBA')

def glow_circle(cx, cy, r, color):
    for i in range(8, 0, -1):
        alpha = int(color[3] * (i / 8) * 0.18)
        draw.ellipse((cx - r - i*3, cy - r - i*3, cx + r + i*3, cy + r + i*3),
                     fill=(color[0], color[1], color[2], alpha))
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color)

glow_circle(1050, 140,  70, (245, 175, 25, 220))
glow_circle(150,  500, 55, (78, 205, 196, 200))
glow_circle(1020, 540, 40, (255, 128, 181, 200))
glow_circle(200,  130, 32, (155, 93, 229, 200))

for i, x in enumerate([90, 140, 190, 240]):
    draw.ellipse((x, 300 + i*2, x + 10, 310 + i*2), fill=(245, 175, 25, 120))
for i, x in enumerate([960, 1010, 1060, 1110]):
    draw.ellipse((x, 360 + i*2, x + 10, 370 + i*2), fill=(78, 205, 196, 120))

def pick_font(size, bold=False):
    candidates = [
        r"C:\Windows\Fonts\msyhbd.ttc" if bold else r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\simhei.ttf",
    ]
    for p in candidates:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()

title_font    = pick_font(140, bold=True)
subtitle_font = pick_font(54,  bold=True)
tagline_font  = pick_font(42)
sticker_font  = pick_font(36,  bold=True)

def draw_centered(text, y, font, fill, shadow=None):
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    x = (W - tw) // 2 - bbox[0]
    if shadow:
        draw.text((x + shadow[0], y + shadow[1]), text, fill=shadow[2], font=font)
    draw.text((x, y), text, fill=fill, font=font)

sticker_text = "MEDLEY OF FUN"
bbox = draw.textbbox((0, 0), sticker_text, font=sticker_font)
stw = bbox[2] - bbox[0]
sth = bbox[3] - bbox[1]
pad_x, pad_y = 28, 14
sx = (W - stw) // 2 - bbox[0]
sy = 110
draw.rounded_rectangle(
    (sx - pad_x, sy - pad_y, sx + stw + pad_x, sy + sth + pad_y + 6),
    radius=30,
    fill=(245, 175, 25, 255),
)
draw.text((sx, sy), sticker_text, fill=(20, 20, 40), font=sticker_font)

draw_centered("趣味合集", 200, title_font, (255, 255, 255),
              shadow=(5, 5, (241, 39, 17, 180)))

draw_centered("Interactive Fun for Curious Minds", 400, subtitle_font, (245, 175, 25))

draw_centered("科普  ·  互动  ·  小游戏  ·  创意画板", 490, tagline_font, (200, 200, 220))

img.save('og-image.png', 'PNG', optimize=True)
print('saved og-image.png', os.path.getsize('og-image.png'), 'bytes')
