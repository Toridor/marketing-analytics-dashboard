# Marketing Analytics Dashboard 3.0

Interactive static portfolio dashboard (HTML, CSS, JavaScript, Chart.js). Free GitHub Pages hosting.

## Features
- Channel comparison, KPIs, daily traffic and purchase trends (7/30/90 days)
- Advertising metrics: CTR, CPC, CPA, CAC and ROAS, only where input data supports calculation
- Synthetic sequential ecommerce funnel (separate from aggregate channel leads)
- Data Studio: editable channel table, CSV and XLSX import, local persistence, CSV export
- RU/EN switch, responsive dark interface

## Import schema

`channels.csv`: `channel,sessions,leads,purchases,impressions,clicks,spend,revenue,new_customers`

Only the first four fields are required. Spend and revenue are assumed to be in **USD** in this version. Do not mix currencies. Impressions and clicks are optional, as are advertising costs and new customers.

`daily.csv`: `date,channel,sessions,purchases` (date format `YYYY-MM-DD`).

`funnel.csv`: `stage,users` (sequential stages, non-increasing counts).

Excel: place any of these schemas on separate sheets. Sheet names are not significant. Importing a channel file replaces channel data; daily and funnel imports replace their respective datasets. Imported daily data is shown only for its available dates; date filter shows up to 7/30/90 most recent dates.

The initial daily series, ad costs and ecommerce funnel are **synthetic examples**, not actual GA4 exports. Original channel counts are educational. When channels are imported, synthetic trend and funnel are not presented as if they were derived from those imported channels. Imported data is processed locally in the browser and saved in `localStorage`; it is **not** automatically shared with visitors or published to GitHub. To publish a shared dataset, a future version would need a checked-in public data file or a backend. Do not upload sensitive data to a public repository.

## GitHub Pages
Upload `index.html`, `styles.css`, `app.js`, and `README.md` into the repository root. In Settings → Pages choose Deploy from a branch, `main`, `/(root)`.

Chart.js and SheetJS are loaded via CDN, so the initial page needs internet access. The site has no backend.
