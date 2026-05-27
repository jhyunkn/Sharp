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
  const rows=[
['Today','今日','오늘'],['Gallery','馆藏','갤러리'],['Self','自我','나'],['Sharper','Sharper','Sharper'],['Save','收藏','저장'],['Saved','已收藏','저장됨'],['Open','打开','열기'],['Search','搜索','검색'],['All','全部','전체'],['Saved only','仅收藏','저장됨'],['My Collection','我的收藏','내 컬렉션'],['Today’s Exhibit','今日展品','오늘의 전시'],["Today's Exhibit",'今日展品','오늘의 전시'],['quote, author, idea...','搜索引文、作者、想法…','인용문, 저자, 생각 검색…'],['saved specimens, arranged as a personal library.','已收藏的标本，被整理成个人图书馆。','저장한 표본을 개인 라이브러리로 정리했습니다.'],
['Historical Context','历史语境','역사적 맥락'],['HISTORICAL CONTEXT','历史语境','역사적 맥락'],['What It Teaches','它教会什么','무엇을 가르치는가'],['WHAT IT TEACHES','它教会什么','무엇을 가르치는가'],['Deploy Today','今日实践','오늘 실행'],['DEPLOY TODAY','今日实践','오늘 실행'],['Do','要做','할 것'],["Don't",'不要','하지 말 것'],['Dos','要做','할 것'],['Do not','不要','하지 말 것'],
['Leadership','领导力','리더십'],['Communication','沟通','커뮤니케이션'],['Psychology','心理学','심리学'],['Philosophy','哲学','철학'],['Profile','档案','프로필'],['Attention Field','注意力场','주의 영역'],['Saved Authors','已收藏作者','저장한 저자'],['Reset','重置','재설정'],['Reposition','重新定位','다시 배치'],['Original language','原文','원문'],['days reclaimed','天已收回','일 되찾음'],
['Go to Next Day','进入下一天','다음 날로'],['Curated set complete','策展集已完成','큐레이션 완료'],['tap for original text','点击查看原文','원문 보기'],['tap for translated text','点击查看译文','번역 보기'],['That is today.','今天到此为止。','오늘은 여기까지.'],['Save what returns. Let the rest pass.','收藏会回到你心中的东西，其余让它经过。','다시 떠오르는 것은 저장하고, 나머지는 흘려보내세요.'],
['Good evening,','晚上好，','좋은 저녁입니다,'],['Good morning,','早上好，','좋은 아침입니다,'],['Good afternoon,','下午好，','좋은 오후입니다,'],['Hidden Saffron posture.','隐秘藏红花姿态。','숨은 사프란 자세.'],['Work with the invisible premise. Your library has been returning to Confucius; test that thread today.','从不可见的前提出发。你的馆藏一直回到孔子；今天测试这条线索。','보이지 않는 전제를 다루세요. 당신의 라이브러리는 계속 공자로 돌아오고 있습니다. 오늘 그 실마리를 시험하세요.'],
['Lead Without Loud','无声地领导','조용히 이끌기'],['The Examined Life','经省察的人生','성찰하는 삶'],['Learning as Return','学习即回返','배움은 돌아오는 것'],['Education as Fire','教育如火','교육은 불꽃'],['Victory Before Battle','先胜而后战','싸움 전의 승리'],['Learn by Doing','在行动中学习','행동으로 배우기'],['For Want of a Nail','一枚钉子的缺失','못 하나의 결핍'],['Color of Thought','思想的颜色','생각의 색'],['What You Attend To','你所注意的事物','당신이 주목하는 것'],['The Quiet Room','安静的房间','조용한 방'],['The View We Take','我们采取的看法','우리가 취하는 관점'],['Matter of My Book','我即我书之材料','나는 내 책의 재료'],['Rectify the Names','正名','이름을 바로잡기'],['The Two Ears','两只耳朵','두 귀'],['Half of Wisdom','智慧的一半','지혜의 절반'],['Use Fewer Words','少用语言','말을 줄이기'],
['When the work is done, and things have gone well, the people say: we did it ourselves.','功成事遂，百姓皆谓我自然。','일이 이루어지고 잘 끝났을 때, 사람들은 말한다. 우리가 스스로 해냈다고.'],['The unexamined life is not worth living.','未经省察的人生不值得过。','성찰하지 않는 삶은 살 가치가 없다.'],['Is it not a pleasure, having learned something, to try it out at due intervals?','学而时习之，不亦说乎？','배우고 때때로 익히면 또한 기쁘지 아니한가?'],['The victorious first make victory possible, then seek battle.','胜兵先胜而后求战。','승리하는 자는 먼저 이길 조건을 만든 뒤 싸움을 구한다.'],['My experience is what I agree to attend to.','我的经验，就是我同意去注意的东西。','나의 경험은 내가 주의를 기울이기로 동의한 것이다.'],['If names are not correct, language will not be in accordance with the truth of things.','名不正，则言不顺。','이름이 바르지 않으면 말이 사물의 진실과 맞지 않는다.'],
['Remove one obstacle before giving advice.','在给建议前先移除一个障碍。','조언하기 전에 장애물 하나를 제거하라.'],['Let others claim ownership of the win.','让他人拥有胜利的归属感。','다른 사람이 승리의 소유권을 갖게 하라.'],['Design the condition, then step back.','设计条件，然后退后一步。','조건을 설계한 뒤 물러서라.'],['Do not make usefulness theatrical.','不要把有用性变成表演。','유용함을 연극으로 만들지 마라.'],['Do not confuse visibility with leadership.','不要把可见度误认为领导力。','가시성을 리더십과 혼동하지 마라.'],['Do not rescue people from learning agency.','不要把人从学习能动性的过程中救出来。','사람들이 주도성을 배우는 과정에서 구출하지 마라.'],['Ask one question beneath your first answer.','在第一个答案下面再问一个问题。','첫 답 아래에서 질문 하나를 더 하라.'],['Name one inherited assumption.','说出一个继承来的假设。','물려받은 가정 하나를 이름 붙여라.'],['Let discomfort become evidence.','让不适成为证据。','불편함이 증거가 되게 하라.'],['Do not confuse confidence with truth.','不要把自信误认为真理。','자신감을 진실과 혼동하지 마라.'],['Do not protect identity from examination.','不要让身份免于省察。','정체성을 성찰로부터 보호하지 마라.'],['Do not outsource judgment to the crowd.','不要把判断外包给人群。','판단을 군중에게 외주 주지 마라.'],['Repeat one idea in practice today.','今天把一个想法在实践中重复一次。','오늘 생각 하나를 실천 속에서 반복하라.'],['Return to something you learned before.','回到一个你曾学过的东西。','전에 배운 것 하나로 돌아가라.'],['Let knowledge become rhythm.','让知识成为节奏。','지식이 리듬이 되게 하라.'],['Do not collect insight without rehearsal.','不要收集没有排练的洞见。','연습 없는 통찰을 수집하지 마라.'],['Do not confuse recognition with understanding.','不要把认出误认为理解。','알아봄을 이해와 혼동하지 마라.'],['Do not rush past repetition.','不要急着越过重复。','반복을 서둘러 지나치지 마라.'],['Arrange conditions before forcing action.','在推动行动前安排条件。','행동을 강요하기 전에 조건을 배치하라.'],['Study timing and incentives.','研究时机与激励。','타이밍과 동기를 연구하라.'],['Win upstream when possible.','尽可能在上游取胜。','가능하면 상류에서 이겨라.'],['Do not confuse effort with strategy.','不要把努力误认为策略。','노력을 전략과 혼동하지 마라.'],['Do not enter conflict unpositioned.','不要在没有位置时进入冲突。','자리를 잡지 않은 채 갈등에 들어가지 마라.'],['Do not mistake drama for decisiveness.','不要把戏剧性误认为果断。','극적인 것을 결단력으로 착각하지 마라.'],['Separate the fact from the story.','把事实与故事分开。','사실과 이야기를 분리하라.'],['Write the event in one neutral sentence.','用一个中性句子写下事件。','사건을 중립적인 한 문장으로 써라.'],['Choose the next judgment deliberately.','有意识地选择下一个判断。','다음 판단을 의도적으로 선택하라.'],['Do not treat first interpretation as reality.','不要把第一解释当成现实。','첫 해석을 현실로 취급하지 마라.'],['Do not decorate fear with certainty.','不要用确定性装饰恐惧。','두려움을 확신으로 장식하지 마라.'],['Do not argue with facts by changing labels.','不要通过改标签来与事实争辩。','이름표를 바꿔 사실과 다투지 마라.']
  ];
  const dict={}; rows.forEach(([en,zh,ko])=>dict[en]={zh,ko});
  function lang(){return localStorage.getItem(key)||'en'}
  function target(k,L){return L==='en'?k:(dict[k]&&dict[k][L])||k}
  function tr(s,L){
    if(!s)return s; let out=s;
    Object.keys(dict).sort((a,b)=>b.length-a.length).forEach(k=>{out=out.split(k).join(target(k,L));out=out.split(dict[k].zh).join(target(k,L));out=out.split(dict[k].ko).join(target(k,L));});
    if(L!=='en'){
      out=out.replace(/Currently viewing day (\d+) \/ (\d+)/g,L==='zh'?'当前查看第 $1 天 / 共 $2 天':'현재 $1일차 / $2일 중');
      out=out.replace(/Currently viewing day (\d+)/g,L==='zh'?'当前查看第 $1 天':'현재 $1일차');
      out=out.replace(/DAY (\d+)/g,L==='zh'?'第 $1 天':'$1일차');
      out=out.replace(/(\d+) saved specimens, arranged as a personal library\./g,L==='zh'?'$1 个已收藏标本，被整理成个人图书馆。':'저장한 표본 $1개를 개인 라이브러리로 정리했습니다.');
      out=out.replace(/(\d+) days reclaimed/g,L==='zh'?'已收回 $1 天':'$1일 되찾음');
      out=out.replace(/Good evening, ([^\.]+)\./g,L==='zh'?'晚上好，$1。':'좋은 저녁입니다, $1.');
      out=out.replace(/Good morning, ([^\.]+)\./g,L==='zh'?'早上好，$1。':'좋은 아침입니다, $1.');
      out=out.replace(/Good afternoon, ([^\.]+)\./g,L==='zh'?'下午好，$1。':'좋은 오후입니다, $1.');
      out=out.replace(/MONDAY/g,L==='zh'?'星期一':'월요일').replace(/TUESDAY/g,L==='zh'?'星期二':'화요일').replace(/WEDNESDAY/g,L==='zh'?'星期三':'수요일').replace(/THURSDAY/g,L==='zh'?'星期四':'목요일').replace(/FRIDAY/g,L==='zh'?'星期五':'금요일').replace(/SATURDAY/g,L==='zh'?'星期六':'토요일').replace(/SUNDAY/g,L==='zh'?'星期日':'일요일');
      out=out.replace(/JANUARY/g,L==='zh'?'一月':'1월').replace(/FEBRUARY/g,L==='zh'?'二月':'2월').replace(/MARCH/g,L==='zh'?'三月':'3월').replace(/APRIL/g,L==='zh'?'四月':'4월').replace(/MAY/g,L==='zh'?'五月':'5월').replace(/JUNE/g,L==='zh'?'六月':'6월').replace(/JULY/g,L==='zh'?'七月':'7월').replace(/AUGUST/g,L==='zh'?'八月':'8월').replace(/SEPTEMBER/g,L==='zh'?'九月':'9월').replace(/OCTOBER/g,L==='zh'?'十月':'10월').replace(/NOVEMBER/g,L==='zh'?'十一月':'11월').replace(/DECEMBER/g,L==='zh'?'十二月':'12월');
    }
    return out;
  }
  function apply(){
    const L=lang(); document.documentElement.lang=L==='zh'?'zh-Hans':(L==='ko'?'ko':'en');
    const btn=document.getElementById('langToggle'); if(btn)btn.textContent=labels[L];
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode(n){return n.parentElement&&n.parentElement.id!=='langToggle'?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
    const nodes=[]; while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{const v=tr(n.nodeValue,L); if(v!==n.nodeValue)n.nodeValue=v;});
    document.querySelectorAll('input[placeholder]').forEach(el=>el.placeholder=tr(el.placeholder,L));
  }
  function mount(){
    if(!document.getElementById('langToggle')){const b=document.createElement('button');b.id='langToggle';b.className='lang-toggle';b.type='button';b.setAttribute('aria-label','Language');b.onclick=function(e){e.preventDefault();const i=order.indexOf(lang());localStorage.setItem(key,order[(i+1)%order.length]);apply();};(document.getElementById('phone')||document.body).appendChild(b);}
    apply();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
  let busy=false; new MutationObserver(()=>{if(busy)return;busy=true;requestAnimationFrame(()=>{apply();busy=false;});}).observe(document.body,{childList:true,subtree:true,characterData:true});
})();
</script>`;

if (!h.includes('status-icons-removed')) h = h.replace('</style>', `/* status-icons-removed */${css}</style>`);
h = h.replace(/<script>\s*\(function\(\)\{\s*const key='sharper-ui-language';[\s\S]*?<\/script>/, js);
if (!h.includes("const key='sharper-ui-language'")) h = h.replace('</body>', js + '</body>');
fs.writeFileSync(p, h);
