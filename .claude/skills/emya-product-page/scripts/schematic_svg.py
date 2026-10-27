#!/usr/bin/env python3
"""Export one schematic page of an Altium PDF as a cropped SVG for the wiki.

    python3 schematic_svg.py <schematic.pdf> <out.svg> [--page 1]                 # preview only
    python3 schematic_svg.py <schematic.pdf> <out.svg> [--page 1] --crop X Y W H  # write SVG

Without --crop it writes <out>.preview.png at 72 dpi, where 1 px = 1 PDF point, so the
crop box can be read straight off the preview: keep the circuit, drop the sheet frame,
title block and sheet heading. Needs poppler (pdftocairo, pdftoppm).
"""
import argparse
import re
import subprocess
import tempfile
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument('pdf')
ap.add_argument('out')
ap.add_argument('--page', type=int, default=1)
ap.add_argument('--crop', type=float, nargs=4, metavar=('X', 'Y', 'W', 'H'))
args = ap.parse_args()

page = ['-f', str(args.page), '-l', str(args.page)]
out = Path(args.out)

if not args.crop:
    base = out.with_suffix('.preview')
    subprocess.run(['pdftoppm', '-png', '-r', '72', '-singlefile', *page, args.pdf, str(base)], check=True)
    print(f'preview: {base}.png (1 px = 1 pt). Re-run with --crop X Y W H')
    raise SystemExit

with tempfile.TemporaryDirectory() as tmp:
    full = Path(tmp) / 'page.svg'
    subprocess.run(['pdftocairo', '-svg', *page, args.pdf, str(full)], check=True)
    svg = full.read_text()

x, y, w, h = args.crop
svg, n = re.subn(r'<svg([^>]*?)\swidth="[^"]*"\s+height="[^"]*"\s+viewBox="[^"]*"',
                 lambda m: f'<svg{m.group(1)} width="{w:g}" height="{h:g}" viewBox="{x:g} {y:g} {w:g} {h:g}"',
                 svg, count=1)
if not n:
    raise SystemExit('could not find the <svg> size attributes to crop')
out.write_text(svg)
print(f'{out}: viewBox {x:g} {y:g} {w:g} {h:g}, {out.stat().st_size // 1024} KB')
