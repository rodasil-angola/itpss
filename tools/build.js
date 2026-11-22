/*
  ITPSS — Montagem do site estático
  ------------------------------------------------------------
  Uso:  node tools/build.js

  Lê src/sections/*.html (uma secção = um bloco "HTML Personalizado"
  no WordPress), junta-as por página com o cabeçalho e o rodapé
  e gera:
    - index.html, sobre.html, cursos.html, admissoes.html,
      galeria.html, contactos.html   (site estático pronto a abrir)
    - wordpress/sections/*.html        (secções com ícones e dados já
                                        resolvidos, prontas a colar)
    - wordpress/global.css             (tokens.css + base.css)
    - wordpress/manifest.json          (ordem das secções por página)

  Para acrescentar um curso, editar src/sections/cursos-lista.html
  (e o cartão em src/sections/inicio-cursos.html) e voltar a correr
  este script.
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const ler = (p) => fs.readFileSync(path.join(SRC, p), 'utf8');

/* ---------- Dados da instituição (só informação fornecida pelo cliente) ---------- */
const DADOS = {
  nome: 'Instituto Técnico Privado de Saúde do Sambizanga',
  sigla: 'ITPSS',
  slogan: 'Formar o Homem para a Vida!',
  tel1: '+244 946 372 802',
  tel1_href: 'tel:+244946372802',
  tel2: '+244 950 363 560',
  tel2_href: 'tel:+244950363560',
  municipio: 'Município do Hoji Ya Henda',
  rua: 'Rua Eliseu Alves',
  referencia: 'Junto ao Hospital do Sambizanga (Ex-Escola da Paz)',
  cidade: 'Luanda, Angola',
  mapa_href: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Hospital do Sambizanga, Luanda, Angola'),
};

/* ---------- Ícones lineares (SVG inline, 24×24) ---------- */
const P = {
  seta: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  telefone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  coracao: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
  capelo: '<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/><path d="M22 10v6"/>',
  pessoas: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  livro: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  microscopio: '<path d="M6 18h8"/><path d="M3 22h18"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M9 14h2"/><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>',
  dente: '<path d="M7 3C4.8 3 3 4.8 3 7.2c0 2 .8 3.3 1.4 4.8.6 1.6.6 3.5 1 5.6.3 1.8.9 3.4 2 3.4 1.4 0 1.6-2.4 2-4.2.3-1.3.8-2.1 2.6-2.1s2.3.8 2.6 2.1c.4 1.8.6 4.2 2 4.2 1.1 0 1.7-1.6 2-3.4.4-2.1.4-4 1-5.6.6-1.5 1.4-2.8 1.4-4.8C21 4.8 19.2 3 17 3c-1.9 0-2.9 1-5 1S8.9 3 7 3Z"/>',
  capsula: '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
  reabilitacao: '<circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5.5 3-2.36 3.5"/><path d="M4.24 14.5a5 5 0 0 0 6.88 6"/><path d="M13.76 17.5a5 5 0 0 0-6.88-6"/>',
  maos: '<path d="M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16"/><path d="m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"/><path d="m2 15 6 6"/><path d="M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z"/>',
  menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h10"/>',
  fechar: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  mapa: '<path d="M14.1 6 9.9 4.2a2 2 0 0 0-1.7.1L3.6 6.6A1 1 0 0 0 3 7.5v12.3a1 1 0 0 0 1.4.9l4.3-2.2a2 2 0 0 1 1.7-.1l4.2 1.8a2 2 0 0 0 1.7-.1l4.6-2.3a1 1 0 0 0 .6-.9V4.2a1 1 0 0 0-1.4-.9l-4.3 2.2a2 2 0 0 1-1.7.1Z"/><path d="M15 5.8v15"/><path d="M9 3.2v15"/>',
  externo: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  esquerda: '<path d="m15 18-6-6 6-6"/>',
  direita: '<path d="m9 18 6-6-6-6"/>',
  ampliar: '<path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/>',
  estrela: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
  escudo: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
};
const WHATS = '<path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89 0-3.18-1.24-6.16-3.48-8.41Z"/>';

