function mostrarMensagem(texto, tipo = 'erro') {
    const el = document.getElementById('mensagem')
    if (!el) return
    el.textContent = texto
    el.className = `mensagem ${tipo}`
}

document.getElementById('formLogin')?.addEventListener('submit'), async (event) => {
    event.preventDefault()
    
    const email = document.getElementById('emailLogin').value
    const senha = document.getElementById('senhaLogin').value

    if (!email || !senha) {
        mostrarMensagem('Preencha todos os campos!')
        return
    }

    fetch ('http://localhost:3000/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
    })
    .then(res => {
        if (res.ok) {
            mostrarMensagem('Login realizado! Redirecionando...', 'sucesso')
            setTimeout(() => window.location.href = '../index.html', 1500)
        } else {
            mostrarMensagem('Credenciais inválidas.', 'erro')
        }
    })
    .catch (error => {
        console.error("Erro: ", error)
    })
}