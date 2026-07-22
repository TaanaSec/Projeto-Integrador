function mostrarMensagem(texto, tipo = 'erro') {
    const el = document.getElementById('mensagem')
    if (!el) return
    el.innerHTML = texto
    el.className = `mensagem ${tipo}`
}

document.getElementById('formLogin')?.addEventListener('submit', async (event) => {
    event.preventDefault()
    
    const email = document.getElementById('emailLogin').value
    const senha = document.getElementById('senhaLogin').value

    if (!email || !senha) {
        mostrarMensagem('Preencha todos os campos!')
        return
    }

    try {
        const response = await fetch ('http://localhost:3000/login', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        })

        const data = await response.json()

        if (!response.ok) {
            mostrarMensagem(data.erro)
            return
        }

        mostrarMensagem("Login realizado! Redirecionando...', 'sucesso")
        setTimeout(() => {window.location.href = '../index.html'}, 1500)
        
    } catch (error) {
        console.error(error)
        mostrarMensagem("Erro ao conectar com o servidor.")
    }
})