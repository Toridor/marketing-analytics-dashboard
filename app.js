'use strict';
const DEMO=[{channel:'Organic Search',sessions:4000,leads:160,purchases:32},{channel:'Paid Search',sessions:2000,leads:140,purchases:28,impressions:110000,clicks:3600,spend:2400,revenue:5600,new_customers:24},{channel:'Organic Social',sessions:3000,leads:60,purchases:6},{channel:'Email',sessions:1000,leads:100,purchases:30}];
const GA4=[{"channel":"Direct","sessions":75235,"purchases":895,"revenue":123986.43},{"channel":"Organic Search","sessions":33827,"purchases":568,"revenue":120728.12},{"channel":"Unassigned","sessions":6335,"purchases":345,"revenue":42602.38},{"channel":"Referral","sessions":6038,"purchases":124,"revenue":28271.55},{"channel":"Paid Search","sessions":26758,"purchases":47,"revenue":10556.9},{"channel":"Cross-network","sessions":1685,"purchases":25,"revenue":3402.42},{"channel":"Organic Social","sessions":879,"purchases":29,"revenue":3389.17},{"channel":"Organic Shopping","sessions":397,"purchases":14,"revenue":1189.37},{"channel":"Email","sessions":92,"purchases":2,"revenue":284.96},{"channel":"Organic Video","sessions":68,"purchases":3,"revenue":105.29}];
// Explicitly synthetic advertising scenario. Not GA4, Google Ads, or measured spend.
const PAID_SIM=[
 {channel:'Paid Search',impressions:840000,clicks:29400,spend:19200,leads:1650,purchases:420,new_customers:310,revenue:52500},
 {channel:'Cross-network',impressions:310000,clicks:9800,spend:7800,leads:540,purchases:175,new_customers:130,revenue:21700}
];
let adsMode='simulation';
const PALETTE=['#77e7bd','#a69afc','#f4bd79','#76b9f9','#e98eb8','#f5e28b'];
const $=id=>document.getElementById(id), clone=x=>JSON.parse(JSON.stringify(x));
const locale=()=>lang==='ru'?'ru-RU':'en-US',num=n=>new Intl.NumberFormat(locale(),{maximumFractionDigits:2}).format(n),rate=(n,d)=>d>0?n/d*100:null, percent=n=>n===null?'—':num(n)+'%',money=n=>n==null?'—':new Intl.NumberFormat(locale(),{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n),safe=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let lang='ru',rows=clone(GA4),daily=[],funnel=[],charts=[],source='ga4';
try{const saved=JSON.parse(localStorage.getItem('marketingLabV3')||'null');if(saved&&Array.isArray(saved.rows)){rows=saved.rows;daily=saved.daily||[];funnel=saved.funnel||[];source='local'}}catch{}
const I={ru:{sessions:'Сеансы',leads:'Заявки',purchases:'Покупки',cr:'CR покупки',traffic:'Трафик выбранных каналов',ofSessions:'от сеансов',channel:'Канал',period:'Период',trend:'Динамика трафика и покупок',trendSub:'Ежедневные показатели выбранного периода',admetrics:'Рекламные метрики',adSub:'CTR, CPC, CPA, CAC и ROAS — при наличии данных',studio:'Редактор и импорт данных',studioSub:'CSV / XLSX, редактирование таблицы и локальное сохранение',import:'Импорт CSV / Excel',add:'+ Добавить канал',apply:'Применить изменения',reset:'Вернуть демо',all:'Все каналы',noData:'Нет данных',demo:'Синтетический пример',real:'Импортированные данные',funnel:'Воронка электронной коммерции',insights:'Выводы и рекомендации',email:'Высокая конверсия Email',paid:'Оценить окупаемость Paid Search',social:'Проверить путь Organic Social',other:'Измерять полную воронку',emailText:'Проверьте удержание, повторные покупки и размер аудитории перед масштабированием.',paidText:'Сравните стоимость привлечения и выручку. Не отключайте канал только из-за относительной конверсии.',socialText:'Проверьте соответствие креативов посадочным страницам и мобильную конверсию.',otherText:'Настройте события view_item, add_to_cart, begin_checkout и purchase.',save:'Данные применены и сохранены в этом браузере.',resetText:'Учебные данные восстановлены.',bad:'Ошибка импорта: ',missing:'Нет данных для расчёта'},en:{sessions:'Sessions',leads:'Leads',purchases:'Purchases',cr:'Purchase CR',traffic:'Traffic from selected channels',ofSessions:'of sessions',channel:'Channel',period:'Period',trend:'Traffic and purchase trend',trendSub:'Daily metrics for the selected period',admetrics:'Paid media metrics',adSub:'CTR, CPC, CPA, CAC and ROAS — when available',studio:'Data editor and import',studioSub:'CSV / XLSX, edit and save locally',import:'Import CSV / Excel',add:'+ Add channel',apply:'Apply changes',reset:'Restore demo',all:'All channels',noData:'No data',demo:'Synthetic example',real:'Imported data',funnel:'Ecommerce funnel',insights:'Insights and recommendations',email:'Email has high conversion',paid:'Evaluate Paid Search profitability',social:'Review Organic Social journey',other:'Measure the full funnel',emailText:'Check retention, repeat purchases and audience size before scaling.',paidText:'Compare acquisition costs with revenue. Do not pause a channel based only on its conversion rate.',socialText:'Review creative-to-landing-page fit and mobile conversion.',otherText:'Track view_item, add_to_cart, begin_checkout and purchase events.',save:'Data applied and saved in this browser.',resetText:'Demo data restored.',bad:'Import error: ',missing:'Insufficient data'}};
const t=k=>I[lang][k]||k;
function color(i){return PALETTE[i%PALETTE.length]}
function selected(){let c=$('channel').value;return c==='all'?rows:rows.filter(r=>r.channel===c)}
function total(arr,k){return arr.reduce((s,r)=>s+(Number.isFinite(r[k])?r[k]:0),0)}
function allHave(arr,keys){return arr.length>0&&arr.every(r=>keys.every(k=>Number.isFinite(r[k])))}
function destroyCharts(){charts.forEach(c=>c.destroy());charts=[]}
function chart(id,config){if(typeof Chart==='undefined')return;const canvas=$(id);if(!canvas)return;try{charts.push(new Chart(canvas,config))}catch(error){console.error('Chart render error',id,error);const msg=document.createElement('div');msg.className='chart-error';msg.textContent='Не удалось построить график';canvas.parentElement.appendChild(msg)}}
function makeDaily(){const result=[];for(let i=89;i>=0;i--){const d=new Date(Date.UTC(2026,10,19));d.setUTCDate(d.getUTCDate()-i);for(let j=0;j<DEMO.length;j++){const r=DEMO[j];const wave=1+0.18*Math.sin((89-i)*0.47+j)+0.08*Math.cos((89-i)*0.21+j);result.push({date:d.toISOString().slice(0,10),channel:r.channel,sessions:Math.round(r.sessions/30*wave),purchases:Math.max(0,Math.round(r.purchases/30*wave))})}}return result}
function getDaily(){return daily.length?daily:source==='demo'?makeDaily():[]}
function getFunnel(){return funnel.length?funnel:source==='demo'?[{stage:'Sessions',users:10000},{stage:'View item',users:2400},{stage:'Add to cart',users:620},{stage:'Begin checkout',users:250},{stage:'Purchase',users:96}]:[]}
function refreshSelect(){const current=$('channel').value;$('channel').innerHTML='<option value="all">'+t('all')+'</option>'+rows.map(r=>'<option value="'+safe(r.channel)+'">'+safe(channelLabel(r.channel))+'</option>').join('');$('channel').value=rows.some(r=>r.channel===current)?current:'all'}
function draw(){const rr=selected(),sessions=total(rr,'sessions'),leads=total(rr,'leads'),purchases=total(rr,'purchases');$('kpis').innerHTML=[[t('sessions'),num(sessions),t('traffic')],[source!=='demo'?(lang==='ru'?'Выручка':'Revenue'):t('leads'),source!=='demo'?money(total(rr,'revenue')):num(leads),source!=='demo'?'GA4 · USD':percent(rate(leads,sessions))+' '+t('ofSessions')],[t('purchases'),num(purchases),percent(rate(purchases,sessions))+' '+t('ofSessions')],[t('cr'),percent(rate(purchases,sessions)),(lang==='ru'?'События покупки / сеансы · приблизительный показатель':'Purchase events / sessions · proxy')]].map(([label,value,foot])=>`<article class="kpi"><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div><div class="kpi-foot">${foot}</div></article>`).join('');$('channelRows').innerHTML=rr.map((r,i)=>`<tr><td><span class="channel-name"><span class="channel-dot" style="background:${color(rows.indexOf(r))}"></span>${safe(channelLabel(r.channel))}</span></td><td>${num(r.sessions)}</td><td>${num(r.purchases)}</td><td>${percent(rate(r.purchases,r.sessions))}</td><td>${percent(rate(r.purchases,purchases))}</td></tr>`).join('');
const funnelRows=getFunnel();const cv=$('conversionOverview');if(cv){const revenue=total(rr,'revenue');cv.innerHTML=`<article class="conversion-stat"><small>${lang==='ru'?'Покупки · события purchase':'Purchases · purchase events'}</small><strong>${num(purchases)}</strong><span>${lang==='ru'?'По выбранным каналам':'Across selected channels'}</span></article><article class="conversion-stat"><small>${lang==='ru'?'Покупки / сеансы · прокси':'Purchases / sessions · proxy'}</small><strong>${percent(rate(purchases,sessions))}</strong><span>${lang==='ru'?'Не доля сеансов с покупкой':'Not purchase-session conversion rate'}</span></article><div class="conversion-explain"><b>${lang==='ru'?'Почему здесь нет полной воронки?':'Why is there no full funnel?'}</b><p>${lang==='ru'?'В GA4-данных доступны сеансы и события purchase, но нет последовательных этапов view_item → add_to_cart → begin_checkout → purchase. Чтобы построить настоящую воронку, импортируйте CSV с полями stage,users в Data Studio.':'The provided GA4 data contains sessions and purchase events, but no sequential ecommerce stages. Import a CSV with stage,users in Data Studio to display a real funnel.'}</p></div>`;}$('funnelBars').innerHTML=(!funnelRows.length&&source!=='demo')?`<div class="conversion-overview"><div class="conversion-stat"><small>${lang==='ru'?'События покупки':'Purchase events'}</small><strong>${num(purchases)}</strong><span>${lang==='ru'?'GA4: событие purchase':'GA4 purchase event'}</span></div><div class="conversion-stat"><small>${lang==='ru'?'Покупки / сеансы':'Purchase events / sessions'}</small><strong>${percent(rate(purchases,sessions))}</strong><span>${lang==='ru'?'Отношение событий к сеансам':'Event-to-session ratio'}</span></div><div class="conversion-explain"><b>${lang==='ru'?'Для последовательной воронки нужны дополнительные события':'Sequential funnel requires additional events'}</b><p>${lang==='ru'?'В GA4 нужно получить view_item, add_to_cart, begin_checkout и purchase по одной согласованной методике. По имеющимся данным нельзя достоверно вычислить переходы между этапами.':'GA4 needs view_item, add_to_cart, begin_checkout and purchase measured consistently. Stage-to-stage progression cannot be inferred from these totals.'}</p></div></div>`:funnelRows.length?funnelRows.map((r,i)=>`<div class="funnel-row"><span class="funnel-label">${safe(r.stage)}</span><div class="funnel-track"><div class="funnel-fill" style="width:${Math.min(100,rate(r.users,funnelRows[0].users)||0)}%"></div></div><span class="funnel-value">${num(r.users)} <small>${percent(rate(r.users,funnelRows[0].users))}</small></span></div>`).join(''):'<p class="table-note">'+(lang==='ru'?'Последовательные этапы не предоставлены. Импортируйте CSV (stage, users) для построения воронки.':'Sequential funnel stages are unavailable. Import CSV (stage, users) to build the funnel.')+'</p>';
const ads=adsMode==='simulation'?PAID_SIM.filter(r=>$('channel').value==='all'||r.channel===$('channel').value):rr.filter(r=>Number.isFinite(r.spend));
const agg={impressions:total(ads,'impressions'),clicks:total(ads,'clicks'),spend:total(ads,'spend'),leads:total(ads,'leads'),revenue:total(ads,'revenue'),purchases:total(ads,'purchases'),new_customers:total(ads,'new_customers')};
const complete=keys=>ads.length>0&&allHave(ads,keys);
const ratio=(n,d)=>d>0?n/d:null;
const moneyRatio=(n,d)=>d>0?money(n/d):'—';
const pctRatio=(n,d)=>d>0?percent(100*n/d):'—';
const multRatio=(n,d)=>d>0?num(n/d)+'×':'—';
const metricDefs=[
 ['impressions',lang==='ru'?'Показы':'Impressions',num(agg.impressions),['impressions']],
 ['clicks',lang==='ru'?'Клики':'Clicks',num(agg.clicks),['clicks']],
 ['spend',lang==='ru'?'Расходы на рекламу':'Ad spend',money(agg.spend),['spend']],
 ['leads',lang==='ru'?'Заявки':'Leads',num(agg.leads),['leads']],
 ['purchases',lang==='ru'?'Покупки':'Purchases',num(agg.purchases),['purchases']],
 ['new_customers',lang==='ru'?'Новые клиенты':'New customers',num(agg.new_customers),['new_customers']],
 ['revenue',lang==='ru'?'Выручка':'Revenue',money(agg.revenue),['revenue']],
 ['CTR','CTR',pctRatio(agg.clicks,agg.impressions),['clicks','impressions']],
 ['CPC','CPC',moneyRatio(agg.spend,agg.clicks),['spend','clicks']],
 ['CPM','CPM',agg.impressions>0?money(agg.spend*1000/agg.impressions):'—',['spend','impressions']],
 ['CPL','CPL',moneyRatio(agg.spend,agg.leads),['spend','leads']],
 ['CPA','CPA',moneyRatio(agg.spend,agg.purchases),['spend','purchases']],
 ['CAC','CAC',moneyRatio(agg.spend,agg.new_customers),['spend','new_customers']],
 ['ROAS','ROAS',multRatio(agg.revenue,agg.spend),['revenue','spend']],
 ['clickCR',lang==='ru'?'Конверсия клика в покупку':'Click-to-purchase rate',pctRatio(agg.purchases,agg.clicks),['purchases','clicks']],
 ['leadCR',lang==='ru'?'Конверсия клика в заявку':'Click-to-lead rate',pctRatio(agg.leads,agg.clicks),['leads','clicks']],
 ['AOV',lang==='ru'?'Средний чек':'Average order value',moneyRatio(agg.revenue,agg.purchases),['revenue','purchases']]
];
$('adKpis').hidden=false;const adsPanel=document.querySelector('#ads .table-panel');if(adsPanel)adsPanel.hidden=false;
$('adKpis').innerHTML=metricDefs.map(([id,label,value,fields])=>{const v=complete(fields)?value:'—';return `<article class="kpi" title="${safe(metricHelp(id,lang))}"><div class="kpi-label">${safe(label)}</div><div class="kpi-value">${v}</div><div class="kpi-foot">${v==='—'?t('missing'):(adsMode==='simulation'?(lang==='ru'?'УЧЕБНЫЕ ДАННЫЕ':'SYNTHETIC DATA'):(lang==='ru'?'ИМПОРТИРОВАННЫЕ ДАННЫЕ':'IMPORTED DATA'))}</div></article>`}).join('');
$('adsRows').innerHTML=ads.length?ads.map(r=>{const has=k=>Number.isFinite(r[k]);const m=(x,y,kind)=>has(x)&&has(y)&&r[y]>0?(kind==='pct'?pctRatio(r[x],r[y]):kind==='money'?moneyRatio(r[x],r[y]):multRatio(r[x],r[y])):'—';return `<tr><td>${safe(channelLabel(r.channel))}</td><td>${has('impressions')?num(r.impressions):'—'}</td><td>${has('clicks')?num(r.clicks):'—'}</td><td>${has('spend')?money(r.spend):'—'}</td><td>${has('leads')?num(r.leads):'—'}</td><td>${has('purchases')?num(r.purchases):'—'}</td><td>${has('new_customers')?num(r.new_customers):'—'}</td><td>${has('revenue')?money(r.revenue):'—'}</td><td>${m('clicks','impressions','pct')}</td><td>${m('spend','clicks','money')}</td><td>${has('spend')&&has('impressions')&&r.impressions>0?money(r.spend*1000/r.impressions):'—'}</td><td>${m('spend','leads','money')}</td><td>${m('spend','purchases','money')}</td><td>${m('spend','new_customers','money')}</td><td>${m('revenue','spend','ratio')}</td><td>${m('purchases','clicks','pct')}</td><td>${m('revenue','purchases','money')}</td></tr>`}).join(''):`<tr><td colspan="17">${lang==='ru'?'Для выбранного канала нет рекламных данных. Выберите «Все каналы», «Платный поиск» или «Кросс-сетевая реклама».':'No ad data for this channel. Choose All channels, Paid Search or Cross-network.'}</td></tr>`;
$('adsDisclosure').textContent=adsMode==='simulation'?(lang==='ru'?'УЧЕБНЫЙ СЦЕНАРИЙ · ВСЕ рекламные показатели, включая покупки и выручку, вымышлены и предназначены только для демонстрации формул. Это НЕ статистика GA4 и НЕ результаты реальных кампаний.':'SYNTHETIC SCENARIO · ALL advertising values, including purchases and revenue, are fictional and demonstrate calculation formulas only. NOT GA4 or actual campaign results.'):(lang==='ru'?'ДАННЫЕ GA4 / ИМПОРТ: расчёты основаны только на доступных полях. Отсутствующие значения обозначены прочерком.':'GA4 / IMPORTED DATA: calculations use only available fields. Missing values appear as dashes.');
renderInsights();
destroyCharts();if(typeof Chart==='undefined'){document.querySelectorAll('.chart-wrap').forEach(w=>{if(!w.querySelector('.chart-error')){const n=document.createElement('p');n.className='chart-error';n.textContent=lang==='ru'?'Библиотека графиков не загрузилась. Проверьте интернет-соединение и обновите страницу.':'Chart.js could not load. Check your connection and refresh.';w.append(n)}});return;}Chart.defaults.color='#aab8d0';Chart.defaults.font.family='DM Sans';chart('trafficChart',{type:'doughnut',data:{labels:rr.map(r=>channelLabel(r.channel)),datasets:[{data:rr.map(r=>r.sessions),backgroundColor:rr.map(r=>color(rows.indexOf(r))),borderColor:'#10192a',borderWidth:5,hoverOffset:8}]},options:{responsive:true,maintainAspectRatio:false,cutout:'69%',plugins:{legend:{position:'bottom',labels:{usePointStyle:true,padding:16,boxWidth:9}}}}});chart('conversionChart',{type:'bar',data:{labels:rr.map(r=>channelLabel(r.channel)),datasets:[{data:rr.map(r=>rate(r.purchases,r.sessions)||0),backgroundColor:rr.map(r=>color(rows.indexOf(r))),borderRadius:7,maxBarThickness:52}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{x:{grid:{display:false}},y:{beginAtZero:true,grid:{color:'#263148'},ticks:{callback:v=>v+'%'}}}}});
const days=Number($('period').value),raw=getDaily(),dates=[...new Set(raw.map(r=>r.date))].sort().slice(-days),series=dates.map(d=>{const a=raw.filter(r=>r.date===d&&( $('channel').value==='all'||r.channel===$('channel').value||r.channel==='All channels'));return {date:d,sessions:total(a,'sessions'),purchases:total(a,'purchases')}});$('trendNote').textContent=($('channel').value!=='all'&&raw.some(r=>r.channel==='All channels'))?(lang==='ru'?'Дневные данные доступны только суммарно по всем каналам; разбивки по выбранному каналу нет.':'Daily series is aggregated for all channels; channel-specific values are unavailable.'):source==='demo'?t('demo')+' · '+(lang==='ru'?'Учебная дневная динамика, не данные GA4.':'Daily traffic series is not the original GA4 dataset.'):daily.length?t('real')+' · '+(lang==='ru'?'Дневные данные из CSV/XLSX.':'Daily CSV/XLSX.'):t('noData')+' · '+(lang==='ru'?'Импортируйте дневные данные (date, channel, sessions, purchases).':'Import daily data (date, channel, sessions, purchases).');chart('trendChart',{type:'line',data:{labels:series.map(r=>r.date.slice(5)),datasets:[{label:t('sessions'),data:series.map(r=>r.sessions),borderColor:'#77e7bd',backgroundColor:'rgba(119,231,189,.12)',fill:true,tension:.35,yAxisID:'y'},{label:t('purchases'),data:series.map(r=>r.purchases),borderColor:'#a69afc',tension:.35,yAxisID:'y1'}]},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},scales:{x:{grid:{display:false},ticks:{maxTicksLimit:12}},y:{beginAtZero:true,grid:{color:'#263148'}},y1:{beginAtZero:true,position:'right',grid:{drawOnChartArea:false}}}}});}
function metricHelp(id,l){const ru={impressions:'Число показов рекламы',clicks:'Число кликов по рекламе',spend:'Расходы на рекламные размещения, USD',leads:'Полученные заявки',purchases:'Покупки, приписанные рекламе в учебном сценарии',new_customers:'Число новых клиентов',revenue:'Выручка от покупок, USD',CTR:'Клики / показы × 100%',CPC:'Расходы / клики',CPM:'Расходы / показы × 1 000',CPL:'Расходы / заявки',CPA:'Расходы / покупки',CAC:'Расходы / новых клиентов',ROAS:'Выручка / расходы на рекламу',clickCR:'Покупки / клики × 100%',leadCR:'Заявки / клики × 100%',AOV:'Выручка / покупки'};const en={impressions:'Ad impressions',clicks:'Ad clicks',spend:'Ad spend, USD',leads:'Leads generated',purchases:'Attributed purchases in the fictional scenario',new_customers:'New customers',revenue:'Attributed revenue, USD',CTR:'Clicks / impressions × 100%',CPC:'Spend / clicks',CPM:'Spend / impressions × 1,000',CPL:'Spend / leads',CPA:'Spend / purchases',CAC:'Spend / new customers',ROAS:'Revenue / ad spend',clickCR:'Purchases / clicks × 100%',leadCR:'Leads / clicks × 100%',AOV:'Revenue / purchases'};return (l==='ru'?ru:en)[id]||id;}
function renderEditor(){const fields=['channel','sessions','leads','purchases','impressions','clicks','spend','revenue','new_customers'];$('editorRows').innerHTML=rows.map((r,i)=>`<tr data-index="${i}">${fields.map(f=>`<td><input aria-label="${f}" data-field="${f}" ${f==='channel'?'type="text"':'type="number" min="0" step="any"'} value="${safe(r[f]??'')}"></td>`).join('')}<td><button class="remove-row" type="button" data-remove="${i}" aria-label="Remove row">×</button></td></tr>`).join('');}
function persist(){try{localStorage.setItem('marketingLabV3',JSON.stringify({rows,daily,funnel}))}catch{}}
function apply(){const fields=['sessions','leads','purchases','impressions','clicks','spend','revenue','new_customers'];const result=[...$('editorRows').querySelectorAll('tr')].map(tr=>{const x={channel:tr.querySelector('[data-field="channel"]').value.trim()};fields.forEach(k=>{const raw=tr.querySelector(`[data-field="${k}"]`).value.trim();if(raw!=='')x[k]=Number(raw)});return x});if(result.some(r=>!r.channel||['sessions'].some(k=>!Number.isFinite(r[k])||r[k]<0)||Object.keys(r).some(k=>k!=='channel'&&(!Number.isFinite(r[k])||r[k]<0)))){status(t('bad')+'Channel and sessions are required; numbers must be nonnegative.');return}if(new Set(result.map(r=>r.channel)).size!==result.length){status(t('bad')+'Duplicate channels');return}rows=result;source='local';persist();refreshSelect();draw();status(t('save'))}
function status(s){$('importStatus').textContent=s}
function parseCSV(text){text=text.replace(/^\uFEFF/,'');const first=text.split(/\r?\n/)[0]||'';const delim=(first.match(/;/g)||[]).length>(first.match(/,/g)||[]).length?';':',';let out=[],row=[],cell='',quoted=false;for(let i=0;i<text.length;i++){let c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++}else quoted=!quoted}else if(c===delim&&!quoted){row.push(cell);cell=''}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(x=>x.trim()))out.push(row);row=[];cell=''}else cell+=c}row.push(cell);if(row.some(x=>x.trim()))out.push(row);return out}
function normalize(table){const keys=(table[0]||[]).map(x=>String(x).trim().toLowerCase().replace(/[\s-]+/g,'_'));return table.slice(1).filter(r=>r.some(v=>String(v??'').trim())).map(r=>Object.fromEntries(keys.map((k,i)=>[k,r[i]??''])))}
function numberField(v){if(v===null||v===undefined||String(v).trim()==='')return undefined;let s=String(v).trim().replace(/\s/g,'');if(s.includes(',')&&!s.includes('.'))s=s.replace(',','.');else s=s.replace(/,/g,'');const n=Number(s);if(!Number.isFinite(n)||n<0)throw Error('Invalid numeric value: '+v);return n}
function parseRecords(rec){if(!rec.length)throw Error('Empty table');const keys=Object.keys(rec[0]);if(keys.includes('stage')&&keys.includes('users')){const next=rec.map(r=>({stage:String(r.stage).trim(),users:numberField(r.users)}));if(next.some(r=>!r.stage||r.users===undefined))throw Error('stage and users required');for(let i=1;i<next.length;i++)if(next[i].users>next[i-1].users)throw Error('Funnel stages must be non-increasing');funnel=next;return 'funnel'}if(keys.includes('date')&&keys.includes('sessions')){const next=rec.map(r=>({date:String(r.date).trim(),channel:String(r.channel||'All').trim(),sessions:numberField(r.sessions),purchases:numberField(r.purchases)||0}));if(next.some(r=>!/^\d{4}-\d{2}-\d{2}$/.test(r.date)||!r.channel||r.sessions===undefined))throw Error('Expected date YYYY-MM-DD and sessions');daily=next;return 'daily'}if(!['channel','sessions'].every(k=>keys.includes(k)))throw Error('Required columns: channel, sessions');const next=rec.map(r=>{const x={channel:String(r.channel||'').trim()};for(const k of ['sessions','leads','purchases','impressions','clicks','spend','revenue','new_customers']){const n=numberField(r[k]??(k==='purchases'?r.purchase_events:k==='revenue'?r.total_revenue_usd:undefined));if(n!==undefined)x[k]=n}return x});if(next.some(r=>!r.channel||['sessions'].some(k=>r[k]===undefined)))throw Error('Missing required values');if(new Set(next.map(r=>r.channel)).size!==next.length)throw Error('Duplicate channels');rows=next;source='local';return 'channels'}
async function importFile(file){try{let tables=[];if(/\.csv$/i.test(file.name)){tables=[normalize(parseCSV(await file.text()))]}else if(/\.xlsx?$/i.test(file.name)){if(typeof XLSX==='undefined')throw Error('Excel parser not loaded; check internet connection');const book=XLSX.read(await file.arrayBuffer(),{type:'array',cellDates:false});tables=book.SheetNames.map(n=>normalize(XLSX.utils.sheet_to_json(book.Sheets[n],{header:1,defval:''}))).filter(x=>x.length)}else throw Error('Use CSV or XLSX');const loaded=[];for(const table of tables)loaded.push(parseRecords(table));persist();refreshSelect();renderEditor();draw();status('✓ '+file.name+' · '+loaded.join(', ')+' · '+t('save'))}catch(e){status(t('bad')+e.message)}}
function download(name,content){const a=document.createElement('a'),url=URL.createObjectURL(new Blob(['\uFEFF'+content],{type:'text/csv;charset=utf-8'}));a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),500)}
function csvRecords(items,keys){return [keys,...items.map(r=>keys.map(k=>r[k]??''))].map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n')}
function exportChannels(){download('marketing-channels.csv',csvRecords(selected(),['channel','sessions','leads','purchases','impressions','clicks','spend','revenue','new_customers']))}
function translate(){document.documentElement.lang=lang;document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=t(el.dataset.i18n));$('language').textContent=lang==='ru'?'EN':'RU';refreshSelect();const map=[['#channels h2','Traffic source performance'],['#funnel h2','Purchases & conversions'],['#insights h2',t('insights')],['.hero p','Interactive marketing case: traffic acquisition, conversion, advertising efficiency and strategy. Replace the demo figures with your own data.'],['#channels .section-heading p','Compare acquisition channels and conversion events'],['#funnel .section-heading p','GA4 purchase events; sequential funnel requires imported stage data'],['#funnel .table-note','Sequential funnel stages are never inferred from channel totals.'],['.methodology h3','Data and methodology'],['.methodology p','Channel figures transcribed from GA4 Demo Account screenshots (Google Merchandise Store), Oct 22–Nov 18, 2026. GA4 sessions total: 153,914; sum of ten rows: 151,314 (2,600 difference). Purchase events / sessions is a proxy, not session purchase conversion. Daily sessions and purchase event counts come from a separate date-level screenshot transcription (daily session sum differs from GA4 report total). GA4 ad spend and sequential funnel are unavailable. The separate advertising simulation uses explicitly fictional inputs. Imports stay local.']];if(lang==='en')map.forEach(([selector,v])=>{const el=document.querySelector(selector);if(el)el.textContent=v});else{const mapRu=[['#channels h2','Эффективность каналов'],['#funnel h2','Покупки и конверсии'],['#insights h2','Выводы и рекомендации'],['.hero p','Интерактивный маркетинговый кейс: источники трафика, конверсии, рекламная эффективность и стратегия. Демонстрационные данные можно заменить собственными.'],['#channels .section-heading p','Сравнение трафика и ключевых целевых действий'],['#funnel .section-heading p','Сводка событий GA4; последовательная воронка доступна после импорта'],['#funnel .table-note','Последовательная воронка не рассчитывается из итоговых показателей каналов.'],['.methodology h3','О данных и методологии'],['.methodology p','Данные каналов вручную перенесены со скриншотов GA4 Demo Account (Google Merchandise Store), 22.10–18.11.2026. Итог GA4: 153 914 сеансов, сумма строк: 151 314 (расхождение 2 600). События purchase / сеансы — прокси, не доля сеансов с покупкой. Дневная динамика вручную перенесена из отдельного отчёта GA4, суммы по датам требуют сверки с итогом GA4. Расходов на рекламу и данных о последовательной воронке в GA4 нет. Отдельный рекламный сценарий использует явно обозначенные вымышленные значения. Импорт хранится локально.']];mapRu.forEach(([selector,v])=>{const el=document.querySelector(selector);if(el)el.textContent=v})}draw()}
$('adsMode').value=adsMode;$('adsMode').addEventListener('change',e=>{adsMode=e.target.value;draw()});$('exportSimulation').addEventListener('click',()=>download('paid_ads_SIMULATED_sample.csv',csvRecords(PAID_SIM,['channel','impressions','clicks','spend','leads','purchases','new_customers','revenue'])));$('channel').addEventListener('change',draw);$('period').addEventListener('change',draw);$('language').addEventListener('click',()=>{lang=lang==='ru'?'en':'ru';translate();window.dispatchEvent(new Event('marketing-lab:language'))});$('export').addEventListener('click',exportChannels);$('exportFull').addEventListener('click',()=>download('marketing-full-dataset.csv',csvRecords(rows,['channel','sessions','leads','purchases','impressions','clicks','spend','revenue','new_customers'])));$('fileInput').addEventListener('change',async e=>{if(e.target.files[0])await importFile(e.target.files[0]);e.target.value=''});$('addRow').addEventListener('click',()=>{const tr=document.createElement('tr');rows.push({channel:'New channel '+(rows.length+1),sessions:0,leads:0,purchases:0});renderEditor()});$('saveRows').addEventListener('click',apply);$('resetRows').addEventListener('click',()=>{rows=clone(GA4);daily=[];funnel=[];source='ga4';localStorage.removeItem('marketingLabV3');refreshSelect();renderEditor();draw();status(t('resetText'));loadDailyCSV()});$('editorRows').addEventListener('click',e=>{const b=e.target.closest('[data-remove]');if(!b)return;rows.splice(Number(b.dataset.remove),1);renderEditor()});/* initial render moved below insight editor initialization */

