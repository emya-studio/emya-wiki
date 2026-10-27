#!/usr/bin/env python3
"""Turn an Altium 3D-view screenshot into a wiki product photo.

    python3 prep_photo.py <screenshot.png> <out-base> [--tolerance 18] [--pad 8]

The flat background colour (sampled from the screenshot's corners) is flood-filled
from the edges to transparent, the image is cropped to the board, and
<out-base>.png and <out-base>.webp are written (e.g. docs/public/modules/eml02/top).
Only background connected to the border is removed, so grey parts on the board stay.

Altium's axis gizmo (pure red/green/blue strokes in the bottom-left corner of the view)
is painted out first. If it overlaps the board it leaves small notches, so take the
screenshot with the board clear of that corner.
"""
import argparse
from collections import deque

from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument('src')
ap.add_argument('out')
ap.add_argument('--tolerance', type=int, default=18, help='max per-channel distance from the background colour')
ap.add_argument('--pad', type=int, default=8, help='transparent margin kept around the board, px')
args = ap.parse_args()

im = Image.open(args.src).convert('RGBA')
w, h = im.size
px = im.load()

corners = [px[0, 0], px[w - 1, 0], px[0, h - 1], px[w - 1, h - 1]]
bg = tuple(sorted(c[k] for c in corners)[1] for k in range(3))  # robust against one odd corner

# Gizmo: one dominant channel over two equal ones, i.e. pure red/green/blue, also when blended
# with the grey background. The blue trimmer pot (~0,50,200) has unequal low channels, so it survives.
def is_gizmo(c):
    lo, mid, hi = sorted(c[:3])
    return hi - mid > 70 and mid - lo < 25

gizmo = [(x, y) for y in range(int(h * 0.55), h) for x in range(int(w * 0.35)) if is_gizmo(px[x, y])]
for x, y in gizmo:  # include the 1px anti-aliased fringe
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            if 0 <= x + dx < w and 0 <= y + dy < h:
                px[x + dx, y + dy] = (*bg, 255)

def is_bg(c):
    return all(abs(c[k] - bg[k]) <= args.tolerance for k in range(3))

seen = bytearray(w * h)
queue = deque()
for x in range(w):
    queue.extend([(x, 0), (x, h - 1)])
for y in range(h):
    queue.extend([(0, y), (w - 1, y)])
while queue:
    x, y = queue.popleft()
    i = y * w + x
    if seen[i]:
        continue
    seen[i] = 1
    if not is_bg(px[x, y]):
        continue
    px[x, y] = (0, 0, 0, 0)
    for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
        if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx]:
            queue.append((nx, ny))

# Keep only the largest opaque island (the board); drops leftover specks
label = bytearray(w * h)
best = []
for start in range(w * h):
    if label[start] or not px[start % w, start // w][3]:
        continue
    label[start] = 1
    island = [start]
    k = 0
    while k < len(island):
        i = island[k]
        k += 1
        x, y = i % w, i // w
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            j = ny * w + nx
            if 0 <= nx < w and 0 <= ny < h and not label[j] and px[nx, ny][3]:
                label[j] = 1
                island.append(j)
    if len(island) > len(best):
        best = island
keep = bytearray(w * h)
for i in best:
    keep[i] = 1
for i in range(w * h):
    if not keep[i]:
        px[i % w, i // w] = (0, 0, 0, 0)

box = im.getbbox()
if not box:
    raise SystemExit('nothing left after removing the background; lower --tolerance')
l, t, r, b = box
im = im.crop((max(l - args.pad, 0), max(t - args.pad, 0), min(r + args.pad, w), min(b + args.pad, h)))

im.save(f'{args.out}.png', optimize=True)
im.save(f'{args.out}.webp', quality=90, method=6)
print(f'{args.out}.png / .webp: {im.size[0]}x{im.size[1]} (background {bg}, gizmo px {len(gizmo)})')
