// Configuração e funções compartilhadas
window.CLUBE = (function () {
  const cfg = window.CLUBE_CONFIG || {};
  const sb = (window.supabase && cfg.url && cfg.chave) ? window.supabase.createClient(cfg.url, cfg.chave) : null;

  const INICIO = '2026-11-23';
  const FIM = '2026-12-13';
  const ULT_SEMANA = '2026-12-07';
  const HABITOS = [
    { k: 'alimentacao', ic: '🥗', nome: 'Alimentação', verbo: 'comendo bem' },
    { k: 'exercicio', ic: '🏋️‍♀️', nome: 'Exercício', verbo: 'treinando' },
    { k: 'agua', ic: '💧', nome: 'Água', verbo: 'bebendo água' },
    { k: 'fruta', ic: '🍎', nome: 'Fruta', verbo: 'comendo fruta' }
  ];

  function hojeSP() {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
  }
  function addDias(iso, n) {
    const [y, m, d] = iso.split('-').map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d + n));
    return dt.toISOString().slice(0, 10);
  }
  function ddmm(iso) { if (!iso) return ''; const [, m, d] = iso.split('-'); return d + '/' + m; }
  function semana(iso) { const [y, m, d] = iso.split('-').map(Number); return ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'][new Date(Date.UTC(y, m - 1, d)).getUTCDay()]; }
  function numDia(iso) { return Math.round((Date.parse(iso) - Date.parse(INICIO)) / 86400000) + 1; }
  function dias() { const out = []; for (let d = INICIO; d <= FIM; d = addDias(d, 1)) out.push(d); return out; }

  function el(tag, cls, txt) { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  async function copiar(texto) {
    try { await navigator.clipboard.writeText(texto); return true; } catch (e) { }
    try {
      const ta = document.createElement('textarea'); ta.value = texto; ta.setAttribute('readonly', '');
      ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta);
      ta.select(); ta.setSelectionRange(0, texto.length);
      const ok = document.execCommand('copy'); ta.remove(); return ok;
    } catch (e) { return false; }
  }

  function toast(msg, tipo) {
    let t = document.getElementById('toast');
    if (!t) { t = el('div'); t.id = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.className = 'toast show' + (tipo === 'erro' ? ' erro' : '');
    clearTimeout(toast._t); toast._t = setTimeout(() => { t.className = 'toast'; }, 2400);
  }

  function seta(v) {
    if (v == null) return '';
    if (v > 0) return '⬆️' + v;
    if (v < 0) return '⬇️' + Math.abs(v);
    return '➖';
  }

  // Ranking calculado a partir dos registros (usado na área da Mari)
  // regs: [{participante_id, dia, habito, valor}]
  function ranking(participantes, regs, ref) {
    const porDia = new Map(); // pid -> Map(dia -> {pts, n})
    for (const r of regs) {
      if (r.dia < INICIO || r.dia > ref) continue;
      if (!porDia.has(r.participante_id)) porDia.set(r.participante_id, new Map());
      const m = porDia.get(r.participante_id);
      const o = m.get(r.dia) || { pts: 0, n: 0 }; o.pts += r.valor; o.n++; m.set(r.dia, o);
    }
    function calc(limite) {
      return participantes.map(p => {
        let total = 0, comp = 0, dias = 0, ult = 0;
        const m = porDia.get(p.id);
        if (m) for (const [d, o] of m) {
          if (d > limite) continue;
          total += o.pts; dias++; if (o.n === 4) comp++; if (d >= ULT_SEMANA) ult += o.pts;
        }
        return { p, total, comp, dias, ult };
      }).sort((a, b) => b.total - a.total || b.comp - a.comp || b.dias - a.dias || b.ult - a.ult || (a.p.ordem - b.p.ordem));
    }
    const atual = calc(ref);
    const antes = ref > INICIO ? calc(addDias(ref, -1)) : null;
    const posAntes = new Map(); if (antes) antes.forEach((x, i) => posAntes.set(x.p.id, i + 1));
    return atual.map((x, i) => ({ ...x, pos: i + 1, var: antes ? posAntes.get(x.p.id) - (i + 1) : null }));
  }

  return { sb, cfg, INICIO, FIM, ULT_SEMANA, HABITOS, hojeSP, addDias, ddmm, semana, numDia, dias, el, copiar, toast, seta, ranking };
})();
