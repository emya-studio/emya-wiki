# AGENT.md - Guidelines for AI Agents

Guidelines for AI agents (Claude, Cursor, Copilot, Codex) modifying or extending the Emya Hardware Documentation Wiki.

## Mission
Maintain a single source of truth for Emya electronic specifications, product manuals, pinouts, and embedded software documentation.

---

## Sections & Directory Mapping

All documentation content must be filed under one of these sections:

| # | Section | Directory | Purpose |
| :-: | :--- | :--- | :--- |
| **1** | **ماژول‌های تغذیه** | `docs/power-modules/` | Emya power modules: TPS54202 buck converter, CN3702 Li-ion charger. |
| **2** | **راهنمای توسعه نرم‌افزاری** | `docs/software/` | Coming soon — placeholder page only. |

---

## Standard Component Spec Template

When adding any new hardware component or module, follow this standard structure:

```markdown
# [Component Name]

[One sentence summary of function and hardware purpose.]

## جدول مشخصات سریع (Quick Reference)

| پارامتر | مقدار | واحد | توضیحات |
| :--- | :--- | :--- | :--- |
| **ولتاژ کاری (VDD)** | 3.0 تا 3.6 | V | ولتاژ نامی 3.3V |
| **جریان مصرفی** | ... | mA | در حداکثر بار کاری |

---

## مقادیر بیشینه مجاز (Absolute Maximum Ratings)

::: danger هشدار تنش الکتریکی
اعمال تنش‌هایی فراتر از این حدود به خرابی دائمی منجر می‌شود.
:::

| نماد | پارامتر | حداقل | حداکثر | واحد |
| :--- | :--- | :--- | :--- | :--- |

---

## جدول پین‌ها و پایه‌ها (Pinout)

| شماره پین | نام پایه | نوع | شرح عملکرد | نکات فنی |
| :---: | :--- | :--- | :--- | :--- |

---

## الزامات مدارات محافظ و دیکوپلینگ
- خازن‌های دیکوپلینگ پیشنهادی
- مقاومت‌های پول‌آپ یا دمپینگ سری
```

---

## Module Pages (Assets, 3D Model, Downloads)

Reference implementation: `docs/power-modules/tps54202.md` (EML01).

- **Assets** live in `docs/public/modules/<code>/` (e.g. `eml01/`):
  - `top.webp`, `top-headers.webp`, `bottom.webp` — Altium 3D renders, background removed and cropped
  - `schematic.svg`, `pcb-top.svg` — vector pages converted from the Altium PDF (`pdftocairo -svg`)
  - `<code>.glb`, `<code>-no-headers.glb` — 3D models for the `<Model3D>` viewer
  - `downloads/` — IntLib, STEP and PDF files offered for download
- **3D models** are generated from the STEP file, never edited by hand:
  1. Describe the module in `scripts/models/<code>.json` (STEP path, board textures, part colours, outputs).
  2. Run `npm run model scripts/models/<code>.json`.
- **3D viewer**: `<ClientOnly><Model3D :variants="[...]" poster="..." /></ClientOnly>` (component in `docs/.vitepress/theme/components/Model3D.vue`).
- **Latin digits**: the site font uses Persian digits (`ss01`). Wrap part numbers and codes outside of `code` spans in `<span class="latin">…</span>`.
- **Do not publish unverified numbers**: values from an IC datasheet must be labelled as such until measured on the module.

---

## Updating Navigation & Sidebar

When creating a new file:
1. Create the markdown file under `docs/<section>/<filename>.md`.
2. Add the page entry to the `sidebar` array in `docs/.vitepress/config.mts` under the appropriate group.
3. Test the build before committing:
   ```bash
   npm run docs:build
   ```
4. Verify that no broken links or missing assets were introduced.

---

## External Links Reference
- **Main / Studio**: `https://emya.ir`
- **Shop**: `https://shop.emya.ir`
- **Wiki**: Hosted at `https://wiki.emya.tech` (mapped via `docs/public/CNAME`)
