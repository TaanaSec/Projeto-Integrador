document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(
    sessionStorage.getItem('usuarioLogado')
    )

    const perfilLogado = document.getElementById('perfilLogado')

    if (usuario) {
    perfilLogado.textContent = `Olá, ${usuario.nome}`
    }

})