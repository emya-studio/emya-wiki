# AGENT.md - Guidelines for AI Agents

Guidelines for AI agents (Claude, Cursor, Copilot, Codex) modifying or extending the Emya Hardware Documentation Wiki.

## Mission
Maintain a single source of truth for Emya electronic specifications, product manuals, pinouts, and embedded software documentation.

---

## 5 Core Sections & Directory Mapping

All documentation content must be filed under one of the 5 canonical sections:

| # | Section | Directory | Purpose |
| :-: | :--- | :--- | :--- |
| **1** | **محصولات امیا** | `docs/products/` | Commercial devices, datasheets, industrial telemetry units. |
| **2** | **بردهای توسعه** | `docs/dev-boards/` | DevKits, breadboard pinouts, schematics, board test fixtures. |
| **3** | **ماژول‌های مبدل** | `docs/converters/` | Power supplies, buck/boost regulators, USB-to-UART, level shifters. |
| **4** | **ماژول‌های MCU** | `docs/mcu-modules/` | Microcontroller modules, SoC specs, castellated footprint maps. |
| **5** | **راهنمای توسعه نرم‌افزاری** | `docs/software/` | SDK tutorials, flashing guides, firmware builds, C/C++ drivers. |

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
