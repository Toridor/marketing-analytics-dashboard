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
