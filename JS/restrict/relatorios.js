
const formulario = document.getElementById('formularioRelatorio')

formulario.addEventListener('submit', async function(evento) {

    evento.preventDefault()

    const relatorio = {

        titulo: document.getElementById('tituloRelatorio').value,
        tipo: document.getElementById('tipoRelatorio').value,
        dataInicial: document.getElementById('dataInicial').value,
        dataFinal: document.getElementById('dataFinal').value,
        descricao: document.getElementById('descricaoRelatorio').value
    }

    try {

        const resposta = await fetch(
            'http://localhost:3000/api/relatorios',
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(relatorio)
            }
        )

        const dados = await resposta.json()

        if(resposta.ok) {

            alert('Relatório criado com sucesso!')
            formulario.reset()

        } else {

            alert(dados.erro)
        }

    } catch (erro) {

        console.error(erro)
        alert('Erro ao conectar com o servidor')
    }

})