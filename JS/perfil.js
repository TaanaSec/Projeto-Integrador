const token = sessionStorage.getItem('token')

if (!token) {
    window.location.href = '../pages/login.html'
}

fetch('http://localhost:3000/perfil', {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${token}`
    }
})
.then(response => response.json())
.then(data => {
    document.getElementById('nomeUsuario').textContent = data.nome
})