function icone(nome) {
  if (nome === 'whatsapp') return `<svg class="rd-icon rd-icon--fill" viewBox="0 0 24 24" aria-hidden="true">${WHATS}</svg>`;
  if (!P[nome]) throw new Error('Ícone desconhecido: ' + nome);
  const extra = nome === 'seta' ? ' rd-icon--seta' : '';
  return `<svg class="rd-icon${extra}" viewBox="0 0 24 24" aria-hidden="true">${P[nome]}</svg>`;
}

function resolver(html) {
  return html
    .replace(/\{\{icon:([a-z]+)\}\}/g, (_, n) => icone(n))
    .replace(/\{\{([a-z0-9_]+)\}\}/g, (m, k) => (k in DADOS ? DADOS[k] : m));
}

/* ---------- Páginas ---------- */
const PAGINAS = [
  {
    ficheiro: 'index.html', menu: 'inicio',
    titulo: 'ITPSS | Instituto Técnico Privado de Saúde do Sambizanga, Luanda',
    descricao: 'Formação técnica em Estomatologia, Farmácia e Fisioterapia no Instituto Técnico Privado de Saúde do Sambizanga, em Luanda. Formar o Homem para a Vida!',
    imagem: 'assets/img/hero.webp',
    seccoes: ['inicio-hero', 'inicio-sobre', 'inicio-cursos', 'inicio-porque', 'cta-admissoes', 'localizacao'],
  },
  {
    ficheiro: 'sobre.html', menu: 'sobre',
    titulo: 'Sobre Nós | ITPSS Luanda',
    descricao: 'Conheça o Instituto Técnico Privado de Saúde do Sambizanga, comprometido com a educação, a saúde e a preparação de profissionais qualificados em Luanda.',
    imagem: 'assets/img/sobre-campus.webp',
    seccoes: ['sobre-hero', 'sobre-apresentacao', 'sobre-compromisso', 'sobre-slogan', 'cta-admissoes'],
  },
  {
    ficheiro: 'cursos.html', menu: 'cursos',
    titulo: 'Cursos | Estomatologia, Farmácia e Fisioterapia | ITPSS',
    descricao: 'Cursos técnicos de saúde no ITPSS, em Luanda: Estomatologia, Farmácia e Fisioterapia. Solicite informações.',
    imagem: 'assets/img/curso-farmacia.webp',
    seccoes: ['cursos-hero', 'cursos-lista', 'cta-admissoes'],
  },
  {
    ficheiro: 'admissoes.html', menu: 'admissoes',
    titulo: 'Admissões | Pedido de Informações | ITPSS',
    descricao: 'Peça informações sobre admissões nos cursos técnicos de saúde do ITPSS, em Luanda. Contacte-nos por telefone ou WhatsApp.',
    imagem: 'assets/img/admissoes.webp',
    seccoes: ['admissoes-hero', 'admissoes-form'],
  },
  {
    ficheiro: 'galeria.html', menu: 'galeria',
    titulo: 'Galeria | Vida académica no ITPSS',
    descricao: 'Imagens das aulas práticas, laboratórios, estudantes e actividades académicas do Instituto Técnico Privado de Saúde do Sambizanga.',
    imagem: 'assets/img/galeria/g01.webp',
    seccoes: ['galeria-hero', 'galeria-grelha', 'cta-admissoes'],
  },
  {
    ficheiro: 'contactos.html', menu: 'contactos',
    titulo: 'Contactos | ITPSS, Hoji Ya Henda, Luanda',
    descricao: 'Morada, telefones e WhatsApp do ITPSS: Rua Eliseu Alves, Município do Hoji Ya Henda, junto ao Hospital do Sambizanga, Luanda.',
    imagem: 'assets/img/contactos.webp',
    seccoes: ['contactos-hero', 'contactos-info', 'contactos-mapa'],
  },
];

