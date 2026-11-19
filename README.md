# Marketing Analytics Dashboard — GA4 Portfolio Case

Static HTML/CSS/JavaScript/Chart.js portfolio dashboard for GitHub Pages.

## Data provenance
Google Analytics 4 **Demo Account**, Google Merchandise Store, **2026-10-22 through 2026-11-18**. Channel data transcribed from GA4 report screenshots supplied by the project owner; not a direct GA4 CSV export.

- Reported total sessions: **153,914**
- Sum of ten displayed channel rows: **151,314** (unreconciled difference: **2,600**)
- `purchase` key events: **2,052**
- Total revenue: **USD 334,516.59**

`purchase events / sessions` is a descriptive event-per-session ratio, **not** the percentage of sessions with a purchase. Paid media cost, CTR, CPC, CPA, CAC, ROAS, day-level trend and sequential ecommerce funnel are not available in the screenshots and are not invented.

## Deploy
Upload `index.html`, `styles.css`, `app.js` and this README to the root of the GitHub Pages repository. Settings → Pages → Deploy from branch → `main` → `/ (root)`.

## Editing / import
Data Studio supports CSV/XLSX with `channel,sessions,purchases,revenue` (optional `leads`, `impressions`, `clicks`, `spend`, `new_customers`). Local edits persist in browser localStorage; they do not change the published repository. Restore GA4 clears local edits.

Chart.js and XLSX libraries load from CDNs; internet is required.


## v4.0: Paid Ads Simulation

- The GA4 demo dataset is used for the observed traffic, purchases, and revenue reports.
- The advertising section offers **GA4 · observed** and **Paid Ads Simulation · synthetic** modes. The latter is a completely fictional teaching example (including revenue and purchases); it is **not** Google Ads or GA4 export data.
- Synthetic data is defined in `PAID_SIM` in `app.js` and downloadable from the dashboard as a CSV. It is deliberately separate from the GA4 dataset and never overwrites it.
- CTR = clicks / impressions; CPC = spend / clicks; CPA = spend / purchases; CAC = spend / new customers; ROAS = revenue / spend.
- Lead columns were removed from the channel conversion report because the provided GA4 demo dataset has no lead-event measurements.
- The provided daily CSV contains aggregate `All channels` rows only; the dashboard flags this when a specific channel is selected.


## Insights & Strategy editor (v4.1)
Open Insights & Strategy and click Add or Edit to manage findings and recommendations without editing JavaScript. Cards support type, priority and status. Changes persist in the current browser using localStorage, separately for each language and dataset mode. JSON backup/export and import support transfer to another browser. **GitHub Pages is static: edits are NOT automatically shared with other visitors.** To publish default content globally, a later repository update or authenticated backend is required.


### v5.3 — Смысловая локализация GA4
Русские названия каналов используются в графиках, легендах, фильтрах и таблицах. Исходные английские идентификаторы каналов и экспортируемые CSV не изменяются. Переведены пояснения к KPI и статусы карточек.


## Version 5.5 — synthetic advertising KPI lab

The advertising section defaults to a **clearly labeled fictional scenario**, separate from GA4 observations. The two invented channel rows have impressions, clicks, spend, leads, purchases, new customers and revenue; every KPI is calculated from these raw fields at runtime. The scenario must never be presented as actual GA4 or Google Ads performance. Switch the selector to GA4 to view real data, where missing advertising inputs remain unavailable.

Formulas: CTR=clicks/impressions; CPC=spend/clicks; CPM=1000×spend/impressions; CPL=spend/leads; CPA=spend/purchases; CAC=spend/new customers; ROAS=revenue/spend; click-to-purchase=purchases/clicks; click-to-lead=leads/clicks; AOV=revenue/purchases. Ratios are calculated on aggregated numerators and denominators, never averaged across channel rates.


## v5.6 — Conversion funnel modes

The Conversions page includes independent GA4 and synthetic funnel modes. GA4 does not claim sequential stage data unless a stage/users CSV has been imported. Synthetic mode has five fictional stages (10,000 → 4,200 → 1,680 → 840 → 504), and calculates first-to-last and step-to-step conversion rates. The toggle does not change GA4 data, advertising KPIs, or the selected channel.


## 5.6.2
Data Studio editor table headers and channel display labels switch between RU and EN. Internal GA4 channel IDs and CSV export remain unchanged.
