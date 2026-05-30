// Adds Supabase cards to the existing Sharp UI without changing the interface.
// This file runs after the original app script has already loaded.
(function () {
  const url = 'https://' + 'ifcapazyxzivkayxrcbf' + '.supabase.co';
  const key = ['sb', 'publishable', 'HSCyhRkhvMHrQQYcwIeYfg', '8cNBu48D'].join('_');
  const BATCH_SIZE = 4;

  function domainIcon(domain) {
    const d = String(domain || '').toLowerCase();
    if (d === 'leadership') return '△';
    if (d === 'psychology') return '◐';
    if (d === 'communication') return '“';
    if (d === 'strategy') return '◇';
    if (d === 'attention') return '◎';
    if (d === 'relationships') return '∿';
    return '✦';
  }

  function mapCard(row) {
    const domain = row.concepts && row.concepts.domain ? row.concepts.domain.toLowerCase() : 'philosophy';
    return {
      id: 'supabase-' + row.id,
      domain,
      icon: domainIcon(domain),
      title: row.title || 'Untitled specimen',
      quote: row.main_quote || row.lead_sentence || '',
      source: [row.quote_author, row.source_line].filter(Boolean).join(' · '),
      summary: row.lead_sentence || '',
      context: row.historical_context || '',
      teaches: row.what_it_teaches || '',
      dos: [row.deploy_today || 'Carry this idea into one concrete action today.'],
      donts: ['Do not treat the insight as decoration.']
    };
  }

  function chunk(ids) {
    const out = [];
    for (let i = 0; i < ids.length; i += BATCH_SIZE) out.push(ids.slice(i, i + BATCH_SIZE));
    return out;
  }

  function resetDetailScrollOnOpen() {
    if (window.__sharpDetailScrollReset) return;
    window.__sharpDetailScrollReset = true;
    const getScreen = () => document.querySelector('.screen');
    const reset = () => {
      const screen = getScreen();
      if (screen && typeof st === 'object' && st.detail) requestAnimationFrame(() => screen.scrollTo(0, 0));
    };
    document.addEventListener('click', (event) => {
      const target = event.target && event.target.closest && event.target.closest('.quote-card,.card');
      if (target) setTimeout(reset, 80);
    }, true);
  }

  function installBatchMode(liveIds) {
    if (!Array.isArray(plans)) return;
    const batches = chunk(liveIds);
    plans.length = 0;
    batches.forEach((batch) => plans.push(batch));
    if (typeof st === 'object') {
      st.seed = Math.min(Number(st.seed || 0), Math.max(plans.length - 1, 0));
      if (typeof save === 'function') save();
    }
  }

  async function loadSupabaseCards() {
    if (typeof specimens === 'undefined' || typeof plans === 'undefined') return;

    const endpoint =
      url +
      '/rest/v1/insight_cards' +
      '?select=id,title,lead_sentence,main_quote,quote_author,source_line,historical_context,what_it_teaches,deploy_today,status,score,created_at,concepts(name,domain,source_hint)' +
      '&status=eq.live' +
      '&order=created_at.desc' +
      '&limit=200';

    const response = await fetch(endpoint, { headers: { apikey: key } });
    if (!response.ok) throw new Error('Supabase request failed: ' + response.status);

    const rows = await response.json();
    if (!Array.isArray(rows) || rows.length === 0) return;

    const liveCards = rows.map(mapCard);
    liveCards.forEach((card) => {
      const existingIndex = specimens.findIndex((item) => item.id === card.id);
      if (existingIndex >= 0) specimens[existingIndex] = card;
      else specimens.unshift(card);
    });

    installBatchMode(liveCards.map((card) => card.id));
    resetDetailScrollOnOpen();
    if (typeof render === 'function') render();
  }

  loadSupabaseCards().catch((error) => console.warn('Supabase live cards unavailable', error));
})();

