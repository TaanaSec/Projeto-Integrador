const token = sessionStorage.getItem('token')

if (!token) {
    window.location.href = '../pages/login.html'
}

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