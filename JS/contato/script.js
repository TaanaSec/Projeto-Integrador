const token = sessionStorage.getItem('token')

function mostrarMensagem(texto, tipo = 'erro') {
    const el = document.getElementById('mensagem')
    if (!el) return
    el.innerHTML = texto
    el.className = `mensagem ${tipo}`
}

// Verifica o token
if (!token) {
    window.location.href = '../pages/login.html'
}


// Usuário acessa a página
fetch('http://localhost:3000/contato', {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${token}`
    }
})
.then(response => {
    if (response.status === 401) {
        sessionStorage.clear()
        window.location.href = '../pages/login.html'
        return
    }

    return response.json()
})
.then(data => {
    document.getElementById('nomeUsuario').textContent = data.nome
    document.getElementById('emailUsuario').textContent = data.email
})


// Função de enviar o e-mail
function enviarEmail() {
    const tituloEmail = document.getElementById('tituloEmail').value
    const assuntoEmail = document.getElementById('assuntoEmail').value

    if (!tituloEmail || !assuntoEmail) {
        mostrarMensagem("Por favor, preencha todos os campos.", 'erro')
        return
    }

    fetch ('http://localhost:3000/contato', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}}`
        },
        body: JSON.stringify({ tituloEmail, assuntoEmail })
    })
    .then(res => {
        if (res.ok) {
            mostrarMensagem("Email enviado com sucesso!", 'sucesso')
        }
    })
    .catch (error => {
        console.error("Erro ao enviar email:", error)
        mostrarMensagem("Erro ao enviar email.", 'erro')
    })
}
