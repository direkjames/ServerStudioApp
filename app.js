// The Server Studio Content Hub. Plain JS, no build step: open index.html.
const KEY = 'tss-app-v1';
const ST = ['Not started', 'Scripted', 'Recorded', 'Edited', 'Scheduled', 'Published'];
const IST = ['Idea', 'Scripted', 'Recorded', 'Edited', 'Scheduled', 'Published'];
const SST = ['Idea', 'Scripted', 'Recorded', 'Published'];
const TYPES = ['Long-form', 'Short', 'Rest', 'Review'];
const TPL = ['Hook (first 5 sec)', 'Promise & preview', 'Why it matters (story)', 'Step 1', 'Step 2', 'Step 3', 'Recap', 'Ending & CTA'];
const CTR_MIN = [4, 4, 5, 5, 5, 5, 6, 6], AVP_MIN = [35, 35, 40, 40, 40, 40, 45, 45];
const SUB_LO = [5, 20, 40, 70, 150, 200, 300, 300], SUB_HI = [30, 60, 100, 160, 260, 350, 650, 1000];
const CHECKS = ['Title under 60 characters, main keyword near the start', '3 thumbnail variants made (one is the default, test the others)', 'Hook lands in the first 5 seconds, intro under 30 seconds', 'Description: first 2 lines have keyword + hook, links added', 'Chapters / timestamps added', 'Tags and 3 hashtags added', 'End screen and cards added', 'Pinned comment ready (commands + links)', 'Added to the right playlist', 'Posted in Discord #announcements', 'Community tab post made', 'Shorts teasers scheduled', 'Replying to comments for the first 2 hours'];

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const opts = (arr, cur) => arr.map(a => `<option${a === cur ? ' selected' : ''}>${esc(a)}</option>`).join('');
const ref = t => { const m = /#(\d+)/.exec(t); return m ? +m[1] : null; };

function seed() {
  return {
    settings: { start: '', channel: 'The Server Studio', yt: '', discord: '', wpm: 150, tags: 'minecraft server, how to make a minecraft server, minecraft server owner, minecraft plugins, minecraft server tutorial, minecraft server setup' },
    plan: PLAN.map(p => ({ ...p, status: 'Not started' })),
    ideas: IDEAS.map(i => ({ ...i, status: 'Idea', score: 3 })),
    scripts: {}, shorts: [], analytics: [], uploads: {},
  };
}
function load() { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.plan && s.ideas) return s; } catch (e) { } return seed(); }
let S = load();
const save = () => localStorage.setItem(KEY, JSON.stringify(S));

const NAV = [['today', 'Today'], ['calendar', 'Calendar & Board'], ['ideas', 'Idea Bank'], ['scripts', 'Scripts'], ['shorts', 'Shorts Planner'], ['analytics', 'Analytics'], ['upload', 'Upload Checklist'], ['settings', 'Settings & Backup']];
let route = location.hash.slice(1) || 'today';
const ui = { calTab: 'grid', ideaP: 'all', ideaS: 'all', q: '', scriptN: null, pauses: false, shortN: null, upN: null };

// ---------- helpers ----------
const ideaOf = n => S.ideas.find(i => i.n === n);
const videos = () => S.plan.map((p, i) => ({ ...p, i, n: ref(p.task) })).filter(p => p.type === 'Long-form' && p.n && ideaOf(p.n));
const startDate = () => S.settings.start ? new Date(S.settings.start + 'T00:00:00') : null;
function dayNo() { const s = startDate(); if (!s) return null; const t = new Date(); t.setHours(0, 0, 0, 0); return Math.round((t - s) / 864e5) + 1; }
function dateOf(d, long) { const s = startDate(); if (!s) return ''; const x = new Date(s); x.setDate(x.getDate() + d - 1); return x.toLocaleDateString(undefined, long ? { weekday: 'long', day: 'numeric', month: 'long' } : { day: 'numeric', month: 'short' }); }
function toast(m) { const t = $('#toast'); t.textContent = m; t.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => t.hidden = true, 1800); }
function copy(text) { (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).catch(() => { const a = document.createElement('textarea'); a.value = text; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); }).finally(() => toast('Copied')); }
function download(name, text, type = 'text/plain') { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); URL.revokeObjectURL(a.href); }
const modal = h => { $('#modal').innerHTML = `<div class="box">${h}</div>`; $('#modal').hidden = false; };
const closeModal = () => $('#modal').hidden = true;
const sel = (f, arr, cur, extra = '') => `<select data-f="${f}" ${extra}>${opts(arr, cur)}</select>`;

