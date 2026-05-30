// Adds Supabase cards to the existing Sharp UI without changing the interface.
// This file runs after the original app script has already loaded.
(function () {
  const url = 'https://' + 'ifcapazyxzivkayxrcbf' + '.supabase.co';
  const key = ['sb', 'publishable', 'HSCyhRkhvMHrQQYcwIeYfg', '8cNBu48D'].join('_');

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

  async function loadSupabaseCards() {
    if (typeof specimens === 'undefined' || typeof plans === 'undefined') return;

    const endpoint =
      url +
      '/rest/v1/insight_cards' +
      '?select=id,title,lead_sentence,main_quote,quote_author,source_line,historical_context,what_it_teaches,deploy_today,status,score,created_at,concepts(name,domain,source_hint)' +
      '&status=eq.live' +
      '&order=created_at.desc' +
      '&limit=200';

    const response = await fetch(endpoint, {
      headers: { apikey: key }
    });

    if (!response.ok) throw new Error('Supabase request failed: ' + response.status);

    const rows = await response.json();
    if (!Array.isArray(rows) || rows.length === 0) return;

    const liveCards = rows.map(mapCard);

    liveCards.forEach((card) => {
      const existingIndex = specimens.findIndex((item) => item.id === card.id);
      if (existingIndex >= 0) specimens[existingIndex] = card;
      else specimens.unshift(card);
    });

    if (Array.isArray(plans) && plans.length > 0) {
      plans[0] = liveCards.map((card) => card.id);
    }

    if (typeof st === 'object') {
      st.seed = 0;
      if (typeof save === 'function') save();
    }

    if (typeof render === 'function') render();
  }

  loadSupabaseCards().catch((error) => {
    console.warn('Supabase live cards unavailable', error);
  });
})();