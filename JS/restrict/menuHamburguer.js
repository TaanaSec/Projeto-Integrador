document.addEventListener('DOMContentLoaded', function() {
  const btnHamburguer = document.getElementById('btnHamburguer');
  const menuDropdown = document.getElementById('menuDropdown');
  const links = menuDropdown.querySelectorAll('a, button');

  // Toggle do menu ao clicar no botão hamburguer
  btnHamburguer.addEventListener('click', function(e) {
    e.stopPropagation();
    btnHamburguer.classList.toggle('ativo');
    menuDropdown.classList.toggle('ativo');
  });

  // Fechar menu ao clicar em um link
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      // Se for o botão sair, não fechar ainda (deixar o servidor fazer o redirect)
      if (this.id === 'btnSair') {
        // Aqui você pode adicionar lógica de logout
        // Por exemplo: window.location.href = '/logout';
        return;
      }

      btnHamburguer.classList.remove('ativo');
      menuDropdown.classList.remove('ativo');
    });
  });

  // Fechar menu ao clicar fora dele
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.menu-container')) {
      btnHamburguer.classList.remove('ativo');
      menuDropdown.classList.remove('ativo');
    }
  });

  // Fechar menu ao pressionar ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      btnHamburguer.classList.remove('ativo');
      menuDropdown.classList.remove('ativo');
    }
  });
});