// Experimental chalk interface layer, after Sharper v2 restore point.
(function () {
  function colorFor(domain, i) {
    const d = String(domain || '').toLowerCase();
    if (d === 'leadership') return '#B9FBC0';
    if (d === 'communication') return '#A0C4FF';
    if (d === 'psychology') return '#FFD6A5';
    if (d === 'philosophy') return '#FFADAD';
    return ['#B9FBC0', '#A0C4FF', '#FFD6A5', '#FFADAD'][Math.abs(i || 0) % 4];
  }

  function iconFor(domain) {
    const d = String(domain || '').toLowerCase();
    if (d === 'leadership') return '△';
    if (d === 'communication') return '( )';
    if (d === 'psychology') return '◐';
    if (d === 'philosophy') return '✦';
    return '✦';
  }

  function pill(domain, i) {
    const d = String(domain || 'philosophy').toLowerCase();
    return '<span class="domain-pill" style="--pill:' + colorFor(d, i) + '">' + d + '</span>';
  }

  function installStyle() {
    if (document.getElementById('sharp-experiment-style')) return;
    const style = document.createElement('style');
    style.id = 'sharp-experiment-style';
    style.textContent = `
      .pull-pill{background:#ff6a00!important;color:#050505!important;box-shadow:0 0 20px rgba(255,106,0,.45)!important}
      .domain-pill{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:22px!important;padding:0 9px!important;border-radius:999px!important;background:color-mix(in srgb,var(--pill,#F4F0E6) 18%,transparent)!important;border:1px solid color-mix(in srgb,var(--pill,#F4F0E6) 72%,transparent)!important;color:var(--pill,#F4F0E6)!important;font:600 8px var(--mono)!important;letter-spacing:.16em!important;text-transform:uppercase!important;white-space:nowrap!important}
      .qmeta{gap:10px!important;justify-content:flex-start!important}.qmeta .heart{margin-left:auto!important}.qnum{color:rgba(244,240,230,.48)!important}
      .today-posture{display:none!important}.word{font-size:9px!important;letter-spacing:.22em!important;font-weight:500!important}.top{min-height:40px!important;padding:0 14px!important}.progress i{height:1px!important;opacity:.55!important}
      .nav{grid-template-columns:repeat(3,1fr)!important}.nav button[data-gallery-tab="1"]{display:none!important}
      .self-name{cursor:text!important}.self-name:after{content:'tap to edit';display:block;margin-top:10px;color:rgba(244,240,230,.45);font:8px var(--mono);letter-spacing:.18em;text-transform:uppercase}.self-gallery-title{margin:32px 0 14px;color:rgba(244,240,230,.72)!important}.self-gallery-card{width:100%;text-align:left;color:#F4F0E6!important}.author{cursor:pointer}.author.active{color:#ff6a00!important}.detail-domain-pill{margin:0 0 18px}.detail-domain-pill .domain-pill{min-height:24px!important;padding:0 11px!important}
    `;
    document.head.appendChild(style);
  }

  function currentIds() {
    const seed = Number((window.st && st.seed) || 0);
    const base = Array.isArray(window.plans) ? (plans[seed] || plans[0] || []) : [];
    return base.slice(0, 4);
  }

  function getCard(id) {
    return typeof window.specimenById === 'function' ? specimenById(id) : null;
  }

  function cardHTML(item, i) {
    if (!item) return '';
    return '<button class="card self-gallery-card" data-open-card="' + item.id + '" style="--pill:' + colorFor(item.domain, i) + '">' +
      '<div class="card-icon">' + (item.icon || iconFor(item.domain)) + '</div>' +
      '<div><div class="card-title">' + item.title + '</div><p class="card-sub">' + item.summary + '</p>' + pill(item.domain, i) + '</div>' +
      '<div class="tiny">→</div></button>';
  }

  function openCard(id) {
    if (typeof window.openSpecimenFromToday === 'function') openSpecimenFromToday(id);
    else if (typeof window.detail === 'function' && typeof window.st === 'object') { st.detail = id; st.tab = 'gallery'; if (typeof save === 'function') save(); detail(); }
  }

  function installQuoteOverride() {
    if (window.__sharpQuotePills || typeof window.quoteCard !== 'function') return;
    window.__sharpQuotePills = true;
    window.todayItems = function () { return currentIds().map(getCard).filter(Boolean); };
    window.quoteCard = function (s, n) {
      const c = colorFor(s.domain, n - 1);
      return '<section class="quote-card" style="--chalk:' + c + ';--pill:' + c + '" data-today-id="' + s.id + '" onclick="openSpecimenFromToday(\'' + s.id + '\')">' +
        '<div class="qmeta"><span class="mono qnum">' + String(n).padStart(2, '0') + '</span>' + pill(s.domain, n - 1) + '<button class="heart" id="save-' + s.id + '" onclick="event.stopPropagation();toggleSave(\'' + s.id + '\')">' + (st.saved.has(s.id) ? '♥' : '♡') + '</button></div>' +
        '<div class="quote-mark">“</div><h2 class="today-quote">' + s.quote + '</h2><div class="source mono">' + s.source + '</div></section>';
    };
  }

  function decorateNav() {
    document.querySelectorAll('.nav button').forEach((button) => {
      const text = (button.textContent || '').toLowerCase();
      if (text.includes('gallery') || text.includes('library')) button.setAttribute('data-gallery-tab', '1');
    });
  }

  function decorateDetail() {
    if (!window.st || !st.detail) return;
    const item = getCard(st.detail);
    const title = document.querySelector('.detail-title');
    if (!item || !title || document.querySelector('.detail-domain-pill')) return;
    title.insertAdjacentHTML('beforebegin', '<div class="detail-domain-pill">' + pill(item.domain, 0) + '</div>');
  }

  function decorateSelf() {
    if (!window.st || st.tab !== 'self') return;
    const screen = document.querySelector('.screen');
    if (!screen) return;
    const name = document.querySelector('.self-name');
    if (name && !name.__editBound) {
      name.__editBound = true;
      name.onclick = function () {
        const next = window.prompt('Edit your name', name.textContent.trim());
        if (!next) return;
        st.name = next.trim();
        if (typeof save === 'function') save();
        if (typeof render === 'function') render();
      };
    }
    if (!document.querySelector('.self-gallery-merged')) {
      const all = (window.specimens || []).slice(0, 80);
      screen.insertAdjacentHTML('beforeend', '<section class="self-gallery-merged"><div class="self-gallery-title mono">Gallery</div><div class="cards">' + all.map(cardHTML).join('') + '</div><div class="self-gallery-title mono">Saved author results</div><div class="self-author-results"></div></section>');
    }
    document.querySelectorAll('[data-open-card]').forEach((button) => { if (!button.__openBound) { button.__openBound = true; button.onclick = () => openCard(button.getAttribute('data-open-card')); } });
    const result = document.querySelector('.self-author-results');
    document.querySelectorAll('.author').forEach((row) => {
      if (row.__authorBound) return;
      row.__authorBound = true;
      row.onclick = function () {
        document.querySelectorAll('.author').forEach((x) => x.classList.remove('active'));
        row.classList.add('active');
        const author = (row.querySelector('.nm') || row).textContent.trim().toLowerCase();
        const matches = (window.specimens || []).filter((item) => String(item.source || '').toLowerCase().includes(author));
        if (result) {
          result.innerHTML = '<div class="cards">' + (matches.length ? matches.map(cardHTML).join('') : '<div class="mono muted">No saved specimens found for this author yet.</div>') + '</div>';
          result.querySelectorAll('[data-open-card]').forEach((button) => button.onclick = () => openCard(button.getAttribute('data-open-card')));
          result.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      };
    });
  }

  function afterRender() {
    installStyle();
    installQuoteOverride();
    decorateNav();
    decorateDetail();
    decorateSelf();
  }

  function hookRender() {
    if (window.__sharpExperimentHook || typeof window.render !== 'function') return;
    window.__sharpExperimentHook = true;
    const oldRender = render;
    window.render = function () {
      const out = oldRender.apply(this, arguments);
      requestAnimationFrame(afterRender);
      return out;
    };
  }

  function boot() {
    installStyle();
    installQuoteOverride();
    hookRender();
    afterRender();
    if (typeof window.render === 'function') render();
  }

  setTimeout(boot, 120);
  setTimeout(boot, 700);
})();