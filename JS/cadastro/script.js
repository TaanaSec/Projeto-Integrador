function mostrarMensagem(texto, tipo = 'erro') {
    const el = document.getElementById('mensagem')
    if (!el) return
    el.textContent = texto
    el.className = `mensagem ${tipo}`
}

document.getElementById('formCadastro')?.addEventListener('submit', async (event) => {
    event.preventDefault()

    const nome = document.getElementById('nomeCadastro').value
    const email = document.getElementById('emailCadastro').value
    const senha = document.getElementById('senhaCadastro').value
    const confirmarSenha = document.getElementById('confirmarSenha').value


    // Valida se o usuário preencheu todos os campos
    if (!nome || !email || !senha || !confirmarSenha) {
        mostrarMensagem('Preencha todos os campos.')
        return
    }

    // Valida se a senha e o confirSenha são identicos
    if (senha !== confirmarSenha) {
        mostrarMensagem('As senhas não coincidem.')
        return
    }


    // Salvar o registro do usuário no db
    try {
        const response = await fetch('http://localhost:3000/cadastro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha })
        })

        const data = await response.json()

        if (!response.ok) {
            mostrarMensagem(data.erro)
            return
        }

        if (response.ok) {
            mostrarMensagem('Cadastro realizado! Redirecionando...', 'sucesso')
            setTimeout(() => window.location.href = '../index.html', 1500)
        }

    } catch (error) {
        console.error(error)
    }
})
