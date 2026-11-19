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
