// Troca o texto para o nome do usuário logado e o link
document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(
    sessionStorage.getItem('usuarioLogado')
    )

    const perfilLogado = document.getElementById('perfilLogado')

    const linkPerfil = document.getElementById('linkPerfil')

    if (usuario) {
    perfilLogado.textContent = `Olá, ${usuario.nome}`
    }

    linkPerfil.href = '../pages/perfil.html'
})