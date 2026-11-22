# Website ITPSS — protótipo estático (Rodasil)

Site institucional do Instituto Técnico Privado de Saúde do Sambizanga, em HTML, CSS e JavaScript, preparado para ser passado para WordPress secção a secção.

## Abrir o site

As páginas geradas estão na raiz: `index.html`, `sobre.html`, `cursos.html`, `admissoes.html`, `galeria.html`, `contactos.html`.
Para ver com os caminhos e imagens correctos, servir a pasta (por exemplo `npx http-server -p 5173 .`) e abrir `http://localhost:5173`.

## Estrutura

```
src/
  layout.html            esqueleto comum (head, SEO, fontes)
  partials/header.html   cabeçalho e menu
  partials/footer.html   rodapé + botão flutuante do WhatsApp
  sections/*.html        uma secção = um bloco "HTML Personalizado"
assets/
  css/tokens.css         cores, tipografia, espaçamentos
  css/base.css           botões, cabeçalho, rodapé, formulários, animações
  js/main.js             menu, cabeçalho, animações, formulários, WhatsApp
  img/                   fotografias optimizadas (WebP) e logótipo
tools/build.js           junta as secções e gera as páginas + pasta wordpress/
wordpress/               secções já resolvidas, global.css e manifest.json
img/                     fotografias originais (não usadas directamente)
```

**Editar sempre em `src/`** e depois correr:

```
node tools/build.js
```

Telefones, morada e nome da instituição estão num único sítio: o objecto `DADOS` em `tools/build.js`.
O número de WhatsApp está no topo de `assets/js/main.js` (`WHATSAPP`), actualmente o +244 946 372 802.

## Passar para o WordPress

1. Colar `wordpress/global.css` em Aparência → Personalizar → CSS Adicional.
2. Carregar `assets/js/main.js` no tema (ou num bloco HTML no rodapé do site).
3. Subir as imagens de `assets/img/` para a Biblioteca de Media e actualizar os caminhos.
4. Em cada página, colar as secções de `wordpress/sections/` pela ordem indicada em `wordpress/manifest.json`.
5. `00-cabecalho.html` e `99-rodape.html` vão para as partes do tema (cabeçalho/rodapé).
6. Substituir os formulários de Admissões e Contactos por Contact Form 7 ou WPForms com os mesmos campos.
7. Substituir o espaço reservado do mapa (`data-mapa-reservado`) por um `<iframe>` do Google Maps.

## O que ainda depende do cliente

- **Fotografia de Estomatologia**: a imagem actual é provisória (estudantes em aula). Falta uma foto das aulas de saúde oral.
- **Número oficial de WhatsApp**: confirmar qual dos dois telefones tem WhatsApp.
- **Redes sociais**: não foram fornecidas, por isso não aparecem no rodapé.
- **Localização exacta no Google Maps** para o mapa incorporado.
- Plano curricular, duração, certificação e datas de matrícula dos cursos: não publicados até haver confirmação.
- Os formulários não enviam dados: mostram um aviso e oferecem continuar pelo WhatsApp com o texto preenchido.
