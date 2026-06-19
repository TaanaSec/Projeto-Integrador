// Função que mostra ou esconde o menu quando chamada
function toggleMenu() { // "toggleMenu" é um nome escolhido pelo programador

  // Pega o elemento HTML com o ID "menu"
  const menu = document.getElementById("menu");

  // Verifica se o menu está visível (display igual a "block")
  if (menu.style.display === "block") {
    // Se estiver visível, esconde o menu
    menu.style.display = "none";
  } else {
    // Se estiver escondido, mostra o menu
    menu.style.display = "block";
  }
}