// ---------- views ----------
function today() {
  const dn = dayNo(), L = S.plan.filter(p => p.type === 'Long-form'), pub = L.filter(p => p.status === 'Published').length;
  let h = '<h1>Today</h1>';
  if (dn === null) h += `<div class="card"><h2>Set your Day 1</h2><p class="muted">The 30-day plan assumes Day 1 is a Monday.</p><div class="row"><input type="date" id="d1" style="max-width:200px"><button data-act="setstart">Start plan</button></div></div>`;
  else if (dn < 1) h += `<div class="card"><h2>Starts in ${1 - dn} day(s)</h2><p>Day 1 is ${dateOf(1, 1)}. Record #1 and #6 before then.</p></div>`;
  else if (dn > 30) h += `<div class="card"><h2>The 30 days are done</h2><p>Do the Day-30 review in Analytics: cut the worst 25% topic type, double the best 25%.</p></div>`;
  else {
    const p = S.plan[dn - 1], r = ref(p.task);
    h += `<div class="card"><div class="row"><span class="chip t-${p.type}">${p.type}</span><span class="muted">Day ${dn} · ${dateOf(dn, 1)}</span></div><h2 style="margin-top:8px">${esc(p.task)}</h2><p>${esc(p.note) || '<span class="muted">No notes.</span>'}</p><div class="row"><div>${sel('planst', ST, p.status, `data-i="${dn - 1}"`)}</div>${r && ideaOf(r) ? `<button class="sec" data-act="goscript" data-id="${r}">Script</button><button class="sec" data-act="goupload" data-id="${r}">Upload checklist</button>` : ''}<button class="sec" data-act="editday" data-id="${dn - 1}">Edit</button></div></div>`;
  }
  const nxt = S.plan.filter((p, i) => (dn === null || i + 1 > Math.max(dn, 0)) && p.type !== 'Rest').slice(0, 4);
  h += `<div class="grid g3"><div class="card"><div class="big">${pub}/${L.length}</div><div class="muted">long-form videos published</div><div class="bar" style="margin-top:8px"><i style="width:${pub / L.length * 100}%"></i></div></div>`;
  h += `<div class="card"><div class="big">${S.shorts.filter(s => s.status === 'Published').length}/${S.shorts.length}</div><div class="muted">Shorts published / planned</div></div>`;
  h += `<div class="card"><div class="big">${S.ideas.length}</div><div class="muted">ideas in the bank (${S.ideas.filter(i => i.status !== 'Idea').length} in production)</div></div></div>`;
  h += `<div class="card"><h3>Coming up</h3>${nxt.map(p => `<div class="row" style="padding:4px 0"><span class="chip t-${p.type}">Day ${p.day}</span><span class="grow">${esc(p.task)}</span><span class="muted small">${p.status}</span></div>`).join('') || '<span class="muted">Nothing left.</span>'}</div>`;
  return h;
}

function calendar() {
  const t = ui.calTab, dn = dayNo();
  let h = `<h1>Calendar & Board</h1><div class="tabs"><button class="${t === 'grid' ? 'on' : ''}" data-act="caltab" data-id="grid">Calendar</button><button class="${t === 'board' ? 'on' : ''}" data-act="caltab" data-id="board">Board</button></div>`;
  if (t === 'board') {
    h += '<div class="board">' + ST.map(s => `<div class="col"><h3>${s} (${S.plan.filter(p => p.status === s && p.type !== 'Rest').length})</h3>${S.plan.map((p, i) => ({ ...p, i })).filter(p => p.status === s && p.type !== 'Rest').map(p => `<div class="bc"><span class="chip t-${p.type}">Day ${p.day} · ${p.type}</span><div style="margin-top:4px">${esc(p.task)}</div>${sel('planst', ST, p.status, `data-i="${p.i}"`)}</div>`).join('')}</div>`).join('') + '</div>';
    return h;
  }
  const s = startDate(), wd = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], off = s ? (s.getDay() + 6) % 7 : 0;
  h += `<p class="muted small">Click a day to edit. ${s ? '' : 'Set your start date on the Today page to see dates. Plan assumes Day 1 is a Monday.'}</p><div class="cal">${Array.from({ length: 7 }, (_, k) => `<div class="h">${wd[(off + k) % 7]}</div>`).join('')}`;
  S.plan.forEach((p, i) => { h += `<div class="day t-${p.type}${dn === p.day ? ' today' : ''}" data-act="editday" data-id="${i}" title="${esc(p.task)}"><b>Day ${p.day}${s ? ' · ' + dateOf(p.day) : ''}</b><span class="st">${p.status === 'Not started' ? '' : p.status === 'Published' ? '✅' : p.status}</span><div style="margin-top:6px">${esc(p.task.length > 70 ? p.task.slice(0, 68) + '…' : p.task)}</div></div>`; });
  return h + '</div>';
}

