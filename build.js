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
  const base={
    'Today':['今日','오늘'],'Gallery':['馆藏','갤러리'],'Self':['自我','나'],'Sharper':['Sharper','Sharper'],
    'Save':['收藏','저장'],'Saved':['已收藏','저장됨'],'Open':['打开','열기'],'Search':['搜索','검색'],'All':['全部','전체'],'Saved only':['仅收藏','저장됨'],
    'Historical Context':['历史语境','역사적 맥락'],'What It Teaches':['它教会什么','무엇을 가르치는가'],'Deploy Today':['今日实践','오늘 실행'],'Do':['要做','할 것'],"Don't":['不要','하지 말 것'],
    'Dos':['要做','할 것'],'Do not':['不要','하지 말 것'],'Leadership':['领导力','리더십'],'Communication':['沟通','커뮤니케이션'],'Psychology':['心理学','심리학'],'Philosophy':['哲学','철학'],
    'Profile':['档案','프로필'],'Attention Field':['注意力场','주의 영역'],'Saved Authors':['已收藏作者','저장作者'],'Reset':['重置','재설정'],'Reposition':['重新定位','다시 배치'],
    'Go to Next Day':['进入下一天','다음 날로'],'Curated set complete':['策展集已完成','큐레이션 완료'],'tap for original text':['点击查看原文','원문 보기'],'tap for translated text':['点击查看译文','번역 보기'],
    'Original language':['原文','원문'],'HISTORICAL CONTEXT':['历史语境','역사적 맥락'],'WHAT IT TEACHES':['它教会什么','무엇을 가르치는가'],'DEPLOY TODAY':['今日实践','오늘 실행'],
    'Sharper Beta · v0.11':['Sharper 测试版 · v0.11','Sharper 베타 · v0.11'],'Version':['版本','버전'],'Living library':['流动馆藏','살아있는 라이브러리'],'Note from designer':['设计者札记','디자이너 노트'],
    'Lead Without Loud':['无声地领导','조용히 이끌기'],'The Examined Life':['经省察的人生','성찰하는 삶'],'Learning as Return':['学习即回返','배움은 돌아오는 것'],'Education as Fire':['教育如火','교육은 불꽃'],
    'Victory Before Battle':['先胜而后战','싸움 전의 승리'],'Learn by Doing':['在行动中学习','행동으로 배우기'],'For Want of a Nail':['一枚钉子的缺失','못 하나의 결핍'],'Color of Thought':['思想的颜色','생각의 색'],
    'What You Attend To':['你所注意的事物','당신이 주목하는 것'],'The Quiet Room':['安静的房间','조용한 방'],'The View We Take':['我们采取的看法','우리가 취하는 관점'],'Matter of My Book':['我即我书之材料','나는 내 책의 재료'],
    'Rectify the Names':['正名','이름을 바로잡기'],'The Two Ears':['两只耳朵','두 귀'],'Half of Wisdom':['智慧的一半','지혜의 절반'],'Use Fewer Words':['少用语言','말을 줄이기'],
    'When the work is done, and things have gone well, the people say: we did it ourselves.':['功成事遂，百姓皆谓我自然。','일이 이루어지고 잘 끝났을 때, 사람들은 말한다. 우리가 스스로 해냈다고.'],
    'The unexamined life is not worth living.':['未经省察的人生不值得过。','성찰하지 않는 삶은 살 가치가 없다.'],
    'Is it not a pleasure, having learned something, to try it out at due intervals?':['学而时习之，不亦说乎？','배우고 때때로 익히면 또한 기쁘지 아니한가?'],
    'The mind is not a vessel to be filled, but a fire to be kindled.':['心智不是待填满的容器，而是待点燃的火。','정신은 채워야 할 그릇이 아니라 불붙여야 할 불이다.'],
    'The victorious first make victory possible, then seek battle.':['胜兵先胜而后求战。','승리하는 자는 먼저 이길 조건을 만든 뒤 싸움을 구한다.'],
    'For the things we have to learn before we can do them, we learn by doing them.':['凡必须先学会才能做的事，我们正是在做中学会。','하기 전에 배워야 하는 것들은, 실제로 하면서 배운다.'],
    'For want of a nail the shoe was lost.':['少了一枚钉，马蹄铁便失落。','못 하나가 없어 말굽쇠를 잃었다.'],
    'The soul becomes dyed with the color of its thoughts.':['灵魂会被思想的颜色染上。','영혼은 자기 생각의 색으로 물든다.'],
    'My experience is what I agree to attend to.':['我的经验，就是我同意去注意的东西。','나의 경험은 내가 주의를 기울이기로 동의한 것이다.'],
    'All of humanity’s problems stem from the inability to sit quietly in a room alone.':['人类所有问题都源于无法独自安静地坐在房间里。','인간의 모든 문제는 혼자 방 안에 조용히 앉아 있지 못하는 데서 비롯된다.'],
    'People are disturbed not by things, but by the views they take of them.':['扰乱人的不是事物本身，而是人对事物的看法。','사람을 괴롭히는 것은 사물이 아니라 그것에 대한 관점이다.'],
    'I am myself the matter of my book.':['我自己就是我这本书的材料。','나 자신이 내 책의 재료다.'],
    'If names are not correct, language will not be in accordance with the truth of things.':['名不正，则言不顺。','이름이 바르지 않으면 말이 사물의 진실과 맞지 않는다.'],
    'We have two ears and one mouth, that we may listen the more and talk the less.':['我们有两只耳朵和一张嘴，是为了多听少说。','우리에게 귀가 둘이고 입이 하나인 것은 더 듣고 덜 말하기 위해서다.'],
    'A prudent question is one half of wisdom.':['谨慎的问题，是智慧的一半。','신중한 질문은 지혜의 절반이다.'],
    'Those who know do not speak; those who speak do not know.':['知者不言，言者不知。','아는 사람은 말하지 않고, 말하는 사람은 알지 못한다.'],
    'The highest form of influence lets agency appear inside other people.':['最高形式的影响力，是让行动感在他人身上出现。','가장 높은 영향력은 주도성이 다른 사람 안에서 생기게 한다.'],
    'Self-knowledge begins with refusing to inherit yourself unconsciously.':['自知始于拒绝无意识地继承自己。','자기 인식은 무의식적으로 물려받은 자신을 거부하는 데서 시작한다.'],
    'Learning becomes real when it returns into practice.':['学习回到实践时才成为真实。','배움은 실천으로 돌아올 때 현실이 된다.'],
    'Strategy arranges conditions before action becomes visible.':['策略在行动显现之前安排条件。','전략은 행동이 보이기 전에 조건을 배치한다.'],
    'Attention does not merely observe life; it composes it.':['注意力不只是观察生活，它构成生活。','주의는 삶을 관찰할 뿐 아니라 구성한다.'],
    'The event and the interpretation are not the same object.':['事件与解释不是同一个东西。','사건과 해석은 같은 것이 아니다.'],
    'Precision in language protects precision in conduct.':['语言的精确保护行动的精确。','언어의 정확성은 행동의 정확성을 지킨다.'],
    'Listening is not silence; it is disciplined proportion.':['倾听不是沉默，而是有纪律的比例。','경청은 침묵이 아니라 훈련된 비율이다.']
  };
  const dict={};Object.keys(base).forEach(k=>dict[k]={zh:base[k][0],ko:base[k][1]});
  const reverse={};Object.keys(dict).forEach(k=>{reverse[k]=k;reverse[k.toUpperCase()]=k;reverse[dict[k].zh]=k;reverse[dict[k].ko]=k});
  function lang(){return localStorage.getItem(key)||'en'}
  function setLang(v){localStorage.setItem(key,v);apply(true)}
  function trString(s,L){
    if(!s)return s;
    let raw=s.trim(); if(!raw)return s;
    let baseKey=reverse[raw]||reverse[raw.toUpperCase()];
    if(baseKey){let out=L==='en'?baseKey:(dict[baseKey]&&dict[baseKey][L])||baseKey;return s.replace(raw,out)}
    let out=s;
    Object.keys(dict).sort((a,b)=>b.length-a.length).forEach(k=>{let target=L==='en'?k:dict[k][L];out=out.split(k).join(target);out=out.split(dict[k].zh).join(target);out=out.split(dict[k].ko).join(target)});
    if(L!=='en'){
      out=out.replace(/MONDAY/g,L==='zh'?'星期一':'월요일').replace(/TUESDAY/g,L==='zh'?'星期二':'화요일').replace(/WEDNESDAY/g,L==='zh'?'星期三':'수요일').replace(/THURSDAY/g,L==='zh'?'星期四':'목요일').replace(/FRIDAY/g,L==='zh'?'星期五':'금요일').replace(/SATURDAY/g,L==='zh'?'星期六':'토요일').replace(/SUNDAY/g,L==='zh'?'星期日':'일요일');
      out=out.replace(/JANUARY/g,L==='zh'?'一月':'1월').replace(/FEBRUARY/g,L==='zh'?'二月':'2월').replace(/MARCH/g,L==='zh'?'三月':'3월').replace(/APRIL/g,L==='zh'?'四月':'4월').replace(/MAY/g,L==='zh'?'五月':'5월').replace(/JUNE/g,L==='zh'?'六月':'6월').replace(/JULY/g,L==='zh'?'七月':'7월').replace(/AUGUST/g,L==='zh'?'八月':'8월').replace(/SEPTEMBER/g,L==='zh'?'九月':'9월').replace(/OCTOBER/g,L==='zh'?'十月':'10월').replace(/NOVEMBER/g,L==='zh'?'十一月':'11월').replace(/DECEMBER/g,L==='zh'?'十二月':'12월');
      out=out.replace(/DAY (\d+)/g,L==='zh'?'第 $1 天':'$1일차');
    }
    return out;
  }
  function apply(){
    const L=lang();document.documentElement.lang=L==='zh'?'zh-Hans':(L==='ko'?'ko':'en');
    let b=document.getElementById('langToggle');if(b)b.textContent=labels[L];
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(n){return n.parentElement&&n.parentElement.id!=='langToggle'?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{const v=trString(n.nodeValue,L);if(v!==n.nodeValue)n.nodeValue=v});
    document.querySelectorAll('input[placeholder]').forEach(el=>el.placeholder=trString(el.placeholder,L));
  }
  function mount(){
    if(!document.getElementById('langToggle')){const btn=document.createElement('button');btn.id='langToggle';btn.className='lang-toggle';btn.type='button';btn.setAttribute('aria-label','Language');btn.onclick=function(e){e.preventDefault();let i=order.indexOf(lang());setLang(order[(i+1)%order.length])};(document.getElementById('phone')||document.body).appendChild(btn)}
    apply();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
  let busy=false;new MutationObserver(()=>{if(busy)return;busy=true;requestAnimationFrame(()=>{apply();busy=false})}).observe(document.body,{childList:true,subtree:true,characterData:true});
})();
</script>`;
if (!h.includes('status-icons-removed')) h = h.replace('</style>', `/* status-icons-removed */${css}</style>`);
if (h.includes('sharper-ui-language')) h = h.replace(/<script>\s*\(function\(\)\{\s*const key='sharper-ui-language';[\s\S]*?<\/script>/, js);
else h = h.replace('</body>', `${js}</body>`);
fs.writeFileSync(p, h);
