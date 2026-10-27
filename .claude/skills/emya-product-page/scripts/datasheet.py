#!/usr/bin/env python3
"""Download a part's datasheet and search it, to check page values against the source.

    python3 datasheet.py fetch <PART> --dir <folder> [--url URL | --lcsc C12345]
    python3 datasheet.py find <datasheet.pdf> <regex> [<regex> ...]

fetch  saves <folder>/<PART>.pdf. Without --url/--lcsc it tries TI's stable link
       (ti.com/lit/ds/symlink/<part>.pdf). For other vendors pass --url, or --lcsc with the
       LCSC part number (C-code from lcsc.com), which resolves LCSC's datasheet mirror.
       The file is checked to really be a PDF (vendor sites often return an HTML page).
find   prints every line matching any regex (case-insensitive), prefixed with its page
       number, so each value can be cited as "datasheet p.N". Needs poppler (pdftotext).
"""
import argparse
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36'}


def get(url, timeout=60):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
        return r.read()


def lcsc_pdf_url(code):
    html = get(f'https://www.lcsc.com/datasheet/{code}.pdf').decode('utf-8', 'replace')
    m = re.search(r'https://datasheet\.lcsc\.com/datasheet/pdf/[^"\'\s]+\.pdf[^"\'\s]*', html)
    if not m:
        sys.exit(f'no datasheet link found on the LCSC page for {code}')
    return m.group(0).replace('&amp;', '&')


def fetch(args):
    part = args.part.upper()
    if args.url:
        url = args.url
    elif args.lcsc:
        url = lcsc_pdf_url(args.lcsc)
    else:
        url = f'https://www.ti.com/lit/ds/symlink/{part.lower()}.pdf'
    data = get(url)
    if not data.startswith(b'%PDF'):
        sys.exit(f'{url} did not return a PDF (vendor page or block); find another source and pass --url')
    out = Path(args.dir) / f'{part}.pdf'
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_bytes(data)
    info = subprocess.run(['pdfinfo', str(out)], capture_output=True, text=True).stdout
    title = next((l.split(':', 1)[1].strip() for l in info.splitlines() if l.startswith('Title')), '')
    pages = next((l.split(':', 1)[1].strip() for l in info.splitlines() if l.startswith('Pages')), '?')
    print(f'{out}: {pages} pages, {len(data) // 1024} KB — {title}\nsource: {url}')


def find(args):
    pattern = re.compile('|'.join(f'(?:{p})' for p in args.patterns), re.I)
    pages = int(re.search(r'Pages:\s+(\d+)', subprocess.run(['pdfinfo', args.pdf], capture_output=True, text=True).stdout).group(1))
    for n in range(1, pages + 1):
        text = subprocess.run(['pdftotext', '-layout', '-f', str(n), '-l', str(n), args.pdf, '-'],
                              capture_output=True, text=True).stdout
        for line in text.splitlines():
            if pattern.search(line):
                print(f'p{n}: {" ".join(line.split())}')


ap = argparse.ArgumentParser()
sub = ap.add_subparsers(dest='cmd', required=True)
f = sub.add_parser('fetch')
f.add_argument('part')
f.add_argument('--dir', required=True)
f.add_argument('--url')
f.add_argument('--lcsc')
s = sub.add_parser('find')
s.add_argument('pdf')
s.add_argument('patterns', nargs='+')
args = ap.parse_args()
fetch(args) if args.cmd == 'fetch' else find(args)
