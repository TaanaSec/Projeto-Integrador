function mostrarMensagem(texto, tipo = 'erro') {
    const el = document.getElementById('mensagem')
    if (!el) return
    el.innerHTML = texto
    el.className = `mensagem ${tipo}`
}

document.getElementById('formCadastro')?.addEventListener('submit', async (event) => {
    event.preventDefault()

    const nome = document.getElementById('nomeCadastro').value
    const email = document.getElementById('emailCadastro').value
    const senha = document.getElementById('senhaCadastro').value
    const confirmarSenha = document.getElementById('confirmarSenha').value

    // Verifica se a senha possui, no mínimo, um de cada: caractere minúsculo, maiúsculo, especial, numérico e 8 caracteres 
    function verificarSenha(senha) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        return regex.test(senha)
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)


    // Valida se o usuário preencheu todos os campos
    if (!nome || !email || !senha || !confirmarSenha) {
        mostrarMensagem("Preencha todos os campos.")
        return
    }

    // Verifica se o formato do e-mail é válido
    if (!emailValido) {
        mostrarMensagem("Digite um e-mail válido.")
        return
    }

    // Valida se a senha e o confirSenha são identicos
    if (senha !== confirmarSenha) {
        mostrarMensagem("As senhas não coincidem.")
        return
    }

    // Valida as condições da senha
    if (!verificarSenha(senha)) {
        mostrarMensagem(
            "A senha precisa atender os seguintes requisitos: <br><br> A senha precisa ter no mínimo 8 caracteres <br> A senha precisa ter no mínimo um caractere especial <br> A senha precisa ter no mínimo um número <br> A senha precisa ter no mínimo um caractere maiúsculo ou minúsculo"
        )
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

        sessionStorage.setItem(
            'usuarioLogado',
            JSON.stringify({
                id: data._id,
                nome: data.nome,
                email: data.email
            })
        )

        if (response.ok) {
            mostrarMensagem("Cadastro realizado! Redirecionando...", "sucesso")
            setTimeout(() => window.location.href = '../index.html', 1500)
        }

    } catch (error) {
        console.error(error)
    }
})
