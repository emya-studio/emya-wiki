---
name: emya-product-page
description: Create or update documentation pages on the Emya hardware wiki (VitePress, Persian/RTL) from a product's design files — Altium 3D screenshots, STEP model, Altium IntLib, schematic PDF — and the parts' datasheets, which it downloads to verify every number on the page. Produces the photos, schematic image, interactive 3D model, downloads, and the sidebar / category list / home-page entries. Use this whenever the user wants to add an Emya module, board or product to the wiki, document a product, "make the page for" a part like CN3702 or an EMLxx code, points at an EMYA-METADATA folder or a *-META-DATA.zip, asks to check a page against the datasheet, or wants to refresh an existing page's photos, 3D model or files — even if they don't say "skill" or "wiki page".
---

# Emya product documentation

The wiki is the place a customer goes after buying an Emya product: what it is, how to wire
it, how to set it up, how big it is, and the files to put it into their own design.
Every page is built from the product's own design files and checked against the
datasheets of its parts — nothing on a page should rest on memory alone.

## Page types

Pages differ by product kind. Each type has a reference file with its sections, content rules
and template — read the one you need before writing:

| Type | For | Reference | Approved example |
| :--- | :--- | :--- | :--- |
| `module` | small breakout modules with pin headers (power, charger, sensor…) | `references/types/module.md` | `docs/power-modules/tps54202.md`, `cn3702.md` |

No type fits? Don't force one. Draft the new layout with the user, then save it as
`references/types/<type>.md` (sections, rules, template) and add a row here, so the next
product of that kind starts from it.

## Workflow

The steps are the same for every type; the type file says what each step produces.

### 1. Gather the inputs

Usually a per-product folder or zip in `~/Desktop/emya/EMYA-METADATA/` (e.g.
`CN3702-META-DATA.zip`). Extract zips into a fresh folder in the scratchpad, not next to the
originals. Typical contents:
- Altium 3D screenshots (`Front-1.png`…) — look at every one; names don't say which view is which.
  Usual set: with headers, without headers, bare board (3D bodies hidden — used as 3D texture).
- `<name> <version>.step` — Altium 3D export
- `<name> <version>.pdf` — schematic (and sometimes a PCB print)
- `EM_LIB.IntLib` — Altium library; may come later, then leave its download out for now

The user may also just drop files and explain in chat. List what you found and what's missing
before going further, and say if screenshots are small (under ~1000 px wide): photos and
3D textures look soft — maximizing the Altium window and zooming in before the screenshot fixes it.

### 2. Read the design files

- **Schematic** — `python3 -I <skill>/scripts/schematic_svg.py <pdf> <out.svg>` writes a
  preview PNG; for detail render a region at 300 dpi with `pdftoppm -r 300 -x -y -W -H`. Note
  every IC, connector pin numbering, how pins like enable are wired, resistor values that set
  something (current, voltage), DNP parts, and any notes/tables the designer put on the sheet.
- **STEP** — `node <skill>/scripts/list_step_parts.mjs <step>` (run from the repo root so
  `occt-import-js` resolves). Board size = `Board` bbox X×Y; tallest *fitted* part = highest
  max-Z (skip DNP parts and headers); header groups by X range. The STEP board thickness is
  often 1.6 mm by default and may not match the real board — ask.

### 3. Verify against the datasheets

For each IC whose numbers will appear on the page, download its datasheet and check every
value against it. Memory of a datasheet is good enough to know what to look for, not to publish.

```bash
python3 -I <skill>/scripts/datasheet.py fetch <PART> --dir <product-folder>/datasheets
#   TI parts: no flag needed (ti.com symlink; can take minutes — run it in the background)
#   others:   --lcsc <C-code>  (look the part up on lcsc.com)  or  --url <direct pdf url>
python3 -I <skill>/scripts/datasheet.py find <product-folder>/datasheets/<PART>.pdf "<regex>" ...
```

Search the electrical-characteristics table and the features list for each value, and also
read the **absolute-maximum ratings** and the pin descriptions: they catch design issues the
page should not hide (e.g. a pin rated 7 V tied to a 28 V input). Formulas from the datasheet
(current-set, feedback divider) are used to compute the module's actual values from the
schematic's resistors — show the computation to the user.

Build a short check table for the user: value · page says · datasheet says (p.N) · ✓/✗.
Mismatches and design concerns go to the user; don't silently "fix" the hardware story.
Datasheets stay in the product folder — they are not published on the wiki.

### 4. Confirm with the user

