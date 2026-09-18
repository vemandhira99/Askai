# Ask Akashic BI — Superset Ask AI Copilot (End-User Scope)

[![Deploy to GitHub Pages](https://github.com/vemandhira99/Askai/actions/workflows/deploy.yml/badge.svg)](https://github.com/vemandhira99/Askai/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=flat-square)](https://vemandhira99.github.io/Askai/)
[![Built with Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

An interactive, enterprise-grade AI analytics copilot for **Apache Superset**, purposefully designed for the **End User** persona (business executives, VPs, product & marketing leaders).

---

## 🎯 The End-User Persona & Workflow

Based on executive feedback:
> *"Define your user first. Our first scope is the end user. End users are always served pre-built, populated dashboards. They do not write SQL or care about schema builders — they need fast executive briefings, 1-click team sharing, and instant macro slicing."*

### 1. The 70:30 Split-Screen Experience
- **1-Click Launch**: Clicking the single **`[ Ask AI ]`** button in the dashboard control bar splits the workspace into a **70:30 ratio** in the same window.
  - **70% (Left)**: The active Apache Superset dashboard with 9 production charts.
  - **30% (Right)**: The dedicated Ask AI copilot dock with zero horizontal clutter.
- **Uncluttered Dashboard Toolbar**: Strictly **ONE `[ Ask AI ]` button** and `···` on the right side of the control strip, mirroring real Superset production deployments.

### 2. Microsoft Teams Native Sharing & Preview Modal
End users in modern enterprises operate primarily inside **Microsoft Teams**. We provide:
- **`[ 📋 Copy for Teams ]`**: Formats the executive briefing into an optimized adaptive markdown format designed for Teams channel posts.
- **`[ Preview ]` Modal**: An authentic interactive Microsoft Teams channel message preview (sender chip, timestamps, KPI badges, risk callout, and 1-click clipboard copy) so users know exactly what their team will see before posting.

### 3. 3-Minute Leadership Standup & Meeting Prep Mode
End users frequently need to report numbers in daily standups or leadership meetings without reading full dashboards:
- **`[ 🎙️ Meeting Prep ]` Toggle**: Instantly transforms the executive briefing into 3 structured talking points:
  1. 🟢 **The Growth Highlight (What's Working)**: $8,920.4M total catalog volume, Nintendo 72% dominance, Action/Sports driving 34.7% ($3.08B).
  2. 🔴 **The Risk / Vulnerability (What Leadership Will Ask)**: 49.2% single-market concentration in North America, post-2008 boxed title decline.
  3. 🔵 **Strategic Meeting Question (Today's Action)**: European localized publishing expansion and handheld RPG co-development.
- Includes pre-loaded suggestion: *"Prep me for my 10 AM leadership standup"*.

### 4. In-Chart Contextual "Explain This Chart"
Each of the 9 production Superset charts features a discrete **`[ 💡 Explain ]`** button in the card header:
- Highlights the active chart with a deep navy focus ring (`ring-2 ring-[#1e295b]`).
- Opens the Ask AI dock and outputs exactly **2 plain-English bullet points** (Core Finding & Business Takeaway).
- Zero technical SQL exposure — 100% focused on business interpretation.

### 5. Smart Dashboard Slicing
Quick-filter chips inside the AI dock dynamically highlight relevant charts on the host dashboard:
- **`🎮 Focus: Nintendo`**: Highlights Nintendo titles in the Top 10 table, Donut (72% share), and Consoles Treemap.
- **`🌍 Focus: North America`**: Highlights NA platforms ($601M Xbox 360) and Regional Sales Share (49.2%).
- **`📅 Focus: 2000s Boom`**: Highlights the 2008 peak ($678.9M) on the trajectory line and the 2000s decade card (52% of all-time sales).
- **`Reset ✕`**: Restores the dashboard to baseline view.

### 6. Decision-Centric Questions for Executive Review
Pre-configured high-impact questions tailored for strategy reviews:
1. *"Prep me for my 10 AM leadership standup"*
2. *"What are the top 3 drivers of Nintendo's dominance?"*
3. *"Compare handheld consoles (DS / GBA) vs home consoles"*
4. *"Why did sales decline after the 2008 peak?"*
5. *"What is our revenue exposure outside North America?"*

---

## 📊 9 Production Superset Charts (3x3 Responsive Grid)

| # | Chart Name | Visual Type | Highlights |
|---|---|---|---|
| **1** | **Top 10 Games (by Global Sales)** | Table | Real copy counts (Wii Sports 82.74M, Super Mario Bros 40.24M, Mario Kart Wii 35.82M) |
| **2** | **Publishers of Top 25 Games** | Donut | Nintendo (72%), Take-Two Interactive (16%), Activision (12%) |
| **3** | **Top 10 Consoles, by # of Hit Games** | Treemap | Nintendo DS (2.16k), GBA (822), GC (556), 3DS (509), 2600 (133), GB (98) |
| **4** | **Genre Sales Breakdown** | Horizontal Bars | Action ($1,751.2M), Sports ($1,330.9M), Shooter ($1,037.4M), RPG ($927.4M) |
| **5** | **Annual Sales Trajectory (1980-2020)** | Area Chart | Multi-decade timeline highlighting the 2008 all-time peak of $678.9M |
| **6** | **Regional Sales Market Share** | 4-Region Donut | North America (49.2%), Europe (27.3%), Japan (14.5%), Other (9.0%) |
| **7** | **Top Platforms (by NA Sales)** | Ranked Bars | Xbox 360 ($601.0M), PS2 ($582.9M), Wii ($507.5M), PS3 ($392.3M) |
| **8** | **Annual Title Volume** | Column Trend | Annual catalog releases peaking at 1,428 titles in 2008 |
| **9** | **Global Sales by Decade** | Decade Cards | 1980s ($382M), 1990s ($1.28B), 2000s ($4.64B / 52% share), 2010s ($2.62B) |

---

## 🛡️ Zero AI Slop Guarantee
- **No Cheesy Emojis or Robotic Jargon**: Eliminated generic AI buzzwords (*"synthesizing neural weights"*, *"quantum matrix"*, etc.).
- **Enterprise Executive Tone**: Crisp, factual explanations directly grounded in verified catalog data.
- **Hidden Technical Noise**: Raw SQL queries and database schemas are tucked away from End Users, keeping the focus entirely on business decisions.

---

## 🚀 Quick Start & Local Development

### Prerequisites
- Node.js 18+ or 20+
- npm 9+

### Installation
```bash
# Clone the repository
git clone https://github.com/vemandhira99/Askai.git
cd Askai

# Install dependencies
npm install

# Start development server
npm run dev
```
Open **`http://localhost:5173`** in your browser.

### Production Build
```bash
npm run build
```
Generates production assets in `dist/` with relative asset linking (`base: './'`).

---

## 🌐 Deployment to GitHub Pages

This repository includes an automated GitHub Actions deployment workflow located at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

### To Enable GitHub Pages:
1. Go to your repository on GitHub: **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.
3. On every push to the `main` branch, the workflow builds the project and deploys it automatically.
4. Your live app will be accessible at:
   ```
   https://vemandhira99.github.io/Askai/
   ```

---

## 📁 Repository Structure

```
akashic-bi-wireframe/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── src/
│   ├── components/
│   │   ├── layout/             # Top Navbar, Subnav bar, Control bar
│   │   ├── transcript/         # Assistant turn, User turn, Executive Briefing
│   │   ├── artifact/           # Visual canvas & chart artifacts
│   │   └── modals/             # Business glossary & icon customization
│   ├── data/
│   │   └── mockData.ts         # 9 production chart datasets & catalog metrics
│   ├── state/
│   │   └── useChatEngine.ts    # Chat state, 70:30 split, and decision queries
│   ├── types/
│   │   └── bi.ts               # Core TypeScript data schemas
│   ├── App.tsx                 # Main 3x3 dashboard grid & Ask AI dock
│   └── main.tsx                # React entry point
├── wireframe_preview.html      # Standalone single-file HTML wireframe
├── vite.config.ts              # Vite configuration with relative base './'
├── package.json                # Project dependencies and build scripts
└── README.md                   # Project documentation
```

---

## 📄 License
MIT License. Akashic Business Intelligence Copilot.
