// Desenho dos robozinhos do Clubinho da Nutri (SVG gerado por código)
(function () {
  const CORES_CORPO = {
    salvia: ['#A9BFAE', '#6F8A77'], rose: ['#EBC9BF', '#C4968A'], lilas: ['#CFC3E6', '#9A88C2'],
    ceu: ['#BFD9EA', '#7FA6C2'], menta: ['#BFE6D6', '#7DB89E'], pessego: ['#F6D2B8', '#D9A07E'],
    manteiga: ['#F3E3A8', '#CDB462'], prata: ['#E3E6E4', '#A7AFAA'], coral: ['#F2B8AE', '#D9837A'],
    musgo: ['#8DA394', '#55675B']
  };
  const CORES_CABELO = {
    preto: '#1E1A19', castanho_escuro: '#3B2A22', castanho: '#6A4632', castanho_claro: '#9A6E4C',
    loiro: '#D8B56A', loiro_claro: '#EAD39A', ruivo: '#A8482C', grisalho: '#B9B4AE', rosa: '#E59AB0'
  };
  const OPCOES = {
    cor: Object.keys(CORES_CORPO),
    cabelo: ['liso', 'ondulado', 'cacheado', 'curto', 'chanel', 'coque', 'rabo'],
    corCabelo: Object.keys(CORES_CABELO),
    acessorio: ['nenhum', 'oculos', 'laco', 'bone', 'brinco', 'flor']
  };
  const NOMES = {
    salvia: 'Sálvia', rose: 'Rosê', lilas: 'Lilás', ceu: 'Céu', menta: 'Menta', pessego: 'Pêssego',
    manteiga: 'Manteiga', prata: 'Prata', coral: 'Coral', musgo: 'Musgo',
    liso: 'Liso longo', ondulado: 'Ondulado', cacheado: 'Cacheado', curto: 'Curto', chanel: 'Chanel', coque: 'Coque', rabo: 'Rabo de cavalo',
    preto: 'Preto', castanho_escuro: 'Castanho escuro', castanho: 'Castanho', castanho_claro: 'Castanho claro',
    loiro: 'Loiro', loiro_claro: 'Loiro claro', ruivo: 'Ruivo', grisalho: 'Grisalho', rosa: 'Rosa',
    nenhum: 'Nenhum', oculos: 'Óculos', laco: 'Laço', bone: 'Boné', brinco: 'Brincos', flor: 'Flor'
  };

  let uid = 0;
  function svg(robo, estado) {
    robo = robo || {};
    const id = 'r' + (++uid);
    const [c1, c2] = CORES_CORPO[robo.cor] || CORES_CORPO.salvia;
    const hc = CORES_CABELO[robo.corCabelo] || CORES_CABELO.castanho_escuro;
    const st = robo.cabelo || 'liso';
    const dorm = estado === 'dormindo';
    const aquec = estado === 'aquecendo';

    // cabelo de trás (fica atrás da cabeça)
    let tras = '';
    if (st === 'liso') tras = `<path d="M-37 22 Q-40 4 0 0 Q40 4 37 22 L38 74 Q30 80 22 74 L22 40 L-22 40 L-22 74 Q-30 80 -38 74 Z" fill="${hc}"/>`;
    if (st === 'ondulado') tras = `<path d="M-37 22 Q-40 4 0 0 Q40 4 37 22 L39 50 Q44 58 38 64 Q42 72 34 78 Q26 80 22 72 L22 40 L-22 40 L-22 72 Q-26 80 -34 78 Q-42 72 -38 64 Q-44 58 -39 50 Z" fill="${hc}"/>`;
    if (st === 'cacheado') {
      const pts = [[-36, 20], [-40, 34], [-38, 48], [-34, 60], [36, 20], [40, 34], [38, 48], [34, 60], [-26, 6], [26, 6], [-12, 0], [12, 0], [0, -2]];
      tras = pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="${hc}"/>`).join('');
    }
    if (st === 'chanel') tras = `<path d="M-37 22 Q-40 4 0 0 Q40 4 37 22 L38 56 Q30 60 24 54 L24 40 L-24 40 L-24 54 Q-30 60 -38 56 Z" fill="${hc}"/>`;
    if (st === 'rabo') tras = `<path d="M30 10 Q54 16 50 46 Q48 62 40 70 Q44 50 36 36 Z" fill="${hc}"/>`;

    // franja / topo (fica na frente da cabeça)
    let frente = '';
    if (st !== 'curto' && st !== 'cacheado') frente = `<path d="M-35 26 Q-37 2 0 1 Q37 2 35 26 Q28 14 8 13 Q-2 20 -18 15 Q-30 16 -35 26 Z" fill="${hc}"/>`;
    if (st === 'cacheado') frente = `<path d="M-34 24 Q-36 4 0 2 Q36 4 34 24 Q24 12 0 13 Q-24 12 -34 24 Z" fill="${hc}"/><circle cx="-20" cy="10" r="8" fill="${hc}"/><circle cx="0" cy="7" r="8" fill="${hc}"/><circle cx="20" cy="10" r="8" fill="${hc}"/>`;
    if (st === 'curto') frente = `<path d="M-34 22 Q-35 0 0 0 Q35 0 34 22 Q30 12 14 11 Q0 16 -12 10 Q-28 12 -34 22 Z" fill="${hc}"/>`;
    if (st === 'coque') frente += `<circle cx="0" cy="-6" r="11" fill="${hc}"/>`;

    // acessórios
    const ac = robo.acessorio || 'nenhum';
    let acess = '';
    if (ac === 'laco') acess = `<g transform="translate(24 6) rotate(15)"><path d="M0 0 L-12 -8 L-12 8 Z M0 0 L12 -8 L12 8 Z" fill="#E58FA3"/><circle r="3.5" fill="#D06A82"/></g>`;
    if (ac === 'flor') acess = `<g transform="translate(-24 8)">${[0, 72, 144, 216, 288].map(a => `<circle cx="${(6 * Math.cos(a * Math.PI / 180)).toFixed(1)}" cy="${(6 * Math.sin(a * Math.PI / 180)).toFixed(1)}" r="4.5" fill="#F4B6C2"/>`).join('')}<circle r="3.5" fill="#F3D27A"/></g>`;
    if (ac === 'bone') acess = `<path d="M-33 16 Q-30 -4 0 -4 Q30 -4 33 16 Z" fill="#55675B"/><path d="M8 14 Q34 12 44 18 Q30 22 8 20 Z" fill="#3F4D44"/>`;
    if (ac === 'brinco') acess = `<circle cx="-37" cy="44" r="3" fill="#E9C46A"/><circle cx="37" cy="44" r="3" fill="#E9C46A"/>`;
    const oculos = ac === 'oculos' ? `<g fill="none" stroke="#2B2B2B" stroke-width="2.4"><circle cx="-11" cy="33" r="8"/><circle cx="11" cy="33" r="8"/><path d="M-3 33 L3 33"/></g>` : '';

    // olhos
    const olhos = dorm
      ? `<path d="M-16 34 Q-11 38 -6 34 M6 34 Q11 38 16 34" stroke="#9FE3C2" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
      : `<g class="olhos"><ellipse cx="-11" cy="33" rx="4.2" ry="5.2" fill="#B8F5D8"/><ellipse cx="11" cy="33" rx="4.2" ry="5.2" fill="#B8F5D8"/><circle cx="-9.5" cy="31" r="1.4" fill="#fff"/><circle cx="12.5" cy="31" r="1.4" fill="#fff"/></g>`;
    const boca = dorm
      ? `<ellipse cx="0" cy="44" rx="3" ry="2" fill="#9FE3C2"/>`
      : `<path d="M-6 42 Q0 47 6 42" stroke="#B8F5D8" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;
    const faixa = aquec ? `<rect x="-35" y="17" width="70" height="7" rx="3.5" fill="#D7B5AB"/><rect x="-35" y="17" width="70" height="2.5" rx="1.2" fill="#fff" opacity=".5"/>` : '';
    const homem = robo.genero === 'm';

    return `<svg class="robo-svg" viewBox="-60 -26 120 170" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>
    <linearGradient id="${id}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
  </defs>
  <ellipse class="sombra" cx="0" cy="138" rx="30" ry="6" fill="#000" opacity=".18"/>
  <g class="corpo-todo">
    <g class="pernas"><rect x="-17" y="104" width="12" height="26" rx="6" fill="${c2}"/><rect x="5" y="104" width="12" height="26" rx="6" fill="${c2}"/>
      <rect x="-20" y="124" width="17" height="9" rx="4.5" fill="#3F4D44"/><rect x="3" y="124" width="17" height="9" rx="4.5" fill="#3F4D44"/></g>
    <g class="braco braco-e"><rect x="-40" y="66" width="12" height="32" rx="6" fill="${c2}"/><circle cx="-34" cy="99" r="6.5" fill="${c1}"/></g>
    <g class="braco braco-d"><rect x="28" y="66" width="12" height="32" rx="6" fill="${c2}"/><circle cx="34" cy="99" r="6.5" fill="${c1}"/></g>
    <rect x="-28" y="60" width="56" height="50" rx="16" fill="url(#${id}c)"/>
    <rect x="-28" y="60" width="56" height="22" rx="14" fill="url(#${id}h)"/>
    <rect x="-13" y="74" width="26" height="20" rx="6" fill="#26332B"/>
    <path class="coracao" d="M0 90 L-6 83.5 Q-8.5 79 -4 77.5 Q-1.5 77 0 79.5 Q1.5 77 4 77.5 Q8.5 79 6 83.5 Z" fill="#E7A1A9"/>
    ${homem ? '' : `<path d="M-28 100 Q0 116 28 100 L30 110 Q0 124 -30 110 Z" fill="${c2}" opacity=".9"/>`}
    <g class="cabeca">
      ${tras}
      <line x1="${st === 'coque' ? -16 : 0}" y1="2" x2="${st === 'coque' ? -22 : 0}" y2="-14" stroke="${c2}" stroke-width="3"/>
      <circle class="antena" cx="${st === 'coque' ? -22 : 0}" cy="-16" r="5" fill="#D7B5AB"/>
      <circle cx="-38" cy="32" r="6" fill="${c2}"/><circle cx="38" cy="32" r="6" fill="${c2}"/>
      <rect x="-35" y="6" width="70" height="56" rx="22" fill="url(#${id}c)"/>
      <rect x="-35" y="6" width="70" height="22" rx="18" fill="url(#${id}h)"/>
      <rect x="-26" y="20" width="52" height="32" rx="13" fill="#1F2A24"/>
      ${olhos}${boca}
      <circle cx="-21" cy="45" r="3.5" fill="#F2A7B0" opacity=".75"/><circle cx="21" cy="45" r="3.5" fill="#F2A7B0" opacity=".75"/>
      ${oculos}
      ${frente}${faixa}${acess}
    </g>
  </g>
</svg>`;
  }

  window.Robo = { svg, OPCOES, NOMES, CORES_CORPO, CORES_CABELO };
})();
