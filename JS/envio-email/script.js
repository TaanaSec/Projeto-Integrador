function mostrarMensagem(texto, tipo = 'erro') {
    const el = document.getElementById('mensagem')
    if (!el) return
    el.innerHTML = texto
    el.className = `mensagem ${tipo}`
}

document.getElementById('formCadastro')?.addEventListener('submit', async (event) => {
    event.preventDefault()
}