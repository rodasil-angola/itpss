/*
  ITPSS — Comportamentos globais
  ------------------------------------------------------------
  Cabeçalho, menu mobile, animações de entrada, botão flutuante
  de WhatsApp e validação dos formulários (modo demonstração).
  Tudo dentro de uma IIFE para não poluir o escopo global
  (necessário quando colado no WordPress ao lado de outros scripts).
*/
(function () {
  'use strict';

  /* Número usado nos links de WhatsApp (formato internacional, sem + nem espaços).
     Alterar aqui caso o WhatsApp oficial seja o segundo contacto. */
  var WHATSAPP = '244946372802';

  var doc = document.documentElement;
  doc.classList.add('rd-js');

  /* ---------- Cabeçalho ---------- */
  var header = document.querySelector('.rd-header');
  var ultimoY = window.scrollY;
  var aguardando = false;

  function atualizarHeader() {
    var y = window.scrollY;
    if (!header) return;
    header.classList.toggle('is-solid', y > 24);
    var aDescer = y > ultimoY && y > 420;
    if (!document.body.classList.contains('rd-menu-open')) header.classList.toggle('is-hidden', aDescer);
    ultimoY = y;
    /* Esconde o botão flutuante no fim da página para não tapar o rodapé */
    var noFim = y + window.innerHeight > document.documentElement.scrollHeight - 140;
    if (flutuante) flutuante.classList.toggle('is-visivel', y > 380 && !noFim);
    aguardando = false;
  }

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('.rd-header__toggle');
  function fecharMenu() {
    document.body.classList.remove('rd-menu-open');
    if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menu'); }
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      var aberto = document.body.classList.toggle('rd-menu-open');
      toggle.setAttribute('aria-expanded', String(aberto));
      toggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
      if (aberto && header) header.classList.remove('is-hidden');
    });
    document.querySelectorAll('.rd-nav a').forEach(function (a) { a.addEventListener('click', fecharMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharMenu(); });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (m) { if (m.matches) fecharMenu(); });
  }

  /* ---------- WhatsApp ---------- */
  var flutuante = document.querySelector('.rd-whats-float');
  function linkWhats(texto) {
    return 'https://wa.me/' + WHATSAPP + (texto ? '?text=' + encodeURIComponent(texto) : '');
  }
  document.querySelectorAll('[data-whats]').forEach(function (a) {
    a.href = linkWhats(a.getAttribute('data-whats') || 'Olá! Gostaria de obter informações sobre o ITPSS.');
    a.target = '_blank';
    a.rel = 'noopener';
  });

  window.addEventListener('scroll', function () {
    if (!aguardando) { aguardando = true; window.requestAnimationFrame(atualizarHeader); }
  }, { passive: true });
  atualizarHeader();

  /* ---------- Animações de entrada ---------- */
  var revelar = document.querySelectorAll('.rd-revela');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-visivel'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    revelar.forEach(function (el) { io.observe(el); });
  } else {
    revelar.forEach(function (el) { el.classList.add('is-visivel'); });
  }

  /* ---------- Curso pré-seleccionado via ?curso= ---------- */
  var params = new URLSearchParams(window.location.search);
  var cursoUrl = params.get('curso');
  if (cursoUrl) {
    document.querySelectorAll('select[name="curso"], select[name="assunto"]').forEach(function (s) {
      Array.prototype.forEach.call(s.options, function (o) {
        if (o.value.toLowerCase() === cursoUrl.toLowerCase()) s.value = o.value;
      });
    });
  }

  /* ---------- Formulários (demonstração) ---------- */
  var mensagens = {
    valueMissing: 'Este campo é obrigatório.',
    tel: 'Indique um número de telefone válido (ex.: 9XX XXX XXX).',
    curto: 'Escreva pelo menos o nome e o apelido.'
  };

  function validarCampo(campo) {
    var wrap = campo.closest('.rd-campo');
    var erro = wrap && wrap.querySelector('.rd-campo__erro');
    var msg = '';
    var valor = (campo.value || '').trim();
    if (campo.required && !valor) msg = mensagens.valueMissing;
    else if (campo.type === 'tel' && valor && !/^(\+?244)?\s?9\d{2}\s?\d{3}\s?\d{3}$/.test(valor.replace(/[.\-]/g, ' ').replace(/\s+/g, ' '))) msg = mensagens.tel;
    else if (campo.name === 'nome' && valor && valor.split(/\s+/).length < 2) msg = mensagens.curto;
    if (wrap) wrap.classList.toggle('is-invalido', !!msg);
    if (erro) erro.textContent = msg;
    campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  }

  document.querySelectorAll('form[data-rd-form]').forEach(function (form) {
    var campos = form.querySelectorAll('input, select, textarea');
    campos.forEach(function (c) {
      c.addEventListener('blur', function () { if (c.value) validarCampo(c); });
      c.addEventListener('input', function () { if (c.closest('.is-invalido')) validarCampo(c); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true;
      var primeiro = null;
      campos.forEach(function (c) {
        if (!validarCampo(c)) { ok = false; if (!primeiro) primeiro = c; }
      });
      var nota = form.querySelector('.rd-form__nota');
      if (!ok) { if (nota) nota.classList.remove('is-visivel'); primeiro.focus(); return; }

      /* Sem integração real: não simular envio. Mostrar aviso e oferecer
         continuar pelo WhatsApp com os dados já preenchidos. */
      var dados = new FormData(form);
      var linhas = ['Olá! Gostaria de obter informações sobre o ITPSS.'];
      if (dados.get('nome')) linhas.push('Nome: ' + dados.get('nome'));
      if (dados.get('telefone')) linhas.push('Telefone: ' + dados.get('telefone'));
      if (dados.get('curso')) linhas.push('Curso: ' + dados.get('curso'));
      if (dados.get('assunto')) linhas.push('Assunto: ' + dados.get('assunto'));
      if (dados.get('mensagem')) linhas.push('', String(dados.get('mensagem')));
      if (nota) {
        var botao = nota.querySelector('a');
        if (botao) { botao.href = linkWhats(linhas.join('\n')); botao.target = '_blank'; botao.rel = 'noopener'; }
        nota.classList.add('is-visivel');
        nota.focus();
      }
    });
  });

  /* ---------- Ano no rodapé ---------- */
  document.querySelectorAll('[data-ano]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
