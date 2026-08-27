// Troca o texto para o nome do usuário logado e o link
document.addEventListener('DOMContentLoaded', () => {
    const usuarioSalvo = sessionStorage.getItem('usuarioLogado')
    const usuario = usuarioSalvo ? JSON.parse(usuarioSalvo) : null

    const perfilLogado = document.getElementById('perfilLogado')

    const linkPerfil = document.getElementById('linkPerfil')

    if (usuario && perfilLogado) {
        perfilLogado.textContent = `Olá, ${usuario.nome}`
    }

    if (usuario && linkPerfil) {
        linkPerfil.href = '../pages/perfil.html'
    }
})

// Botão de deslogar
document.getElementById('btnLogout')?.addEventListener('click', () => {
    sessionStorage.clear()

    window.location.href = '../pages/login.html'
})
