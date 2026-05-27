const fs = require('fs');
const p = 'dist/index.html';
let h = fs.readFileSync(p, 'utf8');
const css = `
html,body{margin:0!important;width:100%!important;height:100%!important;overflow:hidden!important;background:#F7F3EB!important}
body{padding:0!important;display:block!important;min-height:100dvh!important;touch-action:pan-y;overscroll-behavior:none}
.phone{width:100vw!important;height:100dvh!important;min-height:100dvh!important;max-width:none!important;border-radius:0!important;box-shadow:none!important}
.status{display:none!important;height:0!important;padding:0!important;visibility:hidden!important}
.screen{height:100dvh!important;padding-top:calc(env(safe-area-inset-top) + 14px)!important}
.lang-toggle{position:absolute;right:18px;bottom:112px;z-index:75;width:38px;height:38px;border:1px solid var(--soft);border-radius:999px;background:rgba(247,243,235,.86);backdrop-filter:blur(14px);display:grid;place-items:center;color:var(--earth);font:600 11px var(--mono);letter-spacing:.08em;box-shadow:0 8px 26px rgba(26,23,20,.08)}
.nav.hidden~.lang-toggle{display:none!important}
@supports(height:100svh){body,.phone{height:100svh!important;min-height:100svh!important}.screen{height:100svh!important}}
`;
const js = `
<script>
(function(){
  const key='sharper-ui-language';
  const order=['en','zh','ko'];
  const labels={en:'文',zh:'中',ko:'한'};
  const dict={
    'Today':{zh:'今日',ko:'오늘'},'Gallery':{zh:'馆藏',ko:'갤러리'},'Self':{zh:'自我',ko:'나'},'Sharper':{zh:'Sharper',ko:'Sharper'},
    'Save':{zh:'收藏',ko:'저장'},'Saved':{zh:'已收藏',ko:'저장됨'},'Open':{zh:'打开',ko:'열기'},'History':{zh:'历史语境',ko:'역사적 맥락'},
    'What It Teaches':{zh:'它教会什么',ko:'무엇을 가르치는가'},'Deploy Today':{zh:'今日实践',ko:'오늘 실행'},'Dos':{zh:'要做',ko:'할 것'},'Do not':{zh:'不要',ko:'하지 말 것'},
    'Profile':{zh:'档案',ko:'프로필'},'Attention Field':{zh:'注意力场',ko:'주의 영역'},'Saved Authors':{zh:'已收藏作者',ko:'저장한 저자'},'Reset':{zh:'重置',ko:'재설정'},
    'Go to Next Day':{zh:'进入下一天',ko:'다음 날로'},'Curated set complete':{zh:'策展集已完成',ko:'큐레이션 완료'},
    'tap for original text':{zh:'点击查看原文',ko:'원문 보기'},'tap for translated text':{zh:'点击查看译文',ko:'번역 보기'},
    'Historical Context':{zh:'历史语境',ko:'역사적 맥락'},'Do':{zh:'要做',ko:'할 것'},"Don't":{zh:'不要',ko:'하지 말 것'},
    'Leadership':{zh:'领导力',ko:'리더십'},'Communication':{zh:'沟通',ko:'커뮤니케이션'},'Psychology':{zh:'心理学',ko:'심리학'},'Philosophy':{zh:'哲学',ko:'철학'},
    'Search':{zh:'搜索',ko:'검색'},'All':{zh:'全部',ko:'전체'},'Saved only':{zh:'仅收藏',ko:'저장됨'},'Reposition':{zh:'重新定位',ko:'다시 배치'}
  };
  function lang(){return localStorage.getItem(key)||'en'}
  function setLang(v){localStorage.setItem(key,v);apply();}
  function makeReverse(){const rev={};Object.keys(dict).forEach(k=>{rev[k]=k;Object.values(dict[k]).forEach(v=>rev[v]=k)});return rev}
  const rev=makeReverse();
  function translateText(t,L){let raw=t.trim();if(!raw)return t;let base=rev[raw];if(!base)return t;let next=L==='en'?base:(dict[base]&&dict[base][L])||base;return t.replace(raw,next)}
  function apply(){
    const L=lang();
    document.documentElement.lang=L==='zh'?'zh-Hans':(L==='ko'?'ko':'en');
    let b=document.getElementById('langToggle');if(b)b.textContent=labels[L];
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(n){return n.parentElement&&n.parentElement.id!=='langToggle'?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{n.nodeValue=translateText(n.nodeValue,L)});
    document.querySelectorAll('input[placeholder]').forEach(el=>{el.placeholder=translateText(el.placeholder,L)});
  }
  function mount(){
    if(!document.getElementById('langToggle')){
      const btn=document.createElement('button');btn.id='langToggle';btn.className='lang-toggle';btn.type='button';btn.setAttribute('aria-label','Language');
      btn.onclick=function(){let i=order.indexOf(lang());setLang(order[(i+1)%order.length]);};
      const phone=document.getElementById('phone')||document.body;phone.appendChild(btn);
    }
    apply();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
  let busy=false;new MutationObserver(()=>{if(busy)return;busy=true;requestAnimationFrame(()=>{apply();busy=false})}).observe(document.body,{childList:true,subtree:true});
})();
</script>`;
if (!h.includes('status-icons-removed')) h = h.replace('</style>', `/* status-icons-removed */${css}</style>`);
if (!h.includes('sharper-ui-language')) h = h.replace('</body>', `${js}</body>`);
fs.writeFileSync(p, h);
