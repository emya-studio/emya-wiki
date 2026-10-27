# Page type: module

Small Emya breakout modules with a row of pin headers on one edge — power converters,
chargers, sensor boards. Approved examples: `docs/power-modules/tps54202.md` (adjustable
buck) and `docs/power-modules/cn3702.md` (charger with status pins and options).

Files: page `docs/<category>/<slug>.md` (slug = main IC lowercase); assets in
`docs/public/modules/<code>/`: `top.{png,webp}`, `top-headers.{png,webp}`, `schematic.svg`,
`<code>.glb`, `<code>-no-headers.glb`, `downloads/`.

## Confirm with the user (workflow step 4)

- Product name, code (`EMLxx`), hardware version, category
- Main IC and variants — which is mainstream, which is rare
- Pin order **left to right, looking at the top with the headers at the bottom**, as
  connector-pin + name. Mesh order in the STEP doesn't say which pin is 1, and the physical
  order is often not J1-1, J1-2, J2-1, J2-2 (e.g. `J2-2 GND` before `J2-1 VOUT`)
- Board thickness (the STEP often says 1.6 mm; Emya modules are often 1.0 mm)
- Height of the tallest fitted part — the STEP's 3D body is often a generic model taller than
  the real part (the CN3702's inductor is 3.56 mm in the STEP, 2 mm in reality); the user's
  number wins, without further questions
- Which input supplies to name as compatible (e.g. "9V، 12V و 24V") — not just any value in range
- Ratings to state, computed from the schematic's resistors with the datasheet formula
- Optional user modifications (fixed resistor instead of trimmer, lower charge current,
  fitting an NTC) — what the board has by default and what the user must change
- Status outputs / LEDs: what each means, and whether to document the pins for a microcontroller
- Headers shipped loose or soldered

## Content rules

- **Photos**: only the two top views (without headers, with soldered headers). No back view.
- **Features**: 3–6 bullets, each true for this product.
- **Specs table**: what a user needs to choose and use the module — input range, output/charge
  values, currents, switching frequency, enable behaviour, board size. No internal component
  values (inductor, capacitors).
- **Variants**: a rarely sold variant gets a short subsection — that it exists / can be swapped
  in — with a comparison table limited to the parameters that differ (not package or identical
  ranges).
- **Pinout**: table in physical order with connector-pin, silkscreen label/name and function.
  No breadboard-compatibility notes.
- **Settings and modifications**: explain each as "remove/desolder X, fit Y" with a short
  table of the useful options only (e.g. 3.3V and 5V for a converter; 1A and 2A for a charger
  — never an option the board's parts can't carry).
- **Status outputs**: a short table — state · LED · each pin as `LOW` / `HIGH` — then one or
  two sentences on what a microcontroller needs (e.g. a Pull-up for Open-Drain pins). Brief.
- **Mechanical**: board dimensions, thickness, tallest fitted component. Nothing else.
- **Downloads**: Altium library and STEP only (no schematic PDF). Leave a card out until its
  file exists.

## Template

`{…}` are placeholders. Sections marked *(if …)* are dropped when they don't apply; add a
section only when the product genuinely needs it (as `cn3702.md` adds charge stages, status
indicators and the NTC option), in the same style.

````markdown
---
title: {نوع ماژول به فارسی} {MAIN_IC} ({CODE})
description: {one Persian sentence: what it is, main IC, key range}
---

# {نوع ماژول به فارسی} <span class="latin">{MAIN_IC}</span>

{One or two Persian sentences: what it does, key ratings, built on `{MAIN_IC}` from {vendor}.}

<div class="module-meta">
  <span class="badge-pin">کد محصول: <span class="latin">{CODE}</span></span>
  <span class="badge-pin">نسخه سخت‌افزار: <span class="latin">{VERSION}</span></span>
  <span class="badge-warn">پیش‌نویس — در حال تکمیل</span>   <!-- removed on publish -->
</div>

<div class="module-gallery">
  <figure>
    <img src="/modules/{code}/top.webp" alt="نمای بالای ماژول {CODE} بدون پین‌هدر" />
    <figcaption>نمای بالا — بدون پین‌هدر (حالت ارسال)</figcaption>
  </figure>
  <figure>
    <img src="/modules/{code}/top-headers.webp" alt="نمای بالای ماژول {CODE} با پین‌هدر لحیم‌شده" />
    <figcaption>نمای بالا — با پین‌هدر لحیم‌شده</figcaption>
  </figure>
</div>

## ویژگی‌های کلیدی

- {3–5 bullets, each true for this product, key numbers in bold}

## مشخصات فنی

::: info منبع مقادیر
مقادیر زیر از دیتاشیت آی‌سی {vendor} استخراج شده‌اند (مقادیر نمونه آی‌سی). مقادیر اندازه‌گیری‌شده روی ماژول پس از تست منتشر می‌شوند.
:::

| پارامتر | مقدار | واحد | توضیحات |
| :--- | :--- | :--- | :--- |
| **ولتاژ ورودی ($V_{IN}$)** | … | V | … |
| … | | | |
| **ابعاد برد** | {X} × {Y} × {T} | mm | جزئیات در [مشخصات مکانیکی](#مشخصات-مکانیکی) |

### نسخه <span class="latin">{VARIANT_IC}</span>   <!-- (if a rare variant exists) -->

نسخه اصلی این ماژول با `{MAIN_IC}` عرضه می‌شود. {when/why the variant}؛ اگر این نسخه را در اختیار دارید، تفاوت اصلی آن در {…} است:

| ویژگی | `{MAIN_IC}` | `{VARIANT_IC}` |
| :--- | :--- | :--- |
| {only differing parameters} | | |

## پایه‌ها و روش‌های اتصال

{N} پایه در یک ردیف در لبه پایین برد قرار دارند (از چپ به راست، با نگاه از روی برد):

| ترتیب | کانکتور | برچسب روی برد | عملکرد |
| :---: | :---: | :--- | :--- |
| 1 | `J1-1` | `V.IN` | … |

{Notes on shared grounds / large solder pads, if any.}

### سه روش استفاده   <!-- adapt to the product's real mounting options -->

ماژول **بدون پین‌هدر لحیم‌شده** ارسال می‌شود و پین‌هدرهای **زاویه‌دار (Right-Angle)** همراه آن است. …

1. **نصب عمودی روی برد اصلی (PCB Mount)** — … فوت‌پرینت آماده `{CODE}_{NAME}` در [کتابخانه آلتیوم](#دانلود-فایل‌ها) موجود است.
2. **اتصال با سیم جامپر** — با پین‌هدر لحیم‌شده، از سیم‌های جامپر سرماده …
3. **لحیم مستقیم سیم** — …

## {Setup section, e.g. تنظیم ولتاژ خروجی}   <!-- (if the product has a setting) -->

{Formula, what turning the trimmer does, a danger box for anything that can destroy a load,
a numbered step-by-step procedure.}

### نسخه ولتاژ ثابت (بدون پتانسیومتر)   <!-- (adjustable outputs) -->

برای ولتاژ ثابت …، می‌توانید `POT1` را از روی برد جدا (دی‌لحیم) کنید و به جای آن مقاومت `R2` … را با مقدار زیر لحیم کنید:

| ولتاژ هدف | مقدار محاسبه‌شده `R2` | نزدیک‌ترین مقدار `E96` | ولتاژ واقعی |
| :--- | :--- | :--- | :--- |
| **3.3 V** | … | … | … |
| **5.0 V** | … | … | … |

## نقشه شماتیک

<div class="module-figure">
  <img src="/modules/{code}/schematic.svg" alt="شماتیک ماژول {CODE} {MAIN_IC}" />
</div>

## مشخصات مکانیکی

| پارامتر | مقدار | توضیحات |
| :--- | :--- | :--- |
| **ابعاد برد** | {X} × {Y} mm | — |
| **ضخامت برد** | {T} mm | — |
| **بلندترین قطعه** | ≈ {H} mm | {part} از سطح برد |

## مدل سه‌بعدی

<ClientOnly>
  <Model3D
    :variants="[
      { label: 'با پین‌هدر', src: '/modules/{code}/{code}.glb' },
      { label: 'بدون پین‌هدر', src: '/modules/{code}/{code}-no-headers.glb' }
    ]"
    poster="/modules/{code}/top.webp"
    alt="مدل سه‌بعدی ماژول {CODE} {MAIN_IC}"
  />
</ClientOnly>

## دانلود فایل‌ها

<div class="downloads">
  <a href="/modules/{code}/downloads/EM_LIB.IntLib" download>
    <span class="dl-title">📚 کتابخانه آلتیوم (شماتیک + فوت‌پرینت)</span>
    <span class="dl-meta">EM_LIB.IntLib · {size}</span>
  </a>
  <a href="/modules/{code}/downloads/{CODE}_{NAME}_v{VERSION}.step" download>
    <span class="dl-title">🧊 مدل سه‌بعدی STEP</span>
    <span class="dl-meta">{CODE}_{NAME}_v{VERSION}.step · {size}</span>
  </a>
</div>

## تاریخچه نسخه‌ها

| نسخه | تاریخ | تغییرات |
| :--- | :--- | :--- |
| **{VERSION}** | {YYYY-MM-DD} | نسخه فعلی |
````

Fixed-resistor values: $R_2 = \dfrac{R_1 \times V_{REF}}{V_{OUT} - V_{REF}}$, then pick the
nearest E96 value and recompute the real output — show both.