async function loadDailyCSV() {
  try {
    const response = await fetch(
      './data/ga4_daily_traffic_purchases_2026-10-22_2026-11-18.csv'
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();
    const lines = text.trim().split(/\r?\n/);
    const headers = lines.shift().split(',').map(h => h.trim());

    const parsed = lines.map(line => {
      const values = line.split(',');
      return Object.fromEntries(
        headers.map((header, i) => [
          header,
          header === 'date' || header === 'channel'
            ? values[i]
            : Number(values[i] || 0)
        ])
      );
    });

    if(source==='local' && daily.length) return;
    daily = parsed;
    draw();
    console.log('GA4 daily data loaded:', daily.length);
  } catch (error) {
    console.error('CSV loading failed:', error);
  }
}

// Daily CSV is loaded after all UI modules initialize.

// Editable strategy cards: browser-local drafts, portable JSON backups.
const INSIGHTS_KEY='marketingLabInsightsV41';
let insightEdits={};
try { const value=JSON.parse(localStorage.getItem(INSIGHTS_KEY)||'{}'); if(value && typeof value==='object') insightEdits=value; } catch(e){}
const escapeInsight=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function defaultInsightCards(){return (source!=='demo'?(lang==='ru'?[['01 / ORGANIC SEARCH','Выручка из органического поиска','33 827 сеансов и $120 728,12 выручки. Изучить SEO-страницы и пути к покупке.'],['02 / PAID SEARCH','Проверить платный поиск','26 758 сеансов, 47 событий покупки и $10 556,90 выручки. Проверить трекинг, запросы и посадочные страницы; без расходов ROAS неизвестен.'],['03 / UNASSIGNED','Аудит атрибуции','6 335 сеансов и $42 602,38 выручки отнесены к каналу «Не определён». Проверить UTM и классификацию каналов.'],['04 / DATA QUALITY','Проверить расхождение','Итог GA4: 153 914 сеансов, сумма десяти строк: 151 314. Разница 2 600; не распределять без дополнительной проверки.']]:[['01 / ORGANIC SEARCH','Strong organic revenue','33,827 sessions and $120,728.12 revenue. Review SEO landing pages and purchase journeys.'],['02 / PAID SEARCH','Audit paid search','26,758 sessions, 47 purchase events and $10,556.90 revenue. Review tracking, keywords and landing pages; ROAS is unknown without spend.'],['03 / UNASSIGNED','Attribution audit','6,335 sessions and $42,602.38 revenue classified as Unassigned. Review UTM tagging and channel definitions.'],['04 / DATA QUALITY','Reconcile session totals','GA4 total: 153,914 sessions; ten displayed rows: 151,314. The 2,600 difference remains unresolved.']]):[['01 / EMAIL',t('email'),t('emailText')],['02 / PAID SEARCH',t('paid'),t('paidText')],['03 / SOCIAL',t('social'),t('socialText')],['04 / ECOMMERCE',t('other'),t('otherText')]]).map(([tag,title,body],i)=>({id:'default-'+i,tag,title,body,kind:i%2?'recommendation':'insight',priority:'medium',status:'planned'}));}
function insightKey(){return (source==='demo'?'demo':'ga4')+'-'+lang;}
function currentInsights(){const k=insightKey();return Array.isArray(insightEdits[k])?insightEdits[k]:defaultInsightCards();}
function persistInsights(cards){insightEdits[insightKey()]=cards;localStorage.setItem(INSIGHTS_KEY,JSON.stringify(insightEdits));renderInsights();}
function renderInsights(){
 const root=$('insightGrid');if(!root)return;
 const cards=currentInsights();
 root.innerHTML=cards.map((c,i)=>`<article class="insight"><span class="insight-num">${escapeInsight(localizedInsightTag(c.tag||String(i+1).padStart(2,'0')))}</span><div class="insight-meta">${escapeInsight(c.kind==='recommendation'?UI_LABELS[lang].recommendation:UI_LABELS[lang].insight)} · ${escapeInsight(insightMeta(c.priority||'medium'))} · ${escapeInsight(insightMeta(c.status||'planned'))}</div><h3>${escapeInsight(c.title)}</h3><p>${escapeInsight(c.body)}</p><div class="insight-card-actions"><button class="btn alt" data-insight-action="edit" data-index="${i}">✎ ${lang==='ru'?'Изменить':'Edit'}</button><button class="btn alt" data-insight-action="delete" data-index="${i}">×</button></div></article>`).join('');
}
function setupInsightEditor(){
 const section=document.querySelector('#insights .section-heading');if(!section||document.getElementById('insightTools'))return;
 const bar=document.createElement('div');bar.id='insightTools';bar.className='insight-tools';bar.innerHTML=`<button class="btn" id="insightAdd">+ Добавить / Add</button><button class="btn alt" id="insightExport">↓ JSON backup</button><label class="btn alt" for="insightImport">↑ Import JSON</label><input type="file" accept=".json,application/json" id="insightImport" hidden><button class="btn alt" id="insightReset">↺ Reset</button><span class="insight-hint">Изменения сохраняются в этом браузере. Для публикации всем посетителям нужен экспорт и обновление файла на GitHub.</span>`;
 section.insertAdjacentElement('afterend',bar);
 const dialog=document.createElement('dialog');dialog.id='insightDialog';dialog.className='insight-dialog';dialog.innerHTML=`<form method="dialog" id="insightForm"><h3>Редактор выводов и рекомендаций</h3><label>Тип<select name="kind"><option value="insight">Вывод / Insight</option><option value="recommendation">Рекомендация / Recommendation</option></select></label><label>Метка<input name="tag" maxlength="80" placeholder="01 / CHANNEL" /></label><label>Заголовок<input name="title" maxlength="180" required /></label><label>Описание / действие<textarea name="body" rows="5" maxlength="4000" required></textarea></label><label>Приоритет<select name="priority"><option value="low">Низкий / Low</option><option value="medium">Средний / Medium</option><option value="high">Высокий / High</option></select></label><label>Статус<select name="status"><option value="planned">Запланировано / Planned</option><option value="in-progress">В работе / In progress</option><option value="done">Готово / Done</option></select></label><div class="insight-dialog-actions"><button class="btn alt" value="cancel">Отмена</button><button class="btn" id="insightSave" value="save">Сохранить</button></div></form>`;
 document.body.append(dialog);
 let editing=-1;
 function openEditor(index){editing=index;const c=index>=0?currentInsights()[index]:{kind:'insight',tag:'',title:'',body:'',priority:'medium',status:'planned'};for(const field of ['kind','tag','title','body','priority','status'])dialog.querySelector(`[name="${field}"]`).value=c[field]||'';dialog.showModal();}
 document.getElementById('insightAdd').onclick=()=>openEditor(-1);
 document.getElementById('insightSave').onclick=(e)=>{const form=document.getElementById('insightForm');if(!form.reportValidity()){e.preventDefault();return;}e.preventDefault();const c=Object.fromEntries(new FormData(form).entries());const arr=[...currentInsights()];c.id=editing>=0?arr[editing].id:'custom-'+Date.now();if(editing>=0)arr[editing]=c;else arr.push(c);persistInsights(arr);dialog.close();};
 document.getElementById('insightGrid').addEventListener('click',e=>{const b=e.target.closest('[data-insight-action]');if(!b)return;const index=Number(b.dataset.index);if(b.dataset.insightAction==='edit')openEditor(index);else if(confirm('Удалить карточку? / Delete card?')){const arr=[...currentInsights()];arr.splice(index,1);persistInsights(arr);}});
 document.getElementById('insightReset').onclick=()=>{if(confirm('Вернуть исходные карточки для текущего языка и набора данных?')){delete insightEdits[insightKey()];localStorage.setItem(INSIGHTS_KEY,JSON.stringify(insightEdits));renderInsights();}};
 document.getElementById('insightExport').onclick=()=>{const blob=new Blob([JSON.stringify({format:'marketing-lab-insights-v1',cards:insightEdits},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='marketing-insights-backup.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};
 document.getElementById('insightImport').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{const data=JSON.parse(await f.text());if(data.format!=='marketing-lab-insights-v1'||!data.cards||typeof data.cards!=='object')throw Error('Неверный формат');const validated={};for(const [key,value] of Object.entries(data.cards)){if(!Array.isArray(value)||value.length>100)throw Error('Некорректные карточки');validated[key]=value.map(c=>({id:String(c.id||''),kind:c.kind==='recommendation'?'recommendation':'insight',tag:String(c.tag||'').slice(0,80),title:String(c.title||'').slice(0,180),body:String(c.body||'').slice(0,4000),priority:['low','medium','high'].includes(c.priority)?c.priority:'medium',status:['planned','in-progress','done'].includes(c.status)?c.status:'planned'}));}insightEdits=validated;localStorage.setItem(INSIGHTS_KEY,JSON.stringify(insightEdits));renderInsights();alert('Карточки импортированы');}catch(err){alert('Ошибка импорта: '+err.message);}e.target.value='';};
}

// v5.2 — Complete RU/EN interface localization. Original GA4 channel identifiers remain intact.
const UI_LABELS={
 ru:{nav:['Обзор','Источники трафика','Конверсии','Выводы и стратегия','Данные'],page:['Обзор','Источники трафика','Конверсии','Выводы и стратегия','Данные'],crumb:'Рабочая область',dataset:'Демо-аккаунт GA4',portfolio:'ПРОЕКТ ДЛЯ ПОРТФОЛИО',traffic:'Источники трафика',conversion:'Конверсия в покупку',channelMix:'РАСПРЕДЕЛЕНИЕ КАНАЛОВ',conversionPerf:'ЭФФЕКТИВНОСТЬ КОНВЕРСИЙ',trafficDesc:'Распределение сеансов по каналам',conversionDesc:'Покупки / сеансы, %',acquisition:'АНАЛИЗ ТРАФИКА',paid:'ЭФФЕКТИВНОСТЬ РЕКЛАМЫ',daily:'ДИНАМИКА ПО ДНЯМ',goal:'ЦЕЛЕВЫЕ ДЕЙСТВИЯ',strategy:'МАРКЕТИНГОВАЯ СТРАТЕГИЯ',management:'УПРАВЛЕНИЕ ДАННЫМИ',heading:['Источники трафика и реклама','Покупки и конверсии','Выводы и рекомендации','Управление данными'],insight:'Вывод',recommendation:'Рекомендация'},
 en:{nav:['Overview','Traffic Sources','Conversions','Insights & Strategy','Data Studio'],page:['Overview','Traffic Sources','Conversions','Insights & Strategy','Data Studio'],crumb:'Workspace',dataset:'GA4 Demo Account',portfolio:'PORTFOLIO PROJECT',traffic:'Traffic sources',conversion:'Purchase conversion',channelMix:'CHANNEL MIX',conversionPerf:'CONVERSION PERFORMANCE',trafficDesc:'Session distribution by channel',conversionDesc:'Purchases / sessions, %',acquisition:'ACQUISITION REPORT',paid:'PAID MEDIA PERFORMANCE',daily:'DAILY PERFORMANCE',goal:'GOAL COMPLETION',strategy:'STRATEGIC RECOMMENDATIONS',management:'DATA MANAGEMENT',heading:['Traffic channels & advertising','Purchases & conversions','Insights & recommendations','Data management'],insight:'Insight',recommendation:'Recommendation'}
};
// GA4 identifiers stay unchanged in the data model and exported CSV files.
const CHANNEL_RU={
 'Direct':'Прямые переходы',
 'Organic Search':'Органический поиск',
 'Unassigned':'Канал не определён',
 'Referral':'Переходы с других сайтов',
 'Paid Search':'Платный поиск',
 'Cross-network':'Кросс-сетевая реклама',
 'Organic Social':'Органический трафик из соцсетей',
 'Organic Shopping':'Бесплатные переходы из товарных сервисов',
 'Email':'Переходы из email-рассылок',
 'Organic Video':'Органический видеотрафик',
 'All channels':'Все каналы'
};
function channelLabel(value){return lang==='ru'?(CHANNEL_RU[value]||value):value;}
const INSIGHT_META_RU={low:'Низкий',medium:'Средний',high:'Высокий',planned:'Запланировано','in-progress':'В работе',done:'Готово'};
function insightMeta(value){return lang==='ru'?(INSIGHT_META_RU[value]||value):value;}
const INSIGHT_TAGS={
 'ORGANIC SEARCH':'ОРГАНИЧЕСКИЙ ПОИСК','PAID SEARCH':'ПЛАТНЫЙ ПОИСК','UNASSIGNED':'КАНАЛ НЕ ОПРЕДЕЛЁН','DATA QUALITY':'КАЧЕСТВО ДАННЫХ','EMAIL':'EMAIL-РАССЫЛКИ','SOCIAL':'СОЦСЕТИ','ECOMMERCE':'ЭЛЕКТРОННАЯ ТОРГОВЛЯ'
};
function localizedInsightTag(value){
 if(lang!=='ru')return value;
 return String(value).replace(/^(\d+\s*\/\s*)(.*)$/,(_,prefix,label)=>prefix+(INSIGHT_TAGS[label.trim().toUpperCase()]||label));
}
function setText(selector,value){const el=document.querySelector(selector);if(el)el.textContent=value;}
function localizeInterface(){
 const l=UI_LABELS[lang];
 document.querySelectorAll('.sidebar .nav').forEach((a,i)=>{
  const symbol=a.querySelector('span');
  if(i<l.nav.length){if(symbol){const sign=symbol.outerHTML;a.innerHTML=sign+' '+l.nav[i]}else a.textContent=l.nav[i]}
 });
 setText('.side-label',lang==='ru'?'РАБОЧАЯ ОБЛАСТЬ':'WORKSPACE');
 setText('.dataset-card strong',l.dataset);
 const footer=document.querySelector('.side-footer');if(footer){const version=footer.querySelector('span');footer.textContent=l.portfolio+' ';if(version)footer.append(version)}
 setText('.charts .panel:nth-child(1) .panel-kicker',l.channelMix);
 setText('.charts .panel:nth-child(2) .panel-kicker',l.conversionPerf);
 setText('.charts .panel:nth-child(1) h3',l.traffic);
 setText('.charts .panel:nth-child(2) h3',l.conversion);
 setText('.charts .panel:nth-child(1) .panel-head p',l.trafficDesc);
 setText('.charts .panel:nth-child(2) .panel-head p',l.conversionDesc);
 setText('#channels .eyebrow',l.acquisition);
 setText('#ads .eyebrow',l.paid);
 setText('#trends .eyebrow',l.daily);
 setText('#funnel .eyebrow',l.goal);
 setText('#insights .eyebrow',l.strategy);
 setText('#data-studio .eyebrow',l.management);
 ['channels','funnel','insights','data-studio'].forEach((id,i)=>setText(`[data-page-heading="${id}"]`,l.heading[i]));
 document.querySelectorAll('.workspace-heading > .eyebrow').forEach((el,i)=>{el.textContent=[l.acquisition,l.goal,l.strategy,l.management][i]||el.textContent});
 const key=(location.hash||'#overview').slice(1);const keys=['overview','channels','funnel','insights','data-studio'];
 const index=keys.indexOf(key);setText('.breadcrumb',l.crumb+' / Marketing Analytics / '+l.page[index<0?0:index]);

 const textById={
  ru:{export:'↓ Экспорт CSV',exportFull:'↓ Экспорт всех данных',insightAdd:'+ Добавить',insightExport:'↓ Резервная копия JSON',insightReset:'↺ Сбросить'},
  en:{export:'↓ Export CSV',exportFull:'↓ Export all data',insightAdd:'+ Add',insightExport:'↓ JSON backup',insightReset:'↺ Reset'}
 }[lang];
 Object.entries(textById).forEach(([id,value])=>{const el=document.getElementById(id);if(el)el.textContent=value});
 const importLabel=document.querySelector('label[for="insightImport"]');if(importLabel)importLabel.textContent=lang==='ru'?'↑ Импорт JSON':'↑ Import JSON';
 const hint=document.querySelector('.insight-hint');if(hint)hint.textContent=lang==='ru'?'Изменения сохраняются в этом браузере. Чтобы опубликовать их для всех, экспортируйте данные и обновите проект на GitHub.':'Changes are saved in this browser. To publish them for everyone, export the data and update the GitHub project.';
 setText('[data-ad-preview-title]',lang==='ru'?'Рекламные показатели · ROAS, CTR, CPC, CPM, CPL, CPA, CAC':'Advertising KPIs · ROAS, CTR, CPC, CPM, CPL, CPA, CAC');
 setText('[data-ad-preview-sub]',lang==='ru'?'Учебный рекламный сценарий с вымышленными данными: все KPI рассчитываются автоматически. Исходные данные GA4 остаются отдельно.':'Synthetic advertising scenario: all KPIs are calculated automatically from fictional inputs. GA4 observations remain separate.');
 setText('[data-ad-preview-link]',lang==='ru'?'Открыть рекламные KPI →':'Open advertising KPIs →');
 const mode=document.getElementById('adsMode');if(mode){mode.options[0].textContent=lang==='ru'?'GA4 · фактические данные':'GA4 · observed data';mode.options[1].textContent=lang==='ru'?'Учебный рекламный сценарий':'Simulated advertising scenario';}
 setText('label[for="adsMode"]',lang==='ru'?'Набор данных':'Dataset');
 setText('#exportSimulation',lang==='ru'?'↓ Скачать учебный CSV':'↓ Sample CSV');
 setText('#ads .table-note',lang==='ru'?'*CAC = расходы / новые клиенты; CPA = расходы / покупки; ROAS = выручка / расходы. Все рекламные значения в учебном сценарии вымышлены.':'*CAC = spend / new customers; CPA = spend / purchases; ROAS = revenue / spend. All advertising values in the synthetic scenario are fictional.');
 const adHeads=document.querySelectorAll('#ads .table-panel th');const heads=lang==='ru'?['Канал','Показы','Клики','Расходы','Заявки','Покупки','Новые клиенты','Выручка','CTR','CPC','CPM','CPL','CPA','CAC','ROAS','CR клика','Средний чек']:['Channel','Impressions','Clicks','Spend','Leads','Purchases','New customers','Revenue','CTR','CPC','CPM','CPL','CPA','CAC','ROAS','Click CR','AOV'];adHeads.forEach((el,i)=>{if(heads[i])el.textContent=heads[i]});
 const periodLabel=document.querySelector('label[for="period"]');if(periodLabel)periodLabel.textContent=lang==='ru'?'Период графика':'Chart period';
 const period=document.getElementById('period');if(period)for(const opt of period.options){opt.textContent=opt.value+' '+(lang==='ru'?'дней':'days')}
 const tabs=[...document.querySelectorAll('.nav')];tabs.forEach((a,i)=>a.classList.toggle('active',keys[i]===key));
 document.querySelectorAll('#insightGrid .insight-meta').forEach(el=>{
  const type=el.textContent.includes('Рекомендация')||el.textContent.includes('Recommendation')?l.recommendation:l.insight;
  const parts=el.textContent.split(' · ');parts[0]=type;el.textContent=parts.join(' · ');
 });
}


// Editor is initialized once after the workspace is ready.

// v5 navigation: render one workspace at a time, without losing editable state.
function setupWorkspacePages(){
  const root=document.querySelector('.content');
  if(!root||document.getElementById('page-overview'))return;
  const groups={
    overview:[$('overview'),document.querySelector('.toolbar'),$('kpis'),document.querySelector('.charts'),$('trends')],
    channels:[$('channels'),$('ads')],
    funnel:[$('funnel')],
    insights:[$('insights')],
    'data-studio':[$('data-studio')]
  };
  const footer=root.querySelector('footer');
  const titles={overview:'Overview',channels:'Traffic Sources',funnel:'Conversions',insights:'Insights & Strategy','data-studio':'Data Studio'};
  Object.entries(groups).forEach(([key,nodes])=>{
    const page=document.createElement('div');page.className='workspace-page';page.id='page-'+key;
    page.hidden=true;
    root.insertBefore(page,footer);
    nodes.forEach(node=>{if(node)page.appendChild(node)});
  });
  // Contextual descriptions in sections without a duplicate giant hero.
  const copy={
    channels:['TRAFFIC ACQUISITION','Источники трафика и реклама','Traffic channels & advertising'],
    funnel:['CONVERSION INTELLIGENCE','Покупки и конверсии','Purchases & conversions'],
    insights:['MARKETING STRATEGY','Выводы и рекомендации','Insights & recommendations'],
    'data-studio':['DATA WORKSPACE','Управление данными','Data management']
  };
  Object.entries(copy).forEach(([key,[eyebrow,ru,en]])=>{
    const header=document.createElement('div');header.className='workspace-heading';
    header.innerHTML=`<span class="eyebrow">${eyebrow}</span><h1 data-page-heading="${key}">${lang==='ru'?ru:en}</h1>`;
    document.getElementById('page-'+key).prepend(header);
  });
  function showPage(){
    const requested=decodeURIComponent(location.hash.replace(/^#/,''));
    const key=titles[requested]?requested:'overview';
    Object.keys(titles).forEach(id=>document.getElementById('page-'+id).hidden=id!==key);
    document.querySelectorAll('.nav').forEach(a=>{const active=a.getAttribute('href')==='#'+key;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
    const crumb=document.querySelector('.breadcrumb');if(crumb)crumb.innerHTML=`Workspace <span>/</span> Marketing Analytics <span>/</span> ${titles[key]}`;
    const heading=document.querySelector('[data-page-heading="'+key+'"]');if(heading)heading.textContent=lang==='ru'?copy[key]?.[1]||titles[key]:copy[key]?.[2]||titles[key];
    if(key==='overview')requestAnimationFrame(()=>draw());
    if(key==='insights')renderInsights();
    window.scrollTo({top:0,behavior:'instant'});
  }
  window.addEventListener('hashchange',showPage);
  window.addEventListener('marketing-lab:language',showPage);
  showPage();
}
refreshSelect();
renderEditor();
setupInsightEditor();
setupWorkspacePages();
renderInsights();
draw();

// Register after the original language handler so it runs on the updated language.
$('language').addEventListener('click',()=>{localizeInterface();renderInsights();});
window.addEventListener('hashchange',()=>localizeInterface());
localizeInterface();

loadDailyCSV();
