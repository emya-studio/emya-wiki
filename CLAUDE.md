# CLAUDE.md - Emya Hardware Wiki

Comprehensive guide and instructions for Claude Code and AI agents working on this repository.

## Repository Overview
- **Project**: Emya Electronics & Hardware Documentation Wiki
- **Organization**: `emya-studio`
- **Engine**: VitePress 1.6+ (Vue 3, Vite, TypeScript)
- **Deployment**: GitHub Actions -> GitHub Pages (Zero-cost hosting with custom domain `wiki.emya.tech`)
- **Primary Language**: Persian (`fa-IR`) with full Right-to-Left (RTL) support

---

## 🛠️ CLI Commands

```bash
# Install dependencies
npm install

# Start local dev server (default: http://localhost:5173)
npm run docs:dev

# Build static production site to docs/.vitepress/dist
npm run docs:build

# Preview static production build locally
npm run docs:preview
```

---

## 📐 Project Structure

```
emya-wiki/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions Pages deployment
├── docs/
│   ├── .vitepress/
│   │   ├── config.mts             # VitePress config (nav, sidebar, search, logo)
│   │   └── theme/
│   │       ├── custom.css         # Persian RTL, custom tables, layout rules
│   │       └── index.ts          # Interactive sidebar resizer and theme init
│   ├── public/
│   │   ├── CNAME                  # Custom domain configuration (wiki.emya.tech)
│   │   ├── emya-wiki-logo-light.svg
│   │   ├── emya-wiki-logo-dark.svg
│   │   └── favicon.svg            # Emya hardware symbol (< ● >)
│   ├── index.md                   # Wiki landing page
│   ├── products/                  # 1. Emya commercial products (Emya Pro, Sensor Node)
│   ├── dev-boards/                # 2. DevKits & test baseboards
│   ├── converters/                # 3. DC-DC bucks, USB-to-UART, Level Shifters
│   ├── mcu-modules/               # 4. ESP32-S3, Cortex-M modules
│   └── software/                  # 5. SDK setup, flashing, C/C++ drivers
├── package.json
├── CLAUDE.md                      # AI instructions and codebase rules
├── AGENT.md                       # Agent contributor guidelines
└── README.md                      # Human contributor guide
```

---

## ⚠️ Core Engineering & Styling Rules

1. **RTL & Bidi Rules**:
   - Site direction is `rtl`. Default body font is `Vazirmatn`.
   - Technical values, hex numbers (`0x76`), pin names (`GPIO43`), formulas, code blocks (`c`, `bash`, `json`), and units must strictly remain LTR (`direction: ltr !important; text-align: left !important;`).
2. **Table Responsiveness**:
   - Every markdown table in `.vp-doc` is styled as `display: block; overflow-x: auto;` with min-width constraints (`110px` min per column) to ensure smooth horizontal swipe on mobile without column crushing.
3. **Navbar & Sidebar Geometry**:
   - Sidebar is on the right (`right: 0; width: var(--vp-sidebar-width)`).
   - Sidebar resizer handle lives on the left edge of `.VPSidebar` (resizable between 220px and 520px with `localStorage` persistence).
   - Main content starts right at the edge of the sidebar without artificial dead space (`padding-right: var(--vp-sidebar-width)`).
   - Document aside / outline (`سرفصل‌های این صفحه`) is strictly placed on the left (`order: 2; width: 240px`).
   - Hamburger button (`.VPNavBarHamburger`) is strictly hidden on desktop (`min-width: 768px`) and visible only on mobile.
