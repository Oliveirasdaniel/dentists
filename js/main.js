/* =========================================================
   ✏️ CONFIGURAÇÃO — edite só aqui
   ========================================================= */
const CONFIG = {
  // WhatsApp com 55 + DDD + número, só dígitos. Ex.: '5521998765432'
  whatsapp: '5521997177049',
  // Mensagem que já aparece escrita quando o paciente abre o WhatsApp
  mensagem: 'Olá, Dra. Karen! Vim pelo site e gostaria de agendar uma avaliação.',
  // Instagram sem o @. Enquanto estiver vazio, os links de Instagram ficam escondidos.
  instagram: '',
  // Endereço do consultório, usado no mapa. Ex.: 'Rua Tal, 123 - Centro, São Gonçalo - RJ'
  endereco: 'São Gonçalo - RJ',
};

/* ========================================================= */

(function () {
  // --- Links de WhatsApp ---
  const numero = CONFIG.whatsapp.replace(/\D/g, '');
  const linkWhats = numero
    ? `https://wa.me/${numero}?text=${encodeURIComponent(CONFIG.mensagem)}`
    : '#contato';

  document.querySelectorAll('[data-whatsapp]').forEach((a) => {
    a.href = linkWhats;
    if (numero) {
      a.target = '_blank';
      a.rel = 'noopener';
    }
  });

  if (numero) {
    const local = numero.startsWith('55') ? numero.slice(2) : numero;
    const ddd = local.slice(0, 2);
    const resto = local.slice(2);
    const formatado = `(${ddd}) ${resto.slice(0, -4)}-${resto.slice(-4)}`;
    document.querySelectorAll('[data-whatsapp-texto]').forEach((el) => { el.textContent = formatado; });
  }

  // --- Instagram (esconde tudo enquanto não houver @) ---
  const insta = CONFIG.instagram.replace(/^@/, '').trim();
  if (insta) {
    document.querySelectorAll('[data-instagram]').forEach((a) => {
      a.href = `https://instagram.com/${insta}`;
      a.target = '_blank';
      a.rel = 'noopener';
    });
    document.querySelectorAll('[data-instagram-texto]').forEach((el) => { el.textContent = `@${insta}`; });
  } else {
    document.querySelectorAll('[data-instagram-item]').forEach((el) => el.remove());
  }

  // --- Mapa ---
  const endereco = encodeURIComponent(CONFIG.endereco);
  document.querySelectorAll('[data-mapa]').forEach((a) => {
    a.href = `https://www.google.com/maps/search/?api=1&query=${endereco}`;
  });
  document.querySelectorAll('[data-mapa-embed]').forEach((f) => {
    const src = `https://www.google.com/maps?q=${endereco}&output=embed`;
    if (f.src !== src) f.src = src;
  });

  // --- Ano no rodapé ---
  document.querySelectorAll('[data-ano]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // --- Topo com sombra ao rolar ---
  const topo = document.getElementById('topo');
  const aoRolar = () => topo.classList.toggle('rolou', window.scrollY > 8);
  aoRolar();
  window.addEventListener('scroll', aoRolar, { passive: true });

  // --- Menu mobile ---
  const botao = document.querySelector('.menu-botao');
  const menu = document.getElementById('menu');
  const fecharMenu = () => {
    menu.classList.remove('aberto');
    botao.setAttribute('aria-expanded', 'false');
    botao.setAttribute('aria-label', 'Abrir menu');
  };
  botao.addEventListener('click', () => {
    const abrir = !menu.classList.contains('aberto');
    menu.classList.toggle('aberto', abrir);
    botao.setAttribute('aria-expanded', String(abrir));
    botao.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', fecharMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('aberto')) {
      fecharMenu();
      botao.focus();
    }
  });
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('aberto') && !menu.contains(e.target) && !botao.contains(e.target)) fecharMenu();
  });

  // --- Link ativo no menu (no topo da página nenhum fica marcado) ---
  const links = [...menu.querySelectorAll('ul a')];
  const secoes = [document.getElementById('inicio'), ...links
    .map((a) => document.querySelector(a.getAttribute('href')))]
    .filter(Boolean);
  if ('IntersectionObserver' in window) {
    const obsMenu = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        const id = `#${entrada.target.id}`;
        links.forEach((a) => a.classList.toggle('ativo', a.getAttribute('href') === id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    secoes.forEach((s) => obsMenu.observe(s));
  }
})();