function ideas() {
  const q = ui.q.toLowerCase();
  const list = S.ideas.filter(i => (ui.ideaP === 'all' || i.p === +ui.ideaP) && (ui.ideaS === 'all' || i.status === ui.ideaS) && (!q || (i.title + i.hook + i.concept).toLowerCase().includes(q))).sort((a, b) => b.score - a.score || a.n - b.n);
  let h = `<h1>Idea Bank</h1><div class="card row"><div class="grow"><label>Search</label><input type="text" data-f="iq" value="${esc(ui.q)}" placeholder="Search ideas"></div><div class="grow"><label>Pillar</label><select data-f="ip"><option value="all">All</option>${PILLARS.map((p, k) => `<option value="${k}"${ui.ideaP == k ? ' selected' : ''}>${p}</option>`).join('')}</select></div><div class="grow"><label>Status</label><select data-f="is"><option value="all">All</option>${IST.map(s => `<option${ui.ideaS === s ? ' selected' : ''}>${s}</option>`).join('')}</select></div><button data-act="addidea">+ Add idea</button></div>`;
  h += `<p class="muted small">${list.length} ideas. Sorted by priority (5 = make it first).</p>`;
  h += list.map(i => `<div class="card"><div class="row"><span class="chip">#${i.n}</span><span class="chip">${PILLARS[i.p].split(' (')[0]}</span><span class="grow"></span><label style="margin:0">Priority</label>${sel('iscore', [1, 2, 3, 4, 5].map(String), String(i.score), `data-n="${i.n}" style="width:70px"`)}${sel('istat', IST, i.status, `data-n="${i.n}" style="width:130px"`)}</div><h3 style="margin-top:8px">${esc(i.title)}</h3><p><b>Hook:</b> ${esc(i.hook)}</p><p><b>Concept:</b> ${esc(i.concept)}</p><p class="muted"><b>Thumbnail:</b> ${esc(i.thumb)}</p><div class="row"><button class="sm" data-act="goscript" data-id="${i.n}">Write script</button><button class="sm sec" data-act="goshort" data-id="${i.n}">Plan Shorts</button><button class="sm sec" data-act="goupload" data-id="${i.n}">Upload checklist</button><button class="sm sec" data-act="editidea" data-id="${i.n}">Edit</button><button class="sm warn" data-act="delidea" data-id="${i.n}">Delete</button></div></div>`).join('');
  return h;
}

