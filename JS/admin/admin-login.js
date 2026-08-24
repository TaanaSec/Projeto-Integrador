function mostrarMensagemAdmin(texto, tipo = 'erro') {

    const mensagem = document.getElementById('mensagemAdmin');

    mensagem.textContent = texto;
    mensagem.className = `mensagem ${tipo}`;
}


document
    .getElementById('formLoginAdmin')
    .addEventListener('submit', async (evento) => {

        evento.preventDefault();


        const email = document
            .getElementById('emailAdmin')
            .value
            .trim()
            .toLowerCase();


        const senha = document
            .getElementById('senhaAdmin')
            .value;


        console.log('Email enviado:', email);
        console.log('Senha preenchida:', senha ? 'SIM' : 'NÃO');


        if (!email || !senha) {

            mostrarMensagemAdmin(
                'Preencha todos os campos!'
            );

            return;
        }


        try {

            const resposta = await fetch(
                'http://localhost:3000/api/admin/login',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        email: email,
                        senha: senha
                    })
                }
            );


            const dados = await resposta.json();

            console.log('Resposta do servidor:', dados);


            if (!resposta.ok) {

                mostrarMensagemAdmin(
                    dados.erro || 'Erro ao realizar login.'
                );

                return;
            }


            sessionStorage.setItem(
                'adminToken',
                dados.token
            );


            sessionStorage.setItem(
                'adminLogado',
                JSON.stringify(dados.administrador)
            );


            mostrarMensagemAdmin(
                'Login realizado com sucesso!',
                'sucesso'
            );


            setTimeout(() => {

                window.location.href =
                    '/pages/Restrito/restrict.html';

            }, 800);

        } catch (erro) {

            console.error(
                'Erro no login:',
                erro
            );

            mostrarMensagemAdmin(
                'Erro ao conectar com o servidor.'
            );
        }

    });