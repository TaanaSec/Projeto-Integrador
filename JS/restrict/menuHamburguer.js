function menuHamburguer() {
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