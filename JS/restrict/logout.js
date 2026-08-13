document.getElementById('btnSair')?.addEventListener('click', () => { // so faz o click se o botao sair existir e o listener fica ouvindo os evento de ação de click e quando clicar vai executar a função

    const confirmar = confirm('Deseja realmente sair da conta?')

    if(!confirmar) {
        return
    }

    sessionStorage.removeItem('token') // desfaz o token jwt
    sessionStorage.removeItem('usuarioLogado') // remove os dados do user armazenado no browser

    window.location.href = '../index.html' //tira o user do painel e manda pro index dnv
})