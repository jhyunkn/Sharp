const fs = require('fs');
const p = 'dist/index.html';
let h = fs.readFileSync(p, 'utf8');

const css = `
html,body{margin:0!important;width:100%!important;height:100%!important;overflow:hidden!important;background:#F7F3EB!important}
body{padding:0!important;display:block!important;min-height:100dvh!important;touch-action:pan-y;overscroll-behavior:none}
.phone{width:100vw!important;height:100dvh!important;min-height:100dvh!important;max-width:none!important;border-radius:0!important;box-shadow:none!important}
.status{display:none!important;height:0!important;padding:0!important;visibility:hidden!important}
.screen{height:100dvh!important;padding-top:calc(env(safe-area-inset-top) + 14px)!important;overflow-x:hidden!important}
.quote-card{cursor:pointer}
.quote-card .heart{position:relative;z-index:3}
.specimen-section{border-top:1px solid var(--soft);padding:24px 0}
.specimen-section:first-of-type{margin-top:36px}
.specimen-section-title{display:grid;grid-template-columns:44px 1fr;gap:12px;align-items:center;margin:0 0 14px}
.specimen-section-title .mono{color:var(--ink)}
.specimen-section .acc-body{padding:0 0 0 56px}
.specimen-section .dosgrid{padding-left:0}
@supports(height:100svh){body,.phone{height:100svh!important;min-height:100svh!important}.screen{height:100svh!important}}
`;
if (!h.includes('/* specimen-flow-fix */')) h = h.replace('</style>', `/* specimen-flow-fix */${css}</style>`);

const patch = `
function rememberTodayPos(){if(st.tab==='today'&&!st.detail)st.todayY=screen.scrollTop||0}
function restoreTodayPos(){setTimeout(()=>screen.scrollTo(0,Number(st.todayY||0)),0)}
function openSpecimenFromToday(id){rememberTodayPos();st.detail=id;st.returnTab='today';st.tab='gallery';save();detail()}
function attachTodayCardOpen(){todayItems().forEach(s=>{let card=document.querySelector('[data-today-id="'+s.id+'"]');if(card)card.onclick=()=>openSpecimenFromToday(s.id);let heart=document.getElementById('save-'+s.id);if(heart)heart.onclick=e=>{e.stopPropagation();toggleSave(s.id)}})}
quoteCard=function(s,n){return \`<section class="quote-card" data-today-id="\${s.id}"><div class="qmeta"><span class="mono">\${String(n).padStart(2,'0')} · \${s.domain}</span><button class="heart" id="save-\${s.id}">\${st.saved.has(s.id)?'♥':'♡'}</button></div><div class="quote-mark">“</div><h2 class="today-quote">\${s.quote}</h2><div class="source mono">\${s.source}</div></section>\`}
function goToday(){st.detail='';st.returnTab='';st.tab='today';save();render();restoreTodayPos()}
function attachGallerySwipe(){let sx=0,sy=0,active=false;screen.ontouchstart=e=>{if(st.tab!=='gallery'||st.detail)return;let t=e.touches[0];sx=t.clientX;sy=t.clientY;active=true};screen.ontouchend=e=>{if(!active||st.tab!=='gallery'||st.detail)return;let t=e.changedTouches[0],dx=t.clientX-sx,dy=t.clientY-sy;active=false;if(dx>85&&Math.abs(dy)<70)goToday()}}
const originalToday=today;
today=function(){originalToday();attachTodayCardOpen();restoreTodayPos()}
const originalGallery=gallery;
gallery=function(){originalGallery();if(!st.detail)attachGallerySwipe()}
detail=function(){let s=specimenById(st.detail)||todayItems()[0],orig=st.orig===s.id;bump('opened',s.id);screen.innerHTML=\`<div class="detail-head"><button class="mono" id="close">×</button><div style="text-align:center"><div class="mono">Specimen</div><div class="mono muted" style="margin-top:12px">\${s.domain}</div></div><button class="heart" id="saveD">\${st.saved.has(s.id)?'♥':'♡'}</button></div><div class="mono muted" style="margin-bottom:18px">Specimen</div><h1 class="detail-title">\${s.title}</h1><p class="detail-subtitle">\${s.summary}</p><div class="quote-mark">“</div><h2 id="quoteToggle" class="today-quote \${s.original?'quote-toggle':''} \${orig?'showing':''}" style="font-size:48px">\${orig&&s.original?s.original:s.quote}</h2>\${orig&&s.original?'<span class="original-label">(original text)</span>':''}<div class="source mono">\${s.source}</div><div class="reader-actions"><button class="pill" id="copy">▣ Copy</button></div><section class="specimen-section"><div class="specimen-section-title"><div class="teaching-icon">⌁</div><div class="mono">Historical Context</div></div><p class="acc-body">\${s.context}</p></section><section class="specimen-section"><div class="specimen-section-title"><div class="teaching-icon">◐</div><div class="mono">What It Teaches</div></div><p class="acc-body">\${s.teaches}</p></section><section class="specimen-section" id="deploy"><div class="specimen-section-title"><div class="teaching-icon">✓</div><div class="mono">Deploy Today</div></div><div class="acc-body dosgrid"><div class="doscol"><b>Do</b><ul>\${s.dos.map(x=>\`<li>\${x}</li>\`).join('')}</ul></div><div class="doscol"><b>Do not</b><ul>\${s.donts.map(x=>\`<li>\${x}</li>\`).join('')}</ul></div></div></section>\`;$('#close').onclick=()=>{let back=st.returnTab||'gallery';if(back==='today')goToday();else{st.detail='';st.returnTab='';save();gallery()}};$('#saveD').onclick=()=>toggleSave(s.id);let qt=$('#quoteToggle');if(qt&&s.original)qt.onclick=()=>{st.orig=orig?'':s.id;detail()};$('#copy').onclick=()=>{navigator.clipboard?.writeText(\`\${s.quote}\\n— \${s.source}\`);show('Copied')};bump('practiced',s.id)}
`;
if (!h.includes('function openSpecimenFromToday')) h = h.replace('runTests();render();', patch + '\nrunTests();render();');
fs.writeFileSync(p, h);
