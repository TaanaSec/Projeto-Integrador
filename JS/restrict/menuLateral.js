// Função que mostra ou esconde o menu quando chamada
function toggleMenu() { // "toggleMenu" é um nome escolhido pelo programador

  // Pega o elemento HTML com o ID "menu"
  const menuHamburguer = document.getElementById("menuHamburguer");

  menuHamburguer.addEventListener("click", function() {
    menuHamburguer.classList.toggle("ativo");
  });

  const links = menuHamburguer.querySelectorAll("a");
  links.forEach(link => {
    link.addEventListener("click", function(){
        menuHamburguer.classList.remove("ativo");
    })
  })

}