const clean = t => String(t || '').replace(/\[[^\]]*\]/g, '').replace(/[*_#`>]/g, '').replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
const narr = (n, br) => (S.scripts[n]?.scenes || []).map(s => clean(s.narr)).filter(Boolean).join(br ? '\n<break time="0.8s" />\n' : '\n\n');
const words = n => narr(n).split(/\s+/).filter(Boolean).length;

function scripts() {
  if (ui.scriptN == null) ui.scriptN = (videos()[0] || { n: S.ideas[0]?.n }).n;
  const n = ui.scriptN, sc = S.scripts[n];
  let h = `<h1>Scripts</h1><div class="card row"><div class="grow"><label>Video</label><select data-f="sn">${S.ideas.map(i => `<option value="${i.n}"${i.n == n ? ' selected' : ''}>#${i.n} ${esc(i.title)}</option>`).join('')}</select></div></div>`;
  if (!sc) return h + `<div class="card"><p>No script for this video yet.</p><button data-act="newscript">Start from template</button></div>`;
  h += `<div class="card"><div class="row"><div><div class="big" id="rt">0:00</div><div class="muted small">estimated narration time at ${S.settings.wpm} wpm</div></div><div class="grow"><div class="bar"><i id="bar" style="width:0"></i></div><div class="small muted" id="wc"></div></div></div></div>`;
  h += sc.scenes.map((s, i) => `<div class="card scene"><div class="row"><input type="text" data-f="sc" data-k="name" data-i="${i}" value="${esc(s.name)}" style="max-width:320px;font-weight:700"><span class="grow"></span><button class="sm warn" data-act="delscene" data-id="${i}">Remove</button></div><div class="grid g2"><div><label>Narration (what ElevenLabs reads; put directions in [brackets] and they are stripped)</label><textarea data-f="sc" data-k="narr" data-i="${i}">${esc(s.narr)}</textarea></div><div><label>Visuals</label><textarea data-f="sc" data-k="visual" data-i="${i}">${esc(s.visual)}</textarea></div><div><label>On-screen text</label><textarea data-f="sc" data-k="text" data-i="${i}" style="min-height:50px">${esc(s.text)}</textarea></div><div><label>Editing notes</label><textarea data-f="sc" data-k="edit" data-i="${i}" style="min-height:50px">${esc(s.edit)}</textarea></div></div></div>`).join('');
  h += `<div class="row"><button class="sec" data-act="addscene">+ Add scene</button><button class="yel" data-act="copynarr">Copy ElevenLabs narration</button><button class="sec" data-act="dlnarr">Download narration .txt</button><button class="sec" data-act="copyfull">Copy full script</button><label style="margin:0"><input type="checkbox" data-f="pauses"${ui.pauses ? ' checked' : ''}> add pauses between scenes (ElevenLabs break tags)</label></div>`;
  return h;
}
function scriptStats() {
  if (!$('#wc')) return; const w = words(ui.scriptN), m = w / S.settings.wpm;
  $('#rt').textContent = Math.floor(m) + ':' + String(Math.round(m % 1 * 60)).padStart(2, '0');
  $('#bar').style.width = Math.min(100, m / 10 * 100) + '%';
  $('#bar').style.background = m < 7 ? 'var(--y)' : m <= 10 ? 'var(--g)' : 'var(--r)';
  $('#wc').textContent = `${w} words. Target 7 to 10 minutes (about ${7 * S.settings.wpm} to ${10 * S.settings.wpm} words). ${m < 7 ? 'Too short for a long-form video.' : m <= 10 ? 'In range.' : 'Running long: trim.'}`;
}

const SH_T = i => [['Hook teaser', `Open on the hook: "${i.hook}" Show the payoff in the first 3 seconds, then say the full video is on the channel.`], ['One quick tip', `One tip from "${i.title}": pick the single most useful step, show it on screen in under 20 seconds, end with "full guide on my channel".`], ['Mistake / myth', `The #1 mistake with this topic: say it in the first 2 seconds, show what goes wrong, then show the fix. Topic: ${i.title}`]];
function shorts() {
  if (ui.shortN == null) ui.shortN = S.ideas[0]?.n;
  const n = ui.shortN;
  let h = `<h1>Shorts Planner</h1><div class="card row"><div class="grow"><label>Long-form video</label><select data-f="shn">${S.ideas.map(i => `<option value="${i.n}"${i.n == n ? ' selected' : ''}>#${i.n} ${esc(i.title)}</option>`).join('')}</select></div><button data-act="genshorts">Generate 3 Short ideas</button><button class="sec" data-act="addshort">+ Blank Short</button></div>`;
  const mine = S.shorts.map((s, i) => ({ ...s, i })).filter(s => s.n == n);
  h += `<h2>Shorts for #${n}</h2>` + (mine.length ? mine.map(s => `<div class="card"><div class="row"><span class="chip">${esc(s.tag)}</span><span class="grow"></span>${sel('shst', SST, s.status, `data-i="${s.i}" style="width:130px"`)}<button class="sm warn" data-act="delshort" data-id="${s.i}">Delete</button></div><textarea data-f="shtext" data-i="${s.i}" style="margin-top:8px">${esc(s.text)}</textarea></div>`).join('') : '<p class="muted">None yet. Generate 3 or add your own.</p>');
  h += `<p class="muted small">All Shorts: ${S.shorts.length} planned, ${S.shorts.filter(s => s.status === 'Published').length} published. Aim for 3 Shorts per long-form video.</p>`;
  return h;
}

function lineChart(vals, min, band, max, unit) {
  const w = 480, h = 210, x = i => 44 + i * (w - 64) / 7, y = v => h - 28 - Math.min(v, max) / max * (h - 44);
  let s = `<svg viewBox="0 0 ${w} ${h}" width="100%">`;
  [0, .5, 1].forEach(f => s += `<line x1="44" x2="${w - 20}" y1="${y(max * f)}" y2="${y(max * f)}" stroke="#2B4066"/><text x="38" y="${y(max * f) + 4}" text-anchor="end">${Math.round(max * f)}${unit}</text>`);
  for (let i = 0; i < 8; i++) s += `<text x="${x(i)}" y="${h - 8}" text-anchor="middle">W${i + 1}</text>`;
  if (band) s += `<polygon points="${band[0].map((v, i) => `${x(i)},${y(v)}`).join(' ')} ${band[1].map((v, i) => `${x(7 - i) },${y(band[1][7 - i])}`).join(' ')}" fill="#0A9DFF" opacity=".22"/>`;
  if (min) s += `<polyline points="${min.map((v, i) => `${x(i)},${y(v)}`).join(' ')}" fill="none" stroke="#FFD60A" stroke-dasharray="6 5" stroke-width="2"/>`;
  const pts = vals.map((v, i) => v == null ? null : [x(i), y(v)]).filter(Boolean);
  if (pts.length) s += `<polyline points="${pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="#6BE39A" stroke-width="3"/>` + pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="4.5" fill="#6BE39A"/>`).join('');
  return s + '</svg>';
}
function analytics() {
  const A = S.analytics, by = k => Array.from({ length: 8 }, (_, i) => { const e = A.find(a => a.week == i + 1); return e && e[k] !== '' && e[k] != null ? +e[k] : null; });
  let h = `<h1>Analytics</h1><div class="card"><h3>Log a week</h3><div class="grid g4"><div><label>Week (1-8)</label><input type="number" id="a-week" min="1" max="8" value="${Math.min(8, A.length + 1)}"></div><div><label>Views</label><input type="number" id="a-views"></div><div><label>Impressions</label><input type="number" id="a-impr"></div><div><label>CTR %</label><input type="number" step="0.1" id="a-ctr"></div><div><label>Avg % viewed</label><input type="number" step="0.1" id="a-avp"></div><div><label>Total subs</label><input type="number" id="a-subs"></div><div><label>Top video</label><input type="text" id="a-top"></div><div><label>Change for next week</label><input type="text" id="a-notes"></div></div><button style="margin-top:10px" data-act="addweek">Save week</button></div>`;
  h += `<div class="grid g3"><div class="card"><h3>Subscribers vs target</h3>${lineChart(by('subs'), null, [SUB_LO, SUB_HI], 1000, '')}<div class="small muted">Blue band = target range</div></div><div class="card"><h3>CTR % vs minimum</h3>${lineChart(by('ctr'), CTR_MIN, null, 10, '%')}<div class="small muted">Dashed = target minimum</div></div><div class="card"><h3>Average % viewed vs minimum</h3>${lineChart(by('avp'), AVP_MIN, null, 100, '%')}<div class="small muted">Dashed = target minimum</div></div></div>`;
  const last = [...A].sort((a, b) => a.week - b.week).pop(), tips = [];
  if (last) {
    const m = last.week - 1;
    if (last.ctr !== '' && +last.ctr < CTR_MIN[m]) tips.push(`<b>CTR ${last.ctr}% is under ${CTR_MIN[m]}%.</b> Bigger focal point, fewer words, test 3 title angles.`);
    if (last.avp !== '' && +last.avp < AVP_MIN[m]) tips.push(`<b>Average % viewed ${last.avp}% is under ${AVP_MIN[m]}%.</b> Rewrite the first 30 seconds and cut filler. Check the retention graph for the drop timestamp.`);
    if (last.impr !== '' && +last.impr < 300) tips.push('<b>Low impressions.</b> Target searched topics and check search suggestions for your title keywords.');
    if (last.views !== '' && +last.views >= 200 && A.length > 1) { const prev = by('subs')[m - 1]; if (prev != null && +last.subs - prev < 5) tips.push('<b>Views are OK but few subs.</b> Add a spoken CTA tied to your next video and use end screens.'); }
    const hi = SUB_HI[m], lo = SUB_LO[m]; if (last.subs !== '') tips.push(+last.subs >= lo ? `<span class="ok">Subs ${last.subs} are within or above the week-${last.week} range (${lo} to ${hi}).</span>` : `<span class="bad">Subs ${last.subs} are below the week-${last.week} range (${lo} to ${hi}).</span> Targets are estimates; recalibrate after week 2.`);
  }
  h += `<div class="card"><h3>What to adjust</h3>${tips.length ? '<ul>' + tips.map(t => `<li>${t}</li>`).join('') + '</ul>' : '<span class="muted">Log a week to get suggestions. Rule of thumb: one video 3x the rest means make 3 sequels with the same packaging.</span>'}</div>`;
  h += `<div class="card"><h3>Log</h3><table><tr><th>Wk</th><th>Views</th><th>Impr.</th><th>CTR</th><th>Avg %</th><th>Subs</th><th>Top video</th><th>Next change</th><th></th></tr>${[...A].sort((a, b) => a.week - b.week).map(a => `<tr><td>${a.week}</td><td>${a.views}</td><td>${a.impr}</td><td>${a.ctr}</td><td>${a.avp}</td><td>${a.subs}</td><td>${esc(a.top)}</td><td>${esc(a.notes)}</td><td><button class="sm warn" data-act="delweek" data-id="${a.week}">x</button></td></tr>`).join('') || '<tr><td colspan="9" class="muted">No weeks logged.</td></tr>'}</table></div>`;
  return h;
}

function upload() {
  const v = videos(); if (ui.upN == null) ui.upN = (v[0] || {}).n || S.ideas[0]?.n;
  const n = ui.upN, idea = ideaOf(n); if (!idea) return '<h1>Upload Checklist</h1><p>No ideas.</p>';
  const U = S.uploads[n] ||= { title: '', variants: '', chapters: '', checks: {} }, title = U.title || idea.title, done = CHECKS.filter((c, i) => U.checks[i]).length;
  let h = `<h1>Upload Checklist</h1><div class="card"><label>Video</label><select data-f="un">${S.ideas.map(i => `<option value="${i.n}"${i.n == n ? ' selected' : ''}>#${i.n} ${esc(i.title)}</option>`).join('')}</select><label>Final title</label><input type="text" data-f="up" data-k="title" value="${esc(title)}"><div class="small" id="tlen"></div><label>Title variants to test (one per line)</label><textarea data-f="up" data-k="variants" style="min-height:60px">${esc(U.variants)}</textarea><label>Chapters (e.g. 0:00 Intro)</label><textarea data-f="up" data-k="chapters" style="min-height:90px">${esc(U.chapters)}</textarea></div>`;
  h += `<div class="grid g2"><div class="card"><h3>Checklist (${done}/${CHECKS.length})</h3><div class="bar"><i style="width:${done / CHECKS.length * 100}%"></i></div>${CHECKS.map((c, i) => `<label class="check" style="margin:0;color:var(--text);font-size:14px"><input type="checkbox" data-f="chk" data-i="${i}"${U.checks[i] ? ' checked' : ''}> ${esc(c)}</label>`).join('')}</div><div class="card"><h3>Description & tags</h3><div class="row"><button data-act="gendesc">Generate</button><button class="sec" data-act="copydesc">Copy description</button><button class="sec" data-act="copytags">Copy tags</button></div><pre id="descOut">Press Generate.</pre><div class="small muted" id="tagOut"></div></div></div>`;
  return h;
}
function titleLen() { const el = $('#tlen'); if (!el) return; const t = ($('[data-k=title]') || {}).value || ''; el.textContent = `${t.length} characters (aim for under 60)`; el.className = 'small ' + (t.length <= 60 ? 'ok' : 'bad'); }
function genDesc() {
  const n = ui.upN, idea = ideaOf(n), U = S.uploads[n], st = S.settings, title = U.title || idea.title;
  const desc = `${title}: ${idea.hook}\n\nIn this video: ${idea.concept}\n\n⏱ Chapters\n${U.chapters.trim() || '0:00 Intro'}\n\n🔗 Links\n${st.discord ? 'Join the Discord: ' + st.discord + '\n' : ''}${st.yt ? 'Subscribe: ' + st.yt + '\n' : ''}\nNew videos every week on ${st.channel}.\n\n#MinecraftServer #Minecraft #ServerOwner`;
  const words = title.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(w => w.length > 3);
  let tags = [title.toLowerCase(), ...st.tags.split(',').map(t => t.trim()).filter(Boolean), ...words].filter((t, i, a) => a.indexOf(t) === i), out = [], len = 0;
  for (const t of tags) { if (len + t.length + 1 > 480) break; out.push(t); len += t.length + 1; }
  $('#descOut').textContent = desc; $('#tagOut').textContent = out.join(', '); genDesc.tags = out.join(', ');
}

function settings() {
  const s = S.settings;
  return `<h1>Settings & Backup</h1><div class="card"><div class="grid g2"><div><label>Channel name</label><input type="text" data-f="set" data-k="channel" value="${esc(s.channel)}"></div><div><label>Plan start date (Day 1)</label><input type="date" data-f="set" data-k="start" value="${esc(s.start)}"></div><div><label>YouTube channel link</label><input type="text" data-f="set" data-k="yt" value="${esc(s.yt)}"></div><div><label>Discord invite link</label><input type="text" data-f="set" data-k="discord" value="${esc(s.discord)}"></div><div><label>Narration speed (words per minute)</label><input type="number" data-f="set" data-k="wpm" value="${s.wpm}"></div></div><label>Base tags (comma separated)</label><textarea data-f="set" data-k="tags">${esc(s.tags)}</textarea></div>
<div class="card"><h3>Backup</h3><p class="muted">Everything lives in this browser. Export a backup file regularly. Clearing browser data erases the app data.</p><div class="row"><button data-act="export">Export backup (JSON)</button><label class="sec" style="margin:0"><input type="file" id="imp" accept=".json" hidden><button class="sec" data-act="import">Import backup</button></label><button class="warn" data-act="reset">Reset everything</button></div></div>`;
}

const VIEWS = { today, calendar, ideas, scripts, shorts, analytics, upload, settings };
function render() {
  $('#links').innerHTML = NAV.map(([k, l]) => `<a data-act="nav" data-id="${k}" class="${k === route ? 'on' : ''}">${l}</a>`).join('');
  $('#main').innerHTML = (VIEWS[route] || today)();
  scriptStats(); titleLen();
}
const go = r => { route = r; location.hash = r; render(); scrollTo(0, 0); };

// ---------- forms ----------
function dayForm(i) {
  const p = S.plan[i]; return `<h2>Day ${p.day}</h2><label>Type</label><select id="m-type">${opts(TYPES, p.type)}</select><label>Task</label><input type="text" id="m-task" value="${esc(p.task)}"><label>Notes</label><textarea id="m-note">${esc(p.note)}</textarea><label>Status</label><select id="m-st">${opts(ST, p.status)}</select><div class="row" style="margin-top:14px"><button data-act="saveday" data-id="${i}">Save</button><button class="sec" data-act="close">Cancel</button></div>`;
}
function ideaForm(i) {
  i = i || { n: '', p: 0, title: '', hook: '', concept: '', thumb: '' };
  return `<h2>${i.n ? 'Edit idea #' + i.n : 'New idea'}</h2><label>Pillar</label><select id="m-p">${PILLARS.map((p, k) => `<option value="${k}"${k === i.p ? ' selected' : ''}>${p}</option>`).join('')}</select><label>Title</label><input type="text" id="m-title" value="${esc(i.title)}"><label>Hook (first line)</label><textarea id="m-hook">${esc(i.hook)}</textarea><label>Concept</label><textarea id="m-concept">${esc(i.concept)}</textarea><label>Thumbnail idea</label><input type="text" id="m-thumb" value="${esc(i.thumb)}"><div class="row" style="margin-top:14px"><button data-act="saveidea" data-id="${i.n}">Save</button><button class="sec" data-act="close">Cancel</button></div>`;
}

// ---------- events ----------
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  const a = el.dataset.act, id = el.dataset.id, n = +id;
  if (el.tagName !== 'BUTTON' && el.tagName !== 'A' && !el.classList.contains('day')) return;
  switch (a) {
    case 'nav': go(id); break;
    case 'close': closeModal(); break;
    case 'setstart': { const v = $('#d1').value; if (v) { S.settings.start = v; save(); render(); } break; }
    case 'caltab': ui.calTab = id; render(); break;
    case 'editday': modal(dayForm(n)); break;
    case 'saveday': { const p = S.plan[n]; p.type = $('#m-type').value; p.task = $('#m-task').value; p.note = $('#m-note').value; p.status = $('#m-st').value; save(); closeModal(); render(); break; }
    case 'goscript': ui.scriptN = n; go('scripts'); break;
    case 'goshort': ui.shortN = n; go('shorts'); break;
    case 'goupload': ui.upN = n; go('upload'); break;
    case 'addidea': modal(ideaForm()); break;
    case 'editidea': modal(ideaForm(ideaOf(n))); break;
    case 'saveidea': {
      const f = { p: +$('#m-p').value, title: $('#m-title').value.trim(), hook: $('#m-hook').value, concept: $('#m-concept').value, thumb: $('#m-thumb').value }; if (!f.title) { toast('Title needed'); break; }
      if (n) Object.assign(ideaOf(n), f); else S.ideas.push({ ...f, n: Math.max(0, ...S.ideas.map(i => i.n)) + 1, status: 'Idea', score: 3 });
      save(); closeModal(); render(); break;
    }
    case 'delidea': if (confirm('Delete this idea? Its script and Shorts stay saved but unlinked.')) { S.ideas = S.ideas.filter(i => i.n !== n); save(); render(); } break;
    case 'newscript': { const i = ideaOf(ui.scriptN); S.scripts[ui.scriptN] = { scenes: TPL.map((name, k) => ({ name, narr: k === 0 ? i.hook : '', visual: '', text: '', edit: '' })) }; save(); render(); break; }
    case 'addscene': S.scripts[ui.scriptN].scenes.push({ name: 'New scene', narr: '', visual: '', text: '', edit: '' }); save(); render(); break;
    case 'delscene': if (confirm('Remove this scene?')) { S.scripts[ui.scriptN].scenes.splice(n, 1); save(); render(); } break;
    case 'copynarr': copy(narration2()); break;
    case 'dlnarr': download(`script-${ui.scriptN}-narration.txt`, narration2()); break;
    case 'copyfull': copy(S.scripts[ui.scriptN].scenes.map(s => `## ${s.name}\nNARRATION: ${s.narr}\nVISUALS: ${s.visual}\nON-SCREEN TEXT: ${s.text}\nEDITING: ${s.edit}`).join('\n\n')); break;
    case 'genshorts': { const i = ideaOf(ui.shortN); SH_T(i).forEach(([tag, text]) => S.shorts.push({ n: ui.shortN, tag, text, status: 'Idea' })); save(); render(); break; }
    case 'addshort': S.shorts.push({ n: ui.shortN, tag: 'Custom', text: '', status: 'Idea' }); save(); render(); break;
    case 'delshort': S.shorts.splice(n, 1); save(); render(); break;
    case 'addweek': {
      const g = k => $('#a-' + k).value, w = +g('week'); if (!(w >= 1 && w <= 8)) { toast('Week must be 1 to 8'); break; }
      S.analytics = S.analytics.filter(x => x.week != w); S.analytics.push({ week: w, views: g('views'), impr: g('impr'), ctr: g('ctr'), avp: g('avp'), subs: g('subs'), top: g('top'), notes: g('notes') }); save(); render(); break;
    }
    case 'delweek': S.analytics = S.analytics.filter(x => x.week != n); save(); render(); break;
    case 'gendesc': genDesc(); break;
    case 'copydesc': genDesc(); copy($('#descOut').textContent); break;
    case 'copytags': genDesc(); copy(genDesc.tags); break;
    case 'export': download(`server-studio-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(S, null, 1), 'application/json'); break;
    case 'import': $('#imp').click(); break;
    case 'reset': if (confirm('Erase ALL data and restore the starting plan? Export a backup first.')) { S = seed(); save(); render(); } break;
  }
});
const narration2 = () => narr(ui.scriptN, ui.pauses);

function onField(el, type) {
  const live = el.matches('textarea,input[type=text],input[type=number]'); if ((type === 'input') !== live) return;
  const f = el.dataset.f, i = +el.dataset.i, n = +el.dataset.n, v = el.value; if (!f) return;
  switch (f) {
    case 'planst': S.plan[i].status = v; save(); render(); return;
    case 'iq': ui.q = v; save(); { const p = el.selectionStart; render(); const x = document.querySelector('[data-f=iq]'); x.focus(); x.setSelectionRange(p, p); } return;
    case 'ip': ui.ideaP = v; render(); return;
    case 'is': ui.ideaS = v; render(); return;
    case 'iscore': ideaOf(n).score = +v; save(); render(); return;
    case 'istat': ideaOf(n).status = v; save(); render(); return;
    case 'sn': ui.scriptN = +v; render(); return;
    case 'sc': S.scripts[ui.scriptN].scenes[i][el.dataset.k] = v; save(); scriptStats(); return;
    case 'pauses': ui.pauses = el.checked; return;
    case 'shn': ui.shortN = +v; render(); return;
    case 'shst': S.shorts[i].status = v; save(); return;
    case 'shtext': S.shorts[i].text = v; save(); return;
    case 'un': ui.upN = +v; render(); return;
    case 'up': (S.uploads[ui.upN] ||= { checks: {} })[el.dataset.k] = v; save(); titleLen(); return;
    case 'chk': S.uploads[ui.upN].checks[i] = el.checked; save(); render(); return;
    case 'set': S.settings[el.dataset.k] = el.dataset.k === 'wpm' ? (+v || 150) : v; save(); return;
  }
}
document.addEventListener('input', e => onField(e.target, 'input'));
document.addEventListener('change', e => {
  if (e.target.id === 'imp') { const f = e.target.files[0]; if (!f) return; f.text().then(t => { try { const d = JSON.parse(t); if (!d.plan || !d.ideas) throw 0; S = d; save(); render(); toast('Backup imported'); } catch (x) { toast('Not a valid backup file'); } }); return; }
  onField(e.target, 'change');
});
$('#modal').addEventListener('click', e => { if (e.target.id === 'modal') closeModal(); });
addEventListener('hashchange', () => { route = location.hash.slice(1) || 'today'; render(); });
render();