Facts in files can be stale or ambiguous, and a wrong pinout or rating on a published page is
worse than a missing one. Ask everything in one numbered batch with your best guesses filled
in (each marked with where it came from: schematic, STEP, datasheet p.N), so the user can
answer "all correct" or fix one line. The type file lists what must be confirmed.

### 5. Prepare the assets

Asset folder: `docs/public/modules/<code>/` (`<code>` = product code lowercase, e.g. `eml02`).
- **Photos** — `python3 -I <skill>/scripts/prep_photo.py <screenshot> <out-base>`: removes the
  flat Altium background and axis gizmo, crops to the board, writes `.png` + `.webp`. Look at the
  result. Add `--pad 0` for a 3D texture, which must match the board outline exactly.
- **Schematic image** — pick a crop box (preview pixels = PDF points) around the circuit only,
  without sheet frame, title block or heading, then `schematic_svg.py <pdf> <out.svg> --crop X Y W H`.
- **Downloads** — in `downloads/`, named `<CODE>_<NAME>_v<ver>.<ext>`; the IntLib keeps its name.
- **3D model** — config `scripts/models/<code>.json` (start from an existing one), then
  `npm run model -- scripts/models/<code>.json`. Exclude DNP parts (their STEP bodies can float
  or hang far below the board) and make a second output without headers. Board top texture
  only from a **bare-board** image (3D bodies hidden): a render with components makes every
  part appear twice. No bare-board image → no texture. Ask the user to check the model in the
  browser; rotate it and look for missing, doubled or mis-coloured parts.

### 6. Write the page

From the type file's template and rules, in the tone of the approved example. Everything is
Persian, RTL — see *Markup and RTL* below.

### 7. Register it

- `docs/.vitepress/config.mts` sidebar, under its category group (new category → new group
  numbered in Persian digits, plus `docs/<category>/index.md` with a products table)
- Row in the category's `index.md` table, status `پیش‌نویس` while in review
- Card in `docs/index.md` `.product-cards`: `top-headers.webp`, short title with the IC in
  `<span class="latin">`, one plain line of what it does

### 8. Verify and hand over

`npm run docs:build` must pass. Tell the user to review with `npm run docs:dev`, and list:
the datasheet check table, anything you guessed, anything left out, and design concerns.
Pages carry the `badge-warn` draft badge until the user approves; publishing = removing the
badge and setting the category status to `منتشرشده`. Commit or push only when asked.

## Writing for Emya customers

These hold for every page type; each came from a correction by the user.

- Write for a buyer, not an engineer: plain Persian, no unexplained jargon (say
  "سیم جامپر سرماده", not "Dupont"). If a technical term is unavoidable (Open-Drain, Pull-up),
  say in the same sentence what the user should do with it.
- Don't add warnings or notes the user didn't ask for, except safety ones where a wrong
  connection destroys something (e.g. output voltage set too high, wrong battery type) — and
  mention those to the user when handing over.
- Every claim must be true for this product: check features against the ratings.
- One mainstream product per page; rare variants get a short subsection with only the
  parameters that differ.
- No BOM tables, no PCB-layer images, no hole coordinates: the photos, schematic image and
  downloads are enough.
- Datasheet values are labelled as such (info box naming the datasheet and its revision).

## Markup and RTL

- Part numbers in prose and titles: `<span class="latin">CN3702</span>`; pin, net and part
  names, logic levels and component values as code: `` `BAT+` ``, `` `R4` ``, `` `LOW` ``, `` `10kΩ` ``.
  Both are isolated LTR units (`custom.css` §12), which keeps them intact inside Persian.
- Never put one Latin piece in brackets right after another — `**10kΩ** (\`R4\`)` renders
  scrambled, because the bracket between two Latin runs joins them. Rephrase instead:
  `مقاومت \`R4\` با مقدار \`10kΩ\``. Brackets around Persian words are fine.
- Established English technical terms stay in English, without a Persian translation next to
  them: `<span class="latin">Open-Drain</span>`, `<span class="latin">Pull-up</span>`.
- Logic states as `LOW` / `HIGH`, not descriptions like "connected to GND" or "floating".
- Formulas in `$...$` / `$$...$$` (MathJax). Numbers and units stay Latin digits.
- After building, look at mixed Persian/English lines in the browser: bidi bugs don't show in
  the markdown source.
- Use the existing classes only (`docs/.vitepress/theme/custom.css` §10–11): `module-meta`,
  `badge-pin`, `badge-warn`, `module-gallery`, `module-figure`, `downloads` / `dl-title` /
  `dl-meta`, `product-cards` / `pc-title` / `pc-desc` / `pc-placeholder`. A new page type that
  needs new styles adds them as a new numbered section in `custom.css`.
