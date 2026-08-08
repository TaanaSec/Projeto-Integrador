async function carregarUsuarios() {
    
    try {
        const resposta = await fetch(
            'http://localhost:3000/api/usuarios/quantidade'
        )

        const dados = await resposta.json()

        document.getElementById('qtdUsuarios').textContent = dados.quantidade
    
    } catch (erro) {

        console.error('Erro ao carregar quantidade de usuários:', erro)
    }
}

carregarUsuarios()


//consulta de usuarios--------------------------------------------------------

async function carregarProdutos() {

    try {
        
        const resposta = await fetch(
            'http://localhost:3000/api/produtos/quantidade'
        )

        const dados = await resposta.json()

        document.getElementById('qtdProdutos').textContent = dados.quantidade
    
    } catch (erro) {

        console.error('Erro ao carregar quantidade de produtos', erro)
    } 
    
}

carregarProdutos()