const MENU = [
  ['inicio', 'index.html', 'Início'],
  ['sobre', 'sobre.html', 'Sobre Nós'],
  ['cursos', 'cursos.html', 'Cursos'],
  ['admissoes', 'admissoes.html', 'Admissões'],
  ['galeria', 'galeria.html', 'Galeria'],
  ['contactos', 'contactos.html', 'Contactos'],
];

const JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: DADOS.nome,
  alternateName: DADOS.sigla,
  slogan: DADOS.slogan,
  logo: 'assets/img/logo-itpss.png',
  telephone: [DADOS.tel1, DADOS.tel2],
  address: {
    '@type': 'PostalAddress',
    streetAddress: `${DADOS.rua}, ${DADOS.referencia}`,
    addressLocality: 'Luanda',
    addressRegion: DADOS.municipio,
    addressCountry: 'AO',
  },
};

/* ---------- Montagem ---------- */
const layout = ler('layout.html');
const header = ler('partials/header.html');
const footer = ler('partials/footer.html');
const wpDir = path.join(ROOT, 'wordpress');
const wpSec = path.join(wpDir, 'sections');
fs.mkdirSync(wpSec, { recursive: true });

const manifest = { gerado: new Date().toISOString(), global_css: 'wordpress/global.css', partes_do_tema: ['00-cabecalho.html', '99-rodape.html'], paginas: [] };
const escritas = new Set();

for (const pg of PAGINAS) {
  const nav = MENU.map(([id, href, txt]) => `<li><a href="${href}"${id === pg.menu ? ' aria-current="page"' : ''}>${txt}</a></li>`).join('\n          ');
  const corpo = pg.seccoes.map((s) => `<!-- ===== Secção: ${s} ===== -->\n${ler('sections/' + s + '.html').trim()}`).join('\n\n');
  let html = layout
    .replace('{{header}}', header.replace('{{nav}}', nav))
    .replace('{{content}}', corpo)
    .replace('{{footer}}', footer)
    .replace(/\{\{titulo\}\}/g, pg.titulo)
    .replace(/\{\{descricao\}\}/g, pg.descricao)
    .replace(/\{\{imagem\}\}/g, pg.imagem)
    .replace('{{jsonld}}', JSON.stringify(JSONLD));
  fs.writeFileSync(path.join(ROOT, pg.ficheiro), resolver(html));

  const ordem = [];
  pg.seccoes.forEach((s) => {
    const nome = s + '.html';
    ordem.push({ arquivo: nome, tipo: 'estatica' });
    if (!escritas.has(s)) {
      fs.writeFileSync(path.join(wpSec, nome), resolver(ler('sections/' + s + '.html')));
      escritas.add(s);
    }
  });
  if (pg.ficheiro === 'admissoes.html' || pg.ficheiro === 'contactos.html') {
    ordem.push({ nota: 'Na integração WordPress, substituir o formulário demonstrativo por Contact Form 7 / WPForms com os mesmos campos.', tipo: 'nativa' });
  }
  manifest.paginas.push({ pagina: pg.ficheiro, titulo_seo: pg.titulo, descricao_seo: pg.descricao, ordem });
}

fs.writeFileSync(path.join(wpSec, '00-cabecalho.html'), resolver(header.replace('{{nav}}', MENU.map(([, h, t]) => `<li><a href="${h}">${t}</a></li>`).join('\n          '))));
fs.writeFileSync(path.join(wpSec, '99-rodape.html'), resolver(footer));
fs.writeFileSync(path.join(wpDir, 'global.css'),
  fs.readFileSync(path.join(ROOT, 'assets/css/tokens.css'), 'utf8') + '\n' + fs.readFileSync(path.join(ROOT, 'assets/css/base.css'), 'utf8'));
fs.writeFileSync(path.join(wpDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

const sobras = (s) => (s.match(/\{\{[^}]+\}\}/g) || []);
for (const pg of PAGINAS) {
  const r = sobras(fs.readFileSync(path.join(ROOT, pg.ficheiro), 'utf8'));
  if (r.length) console.warn('Marcadores por resolver em', pg.ficheiro, r);
}
console.log('Gerado:', PAGINAS.map((p) => p.ficheiro).join(', '), '+ wordpress/');
