# Marketing Analytics Dashboard v2

Responsive interactive marketing analytics portfolio case, built with **HTML, CSS, vanilla JavaScript, and Chart.js**.

## Quick start

Open `index.html` in a browser with internet access (Chart.js loads from a CDN). No build step, API keys or backend required.

## Deploy to GitHub Pages

1. Create a public repository named `marketing-analytics-dashboard`.
2. Upload `index.html`, `styles.css`, `app.js`, and `README.md` to the **repository root**.
3. Go to **Settings → Pages → Build and deployment** and choose **Deploy from a branch**.
4. Select **main** and **/(root)** and save.
5. Your site will appear at `https://YOUR_USERNAME.github.io/marketing-analytics-dashboard/` once deployed.

## Features

- Channel selector recalculates KPI cards, charts, channel table and goal events.
- Traffic distribution doughnut and purchase conversion bar chart (Chart.js).
- Conversion goals, marketing insights and CSV export.
- Responsive desktop/mobile dark UI.

## Data provenance

**Educational synthetic/reconstructed data**, based on a November 2026 GA4 learning exercise. This is not a real Google Analytics export and does not represent the performance of any real company.

| Channel | Sessions | Leads | Purchases |
|---|---:|---:|---:|
| Organic Search | 4,000 | 160 | 32 |
| Paid Search | 2,000 | 140 | 28 |
| Organic Social | 3,000 | 60 | 6 |
| Email | 1,000 | 100 | 30 |

No time series, revenue, ad spend or user-level journeys are available; CAC, CPA and ROAS are therefore not estimated. Leads and purchases are separate goal counts, **not** a verified sequential funnel.
